// Tools
import React from 'react'
import ReactDom from 'react-dom'
import interact from 'interact.js'
import _ from 'lodash'

var findDOMNode = ReactDom.findDOMNode;

var getStyle = function (e, styleName) {
    var styleValue = "";
    if(document.defaultView && document.defaultView.getComputedStyle) {
        styleValue = document.defaultView.getComputedStyle(e, "").getPropertyValue(styleName);
    }
    else if(e.currentStyle) {
        styleName = styleName.replace(/\-(\w)/g, function (strMatch, p1) {
            return p1.toUpperCase();
        });
        styleValue = e.currentStyle[styleName];
    }
    return styleValue;
}

class DragSortableList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            placeholder: null, // target item (being dragged over)
            dragging: null, // dragged item (being dragged),
            items: []
        };
        this.ref = 'List' + _.uniqueId(); // generate ref
    }

    componentDidMount() {
        var draggableChildrenSelector = '#' + this.ref + '> .draggable';
        interact(draggableChildrenSelector).draggable({
            onmove: _.bind(this._dragMove, this),
            onend: _.bind(this._dragEnd, this)
        });
        this._initItems(this.props);
    }

    componentWillReceiveProps(newProps) {
        this._initItems(newProps);
    }

    _initItems(props) {
        var items = _.map(props.items, function(item, i) {
            item.rank = i;
            item.id = (item.id) ? item.id : _.uniqueId();
        });
        this.setState({
            items: props.items
        });
    }

    render() {
        var listItems = _.clone(this.state.items, true);
        var draggedItem = null;

         // Add drag target
        if(this.state.placeholder) {
            // Save dragged item
            _.forEach(listItems, (item) => {
                if(this.state.dragging && item.id === this.state.dragging.id) {
                    draggedItem = item; // store it for display
                }
            });

            // Add placeholder
            listItems.push(
                {
                    rank: this.state.placeholder.rank,
                    placeholder: draggedItem
                }
            );

            // Sort list
            listItems = _.sortBy(listItems, (item) => {
                return item.rank;
            });
        }

        var listItems = listItems.map((item) => {
            if(item.placeholder) {
                return this._displayItem(item.placeholder, 'placeholder');
            } else {
                var type = (draggedItem === item) ? 'dragged' : 'normal';
                return this._displayItem(item, type);
            }
        });

        return (
            <div>
                <div id={this.ref} className="List" ref={this.ref}>
                    {listItems}
                </div>
            </div>
        );
    }

    _displayItem(item, type) {
        var placeholder = (this.props.placeholder) ? this.props.placeholder : item.content;
        var key = 'item-' + item.id;
        var style = {
            position: 'relative',
            float: (this.props.type === 'horizontal' || this.props.type === 'grid') ? 'left' : 'none'
        };
        var classNames = 'draggable';
        classNames += (item.classes) ? ' ' + item.classes.join(' ') : '';

        if(type === 'normal') {
            return (
                <div style={style} data-id={item.id} data-rank={item.rank} ref={key} key={key} className={classNames}>{item.content}</div>
            );
        }

        if(type === 'dragged') {
          style['display'] = 'none'; // to avoid flicker effect when translate happens
          style['zIndex'] = 10; // make sur it is on top
          classNames += ' dragged';
          return (
                <div ref={this.ref + 'dragged'} data-id={item.id} key={key} className={classNames} style={style}>{item.content}</div>
            );
        }

        if(type === 'placeholder') {
            style.width = this.state.dragging.width; // set with and height
            style.height = this.state.dragging.height;
            classNames += ' placeholder';
            return (
                <div key={'placeholder'} className={classNames} style={style}>
                    {placeholder}
                </div>
            );
        }
    }

    _dragMove(event) {
        var target = event.target;

        // Move copy of dragged element and keep the dragged position in the data-x/data-y attributes
        var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);

        // prepare future state
        var state = _.clone(this.state, true);
        var dragId =  target.getAttribute('data-id');
        state.dragging = (state.dragging) ? state.dragging : { id: dragId };
        var draggedEl = this.refs[this.ref + 'dragged'];

        // If dragging has already been started
        if(draggedEl && state.dragging) {
            // Translate dragged item
            draggedEl.style.display = 'block';
            draggedEl.style.position = 'absolute';
            draggedEl.style.top = state.dragging.top + 'px';
            draggedEl.style.left = state.dragging.left + 'px';
            draggedEl.style.WebkitTransition = draggedEl.style.transition = 'none'; // no transition
            draggedEl.style.webkitTransform = draggedEl.style.transform = draggedEl.style.msTransform = 'translate(' + x + 'px, ' + y + 'px)';
        } else {
            // Dragging has just started, store original position
            state.dragging.top = target.offsetTop - parseInt(getStyle(target, 'margin-top'), 10);
            state.dragging.left = target.offsetLeft - parseInt(getStyle(target, 'margin-left'), 10);
            state.dragging.width = target.offsetWidth;
            state.dragging.height = target.offsetHeight;
        }

        // Update state if necessary and move placeholder
        if(!this.state.dragging) {
          this.setState(state, () => {
              this._movePlaceholder(event);
          });
        } else {
            this._movePlaceholder(event);
        }
    }

    _dragEnd(event) {
        var items = this._moveItem();
        var draggedEl = this.refs[this.ref + 'dragged'];

        // Add transition if rank hasn't changed
        var draggedBefore = _.find(this.state.items, {id: this.state.dragging.id});
        var draggedAfter = _.find(items, {id: this.state.dragging.id});

        if(draggedBefore.rank === draggedAfter.rank && this.props.dropBackTransitionDuration) {
          draggedEl.style.WebkitTransition = draggedEl.style.transition = 'all ' + this.props.dropBackTransitionDuration + 's'; // no transition
        }

        // Reset style
        console.log("drag end");
        draggedEl.style.display =  null;
        draggedEl.style.position = 'static';
        draggedEl.style.top = null;
        draggedEl.style.left = null;
        draggedEl.style.webkitTransform = draggedEl.style.transform = draggedEl.style.msTransform = 'none';
        draggedEl.setAttribute('data-x', 0);
        draggedEl.setAttribute('data-y', 0);

        // Update rank
        this.setState({
            dragging: null,
            placeholder: null,
            items: items
        });

        if(this.props.onSort && _.isFunction(this.props.onSort)) {
            this.props.onSort(items);
        }
    }

    _moveItem() {
        var items = _.clone(this.state.items, true);

        // Replace dragged item rank
        var dragged = _.find(items, {id: this.state.dragging.id});
        dragged.rank = this.state.placeholder.rank;

        items = _.sortBy(items, function(item) {
            return item.rank;
        });

        // Normalize items ranks
        var rank = 0;
        items = _.forEach(items, (item) => {
            item.rank = rank;
            rank++;
        });

        return items;
    }

    _movePlaceholder(e) {
        var list = this.refs[this.ref];
        var mouseX = e.pageX;
        var mouseY = e.pageY;
        var children = _.filter(list.childNodes, (child) => {
            return !!(child.getAttribute('data-rank'));
        });

        // Find placeholder
        var placeholder = null;
        _.forEach(children, (child) => {
            placeholder = this._calculatePlaceholder(child, mouseX, mouseY, placeholder);
        });

        // Update state if necessary
        if(placeholder && placeholder.rank !== _.get(this.state.placeholder, 'rank')) {
          this.setState({
              placeholder: placeholder
          });
        }
    }

    _calculatePlaceholder(child, mouseX, mouseY, placeholder) {
      mouseY = mouseY - window.scrollY; // make up for bounding rect not considering scrollY
      var position = child.getBoundingClientRect();
      var childX = (position.left + child.offsetWidth / 2);
      var childY = (position.top + child.offsetHeight / 2)
      var distanceX = mouseX - childX;
      var distanceY = mouseY - childY;

      if(this.props.type === 'grid') {
        // Skip if not on the same line
        if(mouseY < position.top || mouseY > (position.top + child.offsetHeight)) {
          return placeholder;
        }
        var distance = Math.abs(distanceX);
        var difference = distanceX;
        var rank =  parseInt(child.getAttribute('data-rank'), 10);
      } else {
        var distance = (this.props.type === 'vertical') ? Math.abs(distanceY) : Math.abs(distanceX);
        var difference = (this.props.type === 'vertical') ?  distanceY : distanceX;
      }

      if(!placeholder || distance < placeholder.distance) {
          var position = (difference > 0) ? 'after' : 'before';
          var rank = parseInt(child.getAttribute('data-rank'), 10);
          rank += (position === 'before') ? -0.5 : 0.5;

          placeholder = {
              rank: rank,
              distance: distance
          };
      }

      return placeholder;
    }
};



// Props
DragSortableList.propTypes = {
    items: React.PropTypes.array,
    type: React.PropTypes.string,
    dropBackTransitionDuration: React.PropTypes.number
};
DragSortableList.defaultProps = {
    items: [],
    type: 'vertical', //horizontal
    dropBackTransitionDuration: null
};

export default DragSortableList;
