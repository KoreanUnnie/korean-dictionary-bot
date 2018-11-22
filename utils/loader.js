const fs = require("fs");
const Path = require("path");
module.exports = ({ path }, callback) => {
  const filepath = Path.resolve(__dirname, "../", path);
  fs.readdir(filepath, (err, files) => {
    console.log("=======LOADING FILES=======");
    if (err) {
      return console.error(err);
    }
    const filesWithJS = files.filter(file => file.split(".").pop() === "js");
    const [firstFileWithJS = null] = filesWithJS;
    if (!firstFileWithJS) {
      return console.error("No command files to load!");
    }
    filesWithJS.forEach((fileName, i) => {
      const command = require(`${filepath}/${fileName}`);
      console.log(`${i + 1}: ${fileName} loaded`);
      callback({ fileName, index: i, library: command });
    });
  });
};
