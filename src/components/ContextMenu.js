import React, { useRef, useEffect, useState } from 'react';
import i18next from 'i18next';
import '../styles/contextMenuSkill.css';

const ContextMenu = ({x,y,showMenu, stat, prefix, rollDice}) => {
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
      height: window.innerHeight + window.scrollY,
      display: showMenu ? 'flex': 'none',
    }
  }

  useEffect(() => {
    setModifier(0)
  }, [stat]);

  return (
    <div id='blockMenu' style={styleMain()}>
      <div className='contextMenuWindow' style={style()}>
        <div className='headerContext'>
          <span>{stat.isCustom ? stat.label : i18next.t(`${prefix}.${stat.label}`)}</span>
          {stat.value && (
            <span>{parseInt(prefix === 'characteristics' ? stat.value * 5 : stat.value, 10) + parseInt(modifier || 0, 10)}</span>
          )}
        </div>
        <div className='divider'></div>
        <div className='modifier' onClick={() => {inputRef.current.focus();}}>
          <span>{i18next.t('modifierDiceTitle')}</span>
          <input
            className={parseInt(stat.value, 10) + parseInt(modifier || 0, 10) > 99 || parseInt(stat.value, 10) + parseInt(modifier || 0, 10) < 1 ? 'error' : ''}
            ref={inputRef}
            type="number"
            min={parseInt(`-${prefix === 'characteristics' ? stat.value * 5 : stat.value || 99}`,10) + 1}
            max={99 - parseInt(prefix === 'characteristics' ? stat.value * 5 : stat.value || 100, 10)}
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
              if(parseInt(stat.value, 10) + parseInt(modifier || 0, 10) <= 99 && parseInt(stat.value, 10) + parseInt(modifier || 0, 10) >= 1) {
                const skillWithModifier = {
                  ...stat,
                  value: parseInt(prefix === 'characteristics' ? stat.value * 5 : stat.value, 10) + parseInt(modifier || 0, 10)
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


export default ContextMenu