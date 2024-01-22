//required packages
require('dotenv').config();
const Discord = require('discord.js');
// require Nuggies package
const Nuggies = require('nuggies');
const client = new Discord.Client();
// require discord-buttons package
require('discord-buttons')(client);
const fs = require('fs');
// login to the bot
client.login(process.env.BOT_TOKEN);

const keepAlive = require("./server");


//notifys console that bot is up and running!
client.on('ready', () => {
    console.log(`${client.user.tag} is online.`)
});

// handle giveaway buttons
client.on('clickMenu', menu => {
    Nuggies.dropclick(client, menu);
});


//command handler
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir('./commands/', (err, files) => {
    if (err) console.log(err);
    const commandFiles = files.filter(file => file.endsWith('.js') && !file.startsWith('index'));
    if (commandFiles.length < 1) {
        console.log('No commands found.');
        return;
    }
    commandFiles.forEach(file => {
        const command = require(`./commands/${file}`);
        client.commands.set(command.config.name, command);
        command.config.aliases.forEach(alias => {
            client.aliases.set(alias, command.config.name);
        });
    });
});

// Prefix and command handler
client.on('message', async message => {
    const prefix = '.';
    if (message.author.bot || message.channel.type === 'dm') return;
    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command =
            client.commands.get(commandName) ||
            client.commands.get(client.aliases.get(commandName));

        if (!command) return;

        try {
            if (command.config.botPerms && !message.guild.me.hasPermission(command.config.botPerms)) {
                const missingBotPermsEmbed = new Discord.MessageEmbed()
                    .setTitle('Missing Permissions')
                    .setDescription(`I am missing the required permissions: \`${command.config.botPerms.join('`, `')}\`.`)
                    .setColor('RED');
                return message.channel.send(missingBotPermsEmbed);
            }

            if (command.config.userPerms && !message.member.hasPermission(command.config.userPerms)) {
                const missingUserPermsEmbed = new Discord.MessageEmbed()
                    .setTitle('Missing Permissions')
                    .setDescription(`You are missing the required permissions: \`${command.config.userPerms.join('`, `')}\`.`)
                    .setColor('RED');
                return message.channel.send(missingUserPermsEmbed);
            }

            command.run(client, message, args);
        } catch (error) {
            console.error(error);
            message.channel.send('An error occurred while executing the command.');
        }
    }
});

//for bot hosting 
keepAlive();


