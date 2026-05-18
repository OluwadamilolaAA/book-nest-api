type ForgotPasswordParams = {
  name: string;
  resetUrl: string;
};

const forgotPasswordTemplate = ({ name, resetUrl }: ForgotPasswordParams) => {
  return `
    <h2>Hello ${name}</h2>

    <p>You requested to reset your password.</p>

    <a 
      href="${resetUrl}" 
      style="background:#000;color:#fff;padding:10px 15px;text-decoration:none;border-radius:5px;"
    >
      Reset Password
    </a>

    <p>This link will expire in 10 minutes.</p>

    <p>If you did not request this, please ignore this email.</p>
  `;
};

export default forgotPasswordTemplate;