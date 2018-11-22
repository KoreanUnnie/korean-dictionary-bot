const fetch = require("node-fetch");
const liveserverUrl = process.env.LIVE_STREAM_SERVER + "/live/";

const headers = message => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message })
});

const sendMessage = async ({ videoId, message }) => {
  try {
    const connection = await fetch(
      liveserverUrl + videoId + "/message",
      headers(message)
    );
    return await connection.json();
  } catch (error) {
    console.log("Could not send message", error);
    return null;
  }
};

module.exports = {
  sendMessage
};
