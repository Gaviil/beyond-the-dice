import React, {useState, useContext} from 'react';
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import CharacterContext from '../context/CharacterContext';
import '../styles/inventory.css'
import { PencilIcon, TrashIcon, CheckIcon } from '@heroicons/react/solid'
import i18next from 'i18next';
import {dynamicSort} from '../utils/sort';

const Inventory = (props) => {
  const {character} = useContext(CharacterContext);
  const [itemName, setItemName] = useState("")
  const [numberOfnewItem, setNumberOfnewItem] = useState()
  const [lineToUpdateInv, setLineToUpdateInv] = useState(null)
  const [updateItem, setUpdateItem] = useState(null)


  const createItem = () => {
    const newItem = {
      name: itemName,
      number: numberOfnewItem || 1,
    };
    character.inventory.push(newItem);
    props.updateInventory(character);
  }
  
  const updateItemNumber = async (item, index) => {
    const updatedItem = {
      ...item,
      number: updateItem !== null || updateItem !== undefined ? updateItem : item.number
    }
    setLineToUpdateInv(null)
    character.inventory[index] = updatedItem;
    props.updateInventory(character);
  } 

  const removeItem = (itemIndex) => {
    character.inventory.splice(itemIndex, 1);
    props.updateInventory(character);
  }

  if(character.uid) {
    return (
      <div className='containerInv'>
        <p className='titleSection'><b>{i18next.t('inventory')}</b></p>
          <div>
            <div className={'tableInvHeader tableInvRow'}>
              <div>
                <span>{i18next.t('item')}</span>
              </div>
              <div>
                <span>{i18next.t('number')}</span>
              </div>
              <div>
                <span>{i18next.t('option')}</span>
              </div>
            </div>
          {
            character.inventory.sort(dynamicSort('name')).map((item, i) => (
              <div key={i} className='tableInvRow'>
                <div>
                  <span>{`${item.type === 'alchemy' && item.default ? i18next.t(`alchemy.${item.name}`) : item.name}`}</span>
                </div>
                <div>
                  {lineToUpdateInv === i && (
                    <input
                      className='updateItemNumber'
                      name="update number item"
                      type="number"
                      // placeholder={item.number}
                      defaultValue={item.number}
                      value={updateItem}
                      onChange={(e) => {
                        setUpdateItem(e.target.value ? JSON.parse(e.target.value) : '');
                      }}
                    />
                  )}
                  {lineToUpdateInv !== i && (
                    <span>{`x ${item.number}`}</span>
                  )}
                </div>
                <div>
                  {lineToUpdateInv === i && (
                    <button
                      className='optionBtnInv'
                      onClick={() => {
                        updateItemNumber(item, i)
                      }}
                    >
                      <CheckIcon className="iconInv"/>
                    </button>
                  )}
                  {lineToUpdateInv !== i && (
                    <button
                      className='optionBtnInv'
                      onClick={() => {
                        setLineToUpdateInv(i);
                      }}
                    >
                      <PencilIcon className="iconInv"/> 
                    </button>
                  )}
                  <button
                    className='optionBtnInv'
                    onClick={() => {
                      removeItem(i);
                    }}
                  >
                    <TrashIcon className="iconInv" />
                  </button>
                </div>
              </div>
            ))
          }
          </div>
          <form className='formNewInv' onSubmit={(e) => {
            if(itemName) {
              createItem();
            }
            setItemName('');
            setNumberOfnewItem('');
            e.preventDefault();
          }}>
            <input
              name="newItemInventory"
              type="text"
              placeholder={i18next.t('item name')}
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <input
              name="numberOfNewItem"
              type="number"
              placeholder={i18next.t('number of item')}
              value={numberOfnewItem}
              onChange={(e) => {
                setNumberOfnewItem(e.target.value ? JSON.parse(e.target.value) : '');
              }}
            />
            <input className={itemName === "" ? 'disabled' : 'outline'} type="submit" value={i18next.t('create')} />
          </form>
      </div>
    )
  }
  return null;
}

export default Inventory