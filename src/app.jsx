import '../assets/styles/main.scss';

import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
    render() {
        return (
            <div className="wrapper">
                <h2>Hello Crossword Blitz</h2>
            </div>
        )
    }

}

ReactDOM.render(<App />, document.getElementById('app'));
