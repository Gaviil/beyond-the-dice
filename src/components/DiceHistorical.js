/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useContext, useRef} from 'react';
import CampaignContext from '../context/CampaignContext';
import UserContext from '../context/UserContext';
import '../styles/diceHisto.css';
import i18next from 'i18next';
import { EyeOffIcon } from '@heroicons/react/outline'
import {isDesktop} from "react-device-detect";
import {getLabelDice} from '../utils/dice';

const cleanDuplicate = (arrayRoll, userUid, campaignUserUidDm, diceLoaded = 10) => {

  let savedDate = null;
  let savedPictureUrl = null;

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
    } else {
      roll.createdAt = null;
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
  const histoView = useRef(null)

  // useEffect(() => {
  //   if(document.getElementById("last") && isMobile) {
  //     setTimeout(function(){
  //       document.getElementById("last").scrollIntoView({ behavior: 'smooth'});
  //     }, 250);
  //   }
  // });

  useEffect(() => {
    const rolls = cleanDuplicate(list, user.uid, campaign.idUserDm, limitHisto);
    setDiceHistorical(rolls.reverse());
  }, [list, limitHisto]);

  const isMyRoll = (roll) => {
    if(user.uid === roll.userUid) {
      return true;
    } else if (campaign.idUserDm === user.uid && roll.isDmRoll) {
      return true;
    }
    return false;
  }

  return (
    <div ref={histoView} className='histoView' style={{maxHeight: isDesktop ? `${window.innerHeight - 90}px` : 'none'}}>
      <div className='headerHisto'>
        <div>
          {limitHisto <= diceHistorical.length && (
            <button
              className="empty"
              onClick={() => {
                setLimitHisto(limitHisto + 10);
              }}
            >
              {i18next.t('load more')}
            </button>
          )}
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
      <ul className="listHisto">
        {diceHistorical.length > 0 && (
          diceHistorical.map((histo, i) => {
            return (
              <div key={i}>
                {histo.createdAt && (
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
                    className={`${isMyRoll(histo) ? "myhistoRow" : "histoRow"} bubbleHisto`}
                    style={!isMyRoll(histo) ? {margin: '0.5rem 2.25rem'} : null}
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
                    <span className='histoRightSide'>
                      {histo.value}
                    </span>
                  </li>
                </div>
              </div>
            )
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
export default DiceHistorical