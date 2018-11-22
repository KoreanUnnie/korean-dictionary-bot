import { Component } from "react";
import Divider from "muicss/lib/react/divider";
import {
  START_ADD_PLAYLIST_ITEM,
  SUCCESS_ADD_PLAYLIST_ITEM,
  UPDATE_PLAYLIST,
  SEND_USER_PLAYLIST
} from "../socket.io/constants";
let s1 = { verticalAlign: "middle" };
let s2 = { textAlign: "right" };

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
        console.log("got playlist from send user", array);
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
  }

  addVideo(str) {
    console.log("addVideo");
    this.setState({ inputValue: "", addingVideo: true });
    this.props.socket.emit(START_ADD_PLAYLIST_ITEM, str);
  }
  handleInputChange(e) {
    e.preventDefault();
    const value = e.target.value;
    this.setState({ inputValue: value });
  }
  shorten(text, maxLength) {
    var ret = text;
    if (ret.length > maxLength) {
      ret = ret.substr(0, maxLength - 3) + "…";
    }
    return ret;
  }
  render() {
    const current = this.state.playlist[this.state.playlist.length - 1];
    return (
      <main>
        <style>{`
                body{
                    padding: 10px;
                    background-color:#36393f;
                    color: white;
                }
                img{
                    width: 100%;
                }
                .channel{
                    height: 48px;
                    width: 48px;
                    position: absolute;
                    bottom: -5px;
                    right: -5px;
                }
                .comming{
                    border: 1px;
                    border-radius: 25px;
                    background-color: #32363c;
                    justify-content: space-between;
                    display: flex;
                    color: white;
                    padding: 15px;
                    margin: 5px;
                }
                .next{
                    font-size: 30px;
                }
                .mui-divider{
                    background-color: rgba(255,255,255, 0.12)
                }
                .title{
                    display: flex;
                    justify-content:center;
                    padding: 5px;
                    font-size: 18px;
                }
                .thumbnails{
                    position: relative;
                }
        }`}</style>
        {current && (
          <div>
            <div className="title">
              <div>
                <b>
                  {this.shorten(`${current.title} from ${current.owner}`, 55)}
                </b>
              </div>
            </div>
            <div className="thumbnails">
              <img src={current.thumbnailUrl} />
              <img className="channel" src={current.channelThumbnailUrl} />
            </div>
          </div>
        )}
        <div className="comming">
          <div className="next">
            <b>Up next:</b>
          </div>
          <div>
            {this.state.playlist
              .filter((v, i) => v.videoId !== current.videoId && i <= 1)
              .map((video, index) => (
                <div key={index}>
                  <div>
                    <b>
                      {this.shorten(
                        `${index + 1}. ${video.title} from ${video.owner}`,
                        45
                      )}
                    </b>
                  </div>
                  <Divider />
                </div>
              ))}
          </div>
        </div>
      </main>
    );
  }
}

export default Index;
