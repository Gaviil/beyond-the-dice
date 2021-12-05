import i18next from 'i18next';

export const dynamicSortWithTraduction = (property, prefixTrad) => {
    var sortOrder = 1;
    let tradA = '';
    let tradB = '';
    return function (a,b) {
      if(!a.isCustom && prefixTrad) {
        tradA = i18next.t(`${prefixTrad}.${a[property]}`)
      } else {
        tradA = a[property];
      }
      if(!b.isCustom && prefixTrad) {
        tradB = i18next.t(`${prefixTrad}.${b[property]}`)
      } else {
        tradB = b[property];
      }
      if(sortOrder === -1){
        return tradB.localeCompare(tradA);
      }else{
        return tradA.localeCompare(tradB);
      }        
    }
}

export const dynamicSort = (property) => {
    var sortOrder = 1;
    return function (a,b) {
      if(sortOrder === 1){
        return a[property].localeCompare(b[property]);
      }else{
        return b[property].localeCompare(a[property]);
      }        
    }
}