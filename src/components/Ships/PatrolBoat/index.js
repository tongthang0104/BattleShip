'use strict';

import Ship from './../allShips';
import ship1 from './img/patrol_boat_1.gif';

export default class Destroyer extends Ship {

  buildShip() {
    return [
      ship1
    ];
  }
}
