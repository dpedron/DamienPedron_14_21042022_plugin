import React, { useState } from 'react';

export default function SelectCover({ options, id }) {
  const [opened, setOpened] = useState(false); // Open/close select menu
  const selectValue = document.getElementById(id).value; // Value of the original select

  return (
    <>
      <span
        className="button"
        id={`${id}-button`}
        onClick={() => setOpened(!opened)}
      >
        {selectValue}
      </span>
      {opened && (
        <ul className="list">
          {options.map((option, i) =>
            option.type === 'optgroup' ? (
              <React.Fragment key={`${option.name}${i}`}>
                <li key={`${option.name}`} className="optgroup">
                  {option.name}
                </li>
                {option.options.map((option) => {
                  return (
                    <li
                      key={`${option.props.children}`}
                      className="option"
                      onClick={(e) => {
                        document.getElementById(id).value =
                          e.currentTarget.innerText; // Change select value
                        setOpened(!opened);
                      }}
                    >
                      {option.props.children}
                    </li>
                  );
                })}
              </React.Fragment>
            ) : (
              <li
                key={option + i}
                className="option"
                onClick={(e) => {
                  document.getElementById(id).value = e.currentTarget.innerText; // Change select value
                  setOpened(!opened);
                }}
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
