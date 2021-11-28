
export const getNumberOfCriticalFail = (rolls) => {
  const ArrayFilter = rolls.filter(roll => roll.diceType === 100 && roll.value >= 90);
  return ArrayFilter.length;
}
export const getNumberOfCriticalSuccess = (rolls) => {
  const ArrayFilter = rolls.filter(roll => roll.diceType === 100 && roll.value <= 10);
  return ArrayFilter.length;
}

export const getAverage = (rolls, company) => {
  const arrayOfRollBuyCharacter = [];
  for (let i = 0; i < company.length; i += 1) {
    arrayOfRollBuyCharacter.push({
      character: company[i].name,
      uidCharacter: company[i].uid,
      rolls: rolls.filter(roll => roll.diceType === 100 && roll.characterId === company[i].uid),
      average: 0,
    });
    arrayOfRollBuyCharacter[i].average = (arrayOfRollBuyCharacter[i].rolls.map(roll => arrayOfRollBuyCharacter[i].average + parseInt(roll.value, 10)).reduce(reducer) / arrayOfRollBuyCharacter[i].rolls.length).toFixed(4)
  }
  // arrayOfFailForCharacter.sort(compare);
  // if(arrayOfFailForCharacter.length > 0) {
  //   return {
  //     character: arrayOfFailForCharacter[0].character,
  //     numberOfCriticalFail: arrayOfFailForCharacter[0].fails,
  //   }
  // }
}

export const playerMostLucky = (rolls, company) => {
  const averageRoll = getAverage(rolls, company);
  return averageRoll.sort(compare);
}

export const playerMostUnlucky = (rolls, company) => {
  const averageRoll = getAverage(rolls, company);
  return 
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