import i18next from 'i18next';
import React from 'react';
import {
    getNumberOfDiceRoll,
    getNumberOfCriticalFail,
    getNumberOfCriticalSuccess,
    unluckiest,
    luckiestPlayer,
    mostThrows,
  } from '../utils/stats';

const Statistics = (props) => {
  const {rollList, company} = props;
  const unlucky = unluckiest(rollList, company);
  const luckiest = luckiestPlayer(rollList, company);
  const characterWithTheMostThrows = mostThrows(rollList, company);
  return (
    <div className='statsCampaign'>
      <h2>{i18next.t('stats.title')}</h2>
      <div>
        <span>
          {i18next.t('stats.TotalRoll')} :
        </span>
        <span>
          {getNumberOfDiceRoll(rollList)}
        </span>
      </div>
      <div>
        <span>
          {i18next.t('stats.criticFail')} :
        </span>
        <span>
          {getNumberOfCriticalFail(rollList)}
        </span>
      </div>
      <div>
        <span>
          {i18next.t('stats.criticSuccess')} :
        </span>
        <span>
          {getNumberOfCriticalSuccess(rollList)}
        </span>
      </div>
      <div>
        <span>
          {i18next.t('stats.unluckiestPlayer')} :
        </span>
        <span className="tooltip tooltipStats">
          {unlucky ? `${unlucky.character} (${unlucky.average})` : ''}
            <span className="tooltiptext">{i18next.t('stats.average')}</span>
        </span>
      </div>
      <div>
        <span>
          {i18next.t('stats.luckiestPlayer')} :
        </span>
        <span className="tooltip tooltipStats">
          {luckiest ? `${luckiest.character} (${luckiest.average})` : ''}
          <span className="tooltiptext">{i18next.t('stats.average')}</span>
        </span>
      </div>
      <div>
        <span>
          {i18next.t('stats.mostRollPlayer')} :
        </span>
        <span>
          {characterWithTheMostThrows ? `${characterWithTheMostThrows.character} (${characterWithTheMostThrows.rolls.length})` : ''}
        </span>
      </div>
    </div>
  );
  
}

export default Statistics