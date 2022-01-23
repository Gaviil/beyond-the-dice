import i18next from 'i18next';
import React, { useState, useRef, useEffect } from 'react';
import '../styles/deathMagic.css';

const DeachMagic = (props) => {
  const {skill} = props;
  const inputRef = useRef(null);
  const [newValueSkill, setNewValueSkill] = useState(skill.value);
  const [spells] = useState([
    {
      name: i18next.t('deathMagic.spellName1'),
      desc: i18next.t('deathMagic.spellDesc1'),
    },
    {
      name: i18next.t('deathMagic.spellName2'),
      desc: i18next.t('deathMagic.spellDesc2'),
    },
    {
      name: i18next.t('deathMagic.spellName3'),
      desc: i18next.t('deathMagic.spellDesc3'),
    },
    {
      name: i18next.t('deathMagic.spellName4'),
      desc: i18next.t('deathMagic.spellDesc4'),
    },
    {
      name: i18next.t('deathMagic.spellName5'),
      desc: i18next.t('deathMagic.spellDesc5'),
    },
    {
      name: i18next.t('deathMagic.spellName6'),
      desc: i18next.t('deathMagic.spellDesc6'),
    },
    {
      name: i18next.t('deathMagic.spellName7'),
      desc: i18next.t('deathMagic.spellDesc7'),
    },
  ]);

  useEffect(() => {
    setNewValueSkill(props.skill.value)
  }, [props]);

  return (
    <div className='deathMagicContainer'>
      <div className='blockSkill'>
        <h2 onClick={() => {
          inputRef.current.focus();
        }}>
        {i18next.t('skills.deathMagic')} :
      </h2>
      <input
        ref={inputRef}
        value={newValueSkill}
        type="number"
        min={0}
        max={90}
        onChange={(e) => {
          setNewValueSkill(e.target.value);
        }}
        onBlur={(e)=>{
          const cleanValue = e.currentTarget.value.replace(/(\D)/gm, "");
          e.currentTarget.value = cleanValue
          if(cleanValue === '') {
            e.currentTarget.value = 0;
          }
          if(cleanValue > 90) {
            e.currentTarget.value = 90;
          }
          if(cleanValue < 0) {
            e.currentTarget.value = 0;
          }
          props.updateValue(JSON.parse(cleanValue));
        }}
      />
      </div>
      
      {spells.map((spell, i) => (
        <div
          style={{cursor: newValueSkill > 0 ? 'pointer' : 'default'}}
          onClick={() => {
            if(newValueSkill > 0) {
              props.rollDice(skill)
            }
          }}
          key={i}
        >
          <h4>{spell.name}</h4>
          <p>{spell.desc}</p>
        </div>
      ))}
    </div>
  );
  
}

export default DeachMagic