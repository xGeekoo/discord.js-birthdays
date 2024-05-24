const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '..', 'config.env') });

const mongoose = require('mongoose');
const client = require('./client');

(async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log('Database connected');
    client.login(process.env.TOKEN);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
