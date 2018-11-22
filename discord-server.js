const Discord = require("discord.js");
const db = require("./firebase/index");
const ytdl = require("ytdl-core");
const webhooks = require("./socket.io");
const loadFiles = require("./utils/loader");
const socketIO = require("socket.io-client")(
  "http://localhost:" + process.env.PORT
); // connect as a client

const bot = new Discord.Client({
  disabledEvents: ["TYPING_START"]
});

bot.lastKLPmessage = null;
bot.commands = new Discord.Collection();
bot.socketIOEVENTS = new Discord.Collection();
bot.selfEVENTS = new Discord.Collection();

bot.login(process.env.KOREAN_DICT_BOT_DISCORD_TOKEN);
const broadcastState = {
  broadcast: bot.createVoiceBroadcast(),
  paused: false,
  currentAudio: null,
  currentInfo: null,
  time: null
};
broadcastState.broadcast.on("subscribe", dispatcher => {
  dispatcher.on("error", e => console.log("dispatcher error", e));
  dispatcher.on("debug", info => console.info("dispatcher debug", info));
  console.log("New broadcast subscriber!");
});

broadcastState.broadcast.on("unsubscribe", dispatcher => {
  console.log("Channel unsubscribed from broadcast :(");
});

broadcastState.broadcast.on("end", () => bot.playNextSong());
broadcastState.broadcast.on("error", () => {
  broadcastState.broadcast.destroy();
  broadcastState.broadcast = bot.createVoiceBroadcast();
  prepareKLPChannel();
});

// use fire for admin purposes, in discord use !admin eval bot.fire('restart') to restart the server
bot.fire = action => {
  const { spawn } = require("child_process");
  switch (action) {
    case "restart":
      const subprocess = spawn(process.argv[0], process.argv.slice(1), {
        // spawn new process
        detached: true,
        stdio: ["ignore"]
      });
      subprocess.unref();
      bot.fire("shutdown"); // close this process
      return "restarting";
    case "shutdown":
      process.exit();
      return "shutdown";
    case "skip": // run end on broadcast should playNextSong()
      broadcastState.broadcast.end();
      return "skipping";
    case "pause": // pause broadcast
      broadcastState.broadcast.pause();
      broadcastState.paused = true;
      return "pausing";
    case "resume": // resume broadcast
      broadcastState.broadcast.resume();
      broadcastState.paused = false;
      return "resuming";
    default:
      return "please provide an action";
  }
};
bot.run = bot.fire; // sometimes I forget which one ;)

bot.prepareKLPChannel = () => {
  bot.playNextSong();
  const channel = bot.channels.get(process.env.INITIAL_VOICE_CHANNEL);
  bot.connectToBroadcast(channel);
};

bot.connectToBroadcast = channel => {
  if (!channel) return console.error("The channel does not exist!");
  // join channel
  channel
    .join()
    .then(connection => {
      connection.playBroadcast(broadcastState.broadcast);
      connection.on("error", err => {
        console.log("error with voice channel");
        connection.disconnect();
        bot.connectToBroadcast(channel);
      });
    })
    .catch(err => console.log("could not join audio channel"));
};

bot.playNextSong = async () => {
  const audio = await bot.getNextAudio();
  if (audio === null) {
    bot.playNextSong(); // try again
  } else {
    bot.playAudioToBroadcast(audio);
  }
};

bot.getNextAudio = async () => {
  let queue = await db.getPlaylistFromDB();
  if (queue === null) {
    return null;
  }
  // add currentAudio to end of queue
  const currentAudio = queue.shift(); // remove from list
  queue.push(currentAudio); // add currnetAudio to end of queue
  await webhooks.updatePlaylist(queue); // update list
  return currentAudio;
};

bot.playAudioToBroadcast = audio => {
  const stream = ytdl(audio, { filter: "audioonly" });
  broadcastState.broadcast.playStream(stream);
};

// pause if no one is listening
setInterval(() => {
  bot.pauseBroadcast();
}, 3000);

bot.pauseBroadcast = () => {
  let totalMembers = -1; // subtract ourself
  const connections = bot.voiceConnections.array();
  connections.forEach(({ channel }) => {
    let { members = null } = channel;
    if (members) {
      totalMembers = members.array().length;
    }
  });
  if (totalMembers === 0 && !broadcastState.paused) {
    bot.fire("pause");
    console.log("Pausing broadcast", total, "users connected");
  } else if (totalMembers > 0 && broadcastState.paused) {
    bot.fire("resume");
    console.log("Resuming broadcast", total, "users connected");
  }
};

// Load needed libraries and attach event listeners

loadFiles({ path: "./commands/" }, ({ library }) => {
  const possibleCommands = Object.keys(library.prefix);
  // add all prefixes of each command
  possibleCommands.forEach(prefix => {
    bot.commands.set(prefix, {
      ...library,
      name: prefix,
      ...library.prefix[prefix]
    });
  });
});
socketIO.on("connect", () => {
  loadFiles({ path: "./events/discord.socket.io/" }, ({ library }) => {
    socketIO.on(library.name, message => library.handle({ message, bot, db }));
  });
});

loadFiles({ path: "./events/discord.bot/" }, ({ library }) => {
  bot.selfEVENTS.set(library.name, library);
  bot.on(library.name, message => library.handle({ message, bot, db }));
});
loadFiles({ path: "./events/firebase/" }, ({ library }) => {
  if(library.needsBot){
    library.handle({ bot, db })
  }

  
});
