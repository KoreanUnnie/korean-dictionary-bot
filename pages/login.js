import { Component } from "react";
import Divider from "muicss/lib/react/divider";
import {
  SUCCESS_ADD_PLAYLIST_ITEM,
  ERROR_ADD_PLAYLIST_ITEM,
  UPDATE_PLAYLIST,
  SEND_USER_PLAYLIST
} from "../socket.io/constants";

class Index extends Component {
  state = {
    subscribe: false,
    subscribed: false,
    name: "",
    version: "",
    addingVideo: false,
    videoInfos: {},
    playlist: [],
    inputValue: "",
    latestVideo: null
  };

  subscribe = () => {
    if (this.state.subscribe && !this.state.subscribed) {
      // connect to WS server and listen event
      this.props.socket.on(SEND_USER_PLAYLIST, array => {
        console.log("got playlist from send user");
        if (!array) {
          return;
        }
        this.setState({ playlist: array });
      });
      this.props.socket.on(SUCCESS_ADD_PLAYLIST_ITEM, info => {
        console.log("success", info);
        let updatedVideoInfos = this.state.videoInfos;
        updatedVideoInfos[info.videoId] = info;
        this.setState({
          addingVideo: false,
          videoInfos: updatedVideoInfos,
          latestVideo: info
        });
      });
      this.setState({ subscribed: true });
    }
  };
  async componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate() {
    this.subscribe();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.socket && !state.subscribe) return { subscribe: true };
    return null;
  }

  // close socket connection
  componentWillUnmount() {
    this.props.socket.off(UPDATE_PLAYLIST, console.log("disconnected"));
    this.props.socket.off(SEND_USER_PLAYLIST, console.log("disconnected"));
    this.props.socket.off(
      SUCCESS_ADD_PLAYLIST_ITEM,
      console.log("disconnected")
    );
    this.props.socket.off(ERROR_ADD_PLAYLIST_ITEM, console.log("disconnected"));
  }

  render() {
    const currentVideo = this.state.playlist[this.state.playlist.length - 1];
    return (
      <main>
        <style>{``}</style>
        <div>
          <div>{currentVideo.title}</div>
        </div>
        <b>in Queue:</b>
        {this.state.playlist.map((video, index) => (
          <div key={index}>
            <div>
              <span>{video.title}</span>
            </div>
            <Divider />
          </div>
        ))}
      </main>
    );
  }
}

export default Index;
