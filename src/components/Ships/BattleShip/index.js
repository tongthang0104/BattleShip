'use strict';

import Ship from './../allShips';
import ship1 from './img/battleship_01.gif';
import ship2 from './img/battleship_02.gif';
import ship3 from './img/battleship_03.gif';
import ship4 from './img/battleship_04.gif';

export default class BattleShip extends Ship {

  buildShip() {
    return [
      ship1,
      ship2,
      ship3,
      ship4
    ];
  }
}
