import React from 'react';
import goldCoin from '../assets/Images/goldCoin.png'
import silverCoin from '../assets/Images/silverCoin.png'
import bronzeCoin from '../assets/Images/bronzeCoin.png'

const getCoinIcon = (type) => {
  if(type === 'gold') {
    return <img className="coinIcon" src={goldCoin} alt="coin" />
  }
  if(type === 'silver') {
    return <img className="coinIcon" src={silverCoin} alt="coin" />
  }
  return <img className="coinIcon" src={bronzeCoin} alt="coin" />
}

const Coin = (props) => {
  return (
    <div className="blockCoin">
      {getCoinIcon(props.type)}
      <span
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

export default Coin