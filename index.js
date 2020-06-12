'use strict';

class Container extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="column is-one-third">
                <div className="notification is-black">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { duration: 60 * 1000, startTime: null, elapsed: 0, prevElapsed: 0, timerName: 'Timer', ticking: false, id: props.componentID, almostDone: false, alerting: false };
        this.updateName = this.updateName.bind(this);
        this.start = this.start.bind(this);
        this.pause = this.pause.bind(this);
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

    updateName(e) {
        this.setState({ timerName: e.target.value })
    }

    start() {
        if (this.state.startTime) return;
        if (this.state.ticking) return;
        this.setState({ startTime: Date.now(), ticking: true })
        this.timerID = setInterval(() => this.tick(), 100)
    }

    pause() {
        this.setState({ prevElapsed: elapsed, startTime: null });
        this.setState({ elapsed: 0 });
    }

    tick() {
        this.setState({ elapsed: Date.now() - this.state.startTime });
        if (this.state.duration - this.state.elapsed < (30 * 1000)) {
            this.setState({ almostDone: true })
        }
        if (this.state.duration == this.state.elapsed + this.state.prevElapsed || this.state.duration < this.state.elapsed + this.state.prevElapsed) {
            clearInterval(this.timerID);
            this.setState({ almostDone: false, alerting: true });
        }
    }

    render() {
        return (
            <Container>
                <div className="field">
                    <div className="control has-icons-left">
                        <input type="text" className="input is-marginless" onChange={this.updateName} value={this.state.timerName} />
                        <span className="icon is-left">
                            <i className="fas fa-clock"></i>
                        </span>
                    </div>
                </div>
                <div className="notification is-dark">
                    <input type="text" className="input is-transparent"/>
                        {/* {this.convertMS(this.state.duration - this.state.prevElapsed - this.state.elapsed)} */}
                </div>
                <div className="buttons is-grouped">
                    <button onClick={this.start} className="button is-rounded is-success">
                        <span className="icon"><i className="fas fa-play"></i></span>
                    </button>
                    <button className="button is-rounded is-warning">
                        <span className="icon"><i className="fas fa-pause"></i></span>
                    </button>
                    <button className="button is-rounded is-outlined is-danger">
                        <span className="icon"><i className="fas fa-trash"></i></span>
                    </button>
                </div>
            </Container>
        )
    }
}

class ClickCounter extends React.Component {
    constructor(props) {
        super(props);
        this.state = { counterName: 'Counter', counter: 0, id: props.componentID }

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
                    <button className="button is-rounded is-light" onClick={this.addCounter}>
                        <span className="icon"><i className="fas fa-plus-circle"></i></span>
                    </button>
                    <button className="button is-rounded is-light is-outlined" onClick={this.subtractCounter}>
                        <span className="icon"><i className="fas fa-minus-circle"></i></span>
                    </button>
                    <button className="button is-rounded is-outlined is-danger" onClick={this.resetCounter}>
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
            prevElapsed: 0,
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
            elapsed: Date.now() + this.state.prevElapsed - this.state.startTime
        })
    }

    timerStop() {
        clearInterval(this.timerID);
        this.setState({ ticking: false, prevElapsed: this.state.elapsed })
    }
    timerReset() {
        clearInterval(this.timerID);
        this.setState({ ticking: false, elapsed: 0, prevElapsed: 0 });
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
                    <button className="button is-rounded is-success" onClick={this.timerStart}>
                        <span className="icon"><i className="fas fa-play"></i></span>
                    </button>
                    <button className="button is-rounded is-warning" onClick={this.timerStop}>
                        <span className="icon"><i className="fas fa-stop"></i></span>
                    </button>
                    <button className="button is-rounded is-outlined is-danger" onClick={this.timerReset}>
                        <span className="icon"><i className="fas fa-trash"></i></span>
                    </button>
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
        this.addTimer = this.addTimer.bind(this);
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
    addTimer() {
        this.setState({
            items: this.state.items.concat(<Timer componentID={this.state.items.length}></Timer>)
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
                                        <span className="subtitle has-text-weight-light">ClickTime</span>
                                    </div>
                                </div>
                                <div className="navbar-menu">
                                    <div className="navbar-end">
                                        <div className="navbar-item has-dropdown is-hoverable">
                                            <a href="" className="navbar-link">
                                                <span className="icon"><i className="fas fa-plus"></i></span>
                                            </a>

                                            <div className="navbar-dropdown is-right is-dark has-background-dark">
                                                <a onClick={this.addTimer} className="navbar-item">
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
                <footer className="footer">
                    <div className="container has-text-centered">
                        <p>
                            made with ☕ by <a href="https://github.com/Naught0">me</a>
                        </p>
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