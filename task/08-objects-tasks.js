'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
}

Rectangle.prototype.getArea = function () {
  return this.width * this.height;
};


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
  return Object.assign(new proto.constructor(), JSON.parse(json));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class TypeElement {
  constructor(value) {
    this.value = value;
  }

  stringify() {
    return `${this.value}`;
  }
}

class IdElement {
  constructor(value) {
    this.value = value;
  }

  stringify() {
    return `#${this.value}`;
  }
}

class ClassElement {
  constructor(value) {
    this.value = value;
  }

  stringify() {
    return `.${this.value}`;
  }
}

class AttributeElement {
  constructor(value) {
    this.value = value;
  }

  stringify() {
    return `[${this.value}]`;
  }
}

class PseudoClassElement {
  constructor(value) {
    this.value = value;
  }

  stringify() {
    return `:${this.value}`;
  }
}

class PseudoElement {
  constructor(value) {
    this.value = value;
  }

  stringify() {
    return `::${this.value}`;
  }
}

class CombinedElement {
  constructor(selector1, combinator, selector2) {
    this.selector1 = selector1;
    this.selector2 = selector2;
    this.combinator = combinator;
  }

  stringify() {
    return `${this.selector1.stringify()} ${this.combinator} ${this.selector2.stringify()}`;
  }
}

class SelectorBuilder {
  constructor(element, previous) {
    this.currentElement = element;
    this.previous = previous;
  }

  stringify() {
    return (this.previous !== undefined ? this.previous.stringify() : "") + (this.currentElement !== undefined ? this.currentElement.stringify() : '');
  }

  element(value) {
    if (this.currentElement instanceof TypeElement) {
      throw "Element, id and pseudo-element should not occur more then one time inside the selector";
    }
    if (this.currentElement instanceof IdElement 
      || this.currentElement instanceof ClassElement
      || this.currentElement instanceof AttributeElement
      || this.currentElement instanceof PseudoClassElement
      || this.currentElement instanceof PseudoElement) {
      throw "Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element";
    }

    return new SelectorBuilder(new TypeElement(value), this);
  }

  id(value) {
    if (this.currentElement instanceof IdElement) {
      throw "Element, id and pseudo-element should not occur more then one time inside the selector";
    }
    if (this.currentElement instanceof ClassElement
      || this.currentElement instanceof AttributeElement
      || this.currentElement instanceof PseudoClassElement
      || this.currentElement instanceof PseudoElement) {
      throw "Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element";
    }

    return new SelectorBuilder(new IdElement(value), this);
  }

  class(value) {
    if (this.currentElement instanceof AttributeElement
      || this.currentElement instanceof PseudoClassElement
      || this.currentElement instanceof PseudoElement) {
      throw "Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element";
    }

    return new SelectorBuilder(new ClassElement(value), this);
  }

  attr(value) {
    if (this.currentElement instanceof PseudoClassElement
      || this.currentElement instanceof PseudoElement) {
      throw "Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element";
    }

    return new SelectorBuilder(new AttributeElement(value), this);
  }

  pseudoClass(value) {
    if (this.currentElement instanceof PseudoElement) {
      throw "Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element";
    }

    return new SelectorBuilder(new PseudoClassElement(value), this);
  }

  pseudoElement(value) {
    if (this.currentElement instanceof PseudoElement) {
      throw "Element, id and pseudo-element should not occur more then one time inside the selector";
    }

    return new SelectorBuilder(new PseudoElement(value), this);
  }

  combine(selector1, combinator, selector2) {
    return new CombinedElement(selector1, combinator, selector2);
  }
}

const cssSelectorBuilder = new SelectorBuilder(undefined, undefined);

module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};
