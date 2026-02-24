const Chat = require('../models/Chat');
const Post = require('../models/Post');
const { createNotification } = require('../utils/notifications');

// @desc    Get all active chats for user
// @route   GET /api/chat
// @access  Private
exports.getChats = async (req, res, next) => {
    try {
        const chats = await Chat.find({
            participants: req.user._id,
            isActive: true
        })
            .populate('participants', 'fullName avatar isOnline lastActive')
            .populate('post', 'title images price type slug status')
            .sort({ 'lastMessage.sentAt': -1 });

        res.json({ success: true, count: chats.length, data: chats });
    } catch (error) {
        next(error);
    }
};

// @desc    Initiate or get chat with someone
// @route   POST /api/chat
// @access  Private
exports.initiateChat = async (req, res, next) => {
    try {
        const { receiverId, postId } = req.body;

        if (receiverId === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: 'Cannot chat with yourself' });
        }

        // Check if chat already exists for this post and participants
        let chat = await Chat.findOne({
            participants: { $all: [req.user._id, receiverId] },
            post: postId,
        }).populate('participants', 'fullName avatar').populate('post', 'title images price type slug status');

        if (!chat) {
            chat = await Chat.create({
                participants: [req.user._id, receiverId],
                post: postId,
                unreadCount: {
                    [req.user._id]: 0,
                    [receiverId]: 0
                }
            });
            chat = await Chat.findById(chat._id)
                .populate('participants', 'fullName avatar')
                .populate('post', 'title images price type');

            // Notify receiver about new chat
            await createNotification({
                recipientId: receiverId,
                senderId: req.user._id,
                type: 'new_message',
                title: 'New Chat Request',
                message: `${req.user.fullName} started a chat with you.`,
                link: `/chat/${chat._id}`,
                io: req.io,
            });
        }

        res.status(200).json({ success: true, data: chat });
    } catch (error) {
        next(error);
    }
};

// @desc    Get chat messages
// @route   GET /api/chat/:id/messages
// @access  Private
exports.getMessages = async (req, res, next) => {
    try {
        const chat = await Chat.findOne({
            _id: req.params.id,
            participants: req.user._id
        });

        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }

        // Reset unread count for this user
        chat.unreadCount.set(req.user._id.toString(), 0);

        // Mark messages as read
        chat.messages.forEach(msg => {
            if (msg.sender.toString() !== req.user._id.toString() && !msg.isRead) {
                msg.isRead = true;
                msg.readAt = Date.now();
            }
        });

        await chat.save();

        res.json({ success: true, data: chat.messages });
    } catch (error) {
        next(error);
    }
};

// @desc    Send a message
// @route   POST /api/chat/:id/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
    try {
        const { content, type = 'text' } = req.body;
        const chatId = req.params.id;

        const chat = await Chat.findOne({ _id: chatId, participants: req.user._id });
        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }

        const newMessage = {
            sender: req.user._id,
            content,
            type
        };

        if (req.file) {
            const { cloudinary } = require('../config/cloudinary');
            // For a real app, handle image uploads
        }

        chat.messages.push(newMessage);

        const receiverId = chat.participants.find(p => p.toString() !== req.user._id.toString());

        chat.lastMessage = {
            content,
            sender: req.user._id,
            sentAt: Date.now()
        };

        const currentUnread = chat.unreadCount.get(receiverId.toString()) || 0;
        chat.unreadCount.set(receiverId.toString(), currentUnread + 1);

        await chat.save();

        // Emit via socket
        if (req.io) {
            req.io.to(`chat_${chatId}`).emit('new_message', {
                message: chat.messages[chat.messages.length - 1],
                chatId
            });

            // Also notify receiver if they are not in the chat room
            req.io.to(`user_${receiverId}`).emit('notification', {
                type: 'new_message',
                title: 'New Message',
                message: `${req.user.fullName}: ${content.substring(0, 30)}...`,
                link: `/chat/${chatId}`
            });
        }

        res.status(201).json({ success: true, data: chat.messages[chat.messages.length - 1] });
    } catch (error) {
        next(error);
    }
};
