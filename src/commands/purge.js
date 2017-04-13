const permissions = require("../../util/Permissions.js");

exports.run = async function(client, msg, args, guilds) {
	if (!permissions.isAdmin(msg.member, msg.guild.id)) return msg.channel.createMessage({
		embed: {
			color: 0x1E90FF,
			title: "Insufficient Permissions",
		}
	})

	if (msg.channel.permissionsOf(client.user.id).has("manageMessages")) msg.delete();

	let messagecount = parseInt(args[0]) ? parseInt(args[0]) : 1;

	let msgs = await msg.channel.getMessages(100);
	msgs = msgs.filter(m => m.author.id === client.user.id).map(m => m.id)

	if (msgs.length > messagecount) msgs.length = messagecount;

	if (msgs.length < 2 || !msg.channel.permissionsOf(client.user.id).has("manageMessages")) {
		msgs.map(m => msg.channel.deleteMessage(m).catch());
	} else {
		msg.channel.deleteMessages(msgs)
	}
}