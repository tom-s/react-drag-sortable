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

ReactDOM.render(<DragSortableList className="test1" items={list} onSort={onSort} type="vertical"/>, document.getElementById('example1'));
ReactDOM.render(<DragSortableList className="test2" items={listHorizontal} dropBackTransitionDuration={0.3} placeholder={placeholder} onSort={onSort} type="horizontal"/>, document.getElementById('example2'));
