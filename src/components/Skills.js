import React from 'react';
import i18next from 'i18next';
import {dynamicSortWithTraduction} from '../utils/sort';
import {getRoll} from '../utils/dice';

const Skills = (props) => {
  return (
    <ul>
        {
        props.skills.sort(dynamicSortWithTraduction("label", 'skills')).map((skill,i) => (
          <li
            style={{cursor: props.campaign.clickStat ? 'pointer' : 'default'}}
            key={i}
            onClick={() => {
              props.sendNewRoll(getRoll(100,props.campaign.idUserDm, props.character, props.user, skill, props.hideRollSwitch, 'skills'))
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
  );
  
}

export default Skills