import React, {useEffect, useState} from 'react';
import {
  Switch,
  Route,
  useRouteMatch
} from "react-router-dom";
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import 'firebase/analytics';
import {init} from '../utils/initFirebase'
import '../styles/updates.css'
import UpdateDetails from '../components/UpdateDetails';
import { ToastContainer } from 'react-toastify';
import {useHistory} from "react-router-dom";
import i18next from 'i18next';

init();
const db = firebase.firestore();

const Updates = (props) => {
  const [updates, setUpdates] = useState([]);
  let match = useRouteMatch();
  const history = useHistory();

  useEffect(() => {
    getUpdates();
  }, []);
  
  const getUpdates = async () => {
    const listArticles = [];
    await db.collection('updates').where('active', '==', true).orderBy("date", "desc").get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        listArticles.push(doc.data());
      });
    })
    .catch(err => {
      console.log(err)
    })
    setUpdates(listArticles);
  }

  return (
    <div className='updatesContainer'>
      <Switch>
          <Route path={`${match.url}/:newsUrl`}>
            <UpdateDetails/>
          </Route>
          <Route path={match.path}>
            <div className='headUpdate'>
              <h1>
                {i18next.t('news')}
              </h1>
            </div>
            <ul>
              {updates.map((update, i) => (
                <li
                  key={i}
                  className='blockLinkUpdate'
                  onClick={() => {
                    const url = update.title.toLowerCase();
                    history.push(`${match.url}/${url.replaceAll(' ', '-').replaceAll('-:-', '-')}`);
                  }}
                >
                  <h1 className='titleUpdate'>
                    {update.title}
                  </h1>
                  <span className='date'>{new Date(update.date.seconds * 1000).toLocaleDateString()}</span>
                  <p>{i18next.t('seeMore')}</p>
                </li>
              ))}
            </ul>
          </Route>
        </Switch>

      <ToastContainer
        progressClassName="toastProgress"
        bodyClassName="toastBody"
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
  
}

export default Updates;