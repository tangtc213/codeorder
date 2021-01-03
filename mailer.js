var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'qq',
  auth: {
    user: '1519066281',
    pass: 'tangfake'
  }
});

module.exports = transporter
