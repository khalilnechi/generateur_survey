import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Route,BrowserRouter as Router } from 'react-router-dom'
import Creation_survey from './Creation_survey'
import Analyse from './Analyse'
import Consultation_survey from './Consultation_survey'
import Afficher_survey from './Afficher_survey'


import * as firebase from 'firebase/app';

//var admin = require("firebase-admin");

//var admin = require("firebase-admin");

//var serviceAccount = require("./newaccess-141c2-firebase-adminsdk-f73sx-4c69bd926a.json");
const firebaseConfig = {
  apiKey: "AIzaSyD-7R35v7y_2wG6iUTnEeyadscvj6GAQr8",
  authDomain: "newaccess-141c2.firebaseapp.com",
  databaseURL: "https://newaccess-141c2.firebaseio.com",
  projectId: "newaccess-141c2",
  storageBucket: "",
  messagingSenderId: "1026469462949",
  appId: "1:1026469462949:web:0730e06ed1596737"
};
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
//var database = firebase.database();


//ReactDOM.render(<App />, document.getElementById('root'));
const routing = (
    <Router>
      <div>
      <Route exact path="/" component={App} />
      <Route path="/Creation_survey/" component={Creation_survey} />
      <Route path="/Modification_survey/" component={Creation_survey} />
      <Route path="/Afficher_survey/" component={Afficher_survey} />
      <Route path="/Consultation_survey/" component={Consultation_survey} />
      <Route path="/Analyse" component={Analyse} />
      
        
        
        
      </div>
    </Router>
  )
  ReactDOM.render(routing, document.getElementById('root'))
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
