const { Events } = require('discord.js');
const wait = require('../utils/wait');
const Birthday = require('../models/birthdayModel');
const refetchBirthdays = require('./modals/refetchBirthdays');

exports.name = Events.InteractionCreate;

exports.execute = async interaction => {
  if (!interaction.isModalSubmit()) return;

  try {
    if (interaction.customId === 'registerModal') {
      // 1) Ajouter les donnée à la BDD
      let month = interaction.fields
        .getTextInputValue('month')
        .toLowerCase()
        .trim();

      if (month === 'aout') month = 'août';
      if (month === 'fevrier') month = 'février';
      if (month === 'decembre') month = 'décembre';

      const day = interaction.fields.getTextInputValue('day').trim();

      await Birthday.create({ _id: interaction.user.id, month, day });

      // 2) Recharger l'UI
      await refetchBirthdays(interaction, month);
    }
  } catch (err) {
    console.error(err);
  }
};
