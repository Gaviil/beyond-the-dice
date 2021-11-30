/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useContext} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import {
  Switch,
  Route,
  Link,
  useRouteMatch,
} from "react-router-dom";
import { uid } from 'uid';
import i18next from 'i18next';
import UserContext from '../context/UserContext';
import CampaignContext from '../context/CampaignContext';
import Characters from './Characters';
import NewCampaignForm from '../components/NewCampaignForm';
import {init} from '../utils/initFirebase'
import '../styles/campaigns.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useHistory} from "react-router-dom";

init();
const db = firebase.firestore();


const Campaigns = (props) => {
  const [campaigns, setCampaigns] = useState([]);
  const [campaign, setCampaign] = useState({
    uid: null,
    idUserDm: null,
    name: null,
    invitationCode: null,
    createdAt: null
  });
  const [invitationJoinCode, setInvitationJoinCode] = useState(undefined);
  const [campaignToJoin, setCampaignToJoin] = useState(undefined);
  let match = useRouteMatch();
  const history = useHistory();

  const {user} = useContext(UserContext)
  const contextValue = {
    campaign,
    updateCampaign: setCampaign
  }

  useEffect( () => {
    if(user.uid && campaigns.length === 0) {
      getCampaignByCharacter();
      // const savedCampaignsList = getValueOnLocalStorage('campaignsList');
      // const savedUserUid = getValueOnLocalStorage('userUid');
      // if(!savedCampaignsList || savedUserUid !== user.uid) {
      //   getCampaignByCharacter();
      // } else {
      //   setCampaigns(savedCampaignsList);
      // }
    }
  }, []);

  useEffect( () => {
    if(campaign && campaign.uid && campaignToJoin) {
      history.push(`${match.url}/${campaign.uid}`);
    }
  }, [campaign]);

  const getCampaignByCharacter = async () => {
    const listUidCampaignByCharacter = [];
    await db.collection('characters').where('idUser', '==', user.uid).get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          if(!listUidCampaignByCharacter.some(element => (doc.data().idCampaign === element))) {
            listUidCampaignByCharacter.push(doc.data().idCampaign)
          }
      });
      getCampaignForCharacter(listUidCampaignByCharacter)
    })
    .catch(err => {
      console.log(err.message)
    })
  }

  const getCampaignForCharacter = async (uidList) => {
    const campaignsByCharacter = [];
    for( let i = 0; i < uidList.length; i +=1) {
      await db.collection('campaigns').doc(uidList[i]).get()
        .then(queryCampaign => {
          if(queryCampaign.data().active) {
            campaignsByCharacter.push(queryCampaign.data());
          }
        })
      .catch(err => {
        console.log(err.message)
      })
    }
    getCampaigns(campaignsByCharacter)
  }

  const getCampaigns = (campaignsByCharacter) => {
    const listCampaigns = [...campaignsByCharacter];
    db.collection('campaigns').where('idUserDm', '==', user.uid).where('active', '==', true).get()
      .then(querySnapshot => {
        querySnapshot.forEach( doc => {
          if(!campaignsByCharacter.some(element => (doc.data().uid === element.uid))) {
            listCampaigns.push(doc.data())
          }
        });
      setCampaigns(listCampaigns);
      // setValueOnLocalStorage('campaignsList',listCampaigns);
      // setValueOnLocalStorage('userUid',user.uid);
    })
    .catch(err => {
      console.log(err.message)
    })
  }

  const getInvitationCodeGame = () => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const sendGame = async (name) => {
    // const savedCampaignsList = getValueOnLocalStorage('campaignsList');
    const savedCampaignsList = [...campaigns];
    const invitationCode = getInvitationCodeGame();
    const gameUid = uid();
    const data = {
      createdBy: user.displayName,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      lastUpdateAt: firebase.firestore.FieldValue.serverTimestamp(),
      idUserDm: user.uid,
      invitationCode: invitationCode,
      name: name,
      uid: gameUid,
      active: true,
      clickStat: true,
      renameCharacter: false,
      hideValueCharacterStatsOnChat: false,
    };
    savedCampaignsList.push(data)
    await db.collection('campaigns').doc(gameUid).set(data).then(res => {
      toast.success(`${name} ${i18next.t('was created with success')}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setCampaigns(savedCampaignsList);
      // setValueOnLocalStorage('campaignsList',savedCampaignsList);
    }).catch(e => {
      console.log(e)
    });
  }

  const joinCampaignByInvitationCode = async () => {
    await db.collection('campaigns').where('invitationCode', '==', invitationJoinCode).where('active', '==', true).get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          setCampaignToJoin(doc.data());
          setCampaign(doc.data());
        });
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  return (
    <div className='mainContainer'>
      <CampaignContext.Provider value={contextValue}>
        <Switch>
          <Route path={`${match.url}/:campaignIdUrl`}>
            <Characters/>
          </Route>
          <Route path={match.path}>
            <div className={'containerCampaigns compactPage'}>
              <div className='campaignList'>
                <h3>{i18next.t('my campaign')}</h3>
                <ul>
                  {campaigns.map(campaign => (
                  <li key={campaign.uid}>
                    <Link
                      className='link'
                      onClick={() => {
                        setCampaign(campaign)
                      }}
                      to={`${match.url}/${campaign.uid}`}>
                      {campaign.name}
                    </Link>
                  </li>
                ))}
                </ul>
              </div>
              <div>
                <h3>{i18next.t('create campaign')}</h3>
                <NewCampaignForm className='formNewCampaign' createCampaign={(campaignName) => {
                  sendGame(campaignName);
                }}/>
              </div>

              <div className='formJoin'>
                <h3>{i18next.t('join campaign')}</h3>
                <form  
                  className='formFullWidthMobile'
                  onSubmit={(e) => {
                  if(invitationJoinCode) {
                    joinCampaignByInvitationCode();
                  }
                  e.preventDefault();
                }}>
                  <input
                    name="campaignName"
                    type="text"
                    placeholder={i18next.t('invitation code')}
                    value={invitationJoinCode}
                    onChange={(e) => setInvitationJoinCode(e.target.value)}
                  />
                  <input type="submit" value={i18next.t('search')} />
                </form>

              </div>
            </div>
          </Route>
        </Switch>
      </CampaignContext.Provider>
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

export default Campaigns