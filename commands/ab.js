// require Nuggies
const Nuggies = require('nuggies');
const Discord = require('discord.js');




module.exports.run = async (client, message, args) => {
	if(!message.member.hasPermission('MANAGE_SERVER')) return message.reply('You do not have the permission \`MANAGE_SERVER\`');
    const dpmanager = new Nuggies.dropdownroles();
	message.channel.send('**Dropdown role process started!**\nplease type your roles in the follwing order, then say "done" when finished!\n\n`<roleID> <label> <emoji>`');






	const filter = m => m.author.id === message.author.id;
	const collector = message.channel.createMessageCollector(filter, { max: 10000 });

	collector.on('collect', async (msg) => {
		if (!msg.content) return message.channel.send('Invalid syntax');
		if (msg.content.toLowerCase() == 'done') return collector.stop('DONE');


		const roleid = msg.content.split(' ')[0];
		const role = message.guild.roles.cache.get(roleid);
		if (!role) return message.channel.send('Invalid role');

		const label = msg.content.split(' ').slice(1, msg.content.split(' ').length - 1).join(' ');

		const reaction = (await msg.react(msg.content.split(' ').slice(msg.content.split(' ').length - 1).join(' ')).catch(/*() => null*/console.log));

		const final = {
			role: roleid, label: label, emoji: reaction ? reaction.emoji.id || reaction.emoji.name : null,
		};
		dpmanager.addrole(final);
	})

	collector.on('end', async (msgs, reason) => {
		if (reason == 'DONE') {
			const embed = new Discord.MessageEmbed()
				.setTitle('Age Roles!')
				.setDescription('Click on the buttons to grant yourself a role!')
        .setImage('https://cdn.discordapp.com/attachments/1138936835217825802/1195800112056762489/Discover_Gaming_2.gif?ex=65b54ea3&is=65a2d9a3&hm=2d148ff11bfd0449e452787c5a1c06311e756816c65fe52c84df941704eeb2dd&')
				.setColor('45178D')
				.setTimestamp()
        .setFooter("Bot made by Eren", "https://cdn.discordapp.com/attachments/1160303288114237481/1195798911990907040/bkt.png?ex=65b54d85&is=65a2d885&hm=85b0d3e0b2465abb03ae6cdcab1765fd6d80f788a7f89199b61d3732ad266fac&")
			Nuggies.dropdownroles.create({ message: message, content: embed, role: dpmanager, channelID: message.channel.id })
		}
	});
};

module.exports.config = {
	name: 'dp',
	description: 'Creates dropdown role!',
	usage: '.dp',
	botPerms: [],
	userPerms: ['MANAGE_GUILD'],
	aliases: [],
};
module.exports.config = {
  name: 'ab',
  description: 'Description of your command',
  usage: '.ab',
  botPerms: [],
  userPerms: ['MANAGE_SERVER'],
  aliases: [],
};