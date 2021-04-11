import React, {useEffect, useState} from 'react';
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
import { FirebaseDatabaseProvider } from "@react-firebase/database";
import i18next from 'i18next';

import Characters from './Characters';
import NewCampaignForm from '../components/NewCampaignForm';
import {init} from '../utils/initFirebase'
init();
const db = firebase.firestore();


const Campaigns = (props) => {
  const {userId} = props;
  const [campaigns, setCampaigns] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const [invitationJoinCode, setInvitationJoinCode] = useState(null);
  const [campaignToJoin, setCampaignToJoin] = useState(null);
  const [campaignListToSearch, setCampaignListToSearch] = useState([]);
  let match = useRouteMatch();

  useEffect( () => {
    getCampaigns();
  }, [props]);

  useEffect( () => {
    const listCleanUidToSearch = campaignListToSearch.filter((data,index)=>{
      return campaignListToSearch.indexOf(data) === index;
    })
    getCampaignForCharacter(listCleanUidToSearch)
  }, [campaignListToSearch]);


  const getInvitationCodeGame = () => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 4; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const sendGame = async (name = 'test') => {
    const invitationCode = getInvitationCodeGame();
    const gameUid = uid();
    const data = {
      idUserDm: userId,
      invitationCode: invitationCode,
      name: name,
      uid: gameUid
    };
    await db.collection('campaigns').doc(gameUid).set(data).then(res => {
      console.log('game created', invitationCode);
      getCampaigns();
    }).catch(e => {
      console.log(e)
    });
  }


  const joinCampaignByInvitationCode = () => {
    db.collection('campaigns').where('invitationCode', '==', invitationJoinCode).get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(doc.data());
          setCampaignToJoin(doc.data());
        });
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  const getCampaigns = () => {
    const listCampaigns = [];
    db.collection('campaigns').where('idUserDm', '==', userId).get()
      .then(querySnapshot => {
        querySnapshot.forEach( doc => {
          listCampaigns.push(doc.data())
          console.log('dm campaign',listCampaigns);
          setCampaigns(listCampaigns);
        });
        getCharacterForUser()
      })
    .catch(err => {
      console.log(err.message)
    })
  }

  const getCharacterForUser = () => {
    const listUidToSearch = [];
    db.collection('characters').where('idUser', '==', userId).get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          listUidToSearch.push(doc.data().idCampaign)
          // if(!listCampaigns.includes((camp) => (camp.uid === doc.data().idCampaign))) {
          // }
      });
      setCampaignListToSearch(listUidToSearch)
    })
    .catch(err => {
      console.log(err.message)
    })
  }

  const getCampaignForCharacter = (uidList) => {
    const campaignByCharacter = [...campaigns];
    uidList.map((uid) => {
      db.collection('campaigns').doc(uid).get()
        .then(queryCampaign => {
          campaignByCharacter.push(queryCampaign.data())
          setCampaigns(campaignByCharacter);
        })
      .catch(err => {
        console.log(err.message)
      })
    });
  }

  return (
    <div>
      <Switch>
        <Route path={`${match.url}/:campaignIdUrl`}>
          <Characters userId={userId} campaignId={campaign}/>
        </Route>
        <Route path={match.path}>
          <h3>My campagnes list</h3>
          <NewCampaignForm createCampaign={(campaignName) => {
            sendGame(campaignName);
          }}/>


          <form onSubmit={(e) => {
            joinCampaignByInvitationCode();
            e.preventDefault();
          }}>
            <input
              name="campaignName"
              type="text"
              value={invitationJoinCode}
              onChange={(e) => setInvitationJoinCode(e.target.value)}
            />
            <input type="submit" value="Rejoindre" />
          </form>


          {campaignToJoin && (
            <Link onClick={() => setCampaign(campaignToJoin.uid)} to={`${match.url}/${campaignToJoin.uid}`}>
              {`JOIN ${campaignToJoin.name}`}
            </Link>
          )}
      

          {campaigns.map(campaign => (
            <li key={campaign.uid}>
              <Link onClick={() => setCampaign(campaign.uid)} to={`${match.url}/${campaign.uid}`}>
                {campaign.name}
              </Link>
            </li>
          ))}
        </Route>
      </Switch>
      
    </div>
  );
}

export default Campaigns