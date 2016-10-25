'use strict';

import React, {Component} from 'react';
import { Button, Card, Collapsible, CollapsibleItem, Modal} from 'react-materialize';
import SinglePlayerMode from './singlePlayer';
import MultiplayerMode from './multiplayer';

export default class GameMode extends Component {

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

    this.state = {
      gameStart: false,
      singlePlayerMode: true
    };
    this.startGame = this.props.startGame.bind(this);
    this.startGameClicked = this.startGameClicked.bind(this);
  }

  startGameClicked() {
    this.props.startGame();
    $('#singlePlayerModal').closeModal();
  }

  render() {
    return (
      <div>
        <h1>BattleShip</h1>
        <Modal
          className="room-input"
          id="singlePlayerModal"
          header="Single Player Mode"
          bottomSheet
          trigger={
            <Button waves="light">Single Player</Button>
          }>
          <SinglePlayerMode startGameClicked={this.startGameClicked}/>
        </Modal>

        <Modal
          className="room-input"
          id="multiplayerModal"
          header="Create or Join a room"
          bottomSheet
          trigger={
            <Button waves="light">Multiplayer</Button>
          }>
          <MultiplayerMode
            roomCreated={this.props.roomCreated}
            roomId={this.props.roomId}
            roomGenerator={this.props.roomGenerator}
            roomValid={this.props.roomValid}
            joinRoom={this.props.joinRoom}
            getRoomInput={this.props.getRoomInput}/>
        </Modal>
      </div>
    );
  }
}
