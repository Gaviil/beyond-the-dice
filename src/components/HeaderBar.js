import React, {useContext} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import UserContext from "../context/UserContext";
import '../styles/headerbar.css';
import {Link, useParams} from "react-router-dom";
import i18next from 'i18next';
import logo from '../assets/Images/logo150.png';

const HeaderBar = (props) => {
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
              {user.name}
            </button>
            <div className="dropdown-content">
              {/* <button
                className="btnDrop" 
                onClick={() => {
                  localStorage.clear();
                  document.location.reload();
                }}
              >
                {i18next.t('clear cache')}
              </button> */}
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