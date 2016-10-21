'use strict';

import React, {Component} from 'react';
import ShipCss from './allShips.css';

export default class AllShips extends Component {
  static get propTypes() {
    return {
      orientation: React.PropTypes.string,
      size: React.PropTypes.number,
      Xposition: React.PropTypes.number,
      Yposition: React.PropTypes.number
    };
  }

  static get defaultProps() {
    return {
      orientation: 'portrait',
      size: 50
    };
  }

  buildShip() {
    return [];
  }

  render() {
    const styles = {
      liPortrait: {
        width: `${this.props.size}px`,
        height: `${this.props.size}px`
      },

      liLandscape: {
        display: 'inline',
        listStyleType: 'none',
        width: `${this.props.size}px`,
        height: `${this.props.size}px`
      },

      imgPortrait: {
        width: `${this.props.size}px`,
        height: `${this.props.size}px`
      },

      imgLandscape: {
        width: `${this.props.size}px`,
        height: `${this.props.size}px`,
        WebkitTransform: 'rotate(-90deg)',
        MozTransform: 'rotate(-90deg)',
        OTransform: 'rotate(-90deg)',
        MsTransform: 'rotate(-90deg)',
        transform: 'rotate(-90deg)'
      }
    };
    const orientation = this.props.orientation;
    const shipStyle = {};
    let liStyle = orientation === 'portrait' ? styles.liPortrait : styles.liLandscape;
    let imgStyle = orientation === 'portrait' ? styles.imgPortrait : styles.imgLandscape;

    if (this.props.Xposition) {
      shipStyle.left = `${this.props.Xposition * this.props.size}px`;
    }

    if (this.props.Yposition) {
      shipStyle.top = `${this.props.Yposition * this.props.size}px`;
    }

    return (
      <div className={ShipCss.ship}>
        <ul style={shipStyle}>
          {this.buildShip().map((ship, key) => {
            return (
              <li key={key} style={liStyle}>
                <img style={imgStyle} src={ship}/>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
