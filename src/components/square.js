'use strict';

import React, {Component} from 'react';
const SHIPTYPE = {
  SUBMARINE: 'submarine',
  BATTLE_SHIP: 'battleship',
  CRUISER: 'cruiser',
  DESTROYER: 'destroyer',
  PATROL_BOAT: 'patrolBoat'
};

const SHIPS = [SHIPTYPE.SUBMARINE,
  SHIPTYPE.BATTLE_SHIP,
  SHIPTYPE.CRUISER,
  SHIPTYPE.CRUISER,
  SHIPTYPE.DESTROYER,
  SHIPTYPE.DESTROYER,
  SHIPTYPE.PATROL_BOAT,
  SHIPTYPE.PATROL_BOAT,
  SHIPTYPE.PATROL_BOAT];

let CURRENTSHIP = null;

export default class Square extends Component {

  static get propTypes() {
    return {
      Xposition: React.PropTypes.number.isRequired,
      Yposition: React.PropTypes.number.isRequired,
      size: React.PropTypes.number.isRequired,
      index: React.PropTypes.number.isRequired,
      addShip: React.PropTypes.func,
      shipAdded: React.PropTypes.boolean,
      playerShoot: React.PropTypes.func
    };
  }

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();

    if (!CURRENTSHIP) {
      CURRENTSHIP = SHIPS.shift();
    } else if (this.props.shipAdded) {
      CURRENTSHIP = SHIPS.shift();
    }

    if (this.props.addShip) {
      this.props.addShip(CURRENTSHIP, this.props.Xposition, this.props.Yposition);
    } else if (this.props.playerShoot) {
      const shotPosition = {
        x: this.props.Xposition,
        y: this.props.Yposition
      };
      this.props.playerShoot(shotPosition);
    }
  }

  render() {
    const squareStyle = {
      position: 'absolute',
      border: '1px solid #777',
      left: `${this.props.Xposition * this.props.size}px`,
      top: `${this.props.Yposition * this.props.size}px`,
      width: `${this.props.size}px`,
      height: `${this.props.size}px`,
      cursor: 'pointer',
      zIndex: '0'
    };

    return <div className={`points offset ${this.props.index}`} style={squareStyle} onClick={this.handleClick} />;
  }
}
