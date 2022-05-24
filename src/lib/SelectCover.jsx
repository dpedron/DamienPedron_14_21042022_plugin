import React, { useEffect, useState } from 'react';
import chevron from './angle-down-solid.svg';

export default function SelectCover({ options, selectId }) {
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

  /* Select with a size */
  const hasASize = selectSize > 0;
  !opened && hasASize && setOpened(true);

  /* Select disabled */
  const disabled = document.getElementById(selectId).disabled;

  /* Handles the focus when the menu is open */
  function focusOnOpen() {
    if (hasASize) {
      return;
    }
    if (
      list &&
      optionPosition !== -1 &&
      list.children[optionPosition] !== undefined
    ) {
      list.children[optionPosition].focus();
      setCurrentList(list.children); // Set the opened list as the current list
    }
  }

  function getOptions() {
    const currentList = document.getElementById(`${selectId}-list`);
    const currentButton = document.getElementById(`${selectId}-button`);
    opened
      ? setCurrentList(currentList.children)
      : setCurrentList(currentButton.previousElementSibling.children);
  }

  function updateValue() {
    if (options[optionPosition] === undefined) {
      return;
    }
    if (
      options[optionPosition] &&
      !options[optionPosition].disabled &&
      options[optionPosition].type !== 'optgroup'
    ) {
      if (buttonTitle) {
        buttonTitle.innerText = options[optionPosition].name;
        select.value = buttonTitle.innerText;
      }
      if (list && hasASize) {
        const selectedOption = [...list.children].find((option) =>
          option.classList.contains('selected')
        );
        if (selectedOption) {
          select.value = selectedOption.innerText;
        }
      }
    }
  }

  function disableAllOptions() {
    [...currentList].forEach((option) => option.classList.add('disabled'));
  }

  const [gotInitialPosition, setGotInitialPosition] = useState(false);

  function initialPosition() {
    if (buttonTitle === null) {
      return;
    }
    if (!gotInitialPosition) {
      let newPosition = optionPosition;
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
      setGotInitialPosition(true);
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

  useEffect(() => {
    initialPosition();
    updateValue();
    getOptions();
    focusOnOpen();
    hasASize && disabled && disableAllOptions();
  });

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

  function goodPosition(newPosition, prevPosition) {
    console.log(newPosition);
    options[newPosition].type === 'optgroup' || options[newPosition].disabled
      ? setOptionPosition(prevPosition)
      : setOptionPosition(newPosition);
  }

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
        (options[newPosition - 1].type === 'optgroup' ||
          options[newPosition - 1].disabled)
      );
      (options[newPosition].type === 'optgroup' ||
        options[newPosition].disabled) &&
        newPosition--;
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
      if (
        (options[newPosition + 1].type === 'optgroup' ||
          options[newPosition + 1].disabled) &&
        newPosition < options.length - 2
      ) {
        do {
          newPosition++;
        } while (
          (options[newPosition].type === 'optgroup' ||
            options[newPosition].disabled) &&
          newPosition < options.length - 2
        );
      }
      newPosition++;
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
    }
    /* Select last */
    if (e.code === 'End' || e.code === 'PageDown') {
      let newPosition = currentList.length;
      while (
        (options[newPosition].type === 'optgroup' ||
          options[newPosition].disabled) &&
        newPosition > 1
      ) {
        newPosition--;
      }
      goodPosition(newPosition, prevPosition);
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
    <>
      {!hasASize && ( // Hide the button when a size has been specified for the select
        <div
          className={`select-button ${disabled ? 'disabled' : ''}`}
          id={`${selectId}-button`}
          onKeyDown={(e) => {
            keyboardInteraction(e);
          }}
          onClick={() => setOpened(!opened)}
          tabIndex={disabled ? '-1' : '0'}
        >
          <span id={`${selectId}-button-title`}>{selectValue}</span>
          <img
            alt=""
            src={chevron}
            className={`chevron ${disabled ? 'disabled' : ''}`}
          />
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
            onKeyDown={(e) => {
              keyboardInteraction(e);
            }}
          >
            {options.map((option, i) =>
              option.type === 'optgroup' ? ( // Handle optgroup
                <React.Fragment key={`${option.name}${i}`}>
                  <li key={`${option.name}`} className="optgroup">
                    {option.name}
                  </li>
                  {option.options !== undefined &&
                    option.options.type === 'option' && ( // Only one option in optgroup
                      <li
                        key={option.options.props.children}
                        id={`${selectId}-${option.options.props.children}`}
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
                        <span className="option-text">
                          {option.options.props.children}
                        </span>
                      </li>
                    )}
                  {option.options && // More than one option in optgroup
                    option.options.length > 1 &&
                    option.options.map((option) => {
                      return (
                        <li
                          key={option.props.children}
                          id={`${selectId}-${option.props.children}`}
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
                          <span className="option-text">
                            {option.props.children}
                          </span>
                        </li>
                      );
                    })}
                </React.Fragment>
              ) : (
                <li
                  key={option.name}
                  id={`${selectId}-${option.name}`}
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
                  <span className="option-text">{option.name}</span>
                </li>
              )
            )}
          </ul>
        </>
      )}
    </>
  );
}
