const responses = [
  {
    text: "me: trying to leave the dog park",
    image: "https://pbs.twimg.com/media/Drftl48U0AA3x0M.jpg"
  },
  {
    text: "멍멍 :dog:"
  },
  {
    text:
      "“stop and smell the roses”, more like “stop and sniff the places other dogs have peed”"
  },
  {
    image: "https://media.giphy.com/media/1d7F9xyq6j7C1ojbC5/giphy.gif",
    text: ":smile:"
  },
  {
    image: "https://media.giphy.com/media/LqafmeaBVxCRG/giphy.gif",
    text: ":sunglasses:"
  }
];

const handle = ({ message, options, cmd }) => {
  const response = responses[Math.floor(Math.random() * responses.length)];
  if (response.image) {
    options.setImage(response.image);
  }
  const string = response.text;
  options.setDescription(string);
  if (message.channel.type === "youtube") {
    return message.channel.send(string);
  }
  //options.setDescription(string);
  return message.channel.send(options);
};

module.exports = {
  handle,
  prefix: {
    "!ggami": {
      match: "ggami",
      value: "!ggami ",
      lang: "en",
      display: "lang"
    },
    "!gam": {
      match: "ggami",
      value: "!gam ",
      lang: "en",
      display: false
    },
    "!까미": {
      match: "ggami",
      value: "!까미 ",
      lang: "ko",
      display: "lang"
    },
    "!dog": {
      match: "ggami",
      value: "!dog ",
      lang: "en",
      display: false
    },

    "!g": {
      match: "ggami",
      value: "!g ",
      lang: "en",
      display: false
    }
  },
  usage: "!ggami",
  description: "It's Ggami! 까미!",
  exampleUsage: "!까미",
  exampleResult: "-"
};
