const textAnalyzeURL = "https://open-korean-text.herokuapp.com/tokenize?text=";
const fetch = require("node-fetch");
const getEnglishWordType = (enWordType, cmd) => {
  enWordType = replaceAll(enWordType, `${cmd}`, "");
  enWordType = replaceAll(enWordType, ": [0-9]+, [0-9]+", ""); // numbers
  enWordType = enWordType.replace(/[.*+?^${}()|[\]\\]/g, ""); // curly braces
  enWordType = enWordType.replace(/[\u3131-\uD79D]/giu, ""); // remove all ko text
  return enWordType;
};
const getKoreanWordType = (parse, cmd) => {
  parse = parse.replace(`(${cmd})`, "");
  parse = parse.replace(`${cmd}`, "");
  let koreanWord = parse.match(/[\u3131-\uD79D]/giu);
  if (koreanWord && koreanWord[0]) {
    koreanWord = koreanWord.join("");
    parse = parse.replace(/[\u3131-\uD79D]/giu, "");
  }
  parse = replaceAll(parse, "Adverb", "부사");
  parse = replaceAll(parse, "Verb", "동사");
  parse = replaceAll(parse, ": [0-9]+, [0-9]+", "");
  parse = replaceAll(parse, "PreEomi", "선어말어미");
  parse = replaceAll(parse, "Eomi", "어미");
  parse = replaceAll(parse, "Adjective", "형용사");
  parse = replaceAll(parse, "Noun", "명사");
  parse = replaceAll(parse, "Josa", "조사");
  parse = replaceAll(parse, "Suffix", "접미사");
  parse = replaceAll(parse, "Prefix", "접두사");
  parse = replaceAll(parse, "Determiner", "지시사");
  parse = replaceAll(parse, "Exclamation", "감탄사");
  parse = replaceAll(parse, "Conjunction", "연결사");
  parse = replaceAll(parse, "/", " / ");
  parse = parse.replace(/[.*+?^${}()|[\]\\]/g, ""); // curly braces
  return { koreanWordType: parse, koreanWord };
};

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, "g"), replace);
}
const headers = msg => ({
  method: "POST",
  body: msg
});
const textAnalyze = async msg => {
  try {
    const connection = await fetch(textAnalyzeURL, headers(msg));
    return await connection.json();
  } catch (error) {
    console.log("Could not send message", error);
    return null;
  }
};
const getFirstTextAnalyze = async msg => {
  try {
    const result = await textAnalyze(msg);
    const [first] = result.tokens;
    const { koreanWordType, koreanWord } = getKoreanWordType(first, msg);
    const englishWordType = getEnglishWordType(first, msg);
    return { englishWordType, koreanWordType, koreanWord };
  } catch (error) {
    console.log("Could not send message", error);
    return {};
  }
};
module.exports = {
  getFirstTextAnalyze
};
