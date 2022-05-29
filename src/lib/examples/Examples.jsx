import SelectMenu from '../SelectMenu';
import { states } from './selectOptions';
import testImg from '../test.png';

export default function Examples() {
  const styles = {
    wrapper: {
      width: '256px',
      height: '300px',
      margin: '100px auto',
    },
    div: {
      marginTop: '50px',
    },
  };
  return (
    <div style={styles.wrapper}>
      <div style={styles.div}>
        <SelectMenu selectId="state" label="States" size={5}>
          {states.map((state, i) => (
            <option key={state.name + i}>{state.name}</option>
          ))}
        </SelectMenu>
      </div>
      <div style={styles.div}>
        <SelectMenu selectId="state2" label="States2">
          {states.map((state, i) => (
            <option key={state.name + i}>{state.name}</option>
          ))}
        </SelectMenu>
      </div>
      <div style={styles.div}>
        <SelectMenu selectId="speed" label="Speed">
          <option imgsrc={testImg} imgsize="s" disabled>
            Slower
          </option>
          <option imgsrc={testImg} imgsize="m" disabled>
            Slow
          </option>
          <option imgsrc={testImg} imgsize="l">
            Medium
          </option>
          <option disabled>Fast</option>
          <option>Faster</option>
        </SelectMenu>
      </div>
      <div style={styles.div}>
        <SelectMenu selectId="files" label="Files">
          <optgroup label="Scripts">
            <option>jQuery.js</option>
            <option imgsrc={testImg} imgsize="l">
              ui.jQuery.js
            </option>
          </optgroup>
          <optgroup label="Other files">
            <option imgsrc={testImg} imgsize="s" disabled>
              Some unknown file
            </option>
            <option disabled>
              Some other file with a very long option text
            </option>
            <option disabled>Some other le with a very long option text</option>
          </optgroup>
        </SelectMenu>
      </div>
      <div style={styles.div}>
        <SelectMenu selectId="no-option" label="Empty select"></SelectMenu>
      </div>
    </div>
  );
}
