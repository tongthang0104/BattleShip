'use strict';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Board from './components/board';
import Grid from './components/grid';
import MainCss from './main.css';
import Socket from './sockets';
import GameMode from './components/Mode/gameMode';
import _ from 'lodash';

class App extends Component {

  constructor(props) {
    super(props);
    this._size = 30;
    this.state = {
      gameReady: false,
      roomCreated: null,
      roomId: null,
      roomValid: false,
      gameStart: false
    };
    this.startGame = this.startGame.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.roomGenerator = this.roomGenerator.bind(this);
    this.getRoomInput = this.getRoomInput.bind(this);
  }

  componentDidMount() {
    Socket.on('gameReady', (data) => {
      this.setState({
        gameReady: data
      });
      console.log('gameReady', data);
    });
  }

  playerShoot(shotPosition) {
    Socket.on('playerShoot', (shotPosition));
    console.log('shotPosition: ', shotPosition);
  }

  startGame() {
    console.log('Game is starting');
    this.setState({
      gameStart: true
    });
  }

  roomGenerator() {
    Socket.emit('createRoom');
  }

  joinRoom() {
    const data =  {
      roomId: this.state.roomId
    };

    if (this.state.roomValid) {
      // Call JoinRoom at server and send the data Object .
      $('#multiplayerModal').closeModal();

      Socket.emit('JoinRoom', data);
      this.setState({
        roomId: ''
      });
    } else {
      this.setState({
        roomId: ''
      });
      Materialize.toast('This room is not available', 4000);
    }
  }

  validateRoom(flag) {
    if (flag.valid) {
      this.setState({roomValid: true});
      console.log('valid', this.state.roomValid);
    } else {
      this.setState({roomValid: false});
      console.log('not valid');
    }
  }

  getRoomInput(e) {
    const roomId = e.target.value;
    this.setState({roomId: e.target.value});

    if (this.state.roomValid) {
      this.setState({roomValid: true});
    }
    _.debounce(Socket.emit('checkRoom', roomId), 500);
  }

  render() {
    const gameHTML = {
      game: (
        <div className={MainCss.main}>
          <h2>Player1</h2>
          <Board
            key={1}
            squarePx={this._size}
          />
          <br />
          <p>{'Select and click below to fire to '}<strong>Player 2</strong>{' territory'}</p>
          {this.state.gameReady ? <Grid
            key={2}
            squarePx={this._size}
            playerShoot={this.playerShoot}
          /> : null}
        </div>
      ),
      gameMode: (
        <GameMode
          startGame={this.startGame}
          roomCreated={this.state.roomCreated}
          roomId={this.state.roomId}
          roomGenerator={this.roomGenerator}
          roomValid={this.state.roomValid}
          joinRoom={this.joinRoom}
          getRoomInput={this.getRoomInput}
        />
      )
    };

    return this.state.gameStart ? gameHTML.game : gameHTML.gameMode;
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
