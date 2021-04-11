import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import { Provider } from "react-redux";
import { Store } from "./redux/Store";
import Home from './Home';

function App() {
    return (
        <Provider store={Store}>
            <Router>
                <Switch>
                    <Route exact path="/" component={Home} />
                </Switch>
            </Router>
        </Provider>
    )
}

export default App;