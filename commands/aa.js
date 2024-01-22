// require Nuggies
const Nuggies = require('nuggies');
const Discord = require('discord.js');




module.exports.run = async (client, message, args) => {
	if(!message.member.hasPermission('MANAGE_SERVER')) return message.reply('You do not have the permission \`MANAGE_SERVER\`');
    const dpmanager = new Nuggies.dropdownroles();
	message.channel.send('**age role process started!**\nplease type your roles in the follwing order, then say "done" when finished!\n\n`<roleID> <label> <emoji>`');






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
				.setTitle('Gender Roles!')
				.setDescription('Click on the buttons to grant yourself a role!')
        .setImage('https://cdn.discordapp.com/attachments/1138936835217825802/1195800114044862484/Discover_Gaming_1.gif?ex=65b54ea4&is=65a2d9a4&hm=8ae3dcb25d2bb0bef5a6f23473c14711b9e3b294ca5dc0aecc9546dd80c32e89&')
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
    name: 'aa',
    description: 'Description of your command',
    usage: '.aa',
    botPerms: [],
    userPerms: ['MANAGE_SERVER'],
    aliases: [],
  };