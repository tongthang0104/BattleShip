'use strict';
import React, {Component} from 'react';
import Grid from './grid';
import _ from 'lodash';
import BattleShip from './Ships/Battleship';
import Cruiser from './Ships/Cruiser';
import Destroyer from './Ships/Destroyer';
import PatrolBoat from './Ships/PatrolBoat';
import Submarine from './Ships/Submarine';
import Socket from '../sockets';
import targetImg from './Ships/target.png';
import { Button, Modal } from 'react-materialize';

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

const SHIP_ORIENTATION = {
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape',
  ISPORTRAIT: true
};

export default class Board extends Component {

  static get propTypes() {
    return {
      size: React.PropTypes.number,
      squarePx: React.PropTypes.number,
      receivedShot: React.PropTypes.object,
      roomId: React.PropTypes.string
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
      ships: [],
      isPortrait: SHIP_ORIENTATION.ISPORTRAIT,
      shipAdded: true,
      gameReady: false,
      shipAmount: {
        battleship: 1,
        submarine: 1,
        cruiser: 2,
        destroyer: 2,
        patrolBoat: 3
      },
      hitPos: []
    };

    this.ships = [];
    this.buildShip = this.buildShip.bind(this);
    this.addShip = this.addShip.bind(this);
    this.createShipWithPos = this.createShipWithPos.bind(this);
    this.checkAvailable = this.checkAvailable.bind(this);
    this.changeOrientation = this.changeOrientation.bind(this);
    this.allShipsPosition = this.allShipsPosition.bind(this);
    this.shipSinked = this.shipSinked.bind(this);
    this.checkIfHit = this.checkIfHit.bind(this);
  }

  componentDidMount() {
    Materialize.toast('Adding Ships to your board', 4000);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.receivedShot !== null) {
      const shotPos = {
        x: nextProps.receivedShot.x,
        y: nextProps.receivedShot.y
      };
      console.log('Shot Position update: ', shotPos);
      this.shipSinked(null, shotPos);
    }
  }

  // Handle Game

  changeOrientation() {
    this.setState({
      isPortrait: !this.state.isPortrait
    });
  }

  sizeShip(TYPE) {
    switch (TYPE) {
    case SHIPTYPE.PATROL_BOAT:
      return SHIPSIZE.PATROL_BOAT;

    case SHIPTYPE.BATTLE_SHIP:
      return SHIPSIZE.BATTLE_SHIP;

    case SHIPTYPE.CRUISER:
      return SHIPSIZE.CRUISER;

    case SHIPTYPE.DESTROYER:
      return SHIPSIZE.DESTROYER;

    case SHIPTYPE.SUBMARINE:
      return SHIPSIZE.SUBMARINE;

    default:
      return 0;
    }
  }

  buildShip(ship, key) {
    switch (ship.type) {
    case SHIPTYPE.PATROL_BOAT:
      return (
          <PatrolBoat
              key={key}
              size={this.props.squarePx}
              Xposition={ship.x}
              Yposition={ship.y}
              orientation={ship.orientation}
          />
        );

    case SHIPTYPE.BATTLE_SHIP:
      return (
          <BattleShip
              key={key}
              size={this.props.squarePx}
              Xposition={ship.x}
              Yposition={ship.y}
              orientation={ship.orientation}
          />
        );

    case SHIPTYPE.CRUISER:
      return (
          <Cruiser
              key={key}
              size={this.props.squarePx}
              Xposition={ship.x}
              Yposition={ship.y}
              orientation={ship.orientation}
          />
        );

    case SHIPTYPE.DESTROYER:
      return (
          <Destroyer
              key={key}
              size={this.props.squarePx}
              Xposition={ship.x}
              Yposition={ship.y}
              orientation={ship.orientation}
          />
        );

    case SHIPTYPE.SUBMARINE:
      return (
          <Submarine
              key={key}
              size={this.props.squarePx}
              Xposition={ship.x}
              Yposition={ship.y}
              orientation={ship.orientation}
          />
        );

    default:
      return null;
    }
  }
  // randomPosition(min, max) {
  //     return Math.floor(Math.random() * (max - min + 1) + min);
  //   }

  createShipWithPos(TYPE, x, y, orientation = this.state.isPortrait) {
    const shipSize = this.sizeShip(TYPE);

    if (orientation) {
      return {
        orientation: SHIP_ORIENTATION.PORTRAIT,
        x: x,
        y: y,
        type: TYPE,
        size: shipSize
      };
    }

    return {
      orientation: SHIP_ORIENTATION.LANDSCAPE,
      x: x,
      y: y,
      type: TYPE,
      size: shipSize
    };
  }

  // Check the position for full Ship size

  positionsShip(ship) {
    const positions = [];

    if (ship.orientation === SHIP_ORIENTATION.PORTRAIT) {
      let currentIndex = ship.y;

      for (let i = 1; i <= ship.size; i++) {
        positions.push({
          x: ship.x,
          y: currentIndex++,
          shipType: ship.type
        });
      }
    } else {
      let currentIndex = ship.x;

      for (let i = 1; i <= ship.size; i++) {
        positions.push({
          x: currentIndex++,
          y: ship.y,
          shipType: ship.type
        });
      }
    }

    return positions;
  }

  addShip(TYPE, x, y, orientation, ships = this.ships) {
    const newShip = this.createShipWithPos(TYPE, x, y, orientation);
    const posNewShip = this.positionsShip(newShip);

    if (this.checkAvailable(x, y, newShip, posNewShip)) {
      ships.push(newShip);

      if (this.state.ships.length === 9) {
        Socket.emit('allShipAdded', {
          gameReady: true,
          shipsPosition: this.allShipsPosition(ships),
          roomId: this.props.roomId
        });

        Materialize.toast('All Ships Added', 4000);
      }

      return this.setState({
        ships: ships,
        shipAdded: true
      });
    }

    // Position is not available to place a ship
    return this.setState({
      shipAdded: false
    });
  }

  // Check if the pos is available
  checkAvailable(x, y, newShip, posNewShip) {
    const currentShips = _.flatten(this.allShipsPosition(this.ships));

    // Check to see if any overlap ?
    const overlapPos = _.find(currentShips, (ship) => {
      return _.find(posNewShip, (pos) => {
        return pos.x === ship.x && pos.y === ship.y;
      });
    });

    if (overlapPos || !this.checkRange(x, y, newShip)) {
      return false;
    }

    return true;
  }

  allShipsPosition(ships) {
    return _.map(ships, (ship) => {
      return this.positionsShip(ship);
    });
  }

  // Check to see if that is out of range for a boat's size

  checkRange(x, y, ship) {
    if (ship.orientation === SHIP_ORIENTATION.PORTRAIT) {
      if (y <= this.props.size - ship.size) {
        return true;
      }
    } else {
      if (x <= this.props.size - ship.size) {
        return true;
      }
    }

    return false;
  }

  shipSinked(e, shotPosition) {
    console.log('shooting at: ', shotPosition);
    _.find(this.ships, (ship) => {
      const allPos = this.positionsShip(ship);

      return _.find(allPos, (shipPos) => {
        const isHit = shipPos.x === shotPosition.x &&  shipPos.y === shotPosition.y;

        if (isHit) {
          if (!this.checkIfHit(this.state.hitPos, shotPosition)) {
            console.log('HIT');
            const hitPos = _.uniq([...this.state.hitPos, Object.assign({}, ship, shotPosition)]);

            this.setState({
              hitPos: hitPos
            });

            let data = {
              hitPos: hitPos,
              shotPosition: shotPosition,
              roomId: this.props.roomId
            }

            Socket.emit('trackingGame', data);
          } else {
            console.log('Ship was hit already');
          }
        } else {
          console.log('Missed');
        }

        return isHit;
      });
    });
  }

  checkIfHit(hitPos, shotPosition) {
    return _.find(hitPos, (hit) => {
      return hit.x === shotPosition.x && hit.y === shotPosition.y;
    });
  }

  render() {
    const ships = [];

    _.each(this.state.ships, (ship, key) => {
      ships.push(this.buildShip(ship, key));
    });

    return (
      <div style={{
        position: 'relative',
        width: `${this.props.size * this.props.squarePx}px`,
        height: `${this.props.size * this.props.squarePx}px`
      }}>

        {this.state.hitPos.map((shinkPos, key) => {
          return (
            <img className="animated zoomIn" key={key} style={{
              width: `${this.props.squarePx}px`,
              height: `${this.props.squarePx}px`,
              position: 'absolute',
              left: `${this.props.squarePx * shinkPos.x}px`,
              top: `${this.props.squarePx * shinkPos.y}px`,
              zIndex: '2'
            }} src={targetImg}
            />
          );
        })}

        <Grid
          size={this.props.size}
          squarePx = {this.props.squarePx}
          ships={ships}
          addShip={this.addShip}
          shipAdded={this.state.shipAdded}
        />

        <div>
          <Button style={{
            margin: '10px'
          }} onClick={this.changeOrientation}>{this.state.isPortrait ? SHIP_ORIENTATION.PORTRAIT : SHIP_ORIENTATION.LANDSCAPE}</Button>
        </div>
      </div>

    );
  }
}
