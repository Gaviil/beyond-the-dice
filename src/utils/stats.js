
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

export const getAverage = (rolls, company) => {
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
  return arrayOfRollByCharacter.filter(rollbyCharacter => rollbyCharacter.average !== 0);
}

export const unluckiest = (rolls, company) => {
  const averageRoll = getAverage(rolls, company);
  return averageRoll.sort(compare)[0];
}

export const luckiestPlayer = (rolls, company) => {
  const averageRoll = getAverage(rolls, company);
  return averageRoll.sort(compare)[averageRoll.length-1];

}

export const mostThrows = (rolls, company) => {
  const rollsByUser = getAverage(rolls, company);
  return rollsByUser.sort(compareLength)[0];
}
const reducer = (previousValue, currentValue) => previousValue + currentValue;

const compare = ( a, b ) => {
  if ( a.average < b.average ){
    return 1;
  }
  if ( a.average > b.average ){
    return -1;
  }
  return 0;
}

const compareLength = ( a, b ) => {
  if ( a.rolls.length < b.rolls.length ){
    return 1;
  }
  if ( a.rolls.length > b.rolls.length ){
    return -1;
  }
  return 0;
}