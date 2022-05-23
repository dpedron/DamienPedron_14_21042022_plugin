import React, { useEffect, useState } from 'react';
import chevron from './angle-down-solid.svg';

export default function SelectCover({ options, selectId }) {
  /* State management */
  const [opened, setOpened] = useState(false); // Open/close select menu
  const [optionPosition, setOptionPosition] = useState(0); // Option position in the list

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
    }
  }

  function updateValue() {
    if (buttonTitle && options[optionPosition]) {
      if (
        options[optionPosition].disabled ||
        options[optionPosition].type === 'optgroup'
      ) {
        buttonTitle.innerText = '';
        select.value = buttonTitle.innerText;
        return;
      }
      buttonTitle.innerText = options[optionPosition].name;
      select.value = buttonTitle.innerText;
    }
  }

  function disableAllOptions() {
    if (list) {
      [...list.children].forEach((option) => option.classList.add('disabled'));
    }
  }

  useEffect(() => {
    focusOnOpen();
    updateValue();
    hasASize && disabled && disableAllOptions();
  });

  useEffect(() => {
    if (options[optionPosition] === undefined) {
      return;
    }
    if (
      options[optionPosition].type === 'optgroup' ||
      options[optionPosition].disabled === true
    ) {
      setOptionPosition(optionPosition + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Handles the selection of an option */
  function selectOption(e) {
    if (hasASize && disabled) {
      e.preventDefault();
    } else {
      select.value = e.target.innerText; // Change select value
      setOpened(false);
      setOptionPosition(
        [...list.children].findIndex(
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
  document.onclick = (e) => {
    const handleClick = document.querySelector('.handle-click');
    handleClick === e.target && setOpened(false);
  };

  function keyboardInteraction(e) {
    const prev = optionPosition - 1;
    const next = optionPosition + 1;
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
      }
      if (options.length > 0) {
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
          let newPosition = optionPosition;
          do {
            newPosition--;
            console.log(options[newPosition - 1]);
          } while (
            (options[newPosition].disabled ||
              options[newPosition].tabIndex === -1) && // When the previous element is an optgroup ...
            newPosition > 2 // and the current option is at least the third ...
          );
          newPosition--;
          setOptionPosition(newPosition);
        }
        /* Move down */
        if (
          optionPosition < options.length - 1 &&
          (e.code === 'ArrowDown' || e.code === 'ArrowRight')
        ) {
          setOptionPosition(next);
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
            setOptionPosition(prev);
          }
        }
        /* Select next option */
        if (
          optionPosition < select.length - 1 &&
          (e.code === 'ArrowDown' || e.code === 'ArrowRight')
        ) {
          setOptionPosition(next);
        }
      }
    } /* Select first */
    if (e.code === 'Home' || e.code === 'PageUp') {
      setOptionPosition(0);
    }
    /* Select last */
    if (e.code === 'End' || e.code === 'PageDown') {
      setOptionPosition(options.length - 1);
    }
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
                    <img alt="" className="option-pic" src={option.imgsrc} />
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
