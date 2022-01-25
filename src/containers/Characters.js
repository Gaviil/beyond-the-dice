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
// import CampaignSettings from '../components/CampaignSettings';
import alchemy from '../assets/alchemy.json';
import {useHistory} from "react-router-dom";
import cards from '../assets/cards.json';
import Statistics from '../containers/Statistics';
import {isDesktop} from "react-device-detect";
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

init();
const db = firebase.firestore();
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxHeight: isDesktop ?' 80%' : '80%',
    maxWidth: isDesktop ?' 50%' : '100%',
    boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
    borderRadius: '0.5rem'
  },
}
const Characters = (props) => {
  let match = useRouteMatch();
  const history = useHistory();
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
  const contextValue = { character, updateCharacter: setCharacter}
  const [modalIsOpen, setIsOpen] = React.useState(false);
  
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect( () => {
    if(user.uid){
      getCampaign();
    }
  }, []);


  const getCharactersVisibleForUser = async (currentCampaign) => {
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
      isMage: characterData.isMage,
      isDeathMage: characterData.isDeathMage,
      inventory: [],
      picture: null,
      active: true
    };
    if(characterData.isDeathMage) {
      data.skills.push({
        isCustom: false,
        label: "deathMagic",
        value: 0,
        isSpecial: true
      });
    }
    if(characterData.isAlchemist) {
      data.alchemy = alchemy;
      data.inventory.push({
        default: true,
        name: "karloff",
        number: 1,
        type: "alchemy"}
      )
      data.inventory.push({
        default: true,
        name: "ingramus",
        number: 1,
        type: "alchemy"}
      )
      data.inventory.push({
        default: true,
        name: "bottle",
        number: 3,
        type: "alchemy"}
      )
    }
    if(characterData.isMage) {
      data.magicCards = [...cards]
    }
    await db.collection('characters').doc(characterUid).set(data).then(res => {
      // const charactersList = getValueOnLocalStorage('characters');
      const charactersList = [...characters]
      charactersList.push(data);
      setCharacters(charactersList);
      // setValueOnLocalStorage('characters',charactersList);
      // getCharactersVisibleForUser(campaignIdUsed);

      firebase.analytics().logEvent('characterCreation',{
        characterName: data.name,
        characterIdUser: data.idUser,
        characterIdCampaign: data.idCampaign,
        characterUid: data.uid,
        characterIsAlchemist: characterData.isAlchemist,
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
      setCharacter(data)
      history.push(`${match.url}/${characterUid}`);
    }).catch(e => {
      console.log(e)
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
            <Route path={`${match.url}/statistics`} exact={true}>
              <Statistics/>
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
                      {isDesktop && (
                        <Link
                          className='linkMain'
                          to={`${match.url}/statistics`}
                        >
                          {i18next.t('stats.title')}
                        </Link>
                      )}
                    </div>
                  </div>
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
                          {i18next.t('dm')}
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
                    <li>
                      <div
                        className={"link click"}
                        onClick={() => {
                          openModal()
                        }}
                      >
                        <Picture character={{picture: null, framePicture: 'https://firebasestorage.googleapis.com/v0/b/beyondthedice-cfc1b.appspot.com/o/frame%2Fadd.png?alt=media&token=c6f8f6ee-ec14-4671-9208-ec3f8fd09f25'}}/>
                      </div>
                    </li>
                  </ul>
                </div>
                <div>
                  <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    overlayClassName="Overlay"
                    contentLabel="Example Modal"
                  >
                    <FontAwesomeIcon onClick={() => closeModal()} className='click' icon={faTimes} style={{position: 'absolute', right: 20, top: 20}}/>
                    <NewCharacterForm
                      className='newCharacterForm'
                      createCharacter={(character) => {createCharacter(character)}}
                    />
                  </Modal>
                </div>
              </div>
            </Route>
          </Switch>
        </CharacterContext.Provider>
      </div>
    );
  }
}

export default Characters