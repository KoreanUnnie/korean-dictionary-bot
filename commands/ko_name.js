const namer = require("korean-name-generator");
const preString = "How about ";
const sufString = " :smiley:";
const kpop = require("kpop");
const { titleCase } = require("../utils/format-text");
const handle = ({ message, options, bot, prefix }) => {
  const errorTxt = `\nExample: \`\`\`${
    module.exports.exampleUsage
  }\`\`\` \nResult: \`\`\`${module.exports.exampleResult}\`\`\``;
  const msg = message.content.toLowerCase(); // dont slice just search whole text
  let string = "";
  if (!containsMale(msg) && !containsFemale(msg)) {
    return message.channel.send(
      "Please let me know your gender so I can give you a Korean name " +
        errorTxt
    );
  }
  if (containsMale(msg)) {
    const name = namer.generate(false);
    const lastname = name.substring(0, 1);
    const firstname = name.slice(-2);
    const romanized = titleCase(kpop.romanize(firstname + " " + lastname));
    string = `${preString} ${name} - ${romanized}? ${sufString}`;
  } else if (containsFemale(msg)) {
    const name = namer.generate(false);
    const lastname = name.substring(0, 1);
    const firstname = name.slice(-2);
    const romanized = titleCase(kpop.romanize(firstname + " " + lastname));
    string = `${preString} ${name} - ${romanized}? ${sufString}`;
  }

  if (message.channel.type === "youtube") {
    return message.channel.send(string);
  }
  return message.channel.send(string);
};
const containsMale = msg => {
  return (
    msg.includes("male") ||
    msg.includes("boy") ||
    msg.includes("guy") ||
    msg.includes("man")
  );
};
const containsFemale = msg => {
  return msg.includes("female") || msg.includes("girl") || msg.includes("gal");
};
module.exports = {
  handle,
  prefix: {
    "!name": {
      match: "name",
      value: "!name ",
      lang: "en",
      display: true
    },
    name_me: {
      match: "name",
      value: "name me ",
      lang: "en",
      display: false
    },
    "!nam": {
      match: "name",
      value: "!nam ",
      lang: "en",
      display: false
    },
    korean_name: {
      match: "name",
      value: "name me ",
      lang: "en",
      display: false
    }
  },
  usage: "!name [gender]",
  description: "Get a random Korean name",
  exampleUsage: "!name female",
  exampleResult: "How about  남다리 - Dali Nam?  ^^"
};
