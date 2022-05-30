# SelectMenu

SelectMenu transforms the default `<select>` element into a customizable control. The original `<select>` element's state is maintained for form submission.

To use it you need to wrap your `<select>` (**with an id**) with `<option>`/`<optgroup>` elements in the `<SelectMenu>` component.

# Installation

# Example

`<SelectMenu selectId="example" label="Example" size={5} theme="dark" disabled>`
&emsp;&emsp;`<optgroup label="Optgroup">`
&emsp;&emsp;&emsp;&emsp;`<option disabled>Option 1</option>`
&emsp;&emsp;&emsp;&emsp;`<option imgsrc={logo} imgsize="s">option 2</option>`
&emsp;&emsp;`</optgroup>`
`</SelectMenu>`

`<select>` and `<option>` can be disabled by adding a disabled attribute

## **Props of the `<SelectMenu>` component :**

- **theme**: theme of the `<SelectMenu>` component, default: "default", "light" or "dark" / _optional_

## **Attributes of the `<option>` element :**

- **imgsrc**: source of an icon/picture / _optional_
- **imgsize**: size: “s”, “m”(default) or “l” when an imgsrc is specified / _optional_

## **Keyboard interaction**

- UP or LEFT: Move focus to the previous option.
- DOWN or RIGHT: Move focus to the next option.
- END or PAGE DOWN: Move to the last option.
- HOME or PAGE UP: Move to the first option.
- SPACE or ALT/OPTION + DOWN: Open the menu.
- ESCAPE or ALT/OPTION + UP: Close the menu.
- ENTER or SPACE: Select the currently focused option and close the menu.

## Style

You can easily change the style directly in the styles.css file
