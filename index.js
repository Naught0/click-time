'use strict';

class Container extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="column is-one-third">
                <div className="box notification is-black has-text-centered">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

class ClickCounter extends React.Component {
    constructor(props) {
        super(props);
        this.state = { counterName: 'Counter', counter: 0 }

        this.updateCounterName = this.updateCounterName.bind(this);
        this.addCounter = this.addCounter.bind(this);
        this.subtractCounter = this.subtractCounter.bind(this);
        this.resetCounter = this.resetCounter.bind(this);
    }

    updateCounterName(event) {
        this.setState({ counterName: event.target.value })
    }

    addCounter() {
        this.setState({ counter: this.state.counter + 1 });
    }
    subtractCounter() {
        this.setState({ counter: this.state.counter - 1 });
    }
    resetCounter() {
        this.setState({ counter: 0 });
    }

    render() {
        return (
            <Container>
                <div className="field">
                    <div className="control has-icons-left">
                        <input type="text" className="input is-marginless " value={this.state.counterName} onChange={this.updateCounterName}>
                        </input>
                        <span className="icon is-left">
                            <i className="fas fa-plus-circle"></i>
                        </span>
                    </div>
                </div>

                <div className="notification is-dark">
                    <span className="subtitle">
                        {this.state.counter}
                    </span>
                </div>

                <div className="buttons">
                    <button className="button is-light is-outlined" onClick={this.addCounter}>
                        <span className="icon"><i className="fas fa-plus-circle"></i></span>
                    </button>
                    <button className="button is-light is-outlined" onClick={this.subtractCounter}>
                        <span className="icon"><i className="fas fa-minus-circle"></i></span>
                    </button>
                    <button className="button is-danger" onClick={this.resetCounter}>
                        <span className="icon"><i className="fas fa-trash"></i></span>
                    </button>
                </div>

            </Container>
        )
    }
}

class StopWatch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            elapsed: 0,
            startTime: null,
            timerName: "Stopwatch",
            id: props.componentID,
            ticking: false
        }

        this.updateTimerName = this.updateTimerName.bind(this);
        this.timerStart = this.timerStart.bind(this);
        this.timerStop = this.timerStop.bind(this);
        this.timerReset = this.timerReset.bind(this);
    }

    convertMS(milliseconds) {
        let day, hour, minute, seconds;
        seconds = Math.floor(milliseconds / 1000);
        minute = Math.floor(seconds / 60);
        seconds = seconds % 60;
        hour = Math.floor(minute / 60);
        minute = minute % 60;
        hour = hour % 24;
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    // Updates and stores the name of the timer
    updateTimerName(name) {
        this.setState({
            timerName: name.target.value
        })
    }

    // Start ticking
    timerStart() {
        if (this.state.ticking) return;
        this.setState({ ticking: true, startTime: Date.now() });
        // SetInterval isn't actually milliseconds
        // I have to check the Date object to determine actual time elapsed every 100ms
        this.timerID = setInterval(() => this.timerTick(), 100);
    }

    timerTick() {
        this.setState({
            elapsed: Date.now() - this.state.startTime
        })
    }

    timerStop() {
        clearInterval(this.timerID);
    }
    timerReset() {
        clearInterval(this.timerID);
        this.setState({ ticking: false, elapsed: 0 });
    }

    // GUI stuff
    render() {
        return (
            <Container>
                <div className="field">
                    <div className="control has-icons-left">
                        <input type="text" className="input is-marginless " value={this.state.timerName} onChange={this.updateTimerName}>
                        </input>
                        <span className="icon is-left">
                            <i className="fas fa-stopwatch"></i>
                        </span>
                    </div>
                </div>

                <div className="notification is-dark">
                    <span className="subtitle">
                        {this.convertMS(this.state.elapsed)}
                    </span>
                </div>

                <div className="buttons">
                    <button className="button is-success is-outlined" onClick={this.timerStart}>Start</button>
                    <button className="button is-warning is-outlined" onClick={this.timerStop}>Stop</button>
                    <button className="button is-danger" onClick={this.timerReset}>Reset</button>
                </div>
            </Container>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { items: [] };
        this.addStopwatch = this.addStopwatch.bind(this);
        this.addCounter = this.addCounter.bind(this);
    }

    addStopwatch() {
        this.setState({
            items: this.state.items.concat(<StopWatch componentID={this.state.items.length}></StopWatch>)
        })
    }
    addCounter() {
        this.setState({
            items: this.state.items.concat(<ClickCounter componentID={this.state.items.length}></ClickCounter>)
        })
    }

    render() {
        return (
            <React.Fragment>
                <section className="hero is-dark is-fullheight">
                    <div className="hero-head">
                        <nav className="navbar is-dark">
                            <div className="container">
                                <div className="navbar-brand">
                                    <div className="navbar-item has-text-primary">
                                        <span className="icon"><i className="fas fa-mouse"></i></span>
                                        <span className="subtitle has-text-weight-light">clicktime</span>
                                    </div>
                                </div>
                                <div className="navbar-menu">
                                    <div className="navbar-end">
                                        <div className="navbar-item has-dropdown is-hoverable">
                                            <a href="" className="navbar-link">
                                                <span className="icon"><i className="fas fa-plus"></i></span>
                                            </a>

                                            <div className="navbar-dropdown is-right is-dark has-background-dark">
                                                <a href="" className="navbar-item">
                                                    <span className="icon"><i className="fas fa-clock"></i></span>
                                                    <span>Add timer</span>
                                                </a>
                                                <a onClick={this.addStopwatch} className="navbar-item">
                                                    <span className="icon"><i className="fas fa-stopwatch"></i></span>
                                                    <span>Add stopwatch</span>
                                                </a>
                                                <a onClick={this.addCounter} className="navbar-item">
                                                    <span className="icon">
                                                        <i className="fas fa-plus-circle"></i>
                                                    </span>
                                                    <span>Add counter</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>
                    <div className="hero-body">
                        <div className="container">
                            <div className="columns is-multiline">
                                {this.state.items}
                            </div>
                        </div>
                    </div>
                </section >
                <footer className="footer has-text-centered has-text-grey has-background-black">
                    <div className="container content">
                        <p>made with ☕️ by <a href="https://github.com/Naught0">james</a></p>
                        <p className="help"><a href="http://soundbible.com/2197-Analog-Watch-Alarm.html">alarm sound</a> from daniel simion under attribution 3.0</p>
                    </div>
                </footer>
            </React.Fragment>
        )
    }
}

ReactDOM.render(
    React.createElement(App),
    document.getElementById('App')
)