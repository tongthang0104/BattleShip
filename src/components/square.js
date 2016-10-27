'use strict';

import React, {Component} from 'react';
import Socket from '../sockets';

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
let SHIPS_PROTOTYPE = SHIPS.slice();

export default class Square extends Component {

  static get propTypes() {
    return {
      Xposition: React.PropTypes.number.isRequired,
      Yposition: React.PropTypes.number.isRequired,
      size: React.PropTypes.number.isRequired,
      index: React.PropTypes.number.isRequired,
      addShip: React.PropTypes.func,
      playerShoot: React.PropTypes.func
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      hover: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.toggleHover = this.toggleHover.bind(this);
  }

  componentDidMount() {
    Socket.on('gameOver', (data) => {
      SHIPS_PROTOTYPE = SHIPS.slice();
    });
  }

  handleClick(e) {
    e.preventDefault();

    if (!CURRENTSHIP) {
      CURRENTSHIP = SHIPS_PROTOTYPE.shift();
    } else if (this.props.shipAdded) {
      CURRENTSHIP = SHIPS_PROTOTYPE.shift();
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

  // Hover CSS
  toggleHover() {
    this.setState({
      hover: !this.state.hover
    });
  }

  render() {
    const squareStyle = {
      position: 'absolute',
      border: '1px solid #d4862b',
      left: `${this.props.Xposition * this.props.size}px`,
      top: `${this.props.Yposition * this.props.size}px`,
      width: `${this.props.size}px`,
      height: `${this.props.size}px`,
      cursor: 'pointer',
      zIndex: '0'
    };

    if (this.state.hover) {
      squareStyle['background-color'] = '#d4862b';
    }

    return <div className={`points offset ${this.props.index}`} style={squareStyle} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} onClick={this.handleClick} />;
  }
}
