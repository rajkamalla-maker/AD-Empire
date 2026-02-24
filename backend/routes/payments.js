const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All payment routes are protected

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);

module.exports = router;
