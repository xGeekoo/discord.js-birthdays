const path = require('node:path');
const fs = require('node:fs');
require('dotenv').config({ path: path.join(__dirname, '..', 'config.env') });

const { REST, Routes } = require('discord.js');

const commands = [];

// Load each commands files and push them in the commands array
const commandsFolderPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsFolderPath);
for (const file of commandFiles) {
  const filePath = path.join(commandsFolderPath, file);
  const command = require(filePath);

  if (command.hasOwnProperty('data') && command.hasOwnProperty('execute')) {
    commands.push(command.data.toJSON());
  } else {
    throw new Error(
      `[ERROR] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (err) {
    console.error(err);
  }
})();
