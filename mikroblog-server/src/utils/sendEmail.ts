import nodemailer from "nodemailer"


export async function sendEmail(to: string, html: string) {

  const testAccount = await nodemailer.createTestAccount();

  console.log("testAccount", testAccount)

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: 'jayden70@ethereal.email',
      pass: 'DpWCvmbPbY6HUjMH29'
    }
  });

  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: to, // list of receivers
    subject: "Change password", 
    html
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Message sent: %s", nodemailer.getTestMessageUrl(info));

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //
}

