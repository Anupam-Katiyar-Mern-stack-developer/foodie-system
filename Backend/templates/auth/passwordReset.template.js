export const passwordResetTemplate = ({ resetUrl }) => {
  const subject = "Reset your Foodie password";

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;">
      <h2 style="margin-bottom:16px;">Reset your password</h2>

      <p style="font-size:15px;line-height:1.6;color:#444;">
        We received a request to reset your Foodie account password.
      </p>

      <p style="font-size:15px;line-height:1.6;color:#444;">
        Click the button below to create a new password.
      </p>

      <div style="margin:28px 0;">
        <a
          href="${resetUrl}"
          style="
            display:inline-block;
            padding:12px 22px;
            background:#f97316;
            color:#ffffff;
            text-decoration:none;
            border-radius:8px;
            font-weight:700;
          "
        >
          Reset Password
        </a>
      </div>

      <p style="font-size:14px;color:#666;">
        This link will expire in 30 minutes.
      </p>

      <p style="font-size:14px;color:#666;">
        If you did not request a password reset, you can safely ignore this email.
      </p>

      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />

      <p style="font-size:12px;color:#999;">
        Foodie Security Team
      </p>
    </div>
  `;

  const text = `
Reset your Foodie password

Open the link below to reset your password:

${resetUrl}

This link will expire in 30 minutes.

If you did not request this password reset, ignore this email.
  `;

  return {
    subject,
    html,
    text,
  };
};
