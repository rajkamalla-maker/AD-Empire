const Category = require('../models/Category');
const { paginate } = require('../utils/paginate');

// @desc    Get all categories (hierarchical)
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({ parent: null, isActive: true })
            .populate({
                path: 'children',
                match: { isActive: true },
                select: 'name slug icon sortOrder',
                options: { sort: { sortOrder: 1 } }
            })
            .sort({ sortOrder: 1 });

        res.json({ success: true, count: categories.length, data: categories });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single category by slug or id
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = async (req, res, next) => {
    try {
        const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
            ? { _id: req.params.id }
            : { slug: req.params.id };

        const category = await Category.findOne(query).populate('children', 'name slug icon');
        if (!category || !category.isActive) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Admin
exports.createCategory = async (req, res, next) => {
    try {
        if (req.file) {
            req.body.image = { url: req.file.path, publicId: req.file.filename };
        }
        const category = await Category.create(req.body);

        if (req.body.parent) {
            await Category.findByIdAndUpdate(req.body.parent, {
                $push: { children: category._id }
            });
        }

        res.status(201).json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Admin
exports.updateCategory = async (req, res, next) => {
    try {
        let category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

        if (req.file) {
            const { cloudinary } = require('../config/cloudinary');
            if (category.image && category.image.publicId) {
                await cloudinary.uploader.destroy(category.image.publicId);
            }
            req.body.image = { url: req.file.path, publicId: req.file.filename };
        }

        category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Super Admin
exports.deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

        if (category.children.length > 0) {
            return res.status(400).json({ success: false, message: 'Cannot delete category with sub-categories. Delete them first.' });
        }

        if (category.image && category.image.publicId) {
            const { cloudinary } = require('../config/cloudinary');
            await cloudinary.uploader.destroy(category.image.publicId);
        }

        // Remove from parent
        if (category.parent) {
            await Category.findByIdAndUpdate(category.parent, { $pull: { children: category._id } });
        }

        await Category.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
        next(error);
    }
};
