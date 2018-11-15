const moment = require("moment");
const format = require("./format-text");
const Discord = require("discord.js");

const prefixes = {
  "!define": {
    match: "define", // used to match type, useful if we have multiple for same function
    value: "!define ", // what the user typed
    lang: "en" // maybe use to respond in another language
  },
  "!정의": {
    match: "define",
    value: "!정의 ",
    lang: "ko"
  },
  "!klp": {
    match: "KLP",
    value: "!klp ",
    lang: "en"
  },
  "!admin": {
    match: "admin",
    value: "!admin ",
    lang: "en"
  },
  "!ggami": {
    match: "ggami",
    value: "!ggami ",
    lang: "en"
  },
  "!까미": {
    match: "ggami",
    value: "!까미 ",
    lang: "ko"
  },
  "!help": {
    match: "help",
    value: "!help ",
    lang: "en"
  },
  "!command": {
    match: "help",
    value: "!command ",
    lang: "en"
  },
  "!commands": {
    match: "help",
    value: "!commands ",
    lang: "en"
  }
};
module.exports.HELPER_TEXT =
  "```diff\n" +
  "+ !define [word] | !정의 [단어]\n" +
  "+ !ggami | !까미\n" +
  "```";
module.exports.CONFUSED_COMAND = `Sorry I'm a little confused, please try again...`;
module.exports.DICTIONARY_API_URL =
  "https://ac.dict.naver.com/koendict/ac?q_enc=utf-8&st=1000&r_format=json&r_enc=utf-8&r_lt=1000&r_unicode=0&r_escape=1&q=";
module.exports.DICTIONARY_LINK =
  "https://endic.naver.com/search.nhn?sLn=kr&searchOption=all&query=";
module.exports.isMention = (message, bot) =>
  message.content.indexOf("<@" + bot.user.id) === 0 ||
  message.content.indexOf("<@!" + bot.user.id) === 0;
module.exports.isDM = message => message.channel && message.channel.type === "dm";
module.exports.NAVER_VIDEO_LINK = `[Click here to learn how to use Naver Dictionary](https://www.youtube.com/watch?v=KcPPllmx-Rc) By TTMIK`;
module.exports.NAVER_FIELDS = url => [
  {
    name: "More",
    value: format.NAVER_MORE_URL(url)
  },
  {
    name: "How to",
    value: module.exports.NAVER_VIDEO_LINK
  }
];
module.exports.APP_AVATAR = `https://scontent-dfw5-1.cdninstagram.com/vp/e28d4f5b552fda7f57318cd2fa74243d/5C88F357/t51.2885-19/s320x320/44491467_439599376445310_8268611806365220864_n.jpg`;
module.exports.APP_COPYRIGHT = `Copyright ⓒ ${moment().format(
  "YYYY"
)} "한국언니 Korean Unnie" All Rights Reserved.`;
module.exports.GET_DEFAULT_MESSAGE_OPTIONS = () => {
  const options = new Discord.RichEmbed();
  options.setTimestamp(moment().format());
  options.setFooter(module.exports.APP_COPYRIGHT, module.exports.APP_AVATAR);
  return options.setColor(16738740);
};
module.exports.GET_DISCORD_PREFIX = text => {
  const firstword = text.split(" ")[0]; //
  if (firstword in prefixes) {
    return prefixes[firstword];
  } else {
    return null;
  }
};
