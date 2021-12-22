import React, {useState} from 'react';
import Picture from './Picture';
import refresh from '../assets/Images/refresh.png'
import sheet from '../assets/Images/sheet.png'
import Skills from '../components/Skills';
import Characteristics from '../components/Characteristics';
import '../styles/dm.css'
import {
  BrowserView,
} from "react-device-detect";

const StatInfo = (props) => {
  return (
    <div className='blockInfoDM'>
      <h3>{props.name}</h3>
      <div className='stats'>
        <Characteristics
          characteristics={props.characteristics}
          campaign={{clickStat: false}}
          hideRollSwitch={false}
          sendNewRoll={() => {}}
        />
        <Skills
          skills={props.skills}
          campaign={{clickStat: false}}
          hideRollSwitch={false}
          sendNewRoll={() => {}}
        />
      </div>
      
    </div>
  );
}

const CompanyMemberDetails = (props) => {
  const {member} = props;
  return (
    <div
      className={'memberCompanyList'}
    >
      <Picture character={member}/>
      <div className='nameHpCharacter'>
        <b>{member.name}</b><br/>
        <span>{member.currentHp} / {member.maxHp}</span>
      </div>
      <BrowserView className='sheetIcon'>
        <img
          onClick={() => {
            props.select(member)
          }}
          src={sheet}
          alt="sheet"
        />
      </BrowserView>
    </div>
  );
}

const DmCompany = (props) => {
  const {company} = props;
  const [memberSelected, setMemberSelected] = useState(company[0])
  return (
    <div className='containerCompanyList'>
      <div className='containerInfoCharacterDm'>
        <img
          className='refreshCompany'
          onClick={() => {
            props.reloadCompany();
          }}
          src={refresh}
          alt="refresh"
        />
        <div className='companyList'>
          {company.map((compagnyMember,i) => (
            <CompanyMemberDetails
              key={i}
              member={compagnyMember}
              select={(select) => {
                console.log('setmember', select)
                setMemberSelected(select)
              }}
            />
          ))}          
        </div>        
        <BrowserView className='infoCharacter'>
          {memberSelected && (
            <StatInfo name={memberSelected.name} skills={memberSelected.skills} characteristics={memberSelected.characteristics}/>
          )}
        </BrowserView>        
      </div>
    </div>
  );
  
}

export default DmCompany