'use strict';
import React, {Component} from 'react';
import Square from './square';
import targetImg from './Ships/target.png';

export default class Grid extends Component {

  static get propTypes() {
    return {
      size: React.PropTypes.number,
      squarePx: React.PropTypes.number,
      ships: React.PropTypes.array.isRequired,
      addShip: React.PropTypes.func,
      playerShoot: React.PropTypes.func,
      hitPos: React.PropTypes.array
    };
  }

  static get defaultProps() {
    return {
      size: 10,
      squarePx: 50,
      ships: [],
      hitPos: []
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      hitPos: []
    };
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
        'backgroundColor': '#55ACEE',
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

        {/* Render the target image if Good Shot in Shooting Grid */}

        {this.props.hitPos.map((shinkPos, key) => {
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
