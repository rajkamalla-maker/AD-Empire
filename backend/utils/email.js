const nodemailer = require('nodemailer');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

const sendEmail = async ({ to, subject, html, text }) => {
    try {
        await transporter.sendMail({
            from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
            to,
            subject,
            html,
            text,
        });
        logger.info(`Email sent to ${to}: ${subject}`);
    } catch (error) {
        logger.error(`Email send failed to ${to}: ${error.message}`);
        throw error;
    }
};

// Email templates
exports.sendVerificationEmail = async (user, token) => {
    const url = `${process.env.CLIENT_URL}/verify-email/${token}`;
    await sendEmail({
        to: user.email,
        subject: 'Verify Your Email — Marketplace',
        html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8f9fa;border-radius:10px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#0F5E9C,#1a8cdf);padding:30px;text-align:center">
          <h1 style="color:white;margin:0;font-size:28px">Marketplace</h1>
          <p style="color:rgba(255,255,255,0.85);margin:5px 0 0">Premium Location-Based Platform</p>
        </div>
        <div style="padding:40px;background:white">
          <h2 style="color:#333;margin-bottom:10px">Hello, ${user.fullName}!</h2>
          <p style="color:#666;line-height:1.6">Thank you for registering. Please verify your email address to get started.</p>
          <div style="text-align:center;margin:30px 0">
            <a href="${url}" style="background:linear-gradient(135deg,#0F5E9C,#1a8cdf);color:white;padding:14px 36px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:bold;display:inline-block">
              Verify Email Address
            </a>
          </div>
          <p style="color:#999;font-size:13px">This link will expire in 24 hours. If you didn't create this account, please ignore this email.</p>
        </div>
        <div style="background:#f8f9fa;padding:20px;text-align:center">
          <p style="color:#999;font-size:12px;margin:0">© 2026 Marketplace. All rights reserved.</p>
        </div>
      </div>
    `,
    });
};

exports.sendResetPasswordEmail = async (user, token) => {
    const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
    await sendEmail({
        to: user.email,
        subject: 'Reset Your Password — Marketplace',
        html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#0F5E9C,#1a8cdf);padding:30px;text-align:center;border-radius:10px 10px 0 0">
          <h1 style="color:white;margin:0">Password Reset</h1>
        </div>
        <div style="padding:40px;background:white;border-radius:0 0 10px 10px">
          <p style="color:#666">Hi ${user.fullName}, click the button below to reset your password. This link expires in 30 minutes.</p>
          <div style="text-align:center;margin:30px 0">
            <a href="${url}" style="background:#0F5E9C;color:white;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">Reset Password</a>
          </div>
        </div>
      </div>
    `,
    });
};

exports.sendApprovalEmail = async (user) => {
    await sendEmail({
        to: user.email,
        subject: 'Account Approved — Marketplace',
        html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#0F5E9C,#1a8cdf);padding:30px;text-align:center;border-radius:10px 10px 0 0">
          <h1 style="color:white;margin:0">🎉 Account Approved!</h1>
        </div>
        <div style="padding:40px;background:white;border-radius:0 0 10px 10px">
          <p style="color:#666">Congratulations ${user.fullName}! Your account has been approved. You can now post ads and access all features.</p>
          <div style="text-align:center;margin:30px 0">
            <a href="${process.env.CLIENT_URL}/login" style="background:#0F5E9C;color:white;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">Login Now</a>
          </div>
        </div>
      </div>
    `,
    });
};

exports.sendPostApprovalEmail = async (user, post) => {
    await sendEmail({
        to: user.email,
        subject: `Your Ad "${post.title}" is Live! — Marketplace`,
        html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#0F5E9C,#1a8cdf);padding:30px;text-align:center;border-radius:10px 10px 0 0">
          <h1 style="color:white;margin:0">✅ Ad Approved!</h1>
        </div>
        <div style="padding:40px;background:white;border-radius:0 0 10px 10px">
          <p style="color:#666">Hi ${user.fullName}, your ad "<strong>${post.title}</strong>" has been approved and is now live.</p>
          <div style="text-align:center;margin:30px 0">
            <a href="${process.env.CLIENT_URL}/post/${post.slug}" style="background:#0F5E9C;color:white;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">View Your Ad</a>
          </div>
        </div>
      </div>
    `,
    });
};
