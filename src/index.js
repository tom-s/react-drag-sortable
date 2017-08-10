// Tools
import React from 'react'
import ReactDom from 'react-dom'
import interact from 'interactjs'
import clone from 'lodash/clone'
import isFunction from 'lodash/isFunction'
import sortBy from 'lodash/sortBy'
import get from 'lodash/get'
import uniqueId from 'lodash/uniqueId'
import bind from 'lodash/bind'
import union from 'lodash/union'
import PropTypes from 'prop-types'

const findDOMNode = ReactDom.findDOMNode

const getStyle = (e, styleName) => {
  let styleValue = ''
  if (document.defaultView && document.defaultView.getComputedStyle) {
    styleValue = document.defaultView.getComputedStyle(e, '').getPropertyValue(styleName)
  } else if(e.currentStyle) {
    styleName = styleName.replace(/\-(\w)/g, (strMatch, p1) =>  p1.toUpperCase())
    styleValue = e.currentStyle[styleName]
  }
  return styleValue
}

let _positions = {}

class DragSortableList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      placeholder: null, // target item (being dragged over)
      dragging: null, // dragged item (being dragged),
      items: []
    }
    this.ref = 'List' + uniqueId() // generate unique ref
  }

  componentDidMount() {
    const draggableChildrenSelector = '#' + this.ref + '> .draggable'
    const ignoreNoDrag = fun => event => {
      const mouseElement = document.elementFromPoint(event.clientX, event.clientY)
      if(mouseElement && !mouseElement.classList.contains('no-drag')) {
        fun(event)
      } else {
        interact.stop(event)
      }
    }
    interact(draggableChildrenSelector).draggable({
      onmove: ignoreNoDrag(this._dragMove.bind(this)),
      onend: ignoreNoDrag(this._dragEnd.bind(this)),
    }).styleCursor(false)
    this._initItems(this.props);
  }

  componentWillReceiveProps(newProps) {
    this._initItems(newProps)
  }

  componentWillUpdate(nextProps, nextState) {
    // Store positions for animation
    const { moveTransitionDuration } = this.props
    const { items } = this.state
    if(moveTransitionDuration) {
      const itemsRefs = union(['placeholder'], items.map(item => 'item-' + item.id))
      itemsRefs.forEach(itemRef => {
        const el = this.refs[this.ref  + itemRef]
        if(el) {
          _positions[itemRef] = {
            left: el.offsetLeft,
            top:  el.offsetTop
          }
        }
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { moveTransitionDuration } = this.props
    const { items } = this.state

    if(moveTransitionDuration) {
      const placeholderEl = this.refs[this.ref  + "placeholder"]
      if(placeholderEl && get(prevState, 'placeholder.rank') && get(prevState, 'placeholder.rank') !== get(this.state, 'placeholder.rank')) {
        const itemsRefs = union(['placeholder'], items.map(item => 'item-' + item.id))
        const instructions = {
          transitions: [],
          transforms: []
        }
        itemsRefs.forEach(itemRef => {
          const el = this.refs[this.ref + itemRef]
          if(el) {
            const x = _positions[itemRef].left - el.offsetLeft
            const y = _positions[itemRef].top - el.offsetTop
            el.style.webkitTransform = el.style.transform = el.style.msTransform = 'translate(' + x + 'px, ' + y + 'px)' // move back to former position
            instructions.transitions.push(() => {el.style.WebkitTransition = el.style.transition = 'transform ' + moveTransitionDuration + 's'})
            instructions.transforms.push(() => {el.style.webkitTransform = el.style.transform = null})
          }
        })

        // Add all transitions and remove transforms
        window.setTimeout(() => {
          instructions.transitions.forEach(instruction => {
            instruction()
          })
          instructions.transforms.forEach(instruction => {
            instruction()
          })
        }, 100) // give it some time to make sure transform has been applied
      }
    }
  }

  _initItems(props) {
    const { items } = props
    const newItems = items.map((item, i) => {
      item.rank = i
      item.id = (item.id) ? item.id : uniqueId()
      return item
    })
    this.setState({
      items: newItems
    })
  }

  render() {
    const { placeholder, dragging, items } = this.state
    let listItems = clone(items, true)
    let draggedItem = null

    // Add drag target
    if(placeholder) {
      // Save dragged item
      listItems.forEach(item => {
        if(dragging && item.id === dragging.id) {
          draggedItem = item // store it for display
        }
      })

      // Add placeholder
      listItems.push(
        {
          rank: placeholder.rank,
          placeholder: draggedItem
        }
      )

      // Sort list
      listItems = sortBy(listItems, (item) => item.rank)
    }

    const itemsNodes = listItems.map(item => {
      if(item.placeholder) {
        return this._displayItem(item.placeholder, 'placeholder')
      } else {
        const type = (draggedItem === item) ? 'dragged' : 'normal'
        return this._displayItem(item, type)
      }
    })

    return (
      <div id={this.ref} className="List" ref={this.ref}>
        {itemsNodes}
      </div>
    )
  }

  _displayItem(item, type) {
    const { type: layoutType } = this.props
    const { id, content, classes, rank } = item
    const { dragging } = this.state
    const placeholder = this.props.placeholder || content
    const key = 'item-' + id
    let style = {
      position: 'relative',
      float: (layoutType === 'horizontal' || layoutType === 'grid') ? 'left' : 'none'
    }
    let classNames = 'draggable'
    classNames += (classes) ? ' ' + classes.join(' ') : ''

    if(type === 'normal') {
      return (
         <div ref={this.ref + key} style={style} data-id={id} data-rank={rank} key={key} className={classNames}>{content}</div>
      )
    }

    if(type === 'dragged') {
      style['display'] = 'none' // to avoid flicker effect when translate happens
      style['zIndex'] = 10 // make sur it is on top
      classNames += ' dragged'
      return (
         <div ref={this.ref + 'dragged'} data-id={id} key={key} className={classNames} style={style}>{content}</div>
      )
    }

    if(type === 'placeholder') {
      style.width = dragging.width // set with and height
      style.height = dragging.height
      classNames += ' placeholder'
      return (
        <div ref={this.ref + 'placeholder'} key={'placeholder'} className={classNames} style={style}>
          {placeholder}
        </div>
      )
    }
  }

  _dragMove(event) {
    const target = event.target
    const { dragging } = this.state

    // Move copy of dragged element and keep the dragged position in the data-x/data-y attributes
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)

    // prepare future state
    let state = clone(this.state, true)
    const dragId =  target.getAttribute('data-id')
    state.dragging = (state.dragging) ? state.dragging : { id: dragId }
    const draggedEl = this.refs[this.ref + 'dragged']

    // If dragging has already been started
    if(draggedEl && state.dragging) {
      // Translate dragged item
      draggedEl.style.display = 'block'
      draggedEl.style.position = 'absolute'
      draggedEl.style.top = state.dragging.top + 'px'
      draggedEl.style.left = state.dragging.left + 'px'
      draggedEl.style.WebkitTransition = draggedEl.style.transition = 'none' // no transition
      draggedEl.style.webkitTransform = draggedEl.style.transform = draggedEl.style.msTransform = 'translate(' + x + 'px, ' + y + 'px)'
    } else {
      // Dragging has just started, store original position
      state.dragging.top = target.offsetTop - parseInt(getStyle(target, 'margin-top'), 10)
      state.dragging.left = target.offsetLeft - parseInt(getStyle(target, 'margin-left'), 10)
      state.dragging.width = target.offsetWidth
      state.dragging.height = target.offsetHeight
    }

    // Update state if necessary and move placeholder
    if(!dragging) {
      this.setState(state, () => {
        this._movePlaceholder(event)
      })
    } else {
      this._movePlaceholder(event)
    }
  }

  _dragEnd(event) {
    const { onSort, dropBackTransitionDuration } = this.props
    const { dragging, items: stateItems} = this.state
    const items = this._moveItem()
    let draggedEl = this.refs[this.ref + 'dragged']

    if(!draggedEl) return

    // Add transition if rank hasn't changed
    const draggedBefore = stateItems.find(item => item.id === dragging.id)
    const draggedAfter = items.find(item => item.id === dragging.id)

    if (draggedBefore && draggedAfter && draggedBefore.rank === draggedAfter.rank && dropBackTransitionDuration) {
      draggedEl.style.WebkitTransition = draggedEl.style.transition = 'all ' + dropBackTransitionDuration + 's' // no transition
    }

    // Reset style
    draggedEl.style.display =  null
    draggedEl.style.position = 'static'
    draggedEl.style.top = null
    draggedEl.style.left = null
    draggedEl.style.webkitTransform = draggedEl.style.transform = draggedEl.style.msTransform = 'none'
    draggedEl.setAttribute('data-x', 0)
    draggedEl.setAttribute('data-y', 0)

    // Update rank
    this.setState({
      dragging: null,
      placeholder: null,
      items: items
    })

    if(onSort && isFunction(onSort)) {
      onSort(items, event)
    }
  }

  _moveItem() {
    const { items: stateItems, placeholder, dragging } = this.state
    let items = clone(stateItems, true)

    // Replace dragged item rank
    const dragged = items.find(item => item.id === dragging.id)
    if(dragged && placeholder) dragged.rank = placeholder.rank

    items = sortBy(items, (item) => {
      return item.rank
    })

    // Normalize items ranks
    let rank = 0
    items.forEach(item => {
      item.rank = rank
      rank++
    })

    return items
  }

  _movePlaceholder(e) {
    let { placeholder } = this.state
    const list = this.refs[this.ref]
    const { pageX: mouseX, pageY: mouseY } = e
    const childNodes =  [].slice.call(list.childNodes)
    const children = childNodes.filter(child => {
      return !!(child.getAttribute('data-rank'))
    })

    // Find placeholder
    let newPlaceholder
    children.forEach(child => {
      newPlaceholder = this._calculatePlaceholder(child, mouseX, mouseY, newPlaceholder)
    })

    // Update state if necessary
    if(newPlaceholder && (!placeholder || newPlaceholder.rank !== placeholder.rank)) {
      this.setState({
        placeholder: newPlaceholder
      })
    }
  }

  _calculatePlaceholder(child, mouseX, mouseY, placeholder) {
    const { type } = this.props
    const scrollY =   window.scrollY || window.pageYOffset || document.documentElement.scrollTop
    mouseY = mouseY - scrollY // make up for bounding rect not considering scrollY
    const { top, left } = child.getBoundingClientRect()
    const { offsetHeight, offsetWidth } = child
    const childX = (left + offsetWidth / 2)
    const childY = (top + offsetHeight / 2)
    const distanceX = mouseX - childX
    const distanceY = mouseY - childY
    let difference
    let distance
    let rank
    if(type === 'grid') {
      // Skip if not on the same line
      if(mouseY < top || mouseY > (top + offsetHeight)) {
        return placeholder
      }
      distance = Math.abs(distanceX)
      difference = distanceX
    } else {
      distance = (type === 'vertical') ? Math.abs(distanceY) : Math.abs(distanceX)
      difference = (type === 'vertical') ?  distanceY : distanceX
    }

    if(!placeholder || distance < placeholder.distance) {

      const pos = (difference > 0) ? 'after' : 'before'
      let rank = parseInt(child.getAttribute('data-rank'), 10)
      rank += (pos === 'before') ? -0.5 : 0.5

      placeholder = {
        rank: rank,
        distance: distance
      }
    }

    return placeholder
  }
}



// Props
DragSortableList.propTypes = {
    items: PropTypes.array,
    type: PropTypes.string,
    dropBackTransitionDuration: PropTypes.number,
    moveTransitionDuration: PropTypes.number
}
DragSortableList.defaultProps = {
    items: [],
    type: 'vertical', //horizontal
    dropBackTransitionDuration: null
}

export default DragSortableList
