const express = require('express');
const { getChats, initiateChat, getMessages, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getChats)
    .post(initiateChat);

router.route('/:id/messages')
    .get(getMessages)
    .post(sendMessage);

module.exports = router;
