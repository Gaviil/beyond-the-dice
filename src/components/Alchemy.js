import i18next from 'i18next';
import React from 'react';
import '../styles/alchemy.css';

const Alchemy = (props) => {
  const {invAndReceipt} = props;
  const {potion, receipt} = invAndReceipt;
  return (
    <div className='alchemyContainer'>
      <ReceiptView inv={character.inventory} receipt={receipt} create={(val) => {props.create(val)}}/>
      <Potion potion={character.inventory.filter((item) => item.type === 'alchemy')} use={(val) => {props.use(val)}}/>
    </div>
  );
  
}

const ReceiptView = (props) => {
  return (
    <div className='receiptContainer'>
      <h3>{i18next.t('alchemy.receiptTitle')}</h3>
      <div>
        {props.receipt.map((rec, i) => (
          <div
            className={`lineReceiptAlchemy ${i%2 ? 'alt' : ''} click
            `}
            onClick={() => {
              if(props.inv.find((item) => item.name === 'bottle' && item.default).number > 0) {
                props.create(rec);
              }
            }}
          >
            <span>
              {rec.default ? i18next.t(`alchemy.${rec.name}`) : rec.name}
            </span>
            <span>
              {rec.default ? i18next.t(`alchemy.${rec.description}`) : rec.description}
            </span>
            <span>
              {rec.difficulty}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const Potion = (props) => {
  return (
    <div className='potionContainer'>
      <h3>{i18next.t('alchemy.potionTitle')}</h3>
      <div>
        {props.potion.map((pot, i) => (
          <div
            className={`linePotionAlchemy ${i%2 ? 'alt' : ''} ${pot.number > 0 ? 'click': ''}`}
            onClick={() => {
              if(pot.number > 0 && (pot.name !== 'bottle' && pot.default)) {
                pot.number -= 1
                props.use(props.potion);
              }
            }}
          >
            <span>
              {pot.default ? i18next.t(`alchemy.${pot.name}`) : pot.name}
            </span>
            <span>
              {pot.number}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Alchemy