'use strict';

class Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = { color: props.color ? props.color : 'is-black' }
        this.handleColor = this.handleColor.bind(this);
    }

    handleColor(newColor) {
        if (newColor == 'is-danger') {
            this.setState({ xColor: 'is-dark' })
        }
        this.setState({ color: newColor, xColor: 'is-danger' });
    }

    render() {
        return (
            <div className="column is-one-third">
                <div className={'notification box ' + this.state.color}>
                    <nav className="level is-mobile">
                        <div className="level-left">
                            <p className="level-item"><a onClick={() => this.handleColor('is-link')}><i className="fas fa-circle has-text-link"></i></a></p>
                            <p className="level-item"><a onClick={() => this.handleColor('is-info')}><i className="fas fa-circle has-text-info"></i></a></p>
                            <p className="level-item"><a onClick={() => this.handleColor('is-success')}><i className="fas fa-circle has-text-success"></i></a></p>
                            <p className="level-item"><a onClick={() => this.handleColor('is-danger')}><i className="fas fa-circle has-text-danger"></i></a></p>
                            <p className="level-item"><a onClick={() => this.handleColor('is-warning')}><i className="fas fa-circle has-text-warning"></i></a></p>
                            <p className="level-item"><a onClick={() => this.handleColor('is-black')}><i className="fas fa-circle has-text-black"></i></a></p>
                            <p className="level-item"><a onClick={() => this.handleColor('is-dark')}><i className="fas fa-circle has-text-dark"></i></a></p>
                            <p className="level-item"><a onClick={() => this.handleColor('is-light')}><i className="fas fa-circle has-text-light"></i></a></p>
                        </div>

                        <div className="level-right">
                            <div className="level-item">
                                <a onClick={this.props.onDelete}>
                                    <i className="fas fa-times"></i>
                                </a>
                            </div>
                        </div>
                    </nav>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { duration: 10 * 1000, startTime: null, elapsed: 0, prevElapsed: 0, timerName: 'Timer', ticking: false, alerting: false, timerColor: "is-dark", modalShow: false, hours: 0, minutes: 0, seconds: 0 };
        this.updateName = this.updateName.bind(this);
        this.start = this.start.bind(this);
        this.pause = this.pause.bind(this);
        this.clear = this.clear.bind(this);
        this.editTime = this.editTime.bind(this);
        this.showRemaining = this.showRemaining.bind(this);
        this.showEdit = this.showEdit.bind(this);
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
        this.timerID = setInterval(() => this.tick(), 100);
        this.setState({ startTime: Date.now(), ticking: true, almostDone: false, alerting: false, timerColor: "is-dark", modalShow: false })
    }

    pause() {
        clearInterval(this.timerID);
        this.setState({ prevElapsed: this.state.elapsed, ticking: false, startTime: null });
        this.setState({ elapsed: 0 });
    }
    clear() {
        clearInterval(this.timerID);
        this.setState({ prevElapsed: 0, ticking: false, startTime: null, elapsed: 0, almostDone: false, alerting: false, timerColor: 'is-dark' });
    }

    tick() {
        this.setState({ elapsed: Date.now() - this.state.startTime });
        if (this.state.duration == this.state.elapsed + this.state.prevElapsed || this.state.duration < this.state.elapsed + this.state.prevElapsed) {
            clearInterval(this.timerID);
            this.setState({ almostDone: false, alerting: true, timerColor: "is-danger hvr-buzz", prevElapsed: 0, elapsed: this.state.duration });
        }
    }

    editTime() {
        if (this.state.ticking || this.state.prevElapsed > 0) return;
        this.setState({ modalShow: !this.state.modalShow });
    }

    showRemaining() {
        return (
            <span className="subtitle">{this.convertMS(this.state.duration - this.state.elapsed - this.state.prevElapsed)}</span>
        )
    }

    showEdit() {
        let totalMiliseconds,
            hours,
            minutes,
            seconds;
        const anyChange = () => {
            this.setState({ duration: this.state.hours + this.state.minutes + this.state.seconds })
        }
        const hoursChange = (e) => {
            hours = e.target.value * 60 * 60 * 1000;
            this.setState({ hours: hours });
            anyChange();
        }
        const minutesChange = (e) => {
            minutes = e.target.value * 60 * 1000;
            this.setState({ minutes: minutes });
            anyChange();
        }
        const secondsChange = (e) => {
            seconds = e.target.value * 1000;
            this.setState({ seconds: seconds });
            anyChange();
        }
        return (
            <div className="container">
                <p className="help">hours</p>
                <input onChange={hoursChange} defaultValue="0" min="0" type="number" className="box is-size-6" />
                <p className="help">minutes</p>
                <input onChange={minutesChange} defaultValue="0" min="0" type="number" className="box is-size-6" />
                <p className="help">seconds</p>
                <input onChange={secondsChange} defaultValue="30" min="0" type="number" className="box is-size-6" />
            </div>
        )
    }

    render() {
        let block;
        if (this.state.modalShow === false) {
            block = <this.showRemaining />
        }
        else {
            block = <this.showEdit />
        }

        return (
            <Container onDelete={() => this.props.onDelete(this.props.id)} >

                <div className="field">
                    <div className="control has-icons-left">
                        <input type="text" className="input is-marginless" onChange={this.updateName} value={this.state.timerName} />
                        <span className="icon is-left">
                            <i className="fas fa-clock"></i>
                        </span>
                    </div>
                </div>
                <div className={"notification " + this.state.timerColor}>
                    <div className="level is-mobile is-paddingless is-marginless">
                        <div className="level-left">
                            <div className="level-item">
                                {block}
                            </div>
                        </div>
                        <div className="level-right">
                            <div className="level-item">
                                <button onClick={this.editTime} className="button is-primary is-inverted is-outlined">
                                    <span className="icon">
                                        <i className="fas fa-edit"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <nav className="level is-mobile">
                    <div className="level-left">
                        <div className="buttons level-item has-addons is-grouped">
                            <button onClick={this.start} className="button is-rounded is-success is-inverted">
                                <span className="icon"><i className="fas fa-play"></i></span>
                            </button>
                            <button onClick={this.pause} className="button is-rounded is-warning is-light is-inverted">
                                <span className="icon"><i className="fas fa-pause"></i></span>
                            </button>
                        </div>
                    </div>
                    <div className="level-right">
                        <div className="level-item">
                            <button onClick={this.clear} className="button is-rounded is-danger is-inverted">
                                <span className="icon"><i className="fas fa-undo"></i></span>
                            </button>
                        </div>
                    </div>
                </nav>
            </Container >
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
            <Container onDelete={() => this.props.onDelete(this.props.id)}>
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

                <nav className="level is-mobile">
                    <div className="level-left">
                        <div className="level-item">
                            <div className="buttons is-grouped has-addons">
                                <button className="button is-rounded is-success is-inverted" onClick={this.addCounter}>
                                    <span className="icon"><i className="fas fa-plus-circle"></i></span>
                                </button>
                                <button className="button is-rounded is-warning is-light is-inverted" onClick={this.subtractCounter}>
                                    <span className="icon"><i className="fas fa-minus-circle"></i></span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="level-right">
                        <div className="level-item">
                            <button className="button is-rounded is-danger is-inverted" onClick={this.resetCounter}>
                                <span className="icon"><i className="fas fa-undo"></i></span>
                            </button>
                        </div>
                    </div>
                </nav>

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
            <Container onDelete={() => this.props.onDelete(this.props.id)}>
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

                <nav className="level is-mobile">
                    <div className="level-left">
                        <div className="level-item buttons has-addons is-grouped">
                            <button className="button is-rounded is-success is-inverted" onClick={this.timerStart}>
                                <span className="icon"><i className="fas fa-play"></i></span>
                            </button>
                            <button className="button is-rounded is-warning is-light is-inverted" onClick={this.timerStop}>
                                <span className="icon"><i className="fas fa-pause"></i></span>
                            </button>
                        </div>
                    </div>
                    <div className="level-right">
                        <div className="level-item">
                            <button className="button is-rounded is-danger is-inverted" onClick={this.timerReset}>
                                <span className="icon"><i className="fas fa-undo"></i></span>
                            </button>
                        </div>
                    </div>
                </nav>
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
        this.removeItem = this.removeItem.bind(this);
        this.clearAllItems = this.clearAllItems.bind(this);

        this.id = 0;
    }

    clearAllItems() {
        if (window.confirm('... u sure?'))
            this.setState({ items: [] });
    }

    removeItem(toRemove) {
        this.setState({ items: this.state.items.filter(i => i.id !== toRemove) })
    }

    addStopwatch() {
        const id = this.id++;
        this.setState({
            items: this.state.items.concat({ obj: <StopWatch onDelete={this.removeItem} key={id} id={id}></StopWatch>, id: id })
        })
    }
    addCounter() {
        const id = this.id++;
        this.setState({
            items: this.state.items.concat({ obj: <ClickCounter onDelete={this.removeItem} key={id} id={id}></ClickCounter>, id: id })
        })
    }
    addTimer() {
        const id = this.id++;
        this.setState({
            items: this.state.items.concat({ obj: <Timer onDelete={this.removeItem} key={id} id={id}></Timer>, id: id })
        })
    }

    toggleBurger(event) {
        event.target.classList.toggle('is-active');
        document.getElementById('navMenu').classList.toggle('is-active');
    }

    render() {
        return (
            <React.Fragment>
                <section className="hero is-dark is-fullheight is-bold">
                    <div className="hero-head">
                        <nav className="navbar is-spaced is-primary">
                            <div className="navbar-brand">
                                <div className="navbar-item has-text-grey">
                                    <span className="icon is-large"><i className="fas fa-mouse-pointer fa-2x"></i></span>
                                    <span className="subtitle has-text-weight-light is-3">ClickTime</span>
                                </div>
                                <a role="button" className="navbar-burger" onClick={this.toggleBurger} data-target="navMenu" aria-label="menu" aria-expanded="false">
                                    <span aria-hidden="true"></span>
                                    <span aria-hidden="true"></span>
                                    <span aria-hidden="true"></span>
                                </a>
                            </div>
                            <div className="navbar-menu" id="navMenu">
                                <div className="navbar-start">
                                    <a onClick={this.addTimer} className="navbar-item">
                                        <span className="icon"><i className="fas fa-clock"></i></span>
                                        <span>Add timer</span>
                                    </a>
                                    <a onClick={this.addStopwatch} className="navbar-item">
                                        <span className="icon"><i className="fas fa-stopwatch"></i></span>
                                        <span>Add stopwatch</span>
                                    </a>
                                    <a onClick={this.addCounter} className="navbar-item">
                                        <span className="icon"><i className="fas fa-plus-circle"></i></span>
                                        <span>Add counter</span>
                                    </a>
                                </div>
                                <div className="navbar-end">
                                    <button onClick={this.clearAllItems} className="button is-outlined is-inverted is-rounded is-danger">
                                        <span className="icon">
                                            <i className="fas fa-bomb"></i>
                                        </span>
                                        <span>Clear all</span>
                                    </button>
                                </div>
                            </div>
                        </nav>
                    </div>
                    <div className="hero-body">
                        <div className="container">
                            <div className="columns is-multiline">
                                {
                                    this.state.items.length > 0
                                        ? this.state.items.map(item => item.obj)
                                        : <div className="container">
                                            <p className="title has-text-weight-light has-text-grey-light">Add items with the above menu</p><p className="subtitle has-text-weight-light has-text-grey-light">Click the colors to change the color. Click the <span className="icon has-text-danger"><i className="fas fa-times"></i></span> to close a component</p>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </section >
                <footer className="footer has-text-grey-light has-background-grey-dark">
                    <div className="container has-text-centered">
                        <p>
                            made with ☕ by <a className="has-text-primary" href="https://github.com/Naught0">james</a>
                        </p>
                        <p><a href="https://github.com/Naught0/click-time" className="has-text-primary">source</a></p>
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