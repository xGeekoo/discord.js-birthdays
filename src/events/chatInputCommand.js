const { Events } = require('discord.js');
const wait = require('../utils/wait');

exports.name = Events.InteractionCreate;

exports.execute = async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    return console.warn("This command doesn't exist");
  }

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
  }
};
