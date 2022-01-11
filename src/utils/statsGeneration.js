export const sortRoll = (rollList) => {
  return rollList.map(function(v) {
    return v.value;
  }).sort(function(a, b) {
    return a - b;
  });
}

export const getMedium = (rollList) => {
  if(!rollList.length) {
    return 0;
  }
  let valueMedium = 0;
  for (let i = 0; i < rollList.length; i+= 1) {
    valueMedium += rollList[i].value;
  }
  return (valueMedium / rollList.length).toFixed(2) 
}

export const getMedian = (rollList) => {
  if(!rollList.length) {
    return 0;
  }
  var m = sortRoll(rollList);

  var middle = Math.floor((m.length - 1) / 2);
  if (m.length % 2) {
    return m[middle];
  } else {
    return (m[middle] + m[middle + 1]) / 2.0;
  }
}

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
      rollThisSession = rolls.filter(roll => roll.createdAt === rolls[i].createdAt);
      if(rollThisSession.length > 3) {
        sessions.push({
          date: dateSaved,
          rolls: rollThisSession,
          numberOfRolls: rollThisSession.length
        })
      }
    }
  }
  return sessions;
}

export const getRollByCharacterForGraph = (rollList, company) => {
  const data = [];
  for(let i=0; i<company.length; i+=1) {
    data.push({
      name: company[i].name,
      value: rollList.filter(roll => roll.characterId === company[i].uid).length
    })
  }
  return data
}

export const getPercentOfSucAndFailByCharacters = (rollList, company) => {
  const data = [];
  let rollByThisCharacter = 0;
  for (let i = 0; i < company.length; i+=1) {
    rollByThisCharacter = rollList.filter(roll => roll.characterId === company[i].uid && roll.stat).length || 1;
    data.push({
      name: company[i].name.substring(0, 12),
      success: ((rollList.filter(roll => roll.characterId === company[i].uid && roll.diceType === 100 && roll.stat && roll.value <= roll.stat.value).length * 100) / rollByThisCharacter).toFixed(2) || 0,
      fail: ((rollList.filter(roll => roll.characterId === company[i].uid && roll.diceType === 100 && roll.stat && roll.value > roll.stat.value).length * 100) / rollByThisCharacter).toFixed(2) || 0,
      successCrit: ((rollList.filter(roll => roll.characterId === company[i].uid && roll.diceType === 100 && roll.stat && roll.value <= 10).length * 100) / rollByThisCharacter).toFixed(2) || 0,
      failCrit: ((rollList.filter(roll => roll.characterId === company[i].uid && roll.diceType === 100 && roll.stat && roll.value >= 90).length * 100) / rollByThisCharacter).toFixed(2) || 0,
    })
  }
  return data
}