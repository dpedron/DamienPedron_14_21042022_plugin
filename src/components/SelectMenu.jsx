import React, { useEffect, useState } from 'react';
import SelectCover from './SelectCover.jsx';
import PropTypes from 'prop-types';

/**
 * Replace the original select by the custom select
 * @param {array} children Select options
 * @param {string} theme Select theme
 * @returns {JSX}
 */

export default function SelectMenu({ children, theme = 'default' }) {
  const [selectHide, setSelectHide] = useState(false);

  const selectId = children.props.id;

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
      value: option.props.value,
      imgsrc: option.props.imgsrc,
      imgsize: option.props.imgsize || '16px',
      disabled: option.props.disabled,
    });

  // No option
  if (children.props.children === undefined) {
    options.push({
      name: 'no-option',
      type: 'option',
      disabled: true,
    });
  } else {
    // One option
    if (children.props.children.length === undefined) {
      addOption(children.props.children);
    } else {
      // Multiple options
      children.props.children.forEach((option) => {
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
          if (option.length === undefined) {
            addOption(option);
          } else {
            option.forEach((option) => {
              addOption(option);
            });
          }
        }
      });
    }
  }

  return (
    <>
      {children}
      {selectHide && (
        <SelectCover options={options} selectId={selectId} theme={theme} />
      )}
    </>
  );
}

SelectMenu.propTypes = {
  children: PropTypes.object,
  theme: PropTypes.string,
};
