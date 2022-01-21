/* eslint-disable no-loop-func */
import i18next from 'i18next';

/**
 * @param  {Number} max The value max of the dice
 * @param  {String} uidUserDmCampaign Uid of the DM for the current campaign
 * @param  {{}} character Json of the current Character
 * @param  {{}} user Json of the user account
 * @param  {{}} stat Json of the current stat rolled
 * @param  {Boolean} hideRollSwitch Boolean to hide the dice result
 * @param  {String} prefixTradStat prefix for translation
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

/**
 * @param  {String} uidUserDmCampaign Uid of the DM for the current campaign
 * @param  {{}} character Json of the current Character
 * @param  {{}} user Json of the user account
 * @param  {{}} stat Json of the current stat rolled
 * @returns {{}} Json with all data to send at Firestore
 */
export const getUpdateJson = (newValue, uidUserDmCampaign, character, user ,stat) => {

    const isDm = uidUserDmCampaign === user.uid;
    const statRoll = { ...stat };
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
      value: newValue,
      diceType: 'update',
      pictureUserSendRoll: character.picture || user.photoURL,
      stat: statRoll,
    }
    return dataRoll
    // props.setNewDice(dataRoll);
  }

export const getLabelDice = (dice, campaign, user) => {
  const {stat, prefixTradStat } = dice;
  if(stat && dice.diceType === 'update') {
    return dice.stat.label
  }
  if(stat && stat.label === 'magicSpell') {
    return i18next.t('mage.magicSpell');
  }
  if(stat && Object.keys(stat).length > 0) {
    return `${stat.isCustom ? stat.label : i18next.t(`${prefixTradStat}.${stat.label}`)} ${!campaign.hideValueCharacterStatsOnChat || campaign.idUserDm === user.uid ? `(${stat.value})` : ''}`
  } 
  return `d${dice.diceType} ${i18next.t('customized')}`
}


/**
 * @param  {} character
 * @param  {} user
 */
export const getMagicCard = (character, user) => {
    const availableCards = character.magicCards.filter(card => card.enable);
    if(availableCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      const rollValue = availableCards[randomIndex].value;
      character.magicCards.find(card => card.value === rollValue).enable = false;

      if(!character) {
        character = {
          uid:'DMMODE',
          picture: 'https://firebasestorage.googleapis.com/v0/b/beyondthedice-cfc1b.appspot.com/o/charactersPictures%2Fnopicture.png?alt=media&token=4a376f9c-0235-4b6c-889b-f1ffd6d12a48'
        }
      }
      const dataRoll = {
        createdAt: new Date(Date.now()).toLocaleDateString("fr-FR"),
        userName: character.name,
        userUid: user.uid,
        characterId: character ? character.uid : 'DM',
        value: rollValue,
        diceType: 'Magic',
        pictureUserSendRoll: character.picture || user.photoURL,
        stat: {
          isCustom: false,
          label: "magicSpell",
          value: 0
        },
        isHided: false,
        prefixTradStat: null,
      }
      return {
        roll: dataRoll,
        character: character
      }
    } else {
      return null;
    }
  } 

/**
 * @param  {JSON} newCharacterData Character updated with new data
 * @param  {JSON} character default value
 * @param  {JSON} campaign campaign data
 * @param  {JSON} user user currently connected
 */
export const generateUpdateHisto = (newCharacterData, character, campaign, user) => {
  console.log(newCharacterData, character)
  const newUpdateHisto = [];
  const statUpdate = {};
  let skillLoop = {};
  let skillWithCurrentValue = null;
  for (let i = 0; i < newCharacterData.skills.length; i+=1) {
    skillLoop = newCharacterData.skills[i];
    skillWithCurrentValue = character.skills.find(skill => skill.label === skillLoop.label);
    if(skillWithCurrentValue) {
      console.log(skillLoop.value !== skillWithCurrentValue.value);
      if(skillLoop.value !== skillWithCurrentValue.value) {
        statUpdate.label = skillLoop.isCustom ? skillLoop.label : `skills.${skillLoop.label}`
        statUpdate.value = skillWithCurrentValue.value
        newUpdateHisto.push(getUpdateJson(skillLoop.value,campaign.idUserDm, character, user, statUpdate));
      }
    }
  }
  if(newCharacterData.currentHp !== character.currentHp) {
    newUpdateHisto.push(getUpdateJson(newCharacterData.currentHp,campaign.idUserDm, character, user, {label: 'hp', value: character.currentHp}));
  }
  if(newCharacterData.maxHp !== character.maxHp) {
    newUpdateHisto.push(getUpdateJson(newCharacterData.maxHp,campaign.idUserDm, character, user, {label: 'hp max', value: character.maxHp}));
  }
  if(newCharacterData.currency && newCharacterData.currency.bronze !== character.currency.bronze) {
    newUpdateHisto.push(getUpdateJson(newCharacterData.currency.bronze,campaign.idUserDm, character, user, {label: 'currency.bronze', value: character.currency.bronze}));
  }
  if(newCharacterData.currency && newCharacterData.currency.silver !== character.currency.silver) {
    newUpdateHisto.push(getUpdateJson(newCharacterData.currency.silver,campaign.idUserDm, character, user, {label: 'currency.silver', value: character.currency.silver}));
  }
  if(newCharacterData.currency && newCharacterData.currency.gold !== character.currency.gold) {
    newUpdateHisto.push(getUpdateJson(newCharacterData.currency.gold,campaign.idUserDm, character, user, {label: 'currency.gold', value: character.currency.gold}));
  }
  return newUpdateHisto;
}