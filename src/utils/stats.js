import i18next from 'i18next';
import characterGenerationData from '../assets/dataCharacter.json';

export const getNumberOfDiceRoll = (rolls) => {
  return rolls.filter(roll => roll.diceType !== 'Magic').length;
}

export const getNumberOfCriticalFail = (rolls) => {
  const ArrayFilter = rolls.filter(roll => roll.diceType === 100 && roll.value >= 90);
  return ArrayFilter.length;
}
export const getNumberOfCriticalSuccess = (rolls) => {
  const ArrayFilter = rolls.filter(roll => roll.diceType === 100 && roll.value <= 10);
  return ArrayFilter.length;
}

export const getMostUsedSkills = (rolls) => {

  const nameOfSkills = [];
  const numberOfRoll = [];
  for(let i=0; i < characterGenerationData.skills.length; i+=1) {
    nameOfSkills.push(i18next.t(`skills.${characterGenerationData.skills[i].label}`));
    numberOfRoll.push(rolls.filter(roll => roll.stat && roll.stat.label === characterGenerationData.skills[i].label).length)
  }
  return {
    name: nameOfSkills,
    value: numberOfRoll
  }
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