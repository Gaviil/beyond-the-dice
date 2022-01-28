import React, {useEffect, useState} from 'react';
import {
  useRouteMatch
} from "react-router-dom";
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import 'firebase/analytics';
import {init} from '../utils/initFirebase'
import '../styles/updates.css';
import ReactMarkdown from 'react-markdown'
import {useHistory} from "react-router-dom";

init();

const UpdateDetails = (props) => {
  const [content, setContent] = useState([]);
  let match = useRouteMatch();
  const history = useHistory();

  useEffect(() => {
    firebase.storage().ref("updates").child(`${match.params.newsUrl}.md`).getDownloadURL().then(url => {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'text'; 
      xhr.onload = function(event) {
        var markdownData= xhr.response;      
        setContent(markdownData);
      };
      xhr.open('GET', url);
      xhr.send();
    })
    .catch(err => {
      console.log(match);
      history.push(match.url.replace(match.params.newsUrl, ''));
    })
  });


  return (
    <div className='updateDetailContainer'>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
  
}

export default UpdateDetails;