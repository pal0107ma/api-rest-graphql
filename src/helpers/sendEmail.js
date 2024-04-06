import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const sendEmail = async ({ htmlParams = {}, to = "", subject = "" } = {}) => {
  // DEFINE HTML AND TEXT

  const { text, html } = defineHtmlText(htmlParams);

  // DEFINE TRANSPORTER

  const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST || "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  // SEND EMAIL

  const info = await transporter.sendMail({
    from: `"Auth Service" <${process.env.NODEMAILER_USER}>`, // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html,
  });

  console.log("Message sent: %s", info.messageId);
};

function defineHtmlText(htmlParams) {
  const htmlTemplatePath = path.resolve(
    path.join(__dirname, "../templates/email-template.html")
  );
  let html = fs.readFileSync(htmlTemplatePath, { encoding: "utf-8" });

  let text = "";

  const position = html.indexOf("<body>");

  while (
    html.indexOf("[[", position) !== -1 &&
    html.indexOf("]]", position) !== -1
  ) {
    const bracketStart = html.indexOf("[[", position);
    const bracketEnd = html.indexOf("]]", position);

    const sliceStart = html.slice(0, bracketStart);
    const key = html.slice(bracketStart + 2, bracketEnd);
    const sliceEnd = html.slice(bracketEnd + 2);

    html = [sliceStart, htmlParams[key], sliceEnd].join("");

    if (key !== "HREF") text += htmlParams[key] + " ";
  }

  return { html, text };
}

export default sendEmail;
