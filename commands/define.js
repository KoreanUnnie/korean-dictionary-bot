const naverAPI = require("../resources/naver-api");
const constants = require("../utils/constants");
const format = require("../utils/format-text");
const handle = async ({ message, options, prefix, db, io }) => {
  const errorTxt = `\nExample: \`\`\`${
    module.exports.exampleUsage
  }\`\`\` \nResult: \`\`\`${module.exports.exampleResult}\`\`\``;
  options.setThumbnail(
    "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/155/books_1f4da.png"
  );
  const usedPrefix = prefix.prefix[prefix.name];
  const prefixIndex = message.content.indexOf(usedPrefix.value);
  const msg = message.content.slice(prefixIndex + usedPrefix.value.length); // slice of the prefix on the message
  let args = msg.split(" "); // break the message into part by spaces
  const cmd = args[0].toLowerCase(); // set the first word as the command in lowercase just in case
  if (msg === "") {
    const description = "Please enter a word" + errorTxt;
    if (message.channel.type === "youtube") {
      return message.channel.send(description);
    }
    options.setDescription(description);
    message.channel.send(options);
    return;
  }
  const translation = await naverAPI.getTranslation(msg); // try to lookup in dictionary'
  if (translation) {
    await db.sendTermToDB(msg);
    io.emit("newTerm");

    if (message.channel.type === "youtube") {
      const formatedItems = translation.map(format.formatDictionaryItemNoLink);
      const formatedString = formatedItems[0];

      return message.channel.send(
        `${formatedString} ▫ Found with Naver Dictionary`
      );
    }
    const url = constants.DICTIONARY_LINK + encodeURIComponent(msg);
    const formatedItems = translation.map(format.formatDictionaryItem);
    const formatedString = formatedItems.join("\n");
    options.setDescription(`${formatedString}`);
    options.setTitle(format.NAVER_TITLE(translation, msg));
    constants.NAVER_FIELDS(url).forEach(field => {
      options.addField(field.name, field.value);
    });
    return message.channel.send(options);
  } else {
    const description = `Sorry no words found for ${msg} :(`;
    if (message.channel.type === "youtube") {
      return message.channel.send(description);
    }
    options.setDescription(description);
    message.channel.send(options);
    return;
  }
};

module.exports = {
  handle,
  prefix: {
    "!define": {
      match: "define", // used to match type, useful if we have multiple for same function
      value: "!define ", // what the user typed
      lang: "en", // maybe use to respond in another language,
      display: "lang"
    },
    "!정의": {
      match: "define",
      value: "!정의 ",
      lang: "ko",
      display: "lang"
    },
    "!def": {
      match: "define",
      value: "!def ",
      lang: "ko",
      display: false
    },

    "!d": {
      match: "define",
      value: "!d ",
      lang: "ko",
      display: false
    }
  },
  usage: "!define [word]",
  description: "Korean Dictionary lookup",
  exampleUsage: "!define hello",
  exampleResult: "Result: Hello = 안녕하세요"
};
