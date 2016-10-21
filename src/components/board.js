'use strict';
import React, {Component} from 'react';
import Grid from './grid';
import _ from 'lodash';
import BattleShip from './Ships/Battleship';
import Cruiser from './Ships/Cruiser';
import Destroyer from './Ships/Destroyer';
import PatrolBoat from './Ships/PatrolBoat';
import Submarine from './Ships/Submarine';

const SHIPTYPE = {
  SUBMARINE: 'submarine',
  BATTLE_SHIP: 'battleship',
  CRUISER: 'cruiser',
  DESTROYER: 'destroyer',
  PATROL_BOAT: 'patrolBoat'
};

const SHIPSIZE = {
  SUBMARINE: 5,
  BATTLE_SHIP: 4,
  CRUISER: 3,
  DESTROYER: 2,
  PATROL_BOAT: 1
};

const SHIPORIENTATION = {
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape'
};

export default class Board extends Component {

  static get propTypes() {
    return {
      size: React.PropTypes.number,
      squarePx: React.PropTypes.number,
      fireX: React.PropTypes.number,
      fireY: React.PropTypes.number
    };
  }

  static get defaultProps() {
    return {
      size: 10,
      squarePx: 40
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      ships: []
    };
  }

  sizeShip(TYPE) {
    switch (TYPE) {
      case SHIPTYPE.SUBMARINE:
        return SHIPSIZE.SUBMARINE;

      case SHIPTYPE.BATTLE_SHIP:
        return SHIPSIZE.BATTLE_SHIP;

      case SHIPTYPE.CRUISER:
        return SHIPSIZE.CRUISER;

      case SHIPTYPE.DESTROYER:
        return SHIPSIZE.DESTROYER;

      case SHIPTYPE.PATROL_BOAT:
        return SHIPSIZE.PATROL_BOAT;

      default:
        return 0;
    }
  }
  // shipView(ship, key) {
  //   switch (ship.type) {
  //     case expression:
  //
  //       break;
  //     default:
  //
  //   }
  // }

  render() {

    return (
      <div>
        <Grid
          size={this.props.size}
          squarePx = {this.props.squarePx}
        />
      </div>

    );
  }
}
