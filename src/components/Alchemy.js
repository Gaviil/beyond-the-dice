import i18next from 'i18next';
import React, {useState} from 'react';
import '../styles/alchemy.css';
import { toast } from 'react-toastify';
import {
  PlusIcon,
  TrashIcon
} from '@heroicons/react/outline'

const Alchemy = (props) => {
  const {invAndReceipt, character} = props;
  const {receipt} = invAndReceipt;
  return (
    <div className='alchemyContainer'>
      <ReceiptView
        inv={character.inventory}
        receipt={receipt}
        create={(val) => {props.create(val)}}
        updateReceipt={(newList) => {
          props.updateReceipt(newList);
        }}
      />
      <Potion potion={character.inventory.filter((item) => item.type === 'alchemy')} use={(val) => {props.use(val)}}/>
    </div>
  );
  
}

const ReceiptView = (props) => {
  const [nameReceipt, setNameReceipt] = useState(null);
  const [descReceipt, setDescReceipt] = useState(null);
  const [difReceipt, setDifReceipt] = useState(null);
  return (
    <div className='receiptContainer'>
      <h3>{i18next.t('alchemy.receiptTitle')}</h3>
      <div>
        {props.receipt.map((rec, i) => (
          <div className='containerReceipt'>
            <div
              className={`lineReceiptAlchemy ${i%2 ? 'alt' : ''} click
              `}
              onClick={() => {
                if(props.inv.find((item) => item.name === 'bottle' && item.default).number > 0) {
                  props.create(rec);
                } else {
                  toast.warning(i18next.t('alchemy.needBottle'));
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
            <div className='blockDelete'>
              {!rec.default && (
                <button className='optionBtnInv' onClick={() => {
                  if(window.confirm(i18next.t('alchemy.removeReceipt'))) {
                    const newList = [...props.receipt];
                    newList.splice(i,1);
                    props.updateReceipt(newList)
                  }
                }}
                >
                  <TrashIcon className="iconDelete" />
                </button>   
              )}
            </div>
          </div>
        ))}
      </div>
      <form
          className={'lineReceiptAlchemy receiptEdition'}
          onSubmit={ async (e) => {
            const newListReceipt = [...props.receipt];
            if(nameReceipt && nameReceipt !== '' && difReceipt && difReceipt !== '') {
              newListReceipt.push({
                "name": nameReceipt,
                "description": descReceipt,
                "difficulty": difReceipt,
                "default": false
              })
              props.updateReceipt(newListReceipt)
              setNameReceipt('');
              setDescReceipt('');
              setDifReceipt('');
            }
            
            e.preventDefault();
          }}
        >
        <input
          name="name new receipt"
          type="text"
          placeholder={i18next.t('alchemy.newNameReceipt')}
          value={nameReceipt}
          onChange={(e) => {
            setNameReceipt(e.target.value);
          }}
        />                    
        <input
          name="description new receipt"
          type="text"
          placeholder={i18next.t('alchemy.newDescReceipt')}
          value={descReceipt}
          onChange={(e) => {
            setDescReceipt(e.target.value);
          }}
        />                    
        <input
          name="description new receipt"
          type="number"
          min={0}
          max={100}
          placeholder="60"
          value={difReceipt}
          onChange={(e) => {
            setDifReceipt(e.target.value);
          }}
        />
        <button>
          <PlusIcon style={{height: 12, width: 12}}/>
        </button>                  
      </form>
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
              if(pot.number > 0 && (pot.name !== 'bottle')) {
                pot.number -= 1
                props.use(props.potion);
              }
            }}
          >
            <span>
              {pot.default ? i18next.t(`inventoryItem.${pot.name}`) : pot.name}
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