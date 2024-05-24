const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const Birthday = require('../../models/birthdayModel');
const wait = require('../../utils/wait');

module.exports = async (interaction, userMonth) => {
  // 1) Obtenir le message
  const messages = Array.from(
    (await interaction.channel.messages.fetch({ limit: 12 })).values()
  );

  const message = messages.find(message => {
    const month =
      message.components[0].components[0].data.custom_id.split('_')[1];
    return userMonth === month;
  });

  const month =
    message.components[0].components[0].data.custom_id.split('_')[1];

  // 2) Générer le message
  const embeds = message.embeds;
  const components = message.components.at(0).components;

  const header = embeds.at(0);
  const list = embeds.at(1);
  const registerBtn = components.at(0);
  const leftBtn = components.at(1);
  const rightBtn = components.at(2);

  const birthdays = await Birthday.getBirthdaysOfMonth({ month });
  const numPages = await Birthday.getNumPages({ month });

  const birthdaysDescription = Birthday.generateBirthdaysDescription(birthdays);

  const newList = EmbedBuilder.from(list)
    .setTitle(`Page 1/${numPages}`)
    .setDescription(birthdaysDescription);

  const newLeftBtn = ButtonBuilder.from(leftBtn).setDisabled(true);

  const newRightBtn = ButtonBuilder.from(rightBtn).setDisabled(numPages === 1);

  const row = new ActionRowBuilder().addComponents(
    registerBtn,
    newLeftBtn,
    newRightBtn
  );

  await message.edit({
    embeds: [header, newList],
    components: [row]
  });

  await interaction.reply({
    content: 'Vous avez été ajouté à la liste des anniversaire!',
    ephemeral: true
  });
};
