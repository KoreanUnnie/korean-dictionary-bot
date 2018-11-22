const kpop = require("kpop");
const { hasKoreanTXT } = require("../utils/language");
const numberHandle = require("./number");
const handle = ({ message, options, bot, prefix }) => {
  const errorTxt = `\nExample: \`\`\`${
    module.exports.exampleUsage
  }\`\`\` \nResult: \`\`\`${module.exports.exampleResult}\`\`\``;
  const usedPrefix = prefix.prefix[prefix.name];
  const prefixIndex = message.content.indexOf(usedPrefix.value);
  const msg = message.content.slice(prefixIndex + usedPrefix.value.length); // slice of the prefix on the message
  const hasKOTXT = hasKoreanTXT(msg);
  let string;
  if (msg === "") {
    const description = "Please enter a word" + errorTxt;
    if (message.channel.type === "youtube") {
      return message.channel.send(description);
    }
    options.setDescription(description);
    message.channel.send(options);
    return;
  }
  if (hasNumber(msg)) {
    console.log("has number");
    message.lang = hasKOTXT ? "ko" : "en";
    return numberHandle.handle({ message, options, bot, prefix });
  }
  if (hasKOTXT) {
    string = `Romanized that's ${kpop.romanize(msg)}`;
  } else {
    string = `Hungulified that's ${kpop.hangulify(msg)}`;
  }
  if (message.channel.type === "youtube") {
    return message.channel.send(string);
  }
  options.setDescription(string);
  return message.channel.send(options);
};
function hasNumber(myString) {
  return /\d/.test(myString);
}

module.exports = {
  handle,
  prefix: {
    "!hangul": {
      match: "hangul",
      value: "!hangul ",
      lang: "en",
      display: false
    },
    "!romanize": {
      match: "romanize",
      value: "!romanize ",
      lang: "en",
      display: "lang",
      usage: "!romanize [english|korean]"
    },
    "!hungulify": {
      match: "hungulify",
      value: "!hungulify ",
      lang: "en",
      display: "lang"
    },
    "!rom": {
      match: "hungulify",
      value: "!rom ",
      lang: "en",
      display: false
    },
    "!hun": {
      match: "hungulify",
      value: "!hun ",
      lang: "en",
      display: false
    },
    "!한굴": {
      match: "hungulify",
      value: "!한굴 ",
      lang: "ko",
      display: "lang"
    },

    "!r": {
      match: "hungulify",
      value: "!r ",
      lang: "eng",
      display: false
    },

    "!h": {
      match: "hungulify",
      value: "!h ",
      lang: "eng",
      display: false
    }
  },
  usage: "!hungulify [english|korean]",
  description: "Romanize or Hangulify text.",
  exampleUsage: "!hungulify haha",
  exampleResult: "Hungulified that's 하하"
};
