import React from 'react';
import i18next from 'i18next';

const CampaignSettings = (props) => {
  const {campaign} = props;
  return (
    <div className='settingsCampaign'>
      <h3>{i18next.t('settings campaign')}</h3>
      <div className="switch">
        <label>
          <input
            type="checkbox"
            checked={campaign.hideValueCharacterStatsOnChat}
            onChange={(e) => {
              const newData = {...campaign}
              newData.hideValueCharacterStatsOnChat = e.target.checked;
              props.update(newData);
            }}
          />
          <span className="lever"></span>
          {i18next.t('campaignSettings.hide character stat value on chat')}
        </label>
      </div>
      <div className="switch">
        <label>
          <input
            type="checkbox"
            checked={campaign.renameCharacter}
            onChange={(e) => {
              const newData = {...campaign}
              newData.renameCharacter = e.target.checked;
              props.update(newData);
            }}
          />
          <span className="lever"></span>
          {i18next.t('campaignSettings.rename character')}
        </label>
      </div>
      <div className="switch">
        <label>
          <input
            type="checkbox"
            checked={campaign.clickStat}
            onChange={(e) => {
              const newData = {...campaign}
              newData.clickStat = e.target.checked;
              props.update(newData);
            }}
          />
          <span className="lever"></span>
          {i18next.t('campaignSettings.click to roll')}
        </label>
      </div>
      <button
        className='danger'
        onClick={(e) => {
          if(window.confirm(i18next.t('archive.campaign-validation'))) {
            const newData = {...campaign}
            newData.active = false;
            props.update(newData);
          }
          e.preventDefault()
        }}
      >
        {i18next.t('archive.campaign')}
      </button>
    </div>
  );
  
}

export default CampaignSettings