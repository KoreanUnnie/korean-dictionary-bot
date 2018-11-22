const handle = async ({ bot }) => {
  bot.user.setActivity("Looking up words!");
  bot.prepareKLPChannel();
  console.log(
    `Bot is online!\n${bot.users.size} users, in ${
      bot.guilds.size
    } servers connected.`
  );
};

module.exports = {
  handle,
  name: "ready"
};
