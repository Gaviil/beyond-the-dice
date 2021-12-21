import React from 'react';
import i18next from 'i18next';
import {getRoll} from '../utils/dice';
import {dynamicSortWithTraduction} from '../utils/sort';

const Skills = (props) => {
  return (
    <ul>
      {
        props.characteristics.sort(dynamicSortWithTraduction("label", 'characteristics')).map((charac, i) => (
          <li
            key={i}
            style={{cursor: props.campaign.clickStat ? 'pointer' : 'default'}}
            onClick={() => {
            if(props.campaign.clickStat) {
              props.sendNewRoll(getRoll(100,props.campaign.idUserDm, props.character, props.user, charac, props.hideRollSwitch, 'characteristics'))
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
  );
  
}

export default Skills