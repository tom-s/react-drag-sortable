require('./stylesheets/styles.scss');

import React from 'react'
import ReactDOM from 'react-dom'

// Components
import DragSortableList from '../src/dragSortableList.jsx'

var placeholder = (
	<div className="placeholder">CUSTOM PLACEHOLDER</div>
);

var placeholder2 = (
	<div className="placeholder2">another custom placeholder</div>
);


var list = [
 	{content: (<div className="test bigger">test1</div>)}, 
 	{content: (<div className="test">test2</div>)}, 
 	{content: (<div className="test bigger">test3</div>)}, 
 	{content: (<div className="test">test4</div>)}];

var listHorizontal = [
 	{content: (<div className="test">test1</div>)}, 
 	{content: (<div className="test">test2</div>)}, 
 	{content: (<div className="test bigger">test3</div>)}, 
 	{content: (<div className="test">test4</div>)}];

 var onSort = function(sortedList) {
 	console.log("sortedList", sortedList);
 }

ReactDOM.render(<DragSortableList items={list} placeholder={placeholder} onSort={onSort} type="vertical"/>, document.getElementById('example1'));
ReactDOM.render(<DragSortableList items={listHorizontal} placeholder={placeholder2} onSort={onSort} type="horizontal"/>, document.getElementById('example2'));

