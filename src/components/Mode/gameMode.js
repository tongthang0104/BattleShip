'use strict';

import React, {Component} from 'react';
import { Button, Card, Collapsible, CollapsibleItem, Modal} from 'react-materialize';
import SinglePlayerMode from './singlePlayer';
import MultiplayerMode from './multiplayer';

export default class GameMode extends Component {

  // static get propTypes() {
  //   return {
  //   };
  // }

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
          header='Single Player Mode'
          bottomSheet
          trigger={
            <Button waves="light">Single Player</Button>
          }>
          <SinglePlayerMode startGameClicked={this.startGameClicked}/>
        </Modal>

        <Modal
          className="room-input"
          id="multiplayerModal"
          header='Create or Join a room'
          bottomSheet
          trigger={
            <Button waves='light'>Multiplayer</Button>
          }>
          {/* <Multiplayer
            roomCreated={this.state.roomCreated}
            roomId={this.state.roomId} host={this.state.host}
            roomGenerator={this.roomGenerator}
            roomValid={this.state.roomValid}
            joinRoom={this.joinRoom}
            getInput={this.getInput}/> */}
        </Modal>
      </div>
    );
  }
}
