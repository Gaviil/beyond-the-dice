import React, {useEffect, useState, useContext} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import 'firebase/analytics';
import {init} from '../utils/initFirebase'
import DiceHistorical from '../components/DiceHistorical';
import DiceRoll from '../components/DiceRoll';
import UserContext from '../context/UserContext';
import CampaignContext from '../context/CampaignContext';
import '../styles/character.css';
import '../styles/modal.css';
import {getRoll} from '../utils/dice';
import {
  BrowserView,
  MobileView,
  isMobile
} from "react-device-detect";
import { toast } from 'react-toastify';
import DmCompany from '../components/DmCompany';
import {getLabelDice} from '../utils/dice'
import {useHistory} from "react-router-dom";
import Statistics from "../components/Statistics";
import i18next from 'i18next';

init();
const db = firebase.firestore();

const Dm = (props) => {
  const {user} = useContext(UserContext);
  const {campaign} = useContext(CampaignContext);
  const [rollList, setRollList] = useState([]);
  const [hideRollSwitch,setHideRollSwitch] = useState(false);
  const [company, setCompany] = useState([]);
  const [view, setView] = useState('company');
  const history = useHistory();

  useEffect(() => {
    if(campaign.uid){
      // console.log('plop');
      getCharactersCompany(campaign);
      // console.log(campaign.uid);
      const dbRefObject = firebase.database().ref().child(`${campaign.uid}`);
      dbRefObject.on('value', snap => {
        // console.log(snap.val());
        setRollList(Object.values(snap.val() || {}));
      });
    }
  }, [campaign]);
  
  const sendNewRoll = async (newRoll) => {
    const newList = [
      ...rollList
    ];
    newList.push(newRoll);
    firebase.database().ref().child(`${campaign.uid}`).set(newList);
    if(isMobile) {
      toast.success(`${getLabelDice(newRoll, campaign, user)} : ${newRoll.value}`, {});
    }
    firebase.analytics().setUserId(user.uid);
    firebase.analytics().setUserProperties({
      name: user.displayName,
      uid: user.uid,
      campaign: campaign.uid,
    });

    const labelStat = newRoll.stat ? newRoll.stat.label : 'Custom'
    firebase.analytics().logEvent('Roll', {
      campaign: campaign.uid,
      type: newRoll.diceType,
      stat: labelStat,
      result: newRoll.value
    });
  }

  const getCharactersCompany = async (currentCampaign) => {
    try {
      const listCharactersGroup = [];
      await db.collection('characters').where('idCampaign', '==', currentCampaign.uid).where('active', '==', true).where('idUser', '!=', currentCampaign.idUserDm).get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            listCharactersGroup.push(doc.data())
          });
          setCompany(listCharactersGroup);
        })
        .catch(err => {
          console.log('err',err)
        })
    } catch (error) {
      console.log('error',error);
    }
  }

  if(campaign.idUserDm === user.uid) {
    return (
      <div className='containerCharacterView'>
        <div className='characterContainer'>
          <MobileView className='linkChatContainerDmView'>
              {/* <Link
                className='link'
                to={`${match.url}/chat`}
              >
                <img className="iconChat" src={chat} alt="chat" />
              </Link> */}
            </MobileView>
          <div className='containerInfoComp'>
            <BrowserView className='tabsDetails'>
            <ul className='tabsContainer'>
              <li
                className={`tab ${view === 'company' ? 'active' : ''}`}
                onClick={() => {
                  setView('company');
                }}  
              >
                {i18next.t('company')}
              </li>
              <li
                className={`tab ${view === 'stats' ? 'active' : ''}`}
                onClick={() => {
                  setView('stats');
                }}  
              >
                {i18next.t('stats.title')}
              </li>
            </ul>
          </BrowserView>
            <div className='contentDm'>
              {company && view === 'company' && (
                <DmCompany
                  reloadCompany={() => {
                    getCharactersCompany(campaign)
                  }}
                  company={company}
                />
              )}
              {rollList.length > 0 && view === 'stats' && (
                <Statistics
                  rollList={rollList}
                  company={company}
                />
              )}
            </div>
          </div>
          <BrowserView className='containerHisto'>
            <DiceHistorical
              list={rollList}
              hideRollSwitch={hideRollSwitch}
              setHideRoll={(val) => {
                setHideRollSwitch(val)
              }}
            />
          </BrowserView>
          <BrowserView>
            <DiceRoll
              chat={false}
              setNewDice={(valMaxRoll) => {
                sendNewRoll(getRoll(valMaxRoll,campaign.idUserDm, null, user, null, hideRollSwitch, null))
              }}
            />
          </BrowserView>
        </div>
      </div>
    );
  } else {
    history.goBack();
    return null;
  }
}

export default Dm