import React, {useRef, useState} from 'react';
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
 

// import React, {useRef, useState} from 'react';
// import goldCoin from '../assets/Images/goldCoin.png'
// import silverCoin from '../assets/Images/silverCoin.png'
// import bronzeCoin from '../assets/Images/bronzeCoin.png'

// const getCoinIcon = (type) => {
//   if(type === 'gold') {
//     return goldCoin;
//   }
//   if(type === 'silver') {
//     return silverCoin;
//   }
//   if(type === 'bronze') {
//     return bronzeCoin;
//   }
// }

// const Currency = (props) => {
//   const inputRef = useRef(null);
//   const [coinNumber, setCoinNumber] = useState(props.value)

//   return (
//     <div className="blockCoin">
//       <img
//         onClick={() => {
//           inputRef.current.focus()
//         }}
//         className="coinIcon"
//         src={getCoinIcon(props.type)}
//         alt="coin"
//       />
//       <span
//         ref={inputRef}
//         contentEditable
//         onClick={(e) => {
//           console.log('plop')
//         }}
//         onInput={(e) => {
//           const cleanValue = e.currentTarget.textContent.replace(/(\D)/gm, "");
//           e.currentTarget.textContent = cleanValue
//           if(cleanValue > props.max) {
//             e.currentTarget.textContent = props.max;
//           }
//           if(cleanValue < props.min) {
//             e.currentTarget.textContent = props.min;
//           }
//         }}
//         onBlur={(e)=>{
//           console.log(parseInt(e.currentTarget.textContent, 10))
//           setCoinNumber(parseInt(e.currentTarget.textContent, 10) || 0)
//           props.updateValue(parseInt(e.currentTarget.textContent, 10) || 0)
//         }}
//       >
//         {coinNumber}
//       </span>
//     </div>
//   );
  
// }
 
// export default Currency
export default Currency