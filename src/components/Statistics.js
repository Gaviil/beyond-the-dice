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
  const stats = getStats(rollList, company);
  const mostRollSkill = getMostUsedSkills(rollList, company);
  return (
    <div className='statsCampaign'>
      <div className='chartLong multiBlock'>
        <Block label={i18next.t('stats.TotalRoll')} value={getNumberOfDiceRoll(rollList)}/>
        <Block label={i18next.t('stats.criticSuccess')} value={getNumberOfCriticalSuccess(rollList)} background="#007991"/>
        <Block label={i18next.t('stats.criticFail')} value={getNumberOfCriticalFail(rollList)} background="#D52941"/>
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
      <div className='chartLong'>
        <h3>Utilisation des compétences</h3>
        <MyRadar 
          data={mostRollSkill}
          // title={i18next.t('stats.statisticUsed')}
          // labels={mostRollSkill.name}
          // values={mostRollSkill.value}
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