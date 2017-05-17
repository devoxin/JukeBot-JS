exports.run = function (client, msg, args) {

	msg.channel.createMessage({ embed: {
		color: config.options.embedColour,
		title: "Become a patreon!",
		url  : "https://patreon.com/crimsonxv",
		description: "By becoming a patreon, you help keep the servers running & encourage me to continue developing new features",
		fields: [
			{
				name: "Donator Benefits",
				value: "- Import up to 100 songs from a playlist instead of 20\n" +
					   "- Bypassed queue limits. Both for the servers you're in, and for the servers you own.\n" +
					   "- Patreon role in JukeBot's Support server\n" +
					   "- Increased song duration limit (2 hours)\n" +
					   "- Access to an exclusive Patron-Only bot (less stutter)\n" +
					   "More benefits will be listed soon. Feel free to suggest some!",
				inline: true
			}
		],
		footer: {
			text: "Any benefits marked with * are still yet to be added. Early support is still appreciated!"
		}
	}});

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Shows patreon benefits and general info"
};
