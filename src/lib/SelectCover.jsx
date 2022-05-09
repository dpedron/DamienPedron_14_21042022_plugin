import React, { useEffect, useState } from 'react';
import chevron from './angle-down-solid.svg';

export default function SelectCover({ options, selectId }) {
  /* State management */
  const [opened, setOpened] = useState(false); // Open/close select menu
  const [currentList, setCurrentList] = useState([]); // Current list
  const [optionPosition, setOptionPosition] = useState(0); // Option position in the list
  const [clickCount, setClickCount] = useState(0);

  const select = document.getElementById(selectId); // Original select
  const selectValue = document.getElementById(selectId).value; // Value of the original select
  const selectSize = document.getElementById(selectId).size; // Size of the original select
  const list = document.getElementById(`${selectId}-list`); // Get the cover list
  const button = document.getElementById(`${selectId}-button`);
  const buttonTitle = document.getElementById(`${selectId}-button-title`);
  const hasASize = selectSize > 0; // Select has a size ?
  !opened && hasASize && setOpened(true); // Select has a size, list must be open and still open
  const disabled = document.getElementById(selectId).disabled; // Select disabled ?

  /* Handles the focus when the menu is open */
  function focusOnOpen() {
    /* When options were added to the dom and select has no size */
    if (list && !hasASize && optionPosition !== -1) {
      list.children[optionPosition].focus(); // Put the focus on the option actually selected (first option on first opening)
      list.children[optionPosition].tabIndex === -1 &&
        setOptionPosition(optionPosition + 1); // If the first option is not focusable (like optgroup), try the next child and so on
      setCurrentList(list.children); // Set the opened list as the current list
    }
  }

  useEffect(() => {
    focusOnOpen();
  });

  /* Handles the selection of an option */
  function selectOption(e) {
    console.log(e.target);
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

  function getOptions() {
    const currentList = document.getElementById(`${selectId}-list`);
    const currentButton = document.getElementById(`${selectId}-button`);
    opened
      ? setCurrentList(currentList.children)
      : setCurrentList(currentButton.previousElementSibling.children);
  }

  function keyboadInteraction(e) {
    if (e.code === 'Tab') {
      return;
    }
    e.preventDefault();
    /* When the menu is open */
    if (opened) {
      /* Close menu */
      if (e.code === 'Escape' || (e.altKey && e.code === 'ArrowUp')) {
        button.focus();
        setOpened(false);
        setClickCount(0);
      }
      if (currentList.length > 0) {
        /* Select an option */
        if (e.code === 'Enter' || e.code === 'Space') {
          button.focus();
          selectOption(e);
        }
        /* Move up */
        if (
          optionPosition >= 1 &&
          (e.code === 'ArrowUp' || e.code === 'ArrowLeft')
        ) {
          if (
            currentList[optionPosition - 1].tabIndex === -1 &&
            optionPosition > 2
          ) {
            setOptionPosition(optionPosition - 2); // Previous element is an optgroup
          } else {
            setOptionPosition(optionPosition - 1);
          }
          currentList[optionPosition].focus();
        }
        /* Move down */
        if (
          optionPosition < currentList.length - 1 &&
          (e.code === 'ArrowDown' || e.code === 'ArrowRight')
        ) {
          setOptionPosition(optionPosition + 1);
          currentList[optionPosition].focus();
        }

        /* Select first */
        if (e.code === 'Home' || e.code === 'PageUp') {
          setOptionPosition(0);
          currentList[optionPosition].focus();
        }
        /* Select last */
        if (e.code === 'End' || e.code === 'PageDown') {
          setOptionPosition(currentList.length - 1);
          currentList[optionPosition].focus();
        }
      }
    } else {
      if (e.code === 'Enter') {
        return;
      }
      /* Open menu */
      if ((e.altKey && e.code === 'ArrowDown') || e.code === 'Space') {
        setOpened(true);
        currentList[optionPosition].focus();
      }
      if (!e.altKey && select[optionPosition] !== undefined) {
        /* Select next option */
        if (e.code === 'ArrowUp' || e.code === 'ArrowLeft') {
          setOptionPosition(optionPosition - 1);
        }
        /* Select previous option */
        if (e.code === 'ArrowDown' || e.code === 'ArrowRight') {
          setOptionPosition(optionPosition + 1);
        }
        if (select[optionPosition] !== undefined) {
          buttonTitle.innerText = select[optionPosition].innerText;
          select.value = buttonTitle.innerText;
        }
      }
    }
  }

  return (
    <>
      {!hasASize && ( // Hide the button when a size has been specified for the select
        <div
          className="select-button"
          id={`${selectId}-button`}
          onKeyDown={(e) => {
            keyboadInteraction(e);
          }}
          onClick={() => setOpened(!opened)}
          onFocus={() => getOptions()}
          tabIndex={disabled ? '-1' : '0'}
          style={{
            pointerEvents: disabled && 'none',
          }}
        >
          <span id={`${selectId}-button-title`}>{selectValue}</span>
          <img alt="" src={chevron} className="chevron" />
        </div>
      )}
      {opened && (
        <ul
          id={`${selectId}-list`}
          className="list"
          style={{
            height: hasASize && `${selectSize * 28}px`,
          }}
          tabIndex={hasASize ? '0' : '-1'}
          onKeyDown={(e) => {
            keyboadInteraction(e);
          }}
          onFocus={() => {
            hasASize && getOptions();
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
                      className="option"
                      onClick={(e) => selectOption(e)}
                      tabIndex={hasASize ? '-1' : '0'}
                      onKeyDown={(e) => {
                        keyboadInteraction(e);
                      }}
                    >
                      {option.imgsrc && (
                        <img
                          alt=""
                          className="option-pic"
                          src={option.imgsrc}
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
                        className="option"
                        onClick={(e) => selectOption(e)}
                        tabIndex={hasASize ? '-1' : '0'}
                        onKeyDown={(e) => {
                          keyboadInteraction(e);
                        }}
                      >
                        {option.imgsrc && (
                          <img
                            alt=""
                            className="option-pic"
                            src={option.imgsrc}
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
                className="option"
                onClick={(e) => selectOption(e)}
                tabIndex={hasASize ? '-1' : '0'}
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
