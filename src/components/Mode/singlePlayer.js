import React, { Component } from 'react';
import { Button } from 'react-materialize';

export default class SinglePlayer extends Component {

  static get propTypes() {
    return {
      gameStartInSinglePlayer: React.PropTypes.func
    };
  }

  render() {
    return (
      <div>
        <p>In this mode, you will fight against computer</p>
        <Button onClick={this.props.startGameClicked}>Start Game</Button>
      </div>
    );
  }
}
