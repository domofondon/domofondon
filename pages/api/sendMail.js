import nodemailer from 'nodemailer';

export default (req, res) => {
  const transporter = nodemailer.createTransport({
    port: 465,
    host: 'smtp.yandex.ru',
    auth: {
      user: process.env.NEXT_PUBLIC_EMAIL_SOURCE,
      pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
    },
    secure: true,
  });

  const { service = '', fields = [] } = req.body;

  const html = `
    <h2>${service}</h2>
    ${fields.map(({ label, value }) => `<p>${label}: ${value || '___'}</p>`).join('')}
  `;

  const mailData = {
    from: process.env.NEXT_PUBLIC_EMAIL_SOURCE,
    to: process.env.NEXT_PUBLIC_EMAIL_DEST,
    subject: `Сообщение с сайта Домофондон, от ${
      fields.find((el) => el.field === 'phone').value || ''
    }`,
    html,
  };

  transporter.sendMail(mailData, (err, info) => {
    if (err) { 
      console.log('sendMail error', err);
      res.status(err.responseCode).send(err.message);
    } else { 
      console.log('sendMail info', info);
      res.status(200).send('success');
    }
  });
};
