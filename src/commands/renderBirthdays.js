const path = require('node:path');
const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require('discord.js');
const Birthday = require('../models/birthdayModel');

exports.data = new SlashCommandBuilder()
  .setName('render-birthday')
  .setDescription(
    'Send a message including all the informations and form about the birthdays users'
  )
  .setDefaultMemberPermissions(0);

exports.execute = async interaction => {
  await interaction.deferReply();

  const months = [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre'
  ];

  const imgs = new Map([
    ['janvier', 'https://i.ibb.co/7YVnCvN/janvier.jpg'],
    ['février', 'https://i.ibb.co/pd4wjFy/f-vrier.jpg'],
    ['mars', 'https://i.ibb.co/TLjdhbM/mars.jpg'],
    ['avril', 'https://i.ibb.co/PcZqqXz/avril.jpg'],
    ['mai', 'https://i.ibb.co/TWCh0n4/mai.jpg'],
    ['juin', 'https://i.ibb.co/KsPLGRf/juin.jpg'],
    ['juillet', 'https://i.ibb.co/6n6Ttx1/juillet.jpg'],
    ['août', 'https://i.ibb.co/RyXwsQ8/ao-t.jpg'],
    ['septembre', 'https://i.ibb.co/mvdWcbq/septembre.jpg'],
    ['octobre', 'https://i.ibb.co/WHDbdFz/octobre.jpg'],
    ['novembre', 'https://i.ibb.co/j6QgVbY/novembre.jpg'],
    ['décembre', 'https://i.ibb.co/KhHhyPV/d-cembre.jpg']
  ]);

  for (const month of months) {
    // if (month !== 'décembre') continue;
    const birthdays = await Birthday.getBirthdaysOfMonth({ month });
    const numPages = await Birthday.getNumPages({ month });

    const birthdaysDescription =
      Birthday.generateBirthdaysDescription(birthdays);

    const header = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setImage(imgs.get(month));

    const list = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setTitle(`Page 1/${numPages}`)
      .setDescription(birthdaysDescription);

    const registerBtn = new ButtonBuilder()
      .setCustomId(`register_${month}`)
      .setLabel("📄M'inscrire")
      .setStyle(ButtonStyle.Primary);

    const leftBtn = new ButtonBuilder()
      .setCustomId('left')
      .setLabel('<<')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);

    const rightBtn = new ButtonBuilder()
      .setCustomId('right')
      .setLabel('>>')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(numPages === 1);

    const row = new ActionRowBuilder().addComponents(
      registerBtn,
      leftBtn,
      rightBtn
    );

    await interaction.channel.send({
      components: [row],
      embeds: [header, list]
    });
  }

  await interaction.deleteReply();
};
