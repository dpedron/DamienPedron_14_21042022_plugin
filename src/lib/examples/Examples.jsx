import SelectMenu from '../SelectMenu';
import { states } from './selectOptions';
import testImg from '../test.png';
import '../styles.css';

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
        <SelectMenu id="state" label="States" size={5}>
          {states.map((state, i) => (
            <option key={state + i}>{state.name}</option>
          ))}
        </SelectMenu>
      </div>
      <div style={styles.div}>
        <SelectMenu id="state2" label="States2">
          {states.map((state, i) => (
            <option key={state + i}>{state.name}</option>
          ))}
        </SelectMenu>
      </div>
      <div style={styles.div}>
        <SelectMenu id="speed" label="Speed">
          <option imgsrc={testImg}>Slower</option>
          <option>Slow</option>
          <option>Medium</option>
          <option>Fast</option>
          <option>Faster</option>
        </SelectMenu>
      </div>
      <div style={styles.div}>
        <SelectMenu id="files" label="Files">
          <optgroup label="Scripts">
            <option>jQuery.js</option>
            <option>ui.jQuery.js</option>
          </optgroup>
          <optgroup label="Other files">
            <option>Some unknown file</option>
            <option>Some other file with a very long option text</option>
          </optgroup>
        </SelectMenu>
      </div>
    </div>
  );
}
