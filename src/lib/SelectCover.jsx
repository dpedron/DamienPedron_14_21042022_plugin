import React, { useEffect, useState } from 'react';
import chevron from './angle-down-solid.svg';

export default function SelectCover({ options, selectId }) {
  /* State management */
  const [opened, setOpened] = useState(false); // Open/close select menu
  const [currentList, setCurrentList] = useState([]); // Current list
  const [optionPosition, setOptionPosition] = useState(0); // Option position in the list
  const [clickCount, setClickCount] = useState(0);

  /* Original select */
  const select = document.getElementById(selectId);
  const selectValue = document.getElementById(selectId).value;
  const selectSize = document.getElementById(selectId).size;

  /* Select cover */
  const list = document.getElementById(`${selectId}-list`);
  const button = document.getElementById(`${selectId}-button`);
  const buttonTitle = document.getElementById(`${selectId}-button-title`);
  const option = document.querySelector('.option');

  /* Select with a size */
  const hasASize = selectSize > 0; // Select has a size ?
  !opened && hasASize && setOpened(true); // Select has a size, list must be open and still open

  /* Select disabled */
  const disabled = document.getElementById(selectId).disabled; // Select disabled ?

  /* Handles the focus when the menu is open */
  function focusOnOpen() {
    /* When options were added to the dom and select has no size */
    if (
      list &&
      !hasASize &&
      optionPosition !== -1 &&
      list.children[optionPosition] !== undefined
    ) {
      list.children[optionPosition].focus(); // Put the focus on the option actually selected (first option on first opening)
      list.children[optionPosition].tabIndex === -1 &&
        setOptionPosition(optionPosition + 1); // If the first option is not focusable (like optgroup), try the next child and so on
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
    if (buttonTitle && select[optionPosition]) {
      buttonTitle.innerText = select[optionPosition].innerText;
      select.value = buttonTitle.innerText;
    }
  }

  useEffect(() => {
    getOptions();
    focusOnOpen();
    updateValue();
  });

  /* Handles the selection of an option */
  function selectOption(e) {
    if (hasASize && disabled) {
      e.preventDefault();
    } else {
      select.value = e.target.innerText; // Change select value
      setOpened(false);
      setClickCount(0);
      setOptionPosition(
        [...currentList].findIndex(
          (option) => e.target.innerText === option.innerText
        )
      );
      e.target.classList.add('selected'); // Display "selected" style
      [...e.target.parentElement.children].forEach(
        (option) =>
          !(
            option.className.includes('selected') && option.id === e.target.id
          ) && option.classList.remove('selected') // Remove "selected" style of the option that is no longer selected
      );
    }
  }

  /* Handles when the menu should be closed */
  document.onclick = () => {
    if (!opened && !hasASize) {
      setClickCount(0);
    }
    if (opened && !hasASize) {
      if (clickCount === 1) {
        setOpened(!opened);
        setClickCount(0);
      } else {
        setClickCount(1);
      }
    }
  };

  function keyboadInteraction(e) {
    if (e.code === 'Tab') {
      return;
    }
    e.preventDefault();
    /* When the menu is open */
    if (opened) {
      /* Close menu */
      if (
        opened &&
        !hasASize &&
        (e.code === 'Escape' || (e.altKey && e.code === 'ArrowUp'))
      ) {
        button.focus();
        setOpened(false);
        setClickCount(0);
      }
      if (currentList.length > 0) {
        /* Select an option */
        if (e.code === 'Enter' || e.code === 'Space') {
          !hasASize && button.focus();
          e.target.classList.contains('option') && selectOption(e);
        }
        /* Move up */
        if (
          optionPosition >= 1 &&
          (e.code === 'ArrowUp' || e.code === 'ArrowLeft')
        ) {
          if (
            currentList[optionPosition - 1].tabIndex === -1 && // When the previous element is an optgroup ...
            optionPosition > 2 // and the current option is at least the third ...
          ) {
            setOptionPosition(optionPosition - 2); // go to the element before the optgroup
          } else {
            setOptionPosition(optionPosition - 1);
          }
        }
        /* Move down */
        if (
          optionPosition < currentList.length - 1 &&
          (e.code === 'ArrowDown' || e.code === 'ArrowRight')
        ) {
          setOptionPosition(optionPosition + 1);
        }

        /* Select first */
        if (e.code === 'Home' || e.code === 'PageUp') {
          setOptionPosition(0);
        }
        /* Select last */
        if (e.code === 'End' || e.code === 'PageDown') {
          setOptionPosition(currentList.length - 1);
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
      if (!e.altKey) {
        /* Select previous option */
        if (e.code === 'ArrowUp' || e.code === 'ArrowLeft') {
          if (optionPosition >= 1) {
            setOptionPosition(optionPosition - 1);
          }
        }
        /* Select next option */
        if (
          optionPosition < select.length - 1 &&
          (e.code === 'ArrowDown' || e.code === 'ArrowRight')
        ) {
          setOptionPosition(optionPosition + 1);
        }
      }
    }
  }

  return (
    <>
      {!hasASize && ( // Hide the button when a size has been specified for the select
        <div
          className={`select-button ${disabled ? 'disabled' : ''}`}
          id={`${selectId}-button`}
          onKeyDown={(e) => {
            keyboadInteraction(e);
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
        <ul
          id={`${selectId}-list`}
          className={`list ${disabled ? 'disabled' : ''}`}
          style={{
            height:
              option && hasASize && `${selectSize * option.clientHeight}px`,
          }}
          tabIndex={disabled || !hasASize ? '-1' : '0'}
          onKeyDown={(e) => {
            keyboadInteraction(e);
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
                        keyboadInteraction(e);
                      }}
                    >
                      {option.props.imgsrc && (
                        <img
                          alt=""
                          className="option-pic"
                          src={option.props.imgsrc}
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
                          keyboadInteraction(e);
                        }}
                      >
                        {option.props.imgsrc && (
                          <img
                            alt=""
                            className="option-pic"
                            src={option.props.imgsrc}
                          />
                        )}
                        <span className="option-text">
                          {option.props.children}
                        </span>
                        {console.log(options)}
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
                  keyboadInteraction(e);
                }}
              >
                {option.imgsrc && (
                  <img alt="" className="option-pic" src={option.imgsrc} />
                )}
                <span className="option-text">{option.name}</span>
              </li>
            )
          )}
        </ul>
      )}
    </>
  );
}
