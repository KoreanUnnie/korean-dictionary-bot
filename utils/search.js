function multiSearchOr(text, searchWords) {
  // create a regular expression from searchwords using join and |. Add "gi".
  // Example: ["ANY", "UNATTENDED","HELLO"] becomes
  // "ANY|UNATTENDED|HELLO","gi"
  // | means OR. gi means GLOBALLY and CASEINSENSITIVE
  var searchExp = new RegExp(searchWords.join("|"), "gi");
  // regularExpression.test(string) returns true or false
  return searchExp.test(text);
}

function multiSearchAnd(text, searchWords) {
  // create a regular expression from searchwords using join and |. Add "gi".
  // this time put our search words inside back reference catching brackets
  // Example: ["ANY", "UNATTENDED","HELLO"] becomes
  // "(ANY)|(UNATTENDED)|(HELLO)","gi"
  // (..) are backreferences. | means OR. gi means GLOBALLY and CASEINSENSITIVE
  var searchExp = new RegExp("(" + searchWords.join(")|(") + ")", "gi");
  // use match to return an array of backreference matches. If the array length doesn't match searchWords then Not found!!
  const textMatch = text.match(searchExp);
  if (!textMatch) {
    return false;
  }
  return textMatch.length == searchWords.length;
}

const findKoreanUnnie = string => {
  string = string
    .replace(/\s+/g, "")
    .replace(/^\s/, "")
    .replace(/\s$/, "")
    .toLowerCase();
  const val1 = string.includes("한국언니");
  const val2 = string.includes("koreanunnie");
  return val1 || val2;
};

module.exports = {
  findKoreanUnnie
};
