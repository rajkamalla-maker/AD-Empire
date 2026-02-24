const express = require('express');
const router = express.Router();

// Placeholder routes to prevent server crash
const sendPlaceholder = (req, res) => res.json({ success: true, message: 'Endpoint under development', data: [] });

router.get('/', sendPlaceholder);
router.post('/', sendPlaceholder);
router.put('/:id', sendPlaceholder);
router.delete('/:id', sendPlaceholder);
router.get('/:id', sendPlaceholder);

module.exports = router;
