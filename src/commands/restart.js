exports.run = async function(client, msg, args) {
	if (msg.author.id !== "180093157554388993" && msg.author.id !== "284122164582416385") return;
	await msg.channel.createMessage(":gear: Now restarting...")
	require("child_process").exec("pm2 restart jukebotgc", (e, stdout, stderr) => {
		
	})
}
