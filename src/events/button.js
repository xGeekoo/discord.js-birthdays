const { Events } = require('discord.js');
const wait = require('../utils/wait');

const switchPage = require('./buttons/switchPage');
const register = require('./buttons/register');

exports.name = Events.InteractionCreate;

exports.execute = async interaction => {
  if (!interaction.isButton()) return;

  try {
    if (interaction.customId === 'left' || interaction.customId === 'right') {
      await switchPage(interaction);
    }

    if (interaction.customId.startsWith('register_')) {
      await register(interaction);
    }
  } catch (err) {
    console.error(err);
  }
};
