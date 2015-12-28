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

ReactDOM.render(<DragSortableList items={list} onSort={onSort} type="vertical"/>, document.getElementById('example1'));
ReactDOM.render(<DragSortableList items={listHorizontal} dropBackTransitionDuration={0.3} placeholder={placeholder} onSort={onSort} type="horizontal"/>, document.getElementById('example2'));
ReactDOM.render(<DragSortableList items={listGrid} dropBackTransitionDuration={0.3} onSort={onSort} type="grid"/>, document.getElementById('example3'));
