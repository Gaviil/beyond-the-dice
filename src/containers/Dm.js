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
  isMobile,
  isDesktop
} from "react-device-detect";
import { toast } from 'react-toastify';
import DmCompany from '../components/DmCompany';
import {getLabelDice} from '../utils/dice'
import {useHistory} from "react-router-dom";
import Statistics from "../components/Statistics";
import i18next from 'i18next';
import CampaignSettings from '../components/CampaignSettings';
import { UserIcon, ChartPieIcon, CogIcon, AnnotationIcon } from '@heroicons/react/outline';

init();
const db = firebase.firestore();

const Dm = (props) => {
  const {user} = useContext(UserContext);
  const {campaign, updateCampaign} = useContext(CampaignContext)
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

  const updateCampaignFirestore = async (newCampaignData) => {
    newCampaignData.lastUpdateAt = firebase.firestore.FieldValue.serverTimestamp();
    await db.collection('campaigns').doc(newCampaignData.uid).set(newCampaignData).then(res => {
      toast.success(i18next.t('update succed'), {});
      firebase.analytics().logEvent('updateConfigCampaign', {
        ...newCampaignData
      });
    }).catch(err => {
      toast.error(err, {});
    });
  }

  if(campaign.uid && campaign.idUserDm !== user.uid ) {
    history.goBack();
  }
  if(campaign.idUserDm === user.uid) {
    return (
      <div className='containerCharacterView'>
        <div className={view === 'company' ? 'DMContainer' : 'DMContainerFull'}>
          <div className='containerInfoComp'>
            <BrowserView className='tabsDetails'>
              <ul className='tabsContainer'>
                <li
                  className={`tab ${view === 'company' ? 'active' : ''}`}
                  onClick={() => {
                    setView('company');
                  }}  
                >
                  {i18next.t('characters')}
                </li>
                { rollList.length > 0 && company.length > 0 && isDesktop && (
                  <li
                    className={`tab ${view === 'stats' ? 'active' : ''}`}
                    onClick={() => {
                      setView('stats');
                    }}  
                  >
                    {i18next.t('stats.title')}
                  </li>
                )}
                <li
                  className={`tab ${view === 'settings' ? 'active' : ''}`}
                  onClick={() => {
                    setView('settings');
                  }}  
                >
                  {i18next.t('settings campaign')}
                </li>
              </ul>
            </BrowserView>
            <MobileView className='tabsDetailsMobile'>
              <ul className='mobileTabsContainer'>
                <li
                  className={`tab ${view === 'company' ? 'active' : ''}`}
                  onClick={() => {
                    setView('company');
                  }}  
                >
                  <UserIcon className='iconTabMobile' />
                </li>
                { rollList.length > 0 && (
                  <li
                    className={`tab ${view === 'diceChat' ? 'active' : ''}`}
                    onClick={() => {
                      setView('diceChat');
                    }}  
                  >
                    <AnnotationIcon className='iconTabMobile' />
                  </li>
                )}
                { rollList.length > 0 && company.length > 0 && isDesktop && (
                  <li
                    className={`tab ${view === 'stats' ? 'active' : ''}`}
                    onClick={() => {
                      setView('stats');
                    }}  
                  >
                    <ChartPieIcon className='iconTabMobile' />
                  </li>
                )}
                <li
                  className={`tab ${view === 'settings' ? 'active' : ''}`}
                  onClick={() => {
                    setView('settings');
                  }}  
                >
                    <CogIcon className='iconTabMobile' />
                </li>
              </ul>
            </MobileView>
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
              {view === 'settings' && (
                <CampaignSettings 
                  campaign={campaign}
                  update={(campagneUpdated) => {
                    updateCampaign(campagneUpdated);
                    updateCampaignFirestore(campagneUpdated);
                  }}
                />
                
              )}
              {view === 'diceChat' && (
                <DiceHistorical
                  list={rollList}
                  hideRollSwitch={hideRollSwitch}
                  setHideRoll={(val) => {
                    setHideRollSwitch(val)
                  }}
                />
              )}
            </div>
          </div>
          {view === 'company' && (
            <BrowserView className='containerHisto'>
              <DiceHistorical
                list={rollList}
                hideRollSwitch={hideRollSwitch}
                setHideRoll={(val) => {
                  setHideRollSwitch(val)
                }}
              />
            </BrowserView>
          )}
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
    return null;
  }
}

export default Dm