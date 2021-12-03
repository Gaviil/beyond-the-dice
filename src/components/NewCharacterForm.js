import React, {useEffect, useState, useRef, useContext} from 'react';
import i18next from 'i18next';
import dataCharacter from '../assets/dataCharacter.json';
import CampaignContext from '../context/CampaignContext';
import '../styles/characters.css';
import {getAllStats} from '../utils/characterGeneration';
import { toast } from 'react-toastify';
import CheckboxSwitch from '../components/CheckboxSwitch';
import 'react-toastify/dist/ReactToastify.css';

const NewCharacterForm = (props) => {
  const {campaign} = useContext(CampaignContext)
  const [name, setName] = useState('');
  const [listCharac, setListCharac] = useState(dataCharacter.characteristics);
  const [characComplete, setCharacComplete] = useState(false);
  const [listSkills, setListSkills] = useState([...dataCharacter.skills]);
  const [additionalSkillPoint, setAdditionalSkillPoint] = useState(50);
  const [listBonusSkills, setListBonusSkills] = useState([...dataCharacter.skillsBonus]);
  const [description, setDescription] = useState('');
  const [isAlchemist, setIsAlchemist] = useState(false);
  const {createCharacter} = props;
  const skillsRef = useRef(null);
  const [generationCharacterClassic, setGenerationCharacterClassic] = useState(true)


  useEffect( () => {
    const dexterity = listCharac.find((chara) => ( chara.label === 'dexterity')).value
    const intelligence = listCharac.find((chara) => ( chara.label === 'intelligence')).value
    const strength = listCharac.find((chara) => ( chara.label === 'strength')).value
    const charisma = listCharac.find((chara) => ( chara.label === 'charisma')).value
    const endurance = listCharac.find((chara) => ( chara.label === 'endurance')).value
    if(dexterity && intelligence && strength && charisma && endurance) {
      setCharacComplete(true);
      setListSkills(getAllStats(listCharac, generationCharacterClassic));
    }

  }, [listCharac, campaign, generationCharacterClassic]);

  useEffect(() => {
    let bonusUsed = 0;
    for(let i=0; i < listBonusSkills.length; i+=1) {
      bonusUsed += listBonusSkills[i].value;
    };
    setAdditionalSkillPoint(50 - bonusUsed);
  }, [listBonusSkills]);

  const diceRollForNewStat = () => {
    let result = 0;
    for(let i = 0; i < 3; i+=1) {
      result += JSON.parse(Math.floor(Math.random() * 6) + 1);
    }
    return result;
  }

  const creationCharacterIsEnable = (additionalSkillPoint === 0 || generationCharacterClassic) && name.length > 0 && characComplete;
  return (
    <div>
      <h3>{i18next.t('new character')}</h3>
      <form
        className='formNewCharacter'
        onSubmit={(e) => {
          let valid = true;
          if(creationCharacterIsEnable) {
            let skillsCalculated = [...listSkills];
            for(let i=0; i < skillsCalculated.length; i+=1) {
                if(listBonusSkills[i].value) {
                  skillsCalculated[i].value += listBonusSkills[i].value;
                }
              if(skillsCalculated[i].value > 90) {
                valid = false;
              }
            }
            if(valid) {
              createCharacter({
                name,
                hp: dataCharacter.characteristics.find((chara) => ( chara.label === 'endurance')).value <= 14 ? dataCharacter.characteristics.find((chara) => ( chara.label === 'endurance')).value : 14,
                description,
                alive: true,
                characteristics: listCharac,
                skills: skillsCalculated,
                inventory: [],
                isAlchemist: isAlchemist
              });
              setName('');
              setDescription('');
              setListCharac([...dataCharacter.characteristics]);
              setCharacComplete(false);
              setListSkills([...dataCharacter.skills]);
              setAdditionalSkillPoint(50);
              setListBonusSkills([...dataCharacter.skillsBonus]);
            } else {
              toast.error(`${i18next.t('error.chara90')}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }
          }
          e.preventDefault();
        }}
      >
        <div className='defaultInformation'>
          <p>
            <label className='column'>
              <input
                placeholder={i18next.t('character name')}
                name="character name"
                type="text"
                className='nameNewCharacter'
                value={name}
                onChange={(e) => {setName(e.target.value)}}
              />
            </label>
          </p>
          <p>
            <label className='column'>
              <textarea
                placeholder={i18next.t('description')}
                className='textAreaDescription'
                name="description"
                value={description}
                onChange={(e) => {setDescription(e.target.value)}}
              />
            </label>
          </p>
          <CheckboxSwitch
            isChecked={isAlchemist}
            label={i18next.t('alchemy.isAlchemiste')}
            update={(val) => {
              setIsAlchemist(val);
            }}
          />
        </div>
          <div className='characteristics'>
            <p>
              <b>{i18next.t('characteristic')}</b>
            </p>
            <div className="tutoCreation">
              <span>{i18next.t('creationHelp.characteristicsHead')}</span>
              <ul>
                <li>{i18next.t('creationHelp.chara1')}</li>
                <li>{i18next.t('creationHelp.chara2')}</li>
              </ul>
              <span>{i18next.t('creationHelp.charaFoot')}</span>
            </div>
            {listCharac.map((chara, i) => (
              <div key={i}>
                <label>
                  <span>
                    {i18next.t(`characteristics.${chara.label}`)}
                  </span>
                  <input
                    name={chara.label}
                    type="number"
                    className='inputCharacteristics'
                    max={18}
                    min={3}
                    value={chara.value}
                    onChange={(e) => {
                      const newValue = e.target.value !== '' ? JSON.parse(e.target.value) : null;
                      const newList = [...listCharac]
                      newList[newList.findIndex((charac) => charac.label === chara.label)].value = newValue
                      setListCharac(newList);
                    }}
                  />
                </label>
              </div>
            ))}
            <button
              className='autoGeneration'
              onClick={(e) => {
                setListCharac(listCharac.map(chara => {
                  chara.value = diceRollForNewStat()
                  return chara
                }));
                e.preventDefault();
              }}
            >
              {i18next.t('auto generation')}
            </button>
          </div>
        {characComplete && (
          <div className='skillsContainer'>
            <div>
              <p>
                <b>{i18next.t('character generation type')}</b>
              </p>
              <ul className='tabsContainer'>
                <li
                  className={`tab ${generationCharacterClassic ? 'active' : ''}`}
                  onClick={() => {
                    setGenerationCharacterClassic(true);  
                  }}  
                >
                  {i18next.t('classique')}
                </li>
                <li
                  className={`tab ${!generationCharacterClassic ? 'active' : ''}`}
                  onClick={() => {
                    setGenerationCharacterClassic(false);  
                  }}  
                >
                  {i18next.t('custom')}
                </li>
              </ul>
              {generationCharacterClassic && (
                <p className="tutoCreation">
                  <span>{i18next.t('creationHelp.skillsHeadClassic')}</span>
                </p>
              )}
              {!generationCharacterClassic && (
                <p className="tutoCreation">
                  <p>{i18next.t('creationHelp.skillsHeadCustom')}</p>
                  <p>{i18next.t('creationHelp.skillsFootCustom')}</p>
                </p>
              )}
            </div>
            <div ref={skillsRef} className='skills'>
              <p>
                <b>{i18next.t('skill')} {!generationCharacterClassic ? `(${additionalSkillPoint})` : null}</b>
              </p>
              {listSkills.map((skill, i) => (
                <div key={i} className='skillRow'>
                  <div className='skillName'>
                    <div className="tooltip">
                      <span>
                        {i18next.t(`skills.${skill.label}`)}
                      </span>
                      <span className="tooltiptext">{i18next.t(`skillsHelp.${skill.label}`)}</span>
                    </div>
                  </div>
                  <div className='bonusSkills'>
                    <span>
                      {`${skill.value}`}
                    </span>
                    {!generationCharacterClassic && (
                      <span>
                        +
                      </span>
                    )}
                    {!generationCharacterClassic && (
                      <input
                        name={skill.label}
                        max={50}
                        min={0}
                        className='inputSkills'
                        type="number"
                        value={listBonusSkills[i].value}
                        onChange={(e) => {
                          const newValue = e.target.value !== '' ? JSON.parse(e.target.value) : null;
                          const newListBonus = [...listBonusSkills]
                          newListBonus[newListBonus.findIndex((charac) => charac.label === listBonusSkills[i].label)].value = newValue;
                          setListBonusSkills(newListBonus);
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className='createCharacterButton'>
          <div>
              <input 
                className={!creationCharacterIsEnable ? 'disabled' : ''}
                type="submit"
                value={i18next.t('create')}
              />
            </div>
        </div>
      </form>
    </div>
  );
}

export default NewCharacterForm