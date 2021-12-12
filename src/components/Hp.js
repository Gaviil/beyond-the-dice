import React, {useRef, useState} from 'react';

const Hp = (props) => {
  const inputRef = useRef(null);
  const [hp, setHp] = useState(props.character.currentHp)

  return (
    <div className='hpCharacter' onClick={() => inputRef.current.focus()}>
      <input
        ref={inputRef}
        value={hp}
        type="number"
        min={0}
        max={999}
        onChange={(e) => {
          setHp(e.target.value)
        }}
        onBlur={(e)=>{
          const cleanValue = e.currentTarget.value.replace(/(\D)/gm, "");
          e.currentTarget.value = cleanValue
          if(cleanValue === '') {
            e.currentTarget.value = hp;
          }
          props.updateValue(cleanValue)
        }}
      />
      <span>{` / `}</span>
      <span>{props.character.maxHp}</span>
      <div className='hpBar' style={{width: `${(props.character.currentHp * 100) / props.character.maxHp}%`}}/>
      <div className='hpBarEmpty'/>
    </div>
  );
  
}

export default Hp