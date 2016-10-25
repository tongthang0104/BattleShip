import React, { Component } from 'react';
import { Button } from 'react-materialize';

export default class Multiplayer extends Component {

  static get propTypes() {
    return {
      joinRoom: React.PropTypes.func,
      roomGenerator: React.PropTypes.func,
      getRoomInput: React.PropTypes.func,
      roomId: React.PropTypes.number,
      roomCreated: React.PropTypes.number,
      roomValid: React.PropTypes.boolean,
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
            <h5 className="join-room">Invite a friend in the chatroom!</h5>
          </div>),
      generateButton: (
          <Button onClick={this.roomGenerator}>Create room</Button>
        ),
      joinButton: (
        <Button onClick={this.joinRoom} waves="light">Join room</Button>
      )
    };

    return (
      <div className="room-input">
        <form >
          {this.hostOrNot() ? null : html.generateButton}
          {this.hostOrNot()  ? html.roomCreated : null}
        </form>

        <h5>{this.hostOrNot()  ? null : 'OR'}</h5>
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
