/**
 * Pagination helper
 * @param {Model} model - Mongoose model
 * @param {Object} filter - Query filter
 * @param {Object} options - { page, limit, sort, populate, select }
 */
const paginate = async (model, filter = {}, options = {}) => {
    const page = parseInt(options.page) || 1;
    const limit = Math.min(parseInt(options.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const sort = options.sort || { createdAt: -1 };
    let query = model.find(filter).sort(sort).skip(skip).limit(limit);

    if (options.populate) {
        const pops = Array.isArray(options.populate) ? options.populate : [options.populate];
        pops.forEach(p => { query = query.populate(p); });
    }
    if (options.select) query = query.select(options.select);

    const [data, total] = await Promise.all([query.exec(), model.countDocuments(filter)]);

    return {
        data,
        pagination: {
            total,
            page,
            pages: Math.ceil(total / limit),
            limit,
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1,
        },
    };
};

module.exports = { paginate };
