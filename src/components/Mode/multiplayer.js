import React, { Component } from 'react';
import { Button } from 'react-materialize';

export default class Multiplayer extends Component {

  static get propTypes() {
    return {
      roomGenerator: React.PropTypes.func,
      joinRoom: React.PropTypes.func,
      getInput: React.PropTypes.func
    };
  }

  constructor(props) {
    super(props);
    this.roomGenerator = this.props.roomGenerator.bind(this);
    this.joinRoom = this.props.joinRoom.bind(this);
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
        <Button waves="light">Join room</Button>
      )
    };

    return (
      <div className="room-input">
        <form >
          {this.props.roomCreated ? null : html.generateButton}
          {this.props.roomCreated ? html.roomCreated : null}
        </form>

        <h5>{this.props.roomCreated ? null : 'OR'}</h5>
        <input
          type="text"
          placeholder="Enter a room to join"
          value={this.props.roomId}
          onChange={this.getInput} />

        {(this.props.host.room !== this.props.roomId) && this.props.roomId ? html.joinButton : null}
      </div>
    );
  }
}
