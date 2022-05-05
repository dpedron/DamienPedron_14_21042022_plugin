import React, { useEffect, useState } from 'react';

export default function SelectCover({ options, selectId }) {
  const [opened, setOpened] = useState(false); // Open/close select menu
  const selectValue = document.getElementById(selectId).value; // Value of the original select

  const selectSize = document.getElementById(selectId).size; // Size of the original select
  const hasASize = selectSize > 0; // To handle when a size has been specified for the select

  !opened && hasASize && setOpened(true); // Select has a size, list must be open and still open

  const [currentOptions, setCurrentOptions] = useState([]);
  const [focusPosition, setFocusPosition] = useState(0);

  function focusOnOpen() {
    const currentList = document.getElementById(`${selectId}-list`);
    if (currentList && !hasASize) {
      // When options were added to the dom and select has no size
      currentList.children[focusPosition].focus(); // Put the focus on the first child
      currentList.children[focusPosition].tabIndex === -1 &&
        setFocusPosition(focusPosition + 1); // If the first child is not focusable (like optgroup), try the next child and so on
      setCurrentOptions(currentList.children);
    }
  }

  /* Handle the selection of an option */
  function selectOption(e) {
    document.getElementById(selectId).value = e.target.innerText; // Change select value
    setOpened(!opened);
    setCurrentOptions([]);
    e.target.classList.add('selected');
    let currentOptions = [...e.target.parentElement.children];
    currentOptions.forEach(
      (option) =>
        !(option.className.includes('selected') && option.id === e.target.id) &&
        option.classList.remove('selected') // Deselect the option that is no longer selected
    );
  }

  function keyboadInteraction(e) {
    console.log(e);
    /* Close menu */
    if (e.code === 'Escape') {
      setOpened(false);
    }

    if (currentOptions.length > 0) {
      if (e.code === 'Enter' || e.code === 'Space') {
        selectOption(e);
      }
      e.preventDefault();
      if (
        focusPosition >= 0 &&
        (e.code === 'ArrowUp' || e.code === 'ArrowLeft')
      ) {
        if (
          currentOptions[focusPosition - 1].tabIndex === -1 &&
          focusPosition > 1
        ) {
          setFocusPosition(focusPosition - 2);
        } else {
          setFocusPosition(focusPosition - 1);
        }
      }
      if (
        focusPosition < currentOptions.length - 1 &&
        (e.code === 'ArrowDown' || e.code === 'ArrowRight')
      ) {
        setFocusPosition(focusPosition + 1);
      }
      currentOptions[focusPosition].focus();
    }
  }

  function test(e) {
    if (e.relatedTarget !== null && e.relatedTarget.size > 0) {
      e.relatedTarget.firstChild.tabIndex = '0';
    }
  }

  /* document.addEventListener('focusout', (e) => {
    if (e.relatedTarget !== null && e.relatedTarget.size > 0) {
      setCurrentOptions(0);
      console.log(currentOptions);
    }
  }); */

  document.onkeydown = (e) => keyboadInteraction(e);
  document.addEventListener('focusin', (e) => test(e));

  useEffect(() => {
    focusOnOpen();
  });

  return (
    <>
      {!hasASize && ( // Hide the button when a size has been specified for the select
        <span
          className="button"
          id={`${selectId}-button`}
          onClick={() => {
            setOpened(!opened);
          }}
          tabIndex="0"
        >
          {selectValue}
        </span>
      )}
      {opened && (
        <ul
          id={`${selectId}-list`}
          className="list"
          style={{ height: hasASize && `${selectSize * 28}px` }} // ************* //
          tabIndex={hasASize ? '0' : '-1'}
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
                    >
                      {option.options.props.children}
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
                      >
                        {option.props.children}
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
              >
                {option.name}
              </li>
            )
          )}
        </ul>
      )}
    </>
  );
}
