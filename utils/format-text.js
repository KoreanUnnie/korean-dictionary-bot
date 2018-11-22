const constants = require("./constants");
module.exports.formatDictionaryItem = (item, index) =>
  `${index + 1}. [${item[0]}](${constants.DICTIONARY_LINK +
    encodeURIComponent(item[0])}) - ${item[1]}`;
module.exports.formatDictionaryItemNoLink = item =>
  `🤓 📚 ${item[0]} ➡ ${item[1].map(i => i.split(",").map(v => v + "🔹"))}`
    .replace(/,/g, "")
    .slice(0, -1);
module.exports.NAVER_MORE_URL = url =>
  `[Click here for more words and examples.](${url})`;
module.exports.NAVER_TITLE = (translation, msg) =>
  `Here are ${translation.length} terms that match ${msg}`;

module.exports.titleCase = str => {
  return str
    .toLowerCase()
    .split(" ")
    .map(function(word) {
      return word.replace(word[0], word[0].toUpperCase());
    })
    .join(" ");
};
