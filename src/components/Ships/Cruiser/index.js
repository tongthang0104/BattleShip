'use strict';

import Ship from './../allShips';
import ship1 from './img/crusier_01.gif';
import ship2 from './img/crusier_02.gif';
import ship3 from './img/crusier_03.gif';

export default class Cruiser extends Ship {

  buildShip() {
    return [
      ship1,
      ship2,
      ship3
    ];
  }
}
