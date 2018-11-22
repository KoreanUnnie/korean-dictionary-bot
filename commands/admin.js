const util = require("util");
const handle = ({ message, options, prefix, bot }) => {
  const usedPrefix = prefix.prefix[prefix.name];
  const prefixIndex = message.content.indexOf(usedPrefix.value);
  const msg = message.content.slice(prefixIndex + usedPrefix.value.length); // slice of the prefix on the message
  let args = msg.split(" "); // break the message into part by spaces
  const cmd = args[0].toLowerCase(); // set the first word as the command in lowercase just in case
  args.shift(); // delete the first word from the args
  if (cmd === "words" || cmd === "word") {
    // const buffer = await getWordCloud();
    // options.attachFile(buffer)
    message.channel.send(options);
    return;
  } else if (
    cmd === "eval" &&
    message.author.id === process.env.KOREAN_DICT_BOT_DISCORD_OWNER
  ) {
    // < checks the message author's id to owners
    const code = args.join(" ");
    return evalCmd({ message, code, bot, options, prefix });
  }
};

function evalCmd({ message, code, bot, options, prefix }) {
  if (message.author.id !== process.env.KOREAN_DICT_BOT_DISCORD_OWNER) return;
  try {
    let evaled = eval(code);
    if (typeof evaled !== "string") evaled = util.inspect(evaled);
    message.channel.send(clean(evaled), { code: "xl" });
  } catch (err) {
    message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
  }
}

function clean(text) {
  if (typeof text !== "string") {
    text = util.inspect(text, { depth: 0 });
  }
  text = text
    .replace(/`/g, "`" + String.fromCharCode(8203))
    .replace(/@/g, "@" + String.fromCharCode(8203))
    .replace(
      process.env.KOREAN_DICT_BOT_DISCORD_TOKEN,
      "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0"
    ); //Don't let it post your token
  return text;
}

module.exports = {
  handle,
  prefix: {
    "!admin": {
      match: "admin",
      value: "!admin ",
      lang: "en",
      display: false
    }
  }
};
