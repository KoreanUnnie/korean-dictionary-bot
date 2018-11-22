const hanspell = require("hanspell");

const PNUurl = "http://speller.cs.pusan.ac.kr/";
const DAUMurl = "http://dic.daum.net/grammar_checker.do";
const { titleCase } = require("../utils/format-text");
let results, fired, sent, globalOptions, globalMessage;
const handle = ({ message, options, bot, prefix }) => {
  const errorTxt = `\nExample: \`\`\`${
    module.exports.exampleUsage
  }\`\`\` \nResult: \`\`\`${module.exports.exampleResult}\`\`\``;
  results = [];
  fired = 0;
  sent = false;
  globalOptions = options;
  globalMessage = message;
  const usedPrefix = prefix.prefix[prefix.name];
  const prefixIndex = message.content.indexOf(usedPrefix.value);
  const msg = message.content.slice(prefixIndex + usedPrefix.value.length); // slice of the prefix on the message
  let string = "";
  if (msg === "") {
    string = "Sorry you have to provide a word or sentence." + errorTxt;
    if (message.channel.type === "youtube") {
      return message.channel.send(string);
    }
    options.setDescription(string);
    return message.channel.send(options);
  }
  if (message.lang === "en") {
    string = "Sorry you must use Korean only." + errorTxt;
    if (message.channel.type === "youtube") {
      return message.channel.send(string);
    }
    options.setDescription(string);
    return message.channel.send(options);
  }

  hanspell.spellCheckByDAUM(
    msg,
    3000,
    result => sendResult(result, "Daum 다음", DAUMurl),
    end,
    console.log
  );
  hanspell.spellCheckByPNU(
    msg,
    3000,
    result => sendResult(result, "Busan National University", PNUurl),
    end,
    console.log
  );
};

const sendToUser = () => {
  //console.log(results);
  let string = "";
  results.forEach(spelling => {
    const { token, suggestions, type, info, url, location } = spelling;
    globalOptions.addField("Original:", token, true);
    const typeText = type ? ` Reason: ${titleCase(type)}` : "";
    globalOptions.addField("Suggestion:", suggestions + typeText, true);
    globalOptions.addField("Info:", info);
    globalOptions.addField(`Spell check provided by ${location}`, url);
    string += ` Original: ${token} => Suggestion: ${suggestions} ${typeText} `;
  });
  if (string.length === 0) {
    string =
      "It seems there are no grammar or spelling mistakes, congratulations!";
    globalOptions.setDescription(string);
  }
  if (globalMessage.channel.type === "youtube") {
    return globalMessage.channel.send(string);
  }
  return globalMessage.channel.send(globalOptions);
};
const end = function() {
  fired += 1;
  if (fired === 2) {
    sent = true;
    sendToUser();
    return;
  }
  setTimeout(() => {
    if (sent) {
      return;
    } else {
      sendToUser();
    }
  }, 4500);
};

const sendResult = (result, location, url) => {
  const [spelling = null] = result;
  if (spelling) {
    if (results.length === 1) {
      if (spelling.suggestions.join(", ") === results[0].suggestions) {
        //ignore its the same suggestion
        return;
      }
    }
    results.push({
      ...spelling,
      location,
      url,
      suggestions: spelling.suggestions.join(", ")
    });
  }
};

module.exports = {
  handle,
  prefix: {
    "!spelling": {
      match: "spelling",
      value: "!spelling ",
      lang: "en",
      display: true
    },
    "!spe": {
      match: "spelling",
      value: "!spe ",
      lang: "en",
      display: false
    },
    "!spell": {
      match: "spelling",
      value: "!spell ",
      lang: "en",
      display: false
    },
    "!s": {
      match: "spelling",
      value: "!s ",
      lang: "en",
      display: false
    }
  },
  usage: "!spelling [sentence|word]",
  description: "Spell check on a sentence or word in Korean",
  exampleUsage: "!spelling 아녀하세요",
  exampleResult:
    "Original: 아녀하세요 => Suggestion: 안녕하세요, 아니라고 하세요 "
};
