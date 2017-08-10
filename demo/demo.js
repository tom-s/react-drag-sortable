require('./stylesheets/styles.scss')

import React from 'react'
import ReactDOM from 'react-dom'

// Components
import DragSortableList from '../src/index'

const placeholder = (
	<div className="placeholderContent"> DROP HERE ! </div>
)

const list = [
 	{content: (<span>test1</span>), classes:['test', 'bigger']},
 	{content: (<span>test2</span>), classes:['test']},
 	{content: (<span>test3</span>), classes:['test']},
 	{content: (<span>test4</span>), classes:['test', 'bigger']}
]

const listHorizontal = [
 	{content: (<div>test1</div>), classes:['bigger']},
 	{content: (<div>test2</div>)},
 	{content: (<div>test3</div>), classes:['bigger']},
 	{content: (<div>test4</div>)}
]

const listGrid = [
	{content: (<div>test1</div>)},
 	{content: (<div>test2</div>)},
 	{content: (<div>test3</div>)},
	{content: (<div>test4</div>)},
	{content: (<div>test5</div>)},
	{content: (<div>test6</div>)},
	{content: (<div>test7</div>)},
	{content: (<div>test8</div>)},
 	{content: (<div>test9</div>)}
]

const listWithNoDrag = [
	{content: (<div>test1<input type='text' className='no-drag'/></div>)},
 	{content: (<div>test2<input type='text' className='no-drag'/></div>)},
 	{content: (<div>test3<input type='text' className='no-drag'/></div>)},
]

const listWithLinks = [
 	{content: (<a href='http://www.google.fr'>google</a>), classes:['test', 'bigger']},
 	{content: (<a href='http://www.yahoo.fr'>yahoo</a>), classes:['test']},
 	{content: (<a href='http://www.thomschell.com'>my website</a>), classes:['test']},
]

const onSort = (sortedList, dropEvent) => {
  console.log("sortedList", sortedList, dropEvent);
}

ReactDOM.render(<DragSortableList items={list} moveTransitionDuration={0.3} onSort={onSort} type="vertical"/>, document.getElementById('example1'))
ReactDOM.render(<DragSortableList items={listHorizontal} moveTransitionDuration={0.3} dropBackTransitionDuration={0.3} placeholder={placeholder} onSort={onSort} type="horizontal"/>, document.getElementById('example2'))
ReactDOM.render(<DragSortableList items={listGrid} dropBackTransitionDuration={0.3} onSort={onSort} type="grid"/>, document.getElementById('example3'))
ReactDOM.render(<DragSortableList items={listWithNoDrag} dropBackTransitionDuration={0.3} onSort={onSort}/>, document.getElementById('example4'))
/*
	ReactDOM.render(<DragSortableList items={listWithLinks} dropBackTransitionDuration={0.3} onSort={onSort} type="grid"/>, document.getElementById('example4'))
*/
