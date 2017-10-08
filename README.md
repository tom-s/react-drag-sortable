Sortable (by drag and drop) list React Component with auto width
===

## Please note I don't maintain this project anymore, as I think there are now better alternatives out there


## Installation

```sh
npm install react-drag-sortable
```

## Description

Make a list of elements (array) sortable by drag and drop. Allows to specify a customizable placeholder to be displayed on the drop area.
Allows to customize the style of items at every step (normal, being dragged, placeholder).
The component supports both horizontal and vertical lists. The component uses interact.js for crossbrowser dragging (see [http://interactjs.io](http://interactjs.io/) for more details).
Works with items of variables width (in %)  as well as static width.

SUPPORTS IOS AND TOUCH GESTURES (tested on ipad and safari)

## Demo

[Here](http://experiments.thomschell.com/react-drag-sortable/demo/build/)

## Usage

Import the component :

```js
import DragSortableList from 'react-drag-sortable'
```

Use the component :
```jsx
<DragSortableList items={list} placeholder={placeholder} onSort={onSort} dropBackTransitionDuration={0.3} type="vertical"/>
<DragSortableList items={list} onSort={onSort} type="horizontal"/>
```

You can pass the following properties:
- items: array of items to sort. Each item must be an object with a content property. You can optionally pass an array of classes that will be added to the item. For instance :
```jsx
 var list = [
    {content: (<div>test1</div>), classes:['bigger']},
    {content: (<div>test2</div>)},
    {content: (<div>test3</div>), classes:['bigger']},
    {content: (<div>test4</div>)}
];
```
- type: 'vertical', 'horizontal' or 'grid'
- moveTransitionDuration (number): if a duration is provided, items will animate when they move on drag. The CSS animation's duration is the number provided.
- dropBackTransitionDuration (number): if a duration is provided, the dragged item will go back to its original position when not dropped on a different target. The CSS animation's duration is the number provided.
- placeholder: content to display on drag target. If you don't pass a placeholder, a copy of the dragged item will be displayed. For instance:
```jsx
var placeholder = (
    <div className="placeholderContent">PLACEHOLDER</div>
);
```
- callback function called on drop (when list is sorted). Takes the new sorted list and the latest drop Event as arguments. For instance:
```js
 var onSort = function(sortedList, dropEvent) {
    console.log("sortedList", sortedList, dropEvent);
 }
```
```jsx
ReactDOM.render(<DragSortableList items={list} placeholder={placeholder} onSort={onSort} type="vertical"/>, document.getElementById('main'));
```

## Style

The list elements all have a class .draggable
The element being dragged has a class .dragged while it's being dragged
The placeholder has a class .placeholder

For instance, you can customize the style :

```css
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

## no-drag

You can prevent an element of being draggable by adding the class "no-drag". This examples contains a list where the texts are draggable but not the inputs.

```js
const listWithNoDrag = [
	{content: (<div>test1<input type='text' className='no-drag'/></div>)},
 	{content: (<div>test2<input type='text' className='no-drag'/></div>)},
 	{content: (<div>test3<input type='text' className='no-drag'/></div>)},
]
ReactDOM.render(<DragSortableList items={listWithNoDrag} onSort={onSort}/>, document.getElementById('main'));
```


## Full example

```jsx
require('./stylesheets/styles.scss');

import React from 'react'
import ReactDOM from 'react-dom'

// Components
import DragSortableList from '../src/dragSortableList.jsx'

var placeholder = (
	<div className="placeholderContent"> DROP HERE ! </div>
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

var listGrid = [
	{content: (<div>test1</div>)},
 	{content: (<div>test2</div>)},
 	{content: (<div>test3</div>)},
	{content: (<div>test4</div>)},
	{content: (<div>test5</div>)},
	{content: (<div>test6</div>)},
	{content: (<div>test7</div>)},
	{content: (<div>test8</div>)},
 	{content: (<div>test9</div>)}
];

 var onSort = function(sortedList) {
 	console.log("sortedList", sortedList);
 }

ReactDOM.render(<DragSortableList items={list} moveTransitionDuration={0.3} onSort={onSort} type="vertical"/>, document.getElementById('example1'));
ReactDOM.render(<DragSortableList items={listHorizontal} moveTransitionDuration={0.3} dropBackTransitionDuration={0.3} placeholder={placeholder} onSort={onSort} type="horizontal"/>, document.getElementById('example2'));
ReactDOM.render(<DragSortableList items={listGrid} dropBackTransitionDuration={0.3} onSort={onSort} type="grid"/>, document.getElementById('example3'));
```

The example (containing both vertical and horizontal lists along with more complex styling) can be found in the demo folder and run using webpack with
```sh
npm run dev
```

## Tests

These will be added soon. Please do not hesitate to add some !

## About the Author

I am a full-stack Javascript developer based in Lyon, France.

[Check out my website](http://www.thomschell.com)

## License

react-drag-sortable is dual licensed under the MIT license and GPL.
For more information click [here](https://opensource.org/licenses/MIT).
