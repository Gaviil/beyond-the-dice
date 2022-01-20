import React, {useContext, useState, useEffect} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import UserContext from "../context/UserContext";
import '../styles/headerbar.css';
import i18next from 'i18next';
import logo from '../assets/Images/logo150.png';
import {Link} from "react-router-dom";
import { ChevronDownIcon } from '@heroicons/react/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import { faTwitter } from "@fortawesome/free-brands-svg-icons"

const HeaderBar = (props) => {
  const db = firebase.firestore();

  const {user, updateUser} = useContext(UserContext)
  const [theme, setTheme] = useState(user.theme);
  return (
    <header>
      <div className='header'>
        <div className='logo'>
          <Link className={'link homeLink'} to="/campaigns">
            <img src={logo} className="homeLinkIcon" alt="Logo" />
          </Link>
        </div>
        <div className='log'>
          <Link
            className='headLinkText'
            to={`/news`}>
            {i18next.t('news')}
          </Link>
          <button
            className='main'
            onClick={async () => {
              user.theme = user.theme === 'dark' ? 'light' : 'dark';
              setTheme(user.theme);
              const element = document.getElementsByTagName('body')[0];
              element.setAttribute('data-theme', user.theme);
              await db.collection("users").doc(user.uid).set({
                ...user
              }); 
              updateUser(user);
            }}
          >
            <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon}/>
          </button>
          <a
            className={"headLink empty"}
            onClick={() => {
              window.open('https://twitter.com/praythedice', '_blank');
            }}
          >
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <div className="dropdown">
            <button className={'dropbtn main'}>
              {user.name} <ChevronDownIcon style={{height:15, marginLeft: 2}}/>
            </button>
            <div className="dropdown-content">
              <button
                className="btnDrop"
                onClick={() => {
                  updateUser({
                    uid: null,
                    displayName: null,
                  });
                  firebase.auth().signOut();
                }}
              >
                {i18next.t('logout')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
export default HeaderBar