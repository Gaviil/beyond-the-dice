/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useContext} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";
import {
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { uid } from 'uid';
import Character from './Character';
import Dm from './Dm';
import NewCharacterForm from '../components/NewCharacterForm';
import UserContext from '../context/UserContext';
import CampaignContext from '../context/CampaignContext';
import CharacterContext from '../context/CharacterContext';
import {init} from '../utils/initFirebase'
import '../styles/characters.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import i18next from 'i18next';
// import {setValueOnLocalStorage, getValueOnLocalStorage} from "../utils/localStorage";
import Picture from '../components/Picture';
import logo from '../assets/Images/logo150.png';
import CampaignSettings from '../components/CampaignSettings';
import alchemy from '../assets/alchemy.json';

init();
const db = firebase.firestore();

const Characters = (props) => {
  let match = useRouteMatch();
  let { campaignIdUrl } = useParams();
  const [characters, setCharacters] = useState([])
  const [character, setCharacter] = useState({
      name: '',
      uid: undefined,
      idCampaign: undefined,
      idUser: undefined,
      currentHp: undefined,
      maxHp: undefined,
      description: '',
      skills: [],
      characteristics: [],
  })
  const {user} = useContext(UserContext)
  const {campaign, updateCampaign} = useContext(CampaignContext)
  const campaignIdUsed = campaign.uid || campaignIdUrl;
  
  const contextValue = {
    character,
    updateCharacter: setCharacter
  }

  useEffect( () => {
    if(user.uid){
      getCampaign();
    }
  }, []);


  const getCharactersVisibleForUser = async (currentCampaign) => {
    // const savedCaractersList = getValueOnLocalStorage('characters');
    // if(!savedCaractersList || savedCaractersList.length === 0 || campaignIdUrl !== currentCampaign.uid || (savedCaractersList.length > 0 && savedCaractersList[0].idCampaign !== campaignIdUrl)) {
    //   try {
    //     const listCharacters = [];
    //     const listCharactersGroup = [];
    //     await db.collection('characters').where('idCampaign', '==', campaignIdUsed).get()
    //       .then(querySnapshot => {
    //         querySnapshot.forEach(doc => {
    //           if(doc.data().idUser === user.uid || currentCampaign.idUserDm === user.uid) {
    //             listCharacters.push(doc.data())
    //           }
    //           if(doc.data().idUser !== currentCampaign.idUserDm) {
    //             listCharactersGroup.push(doc.data())
    //           }
    //         });
    //         setCharacters(listCharacters);
    //         setValueOnLocalStorage('characters',listCharacters);
    //         setValueOnLocalStorage('company',listCharactersGroup);
    //       })
    //       .catch(err => {
    //         console.log(err.messsage)
    //       })
    //   } catch (error) {
    //     console.log(error);
    //   }
    // } else {
    //   setCharacters(savedCaractersList);
    // }
    try {
      const listCharacters = [];
      const listCharactersGroup = [];
      await db.collection('characters').where('idCampaign', '==', campaignIdUsed).where('active', '==', true).get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            if(doc.data().idUser === user.uid || currentCampaign.idUserDm === user.uid) {
              listCharacters.push(doc.data())
            }
            if(doc.data().idUser !== currentCampaign.idUserDm) {
              listCharactersGroup.push(doc.data())
            }
          });
          setCharacters(listCharacters);
        })
        .catch(err => {
          console.log(err.messsage)
        })
    } catch (error) {
      console.log(error);
    }
  }

  const getCampaign = async () => {
    // const savedCampaign = await getValueOnLocalStorage('currentCampaign');
    // if(!savedCampaign || campaignIdUrl !== savedCampaign.uid) {
    //   console.log('getCampaign');
    //   await db.collection('campaigns').doc(campaignIdUsed).get()
    //     .then(doc => {
    //       updateCampaign(doc.data());
    //       console.log(doc.data());
    //       setValueOnLocalStorage('currentCampaign',{...doc.data()});
    //       getCharactersVisibleForUser(doc.data());
    //   })
    //   .catch(err => {
    //     console.log(err.messsage)
    //   })
    // } else {
    //   updateCampaign({...savedCampaign});
    //   getCharactersVisibleForUser({...savedCampaign});
    // }
    await db.collection('campaigns').doc(campaignIdUsed).get()
    .then(doc => {
      updateCampaign(doc.data());
      getCharactersVisibleForUser(doc.data());
    })
    .catch(err => {
      console.log(err.messsage)
    })
  }

  const createCharacter = async (characterData) => {
    const characterUid = uid();
    const data = {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      lastUpdateAt:firebase.firestore.FieldValue.serverTimestamp(),
      name: characterData.name,
      uid: characterUid,
      idCampaign: campaignIdUsed,
      idUser: user.uid,
      currentHp: characterData.hp,
      maxHp: characterData.hp,
      description: characterData.description,
      skills: [...characterData.skills],
      characteristics: [...characterData.characteristics],
      isAlchemist: characterData.isAlchemist,
      inventory: [],
      picture: null,
      active: true
    };
    if(characterData.isAlchemist) {
      data.alchemy = alchemy;
    }
    await db.collection('characters').doc(characterUid).set(data).then(res => {
      // const charactersList = getValueOnLocalStorage('characters');
      const charactersList = [...characters]
      charactersList.push(data);
      setCharacters(charactersList);
      // setValueOnLocalStorage('characters',charactersList);
      // getCharactersVisibleForUser(campaignIdUsed);

      firebase.analytics().logEvent('characterCreation',{
        name: data.name,
        idUser: data.idUser,
        idCampaign: data.idCampaign,
        uid: data.uid
      });
      toast.success(`${characterData.name} ${i18next.t('was created with success')}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }).catch(e => {
      console.log(e)
    });
  }

  const updateCampaignFirestore = async (newCampaignData) => {
    newCampaignData.lastUpdateAt = firebase.firestore.FieldValue.serverTimestamp();
    await db.collection('campaigns').doc(newCampaignData.uid).set(newCampaignData).then(res => {
      toast.success(i18next.t('update succed'), {});
    }).catch(err => {
      toast.error(err, {});
    });
  }

if(user && campaign) {
  return (
    <div className='containerCharacters'>
      <CharacterContext.Provider value={contextValue}>
        <Switch>
          <Route path={`${match.url}/dm`} exact={true}>
            <Dm/>
          </Route>
          <Route path={`${match.url}/:characterIdUrl`}>
            <Character character={character}/>
          </Route>
          <Route path={match.path}>
            <div className="compactPage">
              <div className='listCharacters'>
                <h3>{i18next.t('campaign information')}</h3>
                <div className='campaignInformation'>
                  <div>
                    <p>
                      <span>
                        {`${i18next.t('name')} : `}
                      </span>
                      <span>
                        {`${campaign.name}`}
                      </span>
                    </p>
                    <p>
                      <span>
                        {`${i18next.t('invitation code')} : `}
                      </span>
                      <span>
                        {`${campaign.invitationCode}`}
                      </span>
                    </p>
                  </div>
                  <div>
                    {campaign.createdBy && (
                      <p>
                        <span>
                          {`${i18next.t('dm')} : `}
                        </span>
                        <span>
                          {`${campaign.createdBy}`}
                        </span>
                      </p>
                    )}
                    {campaign.createdAt && (
                      <p>
                        <span>
                          {`${i18next.t('created at')} : `}
                        </span>
                        <span>
                          {`${new Date(campaign.createdAt.seconds*1000).toLocaleDateString() }`}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                {user.uid === campaign.idUserDm && (
                  <CampaignSettings
                    campaign={campaign}
                    update={(campagneUpdated) => {
                      updateCampaign(campagneUpdated);
                      updateCampaignFirestore(campagneUpdated);
                    }}
                  />
                )}
                <h3>{i18next.t('my characters')}</h3>
                <ul className='list'>
                  {user.uid === campaign.idUserDm && (
                    <li>
                      <Link
                        className='link'
                        to={`${match.url}/dm`}
                        onClick={() => {
                          setCharacter(null)
                        }}
                      >
                        <Picture character={{picture: logo}}/>
                        {i18next.t('dm initial')}
                      </Link>
                    </li>
                  )}
                  {characters.map((character, i) => (
                    <li key={i}>
                      <Link
                        className='link'
                        key={character.uid}
                        onClick={() => {
                          setCharacter(character)
                        }}
                        to={`${match.url}/${character.uid}`}
                      >
                        <Picture character={character}/>
                        {character.name.substring(0, 13)}{character.name.length > 14 ? '...' : ''}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <NewCharacterForm
                className='newCharacterForm'
                createCharacter={(character) => {createCharacter(character)}}
              />
            </div>
          </Route>
        </Switch>
      </CharacterContext.Provider>
    </div>
  );
}
}

export default Characters