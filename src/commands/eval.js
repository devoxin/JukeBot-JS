exports.run = async function ({ client, msg, args }) {
  if (!client.config.prop.owners.includes(msg.author.id)) {
    return msg.channel.createMessage({ embed: {
      color: client.config.options.embedColour,
      title: ':warning: Restricted Command',
      description: 'This command is locked to the developer only.'
    } });
  }

  try {
    let code = eval(args.join(' '));

    if (typeof code !== 'string') {
      code = require('util').inspect(code, { depth: 0 });
    }

    code = code.replace(new RegExp(client.token.slice(4), 'gi'), '*');
    msg.channel.createMessage(`\`\`\`js\n${code}\n\`\`\``);
  } catch(e) {
    msg.channel.createMessage(`\`\`\`js\n${e}\n\`\`\``);
  }
};

exports.usage = {
  main: '{prefix}{command}',
  args: '',
  description: 'Developer command'
};

exports.aliases = ['ev', 'e'];
