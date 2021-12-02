import React from 'react';
import Picture from './Picture';

const Company = (props) => {
  return (
    <div className={props.list ? 'containerCompanyList' : 'containerCompany'}>
      {props.company.map((compagnyMember,i) => (
        <div
          key={i}
          className={props.list ? 'memberCompanyList' : 'memberCompany'}
        >
          <Picture character={compagnyMember}/>
          <div>
            <b>{compagnyMember.name}</b><br/>
            {props.withLife && (
              <span>{compagnyMember.currentHp} / {compagnyMember.maxHp}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
  
}

export default Company