import React from 'react';
import SelectCover from './SelectCover';

export default class SelectMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectHide: false };
  }

  componentDidMount() {
    this.changeSelect();
  }

  changeSelect() {
    const select = document.getElementById(this.props.id);
    /* select.style.display = 'none'; */ // Hide initial select
    this.setState({
      selectHide: true, // Set selectHide to true to display the custom select
    });
  }

  render() {
    const selectId = this.props.id;
    const label = this.props.label;
    const getOptions = this.props.children; // Get all select options insert as children in SelectMenu component
    let options = []; // Init options
    getOptions.forEach((option) => {
      const optgroup = option.type === 'optgroup'; // Check if it's an optgroup
      options.push(
        // Add to options array : optgroup and option
        optgroup
          ? {
              name: option.props.label,
              type: option.type,
              options: option.props.children,
            }
          : {
              name: option.props.children,
              type: option.type,
              imgsrc: option.props.imgsrc,
              disabled: option.props.disabled,
            }
      );
    });

    return (
      <>
        <label className="label" htmlFor={`${selectId}-button`}>
          {label}
        </label>
        <select
          id={selectId}
          name={selectId}
          size={this.props.size}
          disabled={this.props.disabled}
        >
          {this.props.children}
        </select>
        {this.state.selectHide && (
          <SelectCover options={options} selectId={selectId} />
        )}
      </>
    );
  }
}
