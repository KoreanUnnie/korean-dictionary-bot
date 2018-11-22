import { Component } from "react";
import fetch from "isomorphic-unfetch";
import Appbar from "muicss/lib/react/appbar";
import Button from "muicss/lib/react/button";
import Container from "muicss/lib/react/container";
import Form from "muicss/lib/react/form";
import Input from "muicss/lib/react/input";
import Divider from "muicss/lib/react/divider";
import {
  START_ADD_PLAYLIST_ITEM,
  SUCCESS_ADD_PLAYLIST_ITEM,
  ERROR_ADD_PLAYLIST_ITEM,
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
      this.props.socket.on(ERROR_ADD_PLAYLIST_ITEM, error => {
        console.log("error", error);
        this.setState({ addingVideo: false });
      });
      this.setState({ subscribed: true });
    }
  };
  async componentDidMount() {
    const getAppInfo = await fetch("/getAppInfo");
    const app = await getAppInfo.json();
    this.setState({ ...app });
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

  render() {
    return (
      <main>
        <style>{`
        #wordcloud_car{
            height: 600px;
        }
        .link-wrapper{
            display: flex;
            justify-content: space-around;
        }`}</style>
        <Appbar>
          <table width="100%">
            <tbody>
              <tr style={s1}>
                <td
                  className="mui--appbar-height"
                  style={{ paddingLeft: 15, fontWeight: "bold" }}
                >
                  Korean Listening Practice Queue
                </td>
                <td className="mui--appbar-height" style={s2}>
                  {this.state.name} v{this.state.version}
                </td>
              </tr>
            </tbody>
          </table>
        </Appbar>
        <Container>
          <Form inline={true} onSubmit={e => e.preventDefault()}>
            <Input
              style={{ minWidth: 260 }}
              placeholder="Type a youtube video name or URL"
              value={this.state.inputValue}
              onChange={e => this.handleInputChange(e)}
            />
            <Button
              color="primary"
              onClick={() => this.addVideo(this.state.inputValue)}
            >
              submit
            </Button>
          </Form>
          {this.state.addingVideo && (
            <div style={{ color: "orange" }}>Adding Video...</div>
          )}
          {!this.state.addingVideo && this.state.latestVideo && (
            <div style={{ color: "green" }}>
              Successfully added:{" "}
              <span style={{ color: "black" }}>
                {this.state.latestVideo.title}
              </span>{" "}
            </div>
          )}
          <b>Videos in Queue:</b>
          {this.state.playlist.map((video, index) => (
            <div key={index}>
              <div>
                <span>{video.title}</span>
              </div>
              <Divider />
            </div>
          ))}
        </Container>
      </main>
    );
  }
}

export default Index;
