const path = require('node:path');
const fs = require('node:fs');

const { Client, Collection, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
});

// Create commands collection
client.commands = new Collection();

// Load each commands files and add them in the collection
const commandsFolderPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsFolderPath);
for (const file of commandFiles) {
  const filePath = path.join(commandsFolderPath, file);
  const command = require(filePath);

  if (command.hasOwnProperty('data') && command.hasOwnProperty('execute')) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

// Load each events files and start listening for them
const eventsFolderPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsFolderPath, { withFileTypes: true });
for (const file of eventFiles) {
  if (!file.isFile()) continue;
  const filePath = path.join(eventsFolderPath, file.name);
  const event = require(filePath);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

module.exports = client;
