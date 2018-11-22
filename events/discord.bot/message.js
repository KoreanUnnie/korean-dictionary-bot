const io = require("../../next-server").io;
const db = require("../../firebase");
const constants = require("../../utils/constants");
const { hasKoreanTXT } = require("../../utils/language");
const helpHandle = require("../../commands/help");
const handle = async ({ message, bot }) => {
  // on message event
  if (message.author.bot || message.system) {
    // Ignore bots
    // check for if its KLP
    return;
  }
  const isKorean = hasKoreanTXT(message.content);
  message.lang = isKorean ? "ko" : "en";

  let options = constants.GET_DEFAULT_MESSAGE_OPTIONS();
  const firstword = message.content.toLowerCase().split(" ")[0];
  const prefix = bot.commands.get(firstword);
  if (prefix) {
    return prefix.handle({ message, options, bot, io, prefix, db });
  }
  if (isDM(message, bot)) {
    // Catch DM
    return messageHasDM(message, options, bot);
  }
  if (isMention(message, bot)) {
    // Catch @Mentions
    return messageHasMention(message, options, bot);
  }
  let underscore = message.content.toLowerCase().split(" ");
  underscore.forEach((word, index) => {
    if (index === underscore.length - 1) {
      return;
    }
    const command = bot.commands.get(word + "_" + underscore[index + 1]);
    if (command) {
      underscore = command;
    }
  });
  if (underscore && !underscore.length) {
    return underscore.handle({
      message,
      options,
      bot,
      io,
      prefix: underscore,
      db
    });
  }
  return;
};

const isDM = message => {
  if (message && message.channel && message.channel.type) {
    return message.channel && message.channel.type === "dm";
  } else {
    return false;
  }
};
const isMention = (message, bot) => {
  if (message && message.content && bot && bot.user && bot.user.id) {
    return (
      message.content.indexOf("<@" + bot.user.id) === 0 ||
      message.content.indexOf("<@!" + bot.user.id) === 0
    );
  } else {
    return false;
  }
};

const messageHasDM = (message, options, bot) => {
  return helpHandle.handle({ message, options, bot });
};

const messageHasMention = (message, options, bot) => {
  return helpHandle.handle({ message, options, bot });
};

module.exports = {
  handle,
  name: "message"
};
