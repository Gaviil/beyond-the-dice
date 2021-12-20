import i18next from 'i18next';
import React from 'react';
import '../styles/card.css'

const Card = (props) => {
  return (
    <div className={`${props.isEditable ? 'click playinCardEditable' : 'defaultCursor playinCard'} ${props.enable ? 'enable' : 'used'}`} onClick={() => {
      if(props.isEditable) {
        props.updateCard(!props.card.enable);
      }
    }}>
      <span className={`${/♥/.test(props.card.value) || /♦/.test(props.card.value) ? 'red' : 'black'} ${props.isEditable ? 'click' : ''}`}>
        {props.card.value}
      </span>
    </div>
  )
}

const MagicCardResume = (props) => {
  return (
    <div>
      {props.cardsList.filter(card => card.enable === true).length > 0 && (
        <div>
          <h2>{i18next.t('mage.cardsAvailable')}</h2>
          <div className='containerCardResume'>
            {props.cardsList.filter(card => card.enable === true).map(card => (
              <Card
                enable
                isEditable={props.isEditable}
                card={card}
                updateCard={(newVal) => {
                  card.enable = newVal;
                  props.updateCards(props.cardsList)
                }}
              />
            ))}
          </div>
        </div>
      )}
      {props.cardsList.filter(card => card.enable === false).length > 0 && (
        <div>
          <h2>{i18next.t('mage.cardsUsed')}</h2>
          <div className='containerCardResume'>
            {props.cardsList.filter(card => card.enable === false).map(card => (
              <Card
                enable={false}
                isEditable={props.isEditable}
                card={card}
                updateCard={(newVal) => {
                  card.enable = newVal;
                  props.updateCards(props.cardsList)
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );  
}

export default MagicCardResume