const {
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle
} = require('discord.js');

module.exports = async interaction => {
  const modal = new ModalBuilder()
    .setCustomId('registerModal')
    .setTitle('Mon anniversaire est le :');

  const month = new TextInputBuilder()
    .setCustomId('month')
    .setLabel('Mois')
    .setStyle(TextInputStyle.Short)
    .setValue(
      interaction.message.components[0].components[0].data.custom_id.split(
        '_'
      )[1]
    )
    .setRequired(true);

  const day = new TextInputBuilder()
    .setCustomId('day')
    .setLabel('Jour')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const firstActionRow = new ActionRowBuilder().addComponents(month);
  const secondActionRow = new ActionRowBuilder().addComponents(day);

  modal.addComponents(firstActionRow, secondActionRow);

  await interaction.showModal(modal);
};
