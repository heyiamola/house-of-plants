const nodemailer = require("nodemailer");
require("dotenv").config();

const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const welcomeMessage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome email</title>
  <link rel="preconnect" href="https://fonts.gstatic.com">
   <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500&display=swap"
      rel="stylesheet">
  <style>

body {
  margin: 0;
  padding: 0;
  font-size: 12px;
  font-family: Montserrat;
  text-align: center;
  min-height: 100vh;
}

div > * {
  padding: 5px 0;
}

div {
  margin: 20px;
  line-height: 1.5em;
}

h2 {
  text-decoration: underline #6b824a;
  text-decoration-thickness: 5px;
}

a {
  text-decoration: none;
  color: inherit;
}

p {
  padding: 0 25px;
}

footer {
  height: 35px;
  background-color: #6b824a;
  color: white;
  font-size: smaller;
  text-align: center;
  text-underline-offset: 2px;
  width: 100vw;
}

footer a {
  text-decoration: underline;
}

footer p {
  padding: 7px 0;
}

button {
  background-color: #6b824a;
  border-style: none;
  border-radius: 5px;
  padding: 7px;
  margin: 10px 0;
  color: white;
}
  </style>
</head>
<body>
  <div>
    <h2>Welcome to House of Plants</h2>
    <p>Your account has been created. So excited to have you here!<br><br>House of Plants is a place where you can swap plants, seedlings and more, catch up with other plant lovers in your area, find plant care advice, get inspiration and much more.<br><br>Go to the site and take your urban jungle to another level.</p>
    <button><a href="https://houseofplants.herokuapp.com/">Go to plants</a></button>
    <p>Have a great day,<br><i>Frankie & Ola</i></p>
  </div>
  <footer>
       <p> Made with ☀️ and 💧 by <a href="https://github.com/yelsre">Frankie</a> and <a
             href="https://github.com/ollayka">Ola</a></p>
 </footer>
</body>
</html>`;

const newsletterMessage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newsletter sign-up</title>
  <link rel="preconnect" href="https://fonts.gstatic.com">
   <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500&display=swap"
      rel="stylesheet">
  <style>

body {
  margin: 0;
  padding: 0;
  font-size: 12px;
  font-family: Montserrat;
  text-align: center;
}

div > * {
  padding: 5px 0;
}

div {
  margin: 20px;
  line-height: 1.5em;
}

h2 {
  text-decoration: underline #6b824a;
  text-decoration-thickness: 5px;
}

a {
  text-decoration: none;
  color: inherit;
}

p {
  padding: 0 25px;
}

footer {
  height: 30px;
  background-color: #6b824a;
  color: white;
  font-size: smaller;
  text-align: center;
  text-underline-offset: 2px;
}

footer p {
  padding: 5px;
}
 

footer a {
  text-decoration: underline;
}

button {
  background-color: #6b824a;
  border-style: none;
  border-radius: 5px;
  padding: 7px;
  margin: 10px 0;
  color: white;
}
  </style>
</head>
<body>
  <div>
    <h2>You're on the list</h2>
    <p>Thanks for signing up to our newsletter.<br><br>We promise to keep things simple – no spam, just House of Plants product highlights, plant care advice and inspiration from one plant lover to another.<br><br>In the meantime, check plants for grabs in your area!</p>
    <button><a href="https://houseofplants.herokuapp.com/">Go to the site</a></button>
    <p>Have a great day,<br><i>Frankie & Ola</i></p>
  </div>
  <footer>
       <p> Made with ☀️ and 💧 by <a href="https://github.com/yelsre">Frankie</a> and <a
             href="https://github.com/ollayka">Ola</a></p>
 </footer>
</body>
</html>`;

const plantInquiry = `hi, can I get this plant?`;

//DEPLOYMENT BLOCK
// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: process.env.EMAIL_ADDRESS,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

//TESTING BLOCK
const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.TESTING_USER,
    pass: process.env.TESTING_PASSWORD,
  },
});

transporter.sendMail({
  from: '"House of Plants 🌱" <houseofplants.ih@gmail.com>',
  to: "houseofplants.ih@gmail.com",
  subject: "🪴 Welcome to House of Plants 🪴",
  text: "Hello world?",
  html: welcomeMessage,
});
