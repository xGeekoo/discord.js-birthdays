const { Events } = require('discord.js');
const Birthday = require('../models/birthdayModel');

exports.name = Events.ClientReady;
exports.once = true;

exports.execute = async client => {
  async function handleBirthdays() {
    try {
      const birthdays = await Birthday.find({ isPresent: true });
      const membersId = birthdays.map(birthday => birthday._id);
      const members = await client.guilds.cache
        .get(process.env.GUILD_ID)
        .members.fetch({ user: membersId });

      const promises = [];

      for (const member of members.values()) {
        const birthday = birthdays.find(b => member.id === b._id);

        if (birthday.isBirthday && !birthday.isAnnounced) {
          promises.push(
            (async () => {
              await Birthday.findByIdAndUpdate(
                member.id,
                { isAnnounced: true },
                { runValidators: true }
              );
              await member.roles.add('1243659378645663835');
              await channel.send(
                `Aujourd'hui c'est l'anniversaire à <@${member.id}>, <@${member.id}>`
              );
            })()
          );
        }

        if (!birthday.isBirthday && birthday.isAnnounced) {
          promises.push(
            (async () => {
              await Birthday.findByIdAndUpdate(
                member.id,
                { isAnnounced: false },
                { runValidators: true }
              );
              await member.roles.remove('1243659378645663835');
            })()
          );
        }
      }

      await Promise.all(promises);
    } catch (err) {
      console.error(err);
    }
  }

  console.log(`${client.user.tag} is ready!`);

  const channel = client.channels.cache.get(process.env.GENERAL_CHANNEL);
  handleBirthdays();

  setInterval(handleBirthdays, Number(process.env.FETCH_INTERVAL_MS));
};
