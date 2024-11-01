import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

type User = {
  email: string;
  firstName: string;
  lastName: string;
};
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST as string,
  port: parseInt(process.env.SMTP_PORT as string, 10),
  auth: {
    user: process.env.SMTP_USER as string,
    pass: process.env.SMTP_PASS as string,
  },
} as SMTPTransport.Options);

const sendEmail = async (emailFormat: SMTPTransport.Options) => {
  try {
    const result = await transporter.sendMail(emailFormat);
  } catch (error) {
    console.log("Email error:", error);
  }
};

export const sendVerificationLinkEmail = (
  user: User,
  verificationUrl: string
) => {
  //   console.log(user);
  const { email, firstName, lastName } = user;

  const emailFormat: SMTPTransport.Options = {
    from: `Penny Pilot<${process.env.SMTP_USER}>`,
    to: email,
    subject: "Email Verification For Your Account",
    html: `
    <table style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; border-collapse: collapse;">
        <tr>
            <td style="text-align: center;">
                <h1>Account Verification</h1>
            </td>
        </tr>
        <tr>
            <td>
                <p>Dear ${firstName + " " + lastName},</p>
                <p>Thank you for signing up with us. To complete your registration, please click the link below to verify your email address:</p>
                <p><a href="${verificationUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none;">Verify Email</a></p>
                <p>If you did not sign up for an account, please ignore this email.</p>
                <p>Thank you,<br> Penny Pilot</p>
            </td>
        </tr>
    </table>
    `,
  };
  sendEmail(emailFormat);
};

export const sendAccountVerifiedEmail = (user: User, loginUrl: string) => {
  const { email, firstName, lastName } = user;

  const emailFormat: SMTPTransport.Options = {
    from: `Penny Pilot<${process.env.SMTP_USER}>`,
    to: email,
    subject: "Account Verified",
    html: `
    <table style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; border-collapse: collapse;">
        <tr>
            <td style="text-align: center;">
                <h1>Account Verified</h1>
            </td>
        </tr>
        <tr>
            <td>
                <p>Dear ${firstName + " " + lastName},</p>
                <p>Your account has been successfully verified. You can now login to our application using the button below:</p>
                <p><a href="${loginUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none;">Login Now</a></p>
                <p>If you did not verify your account, please ignore this email.</p>
                <p>Thank you,<br> Penny Pilot</p>
            </td>
        </tr>
    </table>
    `,
  };

  sendEmail(emailFormat);
};

export const sendResetPasswordEmail = (user: User, resetUrl: string) => {
  const { email, firstName, lastName } = user;

  const emailFormat: SMTPTransport.Options = {
    from: `Penny Pilot<${process.env.SMTP_USER}>`,
    to: email,
    subject: "Password Reset",
    html: `
    <table style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; border-collapse: collapse;">
        <tr>
            <td style="text-align: center;">
                <h1>Password Reset</h1>
            </td>
        </tr>
        <tr>
            <td>
                <p>Dear ${firstName + " " + lastName},</p>
                <p>Please click the below link to reset your password. </p>
                <p><a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none;">Reset Password</a></p>
                <p>If you did not verify your account, please ignore this email.</p>
                <p>Thank you,<br> Penny Pilot</p>
            </td>
        </tr>
    </table>
    `,
  };

  sendEmail(emailFormat);
};

export const sendPasswordChanged = (user: User, loginURL: string) => {
  const { email, firstName, lastName } = user;

  const emailFormat = {
    from: `Penny Pilot<${process.env.SMTP_USER}>`,
    to: email,
    subject: "Password Reset Successfully",
    html: `
    <table style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; border-collapse: collapse;">
        <tr>
            <td style="text-align: center;">
                <h1>Password Reset Successfully</h1>
            </td>
        </tr>
        <tr>
            <td>
                <p>Dear ${firstName + " " + lastName},</p>
                <p>Your password was changed successfully. </p>
                <p><a href="${loginURL}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none;">Login Now</a></p>
                <p>If you did not made this change please contact administrator immediately.</p>
                <p>Thank you,<br> Penny Pilot</p>
            </td>
        </tr>
    </table>
    `,
  };

  sendEmail(emailFormat);
};
