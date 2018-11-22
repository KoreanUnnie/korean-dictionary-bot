//Socket.io
const io = require('../next-server').io;
const fetchVideoInfo = require("youtube-info");
const youtube = require('../resources/youtube-api');
const firebase = require('../firebase');
const constants = require('./constants');
io.on('connection', (socket) => {
    sendUserPlaylist(socket);
    listenToSocket(socket);
    console.log('Connected with Socket ', socket.id);
});
const client = require('socket.io-client')('http://localhost:' + process.env.PORT); // connect as a client

const videoConstructor = (info)=>{
    const {channelId = '', channelThumbnailUrl = '', datePublished = '', description = '', duration = 0, genre = '', owner = '', thumbnailUrl = '', title = '', url = '', videoId = ''} = info;
    return {channelId, channelThumbnailUrl, datePublished, description, duration, genre, owner, thumbnailUrl, title, url, videoId}
};

const sendUserPlaylist = async (socket) => {
    const playlist = await firebase.getPlaylistFromDB();
    const info = await firebase.getPlaylistInfoFromDB();
    if (playlist) {
        const updatedPlaylist = playlist.map((id) => {
            if (info[id]) {
                return info[id];
            } else {
                return null;
            }
        })
        //console.log('sending user playlist')
        socket.emit(constants.SEND_USER_PLAYLIST, updatedPlaylist)
    }

};

const startAddPlaylistItem = (item) => {
    youtube.getID(item, (id) => { //get the id
        io.emit(constants.ADD_PLAYLIST_ITEM, id); // pass id
    }, (error) => {
        io.emit(constants.ERROR_ADD_PLAYLIST_ITEM, { item: item, error: error });
    });
};

const addPlaylistItem = (id) => {
    fetchVideoInfo(id, async (err, info) => {
        if (err) {
            io.emit(constants.ERROR_ADD_PLAYLIST_ITEM, err)
        } else {
            //add to firebase, then call success event
            const updatedInfo = videoConstructor(info);
            firebase.sendVideoInfoToDB(updatedInfo);
            let playlist = await firebase.getPlaylistFromDB();
            if(!playlist){
                playlist = [];
            }
            playlist.push(updatedInfo.videoId);
            updatePlaylist(playlist);
            io.emit(constants.SUCCESS_ADD_PLAYLIST_ITEM, updatedInfo);
        }
    })
};

const successAddPlaylistItem = (info) =>{};

const errorAddPlaylistItem = (error) => console.log('error adding playlist item', error);

const updatePlaylist = async (array) => {
    await firebase.updateVideoPlaylist(array);
    io.emit(constants.UPDATE_PLAYLIST, array);
    sendUserPlaylist(io);
};

const listenToSocket = (socket) => {
    socket.on(constants.START_ADD_PLAYLIST_ITEM, startAddPlaylistItem);
    socket.on(constants.ADD_PLAYLIST_ITEM, addPlaylistItem);
    socket.on(constants.SUCCESS_ADD_PLAYLIST_ITEM, successAddPlaylistItem);
    socket.on(constants.ERROR_ADD_PLAYLIST_ITEM, errorAddPlaylistItem);
    //socket.on(constants.UPDATE_PLAYLIST, updatePlaylist);
}

module.exports.updatePlaylist = updatePlaylist;

listenToSocket(client);