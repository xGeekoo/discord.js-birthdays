const { Events } = require('discord.js');
const Birthday = require('../models/birthdayModel');

exports.name = Events.GuildMemberRemove;

exports.execute = async member => {
  try {
    await Birthday.findByIdAndUpdate(member.id, { isPresent: false });
  } catch (err) {
    console.error(err);
  }
};
