const heapdump = require("heapdump");

exports.run = function(client, msg, args) {
	if (msg.author.id !== "180093157554388993") return;

	msg.channel.createMessage("Writing heapdump... This may take some time!");

	heapdump.writeSnapshot("./Dump" + Date.now() + ".heapsnapshot", (err, fn) => {
		msg.channel.createMessage("Heapdump " + (err ? "failed to save\n" + err.message : "saved successfully."));
	})
}
