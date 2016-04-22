'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _interact = require('interact.js');

var _interact2 = _interopRequireDefault(_interact);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Tools


var findDOMNode = _reactDom2.default.findDOMNode;

var getStyle = function getStyle(e, styleName) {
  var styleValue = '';
  if (document.defaultView && document.defaultView.getComputedStyle) {
    styleValue = document.defaultView.getComputedStyle(e, '').getPropertyValue(styleName);
  } else if (e.currentStyle) {
    styleName = styleName.replace(/\-(\w)/g, function (strMatch, p1) {
      return p1.toUpperCase();
    });
    styleValue = e.currentStyle[styleName];
  }
  return styleValue;
};

var _positions = {};

var DragSortableList = function (_React$Component) {
  _inherits(DragSortableList, _React$Component);

  function DragSortableList(props) {
    _classCallCheck(this, DragSortableList);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DragSortableList).call(this, props));

    _this.state = {
      placeholder: null, // target item (being dragged over)
      dragging: null, // dragged item (being dragged),
      items: []
    };
    _this.ref = 'List' + _lodash2.default.uniqueId(); // generate unique ref
    return _this;
  }

  _createClass(DragSortableList, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var draggableChildrenSelector = '#' + this.ref + '> .draggable';
      (0, _interact2.default)(draggableChildrenSelector).draggable({
        onmove: _lodash2.default.bind(this._dragMove, this),
        onend: _lodash2.default.bind(this._dragEnd, this)
      });
      this._initItems(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      this._initItems(newProps);
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      var _this2 = this;

      // Store positions for animation
      var moveTransitionDuration = this.props.moveTransitionDuration;
      var items = this.state.items;

      if (moveTransitionDuration) {
        var itemsRefs = _lodash2.default.union(['placeholder'], items.map(function (item) {
          return 'item-' + item.id;
        }));
        itemsRefs.forEach(function (itemRef) {
          var el = _this2.refs[_this2.ref + itemRef];
          if (el) {
            _positions[itemRef] = {
              left: el.offsetLeft,
              top: el.offsetTop
            };
          }
        });
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var _this3 = this;

      var moveTransitionDuration = this.props.moveTransitionDuration;
      var items = this.state.items;


      if (moveTransitionDuration) {
        var placeholderEl = this.refs[this.ref + "placeholder"];
        if (placeholderEl && _lodash2.default.get(prevState, 'placeholder.rank') && _lodash2.default.get(prevState, 'placeholder.rank') !== _lodash2.default.get(this.state, 'placeholder.rank')) {
          (function () {
            var itemsRefs = _lodash2.default.union(['placeholder'], _lodash2.default.map(items, function (item) {
              return 'item-' + item.id;
            }));
            var instructions = {
              transitions: [],
              transforms: []
            };
            itemsRefs.forEach(function (itemRef) {
              var el = _this3.refs[_this3.ref + itemRef];
              if (el) {
                var x = _positions[itemRef].left - el.offsetLeft;
                var y = _positions[itemRef].top - el.offsetTop;
                el.style.webkitTransform = el.style.transform = el.style.msTransform = 'translate(' + x + 'px, ' + y + 'px)'; // move back to former position
                instructions.transitions.push(function () {
                  el.style.WebkitTransition = el.style.transition = 'transform ' + moveTransitionDuration + 's';
                });
                instructions.transforms.push(function () {
                  el.style.webkitTransform = el.style.transform = null;
                });
              }
            });

            // Add all transitions and remove transforms
            window.setTimeout(function () {
              instructions.transitions.forEach(function (instruction) {
                instruction();
              });
              instructions.transforms.forEach(function (instruction) {
                instruction();
              });
            }, 100); // give it some time to make sure transform has been applied
          })();
        }
      }
    }
  }, {
    key: '_initItems',
    value: function _initItems(props) {
      var items = props.items;

      var newItems = items.map(function (item, i) {
        item.rank = i;
        item.id = item.id ? item.id : _lodash2.default.uniqueId();
        return item;
      });
      this.setState({
        items: newItems
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _state = this.state;
      var placeholder = _state.placeholder;
      var dragging = _state.dragging;
      var items = _state.items;

      var listItems = _lodash2.default.clone(items, true);
      var draggedItem = null;

      // Add drag target
      if (placeholder) {
        // Save dragged item
        listItems.forEach(function (item) {
          if (dragging && item.id === dragging.id) {
            draggedItem = item; // store it for display
          }
        });

        // Add placeholder
        listItems.push({
          rank: placeholder.rank,
          placeholder: draggedItem
        });

        // Sort list
        listItems = _lodash2.default.sortBy(listItems, function (item) {
          return item.rank;
        });
      }

      var itemsNodes = listItems.map(function (item) {
        if (item.placeholder) {
          return _this4._displayItem(item.placeholder, 'placeholder');
        } else {
          var type = draggedItem === item ? 'dragged' : 'normal';
          return _this4._displayItem(item, type);
        }
      });

      return _react2.default.createElement(
        'div',
        { id: this.ref, className: 'List', ref: this.ref },
        itemsNodes
      );
    }
  }, {
    key: '_displayItem',
    value: function _displayItem(item, type) {
      var layoutType = this.props.type;
      var id = item.id;
      var content = item.content;
      var classes = item.classes;
      var rank = item.rank;
      var dragging = this.state.dragging;

      var placeholder = this.props.placeholder || content;
      var key = 'item-' + id;
      var style = {
        position: 'relative',
        float: layoutType === 'horizontal' || layoutType === 'grid' ? 'left' : 'none'
      };
      var classNames = 'draggable';
      classNames += classes ? ' ' + classes.join(' ') : '';

      if (type === 'normal') {
        return _react2.default.createElement(
          'div',
          { ref: this.ref + key, style: style, 'data-id': id, 'data-rank': rank, key: key, className: classNames },
          content
        );
      }

      if (type === 'dragged') {
        style['display'] = 'none'; // to avoid flicker effect when translate happens
        style['zIndex'] = 10; // make sur it is on top
        classNames += ' dragged';
        return _react2.default.createElement(
          'div',
          { ref: this.ref + 'dragged', 'data-id': id, key: key, className: classNames, style: style },
          content
        );
      }

      if (type === 'placeholder') {
        style.width = dragging.width; // set with and height
        style.height = dragging.height;
        classNames += ' placeholder';
        return _react2.default.createElement(
          'div',
          { ref: this.ref + 'placeholder', key: 'placeholder', className: classNames, style: style },
          placeholder
        );
      }
    }
  }, {
    key: '_dragMove',
    value: function _dragMove(event) {
      var _this5 = this;

      var target = event.target;
      var dragging = this.state.dragging;

      // Move copy of dragged element and keep the dragged position in the data-x/data-y attributes

      var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
      var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);

      // prepare future state
      var state = _lodash2.default.clone(this.state, true);
      var dragId = target.getAttribute('data-id');
      state.dragging = state.dragging ? state.dragging : { id: dragId };
      var draggedEl = this.refs[this.ref + 'dragged'];

      // If dragging has already been started
      if (draggedEl && state.dragging) {
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
      if (!dragging) {
        this.setState(state, function () {
          _this5._movePlaceholder(event);
        });
      } else {
        this._movePlaceholder(event);
      }
    }
  }, {
    key: '_dragEnd',
    value: function _dragEnd(event) {
      var _props = this.props;
      var onSort = _props.onSort;
      var dropBackTransitionDuration = _props.dropBackTransitionDuration;
      var _state2 = this.state;
      var dragging = _state2.dragging;
      var stateItems = _state2.items;

      var items = this._moveItem();
      var draggedEl = this.refs[this.ref + 'dragged'];

      // Add transition if rank hasn't changed
      var draggedBefore = _lodash2.default.find(stateItems, { id: dragging.id });
      var draggedAfter = _lodash2.default.find(items, { id: dragging.id });

      if (draggedBefore.rank === draggedAfter.rank && dropBackTransitionDuration) {
        draggedEl.style.WebkitTransition = draggedEl.style.transition = 'all ' + dropBackTransitionDuration + 's'; // no transition
      }

      // Reset style
      draggedEl.style.display = null;
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

      if (onSort && _lodash2.default.isFunction(onSort)) {
        onSort(items);
      }
    }
  }, {
    key: '_moveItem',
    value: function _moveItem() {
      var _state3 = this.state;
      var stateItems = _state3.items;
      var placeholder = _state3.placeholder;
      var dragging = _state3.dragging;

      var items = _lodash2.default.clone(stateItems, true);

      // Replace dragged item rank
      var dragged = _lodash2.default.find(items, { id: dragging.id });
      dragged.rank = placeholder.rank;

      items = _lodash2.default.sortBy(items, function (item) {
        return item.rank;
      });

      // Normalize items ranks
      var rank = 0;
      items = _lodash2.default.forEach(items, function (item) {
        item.rank = rank;
        rank++;
      });

      return items;
    }
  }, {
    key: '_movePlaceholder',
    value: function _movePlaceholder(e) {
      var _this6 = this;

      var list = this.refs[this.ref];
      var mouseX = e.pageX;
      var mouseY = e.pageY;

      var children = _lodash2.default.filter(list.childNodes, function (child) {
        return !!child.getAttribute('data-rank');
      });

      // Find placeholder
      var placeholder = null;
      _lodash2.default.forEach(children, function (child) {
        placeholder = _this6._calculatePlaceholder(child, mouseX, mouseY, placeholder);
      });

      // Update state if necessary
      if (placeholder && placeholder.rank !== _lodash2.default.get(this.state.placeholder, 'rank')) {
        this.setState({
          placeholder: placeholder
        });
      }
    }
  }, {
    key: '_calculatePlaceholder',
    value: function _calculatePlaceholder(child, mouseX, mouseY, placeholder) {
      var type = this.props.type;

      var scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      mouseY = mouseY - scrollY; // make up for bounding rect not considering scrollY
      var position = child.getBoundingClientRect();
      var childX = position.left + child.offsetWidth / 2;
      var childY = position.top + child.offsetHeight / 2;
      var distanceX = mouseX - childX;
      var distanceY = mouseY - childY;
      var difference = void 0;
      var distance = void 0;
      var rank = void 0;
      if (type === 'grid') {
        // Skip if not on the same line
        if (mouseY < position.top || mouseY > position.top + child.offsetHeight) {
          return placeholder;
        }
        distance = Math.abs(distanceX);
        difference = distanceX;
        rank = parseInt(child.getAttribute('data-rank'), 10);
      } else {
        distance = type === 'vertical' ? Math.abs(distanceY) : Math.abs(distanceX);
        difference = type === 'vertical' ? distanceY : distanceX;
      }

      if (!placeholder || distance < placeholder.distance) {
        var pos = difference > 0 ? 'after' : 'before';
        var _rank = parseInt(child.getAttribute('data-rank'), 10);
        _rank += pos === 'before' ? -0.5 : 0.5;

        placeholder = {
          rank: _rank,
          distance: distance
        };
      }

      return placeholder;
    }
  }]);

  return DragSortableList;
}(_react2.default.Component);

// Props


DragSortableList.propTypes = {
  items: _react2.default.PropTypes.array,
  type: _react2.default.PropTypes.string,
  dropBackTransitionDuration: _react2.default.PropTypes.number,
  moveTransitionDuration: _react2.default.PropTypes.number
};
DragSortableList.defaultProps = {
  items: [],
  type: 'vertical', //horizontal
  dropBackTransitionDuration: null
};

exports.default = DragSortableList;