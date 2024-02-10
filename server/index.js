const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/dbConnection");
const PORT = process.env.PORT || 8080;
const nodemailer = require('nodemailer');

connectDB();
//middleware function to connect API;s
app.use(cors());

//to parset the datas
app.use(express.json());

app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.use(errorHandler);

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ambika@innoura.com',
    pass: 'uluz udxf lgkc fhfa'
  }
});

// var mailOptions = {
//   from: 'ambika@innoura.com',
//   to: 'gayathri@innoura.com',
//   subject: 'Sending Email using Node.js',
//   html: '<p><img src="https://cdn.pixabay.com/animation/2022/11/14/21/10/21-10-03-954_512.gif" />  Thanks for being heree!</p>',
//   attachments: [ 
//   {   
//     // utf-8 string as an attachment 
//     filename: 'text.txt', 
//     content: 'Hello, GeeksforGeeks Learner!'
//   }, 
//   {    
//     // filename and content type is derived from path 
//     path: '/home/mrtwinklesharma/Programming/document.docx'
//   }, 
//   {    
//     path: '/home/mrtwinklesharma/Videos/Sample.mp4'
//   }, 
//   {    
//     // use URL as an attachment 
//     filename: 'license.txt', 
//     path: 'https://raw.github.com/nodemailer/nodemailer/master/LICENSE'
//   }  
//  ] 
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});

