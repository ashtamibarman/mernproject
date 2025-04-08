const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

function createTransporter(config) {
  const transporter = nodemailer.createTransport(config);
  return transporter;
}

let configuration = {
  service: "gamil",
  host: "smtp.gmail.com",
  port: 587,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
};

const sendMail = async (messageOption) => {
  const transporter = await createTransporter(configuration);
  await transporter.verify();
  await transporter.sendMail(messageOption, (error, info) => {
    if (error) {
      console.log(error);
    }
    console.log(info.response);
  });
};
