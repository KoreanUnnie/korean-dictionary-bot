const naverURL = "https://openapi.naver.com/v1/papago/n2mt";
const fetch = require("node-fetch");
const handle = async ({ message, options, bot, prefix }) => {
  const errorTxt = `\nExample: \`\`\`${
    module.exports.exampleUsage
  }\`\`\` \nResult: \`\`\`${module.exports.exampleResult}\`\`\``;
  const usedPrefix = prefix.prefix[prefix.name];
  const prefixIndex = message.content.indexOf(usedPrefix.value);
  const msg = message.content.slice(prefixIndex + usedPrefix.value.length); // slice of the prefix on the message
  let string = "";
  if (msg === "") {
    string = "Sorry you have to provide a word or phrase." + errorTxt;
    if (message.channel.type === "youtube") {
      return message.channel.send(string);
    }
    options.setDescription(string);
    return message.channel.send(options);
  }
  if (message.lang === "ko") {
    options.setTitle("From Korean to English");
    const { message = null } = await translateText({
      to: "en",
      from: "ko",
      text: msg
    });
    const { result = null } = message;
    const { translatedText = null } = result;
    string += translatedText;
  } else {
    options.setTitle("From English to Korean");
    const { message = null } = await translateText({
      to: "ko",
      from: "en",
      text: msg
    });
    const { result = null } = message;
    const { translatedText = null } = result;
    string += translatedText;
  }

  if (message.channel.type === "youtube") {
    return message.channel.send(string);
  }
  options.setDescription(string);
  return message.channel.send(options);
};
const headers = ({ from, to, text }) => ({
  method: "POST",
  headers: {
    "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
    "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    source: from,
    target: to,
    text: text
  })
});

const translateText = async ({ to, from, text }) => {
  try {
    const connection = await fetch(naverURL, headers({ to, from, text }));
    return await connection.json();
  } catch (error) {
    console.log("Could not send message", error);
    return null;
  }
};

module.exports = {
  handle,
  prefix: {
    "!translate": {
      match: "translate",
      value: "!translate ",
      lang: "en",
      display: true
    },
    "!tra": {
      match: "translate",
      value: "!tra ",
      lang: "en",
      display: false
    },
    "!t": {
      match: "translate",
      value: "!t ",
      lang: "en",
      display: false
    }
  },
  usage: "!translate [word|phrase]",
  description: "Translate a word or phrase into Korean or English",
  exampleUsage: "!translate Hello",
  exampleResult: "Result: 안녕하세요"
};
