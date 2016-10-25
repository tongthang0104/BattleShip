'use strict';
import React, {Component} from 'react';
import Square from './square';

export default class Grid extends Component {

  static get propTypes() {
    return {
      size: React.PropTypes.number,
      squarePx: React.PropTypes.number,
      ships: React.PropTypes.array.isRequired,
      addShip: React.PropTypes.func,
      playerShoot: React.PropTypes.func
    };
  }

  static get defaultProps() {
    return {
      size: 10,
      squarePx: 50,
      ships: []
    };
  }

  constructor(props) {
    super(props);

    this.matrix = [];
  }

  componentWillMount() {
    this.boardBuild();
  }

  boardBuild() {
    let index = 0;
    this.matrix = [];

    for (let i = 0; i < this.props.size; i++) {
      const cell = [];

      for (let j = 0; j < this.props.size; j++) {
        cell.push({
          x: i,
          y: j,
          idx: index
        });
        index++;
      }
      this.matrix.push(cell);
    }
  }

  render() {
    return (
      <div
      style={{
        position: 'relative',
        width: `${this.props.size * this.props.squarePx}px`,
        height: `${this.props.size * this.props.squarePx}px`
      }}>

        {this.props.ships.map((ship, key) => {
          return (
            <div key={key}>
              {ship}
            </div>
          );
        })}

        {this.matrix.map(cell => {
          return (cell.map(square => {
            return (
              <Square
                key={square.idx}
                Xposition={square.x}
                Yposition={square.y}
                size={this.props.squarePx}
                index={square.idx}
                addShip={this.props.addShip}
                shipAdded={this.props.shipAdded}
                playerShoot={this.props.playerShoot}
              />
            );
          }));
        })}
      </div>
    );
  }
}
