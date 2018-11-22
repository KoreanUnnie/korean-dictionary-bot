const hasKoreanTXT = string => {
  const re = /[\u3131-\uD79D]/giu;
  return string.match(re);
};
module.exports = {
  hasKoreanTXT
};
