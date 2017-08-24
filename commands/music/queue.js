const ytdl = require('ytdl-core');

function secSpread(sec) {
	let hours = Math.floor(sec / 3600);
	let mins = Math.floor((sec - hours * 3600) / 60);
	let secs = sec - (hours * 3600 + mins * 60);
	return {
		h: hours,
		m: mins,
		s: secs
	}
}

exports.run = async (message, args, suffix, client) => {
	if (!message.guild.music || !message.guild.music.queue) return message.channel.send(`There is no music queued. Add some with \`${client.config.prefix}play\`.`);

	let i = 1;
	if (args[0]) {
		let parsed = parseInt(args[0]);
		if (!parsed) return message.channel.send('That\'s not a valid page number.');
		if (parsed < 1) return message.channel.send('There aren\'t negative pages.');
		parsed = Math.floor(parsed);
		if ((parsed - 1) * 10 > message.guild.music.queue.length) return message.channel.send(`There ${message.guild.music.queue.length < 11 ? 'is' : 'are'} only ${Math.ceil(message.guild.music.queue.length / 10)} page${message.guild.music.queue.length < 11 ? '' : 's'} in the queue.`);
		i = (parsed - 1) * 10 + 1;
	}

	let pars = i;
	let songArray = [];
	let queue = message.guild.music.queue.slice(i - 1, i + 9);
	queue.forEach(async obj => {
		if (i !== 1) {
			let info = await ytdl.getInfo(obj.id);
			let secObj = secSpread(info.length_seconds);
			songArray.push(`${i}. [${info.title}](https://www.youtu.be/${obj.id}) - ${secObj.h ? `${secObj.h}h ` : ''}${secObj.m ? `${secObj.m}m ` : ''}${secObj.s}s`);
		}
		i++;
	});

	let npInfo = await ytdl.getInfo(message.guild.music.queue[0].id);
	let npSec = secSpread(npInfo.length_seconds);

	message.channel.send({embed: {
		title: `Now playing: ${npInfo.title} (${npSec.h ? `${npSec.h}h ` : ''}${npSec.m ? `${npSec.m}m ` : ''}${npSec.s}s)`,
		description: songArray.join('\n'),
		color: 0x427df4,
		footer: {
			text: `Page ${pars} of ${Math.ceil(message.guild.music.queue.length / 10)} | ${message.guild.music.queue.length} Song${message.guild.music.queue.length === 1 ? '' : 's'} Total | Note that queue may load slowly.`
		}
	}});
};

exports.config = {
	enabled: true,
	permLevel: 2,
	aliases: ['queueueue', 'queueue', 'que', 'qu', 'q']
};

exports.help = {
	name: 'Queue',
	description: 'View the current queue',
	usage: 'queue <page>',
	help: 'View the current queue. View a different page if there are more than 10 songs.',
	category: 'Music'
};