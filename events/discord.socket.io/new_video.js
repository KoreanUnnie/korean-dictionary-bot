const constants = require("../../utils/constants");
var numeral = require("numeral");
const handle = async ({ bot, message, db }) => {
  const video = message;
  const channelInfo = await db.getChannelInfoFromDB(video.channelId);
  let verb = "uploaded";
  if (video.liveBroadcastContent === "live") {
    verb = "is live";
  }
  if (video.liveBroadcastContent === "upcoming") {
    verb = "is about to go live";
  }
  const channel = await bot.channels.get(process.env.YOUTUBE_DISCORD_CHANNEL);
  let options = constants.GET_DEFAULT_MESSAGE_OPTIONS();
  options.setAuthor(
    `${channelInfo.title} is now at ${numeral(
      channelInfo.subscriberCount
    ).format("0a")} subscribers and ${numeral(channelInfo.viewCount).format(
      "0a"
    )} total views.`,
    channelInfo.smallImage,
    channelInfo.url
  );
  options.setURL(video.videoUrl);
  await channel.send(
    `**@everyone ${video.channelTitle}** ${verb} **${video.title}** at ${
      video.videoUrl
    }`
  );
  await channel.send(options);
};

module.exports = {
  handle,
  name: "NEW_VIDEO"
};
