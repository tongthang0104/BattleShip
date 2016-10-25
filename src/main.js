'use strict';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Board from './components/board';
import Grid from './components/grid';
import MainCss from './main.css';
import Socket from './sockets';
import GameMode from './components/Mode/gameMode';
import { Button, Modal} from 'react-materialize';
import Modals from 'react-modal';
import _ from 'lodash';

class App extends Component {

  constructor(props) {
    super(props);
    this._size = 30;
    this.state = {
      gameReady: false,
      roomCreated: null,
      roomId: '',
      roomValid: false,
      gameStart: false,
      playerJoinedModals: false,
      shipSunk: []
    };
    this.startGame = this.startGame.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.roomGenerator = this.roomGenerator.bind(this);
    this.getRoomInput = this.getRoomInput.bind(this);
  }

  // Handle Socket listener
  componentDidMount() {
    Socket.on('gameReady', (data) => {
      this.setState({
        gameReady: data
      });
      console.log('gameReady', data);
    });

    Socket.on('newGameCreated', (data) => {
      this.setState({
        roomCreated: data.roomId
      });
    });

    Socket.on('playerJoined', data => {
      $('#multiplayerModal').closeModal();
      console.log('playerJoined room: ', data.roomId);
      this.setState({
        roomId: data.roomId,
        playerJoinedModals: true
      });
      console.log(this.state.playerJoinedModals);
      Materialize.toast('New Player Joined', 4000);
    });

    Socket.on('validateRoom', (flag) => {
      if (flag.valid) {
        this.setState({roomValid: true});
        console.log('valid', this.state.roomValid);
      } else {
        this.setState({roomValid: false});
        console.log('not valid');
      }
    });

    Socket.on('gameStartedByHost', (data) => {
      console.log('gameStart:', data.gameStart);
      this.setState({
        playerJoinedModals: false,
        gameStart: data.gameStart
      });
    });
  }

  playerShoot(shotPosition) {
    Socket.on('playerShoot', (shotPosition));
    console.log('shotPosition: ', shotPosition);
  }

  startGame() {
    console.log('Game is starting');
    this.setState({
      gameStart: true,
      playerJoinedModals: false
    });

    let data = {
      roomId: this.state.roomCreated,
      gameStart: true
    }

    Socket.emit('hostStartGame', data)
  }

  roomGenerator(e) {
    e.preventDefault()
    Socket.emit('createRoom');
  }

  joinRoom() {
    const data =  {
      roomId: this.state.roomId
    };
    this.setState({
      roomCreated: null
    });

    if (this.state.roomValid) {
      // Call JoinRoom at server and send the data Object .
      $('#multiplayerModal').closeModal();

      Socket.emit('joinRoom', data);
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

  getRoomInput(e) {
    const roomId = e.target.value;
    this.setState({roomId: e.target.value});

    if (this.state.roomValid) {
      this.setState({roomValid: true});
    }
    Socket.emit('checkRoom', roomId);
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

    const customStyles = {
      content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        wordWrap              : 'break-word',
        width                 : '65%',
        background            : '#eee',
      }
    };

    return (
      <div>
        {this.state.gameStart ? gameHTML.game : gameHTML.gameMode}
        <Modals
          isOpen={this.state.playerJoinedModals}
          shouldCloseOnOverlayClick={false}
          style={customStyles}>
          {this.state.roomCreated ? "Player joined! Press Start to play" : "Waiting for host"}
          <div className="progress">
            <div className="indeterminate"></div>
          </div>
          {this.state.roomCreated ? <Button onClick={this.startGame}>Start Game</Button> : null}
        </Modals>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
