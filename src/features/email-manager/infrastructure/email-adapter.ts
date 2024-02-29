import nodemailer from 'nodemailer';

export const emailAdapter = {
  async sendEmail(
    email: string,
    subject?: string,
    message?: string,
    html?: string,
  ) {
    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.USERSMTP,
        pass: process.env.PASSSMTP,
      },
    });

    const info = await transport.sendMail({
      from: '"Alexey"<bgr666@gmail.com>',
      to: email,
      subject: subject,
      text: message,
      html: html,
    });

    return info;
  },
};
