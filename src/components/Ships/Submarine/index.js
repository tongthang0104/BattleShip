'use strict';

import Ship from './../allShips';
import ship1 from './img/submarine_01.gif';
import ship2 from './img/submarine_02.gif';
import ship3 from './img/submarine_03.gif';
import ship4 from './img/submarine_04.gif';
import ship5 from './img/submarine_05.gif';

export default class Submarine extends Ship {

  buildShip() {
    return [
      ship1,
      ship2,
      ship3,
      ship4,
      ship5
    ];
  }
}
