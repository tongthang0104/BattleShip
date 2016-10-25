'use strict';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Board from './components/board';
import Grid from './components/grid';
import MainCss from './main.css';
import Socket from './sockets';
import GameMode from './components/Mode/gameMode';

class App extends Component {

  constructor(props) {
    super(props);
    this._size = 30;
    this.state = {
      gameReady: false,
      roomCreated: null,
      roomId: null,
      roomValid: null,
      gameStart: false
    };
    this.startGame = this.startGame.bind(this);
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
