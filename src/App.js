/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import i18next from 'i18next';
import Campaigns from './containers/Campaigns';
import Updates from './containers/Updates';
import HeaderBar from './components/HeaderBar';
import Login from './containers/Login';
import enTranslation from './assets/translation/en.json';
import frTranslation from './assets/translation/fr.json';
import {init} from './utils/initFirebase';
import UserContext from "./context/UserContext";
import './index.css';
import './styles/login.css';
import './styles/darkMode.css';
import Loader from "react-js-loader";

init();
const db = firebase.firestore();

const App = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    uid: null,
    displayName: null,
  })

  i18next.init({
    lng: 'fr',
    debug: false,
    resources: {
      en: {
        translation: enTranslation
      },
      fr: {
        translation: frTranslation
      }
    }
  }, function(err, t) {
  });
  
    useEffect( () => {
      getUserId();
    },[]);
  
  const contextValue = {
    user: user,
    updateUser: setUser
  }

    const getUserId = () => {
      setLoading(true);
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          const userJson = {};
          userJson.uid = user.uid;
          userJson.email = user.email;
          userJson.displayName = user.displayName;
          userJson.photoURL = user.photoURL;
          // setUser(userJson);
          getUserDataFirestore(userJson)
        } else {
          setUser({
            uid: null,
            displayName: null,
          });
          setLoading(false);
        }
      });
    }

  const getUserDataFirestore = async (loguser) => {
    await db.collection('users').doc(loguser.uid).get()
    .then(doc => {
      const mergeUser = {
        ...doc.data(),
        ...loguser
      };
      setUser(mergeUser);
      setLoading(false);
      const element = document.getElementsByTagName('body')[0];
      element.setAttribute('data-theme', mergeUser.theme);
    })
    .catch(err => {
      console.log(err.messsage)
      setLoading(false);
    })
  }

    return (
    <Router>
      <UserContext.Provider value={contextValue}>
        {loading &&  (
          <div className='loaderContainer'>
            <Loader type="bubble-loop" bgColor={"#ffad23"} size={80} />
          </div>
        )}
        {!loading && (
          <div style={{width: '100%', height: '100%'}}>
            {user && user.uid && (
              <HeaderBar />
            )}
            <Switch>
              <Route path="/campaigns" >
                {!user.uid && (
                  <Login />
                )}
                {user && user.uid && (
                  <Campaigns />
                )}
              </Route>
              <Route path="/news">
                <Updates />
              </Route>
              <Route exact path="/">
                <Redirect to="/campaigns" />
              </Route>
            </Switch>
          </div>
        )}
        
      </UserContext.Provider>
    </Router>
  );
}

export default App