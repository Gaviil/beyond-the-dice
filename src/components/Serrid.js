import React from 'react';
import serridStone from '../assets/Images/serridStone.png';
import '../styles/card.css'
import i18next from 'i18next';

export const SerridStone = (props) => {
  return (
    <div className={'containerCardIcon tooltip'}>
      <img src={serridStone} alt="" style={{width: 48, height: 48}} onClick={() => {
        console.log('use stone');
      }}/>
      <span className="tooltiptext">{`INFO STONE`}</span>
    </div>
  );  
}

export const SerridDetail = () => {
  return (
    <div>

    </div>
  );
}