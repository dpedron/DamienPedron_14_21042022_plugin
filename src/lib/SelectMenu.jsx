import React, { useEffect, useState } from 'react';
import SelectCover from './SelectCover';
import PropTypes from 'prop-types';

/**
 * Replace the original select by the custom select
 * @param {string} selectId Id of the select
 * @param {array} children Select options
 * @param {string} label Select label
 * @param {number} size Select size
 * @param {boolean} disabled Define if the select is disabled or not
 * @param {string} theme Select theme
 * @returns {JSX}
 */

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
  theme = 'default',
}) {
  const [selectHide, setSelectHide] = useState(false);

  useEffect(() => {
    changeSelect();
  });

  /* Replace default select by custom select */
  function changeSelect() {
    const select = document.getElementById(selectId);
    select.style.display = 'none';
    setSelectHide(true);
  }

  let options = [];
  let addOption = (option) =>
    options.push({
      name: option.props.children,
      type: option.type,
      imgsrc: option.props.imgsrc,
      imgsize: option.props.imgsize || '16px',
      disabled: option.props.disabled,
    });

  children.forEach((option) => {
    const optgroup = option.type === 'optgroup';
    if (optgroup) {
      options.push({
        name: option.props.label,
        type: option.type,
      });
      if (option.props.children) {
        option.props.children.forEach((option) => {
          addOption(option);
        });
      }
    } else {
      addOption(option);
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
      {selectHide && (
        <SelectCover options={options} selectId={selectId} theme={theme} />
      )}
    </>
  );
}

SelectMenu.propTypes = {
  selectId: PropTypes.string.isRequired,
  children: PropTypes.array,
  label: PropTypes.string,
  size: PropTypes.number,
  disabled: PropTypes.bool,
  theme: PropTypes.string,
};
