import React, { useEffect, useState } from 'react';
import './styles.css';
import PropTypes from 'prop-types';

/**
 * Custom select
 * @param {array} options Select options
 * @param {string} selectId Id of the select
 * @param {string} theme Select theme
 * @returns {JSX}
 */

export default function SelectCover({ options, selectId, theme }) {
  /* State management */
  const [opened, setOpened] = useState(false);
  const [currentList, setCurrentList] = useState([]);
  const [optionPosition, setOptionPosition] = useState(0);

  /* Original select */
  const select = document.getElementById(selectId);
  const selectValue = document.getElementById(selectId).value || '';
  const selectSize = document.getElementById(selectId).size;

  /* Select cover */
  const list = document.getElementById(`${selectId}-list`);
  const button = document.getElementById(`${selectId}-button`);
  const buttonTitle = document.getElementById(`${selectId}-button-title`);
  const option = document.querySelector('.option');
  const emptyValue = options.find((option) => option.value === '');
  const emptyValueIndex = options.findIndex((option) => option.value === '');

  /* Select with a size */
  const hasASize = selectSize > 0;
  !opened && hasASize && setOpened(true);

  /* Select disabled */
  const disabled = document.getElementById(selectId).disabled;

  useEffect(() => {
    position();
    updateValue();
    getOptions();
    focusOnOpen();
    hasASize && disabled && disableAllOptions();
  });

  /* Set the initial position to the first selectable option */
  function position() {
    if (buttonTitle === null) {
      return;
    }
    let newPosition = optionPosition;
    if (emptyValue) {
      newPosition = emptyValueIndex;
    } else {
      if (
        (options[newPosition].type === 'optgroup' ||
          options[newPosition].disabled) &&
        options[newPosition + 1] !== undefined
      ) {
        do {
          newPosition++;
        } while (
          options[newPosition].type === 'optgroup' ||
          options[newPosition].disabled
        );
      }
      setOptionPosition(newPosition);
    }
  }

  /* Update default select value */
  function updateValue() {
    if (options[optionPosition] === undefined) {
      return;
    }
    if (
      options[optionPosition] &&
      (!options[optionPosition].disabled || emptyValue) &&
      options[optionPosition].type !== 'optgroup'
    ) {
      if (buttonTitle) {
        buttonTitle.innerText = options[optionPosition].name;
        select.value = buttonTitle.innerText;
        select.value !== '' &&
          select.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (list && hasASize) {
        const selectedOption = [...list.children].find((option) =>
          option.classList.contains('selected')
        );
        if (selectedOption) {
          select.value = selectedOption.innerText;
          select.value !== '' &&
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    }
  }

  function getOptions() {
    const currentList = document.getElementById(`${selectId}-list`);
    const currentButton = document.getElementById(`${selectId}-button`);
    opened
      ? setCurrentList(currentList.children)
      : setCurrentList(
          currentButton.parentElement.previousElementSibling.children
        );
  }

  /* Handles the focus when the menu is open */
  function focusOnOpen() {
    if (hasASize || select.value === '') {
      return;
    }
    if (
      list &&
      optionPosition !== -1 &&
      list.children[optionPosition] !== undefined
    ) {
      list.children[optionPosition].focus();
      setCurrentList(list.children);
    }
  }

  /* Used to disable options when the select has a size */
  function disableAllOptions() {
    [...currentList].forEach((option) => option.classList.add('disabled'));
  }

  /* Handles the selection of an option */
  function selectOption(e) {
    setOpened(false);
    setOptionPosition(
      [...currentList].findIndex(
        (option) => e.target.innerText === option.innerText
      )
    );
    e.target.classList.add('selected');
    [...e.target.parentElement.children].forEach(
      (option) =>
        !(option.className.includes('selected') && option.id === e.target.id) &&
        option.classList.remove('selected')
    );
  }

  /* Handles when the menu should be closed */
  document.onclick = (e) => {
    const handleClick = document.querySelector('.handle-click');
    handleClick === e.target && setOpened(false);
  };

  /* To define if the current position is a good position or not */
  function goodPosition(newPosition, prevPosition) {
    if (
      options[newPosition].type === 'optgroup' ||
      options[newPosition].disabled
    ) {
      setOptionPosition(prevPosition);
      return prevPosition;
    } else {
      setOptionPosition(newPosition);
      return newPosition;
    }
  }

  const picSize = (size) => {
    return size === 's'
      ? '12px'
      : size === 'm'
      ? '16px'
      : size === 'l'
      ? '24px'
      : '16px';
  };

  /* Handles all keyboard interactions */
  function keyboardInteraction(e) {
    let newPosition = optionPosition;
    let prevPosition = newPosition;
    if (e.target.classList.contains('option') && e.code === 'Tab') {
      selectOption(e);
      return;
    }
    if ((button || hasASize) && e.code === 'Tab') {
      return;
    }
    e.preventDefault();

    /* Select previous option */
    if (
      newPosition >= 1 &&
      (e.code === 'ArrowUp' || e.code === 'ArrowLeft') &&
      !e.altKey
    ) {
      do {
        newPosition >= 1 && newPosition--;
      } while (
        newPosition >= 1 &&
        (options[newPosition].type === 'optgroup' ||
          options[newPosition].disabled)
      );
      goodPosition(newPosition, prevPosition);

      if (list && hasASize) {
        list.children[newPosition].focus();
        select.value = document.activeElement.innerText;
      }
    }

    /* Select next option */
    if (
      optionPosition < options.length - 1 &&
      (e.code === 'ArrowDown' || e.code === 'ArrowRight') &&
      !e.altKey
    ) {
      do {
        newPosition++;
      } while (
        (options[newPosition].type === 'optgroup' ||
          options[newPosition].disabled) &&
        newPosition < options.length - 2
      );
      goodPosition(newPosition, prevPosition);
      if (list && hasASize) {
        if (optionPosition === 0 && document.activeElement === list) {
          newPosition = 0;
          setOptionPosition(newPosition);
        }
        list.children[newPosition].focus();
        select.value = document.activeElement.innerText;
      }
    }

    /* Select first */
    if (e.code === 'Home' || e.code === 'PageUp') {
      let newPosition = 0;
      while (
        (options[newPosition].type === 'optgroup' ||
          options[newPosition].disabled) &&
        newPosition < options.length - 2
      ) {
        newPosition++;
      }
      goodPosition(newPosition, prevPosition);
      if (list && hasASize) {
        list.children[goodPosition(newPosition, prevPosition)].focus();
        select.value = document.activeElement.innerText;
      }
    }

    /* Select last */
    if (e.code === 'End' || e.code === 'PageDown') {
      let newPosition = options.length - 1;
      while (
        (options[newPosition].type === 'optgroup' ||
          options[newPosition].disabled) &&
        newPosition > 1
      ) {
        newPosition--;
      }
      goodPosition(newPosition, prevPosition);
      if (list && hasASize) {
        list.children[goodPosition(newPosition, prevPosition)].focus();
        select.value = document.activeElement.innerText;
      }
    }

    /* When the menu is open */
    if (opened) {
      /* Close menu */
      if (
        !hasASize &&
        (e.code === 'Escape' || (e.altKey && e.code === 'ArrowUp'))
      ) {
        button.focus();
        setOpened(false);
      }
      if (currentList.length > 0) {
        /* Select an option */
        if (e.code === 'Enter' || e.code === 'Space') {
          !hasASize && button.focus();
          e.target.classList.contains('option') && selectOption(e);
        }
      }
    }

    /* When the menu is closed */
    if (!opened) {
      if (e.code === 'Enter') {
        return;
      }
      /* Open menu */
      if ((e.altKey && e.code === 'ArrowDown') || e.code === 'Space') {
        setOpened(true);
      }
    }
    updateValue();
  }

  return (
    <div className="select-wrapper">
      {!hasASize && ( // Hide the button when a size has been specified for the select
        <div
          className={`select-button ${disabled ? 'disabled' : ''}`}
          data-theme={theme}
          id={`${selectId}-button`}
          onKeyDown={(e) => {
            keyboardInteraction(e);
          }}
          onClick={() => setOpened(!opened)}
          tabIndex={disabled ? '-1' : '0'}
        >
          <span data-theme={theme} id={`${selectId}-button-title`}>
            {selectValue}
          </span>
          <svg
            className={`chevron ${disabled ? 'disabled' : ''}`}
            data-theme={theme}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
          >
            <path d="M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z" />
          </svg>
        </div>
      )}
      {opened && (
        <>
          {!hasASize && <div className="handle-click"></div>}
          <ul
            id={`${selectId}-list`}
            className={`list ${!hasASize ? 'no-size' : ''}`}
            style={{
              height:
                option && hasASize && `${selectSize * option.clientHeight}px`,
            }}
            tabIndex={disabled || !hasASize ? '-1' : '0'}
            data-theme={theme}
            onKeyDown={(e) => {
              keyboardInteraction(e);
            }}
          >
            {options.map((option, i) =>
              option.type === 'optgroup' ? ( // Handle optgroup
                <React.Fragment key={`${option.name}${i}`}>
                  <li
                    data-theme={theme}
                    key={`${option.name}`}
                    className="optgroup"
                  >
                    {option.name}
                  </li>
                  {option.options !== undefined &&
                    option.options.type === 'option' && ( // Only one option in optgroup
                      <li
                        style={{
                          display:
                            option.props.value === '' ? 'none' : 'list-item',
                        }}
                        key={option.options.props.children}
                        id={`${selectId}-${option.options.props.children}`}
                        className={`option ${
                          option.props.disabled ? 'disabled' : ''
                        }`}
                        data-theme={theme}
                        onClick={(e) => selectOption(e)}
                        tabIndex={option.props.disabled ? '-1' : '0'}
                        onKeyDown={(e) => {
                          keyboardInteraction(e);
                        }}
                      >
                        {option.props.imgsrc && (
                          <img
                            alt=""
                            className="option-pic"
                            src={option.props.imgsrc}
                            width={picSize(option.props.imgsize)}
                          />
                        )}
                        <span className="option-text" data-theme={theme}>
                          {option.options.props.children}
                        </span>
                      </li>
                    )}
                  {option.options && // More than one option in optgroup
                    option.options.length > 1 &&
                    option.options.map((option) => {
                      return (
                        <li
                          style={{
                            display:
                              option.props.value === '' ? 'none' : 'list-item',
                          }}
                          key={option.props.children}
                          id={`${selectId}-${option.props.children}`}
                          data-theme={theme}
                          className={`option ${
                            option.props.disabled ? 'disabled' : ''
                          }`}
                          onClick={(e) => selectOption(e)}
                          tabIndex={option.props.disabled ? '-1' : '0'}
                          onKeyDown={(e) => {
                            keyboardInteraction(e);
                          }}
                        >
                          {option.props.imgsrc && (
                            <img
                              alt=""
                              className="option-pic"
                              src={option.props.imgsrc}
                              width={picSize(option.props.imgsize)}
                            />
                          )}
                          <span className="option-text" data-theme={theme}>
                            {option.props.children}
                          </span>
                        </li>
                      );
                    })}
                </React.Fragment>
              ) : (
                <li
                  style={{
                    display: option.value === '' ? 'none' : 'list-item',
                  }}
                  key={option.name}
                  id={`${selectId}-${option.name}`}
                  data-theme={theme}
                  className={`option ${option.disabled ? 'disabled' : ''}`}
                  onClick={(e) => selectOption(e)}
                  tabIndex={option.disabled || hasASize ? '-1' : '0'}
                  onKeyDown={(e) => {
                    keyboardInteraction(e);
                  }}
                >
                  {option.imgsrc && (
                    <img
                      alt=""
                      className="option-pic"
                      src={option.imgsrc}
                      width={picSize(option.imgsize)}
                    />
                  )}
                  <span className="option-text" data-theme={theme}>
                    {option.name}
                  </span>
                </li>
              )
            )}
          </ul>
        </>
      )}
    </div>
  );
}

SelectCover.propTypes = {
  options: PropTypes.array,
  selectId: PropTypes.string.isRequired,
  theme: PropTypes.string,
};
