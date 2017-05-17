exports.run = async function(client, msg, args) {

	if (!permissions.isAdmin(msg.member, msg.channel.guild.id)) return msg.channel.createMessage({ embed: {
		color: config.options.embedColour,
		title: "Insufficient Permissions",
	}});

	if (msg.channel.permissionsOf(client.user.id).has("manageMessages")) msg.delete();

	let messagecount = parseInt(args[0]) ? parseInt(args[0]) : 1;

	let msgs = await msg.channel.getMessages(100);
	msgs = msgs.filter(m => m.author.id === client.user.id).map(m => m.id);

	if (msgs.length > messagecount) msgs.length = messagecount;

	if (msgs.length < 2 || !msg.channel.permissionsOf(client.user.id).has("manageMessages"))
		msgs.map(m => msg.channel.deleteMessage(m).catch());
	else
		msg.channel.deleteMessages(msgs);
}

exports.usage = {
	main: "{prefix}{command}",
	args: "<1-100>",
	description: "Removes the specified amount of messages sent by JukeBot"
};
