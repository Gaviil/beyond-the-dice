import i18next from 'i18next';
import React from 'react';
import {
    getStats,
    getNumberOfDiceRoll,
    getNumberOfCriticalSuccess,
    getNumberOfCriticalFail,
    getMostUsedSkills
  } from '../utils/stats';
import "../styles/statistics.css";
import { MyPie, MyBar, Block, MyRadar } from './Charts';

const Statistics = (props) => {
  const {rollList, company} = props;
  const cleanRollList = rollList.filter(roll => roll.diceType !== "Magic")
  const stats = getStats(cleanRollList, company);
  const mostRollSkill = getMostUsedSkills(cleanRollList, company);
  return (
    <div className='statsCampaign'>
      <div className='chartLong multiBlock'>
        <Block label={i18next.t('stats.TotalRoll')} value={getNumberOfDiceRoll(cleanRollList)} background="#ea9010"/>
        <Block label={i18next.t('stats.criticSuccess')} value={getNumberOfCriticalSuccess(cleanRollList)} background="#007991"/>
        <Block label={i18next.t('stats.criticFail')} value={getNumberOfCriticalFail(cleanRollList)} background="#D52941"/>
      </div>
      <div className='chart'>
        <h3>Moyenne de résultat (d100)</h3>
        <MyPie 
          labels={stats.characters}
          values={stats.averageRoll}
        />
      </div>
      <div className='chart'>
        <h3>Nombre de dé lancés</h3>
        <MyPie 
          labels={stats.characters}
          values={stats.numberOfRoll}
        />
      </div>
      <div className='chartLong radar'>
        <h3>Utilisation des compétences</h3>
        <MyRadar 
          data={mostRollSkill}
        />
      </div>
      <div className='chartLong'>
        <MyBar 
          labels={stats.characters}
          valuesOne={stats.criticalSuccess}
          valuesTwo={stats.criticalFail}
        />
      </div>
    </div>
  );
  
}

export default Statistics