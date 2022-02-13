import React, {useEffect, useState} from 'react';
import i18next from 'i18next';
import {getRoll} from '../utils/dice';
import {dynamicSortWithTraduction} from '../utils/sort';
import ContextMenu from './ContextMenu';

const Skills = (props) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [characWithModifier, setCharacWithModifier] = useState({});

  const handleContextMenu = (e) => {
    let stat = null;
    e.preventDefault();
    if(e.target.getAttribute('data-charac')) {
      stat = JSON.parse(e.target.getAttribute('data-charac'));
    } else {
      stat = JSON.parse(e.target.parentElement.getAttribute('data-charac'));
    }
    if(stat) {
      setCharacWithModifier(stat);
      e.pageX + 250 > window.innerWidth + window.scrollY ? setX(`${(window.innerWidth + window.scrollY) - 270}px`) : setX(e.pageX);
      e.pageY + 115 > window.innerHeight + window.scrollY ? setY(`${(window.innerHeight + window.scrollY) - 135}px`) : setY(e.pageY);
      setShowMenu(true);
    }
  }

  const handleClick = (e) => {
    if(showMenu && e.target.id === 'blockMenu') {
      setShowMenu(false);
      setCharacWithModifier({});
    }
  }

  useEffect(() => {
    if(props.campaign.clickStat) {
      document.addEventListener('click',handleClick)
      document.getElementById('characsBox').addEventListener('contextmenu',handleContextMenu)
      return () => {
        document.removeEventListener('click', handleClick);
        document.getElementById('characsBox').removeEventListener('contextmenu', handleContextMenu);
      }
    }
  })

  return (
    <>
      <ContextMenu
        x={x}
        y={y}
        showMenu={showMenu}
        stat={characWithModifier}
        prefix='characteristics'
        rollDice={(characterModifier) => {
          setShowMenu(false);
          props.sendNewRoll(getRoll(100,props.campaign.idUserDm, props.character, props.user, characterModifier, props.hideRollSwitch, 'characteristics'))
        }}
      />
      <ul id='characsBox'>
        {
          props.characteristics.sort(dynamicSortWithTraduction("label", 'characteristics')).map((charac, i) => (
            <li
              key={i}
              className='characBlock'
              style={{cursor: props.campaign.clickStat ? '' : 'default'}}
              data-charac={JSON.stringify(charac)}
              onClick={() => {
              if(props.campaign.clickStat) {
                const characRoll = {
                  ...charac
                }
                characRoll.value = characRoll.value * 5;
                props.sendNewRoll(getRoll(100,props.campaign.idUserDm, props.character, props.user, characRoll, props.hideRollSwitch, 'characteristics'))
              }
            }}>
              <span className='title'>
                {i18next.t(`characteristics.${charac.label}`)}
              </span>
              <span className='subtitle'>
                ({charac.value})
              </span>
              <span className='value'>
                {charac.value * 5}
              </span>
            </li>
          ))
        }
      </ul>
    </>
  );
  
}

export default Skills