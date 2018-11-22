

const handle = ({bot})=>{
  const { db } = require("../../firebase");
  const Queue = require("firebase-queue");
  const livechatDBResource = "livechat";
  
  const queue = new Queue(
    db.ref(livechatDBResource),
    { sanitize: false, suppressStack: true },
    (msg, progress, resolve, reject) => {
      processChat(msg);
      return db
        .ref(livechatDBResource)
        .child(msg._id)
        .remove()
        .then(resolve)
        .catch(reject);
    }
  );
  
  const processChat = msg => {
    if (msg.author !== "Nightbot" && msg.author !== "Korean Dictionary *") {

      handleMessage({message: msg})
    }
  };
  const { sendLiveMessageToDB } = require("../../firebase");
const handleMessage = ({ message }) => {
  message.channel = {
    send: msg => sendToYoutube({ message, payload: msg }),
    type: "youtube"
  };
  message.delete = () => {};
  const messageCmd = bot.selfEVENTS.get("message");
  if (messageCmd) {
    messageCmd.handle({ message, bot });
  }
};

const sendToYoutube = async ({ payload, message }) => {
  const {
    author,
    content,
    timestamp,
    timestampUsec,
    videoId,
    thumbnailUrl
  } = message;
  if (typeof payload === "string") {
    payload = `@${message.author} ` + payload;
    if (payload.length > 197) {
      payload = payload.substring(0, 197);
      payload = payload + "...";
    }
    sendLiveMessageToDB({
      payload,
      author,
      content,
      timestamp,
      timestampUsec,
      videoId,
      thumbnailUrl
    });
  }
};
}

module.exports = {
  needsBot: true,
  handle
};

