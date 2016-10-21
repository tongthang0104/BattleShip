'use strict';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Board from './components/board';
import Grid from './components/grid';
import MainCss from './main.css';

class App extends Component {
  constructor(props) {
    super(props);
    this._size = 30;
  }

  render() {
    return (
      <div className={MainCss.main}>
        <h2>Player1</h2>
        <Board
          key={1}
          squarePx={this._size}
        />
        <br />
        <p>{'Select and click below to fire to '}<strong>{'Alien'}</strong>{' territory'}</p>
        <Grid
          key={2}
          squarePx={this._size}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
