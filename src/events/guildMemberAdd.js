const { Events } = require('discord.js');
const Birthday = require('../models/birthdayModel');

exports.name = Events.GuildMemberAdd;

exports.execute = async member => {
  try {
    await Birthday.findByIdAndUpdate(member.id, { isPresent: true });
  } catch (err) {
    console.error(err);
  }
};
