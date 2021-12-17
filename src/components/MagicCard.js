import React from 'react';
import cards from '../assets/Images/cards4.png';
import '../styles/card.css'
import i18next from 'i18next';

const MagicCard = (props) => {
  return (
    <div className={'containerCardIcon tooltip'}>
      <img src={cards} alt="" onClick={() => {
        props.drawCard();
      }}/>
      <span className="tooltiptext">{`${props.magicCards.filter(card => card.enable).length} ${i18next.t('remaining cards')}`}</span>
    </div>
  );  
}

export default MagicCard