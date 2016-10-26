import React, { Component } from 'react';
import { Button } from 'react-materialize';
import style from '../../main.css'
export default class Multiplayer extends Component {

  static get propTypes() {
    return {
      joinRoom: React.PropTypes.func,
      roomGenerator: React.PropTypes.func,
      getRoomInput: React.PropTypes.func,
      roomId: React.PropTypes.string,
      roomCreated: React.PropTypes.string,
      startGame: React.PropTypes.func
    };
  }

  constructor(props) {
    super(props);
    this.roomGenerator = this.props.roomGenerator.bind(this);
    this.joinRoom = this.props.joinRoom.bind(this);
    this.getRoomInput = this.props.getRoomInput.bind(this);
    this.hostOrNot = this.hostOrNot.bind(this);
  }

  hostOrNot() {
    if (this.props.roomCreated) {
      return true;
    }

    return false;
  }

  render() {
    const html = {
      roomCreated: (
          <div>
            <br />
            <h4>You Joined Room: {this.props.roomCreated}</h4>
            <h5 className="join-room">Copy and Paste the room to invite your friend!</h5>
          </div>),
      generateButton: (
          <Button onClick={this.roomGenerator}>Create a room</Button>
        ),
      joinButton: (
        <Button onClick={this.joinRoom} waves="light">Join room</Button>
      )
    };

    return (
      <div className={style.room_input}>
        <form >
          {this.hostOrNot() ? null : html.generateButton}
          {this.hostOrNot()  ? html.roomCreated : null}
        </form>
        <br />
        <h5>OR</h5>
        <input
          type="text"
          placeholder="Enter a room to join"
          value={this.props.roomId}
          onChange={this.getRoomInput} />

        {(this.props.roomCreated !== this.props.roomId) && this.props.roomId ? html.joinButton : null}
      </div>
    );
  }
}
