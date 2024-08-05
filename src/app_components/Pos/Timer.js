import React, { Component } from "react";
class Timer extends Component {
  constructor(props) {
    super(props);
   this.state = {running:false}
  }
  resetState= () => { 
    if(this.props.localStorage){
      this.setState({
        id:this.props.localStorage,
        running:true,
        value:parseInt(this.props.time)
      })
      this.timer = setInterval(
        () => this.forceUpdate(),
        this.props.interval | 0
      );
    }
  }
  componentDidMount() {
    if(this.props.localStorage){
      this.setState({
        id:this.props.localStorage,
        running:true,
        value:parseInt(this.props.time)
      })
      this.timer = setInterval(
        () => this.forceUpdate(),
        this.props.interval | 0
      );
    }
  }

  componentWillUnmount() {
    if (this.state.running) {
      clearInterval(this.timer);
    }
  }
  render() {
    const {
      state: { running, value }
    } = this;
    const timestamp = running ? Date.now() + value : value;
    const h = Math.floor(timestamp / 3600000);
    const m = Math.floor(timestamp / 60000) % 60;
    const s = Math.floor(timestamp / 1000) % 60;
    // const ms = timestamp % 1000;

    const _ = (nr, length = 2, padding = 0) =>
      String(nr).padStart(length, padding);

    return (
            this.state.running ?
      <div className={`container ${this.props.classnameProps}`}>
        <div className="timer-container">
         <div className="current-timer">
            {/* {_(h) + ":" + _(m) + ":" + _(s) + "." + _(ms, 3)} */}
            {_(h) + ":" + _(m) + ":" + _(s)}
          </div>
        </div>
      </div>
      :<></>
    );
  }
}

export default Timer 