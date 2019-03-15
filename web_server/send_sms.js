// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
const accountSid = 'AC0c00be9ab7ec90429a97567d746793fb';
const authToken = '5a6ff9292ae6e207285d71e6533e870a';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
     from: '+17784007272',
     to: '+16043527005'
   })
  .then(message => console.log(message.sid));
