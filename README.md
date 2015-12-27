Sortable (by drag and drop) list React Component with auto width
===

## Installation

```bash
npm install react-drag-sortable
```

## Description

Make a list of elements (array) sortable by drag and drop. While dragging, a customizable placeholder is displayed on the drop area.
The component supports both horizontal and vertical lists. The component uses interact.js for crossbrowser dragging (see hhttp://interactjs.io/ for more details).
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
<DragSortableList items={list} placeholder={placeholder} onSort={onSort} type="vertical"/>
```

You can pass the following properties:
- items: array of items to order. Each item must be an object with a content property. For instance : 
```bash
 var list = [
    {content: (<div className="test">test1</div>)}, 
    {content: (<div className="test">test2</div>)}, 
    {content: (<div className="test">test3</div>)}, 
    {content: (<div className="test">test4</div>)}];
```
- type: 'vertical' or 'horizontal'
- placeholder: content to display on drag target. For instance:
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

The list elements's containers have the class .draggable
The element being dragged has the class .dragged while it's being dragged

For instance, you can customize the style :

```bash
.draggable {
    background-color: yellow;
    margin: 10px;
}

.dragged {
    opacity: 0.7;
}
```

You will find more complex examples of styling in the example folder.

## Example

```bash
require('./stylesheets/styles.scss');

import React from 'react'
import ReactDOM from 'react-dom'

// Components
import DragSortableList from 'react-sortable-list'

var placeholder = (
    <div className="placeholder">PLACEHOLDER</div>
);

 var list = [
    {content: (<div className="test bigger">test1</div>)}, 
    {content: (<div className="test">test2</div>)}, 
    {content: (<div className="test bigger">test3</div>)}, 
    {content: (<div className="test">test4</div>)}];

 var onSort = function(newOrder) {
    console.log("new order", newOrder);
 }

ReactDOM.render(<DragSortableList items={list} placeholder={placeholder} onSort={onSort} type="vertical"/>, document.getElementById('main'));
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
