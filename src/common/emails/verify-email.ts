type VerifyEmailParams = {
  name: string;
  verifyEmailUrl: string;
};

const verifyEmailTemplate = ({ name, verifyEmailUrl }: VerifyEmailParams) => {
  return `
    <h2>Welcome to BookNest, ${name}</h2>

    <p>Please verify your email address by clicking the button below:</p>

    <a 
      href="${verifyEmailUrl}" 
      style="background:#000;color:#fff;padding:10px 15px;text-decoration:none;border-radius:5px;"
    >
      Verify Email
    </a>

    <p>If the button does not work, copy this link:</p>
    <p>${verifyEmailUrl}</p>
  `;
};

export default verifyEmailTemplate;