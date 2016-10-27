'use strict';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Board from './components/board';
import Grid from './components/grid';
import MainCss from './main.css';
import Socket from './sockets';
import GameMode from './components/Mode/gameMode';
import { Button, Modal } from 'react-materialize';
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
      shipSunk: [],
      player2Ready: false,
      receivedShot: null,
      myTurn: false,
      allShotPosition: [],
      hitPos: [],
      gameOverModal: false
    };
    this.startGame = this.startGame.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.roomGenerator = this.roomGenerator.bind(this);
    this.getRoomInput = this.getRoomInput.bind(this);
    this.playerShoot = this.playerShoot.bind(this);
    this.checkShotPosition = this.checkShotPosition.bind(this);
    this.closeGameOver = this.closeGameOver.bind(this);
  }

  // Handle Socket listener
  componentDidMount() {

    // Listen from server whenever all ships is added (Ourself);
    Socket.on('gameReady', (data) => {
      this.setState({
        gameReady: data
      });
      console.log('gameReady', data);
    });

    // Listen from server when client create a room (Ourself);

    Socket.on('newGameCreated', (data) => {
      this.setState({
        roomCreated: data.roomId
      });
    });

    // Listen from server when client successfully join a room;

    Socket.on('playerJoined', data => {
      $('#multiplayerModal').closeModal();
      this.setState({
        roomId: data.roomId,
        playerJoinedModals: true
      });
      Materialize.toast('New Player Joined', 4000);
    });

    // Listen from server to validate the roomId

    Socket.on('validateRoom', (flag) => {
      if (flag.valid) {
        this.setState({roomValid: true});
        console.log('valid', this.state.roomValid);
      } else {
        this.setState({roomValid: false});
        console.log('not valid');
      }
    });

    // Listen from Server when host start the game

    Socket.on('gameStartedByHost', (data) => {
      console.log('gameStart:', data.gameStart);
      this.setState({
        playerJoinedModals: false,
        gameStart: data.gameStart
      });
    });

    // When the other player added all ships

    Socket.on('player2Ready', (data) => {
      console.log('Player 2 is ready: ', data);
      this.setState({
        player2Ready: data
      });
    });

    Socket.on('receivedShot', (shotPosition) => {
      this.setState({
        receivedShot: shotPosition
      });
    });

    Socket.on('turnChange', (data) => {
      this.setState({
        myTurn: data.myTurn
      });
    });

    Socket.on('trackingGame', (data) => {
      console.log('Tracking Hit pos: ', data.hitPos);
      this.setState({
        // hitPos: the good shot position (hit a ship)
        hitPos: data.hitPos
      });
    });

    Socket.on('gameOver', (data) => {
      this.setState({
        gameOverModal: true
      });
    });
  }

  // Player make a shot

  playerShoot(shotPosition) {
    // Check if it is my turn or not
    if (this.state.myTurn) {
      // Check if this place is fired already
      if (this.checkShotPosition(this.state.allShotPosition, shotPosition)) {
        Materialize.toast('You already shot this place', 2000);
      } else {
        this.setState({
          // allShotPosition: position that were fired
          allShotPosition: [...this.state.allShotPosition, shotPosition],
          myTurn: false
        });

        // Notify server for the other player

        Socket.emit('playerShoot', {shotPosition: shotPosition, roomId: this.state.roomId, myTurn: true});
        console.log('shotPosition: ', shotPosition);
      }
    } else {
      Materialize.toast('The other player\'s turn', 2000);
    }
  }

  checkShotPosition(allShotPosition, shotPosition) {
    return _.find(this.state.allShotPosition, (pos) => {
      return pos.x === shotPosition.x && pos.y === shotPosition.y;
    });
  }

  // Host press button to start the game Or Single Player start button

  startGame() {
    console.log('Game is starting');
    this.setState({
      gameStart: true,
      playerJoinedModals: false
    });

    const data = {
      roomId: this.state.roomCreated,
      gameStart: true
    };

    // Notify Socket server

    Socket.emit('hostStartGame', data);
  }

  roomGenerator(e) {
    e.preventDefault();
    Socket.emit('createRoom');
  }

  // Client press a join button to join a room

  joinRoom() {
    const data =  {
      roomId: this.state.roomId
    };
    this.setState({
      roomCreated: null
    });

    // Validate the room

    if (this.state.roomValid) {
      // Call JoinRoom at server and send the data Object
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

  // On Change validate room with Socket.

  getRoomInput(e) {
    const roomId = e.target.value;
    this.setState({roomId: e.target.value});

    if (this.state.roomValid) {
      this.setState({roomValid: true});
    }

    Socket.emit('checkRoom', roomId);
  }

  closeGameOver() {
    this.setState({
      gameOverModal: false,
      gameStart: false,
      roomId: '',
      roomCreated: '',
      hitPos: [],
      allShotPosition: [],
      myTurn: false,
      player2Ready: false,
      gameReady: false
    })
  }

  render() {
    const modeHtml = () => {
      // If it is in multiplayer mode

      if (this.state.roomId) {
        return (
          <div>
            {(this.state.gameReady && this.state.player2Ready) ? <Grid
              key={2}
              squarePx={this._size}
              playerShoot={this.playerShoot}
              hitPos={this.state.hitPos}
            /> : <h3 style={{
              'width': '300px',
              'textAlign': 'center'
            }}>Place your ships and wait for the other player be ready!</h3>}
          </div>
        );
      }

      // Or single player mode
      return (
        <div>
          {(this.state.gameReady) ? <Grid
            key={2}
            squarePx={this._size}
            playerShoot={this.playerShoot}
            hitPos={this.state.hitPos}
          /> : null}
        </div>
      );
    };

    const gameHTML = {
      game: (
        <div className="container">
          <div className="row">
            <div className="col-sm-6">
              <Board
                key={1}
                squarePx={this._size}
                roomId={this.state.roomId}
                receivedShot={this.state.receivedShot}
              />
            </div>

            <div className="col-sm-6">
              {modeHtml()}
              {this.state.gameReady && this.state.player2Ready ? <h5>{'Select and click above to fire to '}<strong>Opponent</strong>{' territory'}</h5> : null}
              {this.state.gameReady && this.state.myTurn ? <h4 className="animated zoomIn">Your Turn</h4> : null}
            </div>
          </div>
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

    // Style for the modals

    const customStyles = {
      content: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        wordWrap: 'break-word',
        width: '65%',
        background: '#eee',
        display: 'inline-block'
      }
    };

    return (
      <div>
        {this.state.gameStart ? gameHTML.game : gameHTML.gameMode}
        <Modals
          isOpen={this.state.playerJoinedModals}
          shouldCloseOnOverlayClick={false}
          style={customStyles}>
          {this.state.roomCreated ? 'Player joined! Press Start to play' : 'Waiting for host'}
          <div className="progress">
            <div className="indeterminate"/>
          </div>
          {this.state.roomCreated ? <Button onClick={this.startGame}>Start Game</Button> : null}
        </Modals>

        <Modals
          isOpen={this.state.gameOverModal}
          shouldCloseOnOverlayClick={false}
          style={customStyles}>
          {this.state.hitPos.length === 22 ? <h2>Opponent's ships were destroyed! You won!</h2> : <h2>All your ships were sinked! You lost</h2>}
          <Button
            style={{
              display: 'block',
              marginLeft: '40%',
              marginTop: '20px'
            }}
            onClick={this.closeGameOver}>Close</Button>
        </Modals>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
