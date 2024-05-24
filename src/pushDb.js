const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '..', 'config.env') });

const mongoose = require('mongoose');
const Birthday = require('./models/birthdayModel');

const months = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre'
];

(async () => {
  await mongoose.connect(process.env.DB);

  const res = await fetch(
    'https://randomuser.me/api/?inc=name,login,email,dob&noinfo&results=1000&nat=ca,fr,us'
  );
  const { results: data } = await res.json();

  const birthdays = data.map(user => {
    const dob = user.dob.date;
    const splitDob = dob.split('-');
    const month = months[Number(splitDob.at(1) - 1)];
    const day = Number(splitDob.at(2).slice(0, 2));

    return { _id: user.login.uuid.split('-')[0], month, day };
  });

  await Birthday.insertMany(birthdays);
  process.exit();
})();
