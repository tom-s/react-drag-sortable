Sortable (by drag and drop) list React Component with auto width
===

## Installation

```bash
npm install react-drag-sortable
```

## Description

Make a list of elements (array) sortable by drag and drop. While dragging, a customizable placeholder is displayed on the drop area.
The component supports both horizontal and vertical lists. The component uses interact.js for crossbrowser dragging (see [http://interactjs.io](http://interactjs.io/) for more details).
The specificity of this component is that it will automatically adapt to your items width and height (no 100% width placeholders anymore).

SUPPORTS IOS AND TOUCH GESTURES (tested on ipad and safari)

## Demo

[Here](http://experiments.thomschell.com/react-drag-sortable/demo/dist)

## Usage

Import the component :

```bash
import DragSortableList from 'react-sortable-list'
```

Use the component :
```bash
<DragSortableList items={list} placeholder={placeholder} onSort={onSort} dropBackTransitionDuration={0.3} type="vertical"/>
<DragSortableList items={list} onSort={onSort} type="horizontal"/>
```

You can pass the following properties:
- items: array of items to sort. Each item must be an object with a content property. You can optionally pass an array of classes that will be added to the item. For instance :
```bash
 var list = [
    {content: (<div>test1</div>), classes:['bigger']},
    {content: (<div>test2</div>)},
    {content: (<div>test3</div>), classes:['bigger']},
    {content: (<div>test4</div>)}
];
```
- type: 'vertical' or 'horizontal'
- dropBackTransitionDuration (number): if a duration is provided, the dragged item will go back to its original position when not dropped on a different target. The CSS animation's duration is the number provided.
- placeholder: content to display on drag target. If you don't pass a placeholder, a copy of the dragged item will be displayed. For instance:
```bash
var placeholder = (
    <div className="placeholder">PLACEHOLDER</div>
);
```
- callback function called on drop (when list is sorted). Takes the new sorted list as argument. For instance:
```bash
 var onSort = function(sortedList) {
    console.log("sortedList", sortedList);
 }
```
```bash
ReactDOM.render(<DragSortableList items={list} placeholder={placeholder} onSort={onSort} type="vertical"/>, document.getElementById('main'));
```

## Style

The list elements all have a class .draggable
The element being dragged has a class .dragged while it's being dragged
The placeholder has a class .placeholder

For instance, you can customize the style :

```bash
.draggable {
    background-color: yellow;
    margin: 10px;
}

.dragged {
    opacity: 0.7;
}

.placeholder {
  opacity: 0.5;
}
```
You can mix your custom classes ("classes" property in items list) with these classes for powerful styling.
You will find more complex examples of styling in the example folder.

## Full example

```bash
require('./stylesheets/styles.scss');

import React from 'react'
import ReactDOM from 'react-dom'

// Components
import DragSortableList from '../src/dragSortableList.jsx'

var placeholder = (
	<div className="placeholderContent"> CUSTOM CONTENT! </div>
);

var list = [
 	{content: (<span>test1</span>), classes:['test', 'bigger']},
 	{content: (<span>test2</span>), classes:['test']},
 	{content: (<span>test3</span>), classes:['test']},
 	{content: (<span>test4</span>), classes:['test', 'bigger']}
];

var listHorizontal = [
 	{content: (<div>test1</div>), classes:['bigger']},
 	{content: (<div>test2</div>)},
 	{content: (<div>test3</div>), classes:['bigger']},
 	{content: (<div>test4</div>)}
];

 var onSort = function(sortedList) {
 	console.log("sortedList", sortedList);
 }

ReactDOM.render(<DragSortableList className="test1" items={list} onSort={onSort} dropBackTransitionDuration={0.3} type="vertical"/>, document.getElementById('example1'));
ReactDOM.render(<DragSortableList className="test2" items={listHorizontal} placeholder={placeholder} onSort={onSort} type="horizontal"/>, document.getElementById('example2'));
```

The example (containing both vertical and horizontal lists along with more complex styling) can be found in the demo folder and run using webpack with
```bash
npm run dev
```

## Tests

These will be added soon. Please do not hesitate to add some !

## About the Author

I am a full-stack Javascript developer based in Lyon, France.

[Check out my website](http://www.thomschell.com)

## License

react-sortable-list is dual licensed under the MIT license and GPL.
For more information click [here](https://opensource.org/licenses/MIT).
