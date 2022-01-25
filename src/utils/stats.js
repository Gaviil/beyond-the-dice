import i18next from 'i18next';
import characterGenerationData from '../assets/dataCharacter.json';

export const getNumberOfDiceRoll = (rolls) => {
  return rolls.filter(roll => roll.diceType !== 'Magic' && roll.diceType !== 'update').length;
}

export const getPercentOfCriticalSuccess = (rolls) => {
  if(!rolls.length){
    return 0;
  }
  return ((rolls.filter(roll => roll.diceType === 100 && roll.value <= 10).length * 100) / rolls.length).toFixed(2)
}
export const getPercentOfSuccess = (rolls) => {
  if(!rolls.length){
    return 0;
  }
  return ((rolls.filter(roll => roll.diceType === 100 && roll.stat && roll.value <= roll.stat.value).length * 100) / rolls.length).toFixed(2) 
}

export const getPercentOfCriticalFail = (rolls) => {
  if(!rolls.length){
    return 0;
  }
  return ((rolls.filter(roll => roll.diceType === 100 && roll.value >= 90).length * 100) / rolls.length).toFixed(2)
}
export const getPercentOfFail = (rolls) => {
  if(!rolls.length){
    return 0;
  }
  return ((rolls.filter(roll => roll.diceType === 100 && roll.stat && roll.value > roll.stat.value).length * 100) / rolls.length).toFixed(2)
}

export const getNumberOfCriticalSuccess = (rolls) => {
  if(!rolls.length){
    return 0;
  }
  return rolls.filter(roll => roll.diceType === 100 && roll.value <= 10).length
}
export const getNumberOfSuccess = (rolls) => {
  if(!rolls.length){
    return 0;
  }
  return rolls.filter(roll => roll.diceType === 100 && roll.stat && roll.value <= roll.stat.value).length
}

export const getNumberOfCriticalFail = (rolls) => {
  if(!rolls.length){
    return 0;
  }
  return rolls.filter(roll => roll.diceType === 100 && roll.value >= 90).length
}
export const getNumberOfFail = (rolls) => {
  if(!rolls.length){
    return 0;
  }
  return rolls.filter(roll => roll.diceType === 100 && roll.stat && roll.value > roll.stat.value).length
}


export const getMostUsedSkills = (rolls, company) => {

  const skillsByCharacter = [];
  for(let j=0; j < company.length; j += 1) {
    skillsByCharacter.push({
      name: company[j].name,
      nameOfSkills: [],
      numberOfRoll: [],
    });
    for(let i=0; i < characterGenerationData.skills.length; i+=1) {
        skillsByCharacter[j].nameOfSkills.push(i18next.t(`skills.${characterGenerationData.skills[i].label}`));
        skillsByCharacter[j].numberOfRoll.push(rolls.filter(roll => roll.stat && roll.characterId === company[j].uid && roll.stat.label === characterGenerationData.skills[i].label).length)
      }
  }
  return skillsByCharacter;
}

/**
 * @param  {[]} rolls list of dice roll
 * @param  {[]} company list of character played
 * @returns {{[],[],[]}} characters / averageRoll / numberOfRoll => the character name, average of role on d100, number of dice roll
*/
export const getStats = (rolls, company) => {
  const arrayOfRollByCharacter = [];
  for (let i = 0; i < company.length; i += 1) {
    arrayOfRollByCharacter.push({
      character: company[i].name,
      uidCharacter: company[i].uid,
      rolls: rolls.filter(roll => roll.diceType === 100 && roll.characterId === company[i].uid),
      average: 0,
    });
    if(rolls.filter(roll => roll.diceType === 100 && roll.characterId === company[i].uid).length) {
      arrayOfRollByCharacter[i].average = (arrayOfRollByCharacter[i].rolls.map(roll => arrayOfRollByCharacter[i].average + parseInt(roll.value, 10)).reduce(reducer) / arrayOfRollByCharacter[i].rolls.length).toFixed(2)
    }
  }
  
  return buildDataForChart(arrayOfRollByCharacter.filter(rollbyCharacter => rollbyCharacter.average !== 0));
}

const buildDataForChart = (listOfData) => {
  const finalResult = {
    characters: [],
    averageRoll: [],
    numberOfRoll: [],
    criticalSuccess: [],
    criticalFail: []
  }
  for(let i=0; i<listOfData.length; i+=1){
    finalResult.characters.push(listOfData[i].character);
    finalResult.averageRoll.push(listOfData[i].average);
    finalResult.numberOfRoll.push(listOfData[i].rolls.length);
    finalResult.criticalSuccess.push(listOfData[i].rolls.filter(roll => listOfData[i].uidCharacter === roll.characterId && roll.diceType === 100 && roll.value <= 10).length);
    finalResult.criticalFail.push(listOfData[i].rolls.filter(roll => listOfData[i].uidCharacter === roll.characterId && roll.diceType === 100 && roll.value >= 90).length);
  }
  return finalResult;
}
const reducer = (previousValue, currentValue) => previousValue + currentValue;

/**
 * @param  {[]} rolls list of dice roll
 * @returns {[]} Array of rolls for a date with param for date
*/
export const getSessionPlayed = (rolls) => {
  let dateSaved = null;
  let rollThisSession = 0;
  let sessions = [];
  for (let i = 0; i < rolls.length; i += 1) {
    if(dateSaved !== rolls[i].createdAt){
      dateSaved = rolls[i].createdAt;
      rollThisSession = rolls.filter(roll => roll.createdAt === rolls[i].createdAt && rolls[i].diceType !== 'update');
      if(rollThisSession.length > 3) {
        sessions.push({
          date: dateSaved,
          rolls: rollThisSession
        })
      }
    }
  }
  return sessions;
}

export const getRollByDiceType = (rollList) => {
  const diceType = [4,6,8,10,12,20,100];
  const rollByType = [];
  
  for(let i = 0; i< diceType.length; i+=1) {
    rollByType[i] = rollList.filter(roll => roll.diceType === diceType[i]).length;
  }

  return {
    type : diceType,
    roll: rollByType
  }
}

export const sortRoll = (rollList) => {
  return rollList.map(function(v) {
    return v.value;
  }).sort(function(a, b) {
    return a - b;
  });
}

export const getMedium = (rollList) => {
  const rollListClean = rollList.filter(roll => roll.diceType !== 'Magic' && roll.diceType !== 'update')
  if(!rollListClean.length) {
    return 0;
  }
  let valueMedium = 0;
  for (let i = 0; i < rollListClean.length; i+= 1) {
    valueMedium += rollListClean[i].value;
  }
  return (valueMedium / rollListClean.length).toFixed(2) 
}

export const getMedian = (rollList) => {
  const rollListClean = rollList.filter(roll => roll.diceType !== 'Magic' && roll.diceType !== 'update')

  if(!rollListClean.length) {
    return 0;
  }
  var m = sortRoll(rollListClean);

  var middle = Math.floor((m.length - 1) / 2);
  if (m.length % 2) {
    return m[middle];
  } else {
    return (m[middle] + m[middle + 1]) / 2.0;
  }
}