import React, {useRef, useState} from 'react';
import goldCoin from '../assets/Images/currency/gold40.png'
import silverCoin from '../assets/Images/currency/silver40.png'
import bronzeCoin from '../assets/Images/currency/bronze40.png'

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
  const [coinNumber, setCoinNumber] = useState(props.value)

  return (
    <div className="blockCoin">
      <img
        onClick={() => {
          inputRef.current.focus();
        }}
        className="coinIcon"
        src={getCoinIcon(props.type)}
        alt="coin"
      />
        <input
          ref={inputRef}
          value={coinNumber}
          type="number"
          min={0}
          max={999}
          onChange={(e) => {
            setCoinNumber(e.target.value)
          }}
          onBlur={(e)=>{
            const cleanValue = e.currentTarget.value.replace(/(\D)/gm, "");
            e.currentTarget.value = cleanValue
            if(cleanValue === '') {
              e.currentTarget.value = props.min;
            }
            if(cleanValue > props.max) {
              e.currentTarget.value = props.max;
            }
            if(cleanValue < props.min) {
              e.currentTarget.value = props.min;
            }
            props.updateValue(coinNumber)
          }}
        />
    </div>
  );
  
}

export default Currency