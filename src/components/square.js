'use strict';

import React, {Component} from 'react';

export default class Square extends Component {

  static get propTypes() {
    return {
      Xposition: React.PropTypes.number.isRequired,
      Yposition: React.PropTypes.number.isRequired,
      size: React.PropTypes.number.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    // this.props.onClick(e, {
    //   x: this
    // })
    console.log("Clicking", event);
  }

  render() {
    const squareStyle = {
      position: 'absolute',
      border: '1px solid #777',
      left: `${this.props.Xposition * this.props.size}px`,
      top: `${this.props.Yposition * this.props.size}px`,
      width: `${this.props.size}px`,
      height: `${this.props.size}px`,
      cursor: 'pointer',
      zIndex: '0'
    };

    return <div style={squareStyle} onClick={this.handleClick}></div>
  }
}
