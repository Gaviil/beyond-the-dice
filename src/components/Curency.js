import React, {useRef} from 'react';
import goldCoin from '../assets/Images/goldCoin.png'
import silverCoin from '../assets/Images/silverCoin.png'
import bronzeCoin from '../assets/Images/bronzeCoin.png'

const getCoinIcon = (type) => {
  if(type === 'gold') {
    return goldCoin;
  }
  if(type === 'silver') {
    return silverCoin;
  }
  if(type === 'bronze') {
    return bronzeCoin;
  }
}

const Currency = (props) => {
  const inputRef = useRef(null);
  return (
    <div className="blockCoin">
      <img onClick={() => {inputRef.current.focus()}} className="coinIcon" src={getCoinIcon(props.type)} alt="coin" />
      <span
        ref={inputRef}
        contentEditable
        onBlur={(e)=>{
          props.updateValue(e.currentTarget.textContent)
        }}
      >
        {props.value}
      </span>
    </div>
  );
  
}

export default Currency