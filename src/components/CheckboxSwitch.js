import React from 'react';

const CheckboxSwitch = (props) => {
  return (
    <div className="switch">
      <label>
        <input
          type="checkbox"
          checked={props.isChecked}
          onChange={(e) => {
            props.update(e.target.checked);
          }}
        />
        <span className="lever"></span>
        {props.label}
      </label>
    </div>
  );
  
}

export default CheckboxSwitch