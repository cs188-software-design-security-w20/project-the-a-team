import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

console.log('%cSTOP!', 'color: red; font-size:32px; font-weight:900;');

console.log("%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a Taximus Maximus feature or hack someone's account, it is a scam and will give them access to your account.", 'font-size:20px;');

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
