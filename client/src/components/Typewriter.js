import React from 'react';
import { Howl } from 'howler';

export default class Typewriter extends React.Component {
  state = { position: 0, tick: 0 }
  componentDidMount() {
    this._tick = this._tick.bind(this);
    this.timerID = setInterval(() => this._tick(), this.props.interval);

    this.keystroke = new Howl({
      src: ['electric-typewriter.mp3'],
      sprite: {
        one: [0, 104],
        two: [104, 324],
        three: [370, 495],
        four: [490, 650],
        five: [650, 810]
      },
      autoplay: false,
      loop: false,
      volume: 1
    });
  }
  componentWillUnmount() { clearInterval(this.timerID); }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.children !== this.props.children) return this.setState({ position: 0 });
  }
  render() {
    const { position, tick } = this.state;
    if (this.props.children) return this.props.children.slice(0, position) + (tick % 5 === 0 ? '|' : '')
    return tick % 5 === 0 ? '' : '.'
  }
  _tick() {
    if (this.props.children && this.props.children.length > this.state.position) {
      this.setState((state) => ({ position: state.position + 1 }))
      if (this.props.children.charAt(this.state.position - 1) === ' ') return this.keystroke.play('five');
      return this.keystroke.play('one');
    }
    this.setState((state) => ({ tick: state.tick + 1 }))
  }
}
