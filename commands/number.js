const { numberToKorean } = require("number-to-korean");
const kpop = require("kpop");
const koreanToNumber = require("korean-numbers");
var numeral = require("numeral");
const handle = ({ message, options, bot, prefix }) => {
  const errorTxt = `\nExample: \`\`\`${
    module.exports.exampleUsage
  }\`\`\` \nResult: \`\`\`${module.exports.exampleResult}\`\`\``;
  const usedPrefix = prefix.prefix[prefix.name];
  const prefixIndex = message.content.indexOf(usedPrefix.value);
  const msg = message.content.slice(prefixIndex + usedPrefix.value.length); // slice of the prefix on the message
  let string = "";
  if (msg === "") {
    string = "Sorry you have to provide a number." + errorTxt;
    if (message.channel.type === "youtube") {
      return message.channel.send(string);
    }
    options.setDescription(string);
    return message.channel.send(options);
  }
  if (message.lang === "ko") {
    const englishNbr = koreanToNumber.parse(msg);
    string = `In English **${msg}** - ${kpop.romanize(
      msg.replace(/\d/g, "")
    )} is **${numeral(englishNbr).format("0,0")}**`;
  } else {
    const koreanNbr = numberToKorean(msg);
    string = `In Korean **${msg}** is **${koreanNbr}** - ${kpop.romanize(
      koreanNbr.replace(/\d/, "")
    )}`;
  }

  if (message.channel.type === "youtube") {
    return message.channel.send(string);
  }
  options.setDescription(string);
  return message.channel.send(options);
};

module.exports = {
  handle,
  prefix: {
    "!number": {
      match: "number",
      value: "!number ",
      lang: "en",
      display: true
    },
    "!num": {
      match: "number",
      value: "!num ",
      lang: "en",
      display: false
    },

    "!n": {
      match: "number",
      value: "!n ",
      lang: "en",
      display: false
    }
  },
  usage: "!number [number]",
  description: "Translate a number into Korean or English",
  exampleUsage: "!number 300",
  exampleResult: "In Korean 300 is 3백 - baeg"
};
