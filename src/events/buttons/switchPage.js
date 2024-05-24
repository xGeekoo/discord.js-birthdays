const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const Birthday = require('../../models/birthdayModel');
const wait = require('../../utils/wait');

module.exports = async interaction => {
  const direction = interaction.customId;

  const embeds = interaction.message.embeds;
  const components = interaction.message.components.at(0).components;

  const header = embeds.at(0);
  const list = embeds.at(1);
  const registerBtn = components.at(0);
  const leftBtn = components.at(1);
  const rightBtn = components.at(2);

  const listTitle = list.data.title;
  const slashIndex = listTitle.indexOf('/');
  const currentPage = Number(listTitle.at(slashIndex - 1));
  const numPages = Number(listTitle.at(slashIndex + 1));
  const month = registerBtn.data.custom_id.split('_').at(1);

  const newPageNumber =
    direction === 'left' ? currentPage - 1 : currentPage + 1;

  const birthdays = await Birthday.getBirthdaysOfMonth({
    month,
    pageNumber: newPageNumber
  });

  const birthdaysDescription = Birthday.generateBirthdaysDescription(birthdays);

  const newList = EmbedBuilder.from(list)
    .setTitle(`Page ${newPageNumber}/${numPages}`)
    .setDescription(birthdaysDescription);

  const newLeftBtn = ButtonBuilder.from(leftBtn).setDisabled(
    newPageNumber === 1
  );

  const newRightBtn = ButtonBuilder.from(rightBtn).setDisabled(
    newPageNumber === numPages
  );

  const row = new ActionRowBuilder().addComponents(
    registerBtn,
    newLeftBtn,
    newRightBtn
  );

  await interaction.update({
    embeds: [header, newList],
    components: [row]
  });
};
