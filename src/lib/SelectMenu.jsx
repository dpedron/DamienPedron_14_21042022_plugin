import React, { useEffect, useState } from 'react';
import SelectCover from './SelectCover';

export default function SelectMenu({
  selectId,
  children = [
    <option key={`${selectId}-no-option`} disabled>
      No option
    </option>,
  ],
  label,
  size = 0,
  disabled = false,
}) {
  const [selectHide, setSelectHide] = useState(false);

  useEffect(() => {
    changeSelect();
  });

  function changeSelect() {
    const select = document.getElementById(selectId);
    select.style.display = 'none'; // Hide initial select
    setSelectHide(true); // Set selectHide to true to display the custom select
  }

  let options = []; // Init options
  children.forEach((option) => {
    const optgroup = option.type === 'optgroup'; // Check if it's an optgroup
    if (optgroup) {
      options.push({
        name: option.props.label,
        type: option.type,
      });
      if (option.props.children) {
        option.props.children.forEach((option) => {
          options.push({
            name: option.props.children,
            type: option.type,
            imgsrc: option.props.imgsrc,
            disabled: option.props.disabled,
          });
        });
      }
    } else {
      options.push({
        name: option.props.children,
        type: option.type,
        imgsrc: option.props.imgsrc,
        disabled: option.props.disabled,
      });
    }
  });

  return (
    <>
      <label className="label" htmlFor={`${selectId}-button`}>
        {label}
      </label>
      <select id={selectId} name={selectId} size={size} disabled={disabled}>
        {children}
      </select>
      {selectHide && <SelectCover options={options} selectId={selectId} />}
    </>
  );
}
