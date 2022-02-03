import React, {useEffect, useState} from 'react';
import i18next from 'i18next';
import {dynamicSortWithTraduction} from '../utils/sort';
import {getRoll} from '../utils/dice';
import ContextMenu from './ContextMenu';

const Skills = (props) => {
  const skillList = props.skills.filter(skill => !skill.isSpecial);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [skillWithModifier, setSkillWithModifier] = useState({});

  const handleContextMenu = (e) => {
    e.preventDefault();
    if(e.target.getAttribute('data-skill')) {
      setSkillWithModifier(JSON.parse(e.target.getAttribute('data-skill')));
    } else {
      setSkillWithModifier(JSON.parse(e.target.parentElement.getAttribute('data-skill')));
    }
    e.pageX + 250 > window.innerWidth ? setX(`${window.innerWidth - 270}px`) : setX(e.pageX);
    e.pageY + 115 > window.innerHeight ? setY(`${window.innerHeight - 135}px`) : setY(e.pageY);
    setShowMenu(true);
  }

  const handleClick = (e) => {
    if(showMenu && e.target.id === 'blockMenu') {
      setShowMenu(false);
      setSkillWithModifier({});
    }
  }

  useEffect(() => {
    document.addEventListener('click',handleClick)
    document.getElementById('skillsBox').addEventListener('contextmenu',handleContextMenu)
    return () => {
      document.removeEventListener('click', handleClick);
      document.getElementById('skillsBox').removeEventListener('contextmenu', handleContextMenu);
    }
  })

  return (
    <>
      <ContextMenu
        x={x}
        y={y}
        showMenu={showMenu}
        stat={skillWithModifier}
        prefix='skills'
        rollDice={(skillModifier) => {
          setShowMenu(false);
          props.sendNewRoll(getRoll(100,props.campaign.idUserDm, props.character, props.user, skillModifier, props.hideRollSwitch, 'skills'))
        }}
      />
      <ul id='skillsBox'>
          {
          skillList.sort(dynamicSortWithTraduction("label", 'skills')).map((skill,i) => (
            <li
              style={{cursor: props.campaign.clickStat ? 'context-menu' : 'default'}}
              key={i}
              data-skill={JSON.stringify(skill)}
              onClick={() => {
                if(props.campaign.clickStat) {
                  props.sendNewRoll(getRoll(100,props.campaign.idUserDm, props.character, props.user, skill, props.hideRollSwitch, 'skills'))
                }
                
              }}
            >
              <span>
                {skill.isCustom ? skill.label : i18next.t(`skills.${skill.label}`)}
              </span>
              <span>
                {skill.value}
              </span>
            </li>
          ))
        }
      </ul>
    </>
  );
  
}

export default Skills