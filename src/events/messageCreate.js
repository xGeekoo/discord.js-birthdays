const path = require('node:path');
const {
  Events,
  ActionRowBuilder,
  EmbedBuilder,
  AttachmentBuilder
} = require('discord.js');
const Birthday = require('../models/birthdayModel');

exports.name = Events.MessageCreate;

exports.execute = async interaction => {
  if (interaction.author.bot) return;

  // const numPages = await Birthday.getNumPages({ month: 'avril' });
  // console.log(numPages);

  // await interaction.channel.send('Message recieved!');
};
