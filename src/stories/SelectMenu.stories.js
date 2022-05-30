import React from 'react';
import { storiesOf } from '@storybook/react';

import SelectMenu from '../lib/SelectMenu';

const stories = storiesOf('App Test', module);

stories.add('App', () => {
  return (
    <>
      <SelectMenu theme="light">
        <select id="test">
          <option value="" disabled hidden>
            Choose here
          </option>
          <optgroup label="Scripts">
            <option>jQuery.js</option>
            <option imgsize="l">ui.jQuery.js</option>
          </optgroup>
          <optgroup label="Other files">
            <option disabled>Some unknown file</option>
            <option disabled>
              Some other file with a very long option text
            </option>
            <option disabled>Some other le with a very long option text</option>
          </optgroup>
        </select>
      </SelectMenu>
      <SelectMenu theme="light">
        <select id="test3" size={5}>
          <optgroup label="Scripts">
            <option>jQuery.js</option>
            <option imgsize="l">ui.jQuery.js</option>
          </optgroup>
          <optgroup label="Other files">
            <option disabled>Some unknown file</option>
            <option disabled>
              Some other file with a very long option text
            </option>
            <option disabled>Some other le with a very long option text</option>
          </optgroup>
        </select>
      </SelectMenu>
      <SelectMenu theme="light">
        <select id="test2">
          <option value="" disabled hidden>
            Choose here
          </option>
          <optgroup label="Scripts">
            <option>jQuery.js</option>
            <option imgsize="l">ui.jQuery.js</option>
          </optgroup>
          <optgroup label="Other files">
            <option disabled>Some unknown file</option>
            <option disabled>
              Some other file with a very long option text
            </option>
            <option disabled>Some other le with a very long option text</option>
          </optgroup>
        </select>
      </SelectMenu>
    </>
  );
});
