import React, {useEffect, useState} from 'react';
import {
  Switch,
  Route,
  Link,
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
import { ToastContainer, toast } from 'react-toastify';
import {useHistory} from "react-router-dom";

init();
const db = firebase.firestore();

const Updates = (props) => {
  const [updates, setUpdates] = useState([]);
  let match = useRouteMatch();
  const history = useHistory();

  useEffect(() => {
    getUpdates();
    // firebase.storage().ref("updates").child(`test.md`).getDownloadURL().then(url => {
    //   console.log(url)
    //   var xhr = new XMLHttpRequest();
    //   xhr.responseType = 'text'; 
    //   xhr.onload = function(event) {
    //     var markdownData= xhr.response;      
    //     setUpdate(markdownData);
    //   };
    //   xhr.open('GET', url);
    //   xhr.send();
    // })
    // .catch(err => {
    //     // process exceptions
    // })
  }, []);
  
  const getUpdates = async () => {
    const listArticles = [];
    await db.collection('updates').where('active', '==', true).orderBy("date", "desc").get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        listArticles.push(doc.data());
        // Create a reference to the file we want to download
      });
    })
    .catch(err => {
      console.log(err)
    })
    setUpdates(listArticles);
    console.log(listArticles)
  }

  return (
    <div className='updatesContainer'>
      <Switch>
          <Route path={`${match.url}/:updateIdUrl`}>
            <UpdateDetails/>
          </Route>
          <Route path={match.path}>
            <div className='headUpdate'>
              <h1>
                Notes de mise à jour
              </h1>
            </div>
            <ul>
              {updates.map((update, i) => (
                <li
                  key={i}
                  className='blockLinkUpdate'
                  onClick={() => {
                    history.push(`${match.url}/${update.id}`);
                  }}
                >
                  <h1 className='titleUpdate'>
                    {update.title}
                  </h1>
                  <span className='date'>{new Date(update.date.seconds * 1000).toLocaleDateString()}</span>
                  <p>Voir le détail ...</p>
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