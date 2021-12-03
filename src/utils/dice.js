import i18next from 'i18next';

/**
 * @param  {Number} max The value max of the dice
 * @param  {String} uidUserDmCampaign Uid of the DM for the current campaign
 * @param  {{}} character Json of the current Character
 * @param  {{}} user Json of the user account
 * @param  {{}} stat Json of the current stat rolled
 * @returns {{}} Json with all data to send at Firestore
 */
export const getRoll = (max, uidUserDmCampaign, character, user ,stat, hideRollSwitch = false, prefixTradStat) => {
  console.log(stat);
    const randomValue = Math.floor(Math.random() * max) + 1;
    const isDm = uidUserDmCampaign === user.uid;
    const statRoll = { ...stat };
    if(prefixTradStat === 'characteristics') {
      statRoll.value = statRoll.value * 5;
    }
    if(!character) {
      character = {
        uid:'DMMODE',
        picture: 'https://firebasestorage.googleapis.com/v0/b/beyondthedice-cfc1b.appspot.com/o/charactersPictures%2Fnopicture.png?alt=media&token=4a376f9c-0235-4b6c-889b-f1ffd6d12a48'
      }
    }
    const dataRoll = {
      createdAt: new Date(Date.now()).toLocaleDateString("fr-FR"),
      userName: !isDm ? character.name : i18next.t('dm'),
      userUid: user.uid,
      characterId: character ? character.uid : 'DM',
      value: randomValue,
      diceType: max,
      pictureUserSendRoll: character.picture || user.photoURL,
      stat: statRoll,
      isHided: hideRollSwitch,
      prefixTradStat: prefixTradStat || null,
    }
    return dataRoll
    // props.setNewDice(dataRoll);
  }

export const getLabelDice = (dice, campaign, user) => {
  const {stat, prefixTradStat, } = dice;
  if(stat && Object.keys(stat).length > 0) {
    return `${stat.isCustom ? stat.label : i18next.t(`${prefixTradStat}.${stat.label}`)} ${!campaign.hideValueCharacterStatsOnChat || campaign.idUserDm === user.uid ? `(${stat.value})` : ''}`
  } 
  return `d${dice.diceType} ${i18next.t('customized')}`
}