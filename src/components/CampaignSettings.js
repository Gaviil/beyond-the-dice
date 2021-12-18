import React from 'react';
import i18next from 'i18next';
import CheckboxSwitch from './CheckboxSwitch'
const CampaignSettings = (props) => {
  const {campaign} = props;
  return (
    <div className='settingsCampaign'>
      <h3>{i18next.t('settings campaign')}</h3>
      <CheckboxSwitch
        isChecked={campaign.hideValueCharacterStatsOnChat}
        label={i18next.t('campaignSettings.hide character stat value on chat')}
        update={(value) => {
          const newData = {...campaign}
          newData.hideValueCharacterStatsOnChat = value;
          props.update(newData);
        }}
      />
      <CheckboxSwitch
        isChecked={campaign.renameCharacter}
        label={i18next.t('campaignSettings.rename character')}
        update={(value) => {
          const newData = {...campaign}
          newData.renameCharacter = value;
          props.update(newData);
        }}
      />
      <CheckboxSwitch
        isChecked={campaign.clickStat}
        label={i18next.t('campaignSettings.click to roll')}
        update={(value) => {
          const newData = {...campaign}
          newData.clickStat = value;
          props.update(newData);
        }}
      />
      <CheckboxSwitch
        isChecked={campaign.playerCanSeeAllCards}
        label={i18next.t('campaignSettings.playerCanSeeCards')}
        update={(value) => {
          const newData = {...campaign}
          if(value === false ) {
            newData.playerCanUpdateCardsUsed = false;
          }
          newData.playerCanSeeAllCards = value;
          props.update(newData);
        }}
      />
      <CheckboxSwitch
        disabled={!campaign.playerCanSeeAllCards}
        isChecked={campaign.playerCanUpdateCardsUsed}
        label={i18next.t('campaignSettings.playerCanEditCards')}
        update={(value) => {
          const newData = {...campaign}
          newData.playerCanUpdateCardsUsed = value;
          props.update(newData);
        }}
      />
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