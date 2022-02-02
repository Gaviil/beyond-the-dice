import React, { useRef, useEffect, useState } from 'react';
import i18next from 'i18next';
import '../styles/contextMenuSkill.css';

const ContextMenu = ({x,y,showMenu, skill, rollDice}) => {
  const [modifier, setModifier] = useState(0);
  const inputRef = useRef(null);

  const style = () => {
    return {
      top: y,
      left: x,
      display: showMenu ? 'flex': 'none'
    }
  }
  const styleMain = () => {
    return {
      display: showMenu ? 'flex': 'none',
    }
  }

  useEffect(() => {
    setModifier(0)
  }, [skill]);

  return (
    <div id='blockMenu' style={styleMain()}>
      <div className='contextMenuWindow' style={style()}>
        <div className='headerContext'>
          <span>{skill.isCustom ? skill.label : i18next.t(`skills.${skill.label}`)}</span>
          {skill.value && (
            <span>{parseInt(skill.value, 10) + parseInt(modifier || 0, 10)}</span>
          )}
        </div>
        <div className='divider'></div>
        <div className='modifier' onClick={() => {inputRef.current.focus();}}>
          <span>{i18next.t('modifierDiceTitle')}</span>
          <input
            className={parseInt(skill.value, 10) + parseInt(modifier || 0, 10) > 99 || parseInt(skill.value, 10) + parseInt(modifier || 0, 10) < 1 ? 'error' : ''}
            ref={inputRef}
            type="number"
            min={parseInt(`-${skill.value}`,10) + 1}
            max={99 - parseInt(skill.value, 10)}
            value={modifier}
            onChange={(e) => {
              const cleanValue = e.target.value.replaceAll("e", "");
              setModifier(cleanValue)                
            }}
            />
        </div>
        <div className='divider'></div>
        <div className='footer'>
          <button
            className={'empty click'}
            onClick={(e) => {
              if(parseInt(skill.value, 10) + parseInt(modifier || 0, 10) <= 99 && parseInt(skill.value, 10) + parseInt(modifier || 0, 10) >= 1) {
                const skillWithModifier = {
                  ...skill,
                  value: parseInt(skill.value, 10) + parseInt(modifier || 0, 10)
                }
                rollDice(skillWithModifier)
                setModifier(0)
              }
            }}
          >
            {i18next.t('rollDice')}
          </button>
        </div>
      </div>
    </div>
  );
}

// const styles = {
//   div: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#FE8F8F',
//     color: '#FFEDD3',
//     fontWeight: 'bold',
//     cursor: 'pointer'
//   },
//   margin: {
//     margin: 10,
//   }
// }

export default ContextMenu