import React, {useContext} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import UserContext from "../context/UserContext";
import '../styles/headerbar.css';
import {Link} from "react-router-dom";
import i18next from 'i18next';
import logo from '../assets/Images/logo150.png';
import {
  ChevronDownIcon
} from '@heroicons/react/solid'
const HeaderBar = (props) => {
  const db = firebase.firestore();
  const {user, updateUser} = useContext(UserContext)
  return (
    <header>
      <div className='header'>
        <div className='logo'>
          <Link className={'link homeLink'} to="/campaigns">
            <img src={logo} className="homeLinkIcon" alt="Logo" />
          </Link>
        </div>
        <div className='log'>
          <div className="dropdown">
            <button className={'dropbtn main'}>
              {user.name} <ChevronDownIcon style={{height:15, marginLeft: 2}}/>
            </button>
            <div className="dropdown-content">
              <button
                className="btnDrop" 
                onClick={() => {
                  window.open('https://twitter.com/praythedice', '_blank');
                }}
              >
                {i18next.t('news')}
              </button>
              <button
                className="btnDrop" 
                onClick={async () => {
                  user.theme = user.theme === 'dark' ? 'light' : 'dark';
                  const element = document.getElementsByTagName('body')[0];
                  element.setAttribute('data-theme', user.theme);
                  updateUser(user);
                  await db.collection("users").doc(user.uid).set({
                    ...user
                  }); 
                }}
              >
                {i18next.t('theme')}
              </button>
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