import React, {useState} from 'react';
import Picture from './Picture';
import { RefreshIcon } from '@heroicons/react/outline'
import Skills from '../components/Skills';
import Characteristics from '../components/Characteristics';
import '../styles/dm.css'
import {
  BrowserView,
  isBrowser
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
      className={`memberCompanyList ${isBrowser ? 'click' : ''}`}
      onClick={() => {
        if(isBrowser) {
          props.select(member);
        }
      }}
    >
      <Picture character={member}/>
      <div className='nameHpCharacter'>
        <b>{member.name}</b><br/>
        <span>{member.currentHp} / {member.maxHp}</span>
      </div>
    </div>
  );
}

const DmCompany = (props) => {
  const {company} = props;
  const [memberSelected, setMemberSelected] = useState(company[0])
  return (
    <div className='containerCompanyList'>
      <div className='containerInfoCharacterDm'>
        <RefreshIcon
          className="iconReload"
          onClick={() => {
            props.reloadCompany();
          }}
        />
        <div className='companyList'>
          {company.map((compagnyMember,i) => (
            <CompanyMemberDetails
              key={i}
              member={compagnyMember}
              select={(select) => {
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