'use strict';

import Ship from './../allShips';
import ship1 from './img/destroyer_01.gif';
import ship2 from './img/destroyer_02.gif';

export default class Destroyer extends Ship {

  buildShip() {
    return [
      ship1,
      ship2
    ];
  }
}
