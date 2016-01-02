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
        /*
        var draggableChildrenSelector = '#' + this.ref + '> .draggable';
        interact(draggableChildrenSelector).draggable({
            onmove: _.bind(this._dragMove, this),
            onend: _.bind(this._dragEnd, this)
        });*/
        this._initItems(this.props);
    }

    componentWillReceiveProps(newProps) {
        this._initItems(newProps);
    }

    _initItems(props) {
        var items = _.map(props.items, (item, i) => {
            item.rank = i;
            item.id = (item.id) ? item.id : _.uniqueId();
        });
        this.setState({
            items: props.items
        });
    }

    render() {
        console.log("render");
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
            <div id={this.ref} className="List" ref={this.ref}  onDragOver={_.bind(this._dragMove, this)}>
                {listItems}
            </div>
        );
    }

    _displayItem(item, type) {
        var placeholder = (this.props.placeholder) ? this.props.placeholder : item.content;
        var key = 'item-' + item.id;
        var style = {
            float: (this.props.type === 'horizontal' || this.props.type === 'grid') ? 'left' : 'none'
        };
        var classNames = 'draggable';
        classNames += (item.classes) ? ' ' + item.classes.join(' ') : '';

        if(type === 'normal' || type === 'dragged') {
            if(type === 'dragged') {
                //style['display'] = 'none';
            }
            return (
                <div draggable="true"  onDragStart={_.bind(this._dragStart, this)} onDragEnd={_.bind(this._dragEnd, this)} style={style} data-id={item.id} data-rank={item.rank} ref={key} key={key} className={classNames}>{item.content}</div>
            );
        }

        if(type === 'placeholder') {
            style.width = this.state.dragging.width; // set with and height
            style.height = this.state.dragging.height;
            classNames += ' placeholder';
            return (
                <div ref={this.ref + 'placeholder'} key={'placeholder'} className={classNames} style={style}>
                    {placeholder}
                </div>
            );
        }
    }

    _dragStart(event) {
        console.log("drag start");
        var target = event.target;
        
        var dragId =  target.getAttribute('data-id');

        // Dragging has just started, store original position
        var dragData = {
            id: dragId,
            top: target.offsetTop - parseInt(getStyle(target, 'margin-top'), 10),
            left: target.offsetLeft - parseInt(getStyle(target, 'margin-left'), 10),
            width: target.offsetWidth,
            height: target.offsetHeight
        };
        event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
        var draggedCloneEl = target.cloneNode(true);
        draggedCloneEl.setAttribute('data-reactid', null);
        draggedCloneEl.style.display = 'block';
        draggedCloneEl.style.position = 'absolute';
        draggedCloneEl.style.top = '-9999px';
        draggedCloneEl.style.left = '-9999px';
        draggedCloneEl.className = draggedCloneEl.className + " dragged";
        this.refs[this.ref].appendChild(draggedCloneEl);
        event.dataTransfer.setDragImage(draggedCloneEl, 0, 0); //event.clientX - dragData.left, event.clientY - dragData.top);

        this._movePlaceholder(event);

        this.setState({
            dragging: { id: dragId }
        })
    }

    _dragMove(event) {
        console.log("drag move");

        var target = event.target;
        event.preventDefault();

        if(!this.state.dragging) {
            return false;
        }

        // Translate dragged item
        var draggedEl = this.refs['item-' + this.state.dragging.id];
        
        if(draggedEl) {
            /*
            console.log("dragge el", draggedEl);
            draggedEl.style.display = 'block';
            draggedEl.style.position = 'absolute';
            draggedEl.style.top = this.state.dragging.top + 'px';
            draggedEl.style.left = this.state.dragging.left + 'px';
            draggedEl.style.WebkitTransition = draggedEl.style.transition = 'none'; // no transition
            draggedEl.style.webkitTransform = draggedEl.style.transform = draggedEl.style.msTransform = 'translate(' + this._draggedX + 'px, ' + this._draggedY + 'px)';
            */
            // Move placeholder
            this._movePlaceholder(event);
        }
        
    }

    _dragEnd(event) {
        event.preventDefault();
        console.log("drag end");
        var items = this._moveItem();
        var draggedEl = this.refs[this.ref + 'dragged'];

        // Add transition if rank hasn't changed
        var draggedBefore = _.find(this.state.items, {id: this.state.dragging.id});
        var draggedAfter = _.find(items, {id: this.state.dragging.id});

        if(draggedBefore.rank === draggedAfter.rank && this.props.dropBackTransitionDuration) {
          draggedEl.style.WebkitTransition = draggedEl.style.transition = 'all ' + this.props.dropBackTransitionDuration + 's'; // no transition
        }

        // Reset style
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

        items = _.sortBy(items, (item) => {
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
        console.log("placeholder", placeholder);
        if(placeholder && placeholder.rank !== _.get(this.state.placeholder, 'rank')) {
            console.log("set state of placeholder !");
            this.setState({
                placeholder: placeholder
            });

        }
    }

   _animatePlaceholder (cb) {
        //var currentRect = target.getBoundingClientRect();

        var placeholderEl = this.ref[this.ref + 'placeholder'];
        if(placeholderEl) {
            console.log("hourra");
        }


        /*
         _css(target, 'transition', 'none');
                _css(target, 'transform', 'translate3d('
                    + (prevRect.left - currentRect.left) + 'px,'
                    + (prevRect.top - currentRect.top) + 'px,0)'
                );

                target.offsetWidth; // repaint

                _css(target, 'transition', 'all ' + ms + 'ms');
                _css(target, 'transform', 'translate3d(0,0,0)');

                clearTimeout(target.animated);
                target.animated = setTimeout(function () {
                    _css(target, 'transition', '');
                    _css(target, 'transform', '');
                    target.animated = false;
                }, ms);  */     
        if(cb && _.isFunction(cb)) cb();
    }

    _calculatePlaceholder(child, mouseX, mouseY, placeholder) {
      var scrollY =   window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      mouseY = mouseY - scrollY; // make up for bounding rect not considering scrollY
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
