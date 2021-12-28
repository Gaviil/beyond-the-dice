import React from 'react';

const CheckboxSwitch = (props) => {
  return (
    <div className={`switch ${props.disabled ? 'disabled': ''}`}>
      <label>
        <input
          disabled={props.disabled}
          type="checkbox"
          checked={props.isChecked}
          onChange={(e) => {
            props.update(e.target.checked);
          }}
        />
        <span className="lever"></span>
        <span className='switchName'>{props.label}</span>
      </label>
    </div>
  );
  
}

export default CheckboxSwitch