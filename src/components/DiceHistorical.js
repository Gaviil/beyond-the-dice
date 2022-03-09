/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useContext, useRef} from 'react';
import CampaignContext from '../context/CampaignContext';
import UserContext from '../context/UserContext';
import '../styles/diceHisto.css';
import i18next from 'i18next';
import { EyeOffIcon } from '@heroicons/react/outline'
import {isDesktop, isMobile} from "react-device-detect";
import {getLabelDice} from '../utils/dice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiceD20, faSyncAlt, faHandPointRight, faSkull, faChild} from '@fortawesome/free-solid-svg-icons'

const cleanDuplicate = (arrayRoll, userUid, campaignUserUidDm, diceLoaded = 10) => {

  let savedDate = null;
  let savedDateFix = null;
  let savedPictureUrl = null;

  // Fix the undefined on roll date
  for(let i = 0; i < arrayRoll.length; i+=1) {
    if(!arrayRoll[i].createdAt){
      arrayRoll[i].createdAt = savedDateFix;
    }
    savedDateFix = arrayRoll[i].createdAt;
  }
  let arrayVisible = [];
  for (let i = 0; i < arrayRoll.length; i+= 1) {
    if(!arrayRoll[i].isHided || (arrayRoll[i].isHided && arrayRoll[i].userUid === userUid) || (arrayRoll[i].isHided && campaignUserUidDm === userUid)) {
      arrayVisible.push(arrayRoll[i]);
    }
  }
  arrayVisible.splice(0, arrayVisible.length - diceLoaded);
  arrayVisible.map((roll,i) => {
    roll.displayPicture = true;
    if(roll.createdAt && savedDate !== roll.createdAt) {
      savedDate = roll.createdAt;
      roll.showDate = true;
    } else {
      roll.showDate = false;
    }
    if(roll.pictureUserSendRoll && savedPictureUrl !== roll.pictureUserSendRoll) {
      savedPictureUrl = roll.pictureUserSendRoll;
    } else if(i >= 1){
      arrayVisible[i-1].displayPicture = false;
    }
    return null;
  });
  return arrayVisible;
};

const DiceHistorical = (props) => {
  const {list} = props;
  const {user} = useContext(UserContext);
  const {campaign} = useContext(CampaignContext);
  const [limitHisto, setLimitHisto] = useState(15);
  const [diceHistorical, setDiceHistorical] = useState([]);
  const [view,setView] = useState('dice');
  const histoView = useRef(null)

  useEffect(() => {
    if(document.getElementById("last") && isMobile) {
      setTimeout(function(){
        document.getElementById("last").scrollIntoView({ behavior: 'smooth'});
      }, 250);
    }
  });

  useEffect(() => {
    const rolls = cleanDuplicate(list.filter(roll => view === 'dice' ? roll.diceType !== 'update' : (roll.diceType === 'update' && (roll.userUid === user.uid || campaign.idUserDm === user.uid))), user.uid, campaign.idUserDm, limitHisto);
    setDiceHistorical(rolls.reverse());
  }, [list, limitHisto, view]);

  useEffect(() => {
    if(document.getElementById('animationHisto')) {
      document.getElementById('animationHisto').classList.remove('critAnim');
      setTimeout(function a (b){
        document.getElementById('animationHisto').classList.add('critAnim');
      },100);
    }
  }, [list]);

  return (
    <div ref={histoView} className='histoView' style={{maxHeight: isDesktop ? `${window.innerHeight - 90}px` : 'none'}}>
      <div className='headerHisto'>
        <div className='tabsDetails'>
          <ul className='tabsContainer'>
            <li
              className={`tab tabText ${view === 'dice' ? 'active' : ''}`}
              onClick={() => {
                setView('dice');
              }}  
            >
              {i18next.t('dice')}
            </li>
            <li
              className={`tab tabText ${view === 'update' ? 'active' : ''}`}
              onClick={() => {
                setView('update');
              }}  
            >
              {i18next.t('update')}
            </li>
            <li
              className={`tab tabIcon ${view === 'dice' ? 'active' : ''}`}
              onClick={() => {
                setView('dice');
              }}  
            >
              <FontAwesomeIcon icon={faDiceD20}/>
            </li>
            <li
              className={`tab tabIcon ${view === 'update' ? 'active' : ''}`}
              onClick={() => {
                setView('update');
              }}  
            >
              <FontAwesomeIcon icon={faSyncAlt}/>
            </li>
          </ul>
        </div>
        <div className="switch">
          <label>
            <input
              type="checkbox"
              value={props.hideRollSwitch || false}
              onChange={(e) => {
                props.setHideRoll(e.target.checked)
              }}
            />
            <span className="lever"></span>
            {i18next.t('hide roll')}
          </label>
        </div>
      </div>
      <div className='headerHisto'>
        <div>
          <button
            className="empty"
            onClick={() => {
              setLimitHisto(limitHisto + 10);
            }}
          >
            {i18next.t('load more')}
          </button>
        </div>
      </div>
      <ul className="listHisto">
        {diceHistorical.length > 0 && (
          diceHistorical.map((histo, i) => {
            console.log(histo, diceHistorical[i-1])
            if(view === 'dice' && user && campaign) {
              return (
                <ChatBubbleDice
                  histo={histo}
                  user={user}
                  key={i}
                  i={i}
                  campaign={campaign}
                  firstOfGroup={!diceHistorical[i+1] || histo.userUid !== diceHistorical[i+1].userUid}
                  lastOfGroup={!diceHistorical[i-1] || histo.userUid !== diceHistorical[i-1].userUid}
                />
              )
            }
            if(view === 'update' && user && campaign) {
              return (
                <ChatBubbleUpdate
                  histo={histo}
                  user={user}
                  key={i}
                  i={i}
                  campaign={campaign}
                />
              )
            }
            return null;
          })
        )}
        {diceHistorical.length === 0 && (
          <p className='noDiceMessage'>
            {i18next.t('no roll')}
          </p>
        )}
      </ul>
    </div>
  );
}

const ChatBubbleDice = (props) => {
  const {user, histo, i, campaign, firstOfGroup, lastOfGroup} = props;

  const isMyRoll = (roll) => {
    if(user.uid === roll.userUid) {
      return true;
    } else if (campaign.idUserDm === user.uid && roll.isDmRoll) {
      return true;
    }
    return false;
  }

  return (
    <div>
      {histo.showDate && (
        <span className='date'>
          {histo.createdAt}
        </span>
      )}
      <div className={`${isMyRoll(histo) ? "containerRowReverse" : "containerRow"}`}>
        {histo.displayPicture && !isMyRoll(histo) && (
          <div
            className={'userPictureRoll'}
            style={{backgroundImage: `url(${histo.pictureUserSendRoll})`}}  
          />
        )}
        <li
          id={i === 0 ? 'last' : null}
          className={`${isMyRoll(histo) ? "myhistoRow" : "histoRow"} bubbleHisto ${lastOfGroup ? 'lastOfGroup' : ''} ${firstOfGroup ? 'firstOfGroup' : ''}`}
        >
          <div className='histoLeftSide'>
            <span>
              {histo.userName}
            </span>
            <span>
              {getLabelDice(histo,campaign, user)}
            </span>
            {histo.isHided && (
              <EyeOffIcon className="iconHide"/>
            )}
          </div>
          <div className='histoRightSide'>
            {i === 0 && histo.diceType === 100 && histo.stat && histo.value > histo.stat.value && histo.value >= 90 && (
              <FontAwesomeIcon id='animationHisto' className={'histoFailCritIcon critAnim'} icon={faSkull}/>
            )}
            {i === 0 && histo.diceType === 100 && histo.stat && histo.value <= histo.stat.value && histo.value <= 10 && (
              <FontAwesomeIcon id='animationHisto' className={'histoSuccesCritIcon critAnim'} icon={faChild}/>
            )}
            <span>
              {histo.value}
            </span>
          </div>
        </li>
      </div>
    </div>
  );
}

const ChatBubbleUpdate = (props) => {
  const {user, histo, i, campaign} = props;
  const isMyRoll = (roll) => {
    if(user.uid === roll.userUid) {
      return true;
    } else if (campaign.idUserDm === user.uid && roll.isDmRoll) {
      return true;
    }
    return false;
  }

  return (
    <div>
      {histo.showDate && (
        <span className='date'>
          {histo.createdAt}
        </span>
      )}
      <div className={`${isMyRoll(histo) ? "containerRowReverse" : "containerRow"}`}>
        {histo.displayPicture && !isMyRoll(histo) && (
          <div
            className={'userPictureRoll'}
            style={{backgroundImage: `url(${histo.pictureUserSendRoll})`}}  
          />
        )}
        <li
          id={i === 0 ? 'last' : null}
          className={`${isMyRoll(histo) ? "myhistoRow" : "histoRow"} bubbleHistoUpdate`}
          style={!isMyRoll(histo) ? {margin: '0.5rem 2.25rem'} : null}
        >
          <div className='histoLeftSide'>
            {histo.stat && (
              <div className='updateBlock'>
                <span>
                  {`${i18next.t(histo.stat.label)} ${histo.stat.value}`}
                </span>
                  <FontAwesomeIcon className='iconUpdate' icon={faHandPointRight}/>
                <span>
                  {histo.value}
                </span>
              </div>
            )}
            <span>
              {histo.userName}
            </span>
          </div>
        </li>
      </div>
    </div>
  );
}

export default DiceHistorical