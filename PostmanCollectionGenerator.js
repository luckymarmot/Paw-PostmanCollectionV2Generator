(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 152);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/**
 *  Copyright (c) 2014-2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

(function (global, factory) {
   true ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Immutable = factory());
}(this, function () { 'use strict';var SLICE$0 = Array.prototype.slice;

  function createClass(ctor, superClass) {
    if (superClass) {
      ctor.prototype = Object.create(superClass.prototype);
    }
    ctor.prototype.constructor = ctor;
  }

  function Iterable(value) {
      return isIterable(value) ? value : Seq(value);
    }


  createClass(KeyedIterable, Iterable);
    function KeyedIterable(value) {
      return isKeyed(value) ? value : KeyedSeq(value);
    }


  createClass(IndexedIterable, Iterable);
    function IndexedIterable(value) {
      return isIndexed(value) ? value : IndexedSeq(value);
    }


  createClass(SetIterable, Iterable);
    function SetIterable(value) {
      return isIterable(value) && !isAssociative(value) ? value : SetSeq(value);
    }



  function isIterable(maybeIterable) {
    return !!(maybeIterable && maybeIterable[IS_ITERABLE_SENTINEL]);
  }

  function isKeyed(maybeKeyed) {
    return !!(maybeKeyed && maybeKeyed[IS_KEYED_SENTINEL]);
  }

  function isIndexed(maybeIndexed) {
    return !!(maybeIndexed && maybeIndexed[IS_INDEXED_SENTINEL]);
  }

  function isAssociative(maybeAssociative) {
    return isKeyed(maybeAssociative) || isIndexed(maybeAssociative);
  }

  function isOrdered(maybeOrdered) {
    return !!(maybeOrdered && maybeOrdered[IS_ORDERED_SENTINEL]);
  }

  Iterable.isIterable = isIterable;
  Iterable.isKeyed = isKeyed;
  Iterable.isIndexed = isIndexed;
  Iterable.isAssociative = isAssociative;
  Iterable.isOrdered = isOrdered;

  Iterable.Keyed = KeyedIterable;
  Iterable.Indexed = IndexedIterable;
  Iterable.Set = SetIterable;


  var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
  var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
  var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
  var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';

  // Used for setting prototype methods that IE8 chokes on.
  var DELETE = 'delete';

  // Constants describing the size of trie nodes.
  var SHIFT = 5; // Resulted in best performance after ______?
  var SIZE = 1 << SHIFT;
  var MASK = SIZE - 1;

  // A consistent shared value representing "not set" which equals nothing other
  // than itself, and nothing that could be provided externally.
  var NOT_SET = {};

  // Boolean references, Rough equivalent of `bool &`.
  var CHANGE_LENGTH = { value: false };
  var DID_ALTER = { value: false };

  function MakeRef(ref) {
    ref.value = false;
    return ref;
  }

  function SetRef(ref) {
    ref && (ref.value = true);
  }

  // A function which returns a value representing an "owner" for transient writes
  // to tries. The return value will only ever equal itself, and will not equal
  // the return of any subsequent call of this function.
  function OwnerID() {}

  // http://jsperf.com/copy-array-inline
  function arrCopy(arr, offset) {
    offset = offset || 0;
    var len = Math.max(0, arr.length - offset);
    var newArr = new Array(len);
    for (var ii = 0; ii < len; ii++) {
      newArr[ii] = arr[ii + offset];
    }
    return newArr;
  }

  function ensureSize(iter) {
    if (iter.size === undefined) {
      iter.size = iter.__iterate(returnTrue);
    }
    return iter.size;
  }

  function wrapIndex(iter, index) {
    // This implements "is array index" which the ECMAString spec defines as:
    //
    //     A String property name P is an array index if and only if
    //     ToString(ToUint32(P)) is equal to P and ToUint32(P) is not equal
    //     to 2^32−1.
    //
    // http://www.ecma-international.org/ecma-262/6.0/#sec-array-exotic-objects
    if (typeof index !== 'number') {
      var uint32Index = index >>> 0; // N >>> 0 is shorthand for ToUint32
      if ('' + uint32Index !== index || uint32Index === 4294967295) {
        return NaN;
      }
      index = uint32Index;
    }
    return index < 0 ? ensureSize(iter) + index : index;
  }

  function returnTrue() {
    return true;
  }

  function wholeSlice(begin, end, size) {
    return (begin === 0 || (size !== undefined && begin <= -size)) &&
      (end === undefined || (size !== undefined && end >= size));
  }

  function resolveBegin(begin, size) {
    return resolveIndex(begin, size, 0);
  }

  function resolveEnd(end, size) {
    return resolveIndex(end, size, size);
  }

  function resolveIndex(index, size, defaultIndex) {
    return index === undefined ?
      defaultIndex :
      index < 0 ?
        Math.max(0, size + index) :
        size === undefined ?
          index :
          Math.min(size, index);
  }

  /* global Symbol */

  var ITERATE_KEYS = 0;
  var ITERATE_VALUES = 1;
  var ITERATE_ENTRIES = 2;

  var REAL_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator';

  var ITERATOR_SYMBOL = REAL_ITERATOR_SYMBOL || FAUX_ITERATOR_SYMBOL;


  function Iterator(next) {
      this.next = next;
    }

    Iterator.prototype.toString = function() {
      return '[Iterator]';
    };


  Iterator.KEYS = ITERATE_KEYS;
  Iterator.VALUES = ITERATE_VALUES;
  Iterator.ENTRIES = ITERATE_ENTRIES;

  Iterator.prototype.inspect =
  Iterator.prototype.toSource = function () { return this.toString(); }
  Iterator.prototype[ITERATOR_SYMBOL] = function () {
    return this;
  };


  function iteratorValue(type, k, v, iteratorResult) {
    var value = type === 0 ? k : type === 1 ? v : [k, v];
    iteratorResult ? (iteratorResult.value = value) : (iteratorResult = {
      value: value, done: false
    });
    return iteratorResult;
  }

  function iteratorDone() {
    return { value: undefined, done: true };
  }

  function hasIterator(maybeIterable) {
    return !!getIteratorFn(maybeIterable);
  }

  function isIterator(maybeIterator) {
    return maybeIterator && typeof maybeIterator.next === 'function';
  }

  function getIterator(iterable) {
    var iteratorFn = getIteratorFn(iterable);
    return iteratorFn && iteratorFn.call(iterable);
  }

  function getIteratorFn(iterable) {
    var iteratorFn = iterable && (
      (REAL_ITERATOR_SYMBOL && iterable[REAL_ITERATOR_SYMBOL]) ||
      iterable[FAUX_ITERATOR_SYMBOL]
    );
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  function isArrayLike(value) {
    return value && typeof value.length === 'number';
  }

  createClass(Seq, Iterable);
    function Seq(value) {
      return value === null || value === undefined ? emptySequence() :
        isIterable(value) ? value.toSeq() : seqFromValue(value);
    }

    Seq.of = function(/*...values*/) {
      return Seq(arguments);
    };

    Seq.prototype.toSeq = function() {
      return this;
    };

    Seq.prototype.toString = function() {
      return this.__toString('Seq {', '}');
    };

    Seq.prototype.cacheResult = function() {
      if (!this._cache && this.__iterateUncached) {
        this._cache = this.entrySeq().toArray();
        this.size = this._cache.length;
      }
      return this;
    };

    // abstract __iterateUncached(fn, reverse)

    Seq.prototype.__iterate = function(fn, reverse) {
      return seqIterate(this, fn, reverse, true);
    };

    // abstract __iteratorUncached(type, reverse)

    Seq.prototype.__iterator = function(type, reverse) {
      return seqIterator(this, type, reverse, true);
    };



  createClass(KeyedSeq, Seq);
    function KeyedSeq(value) {
      return value === null || value === undefined ?
        emptySequence().toKeyedSeq() :
        isIterable(value) ?
          (isKeyed(value) ? value.toSeq() : value.fromEntrySeq()) :
          keyedSeqFromValue(value);
    }

    KeyedSeq.prototype.toKeyedSeq = function() {
      return this;
    };



  createClass(IndexedSeq, Seq);
    function IndexedSeq(value) {
      return value === null || value === undefined ? emptySequence() :
        !isIterable(value) ? indexedSeqFromValue(value) :
        isKeyed(value) ? value.entrySeq() : value.toIndexedSeq();
    }

    IndexedSeq.of = function(/*...values*/) {
      return IndexedSeq(arguments);
    };

    IndexedSeq.prototype.toIndexedSeq = function() {
      return this;
    };

    IndexedSeq.prototype.toString = function() {
      return this.__toString('Seq [', ']');
    };

    IndexedSeq.prototype.__iterate = function(fn, reverse) {
      return seqIterate(this, fn, reverse, false);
    };

    IndexedSeq.prototype.__iterator = function(type, reverse) {
      return seqIterator(this, type, reverse, false);
    };



  createClass(SetSeq, Seq);
    function SetSeq(value) {
      return (
        value === null || value === undefined ? emptySequence() :
        !isIterable(value) ? indexedSeqFromValue(value) :
        isKeyed(value) ? value.entrySeq() : value
      ).toSetSeq();
    }

    SetSeq.of = function(/*...values*/) {
      return SetSeq(arguments);
    };

    SetSeq.prototype.toSetSeq = function() {
      return this;
    };



  Seq.isSeq = isSeq;
  Seq.Keyed = KeyedSeq;
  Seq.Set = SetSeq;
  Seq.Indexed = IndexedSeq;

  var IS_SEQ_SENTINEL = '@@__IMMUTABLE_SEQ__@@';

  Seq.prototype[IS_SEQ_SENTINEL] = true;



  createClass(ArraySeq, IndexedSeq);
    function ArraySeq(array) {
      this._array = array;
      this.size = array.length;
    }

    ArraySeq.prototype.get = function(index, notSetValue) {
      return this.has(index) ? this._array[wrapIndex(this, index)] : notSetValue;
    };

    ArraySeq.prototype.__iterate = function(fn, reverse) {
      var array = this._array;
      var maxIndex = array.length - 1;
      for (var ii = 0; ii <= maxIndex; ii++) {
        if (fn(array[reverse ? maxIndex - ii : ii], ii, this) === false) {
          return ii + 1;
        }
      }
      return ii;
    };

    ArraySeq.prototype.__iterator = function(type, reverse) {
      var array = this._array;
      var maxIndex = array.length - 1;
      var ii = 0;
      return new Iterator(function() 
        {return ii > maxIndex ?
          iteratorDone() :
          iteratorValue(type, ii, array[reverse ? maxIndex - ii++ : ii++])}
      );
    };



  createClass(ObjectSeq, KeyedSeq);
    function ObjectSeq(object) {
      var keys = Object.keys(object);
      this._object = object;
      this._keys = keys;
      this.size = keys.length;
    }

    ObjectSeq.prototype.get = function(key, notSetValue) {
      if (notSetValue !== undefined && !this.has(key)) {
        return notSetValue;
      }
      return this._object[key];
    };

    ObjectSeq.prototype.has = function(key) {
      return this._object.hasOwnProperty(key);
    };

    ObjectSeq.prototype.__iterate = function(fn, reverse) {
      var object = this._object;
      var keys = this._keys;
      var maxIndex = keys.length - 1;
      for (var ii = 0; ii <= maxIndex; ii++) {
        var key = keys[reverse ? maxIndex - ii : ii];
        if (fn(object[key], key, this) === false) {
          return ii + 1;
        }
      }
      return ii;
    };

    ObjectSeq.prototype.__iterator = function(type, reverse) {
      var object = this._object;
      var keys = this._keys;
      var maxIndex = keys.length - 1;
      var ii = 0;
      return new Iterator(function()  {
        var key = keys[reverse ? maxIndex - ii : ii];
        return ii++ > maxIndex ?
          iteratorDone() :
          iteratorValue(type, key, object[key]);
      });
    };

  ObjectSeq.prototype[IS_ORDERED_SENTINEL] = true;


  createClass(IterableSeq, IndexedSeq);
    function IterableSeq(iterable) {
      this._iterable = iterable;
      this.size = iterable.length || iterable.size;
    }

    IterableSeq.prototype.__iterateUncached = function(fn, reverse) {
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }
      var iterable = this._iterable;
      var iterator = getIterator(iterable);
      var iterations = 0;
      if (isIterator(iterator)) {
        var step;
        while (!(step = iterator.next()).done) {
          if (fn(step.value, iterations++, this) === false) {
            break;
          }
        }
      }
      return iterations;
    };

    IterableSeq.prototype.__iteratorUncached = function(type, reverse) {
      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }
      var iterable = this._iterable;
      var iterator = getIterator(iterable);
      if (!isIterator(iterator)) {
        return new Iterator(iteratorDone);
      }
      var iterations = 0;
      return new Iterator(function()  {
        var step = iterator.next();
        return step.done ? step : iteratorValue(type, iterations++, step.value);
      });
    };



  createClass(IteratorSeq, IndexedSeq);
    function IteratorSeq(iterator) {
      this._iterator = iterator;
      this._iteratorCache = [];
    }

    IteratorSeq.prototype.__iterateUncached = function(fn, reverse) {
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }
      var iterator = this._iterator;
      var cache = this._iteratorCache;
      var iterations = 0;
      while (iterations < cache.length) {
        if (fn(cache[iterations], iterations++, this) === false) {
          return iterations;
        }
      }
      var step;
      while (!(step = iterator.next()).done) {
        var val = step.value;
        cache[iterations] = val;
        if (fn(val, iterations++, this) === false) {
          break;
        }
      }
      return iterations;
    };

    IteratorSeq.prototype.__iteratorUncached = function(type, reverse) {
      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }
      var iterator = this._iterator;
      var cache = this._iteratorCache;
      var iterations = 0;
      return new Iterator(function()  {
        if (iterations >= cache.length) {
          var step = iterator.next();
          if (step.done) {
            return step;
          }
          cache[iterations] = step.value;
        }
        return iteratorValue(type, iterations, cache[iterations++]);
      });
    };




  // # pragma Helper functions

  function isSeq(maybeSeq) {
    return !!(maybeSeq && maybeSeq[IS_SEQ_SENTINEL]);
  }

  var EMPTY_SEQ;

  function emptySequence() {
    return EMPTY_SEQ || (EMPTY_SEQ = new ArraySeq([]));
  }

  function keyedSeqFromValue(value) {
    var seq =
      Array.isArray(value) ? new ArraySeq(value).fromEntrySeq() :
      isIterator(value) ? new IteratorSeq(value).fromEntrySeq() :
      hasIterator(value) ? new IterableSeq(value).fromEntrySeq() :
      typeof value === 'object' ? new ObjectSeq(value) :
      undefined;
    if (!seq) {
      throw new TypeError(
        'Expected Array or iterable object of [k, v] entries, '+
        'or keyed object: ' + value
      );
    }
    return seq;
  }

  function indexedSeqFromValue(value) {
    var seq = maybeIndexedSeqFromValue(value);
    if (!seq) {
      throw new TypeError(
        'Expected Array or iterable object of values: ' + value
      );
    }
    return seq;
  }

  function seqFromValue(value) {
    var seq = maybeIndexedSeqFromValue(value) ||
      (typeof value === 'object' && new ObjectSeq(value));
    if (!seq) {
      throw new TypeError(
        'Expected Array or iterable object of values, or keyed object: ' + value
      );
    }
    return seq;
  }

  function maybeIndexedSeqFromValue(value) {
    return (
      isArrayLike(value) ? new ArraySeq(value) :
      isIterator(value) ? new IteratorSeq(value) :
      hasIterator(value) ? new IterableSeq(value) :
      undefined
    );
  }

  function seqIterate(seq, fn, reverse, useKeys) {
    var cache = seq._cache;
    if (cache) {
      var maxIndex = cache.length - 1;
      for (var ii = 0; ii <= maxIndex; ii++) {
        var entry = cache[reverse ? maxIndex - ii : ii];
        if (fn(entry[1], useKeys ? entry[0] : ii, seq) === false) {
          return ii + 1;
        }
      }
      return ii;
    }
    return seq.__iterateUncached(fn, reverse);
  }

  function seqIterator(seq, type, reverse, useKeys) {
    var cache = seq._cache;
    if (cache) {
      var maxIndex = cache.length - 1;
      var ii = 0;
      return new Iterator(function()  {
        var entry = cache[reverse ? maxIndex - ii : ii];
        return ii++ > maxIndex ?
          iteratorDone() :
          iteratorValue(type, useKeys ? entry[0] : ii - 1, entry[1]);
      });
    }
    return seq.__iteratorUncached(type, reverse);
  }

  function fromJS(json, converter) {
    return converter ?
      fromJSWith(converter, json, '', {'': json}) :
      fromJSDefault(json);
  }

  function fromJSWith(converter, json, key, parentJSON) {
    if (Array.isArray(json)) {
      return converter.call(parentJSON, key, IndexedSeq(json).map(function(v, k)  {return fromJSWith(converter, v, k, json)}));
    }
    if (isPlainObj(json)) {
      return converter.call(parentJSON, key, KeyedSeq(json).map(function(v, k)  {return fromJSWith(converter, v, k, json)}));
    }
    return json;
  }

  function fromJSDefault(json) {
    if (Array.isArray(json)) {
      return IndexedSeq(json).map(fromJSDefault).toList();
    }
    if (isPlainObj(json)) {
      return KeyedSeq(json).map(fromJSDefault).toMap();
    }
    return json;
  }

  function isPlainObj(value) {
    return value && (value.constructor === Object || value.constructor === undefined);
  }

  /**
   * An extension of the "same-value" algorithm as [described for use by ES6 Map
   * and Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Key_equality)
   *
   * NaN is considered the same as NaN, however -0 and 0 are considered the same
   * value, which is different from the algorithm described by
   * [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
   *
   * This is extended further to allow Objects to describe the values they
   * represent, by way of `valueOf` or `equals` (and `hashCode`).
   *
   * Note: because of this extension, the key equality of Immutable.Map and the
   * value equality of Immutable.Set will differ from ES6 Map and Set.
   *
   * ### Defining custom values
   *
   * The easiest way to describe the value an object represents is by implementing
   * `valueOf`. For example, `Date` represents a value by returning a unix
   * timestamp for `valueOf`:
   *
   *     var date1 = new Date(1234567890000); // Fri Feb 13 2009 ...
   *     var date2 = new Date(1234567890000);
   *     date1.valueOf(); // 1234567890000
   *     assert( date1 !== date2 );
   *     assert( Immutable.is( date1, date2 ) );
   *
   * Note: overriding `valueOf` may have other implications if you use this object
   * where JavaScript expects a primitive, such as implicit string coercion.
   *
   * For more complex types, especially collections, implementing `valueOf` may
   * not be performant. An alternative is to implement `equals` and `hashCode`.
   *
   * `equals` takes another object, presumably of similar type, and returns true
   * if the it is equal. Equality is symmetrical, so the same result should be
   * returned if this and the argument are flipped.
   *
   *     assert( a.equals(b) === b.equals(a) );
   *
   * `hashCode` returns a 32bit integer number representing the object which will
   * be used to determine how to store the value object in a Map or Set. You must
   * provide both or neither methods, one must not exist without the other.
   *
   * Also, an important relationship between these methods must be upheld: if two
   * values are equal, they *must* return the same hashCode. If the values are not
   * equal, they might have the same hashCode; this is called a hash collision,
   * and while undesirable for performance reasons, it is acceptable.
   *
   *     if (a.equals(b)) {
   *       assert( a.hashCode() === b.hashCode() );
   *     }
   *
   * All Immutable collections implement `equals` and `hashCode`.
   *
   */
  function is(valueA, valueB) {
    if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
      return true;
    }
    if (!valueA || !valueB) {
      return false;
    }
    if (typeof valueA.valueOf === 'function' &&
        typeof valueB.valueOf === 'function') {
      valueA = valueA.valueOf();
      valueB = valueB.valueOf();
      if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
        return true;
      }
      if (!valueA || !valueB) {
        return false;
      }
    }
    if (typeof valueA.equals === 'function' &&
        typeof valueB.equals === 'function' &&
        valueA.equals(valueB)) {
      return true;
    }
    return false;
  }

  function deepEqual(a, b) {
    if (a === b) {
      return true;
    }

    if (
      !isIterable(b) ||
      a.size !== undefined && b.size !== undefined && a.size !== b.size ||
      a.__hash !== undefined && b.__hash !== undefined && a.__hash !== b.__hash ||
      isKeyed(a) !== isKeyed(b) ||
      isIndexed(a) !== isIndexed(b) ||
      isOrdered(a) !== isOrdered(b)
    ) {
      return false;
    }

    if (a.size === 0 && b.size === 0) {
      return true;
    }

    var notAssociative = !isAssociative(a);

    if (isOrdered(a)) {
      var entries = a.entries();
      return b.every(function(v, k)  {
        var entry = entries.next().value;
        return entry && is(entry[1], v) && (notAssociative || is(entry[0], k));
      }) && entries.next().done;
    }

    var flipped = false;

    if (a.size === undefined) {
      if (b.size === undefined) {
        if (typeof a.cacheResult === 'function') {
          a.cacheResult();
        }
      } else {
        flipped = true;
        var _ = a;
        a = b;
        b = _;
      }
    }

    var allEqual = true;
    var bSize = b.__iterate(function(v, k)  {
      if (notAssociative ? !a.has(v) :
          flipped ? !is(v, a.get(k, NOT_SET)) : !is(a.get(k, NOT_SET), v)) {
        allEqual = false;
        return false;
      }
    });

    return allEqual && a.size === bSize;
  }

  createClass(Repeat, IndexedSeq);

    function Repeat(value, times) {
      if (!(this instanceof Repeat)) {
        return new Repeat(value, times);
      }
      this._value = value;
      this.size = times === undefined ? Infinity : Math.max(0, times);
      if (this.size === 0) {
        if (EMPTY_REPEAT) {
          return EMPTY_REPEAT;
        }
        EMPTY_REPEAT = this;
      }
    }

    Repeat.prototype.toString = function() {
      if (this.size === 0) {
        return 'Repeat []';
      }
      return 'Repeat [ ' + this._value + ' ' + this.size + ' times ]';
    };

    Repeat.prototype.get = function(index, notSetValue) {
      return this.has(index) ? this._value : notSetValue;
    };

    Repeat.prototype.includes = function(searchValue) {
      return is(this._value, searchValue);
    };

    Repeat.prototype.slice = function(begin, end) {
      var size = this.size;
      return wholeSlice(begin, end, size) ? this :
        new Repeat(this._value, resolveEnd(end, size) - resolveBegin(begin, size));
    };

    Repeat.prototype.reverse = function() {
      return this;
    };

    Repeat.prototype.indexOf = function(searchValue) {
      if (is(this._value, searchValue)) {
        return 0;
      }
      return -1;
    };

    Repeat.prototype.lastIndexOf = function(searchValue) {
      if (is(this._value, searchValue)) {
        return this.size;
      }
      return -1;
    };

    Repeat.prototype.__iterate = function(fn, reverse) {
      for (var ii = 0; ii < this.size; ii++) {
        if (fn(this._value, ii, this) === false) {
          return ii + 1;
        }
      }
      return ii;
    };

    Repeat.prototype.__iterator = function(type, reverse) {var this$0 = this;
      var ii = 0;
      return new Iterator(function() 
        {return ii < this$0.size ? iteratorValue(type, ii++, this$0._value) : iteratorDone()}
      );
    };

    Repeat.prototype.equals = function(other) {
      return other instanceof Repeat ?
        is(this._value, other._value) :
        deepEqual(other);
    };


  var EMPTY_REPEAT;

  function invariant(condition, error) {
    if (!condition) throw new Error(error);
  }

  createClass(Range, IndexedSeq);

    function Range(start, end, step) {
      if (!(this instanceof Range)) {
        return new Range(start, end, step);
      }
      invariant(step !== 0, 'Cannot step a Range by 0');
      start = start || 0;
      if (end === undefined) {
        end = Infinity;
      }
      step = step === undefined ? 1 : Math.abs(step);
      if (end < start) {
        step = -step;
      }
      this._start = start;
      this._end = end;
      this._step = step;
      this.size = Math.max(0, Math.ceil((end - start) / step - 1) + 1);
      if (this.size === 0) {
        if (EMPTY_RANGE) {
          return EMPTY_RANGE;
        }
        EMPTY_RANGE = this;
      }
    }

    Range.prototype.toString = function() {
      if (this.size === 0) {
        return 'Range []';
      }
      return 'Range [ ' +
        this._start + '...' + this._end +
        (this._step !== 1 ? ' by ' + this._step : '') +
      ' ]';
    };

    Range.prototype.get = function(index, notSetValue) {
      return this.has(index) ?
        this._start + wrapIndex(this, index) * this._step :
        notSetValue;
    };

    Range.prototype.includes = function(searchValue) {
      var possibleIndex = (searchValue - this._start) / this._step;
      return possibleIndex >= 0 &&
        possibleIndex < this.size &&
        possibleIndex === Math.floor(possibleIndex);
    };

    Range.prototype.slice = function(begin, end) {
      if (wholeSlice(begin, end, this.size)) {
        return this;
      }
      begin = resolveBegin(begin, this.size);
      end = resolveEnd(end, this.size);
      if (end <= begin) {
        return new Range(0, 0);
      }
      return new Range(this.get(begin, this._end), this.get(end, this._end), this._step);
    };

    Range.prototype.indexOf = function(searchValue) {
      var offsetValue = searchValue - this._start;
      if (offsetValue % this._step === 0) {
        var index = offsetValue / this._step;
        if (index >= 0 && index < this.size) {
          return index
        }
      }
      return -1;
    };

    Range.prototype.lastIndexOf = function(searchValue) {
      return this.indexOf(searchValue);
    };

    Range.prototype.__iterate = function(fn, reverse) {
      var maxIndex = this.size - 1;
      var step = this._step;
      var value = reverse ? this._start + maxIndex * step : this._start;
      for (var ii = 0; ii <= maxIndex; ii++) {
        if (fn(value, ii, this) === false) {
          return ii + 1;
        }
        value += reverse ? -step : step;
      }
      return ii;
    };

    Range.prototype.__iterator = function(type, reverse) {
      var maxIndex = this.size - 1;
      var step = this._step;
      var value = reverse ? this._start + maxIndex * step : this._start;
      var ii = 0;
      return new Iterator(function()  {
        var v = value;
        value += reverse ? -step : step;
        return ii > maxIndex ? iteratorDone() : iteratorValue(type, ii++, v);
      });
    };

    Range.prototype.equals = function(other) {
      return other instanceof Range ?
        this._start === other._start &&
        this._end === other._end &&
        this._step === other._step :
        deepEqual(this, other);
    };


  var EMPTY_RANGE;

  createClass(Collection, Iterable);
    function Collection() {
      throw TypeError('Abstract');
    }


  createClass(KeyedCollection, Collection);function KeyedCollection() {}

  createClass(IndexedCollection, Collection);function IndexedCollection() {}

  createClass(SetCollection, Collection);function SetCollection() {}


  Collection.Keyed = KeyedCollection;
  Collection.Indexed = IndexedCollection;
  Collection.Set = SetCollection;

  var imul =
    typeof Math.imul === 'function' && Math.imul(0xffffffff, 2) === -2 ?
    Math.imul :
    function imul(a, b) {
      a = a | 0; // int
      b = b | 0; // int
      var c = a & 0xffff;
      var d = b & 0xffff;
      // Shift by 0 fixes the sign on the high part.
      return (c * d) + ((((a >>> 16) * d + c * (b >>> 16)) << 16) >>> 0) | 0; // int
    };

  // v8 has an optimization for storing 31-bit signed numbers.
  // Values which have either 00 or 11 as the high order bits qualify.
  // This function drops the highest order bit in a signed number, maintaining
  // the sign bit.
  function smi(i32) {
    return ((i32 >>> 1) & 0x40000000) | (i32 & 0xBFFFFFFF);
  }

  function hash(o) {
    if (o === false || o === null || o === undefined) {
      return 0;
    }
    if (typeof o.valueOf === 'function') {
      o = o.valueOf();
      if (o === false || o === null || o === undefined) {
        return 0;
      }
    }
    if (o === true) {
      return 1;
    }
    var type = typeof o;
    if (type === 'number') {
      if (o !== o || o === Infinity) {
        return 0;
      }
      var h = o | 0;
      if (h !== o) {
        h ^= o * 0xFFFFFFFF;
      }
      while (o > 0xFFFFFFFF) {
        o /= 0xFFFFFFFF;
        h ^= o;
      }
      return smi(h);
    }
    if (type === 'string') {
      return o.length > STRING_HASH_CACHE_MIN_STRLEN ? cachedHashString(o) : hashString(o);
    }
    if (typeof o.hashCode === 'function') {
      return o.hashCode();
    }
    if (type === 'object') {
      return hashJSObj(o);
    }
    if (typeof o.toString === 'function') {
      return hashString(o.toString());
    }
    throw new Error('Value type ' + type + ' cannot be hashed.');
  }

  function cachedHashString(string) {
    var hash = stringHashCache[string];
    if (hash === undefined) {
      hash = hashString(string);
      if (STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE) {
        STRING_HASH_CACHE_SIZE = 0;
        stringHashCache = {};
      }
      STRING_HASH_CACHE_SIZE++;
      stringHashCache[string] = hash;
    }
    return hash;
  }

  // http://jsperf.com/hashing-strings
  function hashString(string) {
    // This is the hash from JVM
    // The hash code for a string is computed as
    // s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
    // where s[i] is the ith character of the string and n is the length of
    // the string. We "mod" the result to make it between 0 (inclusive) and 2^31
    // (exclusive) by dropping high bits.
    var hash = 0;
    for (var ii = 0; ii < string.length; ii++) {
      hash = 31 * hash + string.charCodeAt(ii) | 0;
    }
    return smi(hash);
  }

  function hashJSObj(obj) {
    var hash;
    if (usingWeakMap) {
      hash = weakMap.get(obj);
      if (hash !== undefined) {
        return hash;
      }
    }

    hash = obj[UID_HASH_KEY];
    if (hash !== undefined) {
      return hash;
    }

    if (!canDefineProperty) {
      hash = obj.propertyIsEnumerable && obj.propertyIsEnumerable[UID_HASH_KEY];
      if (hash !== undefined) {
        return hash;
      }

      hash = getIENodeHash(obj);
      if (hash !== undefined) {
        return hash;
      }
    }

    hash = ++objHashUID;
    if (objHashUID & 0x40000000) {
      objHashUID = 0;
    }

    if (usingWeakMap) {
      weakMap.set(obj, hash);
    } else if (isExtensible !== undefined && isExtensible(obj) === false) {
      throw new Error('Non-extensible objects are not allowed as keys.');
    } else if (canDefineProperty) {
      Object.defineProperty(obj, UID_HASH_KEY, {
        'enumerable': false,
        'configurable': false,
        'writable': false,
        'value': hash
      });
    } else if (obj.propertyIsEnumerable !== undefined &&
               obj.propertyIsEnumerable === obj.constructor.prototype.propertyIsEnumerable) {
      // Since we can't define a non-enumerable property on the object
      // we'll hijack one of the less-used non-enumerable properties to
      // save our hash on it. Since this is a function it will not show up in
      // `JSON.stringify` which is what we want.
      obj.propertyIsEnumerable = function() {
        return this.constructor.prototype.propertyIsEnumerable.apply(this, arguments);
      };
      obj.propertyIsEnumerable[UID_HASH_KEY] = hash;
    } else if (obj.nodeType !== undefined) {
      // At this point we couldn't get the IE `uniqueID` to use as a hash
      // and we couldn't use a non-enumerable property to exploit the
      // dontEnum bug so we simply add the `UID_HASH_KEY` on the node
      // itself.
      obj[UID_HASH_KEY] = hash;
    } else {
      throw new Error('Unable to set a non-enumerable property on object.');
    }

    return hash;
  }

  // Get references to ES5 object methods.
  var isExtensible = Object.isExtensible;

  // True if Object.defineProperty works as expected. IE8 fails this test.
  var canDefineProperty = (function() {
    try {
      Object.defineProperty({}, '@', {});
      return true;
    } catch (e) {
      return false;
    }
  }());

  // IE has a `uniqueID` property on DOM nodes. We can construct the hash from it
  // and avoid memory leaks from the IE cloneNode bug.
  function getIENodeHash(node) {
    if (node && node.nodeType > 0) {
      switch (node.nodeType) {
        case 1: // Element
          return node.uniqueID;
        case 9: // Document
          return node.documentElement && node.documentElement.uniqueID;
      }
    }
  }

  // If possible, use a WeakMap.
  var usingWeakMap = typeof WeakMap === 'function';
  var weakMap;
  if (usingWeakMap) {
    weakMap = new WeakMap();
  }

  var objHashUID = 0;

  var UID_HASH_KEY = '__immutablehash__';
  if (typeof Symbol === 'function') {
    UID_HASH_KEY = Symbol(UID_HASH_KEY);
  }

  var STRING_HASH_CACHE_MIN_STRLEN = 16;
  var STRING_HASH_CACHE_MAX_SIZE = 255;
  var STRING_HASH_CACHE_SIZE = 0;
  var stringHashCache = {};

  function assertNotInfinite(size) {
    invariant(
      size !== Infinity,
      'Cannot perform this action with an infinite size.'
    );
  }

  createClass(Map, KeyedCollection);

    // @pragma Construction

    function Map(value) {
      return value === null || value === undefined ? emptyMap() :
        isMap(value) && !isOrdered(value) ? value :
        emptyMap().withMutations(function(map ) {
          var iter = KeyedIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function(v, k)  {return map.set(k, v)});
        });
    }

    Map.of = function() {var keyValues = SLICE$0.call(arguments, 0);
      return emptyMap().withMutations(function(map ) {
        for (var i = 0; i < keyValues.length; i += 2) {
          if (i + 1 >= keyValues.length) {
            throw new Error('Missing value for key: ' + keyValues[i]);
          }
          map.set(keyValues[i], keyValues[i + 1]);
        }
      });
    };

    Map.prototype.toString = function() {
      return this.__toString('Map {', '}');
    };

    // @pragma Access

    Map.prototype.get = function(k, notSetValue) {
      return this._root ?
        this._root.get(0, undefined, k, notSetValue) :
        notSetValue;
    };

    // @pragma Modification

    Map.prototype.set = function(k, v) {
      return updateMap(this, k, v);
    };

    Map.prototype.setIn = function(keyPath, v) {
      return this.updateIn(keyPath, NOT_SET, function()  {return v});
    };

    Map.prototype.remove = function(k) {
      return updateMap(this, k, NOT_SET);
    };

    Map.prototype.deleteIn = function(keyPath) {
      return this.updateIn(keyPath, function()  {return NOT_SET});
    };

    Map.prototype.update = function(k, notSetValue, updater) {
      return arguments.length === 1 ?
        k(this) :
        this.updateIn([k], notSetValue, updater);
    };

    Map.prototype.updateIn = function(keyPath, notSetValue, updater) {
      if (!updater) {
        updater = notSetValue;
        notSetValue = undefined;
      }
      var updatedValue = updateInDeepMap(
        this,
        forceIterator(keyPath),
        notSetValue,
        updater
      );
      return updatedValue === NOT_SET ? undefined : updatedValue;
    };

    Map.prototype.clear = function() {
      if (this.size === 0) {
        return this;
      }
      if (this.__ownerID) {
        this.size = 0;
        this._root = null;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return emptyMap();
    };

    // @pragma Composition

    Map.prototype.merge = function(/*...iters*/) {
      return mergeIntoMapWith(this, undefined, arguments);
    };

    Map.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
      return mergeIntoMapWith(this, merger, iters);
    };

    Map.prototype.mergeIn = function(keyPath) {var iters = SLICE$0.call(arguments, 1);
      return this.updateIn(
        keyPath,
        emptyMap(),
        function(m ) {return typeof m.merge === 'function' ?
          m.merge.apply(m, iters) :
          iters[iters.length - 1]}
      );
    };

    Map.prototype.mergeDeep = function(/*...iters*/) {
      return mergeIntoMapWith(this, deepMerger, arguments);
    };

    Map.prototype.mergeDeepWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
      return mergeIntoMapWith(this, deepMergerWith(merger), iters);
    };

    Map.prototype.mergeDeepIn = function(keyPath) {var iters = SLICE$0.call(arguments, 1);
      return this.updateIn(
        keyPath,
        emptyMap(),
        function(m ) {return typeof m.mergeDeep === 'function' ?
          m.mergeDeep.apply(m, iters) :
          iters[iters.length - 1]}
      );
    };

    Map.prototype.sort = function(comparator) {
      // Late binding
      return OrderedMap(sortFactory(this, comparator));
    };

    Map.prototype.sortBy = function(mapper, comparator) {
      // Late binding
      return OrderedMap(sortFactory(this, comparator, mapper));
    };

    // @pragma Mutability

    Map.prototype.withMutations = function(fn) {
      var mutable = this.asMutable();
      fn(mutable);
      return mutable.wasAltered() ? mutable.__ensureOwner(this.__ownerID) : this;
    };

    Map.prototype.asMutable = function() {
      return this.__ownerID ? this : this.__ensureOwner(new OwnerID());
    };

    Map.prototype.asImmutable = function() {
      return this.__ensureOwner();
    };

    Map.prototype.wasAltered = function() {
      return this.__altered;
    };

    Map.prototype.__iterator = function(type, reverse) {
      return new MapIterator(this, type, reverse);
    };

    Map.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      var iterations = 0;
      this._root && this._root.iterate(function(entry ) {
        iterations++;
        return fn(entry[1], entry[0], this$0);
      }, reverse);
      return iterations;
    };

    Map.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      if (!ownerID) {
        this.__ownerID = ownerID;
        this.__altered = false;
        return this;
      }
      return makeMap(this.size, this._root, ownerID, this.__hash);
    };


  function isMap(maybeMap) {
    return !!(maybeMap && maybeMap[IS_MAP_SENTINEL]);
  }

  Map.isMap = isMap;

  var IS_MAP_SENTINEL = '@@__IMMUTABLE_MAP__@@';

  var MapPrototype = Map.prototype;
  MapPrototype[IS_MAP_SENTINEL] = true;
  MapPrototype[DELETE] = MapPrototype.remove;
  MapPrototype.removeIn = MapPrototype.deleteIn;


  // #pragma Trie Nodes



    function ArrayMapNode(ownerID, entries) {
      this.ownerID = ownerID;
      this.entries = entries;
    }

    ArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue) {
      var entries = this.entries;
      for (var ii = 0, len = entries.length; ii < len; ii++) {
        if (is(key, entries[ii][0])) {
          return entries[ii][1];
        }
      }
      return notSetValue;
    };

    ArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      var removed = value === NOT_SET;

      var entries = this.entries;
      var idx = 0;
      for (var len = entries.length; idx < len; idx++) {
        if (is(key, entries[idx][0])) {
          break;
        }
      }
      var exists = idx < len;

      if (exists ? entries[idx][1] === value : removed) {
        return this;
      }

      SetRef(didAlter);
      (removed || !exists) && SetRef(didChangeSize);

      if (removed && entries.length === 1) {
        return; // undefined
      }

      if (!exists && !removed && entries.length >= MAX_ARRAY_MAP_SIZE) {
        return createNodes(ownerID, entries, key, value);
      }

      var isEditable = ownerID && ownerID === this.ownerID;
      var newEntries = isEditable ? entries : arrCopy(entries);

      if (exists) {
        if (removed) {
          idx === len - 1 ? newEntries.pop() : (newEntries[idx] = newEntries.pop());
        } else {
          newEntries[idx] = [key, value];
        }
      } else {
        newEntries.push([key, value]);
      }

      if (isEditable) {
        this.entries = newEntries;
        return this;
      }

      return new ArrayMapNode(ownerID, newEntries);
    };




    function BitmapIndexedNode(ownerID, bitmap, nodes) {
      this.ownerID = ownerID;
      this.bitmap = bitmap;
      this.nodes = nodes;
    }

    BitmapIndexedNode.prototype.get = function(shift, keyHash, key, notSetValue) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }
      var bit = (1 << ((shift === 0 ? keyHash : keyHash >>> shift) & MASK));
      var bitmap = this.bitmap;
      return (bitmap & bit) === 0 ? notSetValue :
        this.nodes[popCount(bitmap & (bit - 1))].get(shift + SHIFT, keyHash, key, notSetValue);
    };

    BitmapIndexedNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }
      var keyHashFrag = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
      var bit = 1 << keyHashFrag;
      var bitmap = this.bitmap;
      var exists = (bitmap & bit) !== 0;

      if (!exists && value === NOT_SET) {
        return this;
      }

      var idx = popCount(bitmap & (bit - 1));
      var nodes = this.nodes;
      var node = exists ? nodes[idx] : undefined;
      var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);

      if (newNode === node) {
        return this;
      }

      if (!exists && newNode && nodes.length >= MAX_BITMAP_INDEXED_SIZE) {
        return expandNodes(ownerID, nodes, bitmap, keyHashFrag, newNode);
      }

      if (exists && !newNode && nodes.length === 2 && isLeafNode(nodes[idx ^ 1])) {
        return nodes[idx ^ 1];
      }

      if (exists && newNode && nodes.length === 1 && isLeafNode(newNode)) {
        return newNode;
      }

      var isEditable = ownerID && ownerID === this.ownerID;
      var newBitmap = exists ? newNode ? bitmap : bitmap ^ bit : bitmap | bit;
      var newNodes = exists ? newNode ?
        setIn(nodes, idx, newNode, isEditable) :
        spliceOut(nodes, idx, isEditable) :
        spliceIn(nodes, idx, newNode, isEditable);

      if (isEditable) {
        this.bitmap = newBitmap;
        this.nodes = newNodes;
        return this;
      }

      return new BitmapIndexedNode(ownerID, newBitmap, newNodes);
    };




    function HashArrayMapNode(ownerID, count, nodes) {
      this.ownerID = ownerID;
      this.count = count;
      this.nodes = nodes;
    }

    HashArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }
      var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
      var node = this.nodes[idx];
      return node ? node.get(shift + SHIFT, keyHash, key, notSetValue) : notSetValue;
    };

    HashArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }
      var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
      var removed = value === NOT_SET;
      var nodes = this.nodes;
      var node = nodes[idx];

      if (removed && !node) {
        return this;
      }

      var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);
      if (newNode === node) {
        return this;
      }

      var newCount = this.count;
      if (!node) {
        newCount++;
      } else if (!newNode) {
        newCount--;
        if (newCount < MIN_HASH_ARRAY_MAP_SIZE) {
          return packNodes(ownerID, nodes, newCount, idx);
        }
      }

      var isEditable = ownerID && ownerID === this.ownerID;
      var newNodes = setIn(nodes, idx, newNode, isEditable);

      if (isEditable) {
        this.count = newCount;
        this.nodes = newNodes;
        return this;
      }

      return new HashArrayMapNode(ownerID, newCount, newNodes);
    };




    function HashCollisionNode(ownerID, keyHash, entries) {
      this.ownerID = ownerID;
      this.keyHash = keyHash;
      this.entries = entries;
    }

    HashCollisionNode.prototype.get = function(shift, keyHash, key, notSetValue) {
      var entries = this.entries;
      for (var ii = 0, len = entries.length; ii < len; ii++) {
        if (is(key, entries[ii][0])) {
          return entries[ii][1];
        }
      }
      return notSetValue;
    };

    HashCollisionNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }

      var removed = value === NOT_SET;

      if (keyHash !== this.keyHash) {
        if (removed) {
          return this;
        }
        SetRef(didAlter);
        SetRef(didChangeSize);
        return mergeIntoNode(this, ownerID, shift, keyHash, [key, value]);
      }

      var entries = this.entries;
      var idx = 0;
      for (var len = entries.length; idx < len; idx++) {
        if (is(key, entries[idx][0])) {
          break;
        }
      }
      var exists = idx < len;

      if (exists ? entries[idx][1] === value : removed) {
        return this;
      }

      SetRef(didAlter);
      (removed || !exists) && SetRef(didChangeSize);

      if (removed && len === 2) {
        return new ValueNode(ownerID, this.keyHash, entries[idx ^ 1]);
      }

      var isEditable = ownerID && ownerID === this.ownerID;
      var newEntries = isEditable ? entries : arrCopy(entries);

      if (exists) {
        if (removed) {
          idx === len - 1 ? newEntries.pop() : (newEntries[idx] = newEntries.pop());
        } else {
          newEntries[idx] = [key, value];
        }
      } else {
        newEntries.push([key, value]);
      }

      if (isEditable) {
        this.entries = newEntries;
        return this;
      }

      return new HashCollisionNode(ownerID, this.keyHash, newEntries);
    };




    function ValueNode(ownerID, keyHash, entry) {
      this.ownerID = ownerID;
      this.keyHash = keyHash;
      this.entry = entry;
    }

    ValueNode.prototype.get = function(shift, keyHash, key, notSetValue) {
      return is(key, this.entry[0]) ? this.entry[1] : notSetValue;
    };

    ValueNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      var removed = value === NOT_SET;
      var keyMatch = is(key, this.entry[0]);
      if (keyMatch ? value === this.entry[1] : removed) {
        return this;
      }

      SetRef(didAlter);

      if (removed) {
        SetRef(didChangeSize);
        return; // undefined
      }

      if (keyMatch) {
        if (ownerID && ownerID === this.ownerID) {
          this.entry[1] = value;
          return this;
        }
        return new ValueNode(ownerID, this.keyHash, [key, value]);
      }

      SetRef(didChangeSize);
      return mergeIntoNode(this, ownerID, shift, hash(key), [key, value]);
    };



  // #pragma Iterators

  ArrayMapNode.prototype.iterate =
  HashCollisionNode.prototype.iterate = function (fn, reverse) {
    var entries = this.entries;
    for (var ii = 0, maxIndex = entries.length - 1; ii <= maxIndex; ii++) {
      if (fn(entries[reverse ? maxIndex - ii : ii]) === false) {
        return false;
      }
    }
  }

  BitmapIndexedNode.prototype.iterate =
  HashArrayMapNode.prototype.iterate = function (fn, reverse) {
    var nodes = this.nodes;
    for (var ii = 0, maxIndex = nodes.length - 1; ii <= maxIndex; ii++) {
      var node = nodes[reverse ? maxIndex - ii : ii];
      if (node && node.iterate(fn, reverse) === false) {
        return false;
      }
    }
  }

  ValueNode.prototype.iterate = function (fn, reverse) {
    return fn(this.entry);
  }

  createClass(MapIterator, Iterator);

    function MapIterator(map, type, reverse) {
      this._type = type;
      this._reverse = reverse;
      this._stack = map._root && mapIteratorFrame(map._root);
    }

    MapIterator.prototype.next = function() {
      var type = this._type;
      var stack = this._stack;
      while (stack) {
        var node = stack.node;
        var index = stack.index++;
        var maxIndex;
        if (node.entry) {
          if (index === 0) {
            return mapIteratorValue(type, node.entry);
          }
        } else if (node.entries) {
          maxIndex = node.entries.length - 1;
          if (index <= maxIndex) {
            return mapIteratorValue(type, node.entries[this._reverse ? maxIndex - index : index]);
          }
        } else {
          maxIndex = node.nodes.length - 1;
          if (index <= maxIndex) {
            var subNode = node.nodes[this._reverse ? maxIndex - index : index];
            if (subNode) {
              if (subNode.entry) {
                return mapIteratorValue(type, subNode.entry);
              }
              stack = this._stack = mapIteratorFrame(subNode, stack);
            }
            continue;
          }
        }
        stack = this._stack = this._stack.__prev;
      }
      return iteratorDone();
    };


  function mapIteratorValue(type, entry) {
    return iteratorValue(type, entry[0], entry[1]);
  }

  function mapIteratorFrame(node, prev) {
    return {
      node: node,
      index: 0,
      __prev: prev
    };
  }

  function makeMap(size, root, ownerID, hash) {
    var map = Object.create(MapPrototype);
    map.size = size;
    map._root = root;
    map.__ownerID = ownerID;
    map.__hash = hash;
    map.__altered = false;
    return map;
  }

  var EMPTY_MAP;
  function emptyMap() {
    return EMPTY_MAP || (EMPTY_MAP = makeMap(0));
  }

  function updateMap(map, k, v) {
    var newRoot;
    var newSize;
    if (!map._root) {
      if (v === NOT_SET) {
        return map;
      }
      newSize = 1;
      newRoot = new ArrayMapNode(map.__ownerID, [[k, v]]);
    } else {
      var didChangeSize = MakeRef(CHANGE_LENGTH);
      var didAlter = MakeRef(DID_ALTER);
      newRoot = updateNode(map._root, map.__ownerID, 0, undefined, k, v, didChangeSize, didAlter);
      if (!didAlter.value) {
        return map;
      }
      newSize = map.size + (didChangeSize.value ? v === NOT_SET ? -1 : 1 : 0);
    }
    if (map.__ownerID) {
      map.size = newSize;
      map._root = newRoot;
      map.__hash = undefined;
      map.__altered = true;
      return map;
    }
    return newRoot ? makeMap(newSize, newRoot) : emptyMap();
  }

  function updateNode(node, ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
    if (!node) {
      if (value === NOT_SET) {
        return node;
      }
      SetRef(didAlter);
      SetRef(didChangeSize);
      return new ValueNode(ownerID, keyHash, [key, value]);
    }
    return node.update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter);
  }

  function isLeafNode(node) {
    return node.constructor === ValueNode || node.constructor === HashCollisionNode;
  }

  function mergeIntoNode(node, ownerID, shift, keyHash, entry) {
    if (node.keyHash === keyHash) {
      return new HashCollisionNode(ownerID, keyHash, [node.entry, entry]);
    }

    var idx1 = (shift === 0 ? node.keyHash : node.keyHash >>> shift) & MASK;
    var idx2 = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;

    var newNode;
    var nodes = idx1 === idx2 ?
      [mergeIntoNode(node, ownerID, shift + SHIFT, keyHash, entry)] :
      ((newNode = new ValueNode(ownerID, keyHash, entry)), idx1 < idx2 ? [node, newNode] : [newNode, node]);

    return new BitmapIndexedNode(ownerID, (1 << idx1) | (1 << idx2), nodes);
  }

  function createNodes(ownerID, entries, key, value) {
    if (!ownerID) {
      ownerID = new OwnerID();
    }
    var node = new ValueNode(ownerID, hash(key), [key, value]);
    for (var ii = 0; ii < entries.length; ii++) {
      var entry = entries[ii];
      node = node.update(ownerID, 0, undefined, entry[0], entry[1]);
    }
    return node;
  }

  function packNodes(ownerID, nodes, count, excluding) {
    var bitmap = 0;
    var packedII = 0;
    var packedNodes = new Array(count);
    for (var ii = 0, bit = 1, len = nodes.length; ii < len; ii++, bit <<= 1) {
      var node = nodes[ii];
      if (node !== undefined && ii !== excluding) {
        bitmap |= bit;
        packedNodes[packedII++] = node;
      }
    }
    return new BitmapIndexedNode(ownerID, bitmap, packedNodes);
  }

  function expandNodes(ownerID, nodes, bitmap, including, node) {
    var count = 0;
    var expandedNodes = new Array(SIZE);
    for (var ii = 0; bitmap !== 0; ii++, bitmap >>>= 1) {
      expandedNodes[ii] = bitmap & 1 ? nodes[count++] : undefined;
    }
    expandedNodes[including] = node;
    return new HashArrayMapNode(ownerID, count + 1, expandedNodes);
  }

  function mergeIntoMapWith(map, merger, iterables) {
    var iters = [];
    for (var ii = 0; ii < iterables.length; ii++) {
      var value = iterables[ii];
      var iter = KeyedIterable(value);
      if (!isIterable(value)) {
        iter = iter.map(function(v ) {return fromJS(v)});
      }
      iters.push(iter);
    }
    return mergeIntoCollectionWith(map, merger, iters);
  }

  function deepMerger(existing, value, key) {
    return existing && existing.mergeDeep && isIterable(value) ?
      existing.mergeDeep(value) :
      is(existing, value) ? existing : value;
  }

  function deepMergerWith(merger) {
    return function(existing, value, key)  {
      if (existing && existing.mergeDeepWith && isIterable(value)) {
        return existing.mergeDeepWith(merger, value);
      }
      var nextValue = merger(existing, value, key);
      return is(existing, nextValue) ? existing : nextValue;
    };
  }

  function mergeIntoCollectionWith(collection, merger, iters) {
    iters = iters.filter(function(x ) {return x.size !== 0});
    if (iters.length === 0) {
      return collection;
    }
    if (collection.size === 0 && !collection.__ownerID && iters.length === 1) {
      return collection.constructor(iters[0]);
    }
    return collection.withMutations(function(collection ) {
      var mergeIntoMap = merger ?
        function(value, key)  {
          collection.update(key, NOT_SET, function(existing )
            {return existing === NOT_SET ? value : merger(existing, value, key)}
          );
        } :
        function(value, key)  {
          collection.set(key, value);
        }
      for (var ii = 0; ii < iters.length; ii++) {
        iters[ii].forEach(mergeIntoMap);
      }
    });
  }

  function updateInDeepMap(existing, keyPathIter, notSetValue, updater) {
    var isNotSet = existing === NOT_SET;
    var step = keyPathIter.next();
    if (step.done) {
      var existingValue = isNotSet ? notSetValue : existing;
      var newValue = updater(existingValue);
      return newValue === existingValue ? existing : newValue;
    }
    invariant(
      isNotSet || (existing && existing.set),
      'invalid keyPath'
    );
    var key = step.value;
    var nextExisting = isNotSet ? NOT_SET : existing.get(key, NOT_SET);
    var nextUpdated = updateInDeepMap(
      nextExisting,
      keyPathIter,
      notSetValue,
      updater
    );
    return nextUpdated === nextExisting ? existing :
      nextUpdated === NOT_SET ? existing.remove(key) :
      (isNotSet ? emptyMap() : existing).set(key, nextUpdated);
  }

  function popCount(x) {
    x = x - ((x >> 1) & 0x55555555);
    x = (x & 0x33333333) + ((x >> 2) & 0x33333333);
    x = (x + (x >> 4)) & 0x0f0f0f0f;
    x = x + (x >> 8);
    x = x + (x >> 16);
    return x & 0x7f;
  }

  function setIn(array, idx, val, canEdit) {
    var newArray = canEdit ? array : arrCopy(array);
    newArray[idx] = val;
    return newArray;
  }

  function spliceIn(array, idx, val, canEdit) {
    var newLen = array.length + 1;
    if (canEdit && idx + 1 === newLen) {
      array[idx] = val;
      return array;
    }
    var newArray = new Array(newLen);
    var after = 0;
    for (var ii = 0; ii < newLen; ii++) {
      if (ii === idx) {
        newArray[ii] = val;
        after = -1;
      } else {
        newArray[ii] = array[ii + after];
      }
    }
    return newArray;
  }

  function spliceOut(array, idx, canEdit) {
    var newLen = array.length - 1;
    if (canEdit && idx === newLen) {
      array.pop();
      return array;
    }
    var newArray = new Array(newLen);
    var after = 0;
    for (var ii = 0; ii < newLen; ii++) {
      if (ii === idx) {
        after = 1;
      }
      newArray[ii] = array[ii + after];
    }
    return newArray;
  }

  var MAX_ARRAY_MAP_SIZE = SIZE / 4;
  var MAX_BITMAP_INDEXED_SIZE = SIZE / 2;
  var MIN_HASH_ARRAY_MAP_SIZE = SIZE / 4;

  createClass(List, IndexedCollection);

    // @pragma Construction

    function List(value) {
      var empty = emptyList();
      if (value === null || value === undefined) {
        return empty;
      }
      if (isList(value)) {
        return value;
      }
      var iter = IndexedIterable(value);
      var size = iter.size;
      if (size === 0) {
        return empty;
      }
      assertNotInfinite(size);
      if (size > 0 && size < SIZE) {
        return makeList(0, size, SHIFT, null, new VNode(iter.toArray()));
      }
      return empty.withMutations(function(list ) {
        list.setSize(size);
        iter.forEach(function(v, i)  {return list.set(i, v)});
      });
    }

    List.of = function(/*...values*/) {
      return this(arguments);
    };

    List.prototype.toString = function() {
      return this.__toString('List [', ']');
    };

    // @pragma Access

    List.prototype.get = function(index, notSetValue) {
      index = wrapIndex(this, index);
      if (index >= 0 && index < this.size) {
        index += this._origin;
        var node = listNodeFor(this, index);
        return node && node.array[index & MASK];
      }
      return notSetValue;
    };

    // @pragma Modification

    List.prototype.set = function(index, value) {
      return updateList(this, index, value);
    };

    List.prototype.remove = function(index) {
      return !this.has(index) ? this :
        index === 0 ? this.shift() :
        index === this.size - 1 ? this.pop() :
        this.splice(index, 1);
    };

    List.prototype.insert = function(index, value) {
      return this.splice(index, 0, value);
    };

    List.prototype.clear = function() {
      if (this.size === 0) {
        return this;
      }
      if (this.__ownerID) {
        this.size = this._origin = this._capacity = 0;
        this._level = SHIFT;
        this._root = this._tail = null;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return emptyList();
    };

    List.prototype.push = function(/*...values*/) {
      var values = arguments;
      var oldSize = this.size;
      return this.withMutations(function(list ) {
        setListBounds(list, 0, oldSize + values.length);
        for (var ii = 0; ii < values.length; ii++) {
          list.set(oldSize + ii, values[ii]);
        }
      });
    };

    List.prototype.pop = function() {
      return setListBounds(this, 0, -1);
    };

    List.prototype.unshift = function(/*...values*/) {
      var values = arguments;
      return this.withMutations(function(list ) {
        setListBounds(list, -values.length);
        for (var ii = 0; ii < values.length; ii++) {
          list.set(ii, values[ii]);
        }
      });
    };

    List.prototype.shift = function() {
      return setListBounds(this, 1);
    };

    // @pragma Composition

    List.prototype.merge = function(/*...iters*/) {
      return mergeIntoListWith(this, undefined, arguments);
    };

    List.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
      return mergeIntoListWith(this, merger, iters);
    };

    List.prototype.mergeDeep = function(/*...iters*/) {
      return mergeIntoListWith(this, deepMerger, arguments);
    };

    List.prototype.mergeDeepWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
      return mergeIntoListWith(this, deepMergerWith(merger), iters);
    };

    List.prototype.setSize = function(size) {
      return setListBounds(this, 0, size);
    };

    // @pragma Iteration

    List.prototype.slice = function(begin, end) {
      var size = this.size;
      if (wholeSlice(begin, end, size)) {
        return this;
      }
      return setListBounds(
        this,
        resolveBegin(begin, size),
        resolveEnd(end, size)
      );
    };

    List.prototype.__iterator = function(type, reverse) {
      var index = 0;
      var values = iterateList(this, reverse);
      return new Iterator(function()  {
        var value = values();
        return value === DONE ?
          iteratorDone() :
          iteratorValue(type, index++, value);
      });
    };

    List.prototype.__iterate = function(fn, reverse) {
      var index = 0;
      var values = iterateList(this, reverse);
      var value;
      while ((value = values()) !== DONE) {
        if (fn(value, index++, this) === false) {
          break;
        }
      }
      return index;
    };

    List.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      if (!ownerID) {
        this.__ownerID = ownerID;
        return this;
      }
      return makeList(this._origin, this._capacity, this._level, this._root, this._tail, ownerID, this.__hash);
    };


  function isList(maybeList) {
    return !!(maybeList && maybeList[IS_LIST_SENTINEL]);
  }

  List.isList = isList;

  var IS_LIST_SENTINEL = '@@__IMMUTABLE_LIST__@@';

  var ListPrototype = List.prototype;
  ListPrototype[IS_LIST_SENTINEL] = true;
  ListPrototype[DELETE] = ListPrototype.remove;
  ListPrototype.setIn = MapPrototype.setIn;
  ListPrototype.deleteIn =
  ListPrototype.removeIn = MapPrototype.removeIn;
  ListPrototype.update = MapPrototype.update;
  ListPrototype.updateIn = MapPrototype.updateIn;
  ListPrototype.mergeIn = MapPrototype.mergeIn;
  ListPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
  ListPrototype.withMutations = MapPrototype.withMutations;
  ListPrototype.asMutable = MapPrototype.asMutable;
  ListPrototype.asImmutable = MapPrototype.asImmutable;
  ListPrototype.wasAltered = MapPrototype.wasAltered;



    function VNode(array, ownerID) {
      this.array = array;
      this.ownerID = ownerID;
    }

    // TODO: seems like these methods are very similar

    VNode.prototype.removeBefore = function(ownerID, level, index) {
      if (index === level ? 1 << level : 0 || this.array.length === 0) {
        return this;
      }
      var originIndex = (index >>> level) & MASK;
      if (originIndex >= this.array.length) {
        return new VNode([], ownerID);
      }
      var removingFirst = originIndex === 0;
      var newChild;
      if (level > 0) {
        var oldChild = this.array[originIndex];
        newChild = oldChild && oldChild.removeBefore(ownerID, level - SHIFT, index);
        if (newChild === oldChild && removingFirst) {
          return this;
        }
      }
      if (removingFirst && !newChild) {
        return this;
      }
      var editable = editableVNode(this, ownerID);
      if (!removingFirst) {
        for (var ii = 0; ii < originIndex; ii++) {
          editable.array[ii] = undefined;
        }
      }
      if (newChild) {
        editable.array[originIndex] = newChild;
      }
      return editable;
    };

    VNode.prototype.removeAfter = function(ownerID, level, index) {
      if (index === (level ? 1 << level : 0) || this.array.length === 0) {
        return this;
      }
      var sizeIndex = ((index - 1) >>> level) & MASK;
      if (sizeIndex >= this.array.length) {
        return this;
      }

      var newChild;
      if (level > 0) {
        var oldChild = this.array[sizeIndex];
        newChild = oldChild && oldChild.removeAfter(ownerID, level - SHIFT, index);
        if (newChild === oldChild && sizeIndex === this.array.length - 1) {
          return this;
        }
      }

      var editable = editableVNode(this, ownerID);
      editable.array.splice(sizeIndex + 1);
      if (newChild) {
        editable.array[sizeIndex] = newChild;
      }
      return editable;
    };



  var DONE = {};

  function iterateList(list, reverse) {
    var left = list._origin;
    var right = list._capacity;
    var tailPos = getTailOffset(right);
    var tail = list._tail;

    return iterateNodeOrLeaf(list._root, list._level, 0);

    function iterateNodeOrLeaf(node, level, offset) {
      return level === 0 ?
        iterateLeaf(node, offset) :
        iterateNode(node, level, offset);
    }

    function iterateLeaf(node, offset) {
      var array = offset === tailPos ? tail && tail.array : node && node.array;
      var from = offset > left ? 0 : left - offset;
      var to = right - offset;
      if (to > SIZE) {
        to = SIZE;
      }
      return function()  {
        if (from === to) {
          return DONE;
        }
        var idx = reverse ? --to : from++;
        return array && array[idx];
      };
    }

    function iterateNode(node, level, offset) {
      var values;
      var array = node && node.array;
      var from = offset > left ? 0 : (left - offset) >> level;
      var to = ((right - offset) >> level) + 1;
      if (to > SIZE) {
        to = SIZE;
      }
      return function()  {
        do {
          if (values) {
            var value = values();
            if (value !== DONE) {
              return value;
            }
            values = null;
          }
          if (from === to) {
            return DONE;
          }
          var idx = reverse ? --to : from++;
          values = iterateNodeOrLeaf(
            array && array[idx], level - SHIFT, offset + (idx << level)
          );
        } while (true);
      };
    }
  }

  function makeList(origin, capacity, level, root, tail, ownerID, hash) {
    var list = Object.create(ListPrototype);
    list.size = capacity - origin;
    list._origin = origin;
    list._capacity = capacity;
    list._level = level;
    list._root = root;
    list._tail = tail;
    list.__ownerID = ownerID;
    list.__hash = hash;
    list.__altered = false;
    return list;
  }

  var EMPTY_LIST;
  function emptyList() {
    return EMPTY_LIST || (EMPTY_LIST = makeList(0, 0, SHIFT));
  }

  function updateList(list, index, value) {
    index = wrapIndex(list, index);

    if (index !== index) {
      return list;
    }

    if (index >= list.size || index < 0) {
      return list.withMutations(function(list ) {
        index < 0 ?
          setListBounds(list, index).set(0, value) :
          setListBounds(list, 0, index + 1).set(index, value)
      });
    }

    index += list._origin;

    var newTail = list._tail;
    var newRoot = list._root;
    var didAlter = MakeRef(DID_ALTER);
    if (index >= getTailOffset(list._capacity)) {
      newTail = updateVNode(newTail, list.__ownerID, 0, index, value, didAlter);
    } else {
      newRoot = updateVNode(newRoot, list.__ownerID, list._level, index, value, didAlter);
    }

    if (!didAlter.value) {
      return list;
    }

    if (list.__ownerID) {
      list._root = newRoot;
      list._tail = newTail;
      list.__hash = undefined;
      list.__altered = true;
      return list;
    }
    return makeList(list._origin, list._capacity, list._level, newRoot, newTail);
  }

  function updateVNode(node, ownerID, level, index, value, didAlter) {
    var idx = (index >>> level) & MASK;
    var nodeHas = node && idx < node.array.length;
    if (!nodeHas && value === undefined) {
      return node;
    }

    var newNode;

    if (level > 0) {
      var lowerNode = node && node.array[idx];
      var newLowerNode = updateVNode(lowerNode, ownerID, level - SHIFT, index, value, didAlter);
      if (newLowerNode === lowerNode) {
        return node;
      }
      newNode = editableVNode(node, ownerID);
      newNode.array[idx] = newLowerNode;
      return newNode;
    }

    if (nodeHas && node.array[idx] === value) {
      return node;
    }

    SetRef(didAlter);

    newNode = editableVNode(node, ownerID);
    if (value === undefined && idx === newNode.array.length - 1) {
      newNode.array.pop();
    } else {
      newNode.array[idx] = value;
    }
    return newNode;
  }

  function editableVNode(node, ownerID) {
    if (ownerID && node && ownerID === node.ownerID) {
      return node;
    }
    return new VNode(node ? node.array.slice() : [], ownerID);
  }

  function listNodeFor(list, rawIndex) {
    if (rawIndex >= getTailOffset(list._capacity)) {
      return list._tail;
    }
    if (rawIndex < 1 << (list._level + SHIFT)) {
      var node = list._root;
      var level = list._level;
      while (node && level > 0) {
        node = node.array[(rawIndex >>> level) & MASK];
        level -= SHIFT;
      }
      return node;
    }
  }

  function setListBounds(list, begin, end) {
    // Sanitize begin & end using this shorthand for ToInt32(argument)
    // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
    if (begin !== undefined) {
      begin = begin | 0;
    }
    if (end !== undefined) {
      end = end | 0;
    }
    var owner = list.__ownerID || new OwnerID();
    var oldOrigin = list._origin;
    var oldCapacity = list._capacity;
    var newOrigin = oldOrigin + begin;
    var newCapacity = end === undefined ? oldCapacity : end < 0 ? oldCapacity + end : oldOrigin + end;
    if (newOrigin === oldOrigin && newCapacity === oldCapacity) {
      return list;
    }

    // If it's going to end after it starts, it's empty.
    if (newOrigin >= newCapacity) {
      return list.clear();
    }

    var newLevel = list._level;
    var newRoot = list._root;

    // New origin might need creating a higher root.
    var offsetShift = 0;
    while (newOrigin + offsetShift < 0) {
      newRoot = new VNode(newRoot && newRoot.array.length ? [undefined, newRoot] : [], owner);
      newLevel += SHIFT;
      offsetShift += 1 << newLevel;
    }
    if (offsetShift) {
      newOrigin += offsetShift;
      oldOrigin += offsetShift;
      newCapacity += offsetShift;
      oldCapacity += offsetShift;
    }

    var oldTailOffset = getTailOffset(oldCapacity);
    var newTailOffset = getTailOffset(newCapacity);

    // New size might need creating a higher root.
    while (newTailOffset >= 1 << (newLevel + SHIFT)) {
      newRoot = new VNode(newRoot && newRoot.array.length ? [newRoot] : [], owner);
      newLevel += SHIFT;
    }

    // Locate or create the new tail.
    var oldTail = list._tail;
    var newTail = newTailOffset < oldTailOffset ?
      listNodeFor(list, newCapacity - 1) :
      newTailOffset > oldTailOffset ? new VNode([], owner) : oldTail;

    // Merge Tail into tree.
    if (oldTail && newTailOffset > oldTailOffset && newOrigin < oldCapacity && oldTail.array.length) {
      newRoot = editableVNode(newRoot, owner);
      var node = newRoot;
      for (var level = newLevel; level > SHIFT; level -= SHIFT) {
        var idx = (oldTailOffset >>> level) & MASK;
        node = node.array[idx] = editableVNode(node.array[idx], owner);
      }
      node.array[(oldTailOffset >>> SHIFT) & MASK] = oldTail;
    }

    // If the size has been reduced, there's a chance the tail needs to be trimmed.
    if (newCapacity < oldCapacity) {
      newTail = newTail && newTail.removeAfter(owner, 0, newCapacity);
    }

    // If the new origin is within the tail, then we do not need a root.
    if (newOrigin >= newTailOffset) {
      newOrigin -= newTailOffset;
      newCapacity -= newTailOffset;
      newLevel = SHIFT;
      newRoot = null;
      newTail = newTail && newTail.removeBefore(owner, 0, newOrigin);

    // Otherwise, if the root has been trimmed, garbage collect.
    } else if (newOrigin > oldOrigin || newTailOffset < oldTailOffset) {
      offsetShift = 0;

      // Identify the new top root node of the subtree of the old root.
      while (newRoot) {
        var beginIndex = (newOrigin >>> newLevel) & MASK;
        if (beginIndex !== (newTailOffset >>> newLevel) & MASK) {
          break;
        }
        if (beginIndex) {
          offsetShift += (1 << newLevel) * beginIndex;
        }
        newLevel -= SHIFT;
        newRoot = newRoot.array[beginIndex];
      }

      // Trim the new sides of the new root.
      if (newRoot && newOrigin > oldOrigin) {
        newRoot = newRoot.removeBefore(owner, newLevel, newOrigin - offsetShift);
      }
      if (newRoot && newTailOffset < oldTailOffset) {
        newRoot = newRoot.removeAfter(owner, newLevel, newTailOffset - offsetShift);
      }
      if (offsetShift) {
        newOrigin -= offsetShift;
        newCapacity -= offsetShift;
      }
    }

    if (list.__ownerID) {
      list.size = newCapacity - newOrigin;
      list._origin = newOrigin;
      list._capacity = newCapacity;
      list._level = newLevel;
      list._root = newRoot;
      list._tail = newTail;
      list.__hash = undefined;
      list.__altered = true;
      return list;
    }
    return makeList(newOrigin, newCapacity, newLevel, newRoot, newTail);
  }

  function mergeIntoListWith(list, merger, iterables) {
    var iters = [];
    var maxSize = 0;
    for (var ii = 0; ii < iterables.length; ii++) {
      var value = iterables[ii];
      var iter = IndexedIterable(value);
      if (iter.size > maxSize) {
        maxSize = iter.size;
      }
      if (!isIterable(value)) {
        iter = iter.map(function(v ) {return fromJS(v)});
      }
      iters.push(iter);
    }
    if (maxSize > list.size) {
      list = list.setSize(maxSize);
    }
    return mergeIntoCollectionWith(list, merger, iters);
  }

  function getTailOffset(size) {
    return size < SIZE ? 0 : (((size - 1) >>> SHIFT) << SHIFT);
  }

  createClass(OrderedMap, Map);

    // @pragma Construction

    function OrderedMap(value) {
      return value === null || value === undefined ? emptyOrderedMap() :
        isOrderedMap(value) ? value :
        emptyOrderedMap().withMutations(function(map ) {
          var iter = KeyedIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function(v, k)  {return map.set(k, v)});
        });
    }

    OrderedMap.of = function(/*...values*/) {
      return this(arguments);
    };

    OrderedMap.prototype.toString = function() {
      return this.__toString('OrderedMap {', '}');
    };

    // @pragma Access

    OrderedMap.prototype.get = function(k, notSetValue) {
      var index = this._map.get(k);
      return index !== undefined ? this._list.get(index)[1] : notSetValue;
    };

    // @pragma Modification

    OrderedMap.prototype.clear = function() {
      if (this.size === 0) {
        return this;
      }
      if (this.__ownerID) {
        this.size = 0;
        this._map.clear();
        this._list.clear();
        return this;
      }
      return emptyOrderedMap();
    };

    OrderedMap.prototype.set = function(k, v) {
      return updateOrderedMap(this, k, v);
    };

    OrderedMap.prototype.remove = function(k) {
      return updateOrderedMap(this, k, NOT_SET);
    };

    OrderedMap.prototype.wasAltered = function() {
      return this._map.wasAltered() || this._list.wasAltered();
    };

    OrderedMap.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      return this._list.__iterate(
        function(entry ) {return entry && fn(entry[1], entry[0], this$0)},
        reverse
      );
    };

    OrderedMap.prototype.__iterator = function(type, reverse) {
      return this._list.fromEntrySeq().__iterator(type, reverse);
    };

    OrderedMap.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      var newMap = this._map.__ensureOwner(ownerID);
      var newList = this._list.__ensureOwner(ownerID);
      if (!ownerID) {
        this.__ownerID = ownerID;
        this._map = newMap;
        this._list = newList;
        return this;
      }
      return makeOrderedMap(newMap, newList, ownerID, this.__hash);
    };


  function isOrderedMap(maybeOrderedMap) {
    return isMap(maybeOrderedMap) && isOrdered(maybeOrderedMap);
  }

  OrderedMap.isOrderedMap = isOrderedMap;

  OrderedMap.prototype[IS_ORDERED_SENTINEL] = true;
  OrderedMap.prototype[DELETE] = OrderedMap.prototype.remove;



  function makeOrderedMap(map, list, ownerID, hash) {
    var omap = Object.create(OrderedMap.prototype);
    omap.size = map ? map.size : 0;
    omap._map = map;
    omap._list = list;
    omap.__ownerID = ownerID;
    omap.__hash = hash;
    return omap;
  }

  var EMPTY_ORDERED_MAP;
  function emptyOrderedMap() {
    return EMPTY_ORDERED_MAP || (EMPTY_ORDERED_MAP = makeOrderedMap(emptyMap(), emptyList()));
  }

  function updateOrderedMap(omap, k, v) {
    var map = omap._map;
    var list = omap._list;
    var i = map.get(k);
    var has = i !== undefined;
    var newMap;
    var newList;
    if (v === NOT_SET) { // removed
      if (!has) {
        return omap;
      }
      if (list.size >= SIZE && list.size >= map.size * 2) {
        newList = list.filter(function(entry, idx)  {return entry !== undefined && i !== idx});
        newMap = newList.toKeyedSeq().map(function(entry ) {return entry[0]}).flip().toMap();
        if (omap.__ownerID) {
          newMap.__ownerID = newList.__ownerID = omap.__ownerID;
        }
      } else {
        newMap = map.remove(k);
        newList = i === list.size - 1 ? list.pop() : list.set(i, undefined);
      }
    } else {
      if (has) {
        if (v === list.get(i)[1]) {
          return omap;
        }
        newMap = map;
        newList = list.set(i, [k, v]);
      } else {
        newMap = map.set(k, list.size);
        newList = list.set(list.size, [k, v]);
      }
    }
    if (omap.__ownerID) {
      omap.size = newMap.size;
      omap._map = newMap;
      omap._list = newList;
      omap.__hash = undefined;
      return omap;
    }
    return makeOrderedMap(newMap, newList);
  }

  createClass(ToKeyedSequence, KeyedSeq);
    function ToKeyedSequence(indexed, useKeys) {
      this._iter = indexed;
      this._useKeys = useKeys;
      this.size = indexed.size;
    }

    ToKeyedSequence.prototype.get = function(key, notSetValue) {
      return this._iter.get(key, notSetValue);
    };

    ToKeyedSequence.prototype.has = function(key) {
      return this._iter.has(key);
    };

    ToKeyedSequence.prototype.valueSeq = function() {
      return this._iter.valueSeq();
    };

    ToKeyedSequence.prototype.reverse = function() {var this$0 = this;
      var reversedSequence = reverseFactory(this, true);
      if (!this._useKeys) {
        reversedSequence.valueSeq = function()  {return this$0._iter.toSeq().reverse()};
      }
      return reversedSequence;
    };

    ToKeyedSequence.prototype.map = function(mapper, context) {var this$0 = this;
      var mappedSequence = mapFactory(this, mapper, context);
      if (!this._useKeys) {
        mappedSequence.valueSeq = function()  {return this$0._iter.toSeq().map(mapper, context)};
      }
      return mappedSequence;
    };

    ToKeyedSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      var ii;
      return this._iter.__iterate(
        this._useKeys ?
          function(v, k)  {return fn(v, k, this$0)} :
          ((ii = reverse ? resolveSize(this) : 0),
            function(v ) {return fn(v, reverse ? --ii : ii++, this$0)}),
        reverse
      );
    };

    ToKeyedSequence.prototype.__iterator = function(type, reverse) {
      if (this._useKeys) {
        return this._iter.__iterator(type, reverse);
      }
      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
      var ii = reverse ? resolveSize(this) : 0;
      return new Iterator(function()  {
        var step = iterator.next();
        return step.done ? step :
          iteratorValue(type, reverse ? --ii : ii++, step.value, step);
      });
    };

  ToKeyedSequence.prototype[IS_ORDERED_SENTINEL] = true;


  createClass(ToIndexedSequence, IndexedSeq);
    function ToIndexedSequence(iter) {
      this._iter = iter;
      this.size = iter.size;
    }

    ToIndexedSequence.prototype.includes = function(value) {
      return this._iter.includes(value);
    };

    ToIndexedSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      var iterations = 0;
      return this._iter.__iterate(function(v ) {return fn(v, iterations++, this$0)}, reverse);
    };

    ToIndexedSequence.prototype.__iterator = function(type, reverse) {
      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
      var iterations = 0;
      return new Iterator(function()  {
        var step = iterator.next();
        return step.done ? step :
          iteratorValue(type, iterations++, step.value, step)
      });
    };



  createClass(ToSetSequence, SetSeq);
    function ToSetSequence(iter) {
      this._iter = iter;
      this.size = iter.size;
    }

    ToSetSequence.prototype.has = function(key) {
      return this._iter.includes(key);
    };

    ToSetSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      return this._iter.__iterate(function(v ) {return fn(v, v, this$0)}, reverse);
    };

    ToSetSequence.prototype.__iterator = function(type, reverse) {
      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
      return new Iterator(function()  {
        var step = iterator.next();
        return step.done ? step :
          iteratorValue(type, step.value, step.value, step);
      });
    };



  createClass(FromEntriesSequence, KeyedSeq);
    function FromEntriesSequence(entries) {
      this._iter = entries;
      this.size = entries.size;
    }

    FromEntriesSequence.prototype.entrySeq = function() {
      return this._iter.toSeq();
    };

    FromEntriesSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      return this._iter.__iterate(function(entry ) {
        // Check if entry exists first so array access doesn't throw for holes
        // in the parent iteration.
        if (entry) {
          validateEntry(entry);
          var indexedIterable = isIterable(entry);
          return fn(
            indexedIterable ? entry.get(1) : entry[1],
            indexedIterable ? entry.get(0) : entry[0],
            this$0
          );
        }
      }, reverse);
    };

    FromEntriesSequence.prototype.__iterator = function(type, reverse) {
      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
      return new Iterator(function()  {
        while (true) {
          var step = iterator.next();
          if (step.done) {
            return step;
          }
          var entry = step.value;
          // Check if entry exists first so array access doesn't throw for holes
          // in the parent iteration.
          if (entry) {
            validateEntry(entry);
            var indexedIterable = isIterable(entry);
            return iteratorValue(
              type,
              indexedIterable ? entry.get(0) : entry[0],
              indexedIterable ? entry.get(1) : entry[1],
              step
            );
          }
        }
      });
    };


  ToIndexedSequence.prototype.cacheResult =
  ToKeyedSequence.prototype.cacheResult =
  ToSetSequence.prototype.cacheResult =
  FromEntriesSequence.prototype.cacheResult =
    cacheResultThrough;


  function flipFactory(iterable) {
    var flipSequence = makeSequence(iterable);
    flipSequence._iter = iterable;
    flipSequence.size = iterable.size;
    flipSequence.flip = function()  {return iterable};
    flipSequence.reverse = function () {
      var reversedSequence = iterable.reverse.apply(this); // super.reverse()
      reversedSequence.flip = function()  {return iterable.reverse()};
      return reversedSequence;
    };
    flipSequence.has = function(key ) {return iterable.includes(key)};
    flipSequence.includes = function(key ) {return iterable.has(key)};
    flipSequence.cacheResult = cacheResultThrough;
    flipSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
      return iterable.__iterate(function(v, k)  {return fn(k, v, this$0) !== false}, reverse);
    }
    flipSequence.__iteratorUncached = function(type, reverse) {
      if (type === ITERATE_ENTRIES) {
        var iterator = iterable.__iterator(type, reverse);
        return new Iterator(function()  {
          var step = iterator.next();
          if (!step.done) {
            var k = step.value[0];
            step.value[0] = step.value[1];
            step.value[1] = k;
          }
          return step;
        });
      }
      return iterable.__iterator(
        type === ITERATE_VALUES ? ITERATE_KEYS : ITERATE_VALUES,
        reverse
      );
    }
    return flipSequence;
  }


  function mapFactory(iterable, mapper, context) {
    var mappedSequence = makeSequence(iterable);
    mappedSequence.size = iterable.size;
    mappedSequence.has = function(key ) {return iterable.has(key)};
    mappedSequence.get = function(key, notSetValue)  {
      var v = iterable.get(key, NOT_SET);
      return v === NOT_SET ?
        notSetValue :
        mapper.call(context, v, key, iterable);
    };
    mappedSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
      return iterable.__iterate(
        function(v, k, c)  {return fn(mapper.call(context, v, k, c), k, this$0) !== false},
        reverse
      );
    }
    mappedSequence.__iteratorUncached = function (type, reverse) {
      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
      return new Iterator(function()  {
        var step = iterator.next();
        if (step.done) {
          return step;
        }
        var entry = step.value;
        var key = entry[0];
        return iteratorValue(
          type,
          key,
          mapper.call(context, entry[1], key, iterable),
          step
        );
      });
    }
    return mappedSequence;
  }


  function reverseFactory(iterable, useKeys) {
    var reversedSequence = makeSequence(iterable);
    reversedSequence._iter = iterable;
    reversedSequence.size = iterable.size;
    reversedSequence.reverse = function()  {return iterable};
    if (iterable.flip) {
      reversedSequence.flip = function () {
        var flipSequence = flipFactory(iterable);
        flipSequence.reverse = function()  {return iterable.flip()};
        return flipSequence;
      };
    }
    reversedSequence.get = function(key, notSetValue) 
      {return iterable.get(useKeys ? key : -1 - key, notSetValue)};
    reversedSequence.has = function(key )
      {return iterable.has(useKeys ? key : -1 - key)};
    reversedSequence.includes = function(value ) {return iterable.includes(value)};
    reversedSequence.cacheResult = cacheResultThrough;
    reversedSequence.__iterate = function (fn, reverse) {var this$0 = this;
      return iterable.__iterate(function(v, k)  {return fn(v, k, this$0)}, !reverse);
    };
    reversedSequence.__iterator =
      function(type, reverse)  {return iterable.__iterator(type, !reverse)};
    return reversedSequence;
  }


  function filterFactory(iterable, predicate, context, useKeys) {
    var filterSequence = makeSequence(iterable);
    if (useKeys) {
      filterSequence.has = function(key ) {
        var v = iterable.get(key, NOT_SET);
        return v !== NOT_SET && !!predicate.call(context, v, key, iterable);
      };
      filterSequence.get = function(key, notSetValue)  {
        var v = iterable.get(key, NOT_SET);
        return v !== NOT_SET && predicate.call(context, v, key, iterable) ?
          v : notSetValue;
      };
    }
    filterSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
      var iterations = 0;
      iterable.__iterate(function(v, k, c)  {
        if (predicate.call(context, v, k, c)) {
          iterations++;
          return fn(v, useKeys ? k : iterations - 1, this$0);
        }
      }, reverse);
      return iterations;
    };
    filterSequence.__iteratorUncached = function (type, reverse) {
      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
      var iterations = 0;
      return new Iterator(function()  {
        while (true) {
          var step = iterator.next();
          if (step.done) {
            return step;
          }
          var entry = step.value;
          var key = entry[0];
          var value = entry[1];
          if (predicate.call(context, value, key, iterable)) {
            return iteratorValue(type, useKeys ? key : iterations++, value, step);
          }
        }
      });
    }
    return filterSequence;
  }


  function countByFactory(iterable, grouper, context) {
    var groups = Map().asMutable();
    iterable.__iterate(function(v, k)  {
      groups.update(
        grouper.call(context, v, k, iterable),
        0,
        function(a ) {return a + 1}
      );
    });
    return groups.asImmutable();
  }


  function groupByFactory(iterable, grouper, context) {
    var isKeyedIter = isKeyed(iterable);
    var groups = (isOrdered(iterable) ? OrderedMap() : Map()).asMutable();
    iterable.__iterate(function(v, k)  {
      groups.update(
        grouper.call(context, v, k, iterable),
        function(a ) {return (a = a || [], a.push(isKeyedIter ? [k, v] : v), a)}
      );
    });
    var coerce = iterableClass(iterable);
    return groups.map(function(arr ) {return reify(iterable, coerce(arr))});
  }


  function sliceFactory(iterable, begin, end, useKeys) {
    var originalSize = iterable.size;

    // Sanitize begin & end using this shorthand for ToInt32(argument)
    // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
    if (begin !== undefined) {
      begin = begin | 0;
    }
    if (end !== undefined) {
      if (end === Infinity) {
        end = originalSize;
      } else {
        end = end | 0;
      }
    }

    if (wholeSlice(begin, end, originalSize)) {
      return iterable;
    }

    var resolvedBegin = resolveBegin(begin, originalSize);
    var resolvedEnd = resolveEnd(end, originalSize);

    // begin or end will be NaN if they were provided as negative numbers and
    // this iterable's size is unknown. In that case, cache first so there is
    // a known size and these do not resolve to NaN.
    if (resolvedBegin !== resolvedBegin || resolvedEnd !== resolvedEnd) {
      return sliceFactory(iterable.toSeq().cacheResult(), begin, end, useKeys);
    }

    // Note: resolvedEnd is undefined when the original sequence's length is
    // unknown and this slice did not supply an end and should contain all
    // elements after resolvedBegin.
    // In that case, resolvedSize will be NaN and sliceSize will remain undefined.
    var resolvedSize = resolvedEnd - resolvedBegin;
    var sliceSize;
    if (resolvedSize === resolvedSize) {
      sliceSize = resolvedSize < 0 ? 0 : resolvedSize;
    }

    var sliceSeq = makeSequence(iterable);

    // If iterable.size is undefined, the size of the realized sliceSeq is
    // unknown at this point unless the number of items to slice is 0
    sliceSeq.size = sliceSize === 0 ? sliceSize : iterable.size && sliceSize || undefined;

    if (!useKeys && isSeq(iterable) && sliceSize >= 0) {
      sliceSeq.get = function (index, notSetValue) {
        index = wrapIndex(this, index);
        return index >= 0 && index < sliceSize ?
          iterable.get(index + resolvedBegin, notSetValue) :
          notSetValue;
      }
    }

    sliceSeq.__iterateUncached = function(fn, reverse) {var this$0 = this;
      if (sliceSize === 0) {
        return 0;
      }
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }
      var skipped = 0;
      var isSkipping = true;
      var iterations = 0;
      iterable.__iterate(function(v, k)  {
        if (!(isSkipping && (isSkipping = skipped++ < resolvedBegin))) {
          iterations++;
          return fn(v, useKeys ? k : iterations - 1, this$0) !== false &&
                 iterations !== sliceSize;
        }
      });
      return iterations;
    };

    sliceSeq.__iteratorUncached = function(type, reverse) {
      if (sliceSize !== 0 && reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }
      // Don't bother instantiating parent iterator if taking 0.
      var iterator = sliceSize !== 0 && iterable.__iterator(type, reverse);
      var skipped = 0;
      var iterations = 0;
      return new Iterator(function()  {
        while (skipped++ < resolvedBegin) {
          iterator.next();
        }
        if (++iterations > sliceSize) {
          return iteratorDone();
        }
        var step = iterator.next();
        if (useKeys || type === ITERATE_VALUES) {
          return step;
        } else if (type === ITERATE_KEYS) {
          return iteratorValue(type, iterations - 1, undefined, step);
        } else {
          return iteratorValue(type, iterations - 1, step.value[1], step);
        }
      });
    }

    return sliceSeq;
  }


  function takeWhileFactory(iterable, predicate, context) {
    var takeSequence = makeSequence(iterable);
    takeSequence.__iterateUncached = function(fn, reverse) {var this$0 = this;
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }
      var iterations = 0;
      iterable.__iterate(function(v, k, c) 
        {return predicate.call(context, v, k, c) && ++iterations && fn(v, k, this$0)}
      );
      return iterations;
    };
    takeSequence.__iteratorUncached = function(type, reverse) {var this$0 = this;
      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }
      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
      var iterating = true;
      return new Iterator(function()  {
        if (!iterating) {
          return iteratorDone();
        }
        var step = iterator.next();
        if (step.done) {
          return step;
        }
        var entry = step.value;
        var k = entry[0];
        var v = entry[1];
        if (!predicate.call(context, v, k, this$0)) {
          iterating = false;
          return iteratorDone();
        }
        return type === ITERATE_ENTRIES ? step :
          iteratorValue(type, k, v, step);
      });
    };
    return takeSequence;
  }


  function skipWhileFactory(iterable, predicate, context, useKeys) {
    var skipSequence = makeSequence(iterable);
    skipSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }
      var isSkipping = true;
      var iterations = 0;
      iterable.__iterate(function(v, k, c)  {
        if (!(isSkipping && (isSkipping = predicate.call(context, v, k, c)))) {
          iterations++;
          return fn(v, useKeys ? k : iterations - 1, this$0);
        }
      });
      return iterations;
    };
    skipSequence.__iteratorUncached = function(type, reverse) {var this$0 = this;
      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }
      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
      var skipping = true;
      var iterations = 0;
      return new Iterator(function()  {
        var step, k, v;
        do {
          step = iterator.next();
          if (step.done) {
            if (useKeys || type === ITERATE_VALUES) {
              return step;
            } else if (type === ITERATE_KEYS) {
              return iteratorValue(type, iterations++, undefined, step);
            } else {
              return iteratorValue(type, iterations++, step.value[1], step);
            }
          }
          var entry = step.value;
          k = entry[0];
          v = entry[1];
          skipping && (skipping = predicate.call(context, v, k, this$0));
        } while (skipping);
        return type === ITERATE_ENTRIES ? step :
          iteratorValue(type, k, v, step);
      });
    };
    return skipSequence;
  }


  function concatFactory(iterable, values) {
    var isKeyedIterable = isKeyed(iterable);
    var iters = [iterable].concat(values).map(function(v ) {
      if (!isIterable(v)) {
        v = isKeyedIterable ?
          keyedSeqFromValue(v) :
          indexedSeqFromValue(Array.isArray(v) ? v : [v]);
      } else if (isKeyedIterable) {
        v = KeyedIterable(v);
      }
      return v;
    }).filter(function(v ) {return v.size !== 0});

    if (iters.length === 0) {
      return iterable;
    }

    if (iters.length === 1) {
      var singleton = iters[0];
      if (singleton === iterable ||
          isKeyedIterable && isKeyed(singleton) ||
          isIndexed(iterable) && isIndexed(singleton)) {
        return singleton;
      }
    }

    var concatSeq = new ArraySeq(iters);
    if (isKeyedIterable) {
      concatSeq = concatSeq.toKeyedSeq();
    } else if (!isIndexed(iterable)) {
      concatSeq = concatSeq.toSetSeq();
    }
    concatSeq = concatSeq.flatten(true);
    concatSeq.size = iters.reduce(
      function(sum, seq)  {
        if (sum !== undefined) {
          var size = seq.size;
          if (size !== undefined) {
            return sum + size;
          }
        }
      },
      0
    );
    return concatSeq;
  }


  function flattenFactory(iterable, depth, useKeys) {
    var flatSequence = makeSequence(iterable);
    flatSequence.__iterateUncached = function(fn, reverse) {
      var iterations = 0;
      var stopped = false;
      function flatDeep(iter, currentDepth) {var this$0 = this;
        iter.__iterate(function(v, k)  {
          if ((!depth || currentDepth < depth) && isIterable(v)) {
            flatDeep(v, currentDepth + 1);
          } else if (fn(v, useKeys ? k : iterations++, this$0) === false) {
            stopped = true;
          }
          return !stopped;
        }, reverse);
      }
      flatDeep(iterable, 0);
      return iterations;
    }
    flatSequence.__iteratorUncached = function(type, reverse) {
      var iterator = iterable.__iterator(type, reverse);
      var stack = [];
      var iterations = 0;
      return new Iterator(function()  {
        while (iterator) {
          var step = iterator.next();
          if (step.done !== false) {
            iterator = stack.pop();
            continue;
          }
          var v = step.value;
          if (type === ITERATE_ENTRIES) {
            v = v[1];
          }
          if ((!depth || stack.length < depth) && isIterable(v)) {
            stack.push(iterator);
            iterator = v.__iterator(type, reverse);
          } else {
            return useKeys ? step : iteratorValue(type, iterations++, v, step);
          }
        }
        return iteratorDone();
      });
    }
    return flatSequence;
  }


  function flatMapFactory(iterable, mapper, context) {
    var coerce = iterableClass(iterable);
    return iterable.toSeq().map(
      function(v, k)  {return coerce(mapper.call(context, v, k, iterable))}
    ).flatten(true);
  }


  function interposeFactory(iterable, separator) {
    var interposedSequence = makeSequence(iterable);
    interposedSequence.size = iterable.size && iterable.size * 2 -1;
    interposedSequence.__iterateUncached = function(fn, reverse) {var this$0 = this;
      var iterations = 0;
      iterable.__iterate(function(v, k) 
        {return (!iterations || fn(separator, iterations++, this$0) !== false) &&
        fn(v, iterations++, this$0) !== false},
        reverse
      );
      return iterations;
    };
    interposedSequence.__iteratorUncached = function(type, reverse) {
      var iterator = iterable.__iterator(ITERATE_VALUES, reverse);
      var iterations = 0;
      var step;
      return new Iterator(function()  {
        if (!step || iterations % 2) {
          step = iterator.next();
          if (step.done) {
            return step;
          }
        }
        return iterations % 2 ?
          iteratorValue(type, iterations++, separator) :
          iteratorValue(type, iterations++, step.value, step);
      });
    };
    return interposedSequence;
  }


  function sortFactory(iterable, comparator, mapper) {
    if (!comparator) {
      comparator = defaultComparator;
    }
    var isKeyedIterable = isKeyed(iterable);
    var index = 0;
    var entries = iterable.toSeq().map(
      function(v, k)  {return [k, v, index++, mapper ? mapper(v, k, iterable) : v]}
    ).toArray();
    entries.sort(function(a, b)  {return comparator(a[3], b[3]) || a[2] - b[2]}).forEach(
      isKeyedIterable ?
      function(v, i)  { entries[i].length = 2; } :
      function(v, i)  { entries[i] = v[1]; }
    );
    return isKeyedIterable ? KeyedSeq(entries) :
      isIndexed(iterable) ? IndexedSeq(entries) :
      SetSeq(entries);
  }


  function maxFactory(iterable, comparator, mapper) {
    if (!comparator) {
      comparator = defaultComparator;
    }
    if (mapper) {
      var entry = iterable.toSeq()
        .map(function(v, k)  {return [v, mapper(v, k, iterable)]})
        .reduce(function(a, b)  {return maxCompare(comparator, a[1], b[1]) ? b : a});
      return entry && entry[0];
    } else {
      return iterable.reduce(function(a, b)  {return maxCompare(comparator, a, b) ? b : a});
    }
  }

  function maxCompare(comparator, a, b) {
    var comp = comparator(b, a);
    // b is considered the new max if the comparator declares them equal, but
    // they are not equal and b is in fact a nullish value.
    return (comp === 0 && b !== a && (b === undefined || b === null || b !== b)) || comp > 0;
  }


  function zipWithFactory(keyIter, zipper, iters) {
    var zipSequence = makeSequence(keyIter);
    zipSequence.size = new ArraySeq(iters).map(function(i ) {return i.size}).min();
    // Note: this a generic base implementation of __iterate in terms of
    // __iterator which may be more generically useful in the future.
    zipSequence.__iterate = function(fn, reverse) {
      /* generic:
      var iterator = this.__iterator(ITERATE_ENTRIES, reverse);
      var step;
      var iterations = 0;
      while (!(step = iterator.next()).done) {
        iterations++;
        if (fn(step.value[1], step.value[0], this) === false) {
          break;
        }
      }
      return iterations;
      */
      // indexed:
      var iterator = this.__iterator(ITERATE_VALUES, reverse);
      var step;
      var iterations = 0;
      while (!(step = iterator.next()).done) {
        if (fn(step.value, iterations++, this) === false) {
          break;
        }
      }
      return iterations;
    };
    zipSequence.__iteratorUncached = function(type, reverse) {
      var iterators = iters.map(function(i )
        {return (i = Iterable(i), getIterator(reverse ? i.reverse() : i))}
      );
      var iterations = 0;
      var isDone = false;
      return new Iterator(function()  {
        var steps;
        if (!isDone) {
          steps = iterators.map(function(i ) {return i.next()});
          isDone = steps.some(function(s ) {return s.done});
        }
        if (isDone) {
          return iteratorDone();
        }
        return iteratorValue(
          type,
          iterations++,
          zipper.apply(null, steps.map(function(s ) {return s.value}))
        );
      });
    };
    return zipSequence
  }


  // #pragma Helper Functions

  function reify(iter, seq) {
    return isSeq(iter) ? seq : iter.constructor(seq);
  }

  function validateEntry(entry) {
    if (entry !== Object(entry)) {
      throw new TypeError('Expected [K, V] tuple: ' + entry);
    }
  }

  function resolveSize(iter) {
    assertNotInfinite(iter.size);
    return ensureSize(iter);
  }

  function iterableClass(iterable) {
    return isKeyed(iterable) ? KeyedIterable :
      isIndexed(iterable) ? IndexedIterable :
      SetIterable;
  }

  function makeSequence(iterable) {
    return Object.create(
      (
        isKeyed(iterable) ? KeyedSeq :
        isIndexed(iterable) ? IndexedSeq :
        SetSeq
      ).prototype
    );
  }

  function cacheResultThrough() {
    if (this._iter.cacheResult) {
      this._iter.cacheResult();
      this.size = this._iter.size;
      return this;
    } else {
      return Seq.prototype.cacheResult.call(this);
    }
  }

  function defaultComparator(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
  }

  function forceIterator(keyPath) {
    var iter = getIterator(keyPath);
    if (!iter) {
      // Array might not be iterable in this environment, so we need a fallback
      // to our wrapped type.
      if (!isArrayLike(keyPath)) {
        throw new TypeError('Expected iterable or array-like: ' + keyPath);
      }
      iter = getIterator(Iterable(keyPath));
    }
    return iter;
  }

  createClass(Record, KeyedCollection);

    function Record(defaultValues, name) {
      var hasInitialized;

      var RecordType = function Record(values) {
        if (values instanceof RecordType) {
          return values;
        }
        if (!(this instanceof RecordType)) {
          return new RecordType(values);
        }
        if (!hasInitialized) {
          hasInitialized = true;
          var keys = Object.keys(defaultValues);
          setProps(RecordTypePrototype, keys);
          RecordTypePrototype.size = keys.length;
          RecordTypePrototype._name = name;
          RecordTypePrototype._keys = keys;
          RecordTypePrototype._defaultValues = defaultValues;
        }
        this._map = Map(values);
      };

      var RecordTypePrototype = RecordType.prototype = Object.create(RecordPrototype);
      RecordTypePrototype.constructor = RecordType;

      return RecordType;
    }

    Record.prototype.toString = function() {
      return this.__toString(recordName(this) + ' {', '}');
    };

    // @pragma Access

    Record.prototype.has = function(k) {
      return this._defaultValues.hasOwnProperty(k);
    };

    Record.prototype.get = function(k, notSetValue) {
      if (!this.has(k)) {
        return notSetValue;
      }
      var defaultVal = this._defaultValues[k];
      return this._map ? this._map.get(k, defaultVal) : defaultVal;
    };

    // @pragma Modification

    Record.prototype.clear = function() {
      if (this.__ownerID) {
        this._map && this._map.clear();
        return this;
      }
      var RecordType = this.constructor;
      return RecordType._empty || (RecordType._empty = makeRecord(this, emptyMap()));
    };

    Record.prototype.set = function(k, v) {
      if (!this.has(k)) {
        throw new Error('Cannot set unknown key "' + k + '" on ' + recordName(this));
      }
      if (this._map && !this._map.has(k)) {
        var defaultVal = this._defaultValues[k];
        if (v === defaultVal) {
          return this;
        }
      }
      var newMap = this._map && this._map.set(k, v);
      if (this.__ownerID || newMap === this._map) {
        return this;
      }
      return makeRecord(this, newMap);
    };

    Record.prototype.remove = function(k) {
      if (!this.has(k)) {
        return this;
      }
      var newMap = this._map && this._map.remove(k);
      if (this.__ownerID || newMap === this._map) {
        return this;
      }
      return makeRecord(this, newMap);
    };

    Record.prototype.wasAltered = function() {
      return this._map.wasAltered();
    };

    Record.prototype.__iterator = function(type, reverse) {var this$0 = this;
      return KeyedIterable(this._defaultValues).map(function(_, k)  {return this$0.get(k)}).__iterator(type, reverse);
    };

    Record.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      return KeyedIterable(this._defaultValues).map(function(_, k)  {return this$0.get(k)}).__iterate(fn, reverse);
    };

    Record.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      var newMap = this._map && this._map.__ensureOwner(ownerID);
      if (!ownerID) {
        this.__ownerID = ownerID;
        this._map = newMap;
        return this;
      }
      return makeRecord(this, newMap, ownerID);
    };


  var RecordPrototype = Record.prototype;
  RecordPrototype[DELETE] = RecordPrototype.remove;
  RecordPrototype.deleteIn =
  RecordPrototype.removeIn = MapPrototype.removeIn;
  RecordPrototype.merge = MapPrototype.merge;
  RecordPrototype.mergeWith = MapPrototype.mergeWith;
  RecordPrototype.mergeIn = MapPrototype.mergeIn;
  RecordPrototype.mergeDeep = MapPrototype.mergeDeep;
  RecordPrototype.mergeDeepWith = MapPrototype.mergeDeepWith;
  RecordPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
  RecordPrototype.setIn = MapPrototype.setIn;
  RecordPrototype.update = MapPrototype.update;
  RecordPrototype.updateIn = MapPrototype.updateIn;
  RecordPrototype.withMutations = MapPrototype.withMutations;
  RecordPrototype.asMutable = MapPrototype.asMutable;
  RecordPrototype.asImmutable = MapPrototype.asImmutable;


  function makeRecord(likeRecord, map, ownerID) {
    var record = Object.create(Object.getPrototypeOf(likeRecord));
    record._map = map;
    record.__ownerID = ownerID;
    return record;
  }

  function recordName(record) {
    return record._name || record.constructor.name || 'Record';
  }

  function setProps(prototype, names) {
    try {
      names.forEach(setProp.bind(undefined, prototype));
    } catch (error) {
      // Object.defineProperty failed. Probably IE8.
    }
  }

  function setProp(prototype, name) {
    Object.defineProperty(prototype, name, {
      get: function() {
        return this.get(name);
      },
      set: function(value) {
        invariant(this.__ownerID, 'Cannot set on an immutable record.');
        this.set(name, value);
      }
    });
  }

  createClass(Set, SetCollection);

    // @pragma Construction

    function Set(value) {
      return value === null || value === undefined ? emptySet() :
        isSet(value) && !isOrdered(value) ? value :
        emptySet().withMutations(function(set ) {
          var iter = SetIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function(v ) {return set.add(v)});
        });
    }

    Set.of = function(/*...values*/) {
      return this(arguments);
    };

    Set.fromKeys = function(value) {
      return this(KeyedIterable(value).keySeq());
    };

    Set.prototype.toString = function() {
      return this.__toString('Set {', '}');
    };

    // @pragma Access

    Set.prototype.has = function(value) {
      return this._map.has(value);
    };

    // @pragma Modification

    Set.prototype.add = function(value) {
      return updateSet(this, this._map.set(value, true));
    };

    Set.prototype.remove = function(value) {
      return updateSet(this, this._map.remove(value));
    };

    Set.prototype.clear = function() {
      return updateSet(this, this._map.clear());
    };

    // @pragma Composition

    Set.prototype.union = function() {var iters = SLICE$0.call(arguments, 0);
      iters = iters.filter(function(x ) {return x.size !== 0});
      if (iters.length === 0) {
        return this;
      }
      if (this.size === 0 && !this.__ownerID && iters.length === 1) {
        return this.constructor(iters[0]);
      }
      return this.withMutations(function(set ) {
        for (var ii = 0; ii < iters.length; ii++) {
          SetIterable(iters[ii]).forEach(function(value ) {return set.add(value)});
        }
      });
    };

    Set.prototype.intersect = function() {var iters = SLICE$0.call(arguments, 0);
      if (iters.length === 0) {
        return this;
      }
      iters = iters.map(function(iter ) {return SetIterable(iter)});
      var originalSet = this;
      return this.withMutations(function(set ) {
        originalSet.forEach(function(value ) {
          if (!iters.every(function(iter ) {return iter.includes(value)})) {
            set.remove(value);
          }
        });
      });
    };

    Set.prototype.subtract = function() {var iters = SLICE$0.call(arguments, 0);
      if (iters.length === 0) {
        return this;
      }
      iters = iters.map(function(iter ) {return SetIterable(iter)});
      var originalSet = this;
      return this.withMutations(function(set ) {
        originalSet.forEach(function(value ) {
          if (iters.some(function(iter ) {return iter.includes(value)})) {
            set.remove(value);
          }
        });
      });
    };

    Set.prototype.merge = function() {
      return this.union.apply(this, arguments);
    };

    Set.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
      return this.union.apply(this, iters);
    };

    Set.prototype.sort = function(comparator) {
      // Late binding
      return OrderedSet(sortFactory(this, comparator));
    };

    Set.prototype.sortBy = function(mapper, comparator) {
      // Late binding
      return OrderedSet(sortFactory(this, comparator, mapper));
    };

    Set.prototype.wasAltered = function() {
      return this._map.wasAltered();
    };

    Set.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      return this._map.__iterate(function(_, k)  {return fn(k, k, this$0)}, reverse);
    };

    Set.prototype.__iterator = function(type, reverse) {
      return this._map.map(function(_, k)  {return k}).__iterator(type, reverse);
    };

    Set.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      var newMap = this._map.__ensureOwner(ownerID);
      if (!ownerID) {
        this.__ownerID = ownerID;
        this._map = newMap;
        return this;
      }
      return this.__make(newMap, ownerID);
    };


  function isSet(maybeSet) {
    return !!(maybeSet && maybeSet[IS_SET_SENTINEL]);
  }

  Set.isSet = isSet;

  var IS_SET_SENTINEL = '@@__IMMUTABLE_SET__@@';

  var SetPrototype = Set.prototype;
  SetPrototype[IS_SET_SENTINEL] = true;
  SetPrototype[DELETE] = SetPrototype.remove;
  SetPrototype.mergeDeep = SetPrototype.merge;
  SetPrototype.mergeDeepWith = SetPrototype.mergeWith;
  SetPrototype.withMutations = MapPrototype.withMutations;
  SetPrototype.asMutable = MapPrototype.asMutable;
  SetPrototype.asImmutable = MapPrototype.asImmutable;

  SetPrototype.__empty = emptySet;
  SetPrototype.__make = makeSet;

  function updateSet(set, newMap) {
    if (set.__ownerID) {
      set.size = newMap.size;
      set._map = newMap;
      return set;
    }
    return newMap === set._map ? set :
      newMap.size === 0 ? set.__empty() :
      set.__make(newMap);
  }

  function makeSet(map, ownerID) {
    var set = Object.create(SetPrototype);
    set.size = map ? map.size : 0;
    set._map = map;
    set.__ownerID = ownerID;
    return set;
  }

  var EMPTY_SET;
  function emptySet() {
    return EMPTY_SET || (EMPTY_SET = makeSet(emptyMap()));
  }

  createClass(OrderedSet, Set);

    // @pragma Construction

    function OrderedSet(value) {
      return value === null || value === undefined ? emptyOrderedSet() :
        isOrderedSet(value) ? value :
        emptyOrderedSet().withMutations(function(set ) {
          var iter = SetIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function(v ) {return set.add(v)});
        });
    }

    OrderedSet.of = function(/*...values*/) {
      return this(arguments);
    };

    OrderedSet.fromKeys = function(value) {
      return this(KeyedIterable(value).keySeq());
    };

    OrderedSet.prototype.toString = function() {
      return this.__toString('OrderedSet {', '}');
    };


  function isOrderedSet(maybeOrderedSet) {
    return isSet(maybeOrderedSet) && isOrdered(maybeOrderedSet);
  }

  OrderedSet.isOrderedSet = isOrderedSet;

  var OrderedSetPrototype = OrderedSet.prototype;
  OrderedSetPrototype[IS_ORDERED_SENTINEL] = true;

  OrderedSetPrototype.__empty = emptyOrderedSet;
  OrderedSetPrototype.__make = makeOrderedSet;

  function makeOrderedSet(map, ownerID) {
    var set = Object.create(OrderedSetPrototype);
    set.size = map ? map.size : 0;
    set._map = map;
    set.__ownerID = ownerID;
    return set;
  }

  var EMPTY_ORDERED_SET;
  function emptyOrderedSet() {
    return EMPTY_ORDERED_SET || (EMPTY_ORDERED_SET = makeOrderedSet(emptyOrderedMap()));
  }

  createClass(Stack, IndexedCollection);

    // @pragma Construction

    function Stack(value) {
      return value === null || value === undefined ? emptyStack() :
        isStack(value) ? value :
        emptyStack().unshiftAll(value);
    }

    Stack.of = function(/*...values*/) {
      return this(arguments);
    };

    Stack.prototype.toString = function() {
      return this.__toString('Stack [', ']');
    };

    // @pragma Access

    Stack.prototype.get = function(index, notSetValue) {
      var head = this._head;
      index = wrapIndex(this, index);
      while (head && index--) {
        head = head.next;
      }
      return head ? head.value : notSetValue;
    };

    Stack.prototype.peek = function() {
      return this._head && this._head.value;
    };

    // @pragma Modification

    Stack.prototype.push = function(/*...values*/) {
      if (arguments.length === 0) {
        return this;
      }
      var newSize = this.size + arguments.length;
      var head = this._head;
      for (var ii = arguments.length - 1; ii >= 0; ii--) {
        head = {
          value: arguments[ii],
          next: head
        };
      }
      if (this.__ownerID) {
        this.size = newSize;
        this._head = head;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return makeStack(newSize, head);
    };

    Stack.prototype.pushAll = function(iter) {
      iter = IndexedIterable(iter);
      if (iter.size === 0) {
        return this;
      }
      assertNotInfinite(iter.size);
      var newSize = this.size;
      var head = this._head;
      iter.reverse().forEach(function(value ) {
        newSize++;
        head = {
          value: value,
          next: head
        };
      });
      if (this.__ownerID) {
        this.size = newSize;
        this._head = head;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return makeStack(newSize, head);
    };

    Stack.prototype.pop = function() {
      return this.slice(1);
    };

    Stack.prototype.unshift = function(/*...values*/) {
      return this.push.apply(this, arguments);
    };

    Stack.prototype.unshiftAll = function(iter) {
      return this.pushAll(iter);
    };

    Stack.prototype.shift = function() {
      return this.pop.apply(this, arguments);
    };

    Stack.prototype.clear = function() {
      if (this.size === 0) {
        return this;
      }
      if (this.__ownerID) {
        this.size = 0;
        this._head = undefined;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return emptyStack();
    };

    Stack.prototype.slice = function(begin, end) {
      if (wholeSlice(begin, end, this.size)) {
        return this;
      }
      var resolvedBegin = resolveBegin(begin, this.size);
      var resolvedEnd = resolveEnd(end, this.size);
      if (resolvedEnd !== this.size) {
        // super.slice(begin, end);
        return IndexedCollection.prototype.slice.call(this, begin, end);
      }
      var newSize = this.size - resolvedBegin;
      var head = this._head;
      while (resolvedBegin--) {
        head = head.next;
      }
      if (this.__ownerID) {
        this.size = newSize;
        this._head = head;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return makeStack(newSize, head);
    };

    // @pragma Mutability

    Stack.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      if (!ownerID) {
        this.__ownerID = ownerID;
        this.__altered = false;
        return this;
      }
      return makeStack(this.size, this._head, ownerID, this.__hash);
    };

    // @pragma Iteration

    Stack.prototype.__iterate = function(fn, reverse) {
      if (reverse) {
        return this.reverse().__iterate(fn);
      }
      var iterations = 0;
      var node = this._head;
      while (node) {
        if (fn(node.value, iterations++, this) === false) {
          break;
        }
        node = node.next;
      }
      return iterations;
    };

    Stack.prototype.__iterator = function(type, reverse) {
      if (reverse) {
        return this.reverse().__iterator(type);
      }
      var iterations = 0;
      var node = this._head;
      return new Iterator(function()  {
        if (node) {
          var value = node.value;
          node = node.next;
          return iteratorValue(type, iterations++, value);
        }
        return iteratorDone();
      });
    };


  function isStack(maybeStack) {
    return !!(maybeStack && maybeStack[IS_STACK_SENTINEL]);
  }

  Stack.isStack = isStack;

  var IS_STACK_SENTINEL = '@@__IMMUTABLE_STACK__@@';

  var StackPrototype = Stack.prototype;
  StackPrototype[IS_STACK_SENTINEL] = true;
  StackPrototype.withMutations = MapPrototype.withMutations;
  StackPrototype.asMutable = MapPrototype.asMutable;
  StackPrototype.asImmutable = MapPrototype.asImmutable;
  StackPrototype.wasAltered = MapPrototype.wasAltered;


  function makeStack(size, head, ownerID, hash) {
    var map = Object.create(StackPrototype);
    map.size = size;
    map._head = head;
    map.__ownerID = ownerID;
    map.__hash = hash;
    map.__altered = false;
    return map;
  }

  var EMPTY_STACK;
  function emptyStack() {
    return EMPTY_STACK || (EMPTY_STACK = makeStack(0));
  }

  /**
   * Contributes additional methods to a constructor
   */
  function mixin(ctor, methods) {
    var keyCopier = function(key ) { ctor.prototype[key] = methods[key]; };
    Object.keys(methods).forEach(keyCopier);
    Object.getOwnPropertySymbols &&
      Object.getOwnPropertySymbols(methods).forEach(keyCopier);
    return ctor;
  }

  Iterable.Iterator = Iterator;

  mixin(Iterable, {

    // ### Conversion to other types

    toArray: function() {
      assertNotInfinite(this.size);
      var array = new Array(this.size || 0);
      this.valueSeq().__iterate(function(v, i)  { array[i] = v; });
      return array;
    },

    toIndexedSeq: function() {
      return new ToIndexedSequence(this);
    },

    toJS: function() {
      return this.toSeq().map(
        function(value ) {return value && typeof value.toJS === 'function' ? value.toJS() : value}
      ).__toJS();
    },

    toJSON: function() {
      return this.toSeq().map(
        function(value ) {return value && typeof value.toJSON === 'function' ? value.toJSON() : value}
      ).__toJS();
    },

    toKeyedSeq: function() {
      return new ToKeyedSequence(this, true);
    },

    toMap: function() {
      // Use Late Binding here to solve the circular dependency.
      return Map(this.toKeyedSeq());
    },

    toObject: function() {
      assertNotInfinite(this.size);
      var object = {};
      this.__iterate(function(v, k)  { object[k] = v; });
      return object;
    },

    toOrderedMap: function() {
      // Use Late Binding here to solve the circular dependency.
      return OrderedMap(this.toKeyedSeq());
    },

    toOrderedSet: function() {
      // Use Late Binding here to solve the circular dependency.
      return OrderedSet(isKeyed(this) ? this.valueSeq() : this);
    },

    toSet: function() {
      // Use Late Binding here to solve the circular dependency.
      return Set(isKeyed(this) ? this.valueSeq() : this);
    },

    toSetSeq: function() {
      return new ToSetSequence(this);
    },

    toSeq: function() {
      return isIndexed(this) ? this.toIndexedSeq() :
        isKeyed(this) ? this.toKeyedSeq() :
        this.toSetSeq();
    },

    toStack: function() {
      // Use Late Binding here to solve the circular dependency.
      return Stack(isKeyed(this) ? this.valueSeq() : this);
    },

    toList: function() {
      // Use Late Binding here to solve the circular dependency.
      return List(isKeyed(this) ? this.valueSeq() : this);
    },


    // ### Common JavaScript methods and properties

    toString: function() {
      return '[Iterable]';
    },

    __toString: function(head, tail) {
      if (this.size === 0) {
        return head + tail;
      }
      return head + ' ' + this.toSeq().map(this.__toStringMapper).join(', ') + ' ' + tail;
    },


    // ### ES6 Collection methods (ES6 Array and Map)

    concat: function() {var values = SLICE$0.call(arguments, 0);
      return reify(this, concatFactory(this, values));
    },

    includes: function(searchValue) {
      return this.some(function(value ) {return is(value, searchValue)});
    },

    entries: function() {
      return this.__iterator(ITERATE_ENTRIES);
    },

    every: function(predicate, context) {
      assertNotInfinite(this.size);
      var returnValue = true;
      this.__iterate(function(v, k, c)  {
        if (!predicate.call(context, v, k, c)) {
          returnValue = false;
          return false;
        }
      });
      return returnValue;
    },

    filter: function(predicate, context) {
      return reify(this, filterFactory(this, predicate, context, true));
    },

    find: function(predicate, context, notSetValue) {
      var entry = this.findEntry(predicate, context);
      return entry ? entry[1] : notSetValue;
    },

    forEach: function(sideEffect, context) {
      assertNotInfinite(this.size);
      return this.__iterate(context ? sideEffect.bind(context) : sideEffect);
    },

    join: function(separator) {
      assertNotInfinite(this.size);
      separator = separator !== undefined ? '' + separator : ',';
      var joined = '';
      var isFirst = true;
      this.__iterate(function(v ) {
        isFirst ? (isFirst = false) : (joined += separator);
        joined += v !== null && v !== undefined ? v.toString() : '';
      });
      return joined;
    },

    keys: function() {
      return this.__iterator(ITERATE_KEYS);
    },

    map: function(mapper, context) {
      return reify(this, mapFactory(this, mapper, context));
    },

    reduce: function(reducer, initialReduction, context) {
      assertNotInfinite(this.size);
      var reduction;
      var useFirst;
      if (arguments.length < 2) {
        useFirst = true;
      } else {
        reduction = initialReduction;
      }
      this.__iterate(function(v, k, c)  {
        if (useFirst) {
          useFirst = false;
          reduction = v;
        } else {
          reduction = reducer.call(context, reduction, v, k, c);
        }
      });
      return reduction;
    },

    reduceRight: function(reducer, initialReduction, context) {
      var reversed = this.toKeyedSeq().reverse();
      return reversed.reduce.apply(reversed, arguments);
    },

    reverse: function() {
      return reify(this, reverseFactory(this, true));
    },

    slice: function(begin, end) {
      return reify(this, sliceFactory(this, begin, end, true));
    },

    some: function(predicate, context) {
      return !this.every(not(predicate), context);
    },

    sort: function(comparator) {
      return reify(this, sortFactory(this, comparator));
    },

    values: function() {
      return this.__iterator(ITERATE_VALUES);
    },


    // ### More sequential methods

    butLast: function() {
      return this.slice(0, -1);
    },

    isEmpty: function() {
      return this.size !== undefined ? this.size === 0 : !this.some(function()  {return true});
    },

    count: function(predicate, context) {
      return ensureSize(
        predicate ? this.toSeq().filter(predicate, context) : this
      );
    },

    countBy: function(grouper, context) {
      return countByFactory(this, grouper, context);
    },

    equals: function(other) {
      return deepEqual(this, other);
    },

    entrySeq: function() {
      var iterable = this;
      if (iterable._cache) {
        // We cache as an entries array, so we can just return the cache!
        return new ArraySeq(iterable._cache);
      }
      var entriesSequence = iterable.toSeq().map(entryMapper).toIndexedSeq();
      entriesSequence.fromEntrySeq = function()  {return iterable.toSeq()};
      return entriesSequence;
    },

    filterNot: function(predicate, context) {
      return this.filter(not(predicate), context);
    },

    findEntry: function(predicate, context, notSetValue) {
      var found = notSetValue;
      this.__iterate(function(v, k, c)  {
        if (predicate.call(context, v, k, c)) {
          found = [k, v];
          return false;
        }
      });
      return found;
    },

    findKey: function(predicate, context) {
      var entry = this.findEntry(predicate, context);
      return entry && entry[0];
    },

    findLast: function(predicate, context, notSetValue) {
      return this.toKeyedSeq().reverse().find(predicate, context, notSetValue);
    },

    findLastEntry: function(predicate, context, notSetValue) {
      return this.toKeyedSeq().reverse().findEntry(predicate, context, notSetValue);
    },

    findLastKey: function(predicate, context) {
      return this.toKeyedSeq().reverse().findKey(predicate, context);
    },

    first: function() {
      return this.find(returnTrue);
    },

    flatMap: function(mapper, context) {
      return reify(this, flatMapFactory(this, mapper, context));
    },

    flatten: function(depth) {
      return reify(this, flattenFactory(this, depth, true));
    },

    fromEntrySeq: function() {
      return new FromEntriesSequence(this);
    },

    get: function(searchKey, notSetValue) {
      return this.find(function(_, key)  {return is(key, searchKey)}, undefined, notSetValue);
    },

    getIn: function(searchKeyPath, notSetValue) {
      var nested = this;
      // Note: in an ES6 environment, we would prefer:
      // for (var key of searchKeyPath) {
      var iter = forceIterator(searchKeyPath);
      var step;
      while (!(step = iter.next()).done) {
        var key = step.value;
        nested = nested && nested.get ? nested.get(key, NOT_SET) : NOT_SET;
        if (nested === NOT_SET) {
          return notSetValue;
        }
      }
      return nested;
    },

    groupBy: function(grouper, context) {
      return groupByFactory(this, grouper, context);
    },

    has: function(searchKey) {
      return this.get(searchKey, NOT_SET) !== NOT_SET;
    },

    hasIn: function(searchKeyPath) {
      return this.getIn(searchKeyPath, NOT_SET) !== NOT_SET;
    },

    isSubset: function(iter) {
      iter = typeof iter.includes === 'function' ? iter : Iterable(iter);
      return this.every(function(value ) {return iter.includes(value)});
    },

    isSuperset: function(iter) {
      iter = typeof iter.isSubset === 'function' ? iter : Iterable(iter);
      return iter.isSubset(this);
    },

    keyOf: function(searchValue) {
      return this.findKey(function(value ) {return is(value, searchValue)});
    },

    keySeq: function() {
      return this.toSeq().map(keyMapper).toIndexedSeq();
    },

    last: function() {
      return this.toSeq().reverse().first();
    },

    lastKeyOf: function(searchValue) {
      return this.toKeyedSeq().reverse().keyOf(searchValue);
    },

    max: function(comparator) {
      return maxFactory(this, comparator);
    },

    maxBy: function(mapper, comparator) {
      return maxFactory(this, comparator, mapper);
    },

    min: function(comparator) {
      return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator);
    },

    minBy: function(mapper, comparator) {
      return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator, mapper);
    },

    rest: function() {
      return this.slice(1);
    },

    skip: function(amount) {
      return this.slice(Math.max(0, amount));
    },

    skipLast: function(amount) {
      return reify(this, this.toSeq().reverse().skip(amount).reverse());
    },

    skipWhile: function(predicate, context) {
      return reify(this, skipWhileFactory(this, predicate, context, true));
    },

    skipUntil: function(predicate, context) {
      return this.skipWhile(not(predicate), context);
    },

    sortBy: function(mapper, comparator) {
      return reify(this, sortFactory(this, comparator, mapper));
    },

    take: function(amount) {
      return this.slice(0, Math.max(0, amount));
    },

    takeLast: function(amount) {
      return reify(this, this.toSeq().reverse().take(amount).reverse());
    },

    takeWhile: function(predicate, context) {
      return reify(this, takeWhileFactory(this, predicate, context));
    },

    takeUntil: function(predicate, context) {
      return this.takeWhile(not(predicate), context);
    },

    valueSeq: function() {
      return this.toIndexedSeq();
    },


    // ### Hashable Object

    hashCode: function() {
      return this.__hash || (this.__hash = hashIterable(this));
    }


    // ### Internal

    // abstract __iterate(fn, reverse)

    // abstract __iterator(type, reverse)
  });

  // var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
  // var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
  // var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
  // var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';

  var IterablePrototype = Iterable.prototype;
  IterablePrototype[IS_ITERABLE_SENTINEL] = true;
  IterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.values;
  IterablePrototype.__toJS = IterablePrototype.toArray;
  IterablePrototype.__toStringMapper = quoteString;
  IterablePrototype.inspect =
  IterablePrototype.toSource = function() { return this.toString(); };
  IterablePrototype.chain = IterablePrototype.flatMap;
  IterablePrototype.contains = IterablePrototype.includes;

  mixin(KeyedIterable, {

    // ### More sequential methods

    flip: function() {
      return reify(this, flipFactory(this));
    },

    mapEntries: function(mapper, context) {var this$0 = this;
      var iterations = 0;
      return reify(this,
        this.toSeq().map(
          function(v, k)  {return mapper.call(context, [k, v], iterations++, this$0)}
        ).fromEntrySeq()
      );
    },

    mapKeys: function(mapper, context) {var this$0 = this;
      return reify(this,
        this.toSeq().flip().map(
          function(k, v)  {return mapper.call(context, k, v, this$0)}
        ).flip()
      );
    }

  });

  var KeyedIterablePrototype = KeyedIterable.prototype;
  KeyedIterablePrototype[IS_KEYED_SENTINEL] = true;
  KeyedIterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.entries;
  KeyedIterablePrototype.__toJS = IterablePrototype.toObject;
  KeyedIterablePrototype.__toStringMapper = function(v, k)  {return JSON.stringify(k) + ': ' + quoteString(v)};



  mixin(IndexedIterable, {

    // ### Conversion to other types

    toKeyedSeq: function() {
      return new ToKeyedSequence(this, false);
    },


    // ### ES6 Collection methods (ES6 Array and Map)

    filter: function(predicate, context) {
      return reify(this, filterFactory(this, predicate, context, false));
    },

    findIndex: function(predicate, context) {
      var entry = this.findEntry(predicate, context);
      return entry ? entry[0] : -1;
    },

    indexOf: function(searchValue) {
      var key = this.keyOf(searchValue);
      return key === undefined ? -1 : key;
    },

    lastIndexOf: function(searchValue) {
      var key = this.lastKeyOf(searchValue);
      return key === undefined ? -1 : key;
    },

    reverse: function() {
      return reify(this, reverseFactory(this, false));
    },

    slice: function(begin, end) {
      return reify(this, sliceFactory(this, begin, end, false));
    },

    splice: function(index, removeNum /*, ...values*/) {
      var numArgs = arguments.length;
      removeNum = Math.max(removeNum | 0, 0);
      if (numArgs === 0 || (numArgs === 2 && !removeNum)) {
        return this;
      }
      // If index is negative, it should resolve relative to the size of the
      // collection. However size may be expensive to compute if not cached, so
      // only call count() if the number is in fact negative.
      index = resolveBegin(index, index < 0 ? this.count() : this.size);
      var spliced = this.slice(0, index);
      return reify(
        this,
        numArgs === 1 ?
          spliced :
          spliced.concat(arrCopy(arguments, 2), this.slice(index + removeNum))
      );
    },


    // ### More collection methods

    findLastIndex: function(predicate, context) {
      var entry = this.findLastEntry(predicate, context);
      return entry ? entry[0] : -1;
    },

    first: function() {
      return this.get(0);
    },

    flatten: function(depth) {
      return reify(this, flattenFactory(this, depth, false));
    },

    get: function(index, notSetValue) {
      index = wrapIndex(this, index);
      return (index < 0 || (this.size === Infinity ||
          (this.size !== undefined && index > this.size))) ?
        notSetValue :
        this.find(function(_, key)  {return key === index}, undefined, notSetValue);
    },

    has: function(index) {
      index = wrapIndex(this, index);
      return index >= 0 && (this.size !== undefined ?
        this.size === Infinity || index < this.size :
        this.indexOf(index) !== -1
      );
    },

    interpose: function(separator) {
      return reify(this, interposeFactory(this, separator));
    },

    interleave: function(/*...iterables*/) {
      var iterables = [this].concat(arrCopy(arguments));
      var zipped = zipWithFactory(this.toSeq(), IndexedSeq.of, iterables);
      var interleaved = zipped.flatten(true);
      if (zipped.size) {
        interleaved.size = zipped.size * iterables.length;
      }
      return reify(this, interleaved);
    },

    keySeq: function() {
      return Range(0, this.size);
    },

    last: function() {
      return this.get(-1);
    },

    skipWhile: function(predicate, context) {
      return reify(this, skipWhileFactory(this, predicate, context, false));
    },

    zip: function(/*, ...iterables */) {
      var iterables = [this].concat(arrCopy(arguments));
      return reify(this, zipWithFactory(this, defaultZipper, iterables));
    },

    zipWith: function(zipper/*, ...iterables */) {
      var iterables = arrCopy(arguments);
      iterables[0] = this;
      return reify(this, zipWithFactory(this, zipper, iterables));
    }

  });

  IndexedIterable.prototype[IS_INDEXED_SENTINEL] = true;
  IndexedIterable.prototype[IS_ORDERED_SENTINEL] = true;



  mixin(SetIterable, {

    // ### ES6 Collection methods (ES6 Array and Map)

    get: function(value, notSetValue) {
      return this.has(value) ? value : notSetValue;
    },

    includes: function(value) {
      return this.has(value);
    },


    // ### More sequential methods

    keySeq: function() {
      return this.valueSeq();
    }

  });

  SetIterable.prototype.has = IterablePrototype.includes;
  SetIterable.prototype.contains = SetIterable.prototype.includes;


  // Mixin subclasses

  mixin(KeyedSeq, KeyedIterable.prototype);
  mixin(IndexedSeq, IndexedIterable.prototype);
  mixin(SetSeq, SetIterable.prototype);

  mixin(KeyedCollection, KeyedIterable.prototype);
  mixin(IndexedCollection, IndexedIterable.prototype);
  mixin(SetCollection, SetIterable.prototype);


  // #pragma Helper functions

  function keyMapper(v, k) {
    return k;
  }

  function entryMapper(v, k) {
    return [k, v];
  }

  function not(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    }
  }

  function neg(predicate) {
    return function() {
      return -predicate.apply(this, arguments);
    }
  }

  function quoteString(value) {
    return typeof value === 'string' ? JSON.stringify(value) : String(value);
  }

  function defaultZipper() {
    return arrCopy(arguments);
  }

  function defaultNegComparator(a, b) {
    return a < b ? 1 : a > b ? -1 : 0;
  }

  function hashIterable(iterable) {
    if (iterable.size === Infinity) {
      return 0;
    }
    var ordered = isOrdered(iterable);
    var keyed = isKeyed(iterable);
    var h = ordered ? 1 : 0;
    var size = iterable.__iterate(
      keyed ?
        ordered ?
          function(v, k)  { h = 31 * h + hashMerge(hash(v), hash(k)) | 0; } :
          function(v, k)  { h = h + hashMerge(hash(v), hash(k)) | 0; } :
        ordered ?
          function(v ) { h = 31 * h + hash(v) | 0; } :
          function(v ) { h = h + hash(v) | 0; }
    );
    return murmurHashOfSize(size, h);
  }

  function murmurHashOfSize(size, h) {
    h = imul(h, 0xCC9E2D51);
    h = imul(h << 15 | h >>> -15, 0x1B873593);
    h = imul(h << 13 | h >>> -13, 5);
    h = (h + 0xE6546B64 | 0) ^ size;
    h = imul(h ^ h >>> 16, 0x85EBCA6B);
    h = imul(h ^ h >>> 13, 0xC2B2AE35);
    h = smi(h ^ h >>> 16);
    return h;
  }

  function hashMerge(a, b) {
    return a ^ b + 0x9E3779B9 + (a << 6) + (a >> 2) | 0; // int
  }

  var Immutable = {

    Iterable: Iterable,

    Seq: Seq,
    Collection: Collection,
    Map: Map,
    OrderedMap: OrderedMap,
    List: List,
    Stack: Stack,
    Set: Set,
    OrderedSet: OrderedSet,

    Record: Record,
    Range: Range,
    Repeat: Repeat,

    is: is,
    fromJS: fromJS

  };

  return Immutable;

}));

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Model = undefined;

var _immutable = __webpack_require__(0);

/**
 * Default Spec for the Model Record.
 */
var ModelSpec = {
  name: '',
  version: ''
};

var Model = exports.Model = (0, _immutable.Record)(ModelSpec);

exports.default = Model;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(110), __esModule: true };

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _setPrototypeOf = __webpack_require__(98);

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = __webpack_require__(96);

var _create2 = _interopRequireDefault(_create);

var _typeof2 = __webpack_require__(13);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof2 = __webpack_require__(13);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

var core = module.exports = {version: '1.2.6'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 7 */
/***/ (function(module, exports) {

var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(50);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var store  = __webpack_require__(61)('wks')
  , uid    = __webpack_require__(64)
  , Symbol = __webpack_require__(10).Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(24);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(10)
  , core      = __webpack_require__(6)
  , ctx       = __webpack_require__(14)
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && key in target;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(param){
        return this instanceof C ? new C(param) : C(param);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
};
// type bitmap
$export.F = 1;  // forced
$export.G = 2;  // global
$export.S = 4;  // static
$export.P = 8;  // proto
$export.B = 16; // bind
$export.W = 32; // wrap
module.exports = $export;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _symbol = __webpack_require__(99);

var _symbol2 = _interopRequireDefault(_symbol);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof _Symbol !== "undefined" && obj.constructor === _Symbol ? "symbol" : typeof obj; }

exports.default = function (obj) {
  return obj && typeof _symbol2.default !== "undefined" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(31);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.environment = exports.target = exports.serializers = exports.parsers = exports.loaders = undefined;

var _Environment = __webpack_require__(69);

var _Environment2 = _interopRequireDefault(_Environment);

var _Loader = __webpack_require__(71);

var _Loader2 = _interopRequireDefault(_Loader);

var _Parser = __webpack_require__(91);

var _Parser2 = _interopRequireDefault(_Parser);

var _Serializer = __webpack_require__(92);

var _Serializer2 = _interopRequireDefault(_Serializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loaders = exports.loaders = [_Loader2.default];

var parsers = exports.parsers = [_Parser2.default];

var serializers = exports.serializers = [_Serializer2.default];

var target = exports.target = {
  identifier: 'com.luckymarmot.PawExtensions.PostmanCollectionGenerator',
  title: 'PostmanCollectionGenerator',
  humanTitle: 'Postman Collection 2.0',
  format: _Serializer2.default.__meta__.format,
  version: _Serializer2.default.__meta__.version
};

var environment = exports.environment = _Environment2.default;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__internals__ = exports.flatten = exports.convertEntryListInMap = exports.entries = exports.values = exports.keys = exports.currify = undefined;

var _toConsumableArray2 = __webpack_require__(53);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _keys = __webpack_require__(21);

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = __webpack_require__(13);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * currifies a function with a partial list of arguments
 * @param {Function} uncurried: the function to currify
 * @param {Array<any>} params: a partial list of parameters to use with this function
 * @returns {Function} the currified function
 */
var currify = exports.currify = function currify(uncurried) {
  for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    params[_key - 1] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, otherParams = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      otherParams[_key2] = arguments[_key2];
    }

    return uncurried.apply(null, params.concat(otherParams));
  };
};

/**
 * extracts the keys from an object
 * @param {Object|any?} obj: the object to get the keys from
 * @returns {Array<string>} the corresponding keys
 */
var keys = exports.keys = function keys() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if ((typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) !== 'object') {
    return [];
  }

  return (0, _keys2.default)(obj);
};

/**
 * extracts the values from an object
 * @param {Object|any?} obj: the object to get the values from
 * @returns {Array<*>} the corresponding values
 */
var values = exports.values = function values(obj) {
  return keys(obj).map(function (key) {
    return obj[key];
  });
};

/**
 * extracts the key-value pairs from an object
 * @param {Object|any?} obj: the object to get the entries from
 * @returns {Array<{key: string, value: *}>} the corresponding entries
 */
var entries = exports.entries = function entries(obj) {
  return keys(obj).map(function (key) {
    return { key: key, value: obj[key] };
  });
};

/**
 * converts an array of key-value pairs into an Object (as a reducer)
 * @param {Object} obj: the object to update with a new key-value pair
 * @param {Entry} entry: the entry to insert in the object
 * @returns {Object} the updated object
 */
var convertEntryListInMap = exports.convertEntryListInMap = function convertEntryListInMap(obj) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      key = _ref.key,
      value = _ref.value;

  if (typeof key === 'undefined' && typeof value === 'undefined') {
    return obj;
  }

  obj[key] = value;
  return obj;
};

/**
 * flattens an array of array into an array (as a reducer)
 * @param {Array<*>} f: the flat list to update with new elements
 * @param {Array<*>} l: the list to append to the flat list
 * @returns {Array<*>} the updated flat list
 */
var flatten = exports.flatten = function flatten(f, l) {
  return [].concat((0, _toConsumableArray3.default)(f), (0, _toConsumableArray3.default)(l));
};

var __internals__ = exports.__internals__ = { currify: currify, keys: keys, values: values, entries: entries, convertEntryListInMap: convertEntryListInMap };

/***/ }),
/* 18 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__internals__ = exports.Reference = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var methods = {};

/**
 * Metadata about the Reference Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'reference.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the Reference Record.
 * @property {string} type: the type of reference. Used to access the correct store. For instance,
 * if type is 'parameter', then the Parameter store will be access in the Store object.
 * @property {string} uuid: the key to access the desired Object in the store. Does not have to be
 * uuid, so long as it is uniquely defined.
 * @overlay {string} overlay: parameters to apply to the linked object. For instance, assuming this
 * Reference links to an OAuth2 Auth Object, we could have an `overlay` such as:
 * const overlay = new Auth.OAuth2({
 *  scopes: someScopebjects
 * })
 * this would override the scopes defined in the linked OAuth2 Record with the scopes
 * defined in the overlay.
 */
var ReferenceSpec = {
  _model: model,
  type: null,
  uuid: null,
  overlay: null
};

/**
 * The Reference Record
 */

var Reference = exports.Reference = function (_Record) {
  (0, _inherits3.default)(Reference, _Record);

  function Reference() {
    (0, _classCallCheck3.default)(this, Reference);
    return (0, _possibleConstructorReturn3.default)(this, (Reference.__proto__ || (0, _getPrototypeOf2.default)(Reference)).apply(this, arguments));
  }

  (0, _createClass3.default)(Reference, [{
    key: 'getLocation',

    /**
     * returns the path of a reference in a store
     * @returns {List<string>} the path to use with store.getIn()
     */
    value: function getLocation() {
      return methods.getLocation(this);
    }

    /**
     * resolves a Reference against a Store. (finds what is located in the store at the location
     * described by the Reference)
     * @param {Store} store: the Store to search in
     * @returns {any} the object found in the Store at the location provided by the Reference. returns
     * undefined if not found
     */

  }, {
    key: 'resolve',
    value: function resolve(store) {
      return methods.resolve(this, store);
    }
  }]);
  return Reference;
}((0, _immutable.Record)(ReferenceSpec));

/**
 * returns the path of a reference in a store
 * @param {Reference} ref: the reference to get the path from
 * @returns {List<string>} the path to use with store.getIn()
 */


methods.getLocation = function (ref) {
  return [ref.get('type'), ref.get('uuid')];
};

/**
 * resolves a Reference against a Store. (finds what is located in the store at the location
 * described by the Reference)
 * @param {Reference} ref: the Reference to use to search the store
 * @param {Store} store: the Store to search in
 * @returns {any} the object found in the Store at the location provided by the Reference. returns
 * undefined if not found
 */
methods.resolve = function (ref, store) {
  var path = methods.getLocation(ref);
  var resolved = store.getIn(path);

  return resolved;
};

var __internals__ = exports.__internals__ = methods;
exports.default = Reference;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(106), __esModule: true };

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(111), __esModule: true };

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(23)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(7).setDesc
  , has = __webpack_require__(34)
  , TAG = __webpack_require__(9)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(55)
  , defined = __webpack_require__(33);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(33);
module.exports = function(it){
  return Object(defined(it));
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at  = __webpack_require__(132)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(58)(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(105), __esModule: true };

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(103), __esModule: true };

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(18)
  , TAG = __webpack_require__(9)('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

/***/ }),
/* 33 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 34 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var $          = __webpack_require__(7)
  , createDesc = __webpack_require__(38);
module.exports = __webpack_require__(22) ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = true;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(12)
  , core    = __webpack_require__(6)
  , fails   = __webpack_require__(23);
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(35);

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(32)
  , ITERATOR  = __webpack_require__(9)('iterator')
  , Iterators = __webpack_require__(15);
module.exports = __webpack_require__(6).getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(137);
var Iterators = __webpack_require__(15);
Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* istanbul ignore next */
if (typeof registerImporter === 'undefined' || typeof DynamicValue === 'undefined' || typeof DynamicString === 'undefined' || typeof registerCodeGenerator === 'undefined' || typeof InputField === 'undefined' || typeof NetworkHTTPRequest === 'undefined') {
  var mocks = __webpack_require__(72);
  module.exports = {
    registerImporter: mocks.registerImporter,
    DynamicValue: mocks.DynamicValue,
    DynamicString: mocks.DynamicString,
    registerCodeGenerator: mocks.registerCodeGenerator,
    InputField: mocks.InputField,
    NetworkHTTPRequest: mocks.NetworkHTTPRequest,
    RecordParameter: mocks.RecordParameter
  };
} else {
  /* eslint-disable no-undef */
  module.exports = {
    registerImporter: registerImporter,
    DynamicValue: DynamicValue,
    DynamicString: DynamicString,
    registerCodeGenerator: registerCodeGenerator,
    InputField: InputField,
    NetworkHTTPRequest: NetworkHTTPRequest,
    RecordParameter: RecordParameter
  };
  /* eslint-enable no-undef */
}

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Basic = __webpack_require__(82);

var _Basic2 = _interopRequireDefault(_Basic);

var _Digest = __webpack_require__(84);

var _Digest2 = _interopRequireDefault(_Digest);

var _NTLM = __webpack_require__(86);

var _NTLM2 = _interopRequireDefault(_NTLM);

var _Negotiate = __webpack_require__(87);

var _Negotiate2 = _interopRequireDefault(_Negotiate);

var _ApiKey = __webpack_require__(81);

var _ApiKey2 = _interopRequireDefault(_ApiKey);

var _OAuth = __webpack_require__(88);

var _OAuth2 = _interopRequireDefault(_OAuth);

var _OAuth3 = __webpack_require__(89);

var _OAuth4 = _interopRequireDefault(_OAuth3);

var _AWSSig = __webpack_require__(80);

var _AWSSig2 = _interopRequireDefault(_AWSSig);

var _Hawk = __webpack_require__(85);

var _Hawk2 = _interopRequireDefault(_Hawk);

var _Custom = __webpack_require__(83);

var _Custom2 = _interopRequireDefault(_Custom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Auth = {
  Basic: _Basic2.default,
  Digest: _Digest2.default,
  NTLM: _NTLM2.default,
  Negotiate: _Negotiate2.default,
  ApiKey: _ApiKey2.default,
  OAuth1: _OAuth2.default,
  OAuth2: _OAuth4.default,
  AWSSig4: _AWSSig2.default,
  Hawk: _Hawk2.default,
  Custom: _Custom2.default
};

exports.default = Auth;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__internals__ = exports.Group = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the Group Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'group.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the Group Record.
 */
var GroupSpec = {
  _model: model,
  id: null,
  name: null,
  description: null,
  children: (0, _immutable.OrderedMap)()
};

/**
 * Holds all the internal methods used in tandem with a Group
 */
var methods = {};

/**
 * The Group Record
 */

var Group = exports.Group = function (_Record) {
  (0, _inherits3.default)(Group, _Record);

  function Group() {
    (0, _classCallCheck3.default)(this, Group);
    return (0, _possibleConstructorReturn3.default)(this, (Group.__proto__ || (0, _getPrototypeOf2.default)(Group)).apply(this, arguments));
  }

  (0, _createClass3.default)(Group, [{
    key: 'getRequestIds',

    /**
     * Returns the list of all request Ids in the group and its sub groups
     * @returns {List<(string | number)>} a List with all the request Ids from the group
     * and its sub groups
     */
    value: function getRequestIds() {
      return methods.getRequestIds(this);
    }

    /**
     * Returns the list of all Requests in the group and its sub groups, if they are
     * present in a Request Map
     * WARNING: numerical ids are cast to strings
     * @param {?Map<Request>} requestMap: the Map from which to get the requests by
     * their ids
     * @returns {List<Request>} a List with all the existing Request from the group
     * and its sub groups
     */

  }, {
    key: 'getRequests',
    value: function getRequests(requestMap) {
      return methods.getRequests(this, requestMap);
    }
  }]);
  return Group;
}((0, _immutable.Record)(GroupSpec));

/**
 * Checks if an object is an Id or not
 * @param {string | number | Group} idOrGroup: the object to test
 * @returns {boolean} whether the object is an Id or not
 */


methods.isId = function (idOrGroup) {
  return typeof idOrGroup === 'string' || typeof idOrGroup === 'number';
};

/**
 * Checks if an object is a Group or not
 * @param {string | number | Group} idOrGroup: the object to test
 * @returns {boolean} whether the object is a Group or not
 */
methods.isGroup = function (idOrGroup) {
  return idOrGroup instanceof Group;
};

/**
 * a reducer to flatten a List of List into a List
 * @param {List<A>} flatList: the flattened List
 * @param {List<A>} list: the List to add to the flat list
 * @returns {List<A>} the updated flat List
 */
methods.flattenReducer = function (flatList, list) {
  return flatList.concat(list);
};

/**
 * Returns the list of all request Ids in the group and its sub groups
 * @param {Group} group: the group to extract the request Ids from
 * @returns {List<(string | number)>} a List with all the request Ids from the group
 * and its sub groups
 */
methods.getRequestIds = function (group) {
  if (!group || typeof group.get !== 'function' || !group.get('children')) {
    return (0, _immutable.List)();
  }

  var children = group.get('children').valueSeq();
  var requestsIds = children.filter(methods.isId);
  var groups = children.filter(methods.isGroup);

  var nestedRequestIds = groups.map(methods.getRequestIds);

  return nestedRequestIds.reduce(methods.flattenReducer, (0, _immutable.List)()).concat(requestsIds);
};

/**
 * Checks if an object is a Request or not
 * @param {any} request: the object to test
 * @returns {boolean} whether the object is a Request or not
 */
methods.isRequest = function (request) {
  return !!request;
};

/**
 * Returns the list of all Requests in the group and its sub groups, if they are
 * present in a Request Map
 * WARNING: numerical ids are cast to strings
 * @param {Group} group: the group to extract the request Ids from
 * @param {?Map<Request>} requestMap: the Map from which to get the requests by
 * their ids
 * @returns {List<Request>} a List with all the existing Request from the group
 * and its sub groups
 */
methods.getRequests = function (group, requestMap) {
  if (!requestMap || typeof requestMap.get !== 'function') {
    return (0, _immutable.List)();
  }

  var ids = methods.getRequestIds(group);

  return ids.map(function (id) {
    return requestMap.get(id + '');
  }).filter(methods.isRequest);
};

var __internals__ = exports.__internals__ = methods;
exports.default = Group;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Info = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the Info Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'info.utils.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the Info Record.
 */
var InfoSpec = {
  _model: model,
  title: null,
  description: null,
  tos: null,
  contact: null,
  license: null,
  version: null
};

/**
 * The Info Record
 */

var Info = exports.Info = function (_Record) {
  (0, _inherits3.default)(Info, _Record);

  function Info() {
    (0, _classCallCheck3.default)(this, Info);
    return (0, _possibleConstructorReturn3.default)(this, (Info.__proto__ || (0, _getPrototypeOf2.default)(Info)).apply(this, arguments));
  }

  return Info;
}((0, _immutable.Record)(InfoSpec));

exports.default = Info;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__internals__ = exports.Parameter = undefined;

var _typeof2 = __webpack_require__(13);

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = __webpack_require__(21);

var _keys2 = _interopRequireDefault(_keys);

var _assign = __webpack_require__(20);

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

var _Reference = __webpack_require__(19);

var _Reference2 = _interopRequireDefault(_Reference);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the Parameter Record.
 * Used for internal serialization and deserialization
 */

// import jsf from 'json-schema-faker'

var modelInstance = {
  name: 'parameter.core.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the Parameter Record.
 * @property {string} in: the location of the parameter (header, query, body, ...). Mainly used for
 * shared parameters, as the ParameterStore is location agnostic
 * @property {string} usedIn: the type of object that holds the parameter (can be either request or
 * response)
 * @property {string} uuid:  a string that uniquely identifies this parameter (not a true uuid)
 * @property {string} key: the key of the Parameter as used in the header, query, body, etc.
 * @property {string} name?: a humand readable name for the Parameter like `Access token`
 * @property {string} description: a description of the purpose of the parameter
 * @property {List<*>} examples: a List of values that are valid representations of the parameter
 * @property {string} type: the JSON type of the Parameter
 * @property {string} format: the format of the Parameter (highly coupled with type)
 * @property {any} default: the default value of the Parameter
 * @property {boolean} required: whether the Parameter is mandatory or not.
 * @property {string} superType: some Parameters have complex representations, like sequences of
 * string Parameters that combine together create what would be a DynamicString in Paw or a string
 * with environment variables in Postman. the superType helps further define what the behavior of
 * the parameter is, without supercharging other fields (like format or type) with semantics that
 * are only relevant inside the model
 * @property {any} value: an object that is relevant to the construction of the Parameter, depending
 * on the superType. For instance, it could be a List<Parameter>, if the superType is "sequence".
 * @property {List<Constraint>} constraints: a List of Constraint that the Parameter must respect.
 * it is used to generate a JSON Schema out of the Parameter, and also to test if a value is valid
 * with respect to the Parameter. For instance, 'application/json' is not a valid Value for a
 * Parameter with the constraints: List([ new Contraint.Enum([ 'application/xml' ]) ])
 * @property {List<Parameter>} applicableContexts: a List of Parameters that help define whether
 * the Parameter can used in a given Context. @see methods.@isValid for more information
 * @property {Map<*, Reference)>} interfaces: a List of Interfaces implemented by the Parameter.
 * This is used to extract shared features at difference levels (like Resource, Request, Response,
 * URL, and Parameter).
 */
var ParameterSpec = {
  _model: model,
  in: null,
  usedIn: 'request',
  uuid: null,
  key: null,
  name: null,
  description: null,
  examples: (0, _immutable.List)(),
  type: null,
  format: null,
  default: null,
  required: false,
  superType: null,
  value: null,
  constraints: (0, _immutable.List)(),
  applicableContexts: (0, _immutable.List)(),
  interfaces: (0, _immutable.Map)()
};

/**
 * Holds all the internal methods used in tandem with a Parameter
 */
var methods = {};

/**
 * The Parameter Record
 */

var Parameter = exports.Parameter = function (_Record) {
  (0, _inherits3.default)(Parameter, _Record);

  function Parameter() {
    (0, _classCallCheck3.default)(this, Parameter);
    return (0, _possibleConstructorReturn3.default)(this, (Parameter.__proto__ || (0, _getPrototypeOf2.default)(Parameter)).apply(this, arguments));
  }

  (0, _createClass3.default)(Parameter, [{
    key: 'getJSONSchema',

    /**
     * transforms a Parameter into a JSON Schema
     * @param {boolean} useFaker: whether to use Faker or not
     * @param {boolean} replaceRefs: whether to replace refs with simple strings or to replace them
     * with $refs
     * @returns {schema} the corresponding schema
     */
    value: function getJSONSchema() {
      var useFaker = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var replaceRefs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      return methods.getJSONSchema(this, useFaker, replaceRefs);
    }

    /**
     * generates a value from a Parameter or a JSON Schema.
     * @param {boolean} useDefault: whether to use the default value or not
     * @param {schema} _constraintSet: an optional schema to generate from. If this schema is
     * provided, the calling Parameter is ignored.
     * @returns {any} the generated value
     */

  }, {
    key: 'generate',
    value: function generate(useDefault, _constraintSet) {
      return methods.generate(this, useDefault, _constraintSet);
    }

    /**
     * validates a value against the constraints of a Parameter
     * @param {any} value: the value to test
     * @returns {boolean} whether the value respects all the constraints of the Parameter or not
     */

  }, {
    key: 'validate',
    value: function validate(value) {
      return methods.validate(this, value);
    }

    /**
     * tests whether there is an applicableContext in which the param is validated
     * @param {Parameter} param: the param to validate
     * @returns {boolean} whether the param respects all the constraints of one of the
     * applicableContexts or not
     */

  }, {
    key: 'isValid',
    value: function isValid(param) {
      return methods.isValid(this, param);
    }
  }]);
  return Parameter;
}((0, _immutable.Record)(ParameterSpec));

/**
 * merges a constraint schema with a schema
 * @param {schema} set: the schema to update
 * @param {schema} constraint: the constraint schema to merge
 * @returns {schema} the updated schema
 */


methods.mergeConstraintInSchema = function (set, constraint) {
  var obj = constraint.toJSONSchema();
  (0, _assign2.default)(set, obj);
  return set;
};

/**
 * adds constraints from a Parameter to a schema
 * @param {Parameter} param: the parameter to get the constraints from
 * @param {schema} schema: the schema to update
 * @returns {schema} the updated schema
 */
methods.addConstraintsToSchema = function (param, schema) {
  var constraints = param.get('constraints');
  var _schema = constraints.reduce(methods.mergeConstraintInSchema, schema);
  return _schema;
};

/**
 * normalizes the type from a Parameter
 * @param {string | any} type: the type to normalize
 * @returns {string} the infered type
 */
methods.inferType = function (type) {
  if (!type) {
    return null;
  }

  if (typeof type !== 'string') {
    return 'string';
  }

  if (type.match(/double/i) || type.match(/float/i)) {
    return 'number';
  }

  if (type.match(/date/i)) {
    return 'string';
  }

  return type;
};

/**
 * adds type from a Parameter to a schema
 * @param {Parameter} param: the parameter to get the type from
 * @param {schema} schema: the schema to update
 * @returns {schema} the updated schema
 */
methods.addTypeFromParameterToSchema = function (param, schema) {
  var types = ['integer', 'number', 'array', 'string', 'object', 'boolean', 'null'];

  var type = param.get('type') || '';

  if (types.indexOf(type) === -1) {
    type = methods.inferType(type);

    if (!type) {
      return schema;
    }
  }

  schema.type = type;
  return schema;
};

/**
 * adds title from a Parameter to a schema
 * @param {Parameter} param: the parameter to get the title from
 * @param {schema} schema: the schema to update
 * @returns {schema} the updated schema
 */
methods.addTitleFromParameterToSchema = function (param, schema) {
  var key = param.get('key');
  if (key) {
    schema['x-title'] = key;
  }

  return schema;
};

/**
 * adds the default value from a Parameter to a schema
 * @param {Parameter} param: the parameter to get the default value from
 * @param {schema} schema: the schema to update
 * @returns {schema} the updated schema
 */
methods.addDefaultFromParameterToSchema = function (param, schema) {
  var _default = param.get('default');
  if (_default !== null && typeof _default !== 'undefined') {
    schema.default = param.get('default');
  }

  return schema;
};

/**
 * transforms a simple Parameter into a schema
 * @param {Parameter} simple: the parameter to transform
 * @returns {schema} the corresponding schema
 */
methods.getJSONSchemaFromSimpleParameter = function (simple) {
  var schema = {};
  schema = methods.addConstraintsToSchema(simple, schema);
  schema = methods.addTypeFromParameterToSchema(simple, schema);
  schema = methods.addTitleFromParameterToSchema(simple, schema);
  schema = methods.addDefaultFromParameterToSchema(simple, schema);

  return schema;
};

/**
 * extracts the sequence from a SequenceParameter into a schema
 * @param {Parameter} sequenceParam: the parameter to get the sequence from
 * @param {schema} schema: the schema to update
 * @param {boolean} useFaker: whether we should use Faker or not
 * @returns {schema} the updated schema
 */
methods.addSequenceToSchema = function (sequenceParam, schema) {
  var useFaker = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var sequence = sequenceParam.get('value');
  if (!sequence) {
    return schema;
  }

  schema['x-sequence'] = sequence.map(function (param) {
    return methods.getJSONSchema(param, useFaker);
  }).toJS();

  schema.format = 'sequence';

  return schema;
};

/**
 * transforms a SequenceParameter into a schema
 * @param {Parameter} sequenceParam: the parameter to transform
 * @param {boolean} useFaker: whether we should use Faker or not
 * @returns {schema} the corresponding schema
 */
methods.getJSONSchemaFromSequenceParameter = function (sequenceParam) {
  var useFaker = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  var schema = {};
  schema = methods.addConstraintsToSchema(sequenceParam, schema);
  schema = methods.addTypeFromParameterToSchema(sequenceParam, schema);
  schema = methods.addTitleFromParameterToSchema(sequenceParam, schema);
  schema = methods.addSequenceToSchema(sequenceParam, schema, useFaker);
  return schema;
};

/**
 * extracts the items field from an ArrayParameter into a schema
 * @param {Parameter} param: the parameter to transform
 * @param {schema} schema: the schema to update
 * @param {boolean} useFaker: whether we should use Faker or not
 * @returns {schema} the updated schema
 */
methods.addItemstoSchema = function (param, schema) {
  var useFaker = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var items = param.get('value');
  if (items instanceof Parameter) {
    schema.items = methods.getJSONSchema(items, useFaker);
  }

  return schema;
};

/**
 * transforms an ArrayParameter into a schema
 * @param {Parameter} arrayParam: the parameter to transform
 * @param {boolean} useFaker: whether we should use Faker or not
 * @returns {schema} the corresponding schema
 */
methods.getJSONSchemaFromArrayParameter = function (arrayParam) {
  var useFaker = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  var schema = {};
  schema = methods.addConstraintsToSchema(arrayParam, schema);
  schema = methods.addTypeFromParameterToSchema(arrayParam, schema);
  schema = methods.addTitleFromParameterToSchema(arrayParam, schema);
  schema = methods.addItemstoSchema(arrayParam, schema, useFaker);

  return schema;
};

/**
 * applies the reference field from a ReferenceParameter to a schema
 * @param {Parameter} param: the parameter to get the reference from
 * @param {schema} schema: the schema to update
 * @returns {schema} the updated schema
 */
methods.addReferenceToSchema = function (param, schema) {
  var ref = param.get('value');

  if (!(ref instanceof _Reference2.default)) {
    return schema;
  }

  schema.$ref = ref.get('uuid');
  return schema;
};

/**
 * transforms a ReferenceParameter into a schema
 * @param {Parameter} refParam: the parameter to transform
 * @returns {schema} the corresponding schema
 */
methods.getJSONSchemaFromReferenceParameter = function (refParam) {
  var schema = {};

  schema = methods.addConstraintsToSchema(refParam, schema);
  schema = methods.addTitleFromParameterToSchema(refParam, schema);
  schema = methods.addReferenceToSchema(refParam, schema);

  return schema;
};

/**
 * adds Faker fields if applicable based on format of Parameter
 * @param {Parameter} param: the parameter to get the reference from
 * @param {schema} schema: the schema to update
 * @returns {schema} the updated schema
 */
methods.updateSchemaWithFaker = function (param, schema) {
  var fakerFormatMap = {
    email: {
      faker: 'internet.email'
    },
    // base64 endoded
    byte: {
      pattern: '^(?:[A-Za-z0-9+/]{4})*' + '(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$'
    },
    // not really binary but who cares
    binary: {
      pattern: '^.*$'
    },
    'date-time': {
      faker: 'date.recent'
    },
    password: {
      pattern: '^.*$'
    },
    sequence: {
      format: 'sequence'
    }
  };

  var format = param.get('format') || '';

  if (fakerFormatMap[format]) {
    var constraint = fakerFormatMap[format];
    var key = (0, _keys2.default)(constraint)[0];
    if (key && !schema[key]) {
      (0, _assign2.default)(schema, constraint);
    }
  }

  return schema;
};

/**
 * unescapes a URI fragment
 * @param {string} uriFragment: the uri fragment to unescape
 * @returns {string} the updated schema
 */
methods.unescapeURIFragment = function (uriFragment) {
  return uriFragment.replace(/~1/g, '/').replace(/~0/g, '~');
};

methods.replaceRefsInArray = function (obj) {
  for (var i = 0; i < obj.length; i += 1) {
    var content = obj[i];
    obj[i] = methods.replaceRefs(content);
  }
  return obj;
};

methods.replaceRefsInObject = function (obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      obj[key] = methods.replaceRefs(obj[key]);
    }
  }

  return obj;
};

/**
 * @deprecated (use at your own risk)
 * replaces References in a pseudo-schema with default values to make it a simple schema
 * @param {object} obj: the pseudo-schema to transform in a schema
 * @returns {schema} the corresponding schema
 */
methods.replaceRefs = function (obj) {
  if ((typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) !== 'object' || obj === null) {
    return obj;
  }

  if (obj.$ref) {
    obj.default = methods.unescapeURIFragment(obj.$ref.split('/').slice(-1)[0]);
    obj.type = 'string';
    delete obj.$ref;
  }

  if (Array.isArray(obj)) {
    return methods.replaceRefsInArray(obj);
  }

  return methods.replaceRefsInObject(obj);
};

methods.simplifyRefsInArray = function (obj) {
  for (var i = 0; i < obj.length; i += 1) {
    var content = obj[i];
    obj[i] = methods.simplifyRefs(content);
  }

  return obj;
};

methods.simplifyRefsInObject = function (obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      obj[key] = methods.simplifyRefs(obj[key]);
    }
  }

  return obj;
};

/**
 * replaces References in a pseudo-schema with $refs to make it a valid schema
 * @param {object} obj: the pseudo-schema to transform in a schema
 * @returns {schema} the corresponding schema
 */
methods.simplifyRefs = function (obj) {
  if ((typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) !== 'object' || obj === null) {
    return obj;
  }

  if (obj.$ref instanceof _Reference2.default) {
    obj.$ref = obj.$ref.get('uuid');
  }

  if (Array.isArray(obj)) {
    return methods.simplifyRefsInArray(obj);
  }

  return methods.simplifyRefsInObject(obj);
};

/**
 * tests wether a Parameter is simple (standard type, no weird things)
 * @param {Parameter} param: the parameter to test
 * @returns {boolean} the corresponding schema
 */
methods.isSimpleParameter = function (param) {
  if (param.get('superType')) {
    return false;
  }

  // if no type is provided assume simple
  var type = param.get('type') || null;

  var types = ['integer', 'number', 'string', 'object', 'boolean', 'null'];

  if (type && types.indexOf(type) === -1) {
    return false;
  }

  return true;
};

/**
 * tests wether a Parameter is a SequenceParameter
 * @param {Parameter} param: the parameter to test
 * @returns {boolean} the corresponding schema
 */
methods.isSequenceParameter = function (param) {
  var superType = param.get('superType') || '';

  return superType === 'sequence';
};

/**
 * tests wether a Parameter is an ArrayParameter
 * @param {Parameter} param: the parameter to test
 * @returns {boolean} the corresponding schema
 */
methods.isArrayParameter = function (param) {
  var type = param.get('type') || '';

  return type === 'array';
};

/**
 * tests wether a Parameter is a ReferenceParameter
 * @param {Parameter} param: the parameter to test
 * @returns {boolean} the corresponding schema
 */
methods.isReferenceParameter = function (param) {
  var superType = param.get('superType') || '';

  return superType === 'reference';
};

methods.getRawJSONSchema = function (parameter, useFaker) {
  if (methods.isSimpleParameter(parameter)) {
    return methods.getJSONSchemaFromSimpleParameter(parameter);
  }

  if (methods.isSequenceParameter(parameter)) {
    return methods.getJSONSchemaFromSequenceParameter(parameter, useFaker);
  }

  if (methods.isArrayParameter(parameter)) {
    return methods.getJSONSchemaFromArrayParameter(parameter, useFaker);
  }

  if (methods.isReferenceParameter(parameter)) {
    return methods.getJSONSchemaFromReferenceParameter(parameter);
  }

  return {};
};

/**
 * transforms a Parameter into a JSON Schema
 * @param {Parameter} parameter: the parameter to transform
 * @param {boolean} useFaker: whether to use Faker or not
 * @param {boolean} replaceRefs: whether to replace refs with simple strings or to replace them with
 * $refs
 * @returns {schema} the corresponding schema
 */
methods.getJSONSchema = function (parameter) {
  var useFaker = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var replaceRefs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var schema = methods.getRawJSONSchema(parameter, useFaker);

  if (useFaker) {
    schema = methods.updateSchemaWithFaker(parameter, schema);
  }

  if (replaceRefs) {
    schema = methods.replaceRefs(schema);
  } else {
    schema = methods.simplifyRefs(schema);
  }

  return schema;
};

/**
 * Gets the default value of a Parameter, if applicable
 * @param {Parameter} parameter: the parameter to get the default value of
 * @returns {any} the default value
 */
methods.generateFromDefault = function (parameter) {
  var _default = parameter.get('default');
  if (_default !== null && typeof _default !== 'undefined') {
    return _default;
  }

  return null;
};

methods.generateFromSequenceDefaults = function (parameter) {
  var sequence = parameter.get('value');
  if (!sequence) {
    return null;
  }

  var defaults = sequence.map(function (param) {
    return methods.generate(param) || '';
  }).toJS();

  return defaults.join('');
};

/**
 * generates a value from a Parameter or a JSON Schema.
 * @param {Parameter} parameter: the Parameter to get a JSON Schema from
 * @param {boolean} useDefault: whether to use the default value or not
 * @param {schema} _schema: an optional schema to generate from. If this schema is provided, the
 * Parameter is ignored.
 * @returns {any} the generated value
 */
methods.generate = function (parameter) {
  if (parameter.get('superType') === 'sequence') {
    return methods.generateFromSequenceDefaults(parameter);
  }

  return methods.generateFromDefault(parameter);
};

/**
 * validates a value against the constraints of a Parameter
 * @param {Parameter} parameter: the Parameter to test the value against
 * @param {any} value: the value to test
 * @returns {boolean} whether the value respects all the constraints of the Parameter or not
 */
methods.validate = function (parameter, value) {
  var constraints = parameter.get('constraints');
  return constraints.reduce(function (bool, cond) {
    return bool && cond.evaluate(value);
  }, true);
};

/**
 * tests whether there is an applicableContext in which the param is validated
 * @param {Parameter} source: the Parameter to get the applicableContexts from
 * @param {Parameter} param: the param to validate
 * @returns {boolean} whether the param respects all the constraints of one of the
 * applicableContexts or not
 */
methods.isValid = function (source, param) {
  var list = source.get('applicableContexts');
  // No external constraint
  if (list.size === 0) {
    return true;
  }

  return list.reduce(function (bool, _param) {
    // && has precedence on ||
    // === (1 || (2a && 2b))
    return bool || _param.get('key') === param.get('key') && _param.validate(param.get('default'));
  }, false);
};

var __internals__ = exports.__internals__ = methods;
exports.default = Parameter;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__internals__ = exports.ParameterContainer = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _fpUtils = __webpack_require__(17);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

var _Reference = __webpack_require__(19);

var _Reference2 = _interopRequireDefault(_Reference);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the ParameterContainer Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'parameter-container.core.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the ParameterContainer Record.
 */
var ParameterContainerSpec = {
  _model: model,
  headers: (0, _immutable.OrderedMap)(),
  queries: (0, _immutable.OrderedMap)(),
  body: (0, _immutable.OrderedMap)(),
  path: (0, _immutable.OrderedMap)()
};

/**
 * Holds all the internal methods used in tandem with a ParameterContainer
 */
var methods = {};

/**
 * The ParameterContainer Record
 */

var ParameterContainer = exports.ParameterContainer = function (_Record) {
  (0, _inherits3.default)(ParameterContainer, _Record);

  function ParameterContainer() {
    (0, _classCallCheck3.default)(this, ParameterContainer);
    return (0, _possibleConstructorReturn3.default)(this, (ParameterContainer.__proto__ || (0, _getPrototypeOf2.default)(ParameterContainer)).apply(this, arguments));
  }

  (0, _createClass3.default)(ParameterContainer, [{
    key: 'getHeadersSet',

    /**
     * gets a set of headers from a ParameterContainer
     * @returns {OrderedMap} the set of headers
     */
    value: function getHeadersSet() {
      return methods.getHeadersSet(this);
    }

    /**
     * resolves all the References the ParameterContainer contains to their corresponding object in
     * a given store
     * @param {Store} store: the store to use to resolve Reference
     * @returns {ParameterContainer} a ParameterContainer with as few References as possible
     */

  }, {
    key: 'resolve',
    value: function resolve(store) {
      return methods.resolve(this, store);
    }

    /**
     * filters a ParameterContainer based on a set of constraint Parameter from a Context
     * @param {List<Parameter>} contextContraints: a List of constraint Parameters from a Context
     * @returns {ParameterContainer} a ParameterContainer that respects all the constraints from a
     * Context.
     */

  }, {
    key: 'filter',
    value: function filter(contextContraints) {
      return methods.filter(this, contextContraints);
    }
  }]);
  return ParameterContainer;
}((0, _immutable.Record)(ParameterContainerSpec));

/**
 * adds a Parameter to an object based on its key field
 * @param {obj} set: the set to update
 * @param {Parameter} param: the Parameter to add
 * @returns {set} the updated set
 */


methods.headerSetReducer = function (set, param) {
  var key = param.get('key');

  if (key === null || typeof key === 'undefined') {
    return set;
  }

  set[param.get('key')] = param;
  return set;
};

/**
 * gets a set of headers from a ParameterContainer
 * @param {ParameterContainer} container: the ParameterContainer to get the headers from
 * @returns {OrderedMap} the set of headers
 */
methods.getHeadersSet = function (container) {
  var headers = container.get('headers');
  var _set = headers.reduce(methods.headerSetReducer, {});
  return new _immutable.OrderedMap(_set);
};

/**
 * filters a block against a Parameter
 * @param {List<Parameter>} block: a list of Parameters belonging to a certain part of a request,
 * like headers, or query params, etc.
 * @param {Parameter} param: the Parameter to test the validation against
 * @returns {List<Parameter>} the filtered block with only valid Parameters against the param
 */
methods.filterBlockReducer = function (block, param) {
  return block.filter(function (d) {
    return d.isValid(param);
  });
};

/**
 * filters a block against a list of constraints from a context
 * @param {List<Parameter>} block: a list of Parameters belonging to a certain part of a request,
 * like headers, or query params, etc.
 * @param {List<Parameter>} contextContraints: the list of Parameters to test against
 * @returns {List<Parameter>} the filtered block with only valid Parameters against the
 * contextContraints
 */
methods.filterBlock = function (block, contextContraints) {
  return contextContraints.reduce(methods.filterBlockReducer, block);
};

/**
 * filters a block against a list of constraints from a context
 * @param {ParameterContainer} container: the ParameterContainer to filter based on the context
 * @param {List<Parameter>} contextContraints: the list of Parameters to test against
 * @returns {ParameterContainer} the filtered ParameterContainer with only valid Parameters
 * against the contextContraints
 */
methods.filter = function (container, contextContraints) {
  if (!contextContraints) {
    return container;
  }

  var headers = methods.filterBlock(container.get('headers'), contextContraints);
  var queries = methods.filterBlock(container.get('queries'), contextContraints);
  var body = methods.filterBlock(container.get('body'), contextContraints);
  var path = methods.filterBlock(container.get('path'), contextContraints);

  return container.withMutations(function (_container) {
    _container.set('headers', headers).set('queries', queries).set('body', body).set('path', path);
  });
};

methods.resolveReference = function (store, paramOrRef) {
  if (paramOrRef instanceof _Reference2.default) {
    return store.getIn(paramOrRef.getLocation());
  }

  return paramOrRef;
};

methods.removeUnresolvedRefs = function (param) {
  return !!param;
};

methods.resolveBlock = function (store, block) {
  var transformRefs = (0, _fpUtils.currify)(methods.resolveReference, store);
  return block.map(transformRefs).filter(methods.removeUnresolvedRefs);
};

methods.resolve = function (container, store) {
  var resolveBlock = (0, _fpUtils.currify)(methods.resolveBlock, store);
  var headers = resolveBlock(container.get('headers'));
  var queries = resolveBlock(container.get('queries'));
  var body = resolveBlock(container.get('body'));
  var path = resolveBlock(container.get('path'));

  var resolved = container.withMutations(function (_container) {
    _container.set('headers', headers).set('queries', queries).set('body', body).set('path', path);
  });

  return resolved;
};

var __internals__ = exports.__internals__ = methods;
exports.default = ParameterContainer;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Store = undefined;

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the Store Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'store.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the Store Record.
 */
var StoreSpec = {
  _model: model,
  variable: new _immutable.OrderedMap(),
  constraint: new _immutable.OrderedMap(),
  endpoint: new _immutable.OrderedMap(),
  parameter: new _immutable.OrderedMap(),
  response: new _immutable.OrderedMap(),
  auth: new _immutable.OrderedMap(),
  interface: new _immutable.OrderedMap()
};

/**
 * The Store Record
 */
var Store = exports.Store = (0, _immutable.Record)(StoreSpec);

exports.default = Store;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__internals__ = exports.URLComponent = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

var _Parameter = __webpack_require__(46);

var _fpUtils = __webpack_require__(17);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the URLComponent Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'url-component.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the URLComponent Record.
 */
var URLComponentSpec = {
  _model: model,
  componentName: null,
  string: null,
  parameter: null,
  variableDelimiters: (0, _immutable.List)()
};

/**
 * Holds all the internal methods used in tandem with a URLComponent
 */
var methods = {};

/**
 * The URLComponent Record
 */

var URLComponent = exports.URLComponent = function (_Record) {
  (0, _inherits3.default)(URLComponent, _Record);

  /**
   * @constructor
   * @param {Object} component: the url component to represent as a URLComponent Record.
   */
  function URLComponent(component) {
    var _ret;

    (0, _classCallCheck3.default)(this, URLComponent);

    if (component && component.string && !component.parameter) {
      component.parameter = methods.convertStringToParameter(component.componentName, component.string, component.variableDelimiters);
    }

    var _this = (0, _possibleConstructorReturn3.default)(this, (URLComponent.__proto__ || (0, _getPrototypeOf2.default)(URLComponent)).call(this, component));

    return _ret = _this, (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  /**
   * adds a constraint to the parameter of a URLComponent
   * @param {Constraint} constraint: the constraint to add
   * @returns {URLComponent} the updated URLComponent
   */


  (0, _createClass3.default)(URLComponent, [{
    key: 'addConstraint',
    value: function addConstraint(constraint) {
      return methods.addConstraintToURLComponent(this, constraint);
    }

    /**
     * generates a string representing a URLComponent, with variables wrapped based on the
     * variableDelimiters.
     * @param {List<string>} variableDelimiters: the variable delimiters. like List([ '{{', '}}' ])
     * @param {boolean} useDefault: whether to use the default value or to generate from the JSON
     * schema
     * @returns {Parameter} the updated Parameter
     */

  }, {
    key: 'generate',
    value: function generate() {
      var variableDelimiters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _immutable.List)();
      var useDefault = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      return methods.generateURLComponent(this, variableDelimiters, useDefault);
    }
  }]);
  return URLComponent;
}((0, _immutable.Record)(URLComponentSpec));

/**
 * creates a simple Parameter from a key, value pair
 * @param {string} key: the key of the pair
 * @param {string} value: the value of the pair
 * @returns {Parameter} the corresponding Parameter
 */


methods.convertSimpleStringToParameter = function () {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var value = arguments[1];

  return new _Parameter.Parameter({
    key: key,
    name: key,
    type: 'string',
    default: value
  });
};

/**
 * a Map function to convert a string in a Parameter based on its index in the array.
 * A Parameter without a key is simply a string waiting to be generated, while a Parameter with a
 * key is a `variable` that could be referred to. We assume that the array is an alternating list of
 * var/non-var elements, starting with a non-var string
 * @param {string} section: the string to convert to a Parameter
 * @param {string} index: the index in the array of the string
 * @returns {Parameter} the corresponding Parameter
 */
methods.sectionMapper = function (section, index) {
  var key = index % 2 ? section : null;
  return methods.convertSimpleStringToParameter(key, section);
};

/**
 * transforms a string into a List<string> based on the variable delimiters
 * @param {string} string: the string to split
 * @param {List<string>} delimiters: the variable delimiters used to separate variables from
 * non-variables. like List([ '{{', '}}' ])
 * @returns {List<string>} the list containing all the variable/non-variable strings, in order
 *
 * NOTE: this will fail to behave correctly if the delimiters are special parts of a regex, like '$'
 */
methods.extractSectionsFromString = function (string, delimiters) {
  var regex = new RegExp(delimiters.slice(0, 2).join('(.+?)'));
  var sections = string.split(regex);
  if (delimiters.size <= 2) {
    return sections;
  }

  var subRegex = new RegExp(delimiters.slice(2).join('(.+?)'));
  return sections.map(function (section) {
    return section.split(subRegex);
  }).reduce(_fpUtils.flatten, []);
};

/**
 * converts a url component into a SequenceParameter, with its variables extracted based on
 * the delimiters provided
 * @param {string} key: the type of URL component (hostname, pathname, etc.)
 * @param {string} string: the string to transform into a sequence
 * @param {List<string>} delimiters: the variable delimiters. like List([ '{{', '}}' ])
 * @returns {Parameter} the corresponding Parameter
 */
methods.convertComplexStringToSequenceParameter = function (key, string, delimiters) {
  var sections = methods.extractSectionsFromString(string, delimiters);
  var sequence = sections.map(methods.sectionMapper);

  if (sequence.length === 1) {
    return sequence[0].set('key', key).set('name', key);
  }

  return new _Parameter.Parameter({
    key: key,
    name: key,
    type: 'string',
    superType: 'sequence',
    value: (0, _immutable.List)(sequence)
  });
};

/**
 * converts a url component into a Parameter, with its variables extracted based on
 * the delimiters provided
 * @param {string} key: the type of URL component (hostname, pathname, etc.)
 * @param {string} string: the string to transform into a Parameter
 * @param {List<string>} delimiters: the variable delimiters. like List([ '{{', '}}' ])
 * @returns {Parameter} the corresponding Parameter
 */
methods.convertStringToParameter = function (key, string) {
  var delimiters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : (0, _immutable.List)();

  if (delimiters.size === 0) {
    return methods.convertSimpleStringToParameter(key, string);
  }

  return methods.convertComplexStringToSequenceParameter(key, string, delimiters);
};

/**
 * adds a constraint to the parameter of a URLComponent
 * @param {URLComponent} urlComponent: the URLComponent to update
 * @param {Constraint} constraint: the constraint to add
 * @returns {URLComponent} the updated URLComponent
 */
methods.addConstraintToURLComponent = function (urlComponent, constraint) {
  var parameter = urlComponent.get('parameter');
  if (!parameter) {
    parameter = methods.convertStringToParameter(urlComponent.get('componentName'), urlComponent.get('string'), urlComponent.get('variableDelimiters'));
  }
  var constraints = parameter.get('constraints');

  constraints = constraints.push(constraint);
  parameter = parameter.set('constraints', constraints);
  return urlComponent.set('parameter', parameter);
};

/**
 * wraps a variable with handles.
 * @param {string} variable: the variable to wrap
 * @param {List<string>} delimiters: the variable delimiters. like List([ '{{', '}}' ])
 * @returns {string} the wrapped variable
 */
methods.addHandlesToVariable = function (variable, delimiters) {
  var handles = (0, _immutable.List)([delimiters.get(0), typeof delimiters.get(1) !== 'undefined' ? delimiters.get(1) : delimiters.get(0)]);

  return handles.join(variable);
};

/**
 * wraps with handles all variables in the sequence of a SequenceParameter.
 * @param {Parameter} param: the SequenceParameter to update
 * @param {List<string>} delimiters: the variable delimiters. like List([ '{{', '}}' ])
 * @returns {Parameter} the updated Parameter
 */
methods.addVarHandlesToVariablesInSequenceParameter = function (param, delimiters) {
  var sequence = param.get('value');
  var sequenceWithVars = sequence.map(function (section, index) {
    if (index % 2 === 0) {
      return section;
    }

    var variable = methods.addHandlesToVariable(section.get('key'), delimiters);
    return section.set('default', variable);
  });

  return param.set('value', sequenceWithVars);
};

/**
 * generates a string representing a URLComponent, with variables wrapped based on the
 * variableDelimiters.
 * @param {URLComponent} urlComponent: the URLComponent to transform in a string
 * @param {List<string>} variableDelimiters: the variable delimiters. like List([ '{{', '}}' ])
 * @param {boolean} useDefault: whether to use the default value or to generate from the JSON schema
 * @returns {Parameter} the updated Parameter
 */
methods.generateURLComponent = function (urlComponent) {
  var variableDelimiters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _immutable.List)();
  var useDefault = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var parameter = urlComponent.get('parameter');
  if (variableDelimiters.size !== 0 && parameter.get('superType') === 'sequence') {
    parameter = methods.addVarHandlesToVariablesInSequenceParameter(parameter, variableDelimiters);
  }

  return parameter.generate(useDefault);
};

var __internals__ = exports.__internals__ = methods;
exports.default = URLComponent;

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(108), __esModule: true };

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(113), __esModule: true };

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _isIterable2 = __webpack_require__(95);

var _isIterable3 = _interopRequireDefault(_isIterable2);

var _getIterator2 = __webpack_require__(30);

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if ((0, _isIterable3.default)(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
})();

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _from = __webpack_require__(94);

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(26)
  , getNames  = __webpack_require__(7).getNames
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return getNames(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.get = function getOwnPropertyNames(it){
  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
  return getNames(toIObject(it));
};

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(18);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators  = __webpack_require__(15)
  , ITERATOR   = __webpack_require__(9)('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(11);
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY        = __webpack_require__(36)
  , $export        = __webpack_require__(12)
  , redefine       = __webpack_require__(39)
  , hide           = __webpack_require__(35)
  , has            = __webpack_require__(34)
  , Iterators      = __webpack_require__(15)
  , $iterCreate    = __webpack_require__(122)
  , setToStringTag = __webpack_require__(25)
  , getProto       = __webpack_require__(7).getProto
  , ITERATOR       = __webpack_require__(9)('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , methods, key;
  // Fix native
  if($native){
    var IteratorPrototype = getProto($default.call(new Base));
    // Set @@toStringTag to native iterators
    setToStringTag(IteratorPrototype, TAG, true);
    // FF fix
    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    // fix Array#{values, @@iterator}.name in V8 / FF
    if(DEF_VALUES && $native.name !== VALUES){
      VALUES_BUG = true;
      $default = function values(){ return $native.call(this); };
    }
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES  ? $default : getMethod(VALUES),
      keys:    IS_SET      ? $default : getMethod(KEYS),
      entries: !DEF_VALUES ? $default : getMethod('entries')
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR     = __webpack_require__(9)('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = __webpack_require__(7).getDesc
  , isObject = __webpack_require__(24)
  , anObject = __webpack_require__(11);
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = __webpack_require__(14)(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(10)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ }),
/* 62 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(62)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 64 */
/***/ (function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 65 */
/***/ (function(module, exports) {



/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var punycode = __webpack_require__(145);
var util = __webpack_require__(149);

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = __webpack_require__(148);

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__internals__ = exports.DefaultApiFlow = undefined;

var _promise = __webpack_require__(51);

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

var _environment = __webpack_require__(68);

var _environment2 = _interopRequireDefault(_environment);

var _loaders = __webpack_require__(70);

var _loaders2 = _interopRequireDefault(_loaders);

var _parsers = __webpack_require__(90);

var _parsers2 = _interopRequireDefault(_parsers);

var _serializers = __webpack_require__(93);

var _serializers2 = _interopRequireDefault(_serializers);

var _fpUtils = __webpack_require__(17);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var methods = {};

/**
 * @class DefaultApiFlow
 * @description The default core class of API-Flow.
 * It holds all the necessary methods used to convert a file from one format to another.
 */
// TODO this is not what we want (this should happen in ./loaders/loaders, ./parsers/parsers, etc.)

var DefaultApiFlow = exports.DefaultApiFlow = function () {
  function DefaultApiFlow() {
    (0, _classCallCheck3.default)(this, DefaultApiFlow);
  }

  (0, _createClass3.default)(DefaultApiFlow, null, [{
    key: 'detectFormat',

    /**
     * detects the format of a given content
     * @param {string} content: the content whose format needs to be found
     * @returns {{format: string, version: string}} the corresponding format object
     * @static
     */
    value: function detectFormat(content) {
      // TODO implement this
      return methods.detect(content);
    }

    /**
     * detects the name of a given API from a given content
     * @param {string} content: the content whose name needs to be guessed
     * @returns {string?} the corresponding API name, if it exists
     * @static
     */

  }, {
    key: 'detectName',
    value: function detectName(content) {
      // TODO implement this
      return methods.detectName(content);
    }

    /**
     * updates an environment cache with a set of resolved uris
     * @param {Object<URIString, string>} cache: an object where each key-value pair is a uri string
     * and its associated content
     * @returns {void}
     * @static
     */

  }, {
    key: 'setCache',
    value: function setCache(cache) {
      _environment2.default.setCache(cache);
    }

    /**
     * sets an environment up based on options
     * @param {Object} args: the named args of this method
     * @param {Object} args.options: a set of options containing settings relevant to the set-up of
     * the converter
     * @returns {void}
     * @static
     */

  }, {
    key: 'setup',
    value: function setup() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          options = _ref.options;

      // TODO implement this
      return methods.setup({ options: options });
    }

    /**
     * finds a primaryUri from an array of multiple items. A primaryUri is the root uri from which
     * all the other files are resolved. For instance, in a RAML document, there exists a root
     * document (with the header `#%RAML 1.0`) which can refer to multiple other subcomponents such as
     * RAML libraries. The root document's uri would be the primary uri.
     * @param {Object} args: the named args of this method
     * @param {Object} args.options: a set of options containing settings relevant to the behavior of
     * the converter
     * @param {Array<{uri: string}>} items: an array of uris from which one should be chosen as the
     * Primary URI
     * @returns {string?} the corresponding API name, if it exists
     * @static
     */

  }, {
    key: 'findPrimaryUri',
    value: function findPrimaryUri(_ref2) {
      var options = _ref2.options,
          items = _ref2.items;

      return methods.findPrimaryUri({ options: options, items: items });
    }

    /**
     * resolves a uri to a file and normalizes it based on the loader selected from the options object
     * @param {Object} args: the named args of this method
     * @param {Object} args.options: a set of options containing settings relevant to the loading of
     * the uri and it's normalization
     * @param {Object} args.uri: the uri to resolve
     * @returns {Promise} a promise that resolves if the uri is successfully loaded and normalized.
     * It resolves to the object { options, item }, where options are the options passed to the load
     * method, and item contains the normalized content of the uri.
     * @static
     */

  }, {
    key: 'load',
    value: function load(_ref3) {
      var options = _ref3.options,
          uri = _ref3.uri;

      return methods.load({ options: options, uri: uri });
    }

    /**
     * converts a normalized item in a specific format into the intermediate model.
     * @param {Object} args: the named args of this method
     * @param {Object} args.options: a set of options containing settings relevant to the parsing of
     * the item
     * @param {Object} args.item: the item to parse
     * @returns {Promise} a promise that resolves if the item is successfully parsed.
     * It resolves to the object { options, api }, where options are the options passed to the parse
     * method, and api contains the intermediate model representing the item.
     * @static
     */

  }, {
    key: 'parse',
    value: function parse(_ref4) {
      var options = _ref4.options,
          item = _ref4.item;

      return methods.parse({ options: options, item: item });
    }

    /**
     * converts an intermediate model api into a specific format.
     * @param {Object} args: the named args of this method
     * @param {Object} args.options: a set of options containing settings relevant to the
     * serialization of the model
     * @param {Object} args.api: the model to serialize
     * @returns {Promise} a promise that resolves if the item is successfully parsed.
     * It resolves to the string representation of the api in the target format
     * @static
     */

  }, {
    key: 'serialize',
    value: function serialize(_ref5) {
      var options = _ref5.options,
          api = _ref5.api;

      return methods.serialize({ options: options, api: api });
    }

    /**
     * resolves a uri to a file, loads, parses and converts it based on the provided options object.
     * It is a shorthand method for the successive calls of `load`, `parse` and `serialize`.
     * @param {Object} args: the named args of this method
     * @param {Object} args.options: a set of options containing settings relevant to the conversion
     * of the file at the given uri
     * @param {Object} args.uri: the uri of the file to convert
     * @returns {Promise} a promise that resolves if the uri is successfully loaded and converted.
     * It resolves to the string representation of the api in the target format.
     * @static
     */

  }, {
    key: 'transform',
    value: function transform(_ref6) {
      var options = _ref6.options,
          uri = _ref6.uri;

      return methods.transform({ options: options, uri: uri });
    }
  }]);
  return DefaultApiFlow;
}();

// TODO implement this


methods.findPrimaryUri = function (_ref7) {
  var items = _ref7.items;

  var candidate = items.filter(function (item) {
    return _loaders2.default.filter(function (loader) {
      return loader.isParsable(item);
    }).length > 0;
  })[0];

  if (!candidate) {
    return null;
  }

  return candidate.uri;
};

methods.setup = function () {
  var _ref8 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref8$options = _ref8.options,
      options = _ref8$options === undefined ? {} : _ref8$options;

  options.fsResolver = _environment2.default.fsResolver;
  options.httpResolver = _environment2.default.httpResolver;

  return options;
};

/**
 * finds a loader for the source format, or infers one from the extension of the primary file
 * @param {Object} args: the named arguments of the methods
 * @param {Object} args.options: the settings to use to convert this ensemble of items
 * @param {Object} args.primary: the primary file of this conversion, it is used as a starting point
 * by the loader to extract all required dependencies, and fix files if needed
 * @returns {Loader?} the loader that is required to prepare the primary file and its associated
 * items, if one was found.
 */
methods.getLoader = function (_ref9) {
  var _ref9$options = _ref9.options,
      options = _ref9$options === undefined ? {} : _ref9$options,
      uri = _ref9.uri;

  var _ref10 = options.source || {},
      format = _ref10.format;

  if (!format) {
    var _loader = _loaders2.default.getLoaderByExtension(uri, true);
    return _loader;
  }

  var loader = _loaders2.default.getLoaderByFormat(format);
  return loader;
};

/**
 * load a primary file and associated items in memory, with all the required dependencies that can
 * be resolved, and fixes the files to remove external information
 * @param {Object} args: the named arguments of the methods
 * @param {Object} args.options: the settings to use to convert this ensemble of items
 * @param {string} args.uri: the uri of the primary file
 * @param {Item?} args.primary: the primary file to load, if there is one.
 * @returns {Promise} a promise that resolves once everything needed has been loaded into memory.
 */
methods.load = function (_ref11) {
  var options = _ref11.options,
      uri = _ref11.uri;

  var $options = options;
  if (!options || !options.fsResolver || !options.httpResolver) {
    $options = methods.setup({ options: options });
  }

  var loader = methods.getLoader({ options: $options, uri: uri });

  if (!loader) {
    return _promise2.default.reject(new Error('could not load file(s): missing source format'));
  }

  return loader.load({ options: $options, uri: uri });
};

/**
 * iteratively (reduce) finds the best parser for a given item
 * @param {Item} item: the item to test the parser against
 * @param {{score: number, format: string, version: string}} best: the best parser found yet
 * @param {Parser} parser: the parser to test
 * @returns {{score: number, format: string, version: string}} best: the updated best parser
 */
methods.findBestParser = function (item, best, parser) {
  var _parser$detect = parser.detect(item),
      format = _parser$detect.format,
      version = _parser$detect.version,
      score = _parser$detect.score;

  if (best.score < score) {
    return { format: format, version: version, score: score };
  }

  return best;
};

/**
 * groups item results by format and version, iff the associated score is above 0.9
 * @param {Object} acc: the accumulator that holds the items grouped by format and version
 * @param {{score: number, format: string, version: string}} toGroup: the best parser associated
 * with an item
 * @return {Object} acc: the updated accumulator
 */
methods.groupByFormatAndVersion = function (acc, toGroup) {
  var version = toGroup.version,
      format = toGroup.format,
      score = toGroup.score;


  if (score < 0.9) {
    return acc;
  }

  var key = format + '@' + version;
  acc[key] = acc[key] || [];
  acc[key].push(toGroup);
  return acc;
};

/**
 * infers the version of the format that should be used for the items
 * @param {string} format: the format of the items
 * @param {Item} item: the item to use to find the version of the format
 * @returns {{format: string, version: string?}} the infered format and version
 */
methods.inferVersion = function (format, item) {
  var potentialParsers = _parsers2.default.getParsersByFormat(format);

  var findBestParser = (0, _fpUtils.currify)(methods.findBestParser, item);
  var candidate = potentialParsers.reduce(findBestParser, { format: format, version: null, score: -1 });

  if (candidate.format && candidate.version) {
    return { format: format, version: candidate.version };
  }

  return { format: format, version: null };
};

/**
 * infers the format and version that should be used for the items
 * @param {Item} item: the items to use to find the version of the format
 * @returns {{format: string?, version: string?}} the infered format and version
 */
methods.inferBestFormatAndBestVersion = function (item) {
  var potentialParsers = _parsers2.default.getParsers();

  var findBestParser = (0, _fpUtils.currify)(methods.findBestParser, item);
  var candidate = potentialParsers.reduce(findBestParser, { format: null, version: null, score: -1 });

  if (candidate.format && candidate.version) {
    return { format: candidate.format, version: candidate.version };
  }

  return { format: null, version: null };
};

/**
 * complements format and version with infered format and version from items
 * @param {Object} args: the named arguments of the method
 * @param {string?} args.format: the parse format of the loaded items, if it was provided,
 * @param {string?} args.version: the version of the format of the primary file, if it was provided.
 * @param {Array<Item>} args.items: the items to use to infer the missing format and/or the missing
 * version of the loader
 * @returns {{ format: string?, version: string? }} the resulting format and version
 */
methods.inferFormatAndVersion = function (_ref12) {
  var format = _ref12.format,
      version = _ref12.version,
      item = _ref12.item;

  if (format && version) {
    return { format: format, version: version };
  }

  if (format) {
    return methods.inferVersion(format, item);
  }

  return methods.inferBestFormatAndBestVersion(item);
};

/**
 * finds the parser corresponding to a set of items or infers it.
 * @param {Object} args: the named arguments of the method
 * @param {Object} args.options: the settings to use to parse the items
 * @param {Array<Item>} items: the loaded items.
 * @returns {Parser?} the corresponding parser
 */
methods.getParser = function (_ref13) {
  var _ref13$options = _ref13.options,
      options = _ref13$options === undefined ? {} : _ref13$options,
      item = _ref13.item;

  var _ref14 = options.source || {},
      format = _ref14.format,
      version = _ref14.version;

  if (!format || !version) {
    var infered = methods.inferFormatAndVersion({ format: format, version: version, item: item });

    format = infered.version;
    version = infered.version;
  }

  if (!format || !version) {
    return null;
  }

  var parser = _parsers2.default.getParserByFormatAndVersion({ format: format, version: version });
  return parser;
};

/**
 * parses an array of loaded items into Apis
 * @param {Object} args: the named arguments of the method
 * @param {Object} args.options: the settings to use to parse the items
 * @param {Array<Item>} items: the loaded items to parse
 * @returns {Promise} a promise that resolves with an array of Apis and options if it successfully
 * parses the items
 */
methods.parse = function (_ref15) {
  var options = _ref15.options,
      item = _ref15.item;

  var parser = methods.getParser({ options: options, item: item });

  if (!parser) {
    return _promise2.default.reject(new Error('could not parse file(s): missing source format'));
  }

  return parser.parse({ options: options, item: item });
};

/**
 * finds the serializer to use for the Apis.
 * @param {Object} args: the named arguments of the method
 * @param {Object} args.options: the settings to use to serialize the Apis
 * @returns {Serializer?} the corresponding serializer
 */
methods.getSerializer = function (_ref16) {
  var _ref16$options = _ref16.options,
      options = _ref16$options === undefined ? {} : _ref16$options;

  var _ref17 = options.target || {},
      format = _ref17.format,
      version = _ref17.version;

  if (!format) {
    return null;
  }

  if (!version) {
    return _serializers2.default.getNewestSerializerByFormat(format);
  }

  return _serializers2.default.getSerializerByFormatAndVersion({ format: format, version: version });
};

/**
 * parses an array of loaded Apis into their expected format
 * @param {Object} args: the named arguments of the method
 * @param {Object} args.options: the settings to use to serialize the items
 * @param {Array<Item>} items: the Apis to serialize
 * @returns {Promise} a promise that resolves with an array of Items if it successfully
 * serializes the items
 */
methods.serialize = function (_ref18) {
  var options = _ref18.options,
      api = _ref18.api;

  var serializer = methods.getSerializer({ options: options });

  if (!serializer) {
    return _promise2.default.reject(new Error('could not convert Api(s): missing target format'));
  }

  var serialized = serializer.serialize({ options: options, api: api });
  return serialized;
};

methods.transform = function (_ref19) {
  var options = _ref19.options,
      uri = _ref19.uri;

  return methods.load({ options: options, uri: uri }).then(methods.parse, methods.handleLoadError).then(methods.serialize, methods.handleParseError).catch(methods.handleSerializeError);
};

var __internals__ = exports.__internals__ = methods;
exports.default = DefaultApiFlow;

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.environment = undefined;

var _apiFlowConfig = __webpack_require__(16);

var environment = exports.environment = _apiFlowConfig.environment;
exports.default = environment;

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__internals__ = undefined;

var _promise = __webpack_require__(51);

var _promise2 = _interopRequireDefault(_promise);

var _assign = __webpack_require__(20);

var _assign2 = _interopRequireDefault(_assign);

var _PawShims = __webpack_require__(42);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cache = {};

var methods = {};

methods.setCache = function ($cache) {
  if ($cache) {
    (0, _assign2.default)(cache, $cache);
  } else {
    cache = {};
  }
};

methods.fsResolve = function (uri) {
  var cleanUri = decodeURIComponent(uri.split('#')[0]);

  if (cache[cleanUri]) {
    return _promise2.default.resolve(cache[cleanUri]);
  }

  if (cache['file://' + cleanUri]) {
    return _promise2.default.resolve(cache['file://' + cleanUri]);
  }

  var msg = 'Sandbox error: include ' + cleanUri + ' in your import by dragging it along with the main file.';

  return _promise2.default.reject(new Error(msg));
};

methods.httpResolve = function (uri) {
  var cleanUri = uri.split('#')[0];

  if (cache[cleanUri]) {
    return _promise2.default.resolve(cache[cleanUri]);
  }

  return new _promise2.default(function (resolve, reject) {
    var request = new _PawShims.NetworkHTTPRequest();
    request.requestUrl = uri;
    request.requestMethod = 'GET';
    request.requestTimeout = 20 * 1000;
    var status = request.send();

    if (status && request.responseStatusCode < 300) {
      resolve(request.responseBody);
    } else {
      var msg = 'Failed to fetch ' + uri + '. Got code: ' + request.responseStatusCode;
      reject(new Error(msg));
    }
  });
};

var PawEnvironment = {
  setCache: methods.setCache,
  cache: cache,
  fsResolver: { resolve: methods.fsResolve },
  httpResolver: { resolve: methods.httpResolve }
};

var __internals__ = exports.__internals__ = methods;
exports.default = PawEnvironment;

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLoaderByFormat = exports.getLoaderByExtension = undefined;

var _apiFlowConfig = __webpack_require__(16);

var methods = {};

methods.extractExtension = function (uri) {
  if (uri) {
    var extension = uri.split('.').slice(-1)[0];
    if (!extension || extension === uri) {
      return null;
    }

    return extension;
  }

  return null;
};

methods.getLoaderByExtension = function (item) {
  var onlyParsableLoaders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var extension = methods.extractExtension(item);

  if (!extension) {
    return null;
  }

  var usableLoaders = _apiFlowConfig.loaders.filter(function (loader) {
    return loader.extensions.indexOf(extension) !== -1;
  });

  if (onlyParsableLoaders) {
    return usableLoaders.filter(function (loader) {
      return loader.parsable === true;
    })[0] || null;
  }

  return usableLoaders[0] || null;
};

methods.getLoaderByFormat = function (format) {
  return _apiFlowConfig.loaders.filter(function (loader) {
    return loader.format === format;
  })[0] || null;
};

methods.filter = function () {
  return _apiFlowConfig.loaders.filter.apply(_apiFlowConfig.loaders, arguments);
};

var getLoaderByExtension = exports.getLoaderByExtension = methods.getLoaderByExtension;
var getLoaderByFormat = exports.getLoaderByFormat = methods.getLoaderByFormat;

exports.default = methods;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PawLoader = undefined;

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

var _class, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var methods = {};

var __meta__ = {
  extensions: [],
  parsable: true,
  format: 'paw'
};

/**
 * @class PawLoader
 * @description a dummy associated with paw.
 * This is a hack around the options passed to the Parser, as Paw directly exposes a context object
 * as well as a list of items to export
 */
var PawLoader = exports.PawLoader = (_temp = _class = function () {
  function PawLoader() {
    (0, _classCallCheck3.default)(this, PawLoader);
  }

  (0, _createClass3.default)(PawLoader, null, [{
    key: 'load',


    /**
     * Resolves a URI and fixes it if necessary.
     * @param {Object} namedParams - an object holding the named parameters used for the resolution of
     * the URI.
     * @param {Object} namedParams.options - an object holding all the settings necessary for
     * resolving, loading, parsing and serializing a uri and its dependencies.
     * @param {string} uri - the URI to resolve to a file that will be used as the primary file for
     * this loader
     * @returns {Promise} a Promise containing the `options` and normalized `item` in an object. See
     * `methods.fixPrimary` for more information.
     * @static
     */
    value: function load(_ref) {
      var options = _ref.options,
          uri = _ref.uri;

      return methods.load({ options: options, uri: uri });
    }

    /**
     * Tests whether the content of a file is parsable by this loader and associated parser. This is
     * used to tell which loader/parser combo should be used.
     * @param {string?} content - the content of the file to test
     * @returns {boolean} whether it is parsable or not
     * @static
     */

  }, {
    key: 'isParsable',
    value: function isParsable(_ref2) {
      var content = _ref2.content;

      return methods.isParsable(content);
    }
  }]);
  return PawLoader;
}(), _class.extensions = __meta__.extensions, _class.parsable = __meta__.parsable, _class.format = __meta__.format, _temp);


methods.isParsable = function () {
  return false;
};
methods.load = function (_ref3) {
  var options = _ref3.options;
  return { options: options };
};

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCodeGenerator = exports.registerImporter = exports.RecordParameter = exports.NetworkHTTPRequest = exports.InputField = exports.DynamicString = exports.DynamicValue = exports.PawRequestMock = exports.PawContextMock = exports.ClassMock = exports.Mock = undefined;

var _assign = __webpack_require__(20);

var _assign2 = _interopRequireDefault(_assign);

var _getIterator2 = __webpack_require__(30);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _getOwnPropertyNames = __webpack_require__(97);

var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * sets up a spy on functions of a object
 * @param {Object} $this: the object to add spies to
 * @param {string} field: the field for which to add a spy
 * @param {string} prefix: the prefix to use for the spy object
 * @returns {Function} a hook function that updates the state of the spy before calling the spied-on
 * function.
 */
var setupFuncSpy = function setupFuncSpy($this, field, prefix) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    $this[prefix + 'spy'][field].count += 1;
    $this[prefix + 'spy'][field].calls.push(args);
    return $this[prefix + 'spy'][field].func.apply($this, args);
  };
};

/**
 * creates a spies object that holds all the relevant information for a field
 * @param {Object} spies: the spies object to update
 * @param {Object} obj: the object to spy on
 * @returns {Object} the updated spies object
 */
var createSpies = function createSpies(spies, obj) {
  for (var field in obj) {
    if (obj.hasOwnProperty(field) && typeof obj[field] === 'function') {
      spies[field] = {
        count: 0,
        calls: [],
        func: obj[field]
      };
    }
  }

  return spies;
};

/**
 * binds spies from an instance to an object methods
 * @param {Object} $this: the instance to which the spies should be bound
 * @param {Object} obj: the object to spy on
 * @param {string} prefix: the prefix to use for the spy methods and fields
 * @returns {void}
 */
var bindSpies = function bindSpies($this, obj, prefix) {
  for (var field in obj) {
    // TODO maybe go up the prototype chain to spoof not-owned properties
    if (obj.hasOwnProperty(field)) {
      if (typeof obj[field] === 'function') {
        $this[field] = setupFuncSpy($this, field, prefix);
      } else {
        $this[field] = obj[field];
      }
    }
  }
};

/**
 * @class Mock
 * @description wraps an arbitrary object and exposes spies on its methods.
 */

var Mock =
/**
 * creates a Mock instance based on an object
 * @constructor
 * @param {Object} obj: the object to spy on
 * @param {string} prefix: the prefix to use for the spy methods and fields.
 */
exports.Mock = function Mock(obj) {
  var _this = this;

  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '$$_';
  (0, _classCallCheck3.default)(this, Mock);

  var spies = createSpies({}, obj);
  this[prefix + 'spy'] = spies;

  bindSpies(this, obj, prefix);

  this[prefix + 'spyOn'] = function (field, func) {
    _this[prefix + 'spy'][field].func = func;
    return _this;
  };

  this[prefix + 'getSpy'] = function (field) {
    return _this[prefix + 'spy'][field];
  };
};

/**
 * @class ClassMock
 * @description wraps a class instance and exposes spies on its methods.
 */


var ClassMock = exports.ClassMock = function (_Mock) {
  (0, _inherits3.default)(ClassMock, _Mock);

  /**
   * creates a ClassMock instance based on a class instance
   * @constructor
   * @param {Object} instance: the class instance to spy on
   * @param {string} prefix: the prefix to use for the spy methods and fields.
   */
  function ClassMock(instance) {
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '$$_';
    (0, _classCallCheck3.default)(this, ClassMock);

    var properties = (0, _getOwnPropertyNames2.default)((0, _getPrototypeOf2.default)(instance));

    var obj = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator3.default)(properties), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var property = _step.value;

        if (property !== 'constructor') {
          obj[property] = _getPrototypeOf2.default.call(Object, instance)[property];
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return (0, _possibleConstructorReturn3.default)(this, (ClassMock.__proto__ || (0, _getPrototypeOf2.default)(ClassMock)).call(this, obj, prefix));
  }

  return ClassMock;
}(Mock);

/**
 * @class PawContextMock
 * @description creates a mock of a Paw Context.
 */


var PawContextMock = exports.PawContextMock = function (_Mock2) {
  (0, _inherits3.default)(PawContextMock, _Mock2);

  /**
   * creates a fake Paw Context
   * @constructor
   * @param {Object} baseObj: a base object to use for the spies
   * @param {string} prefix: the prefix to use for the spy methods and fields
   */
  function PawContextMock(baseObj, prefix) {
    (0, _classCallCheck3.default)(this, PawContextMock);

    var obj = {
      getCurrentRequest: function getCurrentRequest() {},
      getRequestByName: function getRequestByName() {},
      getRequestGroupByName: function getRequestGroupByName() {},
      getRootRequestTreeItems: function getRootRequestTreeItems() {},
      getRootRequests: function getRootRequests() {},
      getAllRequests: function getAllRequests() {},
      getAllGroups: function getAllGroups() {},
      getEnvironmentDomainByName: function getEnvironmentDomainByName() {},
      getEnvironmentVariableByName: function getEnvironmentVariableByName() {},
      getRequestById: function getRequestById() {},
      getRequestGroupById: function getRequestGroupById() {},
      getEnvironmentDomainById: function getEnvironmentDomainById() {},
      getEnvironmentVariableById: function getEnvironmentVariableById() {},
      getEnvironmentById: function getEnvironmentById() {},
      createRequest: function createRequest() {},
      createRequestGroup: function createRequestGroup() {},
      createEnvironmentDomain: function createEnvironmentDomain() {}
    };
    (0, _assign2.default)(obj, baseObj);
    return (0, _possibleConstructorReturn3.default)(this, (PawContextMock.__proto__ || (0, _getPrototypeOf2.default)(PawContextMock)).call(this, obj, prefix));
  }

  return PawContextMock;
}(Mock);

/**
 * @class PawContextMock
 * @description creates a mock of a Paw Request.
 */


var PawRequestMock = exports.PawRequestMock = function (_Mock3) {
  (0, _inherits3.default)(PawRequestMock, _Mock3);

  /**
   * creates a fake Paw Request
   * @constructor
   * @param {Object} baseObj: a base object to use for the spies
   * @param {string} prefix: the prefix to use for the spy methods and fields
   */
  function PawRequestMock(baseObj, prefix) {
    (0, _classCallCheck3.default)(this, PawRequestMock);

    var obj = {
      id: null,
      name: null,
      order: null,
      parent: null,
      url: null,
      method: null,
      headers: null,
      httpBasicAuth: null,
      oauth1: null,
      oauth2: null,
      body: null,
      urlEncodedBody: null,
      multipartBody: null,
      jsonBody: null,
      timeout: null,
      followRedirects: null,
      redirectAuthorization: null,
      redirectMethod: null,
      sendCookies: null,
      storeCookies: null,
      getUrl: function getUrl() {},
      getUrlBase: function getUrlBase() {},
      getUrlParams: function getUrlParams() {},
      getUrlParameters: function getUrlParameters() {},
      getHeaders: function getHeaders() {},
      getHeaderByName: function getHeaderByName() {},
      setHeader: function setHeader() {},
      getHttpBasicAuth: function getHttpBasicAuth() {},
      getOAuth1: function getOAuth1() {},
      getOAuth2: function getOAuth2() {},
      getBody: function getBody() {},
      getUrlEncodedBody: function getUrlEncodedBody() {},
      getMultipartBody: function getMultipartBody() {},
      getLastExchange: function getLastExchange() {}
    };
    (0, _assign2.default)(obj, baseObj);
    return (0, _possibleConstructorReturn3.default)(this, (PawRequestMock.__proto__ || (0, _getPrototypeOf2.default)(PawRequestMock)).call(this, obj, prefix));
  }

  return PawRequestMock;
}(Mock);

/**
 * @class DynamicValue
 * @description creates a mock of a DynamicValue.
 */


var DynamicValue = exports.DynamicValue = function (_Mock4) {
  (0, _inherits3.default)(DynamicValue, _Mock4);

  /**
   * creates a fake DynamicValue
   * @constructor
   * @param {string} type: the type of the DynamicValue
   * @param {Object} baseObj: a base object to use for the spies
   * @param {string} prefix: the prefix to use for the spy methods and fields
   */
  function DynamicValue(type, baseObj) {
    var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '$$_';
    (0, _classCallCheck3.default)(this, DynamicValue);

    var obj = {
      type: type,
      toString: function toString() {},
      getEvaluatedString: function getEvaluatedString() {}
    };
    (0, _assign2.default)(obj, baseObj);
    return (0, _possibleConstructorReturn3.default)(this, (DynamicValue.__proto__ || (0, _getPrototypeOf2.default)(DynamicValue)).call(this, obj, prefix));
  }

  return DynamicValue;
}(Mock);

/**
 * @class DynamicString
 * @description creates a mock of a DynamicString.
 */


var DynamicString = exports.DynamicString = function (_Mock5) {
  (0, _inherits3.default)(DynamicString, _Mock5);

  /**
   * creates a fake DynamicString
   * @constructor
   * @param {Array} items: the items in a DynamicString
   */
  function DynamicString() {
    for (var _len2 = arguments.length, items = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      items[_key2] = arguments[_key2];
    }

    (0, _classCallCheck3.default)(this, DynamicString);

    var obj = {
      length: null,
      components: items,
      toString: function toString() {},
      getComponentAtIndex: function getComponentAtIndex() {},
      getSimpleString: function getSimpleString() {},
      getOnlyString: function getOnlyString() {},
      getOnlyDynamicValue: function getOnlyDynamicValue() {},
      getEvaluatedString: function getEvaluatedString() {},
      copy: function copy() {},
      appendString: function appendString() {},
      appendDynamicValue: function appendDynamicValue() {},
      appendDynamicString: function appendDynamicString() {}
    };
    return (0, _possibleConstructorReturn3.default)(this, (DynamicString.__proto__ || (0, _getPrototypeOf2.default)(DynamicString)).call(this, obj, '$$_'));
  }

  return DynamicString;
}(Mock);

/**
 * @class InputField
 * @description creates a mock of an InputField.
 */


var InputField = exports.InputField = function (_Mock6) {
  (0, _inherits3.default)(InputField, _Mock6);

  /**
   * creates a fake InputField
   * @constructor
   * @param {string} key: the key of an InputField
   * @param {string} name: the name of an InputField
   * @param {string} type: the type of an InputField
   * @param {Object} options: the options of an InputField
   * @param {string} prefix: the prefix to use for the spy methods and fields
   */
  function InputField(key, name, type, options) {
    var prefix = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
    (0, _classCallCheck3.default)(this, InputField);

    var obj = {
      key: key,
      name: name,
      type: type,
      options: options
    };
    return (0, _possibleConstructorReturn3.default)(this, (InputField.__proto__ || (0, _getPrototypeOf2.default)(InputField)).call(this, obj, prefix));
  }

  return InputField;
}(Mock);

/**
 * @class NetworkHTTPRequest
 * @description creates a mock of a NetworkHTTPRequest.
 */


var NetworkHTTPRequest = exports.NetworkHTTPRequest = function (_Mock7) {
  (0, _inherits3.default)(NetworkHTTPRequest, _Mock7);

  /**
   * creates a fake InputField
   * @constructor
   * @param {string} prefix: the prefix to use for the spy methods and fields
   */
  function NetworkHTTPRequest() {
    var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    (0, _classCallCheck3.default)(this, NetworkHTTPRequest);

    var obj = {
      requestUrl: null,
      requestMethod: null,
      requestTimeout: null,
      requestBody: null,
      responseStatusCode: null,
      responseHeaders: null,
      responseBody: null,
      setRequestHeader: function setRequestHeader() {},
      getRequestHeader: function getRequestHeader() {},
      getResponseHeader: function getResponseHeader() {},
      send: function send() {}
    };
    return (0, _possibleConstructorReturn3.default)(this, (NetworkHTTPRequest.__proto__ || (0, _getPrototypeOf2.default)(NetworkHTTPRequest)).call(this, obj, prefix));
  }

  return NetworkHTTPRequest;
}(Mock);

/**
 * @class RecordParameter
 * @description creates a mock of a RecordParameter.
 */


var RecordParameter = exports.RecordParameter = function (_Mock8) {
  (0, _inherits3.default)(RecordParameter, _Mock8);

  /**
   * creates a fake RecordParameter
   * @constructor
   * @param {string} key: the key of an RecordParameter
   * @param {string} value: the value of an RecordParameter
   * @param {boolean?} enabled: whether a RecordParameter is enabled
   * @param {string} prefix: the prefix to use for the spy methods and fields
   */
  function RecordParameter(key, value, enabled) {
    var prefix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    (0, _classCallCheck3.default)(this, RecordParameter);

    var obj = {
      key: key, value: value, enabled: enabled,
      toString: function toString() {}
    };

    return (0, _possibleConstructorReturn3.default)(this, (RecordParameter.__proto__ || (0, _getPrototypeOf2.default)(RecordParameter)).call(this, obj, prefix));
  }

  return RecordParameter;
}(Mock);

/**
 * a simple mock around a class that does nothing
 * @param {Object} _class: the class to wrap with nothing
 * @returns {Object} the same _class, with nothing changed
 */


var registerImporter = exports.registerImporter = function registerImporter(_class) {
  return _class;
};

/**
 * a simple mock around a class that does nothing
 * @param {Object} _class: the class to wrap with nothing
 * @returns {Object} the same _class, with nothing changed
 */
var registerCodeGenerator = exports.registerCodeGenerator = function registerCodeGenerator(_class) {
  return _class;
};

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Api = undefined;

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

var _Info = __webpack_require__(45);

var _Info2 = _interopRequireDefault(_Info);

var _Store = __webpack_require__(48);

var _Store2 = _interopRequireDefault(_Store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the Api Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'api.core.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the Api Record.
 */
var ApiSpec = {
  _model: model,
  resources: new _immutable.OrderedMap(),
  group: null,
  store: new _Store2.default(),
  info: new _Info2.default()
};

/**
 * The Api Record
 */
var Api = exports.Api = (0, _immutable.Record)(ApiSpec);
exports.default = Api;

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XMLSchemaConstraint = exports.JSONSchemaConstraint = exports.EnumConstraint = exports.MinimumPropertiesConstraint = exports.MaximumPropertiesConstraint = exports.UniqueItemsConstraint = exports.MinimumItemsConstraint = exports.MaximumItemsConstraint = exports.PatternConstraint = exports.MinimumLengthConstraint = exports.MaximumLengthConstraint = exports.ExclusiveMinimumConstraint = exports.MinimumConstraint = exports.ExclusiveMaximumConstraint = exports.MaximumConstraint = exports.MultipleOfConstraint = exports.Constraint = undefined;

var _keys = __webpack_require__(21);

var _keys2 = _interopRequireDefault(_keys);

var _stringify = __webpack_require__(29);

var _stringify2 = _interopRequireDefault(_stringify);

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _immutable2 = _interopRequireDefault(_immutable);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the Constraint Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'constraint.constraint.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the BasicAuth Record.
 * - `name` is the name of the Constraint
 * - `value` is the context used by the `expression` field to validate an object
 * - `expression` is used to test whether an object is valid or not
 */
var ConstraintSpec = {
  _model: model,
  name: null,
  value: null,
  expression: function expression() {
    return false;
  }
};

/**
 * The base Constraint class
 */

var Constraint = exports.Constraint = function (_Immutable$Record) {
  (0, _inherits3.default)(Constraint, _Immutable$Record);

  function Constraint() {
    (0, _classCallCheck3.default)(this, Constraint);
    return (0, _possibleConstructorReturn3.default)(this, (Constraint.__proto__ || (0, _getPrototypeOf2.default)(Constraint)).apply(this, arguments));
  }

  (0, _createClass3.default)(Constraint, [{
    key: 'evaluate',

    /**
     * @param {any} d: a value to test against the expression of this Constraint
     * @returns {boolean} true if the value is valid against the expression.
     */
    value: function evaluate(d) {
      return this.get('expression')(d);
    }

    /**
     * @returns {Object} the JSON Schema corresponding to this Constraint
     */

  }, {
    key: 'toJSONSchema',
    value: function toJSONSchema() {
      var obj = {};
      var key = this.get('name');
      var value = this.get('value');
      obj[key] = value;
      return obj;
    }
  }]);
  return Constraint;
}(_immutable2.default.Record(ConstraintSpec));

/**
 * A MultipleOf Constraint.
 * evaluate returns true if and only if the object to test is a multiple of
 * the value passed to the constructor
 */


var MultipleOfConstraint = exports.MultipleOfConstraint = function (_Constraint2) {
  (0, _inherits3.default)(MultipleOfConstraint, _Constraint2);

  /**
   * @constructor
   * @param {number} value: the value to use as a basis for the Constraint
   */
  function MultipleOfConstraint(value) {
    (0, _classCallCheck3.default)(this, MultipleOfConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'multiple-of.constraint.models',
        version: '0.1.0'
      }),
      name: 'multipleOf',
      value: value,
      expression: function expression(d) {
        return d % value === 0;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (MultipleOfConstraint.__proto__ || (0, _getPrototypeOf2.default)(MultipleOfConstraint)).call(this, obj));
  }

  return MultipleOfConstraint;
}(Constraint);

/**
 * A Maximum Constraint.
 * evaluate returns true if and only if the object to test is smaller than
 * the value passed to the constructor
 */


var MaximumConstraint = exports.MaximumConstraint = function (_Constraint3) {
  (0, _inherits3.default)(MaximumConstraint, _Constraint3);

  /**
   * @constructor
   * @param {number} value: the value to use as a basis for the Constraint
   */
  function MaximumConstraint(value) {
    (0, _classCallCheck3.default)(this, MaximumConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'maximum.constraint.models',
        version: '0.1.0'
      }),
      name: 'maximum',
      value: value,
      expression: function expression(d) {
        return d <= value;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (MaximumConstraint.__proto__ || (0, _getPrototypeOf2.default)(MaximumConstraint)).call(this, obj));
  }

  return MaximumConstraint;
}(Constraint);

/**
 * An ExclusiveMaximum Constraint.
 * evaluate returns true if and only if the object to test is strictly smaller
 * the value passed to the constructor
 */


var ExclusiveMaximumConstraint = exports.ExclusiveMaximumConstraint = function (_Constraint4) {
  (0, _inherits3.default)(ExclusiveMaximumConstraint, _Constraint4);

  /**
   * @constructor
   * @param {number} value: the value to use as a basis for the Constraint
   */
  function ExclusiveMaximumConstraint(value) {
    (0, _classCallCheck3.default)(this, ExclusiveMaximumConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'exclusive-maximum.constraint.models',
        version: '0.1.0'
      }),
      name: 'exclusiveMaximum',
      value: value,
      expression: function expression(d) {
        return d < value;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (ExclusiveMaximumConstraint.__proto__ || (0, _getPrototypeOf2.default)(ExclusiveMaximumConstraint)).call(this, obj));
  }

  /**
   * @returns {Object} the JSON Schema corresponding to this Constraint
   */


  (0, _createClass3.default)(ExclusiveMaximumConstraint, [{
    key: 'toJSONSchema',
    value: function toJSONSchema() {
      var obj = {};
      var key = this.get('name');
      var value = this.get('value');
      obj.maximum = value;
      obj[key] = true;
      return obj;
    }
  }]);
  return ExclusiveMaximumConstraint;
}(Constraint);

/**
 * A Minimum Constraint
 * evaluate returns true if and only if the object to test is larger than
 * the value passed to the constructor
 */


var MinimumConstraint = exports.MinimumConstraint = function (_Constraint5) {
  (0, _inherits3.default)(MinimumConstraint, _Constraint5);

  /**
   * @constructor
   * @param {number} value: the value to use as a basis for the Constraint
   */
  function MinimumConstraint(value) {
    (0, _classCallCheck3.default)(this, MinimumConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'minimum.constraint.models',
        version: '0.1.0'
      }),
      name: 'minimum',
      value: value,
      expression: function expression(d) {
        return d >= value;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (MinimumConstraint.__proto__ || (0, _getPrototypeOf2.default)(MinimumConstraint)).call(this, obj));
  }

  return MinimumConstraint;
}(Constraint);

/**
 * An ExclusiveMinimum Constraint.
 * evaluate returns true if and only if the object to test is strictly larger than
 * the value passed to the constructor
 */


var ExclusiveMinimumConstraint = exports.ExclusiveMinimumConstraint = function (_Constraint6) {
  (0, _inherits3.default)(ExclusiveMinimumConstraint, _Constraint6);

  /**
   * @constructor
   * @param {number} value: the value to use as a basis for the Constraint
   */
  function ExclusiveMinimumConstraint(value) {
    (0, _classCallCheck3.default)(this, ExclusiveMinimumConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'exclusive-minimum.constraint.models',
        version: '0.1.0'
      }),
      name: 'exclusiveMinimum',
      value: value,
      expression: function expression(d) {
        return d > value;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (ExclusiveMinimumConstraint.__proto__ || (0, _getPrototypeOf2.default)(ExclusiveMinimumConstraint)).call(this, obj));
  }

  /**
   * @returns {Object} the JSON Schema corresponding to this Constraint
   */


  (0, _createClass3.default)(ExclusiveMinimumConstraint, [{
    key: 'toJSONSchema',
    value: function toJSONSchema() {
      var obj = {};
      var key = this.get('name');
      var value = this.get('value');
      obj.minimum = value;
      obj[key] = true;
      return obj;
    }
  }]);
  return ExclusiveMinimumConstraint;
}(Constraint);

/**
 * A MaximumLength Constraint.
 * evaluate returns true if and only if the object to test has a length smaller than
 * the value passed to the constructor
 */


var MaximumLengthConstraint = exports.MaximumLengthConstraint = function (_Constraint7) {
  (0, _inherits3.default)(MaximumLengthConstraint, _Constraint7);

  /**
   * @constructor
   * @param {number} value: the value to use as a basis for the Constraint
   */
  function MaximumLengthConstraint(value) {
    (0, _classCallCheck3.default)(this, MaximumLengthConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'maximum-length.constraint.models',
        version: '0.1.0'
      }),
      name: 'maxLength',
      value: value,
      expression: function expression(d) {
        return d.length <= value;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (MaximumLengthConstraint.__proto__ || (0, _getPrototypeOf2.default)(MaximumLengthConstraint)).call(this, obj));
  }

  return MaximumLengthConstraint;
}(Constraint);

/**
 * A MinimumLength Constraint.
 * evaluate returns true if and only if the object to test has a length larger than
 * the value passed to the constructor
 */


var MinimumLengthConstraint = exports.MinimumLengthConstraint = function (_Constraint8) {
  (0, _inherits3.default)(MinimumLengthConstraint, _Constraint8);

  /**
   * @constructor
   * @param {number} value: the value to use as a basis for the Constraint
   */
  function MinimumLengthConstraint(value) {
    (0, _classCallCheck3.default)(this, MinimumLengthConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'minimum-length.constraint.models',
        version: '0.1.0'
      }),
      name: 'minLength',
      value: value,
      expression: function expression(d) {
        return d.length >= value;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (MinimumLengthConstraint.__proto__ || (0, _getPrototypeOf2.default)(MinimumLengthConstraint)).call(this, obj));
  }

  return MinimumLengthConstraint;
}(Constraint);

/**
 * A Pattern Constraint.
 * evaluate returns true if and only if the object to test matches
 * the pattern passed to the constructor
 */


var PatternConstraint = exports.PatternConstraint = function (_Constraint9) {
  (0, _inherits3.default)(PatternConstraint, _Constraint9);

  /**
   * @constructor
   * @param {string} value: the value to use as a basis for the Constraint
   */
  function PatternConstraint(value) {
    (0, _classCallCheck3.default)(this, PatternConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'pattern.constraint.models',
        version: '0.1.0'
      }),
      name: 'pattern',
      value: value,
      expression: function expression(d) {
        return d.match(value) !== null;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (PatternConstraint.__proto__ || (0, _getPrototypeOf2.default)(PatternConstraint)).call(this, obj));
  }

  return PatternConstraint;
}(Constraint);

/**
 * A MaximumItems Constraint.
 * evaluate returns true if and only if the object to test has less items than
 * the value passed to the constructor
 */


var MaximumItemsConstraint = exports.MaximumItemsConstraint = function (_Constraint10) {
  (0, _inherits3.default)(MaximumItemsConstraint, _Constraint10);

  /**
   * @constructor
   * @param {number} value: the value to use as a basis for the Constraint
   */
  function MaximumItemsConstraint(value) {
    (0, _classCallCheck3.default)(this, MaximumItemsConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'maximum-items.constraint.models',
        version: '0.1.0'
      }),
      name: 'maxItems',
      value: value,
      expression: function expression(d) {
        if (typeof value === 'undefined' || value === null) {
          return true;
        }
        return (d.length || d.size) <= value;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (MaximumItemsConstraint.__proto__ || (0, _getPrototypeOf2.default)(MaximumItemsConstraint)).call(this, obj));
  }

  return MaximumItemsConstraint;
}(Constraint);

/**
 * A MinimumItems Constraint.
 * evaluate returns true if and only if the object to test has more items than
 * the value passed to the constructor
 */


var MinimumItemsConstraint = exports.MinimumItemsConstraint = function (_Constraint11) {
  (0, _inherits3.default)(MinimumItemsConstraint, _Constraint11);

  /**
   * @constructor
   * @param {number} value: the value to use as a basis for the Constraint
   */
  function MinimumItemsConstraint() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    (0, _classCallCheck3.default)(this, MinimumItemsConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'minimum-items.constraint.models',
        version: '0.1.0'
      }),
      name: 'minItems',
      value: value,
      expression: function expression(d) {
        return (d.length || d.size) >= value;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (MinimumItemsConstraint.__proto__ || (0, _getPrototypeOf2.default)(MinimumItemsConstraint)).call(this, obj));
  }

  return MinimumItemsConstraint;
}(Constraint);

/**
 * A UniqueItems Constraint.
 * evaluate returns true if and only if the object to test contains only
 * unique values
 */


var UniqueItemsConstraint = exports.UniqueItemsConstraint = function (_Constraint12) {
  (0, _inherits3.default)(UniqueItemsConstraint, _Constraint12);

  /**
   * @constructor
   * @param {boolean} value: the value to use as a basis for the Constraint
   */
  function UniqueItemsConstraint() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    (0, _classCallCheck3.default)(this, UniqueItemsConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'unique-items.constraint.models',
        version: '0.1.0'
      }),
      name: 'uniqueItems',
      value: value,
      expression: function expression(d) {
        if (!value) {
          return true;
        }
        var valueSet = d.reduce(function (_obj, item) {
          var itemKey = (0, _stringify2.default)(item);
          _obj[itemKey] = true;
          return _obj;
        }, {});
        return (d.length || d.size) === (0, _keys2.default)(valueSet).length;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (UniqueItemsConstraint.__proto__ || (0, _getPrototypeOf2.default)(UniqueItemsConstraint)).call(this, obj));
  }

  return UniqueItemsConstraint;
}(Constraint);

/**
 * A MaximumProperties Constraint.
 * evaluate returns true if and only if the object to test has less properties than
 * the value passed to the constructor
 */


var MaximumPropertiesConstraint = exports.MaximumPropertiesConstraint = function (_Constraint13) {
  (0, _inherits3.default)(MaximumPropertiesConstraint, _Constraint13);

  /**
   * @constructor
   * @param {number} value: the value to use as a basis for the Constraint
   */
  function MaximumPropertiesConstraint(value) {
    (0, _classCallCheck3.default)(this, MaximumPropertiesConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'maximum-properties.constraint.models',
        version: '0.1.0'
      }),
      name: 'maxProperties',
      value: value,
      expression: function expression(d) {
        if (typeof value === 'undefined' || value === null) {
          return true;
        }
        return (0, _keys2.default)(d).length <= value;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (MaximumPropertiesConstraint.__proto__ || (0, _getPrototypeOf2.default)(MaximumPropertiesConstraint)).call(this, obj));
  }

  return MaximumPropertiesConstraint;
}(Constraint);

/**
 * A MinimumProperties Constraint.
 * evaluate returns true if and only if the object to test has more properties than
 * the value passed to the constructor
 */


var MinimumPropertiesConstraint = exports.MinimumPropertiesConstraint = function (_Constraint14) {
  (0, _inherits3.default)(MinimumPropertiesConstraint, _Constraint14);

  /**
   * @constructor
   * @param {number} value: the value to use as a basis for the Constraint
   */
  function MinimumPropertiesConstraint() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    (0, _classCallCheck3.default)(this, MinimumPropertiesConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'minimum-properties.constraint.models',
        version: '0.1.0'
      }),
      name: 'minProperties',
      value: value,
      expression: function expression(d) {
        return (0, _keys2.default)(d).length >= value;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (MinimumPropertiesConstraint.__proto__ || (0, _getPrototypeOf2.default)(MinimumPropertiesConstraint)).call(this, obj));
  }

  return MinimumPropertiesConstraint;
}(Constraint);

/**
 * An Enum Constraint.
 * evaluate returns true if and only if the object to test is in
 * the list of values passed to the constructor
 */


var EnumConstraint = exports.EnumConstraint = function (_Constraint15) {
  (0, _inherits3.default)(EnumConstraint, _Constraint15);

  /**
   * @constructor
   * @param {Array} value: the value to use as a basis for the Constraint
   */
  function EnumConstraint() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    (0, _classCallCheck3.default)(this, EnumConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'enum.constraint.models',
        version: '0.1.0'
      }),
      name: 'enum',
      value: value,
      expression: function expression(d) {
        return value.indexOf(d) >= 0;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (EnumConstraint.__proto__ || (0, _getPrototypeOf2.default)(EnumConstraint)).call(this, obj));
  }

  return EnumConstraint;
}(Constraint);

/**
 * A JSON Schema Constraint.
 * evaluate returns true. (Unimplemented)
 * TODO: implement evaluate
 */


var JSONSchemaConstraint = exports.JSONSchemaConstraint = function (_Constraint16) {
  (0, _inherits3.default)(JSONSchemaConstraint, _Constraint16);

  /**
   * @constructor
   * @param {Object} value: the value to use as a basis for the Constraint
   */
  function JSONSchemaConstraint() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, JSONSchemaConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'json.constraint.models',
        version: '0.1.0'
      }),
      name: 'json',
      value: value,
      expression: function expression() {
        return true;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (JSONSchemaConstraint.__proto__ || (0, _getPrototypeOf2.default)(JSONSchemaConstraint)).call(this, obj));
  }

  /**
   * @returns {Object} the JSON Schema corresponding to this Constraint
   */


  (0, _createClass3.default)(JSONSchemaConstraint, [{
    key: 'toJSONSchema',
    value: function toJSONSchema() {
      return this.get('value');
    }
  }]);
  return JSONSchemaConstraint;
}(Constraint);

/**
 * An XML Schema Constraint.
 * evaluate returns true. (Unimplemented)
 * TODO: implement evaluate
 */


var XMLSchemaConstraint = exports.XMLSchemaConstraint = function (_Constraint17) {
  (0, _inherits3.default)(XMLSchemaConstraint, _Constraint17);

  /**
   * @constructor
   * @param {string} value: the value to use as a basis for the Constraint
   */
  function XMLSchemaConstraint() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    (0, _classCallCheck3.default)(this, XMLSchemaConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'xml.constraint.models',
        version: '0.1.0'
      }),
      name: 'xml',
      value: value,
      expression: function expression() {
        return true;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (XMLSchemaConstraint.__proto__ || (0, _getPrototypeOf2.default)(XMLSchemaConstraint)).call(this, obj));
  }

  /**
   * @returns {Object} the JSON Schema corresponding to this Constraint
   */


  (0, _createClass3.default)(XMLSchemaConstraint, [{
    key: 'toJSONSchema',
    value: function toJSONSchema() {
      return {
        'x-xml': this.get('value')
      };
    }
  }]);
  return XMLSchemaConstraint;
}(Constraint);

var _Constraint = {
  Constraint: Constraint,
  MultipleOf: MultipleOfConstraint,
  Maximum: MaximumConstraint,
  ExclusiveMaximum: ExclusiveMaximumConstraint,
  Minimum: MinimumConstraint,
  ExclusiveMinimum: ExclusiveMinimumConstraint,
  MaximumLength: MaximumLengthConstraint,
  MinimumLength: MinimumLengthConstraint,
  Pattern: PatternConstraint,
  MaximumItems: MaximumItemsConstraint,
  MinimumItems: MinimumItemsConstraint,
  UniqueItems: UniqueItemsConstraint,
  MaximumProperties: MaximumPropertiesConstraint,
  MinimumProperties: MinimumPropertiesConstraint,
  Enum: EnumConstraint,
  JSONSchema: JSONSchemaConstraint,
  XMLSchema: XMLSchemaConstraint
};

exports.default = _Constraint;

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Contact = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the Contact Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'contact.utils.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the Contact Record.
 */
var ContactSpec = {
  _model: model,
  name: null,
  url: null,
  email: null
};

/**
 * The Contact Record
 */

var Contact = exports.Contact = function (_Record) {
  (0, _inherits3.default)(Contact, _Record);

  function Contact() {
    (0, _classCallCheck3.default)(this, Contact);
    return (0, _possibleConstructorReturn3.default)(this, (Contact.__proto__ || (0, _getPrototypeOf2.default)(Contact)).apply(this, arguments));
  }

  return Contact;
}((0, _immutable.Record)(ContactSpec));

exports.default = Contact;

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Request = undefined;

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

var _ParameterContainer = __webpack_require__(47);

var _ParameterContainer2 = _interopRequireDefault(_ParameterContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the Request Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'request.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the Request Record.
 */
var RequestSpec = {
  _model: model,
  id: null,
  endpoints: (0, _immutable.Map)(),
  name: null,
  description: null,
  method: null,
  parameters: new _ParameterContainer2.default(),
  contexts: (0, _immutable.List)(),
  auths: (0, _immutable.List)(),
  responses: (0, _immutable.Map)(),
  timeout: null,
  tags: (0, _immutable.List)(),
  interfaces: (0, _immutable.Map)()
};

var Request = exports.Request = (0, _immutable.Record)(RequestSpec);

exports.default = Request;

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Resource = undefined;

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the Resource Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'resource.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the Resource Record.
 */
var ResourceSpec = {
  _model: model,
  name: null,
  uuid: null,
  endpoints: (0, _immutable.OrderedMap)(),
  path: null,
  methods: (0, _immutable.Map)(),
  description: null,
  interfaces: (0, _immutable.Map)()
};

/**
 * The Resource Record
 */
var Resource = exports.Resource = (0, _immutable.Record)(ResourceSpec);

exports.default = Resource;

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__internals__ = exports.URL = undefined;

var _slicedToArray2 = __webpack_require__(52);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getIterator2 = __webpack_require__(30);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _keys = __webpack_require__(21);

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = __webpack_require__(13);

var _typeof3 = _interopRequireDefault(_typeof2);

var _extends2 = __webpack_require__(101);

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _url = __webpack_require__(66);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

var _URLComponent = __webpack_require__(49);

var _URLComponent2 = _interopRequireDefault(_URLComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the URL Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'url.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the URL Record.
 * Most fields are direct matches for parse(url), except for protocol, hostname, pathname, and
 * secure.
 * - `protocol` expects a List of protocols applicable to the url
 * - `hostname` and `pathname` are URLComponents, as they are the two core fields of the urlObject.
 * - `secure` is a boolean to tell whether the url supports a secure protocol. This is a helper to
 * make generation more uniform and favor secure protocols over unsecure ones.
 * Other fields may evolve into URLComponents in future versions, when the need for higher
 * descriptivity arises.
 */
var URLSpec = {
  _model: model,
  uuid: null,
  protocol: (0, _immutable.List)(),
  slashes: true,
  auth: null,
  host: null,
  port: null,
  hostname: null,
  href: null,
  path: null,
  pathname: null,
  query: null,
  search: null,
  hash: null,
  secure: false,
  variableDelimiters: (0, _immutable.List)(),
  description: null
};

/**
 * Holds all the internal methods used in tandem with a URL
 */
var methods = {};

/**
 * The URL Record
 */

var URL = exports.URL = function (_Record) {
  (0, _inherits3.default)(URL, _Record);

  /**
   * @constructor
   * @param {Object} props: the properties of this URL Record
   * @param {string|Object} props.url: a representation of the url this Record needs to reflect.
   * The string representation of the url is preferred.
   * @param {List<string>} props.variableDelimiters: a List of delimiters for variables present in
   * the url.
   * @param {string?} props.description: an optional description of the purpose of this URL.
   * @param {string?} props.uuid: an optional uuid field
   * @param {boolean?} props.secure: an optional field to tell whether a URL is secure or not.
   */
  function URL(props) {
    var _ret2;

    (0, _classCallCheck3.default)(this, URL);

    if (!props) {
      var _ret;

      var _this = (0, _possibleConstructorReturn3.default)(this, (URL.__proto__ || (0, _getPrototypeOf2.default)(URL)).call(this));

      return _ret = _this, (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    var url = props.url,
        uuid = props.uuid,
        secure = props.secure,
        variableDelimiters = props.variableDelimiters,
        description = props.description;

    var urlComponents = methods.getURLComponents(url, variableDelimiters);

    var _this = (0, _possibleConstructorReturn3.default)(this, (URL.__proto__ || (0, _getPrototypeOf2.default)(URL)).call(this, (0, _extends3.default)({}, urlComponents, { secure: secure, uuid: uuid, variableDelimiters: variableDelimiters, description: description })));

    return _ret2 = _this, (0, _possibleConstructorReturn3.default)(_this, _ret2);
  }

  /**
   * generates an href from a URL
   * @param {List<string>} delimiters: the variable delimiters (needed to format variables in the
   * fields)
   * @param {boolean} useDefault: whether to use the default values or not
   * @returns {string} the url.href
   */


  (0, _createClass3.default)(URL, [{
    key: 'generate',
    value: function generate() {
      var delimiters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _immutable.List)();
      var useDefault = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      return methods.generate(this, delimiters, useDefault);
    }

    /**
     * generates a URL from a URL and a url string
     * @param {string} url: the url to reach
     * @param {List<string>} delimiters: the variable delimiters (needed to format variables in the
     * fields)
     * @param {boolean} useDefault: whether to use the default values or not
     * @returns {URL} the resolved URL
     *
     * IMPORTANT: the from string must be using the same delimiters format as the one provided with
     * `delimiters`, otherwise the final result might have inconsistencies.
     */

  }, {
    key: 'resolve',
    value: function resolve(url) {
      var delimiters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _immutable.List)();
      var useDefault = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return methods.resolve(this, url, delimiters, useDefault);
    }

    /**
     * converts a URL Record into a urlObject
     * @param {List<string>} delimiters: the variable delimiters (needed to format variables in the
     * fields)
     * @param {boolean} useDefault: whether to use the default values or not
     * @returns {Object} the corresponding urlObject
     */

  }, {
    key: 'toURLObject',
    value: function toURLObject(delimiters, useDefault) {
      return methods.convertURLComponentsToURLObject(this, delimiters, useDefault);
    }
  }]);
  return URL;
}((0, _immutable.Record)(URLSpec));

methods.getURLComponents = function (url, variableDelimiters) {
  if (typeof url === 'string') {
    var urlObject = (0, _url.parse)(url);
    return methods.convertURLObjectToURLComponents(urlObject, variableDelimiters);
  }

  if (url && (typeof url === 'undefined' ? 'undefined' : (0, _typeof3.default)(url)) === 'object' && !(url.host instanceof _URLComponent2.default)) {
    return methods.convertURLObjectToURLComponents(url, variableDelimiters);
  }

  return url;
};

/**
 * converts all urlObject fields into their corresponding type used in the URL Record
 * @param {Object} _urlObject: the urlObject to convert
 * @param {List<string>} variableDelimiters: the variable delimiters (needed to detect variables in
 * the fields)
 * @returns {Object} an object containing the matching URL Record fields
 */
methods.convertURLObjectToURLComponents = function (_urlObject) {
  var variableDelimiters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _immutable.List)();

  var urlObject = methods.fixUrlObject(_urlObject);

  var components = {
    protocol: (0, _immutable.List)([urlObject.protocol]),
    slashes: urlObject.slashes,
    auth: urlObject.auth,
    host: urlObject.host,
    hostname: urlObject.hostname ? new _URLComponent2.default({
      componentName: 'hostname',
      string: urlObject.hostname,
      variableDelimiters: variableDelimiters
    }) : null,
    port: urlObject.port ? new _URLComponent2.default({
      componentName: 'port',
      string: urlObject.port,
      variableDelimiters: variableDelimiters
    }) : null,
    path: urlObject.path,
    pathname: urlObject.pathname ? new _URLComponent2.default({
      componentName: 'pathname',
      string: urlObject.pathname,
      variableDelimiters: variableDelimiters
    }) : null,
    search: urlObject.search,
    query: urlObject.query,
    hash: urlObject.hash,
    href: urlObject.href,
    secure: urlObject.secure || false
  };

  return components;
};

methods.formatHostFromHostnameAndPort = function (hostname, port) {
  if (hostname && port) {
    return hostname + ':' + port;
  }

  if (hostname) {
    return hostname;
  }

  return null;
};

/**
 * converts a URL Record into a urlObject
 * @param {URL} url: the URL Record to convert
 * @param {List<string>} delimiters: the variable delimiters (needed to format variables in the
 * fields)
 * @param {boolean} useDefault: whether to use the default values or not
 * @returns {Object} the corresponding urlObject
 */
methods.convertURLComponentsToURLObject = function (url) {
  var delimiters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _immutable.List)();
  var useDefault = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var protocol = url.get('secure') ? url.get('protocol').filter(function (proto) {
    return proto.match(/[^w]s:?$/);
  }).get(0) : url.getIn(['protocol', 0]);

  var slashes = url.get('slashes');
  var hostname = url.get('hostname') ? url.get('hostname').generate(delimiters, useDefault) : null;
  var port = url.get('port') ? url.get('port').generate(delimiters, useDefault) : null;
  var host = methods.formatHostFromHostnameAndPort(hostname, port);
  var pathname = url.get('pathname') ? url.get('pathname').generate(delimiters, useDefault) : null;

  var urlObject = {
    protocol: protocol, slashes: slashes, hostname: hostname, port: port, host: host, pathname: pathname
  };

  return urlObject;
};

/**
 * generates an href from a URL
 * @param {URL} url: the URL Record to generate the href from
 * @param {List<string>} delimiters: the variable delimiters (needed to format variables in the
 * fields)
 * @param {boolean} useDefault: whether to use the default values or not
 * @returns {string} the url.href
 */
methods.generate = function (url) {
  var delimiters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _immutable.List)();
  var useDefault = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var urlObject = methods.convertURLComponentsToURLObject(url, delimiters, useDefault);
  return (0, _url.format)(urlObject);
};

/**
 * generates a URL from a URL and a url string
 * @param {URL} from: the URL Record to that serves as a base reference
 * @param {string} to: the url to reach
 * @param {List<string>} delimiters: the variable delimiters (needed to format variables in the
 * fields)
 * @param {boolean} useDefault: whether to use the default values or not
 * @returns {URL} the resolved URL
 *
 * IMPORTANT: the from string must be using the same delimiters format as the one provided with
 * `delimiters`, otherwise the final result might have inconsistencies.
 */
methods.resolve = function (from, to, delimiters) {
  var useDefault = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  var fromString = methods.generate(from, delimiters, useDefault);
  var resolved = (0, _url.resolve)(fromString, to);

  // massive hack
  // FIXME
  resolved = resolved.replace('///', '//');

  return new URL({
    url: resolved,
    variableDelimiters: delimiters
  });
};

/**
 * urldecodes every field of a UrlObject
 * @param {UrlObject} urlObject: the urlObject to decode
 * @returns {UrlObject} the decoded urlObject
 */
methods.decodeUrlObject = function (urlObject) {
  var keys = (0, _keys2.default)(urlObject);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(keys), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      if (typeof urlObject[key] === 'string') {
        urlObject[key] = decodeURIComponent(urlObject[key]);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return urlObject;
};

/**
 * separates the host string into hostname and port
 * @param {string} host: the host string
 * @returns {Object} the hostname and port if they exist
 */
methods.splitHostInHostnameAndPort = function (host) {
  if (!host) {
    return { hostname: null, port: null };
  }

  var _host$split = host.split(':'),
      _host$split2 = (0, _slicedToArray3.default)(_host$split, 2),
      hostname = _host$split2[0],
      port = _host$split2[1];

  return { hostname: hostname || null, port: port || null };
};

/**
 * extracts the host from a pathname. Used when URL.parse failed to parse
 * the URL correctly (often due to the presence of brackets in the hostname)
 * @param {string} _pathname: the pathname to decompose
 * @returns {Object} the host and pathname, if they exist
 */
methods.splitPathnameInHostAndPathname = function (_pathname) {
  if (!_pathname) {
    return { host: null, pathname: null };
  }

  var m = _pathname.match(/([^/]*)(\/.*)/);

  if (m) {
    var host = m[1] || null;
    var pathname = m[2];
    return { host: host, pathname: pathname };
  }

  return { host: _pathname, pathname: null };
};

/**
 * creates a path from a pathname and a search field
 * @param {string} pathname: the pathname field of a UrlObject
 * @param {string} search: the search field of a UrlObject
 * @returns {string} the url.path
 */
methods.createPathFromPathNameAndSearch = function (pathname, search) {
  return (pathname || '') + (search || '') || null;
};

/**
 * generates an href from a base URL, a host and a path. This is used to update
 * the href field of a UrlObject, when the URL.parse failed.
 * @param {URL} base: the base URL Record to generate the href from
 * @param {?string} host: the host to use in place of the base URL's host
 * @param {?string} pathname: the pathname to use in place of the base URL's pathname
 * @returns {string} the url.href
 */
methods.createHrefFromBaseAndHostAndPathName = function (base, host, pathname) {
  return (0, _url.format)({
    protocol: base.protocol || null,
    slashes: base.slashes,
    auth: base.auth || null,
    host: host || null,
    pathname: pathname || '/',
    search: base.search || null,
    hash: base.hash || null
  });
};

/**
 * tries to fix a UrlObject that has no host by searching the pathname for a host
 * and updating the related fields
 * @param {UrlObject} urlObject: the UrlObject to fix
 * @returns {UrlObject} the fixed urlObject
 */
methods.fixUrlObject = function (urlObject) {
  var decoded = methods.decodeUrlObject(urlObject);
  if (decoded.host || !decoded.pathname) {
    return decoded;
  }

  var _methods$splitPathnam = methods.splitPathnameInHostAndPathname(decoded.pathname),
      host = _methods$splitPathnam.host,
      pathname = _methods$splitPathnam.pathname;

  var _methods$splitHostInH = methods.splitHostInHostnameAndPort(host),
      hostname = _methods$splitHostInH.hostname,
      port = _methods$splitHostInH.port;

  var path = methods.createPathFromPathNameAndSearch(pathname, decoded.search);
  var href = methods.createHrefFromBaseAndHostAndPathName(decoded, host, pathname);

  return (0, _extends3.default)({}, urlObject, { host: host, pathname: pathname, hostname: hostname, port: port, path: path, href: href });
};

var __internals__ = exports.__internals__ = methods;
exports.default = URL;

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Variable = undefined;

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the Variable Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'variable.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the Variable Record.
 */
var VariableSpec = {
  _model: model,
  name: null,
  values: (0, _immutable.Map)(),
  defaultEnvironment: null
};

/**
 * The Variable Record
 */
var Variable = exports.Variable = (0, _immutable.Record)(VariableSpec);

exports.default = Variable;

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AWSSig4Auth = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the AWSSig4Auth Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'aws-sig-4.auth.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the AWSSig4Auth Record.
 */
var AWSSig4AuthSpec = {
  _model: model,
  description: null,
  authName: null,
  key: null,
  secret: null,
  region: null,
  service: null
};

/**
 * The AWSSig4Auth Record
 */

var AWSSig4Auth = exports.AWSSig4Auth = function (_Record) {
  (0, _inherits3.default)(AWSSig4Auth, _Record);

  function AWSSig4Auth() {
    (0, _classCallCheck3.default)(this, AWSSig4Auth);
    return (0, _possibleConstructorReturn3.default)(this, (AWSSig4Auth.__proto__ || (0, _getPrototypeOf2.default)(AWSSig4Auth)).apply(this, arguments));
  }

  return AWSSig4Auth;
}((0, _immutable.Record)(AWSSig4AuthSpec));

exports.default = AWSSig4Auth;

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ApiKeyAuth = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the ApiKeyAuth Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'api-key.auth.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the ApiKeyAuth Record.
 */
var ApiKeyAuthSpec = {
  _model: model,
  description: null,
  authName: null,
  name: null,
  in: null,
  key: null
};

/**
 * The ApiKeyAuth Record
 */

var ApiKeyAuth = exports.ApiKeyAuth = function (_Record) {
  (0, _inherits3.default)(ApiKeyAuth, _Record);

  function ApiKeyAuth() {
    (0, _classCallCheck3.default)(this, ApiKeyAuth);
    return (0, _possibleConstructorReturn3.default)(this, (ApiKeyAuth.__proto__ || (0, _getPrototypeOf2.default)(ApiKeyAuth)).apply(this, arguments));
  }

  return ApiKeyAuth;
}((0, _immutable.Record)(ApiKeyAuthSpec));

exports.default = ApiKeyAuth;

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BasicAuth = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the BasicAuth Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'basic.auth.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the BasicAuth Record.
 */
var BasicAuthSpec = {
  _model: model,
  description: null,
  authName: null,
  username: null,
  password: null,
  raw: null,
  interfaces: (0, _immutable.OrderedMap)()
};

/**
 * The BasicAuth Record
 */

var BasicAuth = exports.BasicAuth = function (_Record) {
  (0, _inherits3.default)(BasicAuth, _Record);

  function BasicAuth() {
    (0, _classCallCheck3.default)(this, BasicAuth);
    return (0, _possibleConstructorReturn3.default)(this, (BasicAuth.__proto__ || (0, _getPrototypeOf2.default)(BasicAuth)).apply(this, arguments));
  }

  return BasicAuth;
}((0, _immutable.Record)(BasicAuthSpec));

exports.default = BasicAuth;

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomAuth = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the BasicAuth Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'custom.auth.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the BasicAuth Record.
 */
var CustomAuthSpec = {
  _model: model,
  description: null,
  authName: null,
  setup: null,
  interfaces: (0, _immutable.OrderedMap)()
};

/**
 * The BasicAuth Record
 */

var CustomAuth = exports.CustomAuth = function (_Record) {
  (0, _inherits3.default)(CustomAuth, _Record);

  function CustomAuth() {
    (0, _classCallCheck3.default)(this, CustomAuth);
    return (0, _possibleConstructorReturn3.default)(this, (CustomAuth.__proto__ || (0, _getPrototypeOf2.default)(CustomAuth)).apply(this, arguments));
  }

  return CustomAuth;
}((0, _immutable.Record)(CustomAuthSpec));

exports.default = CustomAuth;

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DigestAuth = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the DigestAuth Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'digest.auth.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the DigestAuth Record.
 */
var DigestAuthSpec = {
  _model: model,
  description: null,
  authName: null,
  username: null,
  password: null
};

/**
 * The DigestAuth Record
 */

var DigestAuth = exports.DigestAuth = function (_Record) {
  (0, _inherits3.default)(DigestAuth, _Record);

  function DigestAuth() {
    (0, _classCallCheck3.default)(this, DigestAuth);
    return (0, _possibleConstructorReturn3.default)(this, (DigestAuth.__proto__ || (0, _getPrototypeOf2.default)(DigestAuth)).apply(this, arguments));
  }

  return DigestAuth;
}((0, _immutable.Record)(DigestAuthSpec));

exports.default = DigestAuth;

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HawkAuth = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the HawkAuth Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'hawk.auth.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the HawkAuth Record.
 */
var HawkAuthSpec = {
  _model: model,
  description: null,
  authName: null,
  id: null,
  key: null,
  algorithm: null
};

/**
 * The HawkAuth Record
 */

var HawkAuth = exports.HawkAuth = function (_Record) {
  (0, _inherits3.default)(HawkAuth, _Record);

  function HawkAuth() {
    (0, _classCallCheck3.default)(this, HawkAuth);
    return (0, _possibleConstructorReturn3.default)(this, (HawkAuth.__proto__ || (0, _getPrototypeOf2.default)(HawkAuth)).apply(this, arguments));
  }

  return HawkAuth;
}((0, _immutable.Record)(HawkAuthSpec));

exports.default = HawkAuth;

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NTLMAuth = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the NTLMAuth Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'ntlm.auth.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the NTLMAuth Record.
 */
var NTLMAuthSpec = {
  _model: model,
  description: null,
  authName: null,
  username: null,
  password: null
};

/**
 * The NTLMAuth Record
 */

var NTLMAuth = exports.NTLMAuth = function (_Record) {
  (0, _inherits3.default)(NTLMAuth, _Record);

  function NTLMAuth() {
    (0, _classCallCheck3.default)(this, NTLMAuth);
    return (0, _possibleConstructorReturn3.default)(this, (NTLMAuth.__proto__ || (0, _getPrototypeOf2.default)(NTLMAuth)).apply(this, arguments));
  }

  return NTLMAuth;
}((0, _immutable.Record)(NTLMAuthSpec));

exports.default = NTLMAuth;

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NegotiateAuth = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the NegotiateAuth Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'negotiate.auth.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the NegotiateAuth Record.
 */
var NegotiateAuthSpec = {
  _model: model,
  description: null,
  authName: null,
  username: null,
  password: null
};

/**
 * The NegotiateAuth Record
 */

var NegotiateAuth = exports.NegotiateAuth = function (_Record) {
  (0, _inherits3.default)(NegotiateAuth, _Record);

  function NegotiateAuth() {
    (0, _classCallCheck3.default)(this, NegotiateAuth);
    return (0, _possibleConstructorReturn3.default)(this, (NegotiateAuth.__proto__ || (0, _getPrototypeOf2.default)(NegotiateAuth)).apply(this, arguments));
  }

  return NegotiateAuth;
}((0, _immutable.Record)(NegotiateAuthSpec));

exports.default = NegotiateAuth;

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OAuth1Auth = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the OAuth1Auth Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'oauth-1.auth.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the OAuth1Auth Record.
 */
var OAuth1AuthSpec = {
  _model: model,
  description: null,
  authName: null,
  callback: null,
  consumerSecret: null,
  tokenSecret: null,
  consumerKey: null,
  algorithm: null,
  nonce: null,
  additionalParameters: null,
  timestamp: null,
  token: null,
  version: null,
  signature: null,
  tokenCredentialsUri: null,
  requestTokenUri: null,
  authorizationUri: null
};

/**
 * The OAuth1Auth Record
 */

var OAuth1Auth = exports.OAuth1Auth = function (_Record) {
  (0, _inherits3.default)(OAuth1Auth, _Record);

  function OAuth1Auth() {
    (0, _classCallCheck3.default)(this, OAuth1Auth);
    return (0, _possibleConstructorReturn3.default)(this, (OAuth1Auth.__proto__ || (0, _getPrototypeOf2.default)(OAuth1Auth)).apply(this, arguments));
  }

  return OAuth1Auth;
}((0, _immutable.Record)(OAuth1AuthSpec));

exports.default = OAuth1Auth;

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OAuth2Auth = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the OAuth2Auth Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'oauth-2.auth.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the OAuth2Auth Record.
 * flowMap: {
 *    'accessCode': 'authorization_code',
 *    'implicit': 'implicit',
 *    'application': 'client_credentials',
 *    'password': 'password' or 'resource_owner'
 * }
 *
 *
 */
var OAuth2AuthSpec = {
  _model: model,
  description: null,
  authName: null,
  flow: null,
  authorizationUrl: null,
  tokenUrl: null,
  scopes: (0, _immutable.List)()
};

/**
 * The OAuth2Auth Record
 */

var OAuth2Auth = exports.OAuth2Auth = function (_Record) {
  (0, _inherits3.default)(OAuth2Auth, _Record);

  function OAuth2Auth() {
    (0, _classCallCheck3.default)(this, OAuth2Auth);
    return (0, _possibleConstructorReturn3.default)(this, (OAuth2Auth.__proto__ || (0, _getPrototypeOf2.default)(OAuth2Auth)).apply(this, arguments));
  }

  return OAuth2Auth;
}((0, _immutable.Record)(OAuth2AuthSpec));

exports.default = OAuth2Auth;

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getParsers = exports.getParserByFormatAndVersion = exports.getParsersByFormat = undefined;

var _apiFlowConfig = __webpack_require__(16);

var methods = {};

methods.getParsersByFormat = function (format) {
  return _apiFlowConfig.parsers.filter(function (parser) {
    return parser.format === format;
  });
};

methods.getParserByFormatAndVersion = function (_ref) {
  var format = _ref.format,
      version = _ref.version;

  var match = _apiFlowConfig.parsers.filter(function (parser) {
    return parser.__meta__.format === format && parser.__meta__.version === version;
  })[0] || null;
  return match;
};

methods.getParsers = function () {
  return _apiFlowConfig.parsers;
};

var getParsersByFormat = exports.getParsersByFormat = methods.getParsersByFormat;
var getParserByFormatAndVersion = exports.getParserByFormatAndVersion = methods.getParserByFormatAndVersion;
var getParsers = exports.getParsers = methods.getParsers;

exports.default = methods;

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__internals__ = exports.PawParser = undefined;

var _defineProperty2 = __webpack_require__(100);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _typeof2 = __webpack_require__(13);

var _typeof3 = _interopRequireDefault(_typeof2);

var _toConsumableArray2 = __webpack_require__(53);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

var _class, _temp;

var _url = __webpack_require__(66);

var _immutable = __webpack_require__(0);

var _Api = __webpack_require__(73);

var _Api2 = _interopRequireDefault(_Api);

var _Info = __webpack_require__(45);

var _Info2 = _interopRequireDefault(_Info);

var _Contact = __webpack_require__(75);

var _Contact2 = _interopRequireDefault(_Contact);

var _Group = __webpack_require__(44);

var _Group2 = _interopRequireDefault(_Group);

var _Variable = __webpack_require__(79);

var _Variable2 = _interopRequireDefault(_Variable);

var _Parameter = __webpack_require__(46);

var _Parameter2 = _interopRequireDefault(_Parameter);

var _URLComponent = __webpack_require__(49);

var _URLComponent2 = _interopRequireDefault(_URLComponent);

var _Resource = __webpack_require__(77);

var _Resource2 = _interopRequireDefault(_Resource);

var _Reference = __webpack_require__(19);

var _Reference2 = _interopRequireDefault(_Reference);

var _Constraint = __webpack_require__(74);

var _Constraint2 = _interopRequireDefault(_Constraint);

var _ParameterContainer = __webpack_require__(47);

var _ParameterContainer2 = _interopRequireDefault(_ParameterContainer);

var _Auth = __webpack_require__(43);

var _Auth2 = _interopRequireDefault(_Auth);

var _Store = __webpack_require__(48);

var _Store2 = _interopRequireDefault(_Store);

var _URL = __webpack_require__(78);

var _URL2 = _interopRequireDefault(_URL);

var _Request = __webpack_require__(76);

var _Request2 = _interopRequireDefault(_Request);

var _fpUtils = __webpack_require__(17);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __meta__ = {
  format: 'paw',
  version: 'v3.0'
};

var methods = {};

/**
 * A Parser that converts a PawContext and an array of items into an Api Record
 */
var PawParser = exports.PawParser = (_temp = _class = function () {
  function PawParser() {
    (0, _classCallCheck3.default)(this, PawParser);
  }

  (0, _createClass3.default)(PawParser, null, [{
    key: 'parse',


    /**
     * converts an item into an intermediate model representation
     * @returns {Api} the corresponding Api Record
     */
    value: function parse() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          options = _ref.options;

      return methods.parse({ options: options });
    }
  }]);
  return PawParser;
}(), _class.__meta__ = __meta__, _class.identifier = 'com.luckymarmot.PawExtensions.API-Flow', _class.title = 'Api-Flow', _class.help = 'https://github.com/luckymarmot/API-Flow', _class.languageHighlighter = null, _class.fileExtension = null, _temp);

/**
 * creates a message with information about the state of the document when this was generated
 * @param {PawContext} context: the paw context from which to get the state of the document.
 * @returns {string?} the string describing the state of the project, if it is a cloud project.
 */

methods.addGenerationMessage = function (context) {
  if (context.document.cloudProject && context.document.cloudProject.currentBranch) {
    var branchName = context.document.cloudProject.currentBranch;
    var commitSha = context.document.cloudProject.commitSha;
    var commitMsg = commitSha ? ' on commit ' + commitSha : '';

    var msg = 'This document was generated from the branch ' + branchName + commitMsg + '.';

    return msg;
  }

  return null;
};

/**
 * creates a message about how to contribute to the project, if it is a cloud porject
 * @param {PawContext} context: the paw context from which to get the info.
 * @returns {string?} the string explaining how to contribute, if it is a cloud project.
 */
methods.addContributionMessage = function (context) {
  if (context.document.isCloudProject) {
    var cloudProject = context.document.cloudProject || {};
    var cloudTeam = context.document.cloudTeam || {};

    if (typeof cloudProject.id === 'undefined' || typeof cloudTeam.id === 'undefined') {
      return null;
    }

    var msg = 'If you are a contributor to this project, you may access it here: ' + 'https://paw.cloud/account/teams/' + cloudTeam.id + '/projects/' + cloudProject.id;

    return msg;
  }

  return null;
};

/**
 * creates a description of the state of the document.
 * @param {PawContext} context: the paw context from which to get the state of the document.
 * @returns {string?} the string describing the state of the project, if it is a cloud project.
 */
methods.extractDescription = function (context) {
  var description = [methods.addGenerationMessage(context), methods.addContributionMessage(context)].filter(function (value) {
    return !!value;
  });

  return description.join('\n\n') || null;
};

/**
 * extracts a Contact from a context
 * @param {PawContext} context: the context from which to get the contact information.
 * @returns {Contact?} the corresponding contact, if it exists
 */
methods.extractContact = function (context) {
  if (context.document.cloudTeam && context.document.cloudTeam.id) {
    return new _Contact2.default({
      url: 'https://paw.cloud/account/teams/' + context.document.cloudTeam.id,
      name: context.document.cloudTeam.name || null
    });
  }

  return null;
};

/**
 * extracts a version from a context. By default, it is v0.0.0, but a shortened commit sha will be
 * appended if it is possible.
 * @param {PawContext} context: the context from which to extract a version
 * @returns {string} the corresponding version.
 */
methods.extractVersion = function (context) {
  var version = 'v0.0.0';

  if (context.document.cloudProject && context.document.cloudProject.commitSha) {
    return version + '-' + context.document.cloudProject.commitSha.slice(0, 10);
  }

  return version;
};

/**
 * extracts the project title from a context.
 * @param {PawContext} context: the context from which to extract a title.
 * @returns {string} the corresponding title
 */
methods.extractTitle = function (context) {
  var title = context.document.name;
  return title || null;
};

/**
 * creates an Info record from a context
 * @param {PawContext} context: the context to extract information from.
 * @returns {Info} the corresponding Info record
 */
methods.extractInfo = function (context) {
  var title = methods.extractTitle(context);
  var version = methods.extractVersion(context);
  var description = methods.extractDescription(context);
  var contact = methods.extractContact(context);

  return new _Info2.default({
    title: title, version: version, description: description, contact: contact
  });
};

/**
 * traverses a tree from a request leaf to the root group and returns the hierarchy from the root
 * to the leaf.
 * @param {Array<(PawRequest|PawRequestGroup)>} path: the accumulator that holds the path up to this
 * request or group
 * @param {PawRequest|PawRequestGroup} reqOrGroup: the request or group to find the parent of.
 * @returns {Array<(PawRequest|PawRequestGroup)>} the ordered sequence of parents of the reqOrGroup
 */
methods.getPathForRequestOrGroup = function (path, reqOrGroup) {
  if (!reqOrGroup) {
    return path;
  }

  var newPath = [reqOrGroup].concat((0, _toConsumableArray3.default)(path));
  return methods.getPathForRequestOrGroup(newPath, reqOrGroup.parent);
};

/**
 * gets the ordered sequence of parents of a request, from the root group to itself.
 * @param {PawRequest} request: the request to get the parents from.
 * @returns {Array<(PawRequest|PawRequestGroup)>} the corresponding sequence of parents.
 */
methods.getPathForRequest = function (request) {
  return methods.getPathForRequestOrGroup([], request);
};

/**
 * converts a paw group into a Group record
 * @param {PawRequestGroup} pawGroup: the paw group to converts
 * @returns {Group} the corresponding Group record
 */
methods.convertPawGroupIntoGroup = function (pawGroup) {
  return new _Group2.default({
    name: pawGroup.name || null,
    id: pawGroup.id || null
  });
};

/**
 * gets the id from a PawRequest or PawRequestGroup and appends it to a list of ids. This is used to
 * transform a sequence of request groups into a path that allows us to access the corresponding
 * Group.
 * @param {Array<string>} path: the current list of 'children' and `id` values
 * @param {string} id: the id of the PawRequest or PawRequestGroup.
 * @returns {Array<string>} the updated path.
 */
methods.convertPawPathIntoGroupPath = function (path, _ref2) {
  var id = _ref2.id;
  return [].concat((0, _toConsumableArray3.default)(path), ['children', id]);
};

/**
 * creates a nested group at the expected location in an accumulator, if it does not already exist.
 * This method is designed to be used in a reducer, and allows us to fully construct all groups that
 * correspond to an ordered sequence of groups and subgroups. Since the reducer iterates over an
 * array in orderly fashion, this ensures that at any point in time, the path we are trying to
 * access is clearly defined.
 * @param {Group} acc: the root group which all path should use as a base.
 * @param {PawRequest|PawRequestGroup} item: an item from the ordered sequence of parents
 * @param {integer} index: the index at which the item is located in the sequence
 * @param {Array<PawRequest|PawRequestGroup>} fullPath: the complete ordered sequence of parents
 * @returns {Group} the updated root Group
 */
methods.createNestedGroups = function (acc, item, index, fullPath) {
  var path = fullPath.slice(0, index + 1).reduce(methods.convertPawPathIntoGroupPath, []);

  // leaf object (i.e. a paw request)
  if (index === fullPath.length - 1) {
    return acc.setIn(path, item.id);
  }

  // node object (i.e. a paw group)
  var group = acc.getIn(path);

  if (!group) {
    return acc.setIn(path, methods.convertPawGroupIntoGroup(item));
  }

  return acc;
};

/**
 * stores a request id in the expected group based on a sequence of parents, creating the groupd and
 * all of its parents if necessary.
 * @param {Group} rootGroup: the group to update with the request id
 * @param {Array<PawRequest|PawRequestGroup>} path: the ordered sequence of parents of the request
 * @returns {Group} the upated group
 */
methods.storeRequest = function (rootGroup, path) {
  return path.reduce(methods.createNestedGroups, rootGroup);
};

/**
 * extract the hierarchy of groups and requests from a list of requests.
 * @param {Array<PawRequest>} reqs: the list of requests from which to get the hierarchy.
 * @returns {Group} the corresponding Group hierarchy
 */
methods.extractGroup = function (reqs) {
  return reqs.map(methods.getPathForRequest).reduce(methods.storeRequest, new _Group2.default());
};

/**
 * traverses two strings to find the longest common path, which is similar to the longest common
 * starting string, except that we don't compare character by character but '/'-separated block
 * by '/'-separated block, as /example/pets and /example/pet/:petId have /example as a common path
 * and not /example/pet.
 * @param {Array<string>} lcPathname: the current longest common pathname, in blocks.
 * @param {string} pathname: the pathname to compare
 * @returns {Array<string>} the updated lcPathname
 */
methods.findLongestCommonPath = function (lcPathname, pathname) {
  var sections = pathname.split('/');

  var length = Math.min(lcPathname.length, sections.length);

  var index = 0;
  while (index < length) {
    if (lcPathname[index] !== sections[index]) {
      return lcPathname.slice(0, index);
    }

    index += 1;
  }

  return lcPathname.slice(0, index);
};

/**
 * @typedef hostMapType
 * @type {Object<string, {
 *   entries: Array<{ key: string, value: PawRequest, urlObject: Object}>,
 *   lcPathname: Array<string>
 * }>}
 */

/**
 *
 * updates a hostmap with data about a request, grouping it with other requests that share a common
 * host.
 * @param {hostMapType} hostMap: the host map to update.
 * @param {object} entry: the entry to add to the host map
 * @param {string} entry.key: the generated string corresponding to the url of the request
 * @param {PawRequest} entry.value: the request to add to the host map
 * @returns {hostMapType} the updated hostMap
 */
methods.addHostEntryToHostMap = function (hostMap, _ref3) {
  var key = _ref3.key,
      value = _ref3.value;

  var urlObject = (0, _url.parse)(key);
  var host = urlObject.host;

  if (!hostMap[host]) {
    hostMap[host] = { entries: [], lcPathname: urlObject.pathname.split('/') };
  }

  var lcPathname = hostMap[host].lcPathname;
  // TODO what fields are used ?
  hostMap[host].entries.push({ key: key, value: value, urlObject: urlObject });
  hostMap[host].lcPathname = methods.findLongestCommonPath(lcPathname, urlObject.pathname);
  return hostMap;
};

/**
 * converts a longest common pathname array into a longest common pathname string
 * @param {Array<string>} lcPathname: the array to convert into a string
 * @returns {string} the corresponding string
 */
methods.getLongestCommonPathnameAsString = function (lcPathname) {
  if (lcPathname.length === 1) {
    return '/' + lcPathname[0];
  }

  return lcPathname.join('/');
};

/**
 * converts a hostMapEntry into a regular Entry
 * @param {object} hostMapEntry: the entry to convert
 * @param {Array<*>} hostMapEntry.entries: the entries corresponding to this specific host.
 * @param {Array<string>} hostMapEntry.lcPathname: the array that contains the longest common
 * pathname of all the entries belonging to this hostMapEntry
 * @param {string} key: the host string
 * @returns {Entry<string, *>} the corresponding Entry
 */
methods.updateHostKeyWithLongestCommonPathname = function (_ref4, key) {
  var entries = _ref4.entries,
      lcPathname = _ref4.lcPathname;

  var lcString = methods.getLongestCommonPathnameAsString(lcPathname);
  return {
    key: key + lcString,
    value: entries
  };
};

/**
 * extracts common hosts from a list of requests, and assigns each request to its corresponding host
 * @param {Array<PawRequest>} requests: the requests to group by host
 * @returns {Seq<Entry<string, *>>} the corresponding sequence of entries.
 */
methods.extractCommonHostsFromRequests = function (requests) {
  var hosts = requests.map(function (request) {
    return { key: request.getUrlBase(), value: request };
  }).reduce(methods.addHostEntryToHostMap, {});

  return new _immutable.OrderedMap(hosts).map(methods.updateHostKeyWithLongestCommonPathname).valueSeq();
};

/**
 * converts a DynamicValue or a string into an Entry.
 * @param {DynamicValue|string} component: the component of a DynamicString to convert into an Entry
 * @return {Entry<string, DynamicValue|string>} the corresponding entry
 */
methods.convertDynamicStringComponentIntoEntry = function (component) {
  if (typeof component === 'string') {
    return { key: component, value: component };
  }

  return { key: component.getEvaluatedString(), value: component };
};

/**
 * tests whether a part of a url is entirely present in a default Url or its secure version
 * @param {string} defaultUrl: the default url to test against.
 * @param {string} defaultSecureUrl: the default secure url to test against.
 * @param {string} urlPart: the part of url to test
 * @returns {boolean} true if it is a part of either urls, false otherwise.
 */
methods.isPartOfBaseUrl = function (defaultUrl, defaultSecureUrl, urlPart) {
  return defaultUrl.indexOf(urlPart) >= 0 || defaultSecureUrl.indexOf(urlPart) >= 0;
};

// NOTE: we assume that the urlPart is after the protocol
methods.findIntersection = function (defaultUrl, urlPart) {
  var match = (defaultUrl + '####' + urlPart).match(/^.*?(.*)####\1(.*)$/);

  // always matches
  return { inside: match[1], outside: match[2] };
};

/**
 * assigns a component to either a sequence of components representing the baseUrl, or to a sequence
 * of components that represents the path that is specific to this request. If the component is
 * split between the two sequences, we split its evaluated string in such way that as much as
 * possible is put in the base sequence.
 * @param {string} defaultUrl: the non-secure url for a given host
 * @param {string} defaultSecureUrl: the secure url for a given host
 * @param {object} acc: the accumulator that holds the base and path sequences
 * @param {Array<Entry<string, string|DynamicValue>>} acc.baseComponents: the sequence of components
 * that belong to the host url
 * @param {Array<Entry<string, string|DynamicValue>>} acc.pathComponents: the sequence of components
 * that belong to the path of the request
 * @param {object} entry: the entry that represents the component
 * @param {string} entry.key: the evaluated string of the component
 * @param {string|DynamicValue} entry.value: the component
 * @returns {object} acc: the updated accumulator
 */
methods.addComponentToBaseOrPath = function (defaultUrl, defaultSecureUrl, _ref5, _ref6) {
  var baseComponents = _ref5.baseComponents,
      pathComponents = _ref5.pathComponents;
  var urlPart = _ref6.key,
      component = _ref6.value;

  if (methods.isPartOfBaseUrl(defaultUrl, defaultSecureUrl, urlPart)) {
    // component is member of base url
    baseComponents.push({ key: urlPart, value: component });
    return { baseComponents: baseComponents, pathComponents: pathComponents };
  }

  if (pathComponents.length === 0) {
    // component may be split between base url and path
    var _methods$findIntersec = methods.findIntersection(defaultUrl, urlPart),
        inside = _methods$findIntersec.inside,
        outside = _methods$findIntersec.outside;

    baseComponents.push({ key: inside, value: inside });
    pathComponents.push({ key: outside, value: outside });
  } else {
    // component is not a member of base url
    pathComponents.push({ key: urlPart, value: component });
  }

  return { baseComponents: baseComponents, pathComponents: pathComponents };
};

/**
 * tests whether a string or dynamic value is an environment variable
 * @param {string|DynamicValue} stringOrDV: the string or dynamic value to test
 * @returns {boolean} true if it an environment variable, false otherwise
 */
methods.isEnvironmentVariable = function (stringOrDV) {
  return (typeof stringOrDV === 'undefined' ? 'undefined' : (0, _typeof3.default)(stringOrDV)) === 'object' && stringOrDV.type === 'com.luckymarmot.EnvironmentVariableDynamicValue';
};

/**
 * extracts all possible values from an environment variable.
 * @param {PawContext} context: the context from which to get the environment variable.
 * @param {DynamicValue} dv: the dv that holds a reference to the environmentVariable.
 * @returns {Array<Entry<string, string>>} the array that holds all possible values as Entries.
 */
methods.extractPossibleValuesFromEnvironmentVariableDV = function (context, dv) {
  var variableId = dv.environmentVariable;
  var variable = context.getEnvironmentVariableById(variableId);
  var domain = variable.domain;
  var environments = domain.environments;
  var values = environments.map(function (env) {
    var rawValue = variable.getValue(env, true);
    // NOTE: this should not be needed anymore
    var value = null;
    if (typeof rawValue === 'string') {
      value = rawValue;
    } else {
      value = rawValue.getEvaluatedString();
    }
    return { key: env.name, value: value };
  });

  return values;
};

/**
 * extracts all possible values from a DV Entry.
 * @param {PawContext} context: the context from which to get environment variables
 * @param {Object} entry: the component entry
 * @param {string} entry.key: the part of the url that this component represents
 * @param {string|DynamicValue} entry.value: the component itself
 * @returns {Array<Entry<string, string>>} the corresponding array of possible values for a DV Entry
 */
methods.extractPossibleValuesFromDVEntry = function (context, _ref7) {
  var urlPart = _ref7.key,
      stringOrDV = _ref7.value;

  if (!methods.isEnvironmentVariable(stringOrDV)) {
    return [{ key: '', value: urlPart }];
  }

  return methods.extractPossibleValuesFromEnvironmentVariableDV(context, stringOrDV);
};

/**
 * combines all possible values from a list of combinations and entries, using a cartesian product
 * of the two arrays, which is then flattened
 * @param {Array<Entry<string, string>>} combinations: the current combinations
 * @param {Array<Entry<string, string>>} entries: the values to combine the combinations with.
 * @returns {Array<Entry<string,string>>} the updated combinations
 */
methods.combinePossibleValues = function (combinations, entries) {
  return combinations.map(function (combination) {
    var updated = entries.map(function (entry) {
      return { key: combination.key + entry.key, value: combination.value + entry.value };
    });

    return updated;
  }).reduce(function (finalList, list) {
    return finalList.concat(list);
  }, []);
};

/**
 * converts an array of components belonging to a base url into a variable, if suitable.
 * It only tries to convert it into a variable if there is a single environment variable in the
 * array of components. It otherwise returns null.
 * @param {PawContext} context: the context used to resolve environment variables
 * @param {string} defaultHost: the host associated to the baseComponents
 * @param {Array<Entry<string, string|DynamicValue>>} baseComponents: the array of components to
 * convert into a variable.
 * @returns {Variable?} the corresponding variable for this array of variables
 */
methods.convertBaseComponentsIntoVariable = function (context, defaultHost, baseComponents) {
  var environmentDVCount = baseComponents.filter(function (_ref8) {
    var value = _ref8.value;

    return methods.isEnvironmentVariable(value);
  }).length;

  if (environmentDVCount !== 1) {
    return null;
  }

  var extractValuesFromDVEntry = (0, _fpUtils.currify)(methods.extractPossibleValuesFromDVEntry, context);

  var variableValues = baseComponents.map(extractValuesFromDVEntry).reduce(methods.combinePossibleValues, [{ key: '', value: '' }]).reduce(_fpUtils.convertEntryListInMap, {});

  return new _Variable2.default({
    name: defaultHost,
    values: (0, _immutable.OrderedMap)(variableValues)
  });
};

/**
 * extracts the variable corresponding to the host, and the path components from a request.
 * @param {PawContext} context: the context in which to resolve the environment variable
 * @param {string} defaultHost: the host of the request
 * @param {function} reducer: the reducer to apply to the components of the request.url
 * @param {Entry<*, PawRequest>} entry: the request entry
 * @param {PawRequest} entry.value: the request
 * @returns {{ request: PawRequest, baseVariable: Variable?, pathComponents: Array<*> }} the
 * corresponding entry with the request, the base variable and the path components
 */
methods.extractBaseVariableAndPathComponentsFromRequest = function (context, defaultHost, reducer, _ref9) {
  var request = _ref9.value;

  var assignComponentToBaseOrPath = reducer;
  var ds = request.getUrlBase(true);

  var _ds$components$map$re = ds.components.map(methods.convertDynamicStringComponentIntoEntry).reduce(assignComponentToBaseOrPath, { baseComponents: [], pathComponents: [] }),
      baseComponents = _ds$components$map$re.baseComponents,
      pathComponents = _ds$components$map$re.pathComponents;

  var baseVariable = methods.convertBaseComponentsIntoVariable(context, defaultHost, baseComponents);
  return { request: request, baseVariable: baseVariable, pathComponents: pathComponents };
};

/**
 * A reducer to set the host variable with the first Variable that has been produced from a request
 * @param {Object} acc: the accumulator for the reducer
 * @param {Variable?} acc.hostVariable: the Variable that represents the host
 * @param {Array<ResourceEntry>} acc.requestEntries: the list of requests and their associated path
 * components that belong to this host
 * @param {object} entry: the entry to use to update the accumulator
 * @param {PawRequest} entry.request: the request to convert
 * @param {Variable?} entry.baseVariable: the host variable that was extracted from the request
 * @param {Array<Entry<string, (string|DynamicValue)>>} entry.pathComponents: the components that
 * make up the path of the request
 * @returns {object} acc: the updated accumulator
 */
methods.findBaseVariableForRequestEntries = function (_ref10, _ref11) {
  var hostVariable = _ref10.hostVariable,
      requestEntries = _ref10.requestEntries;
  var request = _ref11.request,
      baseVariable = _ref11.baseVariable,
      pathComponents = _ref11.pathComponents;

  requestEntries.push({ request: request, pathComponents: pathComponents });

  if (!hostVariable && baseVariable) {
    return { hostVariable: baseVariable, requestEntries: requestEntries };
  }

  return { hostVariable: hostVariable, requestEntries: requestEntries };
};

/**
 * converts a component entry into a string, or a parameter if the component is a request variable.
 * @param {PawRequest} request: the request to extract the request variable from.
 * @param {Object} entry: the component entry
 * @param {string} entry.key: the evaluated string of the component, used as a key
 * @param {string|DynamicString} entry.value: the component itself
 * @returns {string|Parameter} the corresponding string or parameter
 */
methods.convertComponentEntryIntoStringOrParam = function (request, _ref12) {
  var key = _ref12.key,
      value = _ref12.value;

  if (typeof value === 'string') {
    return value;
  }

  if (value.type !== 'com.luckymarmot.RequestVariableDynamicValue') {
    return key;
  }

  var _methods$convertReque = methods.convertRequestVariableDVIntoParameter(request, 'path', (0, _immutable.List)(), value, key),
      param = _methods$convertReque.value;

  return param;
};

/**
 * a reducer to merge sequencial strings together.
 * For instance, if in an array, you have
 *   [ "abc", "def", "ghi", param, "qwe", "asd" ]
 * the corresponding merge produced by using this function as a reducer will be
 *   [ "abcdefghi", param, "qweasd" ]
 * @param {Array<string|Parameter>} aggregated: the merged array
 * @param {string|Parameter} stringOrParam: the string or parameter to add to the merged array
 * @returns {Array<string|Parameter>} the updated array
 */
methods.mergeSequencialStrings = function (aggregated, stringOrParam) {
  var previous = aggregated[aggregated.length - 1];

  if (typeof previous === 'string' && typeof stringOrParam === 'string') {
    aggregated[aggregated.length - 1] = previous + stringOrParam;
    return aggregated;
  }

  aggregated.push(stringOrParam);
  return aggregated;
};

/**
 * converts a string into a parameter, or returns it as is, if it's already a parameter
 * @param {string|Parameter} stringOrParam: the string or parameter to convert
 * @returns {Parameter} the corresponding parameter
 */
methods.convertStringOrParameterIntoParameter = function (stringOrParam) {
  if (typeof stringOrParam === 'string') {
    return new _Parameter2.default({
      type: 'string',
      default: stringOrParam
    });
  }

  return stringOrParam;
};

/**
 * creates a default Path endpoint used in a resource.
 * @returns {URL} the default path endpoint
 */
methods.createDefaultPathEndpoint = function () {
  var pathnameComponent = new _URLComponent2.default({
    componentName: 'pathname',
    string: '',
    parameter: new _Parameter2.default({
      key: 'pathname',
      in: 'path',
      type: 'string',
      default: '/'
    })
  });
  return new _URL2.default().set('pathname', pathnameComponent);
};

/**
 * inserts an Empty Parameter at the beginning of a sequence if it begins with a url variable
 * instead of a standard string parameter. This is necessary, as our definition of a sequence
 * parameter specifies that it should start with a non parameter value (for ease of reading
 * afterwards)
 * @param {Array<Parameter>} sequence: the sequence to fix if needed
 * @returns {Array<Parameter>} the fixed sequence
 */
methods.insertEmptyParameterIfNeeded = function (sequence) {
  if (sequence[0].get('key') !== null) {
    sequence.splice(0, 0, new _Parameter2.default({ type: 'string', default: '' }));
  }

  return sequence;
};

/**
 * creates a Path Endpoint for a resource from a sequence of parameters.
 * @param {Array<Parameter>} sequence: the sequence to use in the sequence Parameter of the endpoint
 * @returns {URL} the corresponding path endpoint
 */
methods.createPathEndpoint = function (sequence) {
  var pathnameComponent = new _URLComponent2.default({
    componentName: 'pathname',
    string: '',
    parameter: new _Parameter2.default({
      key: 'pathname',
      in: 'path',
      type: 'string',
      superType: 'sequence',
      value: (0, _immutable.List)(sequence)
    })
  });

  var path = new _URL2.default().set('pathname', pathnameComponent);
  return path;
};

/**
 * converts a sequence of path components into a path endpoint to use in a resource.
 * @param {PawRequest} request: the request to use for request variable resolution
 * @param {Array<Entry<string, (string|DynamicValue)>>} components: a list of components that
 * represent the path of the resource
 * @returns {URL} the corresponding endpoint
 */
methods.convertPathComponentsIntoPathEndpoint = function (request, components) {
  var convertComponentEntryIntoStringOrParam = (0, _fpUtils.currify)(methods.convertComponentEntryIntoStringOrParam, request);

  var sequence = components.map(convertComponentEntryIntoStringOrParam).reduce(methods.mergeSequencialStrings, []).map(methods.convertStringOrParameterIntoParameter);

  if (!sequence.length) {
    return methods.createDefaultPathEndpoint();
  }

  var normalizedSequence = methods.insertEmptyParameterIfNeeded(sequence);
  return methods.createPathEndpoint(normalizedSequence);
};

/**
 * converts a paw request into an endpoint that holds a single request (which is the conversion of
 * the paw request)
 * @param {PawContext} context: the context in which to resolve environment variables
 * @param {Reference} reference: the reference to the endpoint being used
 * @param {Object} resourceEntry: the entry to use to create the resource
 * @param {PawRequest} resourceEntry.request: the request to convert
 * @param {Array<Entry<string, (string|Parameter)>>} resourceEntry.pathComponents: the array of
 * components that represent the path of the request
 * @returns {Entry<string, Resource>} the newly created Resource
 */
methods.extractResourceFromPawRequest = function (context, reference, _ref13) {
  var request = _ref13.request,
      pathComponents = _ref13.pathComponents;

  var path = methods.convertPathComponentsIntoPathEndpoint(request, pathComponents);
  var endpoints = (0, _defineProperty3.default)({}, reference.get('uuid'), reference);

  return {
    key: request.id,
    value: new _Resource2.default({
      name: (request.parent || {}).name || null,
      description: (request.parent || {}).description || null,
      endpoints: (0, _immutable.OrderedMap)(endpoints),
      path: path,
      methods: methods.extractRequestMapFromPawRequest(context, request, endpoints)
    })
  };
};

/**
 * converts an array of host entry into a host Variable and an array of request entry
 * @param {PawContext} context: the context in which to resolve environment variables
 * @param {string} defaultHost: the host string that we need to improve on
 * @param {Array<{ key: string, value: PawRequest, urlObject: object }>} hostEntries: the requests
 * associated with this host
 * @returns {object} hostObject: the containing object that holds the host variable and the requests
 * @returns {Variable?} hostObject.hostVariable: the variable representing this host, if it exists.
 * @returns {Array<ResourceEntry>} hostObject.requestEntries: the list of requests and their
 * associated path components that belong to this host
 */
methods.convertHostEntriesIntoHostVariableAndRequestEntries = function (context, defaultHost, hostEntries) {
  var defaultUrl = 'http://' + defaultHost;
  var defaultSecureUrl = 'https://' + defaultHost;

  var assignComponentToBaseOrPath = (0, _fpUtils.currify)(methods.addComponentToBaseOrPath, defaultUrl, defaultSecureUrl);

  var extractBaseVariableAndPathComponentsFromRequest = (0, _fpUtils.currify)(methods.extractBaseVariableAndPathComponentsFromRequest, context, defaultHost, assignComponentToBaseOrPath);

  return hostEntries.map(extractBaseVariableAndPathComponentsFromRequest).reduce(methods.findBaseVariableForRequestEntries, { hostVariable: null, requestEntries: [] });
};

/**
 * creates a default host endpoint. The hostEntries are used to extract the possible protocols for
 * this endpoint
 * @param {string} defaultHost: the host string
 * @param {Array<{ key: string, value: PawRequest, urlObject: object }>} hostEntries: the requests
 * associated with this host
 * @returns {Entry} entry: the endpoint as an entry
 * @returns {string} entry.key: the host string. this will be used as a unique identifier
 * @returns {URL} entry.value: the endpoint
 */
methods.createDefaultHostEndpoint = function (defaultHost, hostEntries) {
  var defaultUrl = 'http://' + defaultHost;

  var endpointValue = new _URL2.default({
    url: defaultUrl
  });

  var protocols = (0, _immutable.Set)(hostEntries.map(function (_ref14) {
    var urlObject = _ref14.urlObject;
    return urlObject.protocol;
  })).toList();

  endpointValue = endpointValue.set('protocol', protocols);
  return { key: defaultHost, value: endpointValue };
};

/**
 * creates an Array of Resources from an array of requests
 * @param {PawContext} context: the context in which to resolve environment variables
 * @param {string} defaultHost: the host that is shared by all the request entries
 * @param {Variable?} hostVariable: the variable that represents the host, if it exists
 * @param {Array<{ key: string, value: PawRequest, urlObject: object }>} requestEntries: the list of
 * requests associated with this host
 * @returns {Array<Entry<Resources>>} the corresponding list of resources
 */
methods.getResourcesFromRequestEntries = function (context, defaultHost, hostVariable, requestEntries) {
  var reference = new _Reference2.default({
    type: hostVariable ? 'variable' : 'endpoint',
    uuid: defaultHost
  });

  var extractResourceFromPawRequest = (0, _fpUtils.currify)(methods.extractResourceFromPawRequest, context, reference);

  return requestEntries.map(extractResourceFromPawRequest);
};

/**
 * converts a host object into a resources, and a variable or an endpoint
 * @param {PawContext} context: the context in which to resolve environment variables
 * @param {Entry} entry: the entry describing a host
 * @param {string} entry.key: the host string
 * @param {Array<Entry<string, *>>} entry.value: the array of objects describing requests associated
 * with this host
 * @returns {Object} container: the container holding the resources, and the variable or the
 * endpoint
 * @returns {Array<Entry<string, Resource>>} container.resources: the array holding all the
 * resources associated with this host
 * @return {Variable?} container.variable: the Variable record describing this host, if it exists
 * @return {Endpoint?} container.endpoint: the Endpoint record describing this host.
 *
 * NOTE: container.variable and container.endpoint are mutually exclusive
 */
methods.convertHostIntoResources = function (context, _ref15) {
  var defaultHost = _ref15.key,
      hostEntries = _ref15.value;

  var _methods$convertHostE = methods.convertHostEntriesIntoHostVariableAndRequestEntries(context, defaultHost, hostEntries),
      hostVariable = _methods$convertHostE.hostVariable,
      requestEntries = _methods$convertHostE.requestEntries;

  var variable = void 0;
  var endpoint = void 0;
  if (hostVariable) {
    variable = { key: defaultHost, value: hostVariable };
    endpoint = null;
  } else {
    variable = null;
    endpoint = methods.createDefaultHostEndpoint(defaultHost, hostEntries);
  }

  var resources = methods.getResourcesFromRequestEntries(context, defaultHost, hostVariable, requestEntries);

  return { resources: resources, variable: variable, endpoint: endpoint };
};

/**
 * returns a request variable from its uuid
 * @param {PawRequest} request: the request to get the variable from
 * @param {string} uuid: the uuid of the variable to resolved
 * @returns {PawRequestVariable?} the corresponding request variable, if it exists
 */
methods.getVariableFromUuid = function (request, uuid) {
  return request.getVariableById(uuid) || null;
};

/**
 * tests whether a DynamicString component is a request variable
 * @param {string|DynamicValue} component: the component to test
 * @returns {boolean} true if it is a request variable, false otherwise
 */
methods.isRequestVariableDynamicValue = function (component) {
  return (typeof component === 'undefined' ? 'undefined' : (0, _typeof3.default)(component)) === 'object' && component.type === 'com.luckymarmot.RequestVariableDynamicValue';
};

/**
 * tests whether the DynamicString holds a single DynamicString that is a request variable
 * @param {DynamicString} ds: the dynamic string to test
 * @returns {boolean} true if it only holds a request variable, false otherwise
 */
methods.isRequestVariableDS = function (ds) {
  return ds.length === 1 && methods.isRequestVariableDynamicValue(ds.components[0]);
};

/**
 * converts a request variable DynamicValue into a Parameter
 * @param {PawRequest} request: the request to use to resolve variable parameters
 * @param {string} location: location of the parameter (e.g. 'headers', 'queries')
 * @param {List<Parameter>} contexts: the contexts in which this Parameter is applicable
 * @param {DynamicValue} paramDV: the dynamic string to convert
 * @param {string} paramName: the name of the parameter
 * @returns {Parameter} the corresponding parameter
 */
methods.convertRequestVariableDVIntoParameter = function (request, location, contexts, paramDV, paramName) {
  var variableId = paramDV.variableUUID;
  var variable = request.getVariableById(variableId);

  if (!variable) {
    return { key: paramName, value: new _Parameter2.default({
        in: location,
        key: paramName,
        name: paramName,
        type: 'string',
        applicableContexts: contexts
      }) };
  }

  var name = variable.name,
      value = variable.value,
      schema = variable.schema,
      type = variable.type,
      description = variable.description;


  var param = new _Parameter2.default({
    in: location,
    key: name || paramName,
    name: name || paramName,
    type: type || 'string',
    description: description || null,
    default: value.getEvaluatedString(),
    constraints: (0, _immutable.List)([new _Constraint2.default.JSONSchema(schema)]),
    applicableContexts: contexts
  });

  return { key: paramName, value: param };
};

/**
 * converts a request variable DynamicString into a Parameter
 * @param {PawRequest} request: the request to use to resolve variable parameters
 * @param {string} location: location of the parameter (e.g. 'headers', 'queries')
 * @param {List<Parameter>} contexts: the contexts in which this Parameter is applicable
 * @param {DynamicString} paramDS: the dynamic string to convert
 * @param {string} paramName: the name of the parameter
 * @returns {Parameter} the corresponding parameter
 */
methods.convertRequestVariableDSIntoParameter = function (request, location, contexts, paramDS, paramName) {
  var paramDV = paramDS.components[0];
  return methods.convertRequestVariableDVIntoParameter(request, location, contexts, paramDV, paramName);
};

/**
 * Converts a standard dynamic string (i.e. not a request variable) into a Parameter
 * @param {string} location: the location of the parameter (e.g. 'headers', 'queries')
 * @param {List<Parameter>} contexts: the contexts in which the parameter is applicable
 * @param {DynamicString} paramDS: the dynamic string to converts
 * @param {string} paramName: the name of the parameter
 * @returns {Parameter} the corresponding parameter
 */
methods.convertStandardDSIntoParameter = function (location, contexts, paramDS, paramName) {
  var value = paramDS.getEvaluatedString();
  var param = new _Parameter2.default({
    in: location,
    key: paramName,
    name: paramName,
    type: 'string',
    default: value,
    applicableContexts: contexts
  });

  return { key: paramName, value: param };
};

/**
 * converts a DynamicString associated with a parameter into a Parameter record
 * @param {PawRequest} request: the request to use to resolve variable parameters
 * @param {string} location: location of the parameter (e.g. 'headers', 'queries')
 * @param {List<Parameter>} contexts: the contexts in which this Parameter is applicable
 * @param {DynamicString} paramDS: the dynamic string to convert
 * @param {string} paramName: the name of the parameter
 * @returns {Parameter} the corresponding parameter
 */
methods.convertParameterDynamicStringIntoParameter = function (request, location, contexts, paramDS, paramName) {
  if (methods.isRequestVariableDS(paramDS)) {
    return methods.convertRequestVariableDSIntoParameter(request, location, contexts, paramDS, paramName);
  }

  return methods.convertStandardDSIntoParameter(location, contexts, paramDS, paramName);
};

/**
 * tests whether the request has a url encoded body or not
 * @param {PawRequest} request: the request to test
 * @returns {boolean} true if its body is urlEncoded, false otherwise
 */
methods.isRequestBodyUrlEncoded = function (request) {
  return !!(request.getHeaderByName('Content-Type') || '').match(/application\/x-www-form-urlencoded/);
};

/**
 * tests whether the request has a multipart body or not
 * @param {PawRequest} request: the request to test
 * @returns {boolean} true if its body is multipart, false otherwise
 */
methods.isRequestBodyMultipart = function (request) {
  return !!(request.getHeaderByName('Content-Type') || '').match(/multipart\/form-data/);
};

/**
 * converts a content type into a list of Parameter, to use as applicable contexts in a Parameter.
 * @param {string} contentType: the content type of the request
 * @returns {Array<Parameter>} the corresponding applicable contexts
 */
methods.getContentTypeContexts = function (contentType) {
  return (0, _immutable.List)([new _Parameter2.default({
    key: 'Content-Type',
    name: 'Content-Type',
    in: 'headers',
    type: 'string',
    constraints: (0, _immutable.List)([new _Constraint2.default.Enum([contentType])])
  })]);
};

/**
 * creates a default array parameter.
 * @param {List<Parameter>} contexts: the list of contexts in which the parameter is applicable
 * @param {string} name: the name of the parameter
 * @returns {Parameter} a default Parameter of type Array
 */
methods.createDefaultArrayParameter = function (contexts, name) {
  var param = new _Parameter2.default({
    key: name,
    name: name,
    in: 'body',
    type: 'array',
    format: 'multi',
    value: new _Parameter2.default({
      type: 'string'
    }),
    applicableContexts: contexts
  });

  return { key: name, value: param };
};

/**
 * extracts the Parameters from a UrlEncoded or Multipart body
 * @param {Object<string, DynamicString|Array<DynamicString>>} dsMap: an object containing all
 * DynamicString by name of parameter
 * @param {Array<Parameter>} contexts: the contexts in which the parameters are applicable
 * @param {PawRequest} request: the request from which to get the body parameters
 * @returns {OrderedMap<string, Parameter>} the corresponding OrderedMap of body Parameters
 */
methods.createUrlEncodedOrMultipartBodyParameters = function (dsMap, contexts, request) {
  var bodyParams = (0, _immutable.OrderedMap)(dsMap).map(function (value, name) {
    if (Array.isArray(value)) {
      return methods.createDefaultArrayParameter(contexts, name);
    }

    return methods.convertParameterDynamicStringIntoParameter(request, 'body', contexts, value, name);
  }).reduce(_fpUtils.convertEntryListInMap, {});

  return (0, _immutable.OrderedMap)(bodyParams);
};

/**
 * extracts the Parameters from a UrlEncoded body
 * @param {PawRequest} request: the request from which to get the body parameters
 * @returns {OrderedMap<string, Parameter>} the corresponding OrderedMap of body Parameters
 */
methods.createUrlEncodedBodyParameters = function (request) {
  var dsMap = request.getUrlEncodedBody(true);
  var contexts = methods.getContentTypeContexts('application/x-www-form-urlencoded');

  return methods.createUrlEncodedOrMultipartBodyParameters(dsMap, contexts, request);
};

/**
 * extracts the Parameters from a Multipart body
 * @param {PawRequest} request: the request from which to get the body parameters
 * @returns {OrderedMap<string, Parameter>} the corresponding OrderedMap of body Parameters
 */
methods.createMultipartBodyParameters = function (request) {
  var dsMap = request.getMultipartBody(true);
  var contexts = methods.getContentTypeContexts('multipart/form-data');

  return methods.createUrlEncodedOrMultipartBodyParameters(dsMap, contexts, request);
};

/**
 * extracts the single body Parameter from a request if the request is not url-encoded or multipart
 * @param {PawRequest} request: the request from which to get the body
 * @returns {OrderedMap<string, Parameter>} the corresponding OrderedMap of body parameters
 */
methods.createStandardBodyParameters = function (request) {
  var bodyDS = request.getBody(true);

  if (!bodyDS) {
    return (0, _immutable.OrderedMap)();
  }

  var _methods$convertParam = methods.convertParameterDynamicStringIntoParameter(request, 'body', (0, _immutable.List)(), bodyDS, null),
      key = _methods$convertParam.key,
      value = _methods$convertParam.value;

  var body = (0, _defineProperty3.default)({}, key, value);
  return (0, _immutable.OrderedMap)(body);
};

/**
 * extracts all body Parameters from a request
 * @param {PawRequest} request: the request from which to get the body parameters
 * @returns {OrderedMap<string, Parameter>} the corresponding OrderedMap of body parameters
 */
methods.getBodyParameters = function (request) {
  if (methods.isRequestBodyUrlEncoded(request)) {
    return methods.createUrlEncodedBodyParameters(request);
  }

  if (methods.isRequestBodyMultipart(request)) {
    return methods.createMultipartBodyParameters(request);
  }

  return methods.createStandardBodyParameters(request);
};

/**
 * extracts all header parameters from a request
 * @param {PawRequest} request: the request from which to get the headers
 * @returns {OrderedMap<string, Parameter>} the corresponding OrderedMap of header parameters
 */
methods.getHeadersMapFromRequest = function (request) {
  var extractHeaders = (0, _fpUtils.currify)(methods.convertParameterDynamicStringIntoParameter, request, 'headers', (0, _immutable.List)());

  var headers = (0, _immutable.OrderedMap)(request.getHeaders(true)).filter(function (_, name) {
    return name !== 'Authorization';
  }).map(extractHeaders).reduce(_fpUtils.convertEntryListInMap, {});

  return (0, _immutable.OrderedMap)(headers);
};

/**
 * extracts all query parameters from a request
 * @param {PawRequest} request: the request from which to get the query params
 * @returns {OrderedMap<string, Parameter>} the corresponding OrderedMap of query parameters
 */
methods.getQueriesMapFromRequest = function (request) {
  var extractUrlParams = (0, _fpUtils.currify)(methods.convertParameterDynamicStringIntoParameter, request, 'queries', (0, _immutable.List)());

  var queryParams = (0, _immutable.OrderedMap)(request.getUrlParameters(true)).map(extractUrlParams).reduce(_fpUtils.convertEntryListInMap, {});

  return (0, _immutable.OrderedMap)(queryParams);
};

/**
 * extracts all parameters from a request into a ParameterContainer
 * @param {PawRequest} request: the request from which to get the parameters
 * @returns {ParameterContainer} the corresponding ParameterContainer
 */
methods.extractParameterContainerFromRequest = function (request) {
  var headers = methods.getHeadersMapFromRequest(request);
  var queries = methods.getQueriesMapFromRequest(request);
  var body = methods.getBodyParameters(request);

  return new _ParameterContainer2.default({
    headers: headers, queries: queries, body: body
  });
};

methods.updateIdentifiersWithAuthURL = function (identifiers, authURL) {
  var host = authURL.getEvaluatedString().split('/')[2];
  var hostArray = host ? host.split('.') : [];
  var domain = hostArray[hostArray.length - 2];
  if (domain) {
    identifiers.push(domain);
  }

  return identifiers;
};

/**
 * extracts an authName from an OAuth2 DynamicValue.
 * @param {DynamicValue} authDV: the oauth2 DynamicValue
 * @returns {string} the authName
 */
methods.getAuthNameFromOAuth2DV = function (authDV) {
  var identifiers = ['oauth_2'];
  var authURL = authDV.authorizationURL;
  if (authURL) {
    identifiers = methods.updateIdentifiersWithAuthURL(identifiers, authURL);
  }

  var grantMap = {
    '0': 'code',
    '1': 'implicit',
    '2': 'resource_owner',
    '3': 'client_credentials'
  };

  if (grantMap[authDV.grantType]) {
    identifiers.push(grantMap[authDV.grantType]);
  }

  identifiers.push('auth');

  return identifiers.join('_');
};

/**
 * extracts an authName from a DynamicValue.
 * @param {PawContext} context: the context from which to resolve environment variables
 * @param {PawRequest} request: the request from which to resolve request variables
 * @param {DynamicValue} authDV: the DynamicValue to get the name of
 * @returns {string?} the authName, if the authDV is supported by API-Flow.
 */
methods.getAuthNameFromAuthDV = function (context, request, authDV) {
  if (methods.isEnvironmentVariable(authDV)) {
    var name = context.getEnvironmentVariableById(authDV.environmentVariable).name;
    return name;
  }

  if (methods.isRequestVariableDynamicValue(authDV)) {
    var variable = request.getVariableById(authDV.variableUUID);
    return methods.getAuthNameFromAuth(context, request, variable.value);
  }

  if (authDV.type === 'com.luckymarmot.OAuth2DynamicValue') {
    return methods.getAuthNameFromOAuth2DV(authDV);
  }

  return null;
};

/**
 * extracts an authName from the evaluation of a DynamicString
 * @param {DynamicString} authDS: the DynamicString to get the evaluated string of, for the purpose
 * of name extractVersion
 * @returns {string?} the name of the authentication DynamicString, if it is supported by API-Flow.
 */
methods.getAuthNameFromAuthString = function (authDS) {
  var scheme = authDS.getEvaluatedString().split(' ')[0];
  var nameMap = {
    Basic: 'basic_auth',
    Digest: 'digest_auth',
    Hawk: 'hawk_auth',
    'AWS4-HMAC-SHA256': 'aws_sig4_auth',
    OAuth: 'oauth_1_auth',
    Bearer: 'oauth_2_auth'
  };

  if (nameMap[scheme]) {
    return nameMap[scheme];
  }

  return null;
};

/**
 * extracts an authName from an authentication DynamicString.
 * @param {PawContext} context: the context in which to resolve the environment variable
 * @param {PawRequest} request: the request in which to resolve the request variable
 * @param {DynamicString} authDS: the authentication DynamicString to get the name of
 * @returns {string?} the extracted authName, if the authentication method is supported by API-Flow
 */
methods.getAuthNameFromAuth = function (context, request, authDS) {
  var authDV = authDS.getOnlyDynamicValue();

  if (authDV) {
    var name = methods.getAuthNameFromAuthDV(context, request, authDV);
    if (name) {
      return name;
    }
  }

  return methods.getAuthNameFromAuthString(authDS);
};

/**
 * extracts Auth References from a Request
 * @param {PawContext} context: the context in which to resolve environment variables
 * @param {PawRequest} request: the request from which to get the authentication header
 * @returns {List<References>} the corresponding list of References
 */
methods.extractAuthReferencesFromRequest = function (context, request) {
  var auth = request.getHeaderByName('Authorization', true);
  if (!auth) {
    return (0, _immutable.List)();
  }

  var authName = methods.getAuthNameFromAuth(context, request, auth);

  return (0, _immutable.List)([new _Reference2.default({
    type: 'auth',
    uuid: authName
  })]);
};

/**
 * converts a paw request into a Request record and stores it in an OrderedMap.
 * @param {PawContext} context: the context in which to resolve the environment variables
 * @param {PawRequest} pawReq: the request to convert
 * @param {OrderedMap<string, Reference>} endpoints: a map of references to endpoints
 * @returns {OrderedMap<string, Request>} the converted Request saved in an OrderedMap
 */
methods.extractRequestMapFromPawRequest = function (context, pawReq, endpoints) {
  var method = pawReq.getMethod();
  var parameters = methods.extractParameterContainerFromRequest(pawReq);
  var auths = methods.extractAuthReferencesFromRequest(context, pawReq);

  var request = new _Request2.default({
    id: pawReq.id,
    endpoints: (0, _immutable.OrderedMap)(endpoints),
    name: pawReq.name,
    description: pawReq.description,
    method: method,
    parameters: parameters,
    auths: auths
  });

  return (0, _immutable.OrderedMap)((0, _defineProperty3.default)({}, method, request));
};

/**
 * a reducer to group resources, variables, and endpoints together
 * @param {object} acc: the accumulator of the reducer
 * @param {Array<Entry<string, Resources>>} acc.resources: an aggregation of resources over multiple
 * endpoints/hosts
 * @param {Array<Entry<string, Variable>>} acc.variables: an aggregation of variables over multiple
 * endpoints/hosts
 * @param {Array<Entry<string, URL>>} acc.endpoints: an aggregation of endpoints over multiple hosts
 * @param {object} entry: the entry to add to the reducer
 * @param {Array<Entry<string, Resources>>} entry.resources: all the resources associated with a
 * host
 * @param {Variable?} entry.variable: the variable associated with the host, if it exists
 * @param {URL?} entry.endpoint: the endpoint associated with the host, if it exists
 * @returns {object} acc, the updated accumulator
 */
methods.groupResourcesVariablesAndEndpoints = function (_ref16, _ref17) {
  var resources = _ref16.resources,
      variables = _ref16.variables,
      endpoints = _ref16.endpoints;
  var hostResources = _ref17.resources,
      variable = _ref17.variable,
      endpoint = _ref17.endpoint;

  if (variable) {
    variables.push(variable);
  }

  if (endpoint) {
    endpoints.push(endpoint);
  }

  return {
    resources: resources.concat(hostResources),
    variables: variables,
    endpoints: endpoints
  };
};

methods.addAuthorizationAndTokenUrlToOAuth2Auth = function (authDV) {
  var authInstance = {};
  var authURL = authDV.authorizationURL;
  if (authURL) {
    authInstance.authorizationUrl = authURL.getEvaluatedString();
  }

  var tokenURL = authDV.tokenURL;
  if (tokenURL) {
    authInstance.tokenUrl = tokenURL.getEvaluatedString();
  }

  return authInstance;
};

/**
 * extracts an Auth record from an OAuth2 DynamicValue
 * @param {PawContext} context: the context in which to resolve environment variables
 * @param {PawRequest} request: the request in which to resolve request variables
 * @param {DynamicString} authDS: the authentication DynamicString
 * @param {DynamicValue} authDV: the authentication DynamicValue
 * @return {Entry<string, Auth>} the corresponding Auth record
 */
methods.extractAuthFromOAuth2DV = function (context, request, authDS, authDV) {
  var authInstance = methods.addAuthorizationAndTokenUrlToOAuth2Auth(authDV);

  var authName = methods.getAuthNameFromAuth(context, request, authDS);
  authInstance.authName = authName;

  var grantMap = {
    '0': 'accessCode',
    '1': 'implicit',
    '2': 'password',
    '3': 'application'
  };

  authInstance.flow = grantMap[authDV.grantType] || 'implicit';

  return { key: authName, value: new _Auth2.default.OAuth2(authInstance) };
};

/**
 * extract an Auth from DynamicValue
 * @param {PawContext} context: the context in which to resolve environment variables
 * @param {PawRequest} request: the request in which to resolve request variables
 * @param {DynamicString} authDS: the authentication DynamicString
 * @param {DynamicValue} authDV: the authentication DynamicValue
 * @return {Entry<string, Auth>} the corresponding Auth record
 */
methods.extractAuthFromDV = function (context, request, authDS, authDV) {
  if (methods.isEnvironmentVariable(authDV)) {
    var value = context.getEnvironmentVariableById(authDV.environmentVariable).getCurrentValue(true);
    return methods.extractAuthsFromRequest(context, request, value);
  }

  if (methods.isRequestVariableDynamicValue(authDV)) {
    var variable = request.getVariableById(authDV.variableUUID);
    return methods.extractAuthsFromRequest(context, request, variable.value);
  }

  if (authDV.type === 'com.luckymarmot.OAuth2DynamicValue') {
    return methods.extractAuthFromOAuth2DV(context, request, authDS, authDV);
  }

  return methods.extractAuthFromAuthString(authDS);
};

/**
 * extracts an Auth from the evaluated string of an authentication DynamicString
 * @param {DynamicString} authDS: the authentication DynamicString to get the evaluated string of
 * @returns {Entry<string, Auth>} the corresponding Auth record
 */
methods.extractAuthFromAuthString = function (authDS) {
  var scheme = authDS.getEvaluatedString().split(' ')[0];
  var nameMap = {
    Basic: function Basic() {
      return { key: 'basic_auth', value: new _Auth2.default.Basic({ authName: 'basic_auth' }) };
    },
    Digest: function Digest() {
      return { key: 'digest_auth', value: new _Auth2.default.Digest({ authName: 'digest_auth' }) };
    },
    Hawk: function Hawk() {
      return { key: 'hawk_auth', value: new _Auth2.default.Hawk({ authName: 'hawk_auth' }) };
    },
    'AWS4-HMAC-SHA256': function AWS4HMACSHA256() {
      return {
        key: 'aws_sig4_auth',
        value: new _Auth2.default.AWSSig4({ authName: 'aws_sig4_auth' })
      };
    },
    OAuth: function OAuth() {
      return { key: 'oauth_1_auth', value: new _Auth2.default.OAuth1({ authName: 'oauth_1_auth' }) };
    },
    Bearer: function Bearer() {
      return { key: 'oauth_2_auth', value: new _Auth2.default.OAuth2({ authName: 'oauth_2_auth' }) };
    }
  };

  if (nameMap[scheme]) {
    return nameMap[scheme]();
  }

  return { key: null, value: null };
};

/**
 * extract auths from a request or dynamic string
 * @param {PawContext} context: the context to use to resolve environment variables
 * @param {PawRequest} request: the request to use to resolve request variables, or to get the
 * authentication DynamicString
 * @param {DynamicString} _authDS: an optional authentication DynamicString to resolve instead of
 * the authentication DynamicString
 * @returns {Entry<string?, Auth?>} the corresponding auth DynamicValue
 */
methods.extractAuthsFromRequest = function (context, request, _authDS) {
  // potential infinite loop ?
  var authDS = _authDS || request.getHeaderByName('Authorization', true);
  var authDV = authDS.getOnlyDynamicValue();

  if (authDV) {
    return methods.extractAuthFromDV(context, request, authDS, authDV);
  }

  return methods.extractAuthFromAuthString(authDS);
};

/**
 * converts an array of PawRequests into Resources
 * @param {PawContext} context: the context to use to resolve environment variables
 * @param {Array<PawRequest>} reqs: the array of requests to convert into resources
 * @returns {{
 *   resources: Object<string, Resources>,
 *   variables: Array<Entry<string, Variable>>,
 *   endpoints: Array<Entry<string, URL>>
 * }} the corresponding resource map, and the associated variables and endpoints
 */
methods.extractResources = function (context, reqs) {
  var hosts = methods.extractCommonHostsFromRequests(reqs);
  var convertHostIntoResources = (0, _fpUtils.currify)(methods.convertHostIntoResources, context);

  var _hosts$map$reduce = hosts.map(convertHostIntoResources).reduce(methods.groupResourcesVariablesAndEndpoints, { resources: [], variables: [], endpoints: [] }),
      resources = _hosts$map$reduce.resources,
      variables = _hosts$map$reduce.variables,
      endpoints = _hosts$map$reduce.endpoints;

  var resourceMap = (0, _immutable.OrderedMap)(resources.reduce(_fpUtils.convertEntryListInMap, {}));

  return { resources: resourceMap, variables: variables, endpoints: endpoints };
};

/**
 * creates a Store from variables, endpoints, and auths
 * @param {PawContext} context: the context to use to resolve environment variables
 * @param {Array<Entry<string, Variable>>} variables: the variables to save in the store
 * @param {Array<Entry<string, URL>>} endpoints: the endpoints to save in the store
 * @param {Array<PawRequest>} reqs: the array of paw requests to use to extract shared auth methods
 * @returns {Store} the corresponding store
 */
methods.extractStore = function (context, variables, endpoints, reqs) {
  var auths = reqs.filter(function (request) {
    return request.getHeaderByName('Authorization', true);
  }).map(function (request) {
    return methods.extractAuthsFromRequest(context, request);
  }).filter(function (_ref18) {
    var key = _ref18.key;
    return !!key;
  });

  var variableStore = (0, _immutable.OrderedMap)(variables.reduce(_fpUtils.convertEntryListInMap, {}));
  var endpointStore = (0, _immutable.OrderedMap)(endpoints.reduce(_fpUtils.convertEntryListInMap, {}));
  var authStore = (0, _immutable.OrderedMap)(auths.reduce(_fpUtils.convertEntryListInMap, {}));

  var store = new _Store2.default({
    variable: variableStore,
    endpoint: endpointStore,
    auth: authStore
  });

  return store;
};

/**
 * extracts Resources and a Store of shared objects from an array of requests
 * @param {PawContext} context: the context to use to resolve environment variables
 * @param {Array<PawRequest>} reqs: the array of request from which to extract resources and shared
 * objects
 * @returns {object} result
 * @returns {OrderedMap<string, Resource>} result.resources: the extracted resources
 * @returns {Store} result.store: the store containing shared objects from resources
 */
methods.extractResourcesAndStore = function (context, reqs) {
  var _methods$extractResou = methods.extractResources(context, reqs),
      resources = _methods$extractResou.resources,
      variables = _methods$extractResou.variables,
      endpoints = _methods$extractResou.endpoints;

  var store = methods.extractStore(context, variables, endpoints, reqs);

  return { resources: resources, store: store };
};

// NOTE: we're cheating in this method, as we're not using the standard Item interface, but rather
// passing the requests and context as options to the parser.
/**
 * imports a list of requests, as well as metadata into an Api
 * @param {object} parserOptions: the parser options
 * @param {PawContext} parserOptions.context: the paw context
 * @param {PawRequest} parserOptions.reqs: the array of requests to import
 * @returns {Api} the corresponding Api
 */
methods.parse = function (_ref19) {
  var options = _ref19.options;
  var context = options.context,
      reqs = options.reqs;

  var info = methods.extractInfo(context);
  var group = methods.extractGroup(reqs);

  var _methods$extractResou2 = methods.extractResourcesAndStore(context, reqs),
      resources = _methods$extractResou2.resources,
      store = _methods$extractResou2.store;

  var api = new _Api2.default({
    info: info, store: store, group: group, resources: resources
  });

  return { options: options, api: api };
};

var __internals__ = exports.__internals__ = methods;
exports.default = PawParser;

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__internals__ = exports.PostmanSerializer = undefined;

var _stringify = __webpack_require__(29);

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

var _class, _temp; /**
                    * A Swagger v2 serializer.
                    * This implementation has the following limitations:
                    * - it will not create a global security field (securityDefinitions will be included though).
                    * - it will not use the externalDocs, as this is field is still not supported
                    * - the auths field in a Request **MUST** only be composed of References
                    * - null Auth not supported at the moment
                    *
                    * NOTE: we allow use of undefined in this file as it works nicely with JSON.stringify, which drops
                    * keys with a value of undefined.
                    * ```
                    * const swagger = { info, security }
                    * ```
                    * is easier to read than
                    * ```
                    * const swagger = { info }
                    * if (security) {
                    *   swagger.security = security
                    * }
                    * ```
                    *
                    * NOTE: we make the assumption that keys of a container are equal to the uuids of the objects it
                    * holds.
                    *
                    * NOTE: we assume that keys of a response map are status codes
                    * NOTE: we assume that keys of a methods map are method names.
                    */
/* eslint-disable no-undefined */


var _immutable = __webpack_require__(0);

var _Group = __webpack_require__(44);

var _Group2 = _interopRequireDefault(_Group);

var _Reference = __webpack_require__(19);

var _Reference2 = _interopRequireDefault(_Reference);

var _Auth = __webpack_require__(43);

var _Auth2 = _interopRequireDefault(_Auth);

var _fpUtils = __webpack_require__(17);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __meta__ = {
  format: 'postman',
  version: 'v2.0'
};

var methods = {};

/**
 * A Serializer to convert Api Records into Postman collections v2.
 */
var PostmanSerializer = exports.PostmanSerializer = (_temp = _class = function () {
  function PostmanSerializer() {
    (0, _classCallCheck3.default)(this, PostmanSerializer);
  }

  (0, _createClass3.default)(PostmanSerializer, null, [{
    key: 'serialize',


    /**
     * serializes an Api into a Postman collection v2 formatted string
     * @param {Api} api: the api to convert
     * @returns {string} the corresponding postman collection, as a string
     */
    value: function serialize(api) {
      return methods.serialize(api);
    }

    /**
     * returns a quality score for a content string wrt. to the collection v2 format.
     * @param {String} content: the content of the file to analyze
     * @returns {number} the quality of the content
     */

  }, {
    key: 'validate',
    value: function validate(content) {
      return methods.validate(content);
    }
  }]);
  return PostmanSerializer;
}(), _class.__meta__ = __meta__, _temp);

/**
 * returns a quality score for a content string wrt. to the collection v2 format.
 * @param {String} content: the content of the file to analyze
 * @returns {number} the quality of the content
 */

methods.validate = function () {
  return 0;
};

/**
 * extracts the info name field from an api.
 * @param {Api} api: the Api from which to get the title to use in the info name
 * @returns {Entry<string, string>} the corresponding entry
 */
methods.createInfoName = function (api) {
  var title = api.getIn(['info', 'title']) || 'API-Flow export';

  return { key: 'name', value: title };
};

/**
 * creates an entry that holds the schema info field
 * @returns {Entry<string, string>} the corresponding entry
 */
methods.createInfoSchema = function () {
  var schemaUrl = 'https://schema.getpostman.com/json/collection/v2.0.0/collection.json';
  return { key: 'schema', value: schemaUrl };
};

/**
 * extracts the info description from an Api.
 * @param {Api} api: the Api from which to get the description
 * @returns {Entry<string, string>?} the corresponding entry, if it exists
 */
methods.createInfoDescription = function (api) {
  var description = api.getIn(['info', 'description']);
  if (!description) {
    return null;
  }

  return { key: 'description', value: description };
};

/**
 * extracts the info version from the an Api.
 * @param {Api} api: the Api from which to get the version
 * @returns {Entry<string, string>?} the corresponding entry, if it exists
 */
methods.createInfoVersion = function (api) {
  var version = api.getIn(['info', 'version']);
  if (!version) {
    return null;
  }

  return { key: 'version', value: version };
};

/**
 * creates a postman info object from an api
 * @param {Api} api: the Api to get the information from
 * @returns {Entry<string, PostmanInfo>} the corresponding entry
 */
methods.createInfo = function (api) {
  var kvs = [methods.createInfoName(api), methods.createInfoSchema(), methods.createInfoDescription(api), methods.createInfoVersion(api)].filter(function (v) {
    return !!v;
  });

  return { key: 'info', value: kvs.reduce(_fpUtils.convertEntryListInMap, {}) };
};

/**
 * extracts the name of an Item from a Group or a Resource
 * @param {Group|Resource} groupOrResource: the group or resource whose name is to be extracted
 * @returns {Entry<string, string>?} the corresponding entry, if it exists
 */
methods.createItemName = function (groupOrResource) {
  var name = groupOrResource.get('name');
  if (!name) {
    return null;
  }

  return { key: 'name', value: name };
};

/**
 * extracts the description of an Item from a Group or a Resource
 * @param {Group|Resource} groupOrResource: the group or resource whose description is to be
 * extracted
 * @returns {Entry<string, string>?} the corresponding entry, if it exists
 */
methods.createItemDescription = function (groupOrResource) {
  var description = groupOrResource.get('description');
  if (!description) {
    return null;
  }

  return { key: 'description', value: description };
};

/**
 * extracts an endpoint out of a resource and a request, preferring the one from the request to the
 * one from the resource
 * @param {Resource} resource: the resource to get an endpoint from
 * @param {Request} request: the request to get an endpoint from
 * @returns {Endpoint?} the corresponding endpoint, if it exists
 */
methods.getEndpointOrReferenceFromResourceAndRequest = function (resource, request) {
  var requestEndpoint = request.get('endpoints').valueSeq().get(0);
  var resourceEndpoint = resource.get('endpoints').valueSeq().get(0);

  if (requestEndpoint) {
    return requestEndpoint;
  }

  if (resourceEndpoint) {
    return resourceEndpoint;
  }

  return null;
};

/**
 * extracts an endpoint url from a shared variable
 * @param {Variable} variable: the variable to convert into an endpoint url
 * @returns {string?} the corresponding url, if it exists
 */
methods.getEndpointFromVariable = function (variable) {
  if (!variable) {
    return null;
  }

  var url = variable.get('values').valueSeq().get(0) || null;
  return url;
};

/**
 * extracts an endpoint or an endpoint url from a reference (by fetching it in the store)
 * @param {Api} api: the api to use to resolve shared objects
 * @param {Reference} reference: the reference to use to resolve the endpoint
 * @returns {Endpoint?|string?} the corresponding endpoint or endpoint url, if it exists
 */
methods.getEndpointFromReference = function (api, reference) {
  if (reference.get('type') === 'variable') {
    var variable = api.getIn(['store', 'variable', reference.get('uuid')]);
    return methods.getEndpointFromVariable(variable);
  }

  var type = reference.get('type') || 'endpoint';
  var uuid = reference.get('uuid');

  return api.getIn(['store', type, uuid]) || null;
};

/**
 * extracts a query parameter key value pair from a reference
 * @param {Api} api: the api to use to resolve shared parameters
 * @param {Reference} reference: the reference to use to resolve the query parameter
 * @returns {string?} the corresponding query parameter key value pair, as a string, if it exists
 */
methods.extractQueryKeyValuePairFromReference = function (api, reference) {
  var resolved = api.getIn(['store', 'parameter', reference.get('uuid')]);

  if (!resolved) {
    return null;
  }

  var key = resolved.get('key');
  var value = '{{' + reference.get('uuid') + '}}';
  return key + '=' + value;
};

/**
 * extracts a query parameter key value pair from a parameter
 * @param {Parameter} param: the parameter to convert
 * @returns {string} the corresponding query parameter key value pair, as a string
 */
methods.extractQueryKeyValuePairFromParameter = function (param) {
  var key = param.get('key');
  var value = param.getJSONSchema().default || '';

  return key + '=' + value;
};

/**
 * extract a query parameter key value pair from a Parameter or a Reference
 * @param {Api} api: the api to use to resolve shared parameters
 * @param {Parameter|Reference} param: the Parameter or Reference to convert into a query parameter
 * @returns {string?} the corresponding query parameter key value pair, as a string, if it exists
 */
methods.extractQueryKeyValuePairFromParameterOrReference = function (api, param) {
  if (param instanceof _Reference2.default) {
    return methods.extractQueryKeyValuePairFromReference(api, param);
  }

  return methods.extractQueryKeyValuePairFromParameter(param);
};

/**
 * extracts a query string from a request
 * @param {Api} api: the api to use to resolve shared parameters
 * @param {Request} request: the request to extract the query string from
 * @returns {string} the corresponding queryString
 */
methods.extractQueryStringFromRequest = function (api, request) {
  var queryString = request.getIn(['parameters', 'queries']).map(function (param) {
    return methods.extractQueryKeyValuePairFromParameterOrReference(api, param);
  }).filter(function (v) {
    return !!v;
  }).valueSeq().toJS().join('&');

  if (queryString === '') {
    return queryString;
  }

  return '?' + queryString;
};

/**
 * merges together a base url with a path and a queryString
 * @param {string} baseUrl: the base url from the endpoint of a request/resoure
 * @param {string} path: the path of the resource this url belongs to
 * @param {string} queryString: the queryString associated with the request this url belongs to
 * @returns {Entry<string, string>} the corresponding complete url, as an Entry
 */
methods.combineUrlComponents = function (baseUrl, path, queryString) {
  if (baseUrl[baseUrl.length - 1] === '/' && path[0] === '/' || path === '/') {
    var _url = baseUrl + path.slice(1);
    return { key: 'url', value: _url + queryString };
  }

  var url = baseUrl + path;
  return { key: 'url', value: url + queryString };
};

/**
 * extracts a url from an endpoint
 * @param {URL|string} endpoint: the endpoint to extract a url from
 * @returns {string} the corresponding url
 */
methods.extractBaseUrlFromEndpoint = function (endpoint) {
  var baseUrl = typeof endpoint === 'string' ? endpoint : endpoint.generate((0, _immutable.List)(['{{', '}}']));

  return baseUrl;
};

/**
 * extract a path from a resource
 * @param {Resource} resource: the resource to get the path from
 * @returns {string} the corresponding path
 */
methods.extractPathFromResource = function (resource) {
  var pathname = resource.getIn(['path', 'pathname']);

  if (!pathname) {
    return '/';
  }

  var path = pathname.generate((0, _immutable.List)([':', '']));

  return path;
};

/**
 * creates a postman url entry from a request and its containing resource
 * @param {Api} api: the Api record to use to resolve shared objects
 * @param {Resource} resource: the resource from which to get the path and shared endpoints
 * @param {Request} request: the request from which to get the shared endpoints. It overrides the
 * ones from the Resource level
 * @returns {Entry<string, string>?} the corresponding entry, if it exists
 */
methods.createRequestUrl = function (api, resource, request) {
  var endpointOrReference = methods.getEndpointOrReferenceFromResourceAndRequest(resource, request);

  var endpoint = endpointOrReference;
  if (endpointOrReference instanceof _Reference2.default) {
    endpoint = methods.getEndpointFromReference(api, endpointOrReference);
  }

  if (!endpoint) {
    return null;
  }

  var baseUrl = methods.extractBaseUrlFromEndpoint(endpoint);
  var path = methods.extractPathFromResource(resource);
  var queryString = methods.extractQueryStringFromRequest(api, request);

  return methods.combineUrlComponents(baseUrl, path, queryString);
};

/**
 * converts an AWSSig4 auth into a postmanAuth property
 * @param {Auth} auth: the auth to convert
 * @returns {{
 *   type: 'awsv4',
 *   awsv4: Object
 * }} the corresponding postmanAuth property
 */
methods.createRequestAuthFromAWSSig4Auth = function (auth) {
  var kvs = [{ key: 'accessKey', value: auth.get('key') }, { key: 'secretKey', value: auth.get('secret') }, { key: 'region', value: auth.get('region') }, { key: 'service', value: auth.get('service') }].filter(function (_ref) {
    var value = _ref.value;
    return !!value;
  });

  if (!kvs.length) {
    return { type: 'awsv4' };
  }

  return { type: 'awsv4', awsv4: kvs.reduce(_fpUtils.convertEntryListInMap, {}) };
};

/**
 * converts a Basic auth into a postmanAuth property
 * @param {Auth} auth: the auth to convert
 * @returns {{
 *   type: 'basic',
 *   basic: Object
 * }} the corresponding postmanAuth property
 */
methods.createRequestAuthFromBasicAuth = function (auth) {
  var kvs = [{ key: 'username', value: auth.get('username') }, { key: 'password', value: auth.get('password') }].filter(function (_ref2) {
    var value = _ref2.value;
    return !!value;
  });

  if (!kvs.length) {
    return { type: 'basic' };
  }

  return { type: 'basic', basic: kvs.reduce(_fpUtils.convertEntryListInMap, {}) };
};

/**
 * converts a Digest auth into a postmanAuth property
 * @param {Auth} auth: the auth to convert
 * @returns {{
 *   type: 'digest',
 *   digest: Object
 * }} the corresponding postmanAuth property
 */
methods.createRequestAuthFromDigestAuth = function (auth) {
  var kvs = [{ key: 'username', value: auth.get('username') }, { key: 'password', value: auth.get('password') }].filter(function (_ref3) {
    var value = _ref3.value;
    return !!value;
  });

  if (!kvs.length) {
    return { type: 'digest' };
  }

  return { type: 'digest', digest: kvs.reduce(_fpUtils.convertEntryListInMap, {}) };
};

/**
 * converts an Hawk auth into a postmanAuth property
 * @param {Auth} auth: the auth to convert
 * @returns {{
 *   type: 'hawk',
 *   hawk: Object
 * }} the corresponding postmanAuth property
 */
methods.createRequestAuthFromHawkAuth = function (auth) {
  var kvs = [{ key: 'authId', value: auth.get('id') }, { key: 'authKey', value: auth.get('key') }, { key: 'algorithm', value: auth.get('algorithm') }].filter(function (_ref4) {
    var value = _ref4.value;
    return !!value;
  });

  if (!kvs.length) {
    return { type: 'hawk' };
  }

  return { type: 'hawk', hawk: kvs.reduce(_fpUtils.convertEntryListInMap, {}) };
};

/**
 * converts an OAuth1 auth into a postmanAuth property
 * @param {Auth} auth: the auth to convert
 * @returns {{
 *   type: 'oauth1',
 *   oauth1: Object
 * }} the corresponding postmanAuth property
 */
methods.createRequestAuthFromOAuth1Auth = function (auth) {
  var kvs = [{ key: 'consumerSecret', value: auth.get('consumerSecret') }, { key: 'consumerKey', value: auth.get('consumerKey') }, { key: 'token', value: auth.get('token') }, { key: 'tokenSecret', value: auth.get('tokenSecret') }, { key: 'signatureMethod', value: auth.get('algorithm') }, { key: 'nonce', value: auth.get('nonce') }, { key: 'version', value: auth.get('version') }].filter(function (_ref5) {
    var value = _ref5.value;
    return !!value;
  });

  if (!kvs.length) {
    return { type: 'oauth1' };
  }

  return { type: 'oauth1', oauth1: kvs.reduce(_fpUtils.convertEntryListInMap, {}) };
};

/**
 * converts an OAuth2 auth into a postmanAuth property
 * @param {Auth} auth: the auth to convert
 * @returns {{
 *   type: 'oauth2',
 *   oauth2: Object
 * }} the corresponding postmanAuth property
 */
methods.createRequestAuthFromOAuth2Auth = function (auth) {
  var kvs = [{ key: 'authUrl', value: auth.get('authorizationUrl') }, { key: 'accessTokenUrl', value: auth.get('tokenUrl') }, { key: 'scope', value: auth.get('scopes').map(function (_ref6) {
      var key = _ref6.key;
      return key;
    }).join(' ') || null }].filter(function (_ref7) {
    var value = _ref7.value;
    return !!value;
  });

  if (!kvs.length) {
    return { type: 'oauth2' };
  }

  return { type: 'oauth2', oauth2: kvs.reduce(_fpUtils.convertEntryListInMap, {}) };
};

/* eslint-disable max-statements */
/**
 * converts an Auth into a postmanAuth
 * @param {Auth} auth: the auth to convert
 * @returns {Entry<string, PostmanAuth>?} the corresponding postmanAuth entry, if it exists
 */
methods.createRequestAuthFromAuth = function (auth) {
  var postmanAuth = null;
  if (auth instanceof _Auth2.default.AWSSig4) {
    postmanAuth = methods.createRequestAuthFromAWSSig4Auth(auth);
  }

  if (auth instanceof _Auth2.default.Basic) {
    postmanAuth = methods.createRequestAuthFromBasicAuth(auth);
  }

  if (auth instanceof _Auth2.default.Digest) {
    postmanAuth = methods.createRequestAuthFromDigestAuth(auth);
  }

  if (auth instanceof _Auth2.default.Hawk) {
    postmanAuth = methods.createRequestAuthFromHawkAuth(auth);
  }

  if (auth instanceof _Auth2.default.OAuth1) {
    postmanAuth = methods.createRequestAuthFromOAuth1Auth(auth);
  }

  if (auth instanceof _Auth2.default.OAuth2) {
    postmanAuth = methods.createRequestAuthFromOAuth2Auth(auth);
  }

  if (!postmanAuth) {
    return null;
  }

  return { key: 'auth', value: postmanAuth };
};
/* eslint-enable max-statements */

/**
 * converts the Auths from a request into a postmanAuth
 * @param {Api} api: the Api from which to get the shared auth methods
 * @param {Request} request: the request from which to get the *potentially null* auth references
 * @returns {Entry<string, PostmanAuth>?} the corresponding postmanAuth entry, if it exists.
 */
methods.createRequestAuth = function (api, request) {
  var auths = request.get('auths').valueSeq();

  if (!auths.size) {
    return null;
  }

  var auth = auths.get(0);
  if (!auth) {
    return { key: 'auth', value: { type: 'noauth', noauth: {} } };
  }

  var authData = api.getIn(['store', 'auth', auth.get('uuid')]);
  var postmanAuth = methods.createRequestAuthFromAuth(authData);

  return postmanAuth || null;
};

/**
 * extracts a PostmanMethod from a request
 * @param {Request} request: the request from which to extract the method
 * @returns {Entry<string, string>?} the corresponding entry, if it exists
 */
methods.createMethod = function (request) {
  var method = request.get('method');
  if (!method) {
    return null;
  }

  return { key: 'method', value: method.toUpperCase() };
};

/**
 * creates a Header from a reference
 * @param {Api} api: the api to use to resolve the shared parameters
 * @param {Reference} reference: the reference to convert into a header
 * @returns {Entry<string?, string>?} the corresponding header, formatted as an entry, if it exists
 */
methods.createHeaderFromReference = function (api, reference) {
  var param = api.getIn(['store', 'parameter', reference.get('uuid')]);

  if (!param) {
    return null;
  }

  var key = param.get('key');
  var value = '{{' + reference.get('uuid') + '}}';

  return { key: key, value: value };
};

/**
 * creates a header from a Parameter
 * @param {Parameter} param: the parameter to convert into a header
 * @returns {Entry<string, string>?} the corresponding header, formatted as an Entry, if it exists
 */
methods.createHeaderFromParameter = function (param) {
  var key = param.get('key');

  if (!key) {
    return null;
  }

  var schema = param.getJSONSchema();

  if (schema.default) {
    return { key: key, value: schema.default };
  }

  if (schema.enum) {
    return { key: key, value: schema.enum[0] };
  }

  return { key: key, value: null };
};

/**
 * extracts a header from a Parameter or Reference
 * @param {Api} api: the api to use to resolve shared parameters
 * @param {Parameter|Reference} paramOrReference: the parameter or reference to convert into a
 * header
 * @returns {Entry<string?, string>?} the corresponding header, formatted as an Entry, if it exists
 */
methods.createHeaderFromParameterOrReference = function (api, paramOrReference) {
  if (paramOrReference instanceof _Reference2.default) {
    return methods.createHeaderFromReference(api, paramOrReference);
  }

  if (!paramOrReference || !paramOrReference.get('key')) {
    return null;
  }

  return methods.createHeaderFromParameter(paramOrReference);
};

/**
 * extracts a PostmanHeader from a request
 * @param {Api} api: the api to use to resolve shared parameters
 * @param {Request} request: the request from which to extract the headers
 * @returns {Entry<string, PostmanHeader>?} the corresponding entry, if it exists
 */
methods.createHeader = function (api, request) {
  var headers = request.getIn(['parameters', 'headers']).map(function (header) {
    return methods.createHeaderFromParameterOrReference(api, header);
  }).filter(function (v) {
    return !!v;
  });

  if (!headers.size) {
    return null;
  }

  return { key: 'header', value: headers.valueSeq().toJS() };
};

/**
 * extracts content-type parameters from the headers of request
 * @param {Api} api: the api to use to resolve shared parameters
 * @param {Request} request: the request to get the content-type parameters from
 * @returns {List<Parameter>} the corresponding List of Content-Type Parameters
 */
methods.getContentTypeParamsFromHeaders = function (api, request) {
  var contentTypeHeaders = request.get('parameters').resolve(api.get('store')).get('headers').filter(function (header) {
    return header.get('key') === 'Content-Type';
  }).valueSeq().toList();

  return contentTypeHeaders;
};

/**
 * extracts content-type parameters from a context
 * @param {Context} context: the context to extract the content-type parameters from
 * @returns {List<Parameter>} the corresponding List of Content-Type Parameters
 */
methods.getContentTypeParamsFromContext = function (context) {
  return context.get('constraints').filter(function (param) {
    return param.get('key') === 'Content-Type' && param.get('in') === 'headers' && param.get('usedIn') === 'request';
  });
};

/**
 * extracts content-type parameters from a context, or from the headers of a request, if the context
 * does not exist
 * @param {Api} api: the api to use to resolve shared parameters
 * @param {Request} request: the request to get the headers from
 * @param {Context?} context: the context to extract content-type parameters from
 * @returns {List<Parameter>} the corresponding list of content-type Parameters
 */
methods.getContentTypeParamsFromRequestOrContext = function (api, request, context) {
  if (!context) {
    return methods.getContentTypeParamsFromHeaders(api, request);
  }

  return methods.getContentTypeParamsFromContext(context);
};

/**
 * extracts a postman body mode from the `default` field of a schema
 * @param {JSONSchema} schema: the schema to extract the body mode from
 * @returns {'urlencoded'|'formdata'|'raw'} the corresponding body mode
 */
methods.createBodyModeFromSchemaDefault = function (schema) {
  var modeMap = [{ key: 'application/x-www-form-urlencoded', value: 'urlencoded' }, { key: 'multipart/form-data', value: 'formdata' }];

  var mode = modeMap.filter(function (_ref8) {
    var key = _ref8.key;
    return schema.default.match(key);
  }).map(function (_ref9) {
    var value = _ref9.value;
    return value;
  })[0];

  return mode || 'raw';
};

/**
 * extracts a postman body mode from the `enum` field of a schema
 * @param {JSONSchema} schema: the schema to extract the body mode from
 * @returns {'urlencoded'|'formdata'|'raw'} the corresponding body mode
 */
methods.createBodyModeFromSchemaEnum = function (schema) {
  var modeMap = [{ key: 'application/x-www-form-urlencoded', value: 'urlencoded' }, { key: 'multipart/form-data', value: 'formdata' }];

  var mode = modeMap.filter(function (_ref10) {
    var key = _ref10.key;

    return schema.enum.filter(function (contentType) {
      return contentType.match(key);
    }).length > 0;
  }).map(function (_ref11) {
    var value = _ref11.value;
    return value;
  })[0];

  return mode || 'raw';
};

/**
 * extracts a postman body mode from a List of Content Type Parameters
 * @param {List<Parameter>} contentTypeParams: the List of Parameter from which to extract a body
 * mode
 * @returns {'urlencoded'|'formdata'|'raw'} the corresponding body mode
 */
methods.createBodyModeFromContentTypeParams = function (contentTypeParams) {
  if (contentTypeParams.size !== 1) {
    return 'raw';
  }

  var contentTypesConstraint = contentTypeParams.get(0);
  var contentTypeSchema = contentTypesConstraint.getJSONSchema();

  if (contentTypeSchema.default) {
    return methods.createBodyModeFromSchemaDefault(contentTypeSchema);
  }

  if (contentTypeSchema.enum) {
    return methods.createBodyModeFromSchemaEnum(contentTypeSchema);
  }

  return 'raw';
};

/**
 * extracts a PostmanBodyMode from a Context
 * @param {Api} api: the api to use to resolve shared parameters
 * @param {Request} request: the request from which to get the body parameters
 * @param {Context} context: the context from which to infer the body mode
 * @returns {'raw'|'formdata'|'urlencoded'} the corresponding body mode
 */
methods.createBodyMode = function (api, request, context) {
  var contentTypeParams = methods.getContentTypeParamsFromRequestOrContext(api, request, context);
  return methods.createBodyModeFromContentTypeParams(contentTypeParams);
};

/**
 * converts a Map of Body Parameters into a raw postman parameters string
 * @param {OrderedMap<string, Parameter>} params: the body parameters to convert into raw parameters
 * @returns {string} the corresponding raw parameters string
 */
methods.convertBodyParametersIntoRawParameters = function (params) {
  var rawBody = params.map(function (param) {
    if (param.get('key')) {
      return '{{' + param.get('key') + '}}';
    }

    return (0, _stringify2.default)(param.getJSONSchema(), null, 2);
  }).valueSeq().toJS().join('\n');

  return rawBody;
};

/**
 * extracts a PostmanRawBody entry from a request in a specific context
 * @param {OrderedMap<string, Parameter>} bodyParams: the body parameters to convert into raw
 * parameters
 * @returns {Entry<string, PostmanRawBody>?} the corresponding entry, if it exists
 */
methods.createBodyFromRawMode = function (bodyParams) {
  if (!bodyParams.size) {
    return null;
  }

  var rawBody = methods.convertBodyParametersIntoRawParameters(bodyParams);

  return { key: 'raw', value: rawBody };
};

/**
 * extracts a PostmanUrlEncodedBody entry from a request in a specific context
 * @param {OrderedMap<string, Parameter>} bodyParams: the body parameters to convert into
 * postman url-encoded parameters
 * @returns {Entry<string, PostmanUrlEncodedBody>?} the corresponding entry, if it exists
 */
methods.createBodyFromUrlEncodedMode = function (bodyParams) {
  var postmanParams = bodyParams.map(function (param) {
    return {
      key: param.get('key'),
      value: param.get('default') || '{{' + param.get('key') + '}}',
      enabled: true
    };
  }).valueSeq().toJS();

  return { key: 'urlencoded', value: postmanParams };
};

/**
 * extracts a PostmanFormDataBody entry from a request in a specific context
 * @param {OrderedMap<string, Parameter>} bodyParams: the body parameters to convert into
 * postman url-encoded parameters
 * @returns {Entry<string, PostmanFormDataBody>?} the corresponding entry, if it exists
 */
methods.createBodyFromFormDataMode = function (bodyParams) {
  var postmanParams = bodyParams.map(function (param) {
    return {
      key: param.get('key'),
      value: param.get('default') || '{{' + param.get('key') + '}}',
      enabled: true
    };
  }).valueSeq().toJS();

  return { key: 'formdata', value: postmanParams };
};

/**
 * extracts a PostmanModalBody entry from a request in a specific context and mode
 * @param {OrderedMap<string, Parameter>} bodyParams: the body parameters to convert into
 * postman modal parameters (e.g. depending on the mode, they are converted differently)
 * @param {string} mode: the mode in which the body should be formatted
 * @returns {Entry<string, PostmanModalBody>?} the corresponding entry, if it exists
 */
methods.createBodyFromMode = function (bodyParams, mode) {
  if (mode === 'raw') {
    return methods.createBodyFromRawMode(bodyParams);
  }

  if (mode === 'urlencoded') {
    return methods.createBodyFromUrlEncodedMode(bodyParams);
  }

  if (mode === 'formdata') {
    return methods.createBodyFromFormDataMode(bodyParams);
  }

  return null;
};

/**
 * prepares body parameters from a request based on a store and context
 * @param {Api} api: the api that holds the store used to resolve shared parameters
 * @param {Request} request: the request to extract the body parameters from
 * @param {Context?} context: the context to use to filter the body parameters
 * @returns {OrderedMap<string, Parameter>} the corresponding body parameters container block
 */
methods.getBodyParamsFromRequest = function (api, request, context) {
  var constraints = context ? context.get('constraints') : (0, _immutable.List)();
  var bodyParams = request.get('parameters').resolve(api.get('store')).filter(constraints).get('body');

  return bodyParams;
};

/**
 * extracts a PostmanBody entry from a request
 * @param {Api} api: the api to use to resolve shared parameters
 * @param {Request} request: the request from which to get the body parameters
 * @returns {Entry<string, PostmanBody>?} the corresponding entry, if it exists
 */
methods.createBody = function (api, request) {
  var context = request.get('contexts').get(0);
  var bodyParams = methods.getBodyParamsFromRequest(api, request, context);
  var mode = methods.createBodyMode(api, request, context);

  var kvs = [{ key: 'mode', value: mode }, methods.createBodyFromMode(bodyParams, mode)].filter(function (v) {
    return !!v;
  });

  if (kvs.length <= 1) {
    return null;
  }

  return { key: 'body', value: kvs.reduce(_fpUtils.convertEntryListInMap, {}) };
};

/**
 * extracts a PostmanRequest entry from a request
 * @param {Api} api: the api to use to resolve shared parameters
 * @param {Resource} resource: the resource to use to generate the url
 * @param {Request} request: the request from which to get the body parameters
 * @returns {Entry<string, PostmanRequest>?} the corresponding entry, if it exists
 */
methods.createRequestFromRequest = function (api, resource, request) {
  var kvs = [methods.createRequestUrl(api, resource, request), methods.createRequestAuth(api, request), methods.createMethod(request), methods.createHeader(api, request), methods.createBody(api, request)].filter(function (v) {
    return !!v;
  });

  if (!kvs.length) {
    return null;
  }

  return { key: 'request', value: kvs.reduce(_fpUtils.convertEntryListInMap, {}) };
};

/**
 * extracts a PostmanItem from a request
 * @param {Api} api: the api to use to resolve shared parameters
 * @param {Resource} resource: the resource to use to generate the url for the request associated
 * with this item
 * @param {Request} request: the request from which to get the body parameters
 * @returns {PostmanItem} the corresponding PostmanItem
 */
methods.createItemFromRequest = function (api, resource, request) {
  var kvs = [methods.createItemName(request), methods.createItemDescription(request), methods.createRequestFromRequest(api, resource, request)].filter(function (v) {
    return !!v;
  });

  return kvs.reduce(_fpUtils.convertEntryListInMap, {});
};

/**
 * extracts an array of PostmanItems from a resource
 * @param {Api} api: the api to use to resolve shared parameters
 * @param {Resource} resource: the resource to use to generate the PostmanItems
 * @returns {Array<PostmanItem>} the corresponding array of PostmanItems
 */
methods.createItemsFromResource = function (api, resource) {
  var items = resource.get('methods').map(function (request) {
    return methods.createItemFromRequest(api, resource, request);
  }).valueSeq().toJS();

  return items;
};

/**
 * creates an Item Name from a Resource
 * @param {Resource} resource: the resource to extract a name from
 * @returns {Entry<string, string>} the corresponding name, as an Entry
 */
methods.createItemNameFromResource = function (resource) {
  var name = resource.get('name') || resource.get('description') || resource.getIn(['path', 'pathname']).generate((0, _immutable.List)([':', '']));

  return { key: 'name', value: name };
};

/**
 * extracts a PostmanItemGroup entry from an Api and a resourceId
 * @param {Api} api: the api to use to resolve shared parameters
 * @param {string} id: the resourceId to use to resolve the resource in the Api
 * @returns {Entry<string, PostmanItemGroup>?} the corresponding entry, if it exists
 */
methods.createItemGroupFromResource = function (api, id) {
  var resource = api.getIn(['resources', id]);

  if (!resource) {
    return null;
  }

  var kvs = [methods.createItemNameFromResource(resource), methods.createItemDescription(resource), { key: 'item', value: methods.createItemsFromResource(api, resource) }].filter(function (v) {
    return !!v;
  });

  var result = kvs.reduce(_fpUtils.convertEntryListInMap, {});
  return result;
};

/**
 * extracts a PostmanItem property as an entry from an Api and a Group or a Resource
 * @param {Api} api: the api to use to resolve shared objects
 * @param {Group|Resource} groupOrResource: the group or resource to convert into a
 * PostmanItemGroup
 * @returns {Entry<string, PostmanItemGroup>} the corresponding entry, if it exists
 */
methods.createItemGroupFromGroupOrResource = function (api, groupOrResource) {
  if (groupOrResource instanceof _Group2.default) {
    return methods.createItemGroup(api, groupOrResource);
  }

  return methods.createItemGroupFromResource(api, groupOrResource);
};

/**
 * extracts a PostmanItem property as an entry from an Api and a Group
 * @param {Api} api: the api to use to resolve shared objects
 * @param {Group} group: the group from which to convert into a PostmanItemGroupProperty
 * @returns {Entry<string, PostmanItemGroupProperty>} the corresponding entry, if it exists
 */
methods.createItemProp = function (api, group) {
  var items = group.get('children').map(function (child) {
    return methods.createItemGroupFromGroupOrResource(api, child);
  }).filter(function (v) {
    return !!v;
  });

  return { key: 'item', value: items.valueSeq().toJS() };
};

/**
 * creates an PostmanItemGroup from an Api and a Group
 * @param {Api} api: the api to use to resolve shared objects
 * @param {Group} group: the group from which to convert into a PostmanItemGroup
 * @returns {Entry<string, PostmanItemGroup>} the corresponding entry
 */
methods.createItemGroup = function (api, group) {
  var kvs = [methods.createItemName(group), methods.createItemDescription(group), methods.createItemProp(api, group)].filter(function (v) {
    return !!v;
  });

  return kvs.reduce(_fpUtils.convertEntryListInMap, {});
};

/**
 * merges item groups that have the same name. This is done because there are no constraints on the
 * unicity of a Resource wrt to its name/description/path in Api.get('resources'). This unicity
 * principle would be violated by the Paw/Postman and curl parser otherwise
 * @param {Map<string, PostmanItemGroup>} namedMap: the accumulator map that is used to merge
 * item groups together
 * @param {PostmanItemGroup} itemGroup: the item group to merge or add to the accumulator
 * @returns {Map<string, PostmanItemGroup>} the updated accumulator
 */
methods.mergeItemGroupsWithSameName = function (namedMap, itemGroup) {
  var namedItemGroup = namedMap.get(itemGroup.name);
  if (namedItemGroup) {
    namedItemGroup.item = [].concat(namedItemGroup.item || [], itemGroup.item || []);
    return namedMap.set(itemGroup.name, namedItemGroup);
  }

  return namedMap.set(itemGroup.name, itemGroup);
};

/**
 * creates an PostmanRootItem from an Api
 * @param {Api} api: the api to use to extract groups
 * @returns {Entry<string, PostmanRootItem>} the corresponding entry
 */
methods.createRootItem = function (api) {
  var group = api.get('group');

  if (!group) {
    return { key: 'item', value: [] };
  }

  var items = api.get('resources').map(function (_, id) {
    return methods.createItemGroupFromResource(api, id);
  }).filter(function (v) {
    return !!v;
  }).reduce(methods.mergeItemGroupsWithSameName, (0, _immutable.Map)()).valueSeq().toJS();

  return { key: 'item', value: items };
};
/*
NOTE: This should be used once postman is capable of dealing with multiple nesting level
methods.createRootItem = (api) => {
  const group = api.get('group')

  if (!group) {
    return { key: 'item', value: [] }
  }

  return { key: 'item', value: [ methods.createItemGroup(api, group) ] }
}
*/

/**
 * converts a **shared** Parameter into a postman variable
 * @param {Parameter} param: the parameter to converts
 * @param {string} key: the key of the parameter in TypedStore that contains it (equals the uuid of
 * potential references to it)
 * @returns {PostmanVariable?} the corresponding postman variable, if it exists
 */
methods.convertParameterIntoVariable = function (param, key) {
  var kvs = [{ key: 'id', value: key }, { key: 'value', value: param.get('default') }, { key: 'type', value: param.get('type') }, { key: 'name', value: param.get('key') }].filter(function (_ref12) {
    var value = _ref12.value;
    return !!value;
  });

  if (!kvs.length) {
    return null;
  }

  return kvs.reduce(_fpUtils.convertEntryListInMap, {});
};

/**
 * creates an PostmanVariable from an Api
 * @param {Api} api: the api to use to resolve shared objects
 * @returns {Entry<string, PostmanVariable>?} the corresponding entry, if it exists
 */
methods.createVariable = function (api) {
  var sharedParams = api.getIn(['store', 'parameter']);

  if (!sharedParams.size) {
    return null;
  }

  var variables = sharedParams.map(methods.convertParameterIntoVariable).filter(function (v) {
    return !!v;
  }).valueSeq().toJS();

  if (!variables.length) {
    return null;
  }

  return { key: 'variable', value: variables };
};

/**
 * creates a PostmanCollection from an Api
 * @param {Api} api: the api to use to convert into a PostmanCollection
 * @returns {Entry<string, PostmanCollection>} the corresponding entry
 */
methods.createPostmanCollection = function (api) {
  var kvs = [methods.createInfo(api), methods.createRootItem(api), methods.createVariable(api)].filter(function (v) {
    return !!v;
  });

  return kvs.reduce(_fpUtils.convertEntryListInMap, {});
};

/**
 * serializes an Api into a Swagger formatted string
 * @param {Api} api: the api to convert
 * @returns {string} the corresponding swagger object, as a string
 */
methods.serialize = function (_ref13) {
  var api = _ref13.api;

  try {
    var postmanCollection = methods.createPostmanCollection(api);
    var serialized = (0, _stringify2.default)(postmanCollection, null, 2);
    return serialized;
  } catch (e) {
    throw e;
  }
};

var __internals__ = exports.__internals__ = methods;
exports.default = PostmanSerializer;
/* eslint-enable no-undefined */

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = __webpack_require__(52);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _apiFlowConfig = __webpack_require__(16);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var methods = {};

methods.extractVersion = function (version) {
  var vStripped = version[0] === 'v' ? version.slice(1) : version;

  var _vStripped$split = vStripped.split('.'),
      _vStripped$split2 = (0, _slicedToArray3.default)(_vStripped$split, 3),
      major = _vStripped$split2[0],
      minor = _vStripped$split2[1],
      patch = _vStripped$split2[2];

  var strippedPatch = (patch || '0').split('-')[0];

  return {
    major: parseInt(major || '0', 10),
    minor: parseInt(minor || '0', 10),
    patch: parseInt(strippedPatch || '0', 10)
  };
};

/* eslint-disable max-statements */
methods.getNewestSerializerByFormat = function (format) {
  var newest = _apiFlowConfig.serializers.filter(function (serializer) {
    return serializer.format === format;
  }).reduce(function (best, serializer) {
    var bestVersion = methods.extractVersion(best.version);
    var formatVersion = methods.extractVersion(serializer.version);

    if (bestVersion.major < formatVersion.major) {
      return serializer;
    }

    if (bestVersion.major > formatVersion.major) {
      return best;
    }

    if (bestVersion.minor < formatVersion.minor) {
      return serializer;
    }

    if (bestVersion.minor > formatVersion.minor) {
      return best;
    }

    if (bestVersion.patch < formatVersion.patch) {
      return serializer;
    }

    if (bestVersion.patch > formatVersion.patch) {
      return best;
    }
  }, { version: 'v0.0.0' })[0];

  if (newest.serialize) {
    return newest;
  }

  return null;
};
/* eslint-enable max-statements */

methods.getSerializerByFormatAndVersion = function (_ref) {
  var format = _ref.format,
      version = _ref.version;

  return _apiFlowConfig.serializers.filter(function (serializer) {
    return serializer.__meta__.format === format && serializer.__meta__.version === version;
  })[0] || null;
};

exports.default = methods;

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(102), __esModule: true };

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(104), __esModule: true };

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(107), __esModule: true };

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(109), __esModule: true };

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(112), __esModule: true };

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(114), __esModule: true };

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(50);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (obj, key, value) {
  if (key in obj) {
    (0, _defineProperty2.default)(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(20);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(28);
__webpack_require__(136);
module.exports = __webpack_require__(6).Array.from;

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(41);
__webpack_require__(28);
module.exports = __webpack_require__(134);

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(41);
__webpack_require__(28);
module.exports = __webpack_require__(135);

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(6);
module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
  return (core.JSON && core.JSON.stringify || JSON.stringify).apply(JSON, arguments);
};

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(138);
module.exports = __webpack_require__(6).Object.assign;

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(7);
module.exports = function create(P, D){
  return $.create(P, D);
};

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(7);
module.exports = function defineProperty(it, key, desc){
  return $.setDesc(it, key, desc);
};

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(7);
__webpack_require__(139);
module.exports = function getOwnPropertyNames(it){
  return $.getNames(it);
};

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(140);
module.exports = __webpack_require__(6).Object.getPrototypeOf;

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(141);
module.exports = __webpack_require__(6).Object.keys;

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(142);
module.exports = __webpack_require__(6).Object.setPrototypeOf;

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(65);
__webpack_require__(28);
__webpack_require__(41);
__webpack_require__(143);
module.exports = __webpack_require__(6).Promise;

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(144);
__webpack_require__(65);
module.exports = __webpack_require__(6).Symbol;

/***/ }),
/* 115 */
/***/ (function(module, exports) {

module.exports = function(){ /* empty */ };

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(24)
  , document = __webpack_require__(10).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var $ = __webpack_require__(7);
module.exports = function(it){
  var keys       = $.getKeys(it)
    , getSymbols = $.getSymbols;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = $.isEnum
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
  }
  return keys;
};

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

var ctx         = __webpack_require__(14)
  , call        = __webpack_require__(57)
  , isArrayIter = __webpack_require__(56)
  , anObject    = __webpack_require__(11)
  , toLength    = __webpack_require__(63)
  , getIterFn   = __webpack_require__(40);
module.exports = function(iterable, entries, fn, that){
  var iterFn = getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    call(iterator, f, step.value, entries);
  }
};

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(10).document && document.documentElement;

/***/ }),
/* 120 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(18);
module.exports = Array.isArray || function(arg){
  return cof(arg) == 'Array';
};

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $              = __webpack_require__(7)
  , descriptor     = __webpack_require__(38)
  , setToStringTag = __webpack_require__(25)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(35)(IteratorPrototype, __webpack_require__(9)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),
/* 123 */
/***/ (function(module, exports) {

module.exports = function(done, value){
  return {value: value, done: !!done};
};

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

var $         = __webpack_require__(7)
  , toIObject = __webpack_require__(26);
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(10)
  , macrotask = __webpack_require__(133).set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = __webpack_require__(18)(process) == 'process'
  , head, last, notify;

var flush = function(){
  var parent, domain, fn;
  if(isNode && (parent = process.domain)){
    process.domain = null;
    parent.exit();
  }
  while(head){
    domain = head.domain;
    fn     = head.fn;
    if(domain)domain.enter();
    fn(); // <- currently we use it only for Promise - try / catch not required
    if(domain)domain.exit();
    head = head.next;
  } last = undefined;
  if(parent)parent.enter();
};

// Node.js
if(isNode){
  notify = function(){
    process.nextTick(flush);
  };
// browsers with MutationObserver
} else if(Observer){
  var toggle = 1
    , node   = document.createTextNode('');
  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
  notify = function(){
    node.data = toggle = -toggle;
  };
// environments with maybe non-completely correct, but existent Promise
} else if(Promise && Promise.resolve){
  notify = function(){
    Promise.resolve().then(flush);
  };
// for other environments - macrotask based on:
// - setImmediate
// - MessageChannel
// - window.postMessag
// - onreadystatechange
// - setTimeout
} else {
  notify = function(){
    // strange IE + webpack dev server bug - use .call(global)
    macrotask.call(global, flush);
  };
}

module.exports = function asap(fn){
  var task = {fn: fn, next: undefined, domain: isNode && process.domain};
  if(last)last.next = task;
  if(!head){
    head = task;
    notify();
  } last = task;
};

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.1 Object.assign(target, source, ...)
var $        = __webpack_require__(7)
  , toObject = __webpack_require__(27)
  , IObject  = __webpack_require__(55);

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = __webpack_require__(23)(function(){
  var a = Object.assign
    , A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , $$    = arguments
    , $$len = $$.length
    , index = 1
    , getKeys    = $.getKeys
    , getSymbols = $.getSymbols
    , isEnum     = $.isEnum;
  while($$len > index){
    var S      = IObject($$[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  }
  return T;
} : Object.assign;

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(39);
module.exports = function(target, src){
  for(var key in src)redefine(target, key, src[key]);
  return target;
};

/***/ }),
/* 128 */
/***/ (function(module, exports) {

// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var core        = __webpack_require__(6)
  , $           = __webpack_require__(7)
  , DESCRIPTORS = __webpack_require__(22)
  , SPECIES     = __webpack_require__(9)('species');

module.exports = function(KEY){
  var C = core[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])$.setDesc(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = __webpack_require__(11)
  , aFunction = __webpack_require__(31)
  , SPECIES   = __webpack_require__(9)('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

/***/ }),
/* 131 */
/***/ (function(module, exports) {

module.exports = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(62)
  , defined   = __webpack_require__(33);
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

var ctx                = __webpack_require__(14)
  , invoke             = __webpack_require__(120)
  , html               = __webpack_require__(119)
  , cel                = __webpack_require__(116)
  , global             = __webpack_require__(10)
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listner = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(__webpack_require__(18)(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listner, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(11)
  , get      = __webpack_require__(40);
module.exports = __webpack_require__(6).getIterator = function(it){
  var iterFn = get(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(32)
  , ITERATOR  = __webpack_require__(9)('iterator')
  , Iterators = __webpack_require__(15);
module.exports = __webpack_require__(6).isIterable = function(it){
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    || Iterators.hasOwnProperty(classof(O));
};

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx         = __webpack_require__(14)
  , $export     = __webpack_require__(12)
  , toObject    = __webpack_require__(27)
  , call        = __webpack_require__(57)
  , isArrayIter = __webpack_require__(56)
  , toLength    = __webpack_require__(63)
  , getIterFn   = __webpack_require__(40);
$export($export.S + $export.F * !__webpack_require__(59)(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , $$      = arguments
      , $$len   = $$.length
      , mapfn   = $$len > 1 ? $$[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, $$len > 2 ? $$[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        result[index] = mapping ? mapfn(O[index], index) : O[index];
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(115)
  , step             = __webpack_require__(123)
  , Iterators        = __webpack_require__(15)
  , toIObject        = __webpack_require__(26);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(58)(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(12);

$export($export.S + $export.F, 'Object', {assign: __webpack_require__(126)});

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 Object.getOwnPropertyNames(O)
__webpack_require__(37)('getOwnPropertyNames', function(){
  return __webpack_require__(54).get;
});

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = __webpack_require__(27);

__webpack_require__(37)('getPrototypeOf', function($getPrototypeOf){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(27);

__webpack_require__(37)('keys', function($keys){
  return function keys(it){
    return $keys(toObject(it));
  };
});

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(12);
$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(60).set});

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $          = __webpack_require__(7)
  , LIBRARY    = __webpack_require__(36)
  , global     = __webpack_require__(10)
  , ctx        = __webpack_require__(14)
  , classof    = __webpack_require__(32)
  , $export    = __webpack_require__(12)
  , isObject   = __webpack_require__(24)
  , anObject   = __webpack_require__(11)
  , aFunction  = __webpack_require__(31)
  , strictNew  = __webpack_require__(131)
  , forOf      = __webpack_require__(118)
  , setProto   = __webpack_require__(60).set
  , same       = __webpack_require__(128)
  , SPECIES    = __webpack_require__(9)('species')
  , speciesConstructor = __webpack_require__(130)
  , asap       = __webpack_require__(125)
  , PROMISE    = 'Promise'
  , process    = global.process
  , isNode     = classof(process) == 'process'
  , P          = global[PROMISE]
  , empty      = function(){ /* empty */ }
  , Wrapper;

var testResolve = function(sub){
  var test = new P(empty), promise;
  if(sub)test.constructor = function(exec){
    exec(empty, empty);
  };
  (promise = P.resolve(test))['catch'](empty);
  return promise === test;
};

var USE_NATIVE = function(){
  var works = false;
  function P2(x){
    var self = new P(x);
    setProto(self, P2.prototype);
    return self;
  }
  try {
    works = P && P.resolve && testResolve();
    setProto(P2, P);
    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
    // actual Firefox has broken subclass support, test that
    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
      works = false;
    }
    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
    if(works && __webpack_require__(22)){
      var thenableThenGotten = false;
      P.resolve($.setDesc({}, 'then', {
        get: function(){ thenableThenGotten = true; }
      }));
      works = thenableThenGotten;
    }
  } catch(e){ works = false; }
  return works;
}();

// helpers
var sameConstructor = function(a, b){
  // library wrapper special case
  if(LIBRARY && a === P && b === Wrapper)return true;
  return same(a, b);
};
var getConstructor = function(C){
  var S = anObject(C)[SPECIES];
  return S != undefined ? S : C;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var PromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve),
  this.reject  = aFunction(reject)
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(record, isReject){
  if(record.n)return;
  record.n = true;
  var chain = record.c;
  asap(function(){
    var value = record.v
      , ok    = record.s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , result, then;
      try {
        if(handler){
          if(!ok)record.h = true;
          result = handler === true ? value : handler(value);
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    chain.length = 0;
    record.n = false;
    if(isReject)setTimeout(function(){
      var promise = record.p
        , handler, console;
      if(isUnhandled(promise)){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      } record.a = undefined;
    }, 1);
  });
};
var isUnhandled = function(promise){
  var record = promise._d
    , chain  = record.a || record.c
    , i      = 0
    , reaction;
  if(record.h)return false;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var $reject = function(value){
  var record = this;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  record.v = value;
  record.s = 2;
  record.a = record.c.slice();
  notify(record, true);
};
var $resolve = function(value){
  var record = this
    , then;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  try {
    if(record.p === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      asap(function(){
        var wrapper = {r: record, d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      record.v = value;
      record.s = 1;
      notify(record, false);
    }
  } catch(e){
    $reject.call({r: record, d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  P = function Promise(executor){
    aFunction(executor);
    var record = this._d = {
      p: strictNew(this, P, PROMISE),         // <- promise
      c: [],                                  // <- awaiting reactions
      a: undefined,                           // <- checked in isUnhandled reactions
      s: 0,                                   // <- state
      d: false,                               // <- done
      v: undefined,                           // <- value
      h: false,                               // <- handled rejection
      n: false                                // <- notify
    };
    try {
      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
    } catch(err){
      $reject.call(record, err);
    }
  };
  __webpack_require__(127)(P.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction = new PromiseCapability(speciesConstructor(this, P))
        , promise  = reaction.promise
        , record   = this._d;
      reaction.ok   = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      record.c.push(reaction);
      if(record.a)record.a.push(reaction);
      if(record.s)notify(record, false);
      return promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: P});
__webpack_require__(25)(P, PROMISE);
__webpack_require__(129)(PROMISE);
Wrapper = __webpack_require__(6)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = new PromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (!USE_NATIVE || testResolve(true)), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof P && sameConstructor(x.constructor, this))return x;
    var capability = new PromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(59)(function(iter){
  P.all(iter)['catch'](function(){});
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = getConstructor(this)
      , capability = new PromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject
      , values     = [];
    var abrupt = perform(function(){
      forOf(iterable, false, values.push, values);
      var remaining = values.length
        , results   = Array(remaining);
      if(remaining)$.each.call(values, function(promise, index){
        var alreadyCalled = false;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled = true;
          results[index] = value;
          --remaining || resolve(results);
        }, reject);
      });
      else resolve(results);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = getConstructor(this)
      , capability = new PromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var $              = __webpack_require__(7)
  , global         = __webpack_require__(10)
  , has            = __webpack_require__(34)
  , DESCRIPTORS    = __webpack_require__(22)
  , $export        = __webpack_require__(12)
  , redefine       = __webpack_require__(39)
  , $fails         = __webpack_require__(23)
  , shared         = __webpack_require__(61)
  , setToStringTag = __webpack_require__(25)
  , uid            = __webpack_require__(64)
  , wks            = __webpack_require__(9)
  , keyOf          = __webpack_require__(124)
  , $names         = __webpack_require__(54)
  , enumKeys       = __webpack_require__(117)
  , isArray        = __webpack_require__(121)
  , anObject       = __webpack_require__(11)
  , toIObject      = __webpack_require__(26)
  , createDesc     = __webpack_require__(38)
  , getDesc        = $.getDesc
  , setDesc        = $.setDesc
  , _create        = $.create
  , getNames       = $names.get
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , setter         = false
  , HIDDEN         = wks('_hidden')
  , isEnum         = $.isEnum
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , useNative      = typeof $Symbol == 'function'
  , ObjectProto    = Object.prototype;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(setDesc({}, 'a', {
    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = getDesc(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  setDesc(it, key, D);
  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
} : setDesc;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol.prototype);
  sym._k = tag;
  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    }
  });
  return sym;
};

var isSymbol = function(it){
  return typeof it == 'symbol';
};

var $defineProperty = function defineProperty(it, key, D){
  if(D && has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return setDesc(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key);
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
    ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  var D = getDesc(it = toIObject(it), key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
  return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
  return result;
};
var $stringify = function stringify(it){
  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
  var args = [it]
    , i    = 1
    , $$   = arguments
    , replacer, $replacer;
  while($$.length > i)args.push($$[i++]);
  replacer = args[1];
  if(typeof replacer == 'function')$replacer = replacer;
  if($replacer || !isArray(replacer))replacer = function(key, value){
    if($replacer)value = $replacer.call(this, key, value);
    if(!isSymbol(value))return value;
  };
  args[1] = replacer;
  return _stringify.apply($JSON, args);
};
var buggyJSON = $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
});

// 19.4.1.1 Symbol([description])
if(!useNative){
  $Symbol = function Symbol(){
    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
  };
  redefine($Symbol.prototype, 'toString', function toString(){
    return this._k;
  });

  isSymbol = function(it){
    return it instanceof $Symbol;
  };

  $.create     = $create;
  $.isEnum     = $propertyIsEnumerable;
  $.getDesc    = $getOwnPropertyDescriptor;
  $.setDesc    = $defineProperty;
  $.setDescs   = $defineProperties;
  $.getNames   = $names.get = $getOwnPropertyNames;
  $.getSymbols = $getOwnPropertySymbols;

  if(DESCRIPTORS && !__webpack_require__(36)){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }
}

var symbolStatics = {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    return keyOf(SymbolRegistry, key);
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
};
// 19.4.2.2 Symbol.hasInstance
// 19.4.2.3 Symbol.isConcatSpreadable
// 19.4.2.4 Symbol.iterator
// 19.4.2.6 Symbol.match
// 19.4.2.8 Symbol.replace
// 19.4.2.9 Symbol.search
// 19.4.2.10 Symbol.species
// 19.4.2.11 Symbol.split
// 19.4.2.12 Symbol.toPrimitive
// 19.4.2.13 Symbol.toStringTag
// 19.4.2.14 Symbol.unscopables
$.each.call((
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
  'species,split,toPrimitive,toStringTag,unscopables'
).split(','), function(it){
  var sym = wks(it);
  symbolStatics[it] = useNative ? sym : wrap(sym);
});

setter = true;

$export($export.G + $export.W, {Symbol: $Symbol});

$export($export.S, 'Symbol', symbolStatics);

$export($export.S + $export.F * !useNative, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return punycode;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(151)(module), __webpack_require__(150)))

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(146);
exports.encode = exports.stringify = __webpack_require__(147);


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};


/***/ }),
/* 150 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 151 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _stringify = __webpack_require__(29);

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

var _class, _class2, _temp;

var _PawShims = __webpack_require__(42);

var _apiFlowConfig = __webpack_require__(16);

var _apiFlow = __webpack_require__(67);

var _apiFlow2 = _interopRequireDefault(_apiFlow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SwaggerGenerator = (0, _PawShims.registerCodeGenerator)(_class = (_temp = _class2 = function () {
  function SwaggerGenerator() {
    (0, _classCallCheck3.default)(this, SwaggerGenerator);
  }

  (0, _createClass3.default)(SwaggerGenerator, [{
    key: 'generate',


    /* eslint-disable no-unused-vars */
    value: function generate(context, reqs, opts) {
      /* eslint-enable no-unused-vars */
      try {
        var options = { context: context, reqs: reqs, source: { format: 'paw', version: 'v3.0' }, target: _apiFlowConfig.target };
        var serialized = _apiFlow2.default.serialize(_apiFlow2.default.parse({ options: options }));
        return serialized;
      } catch (e) {
        /* eslint-disable no-console */
        console.error(this.constructor.title, 'generation failed with error:', e, e.stack, (0, _stringify2.default)(e, null, '  '));
        /* eslint-enable no-console */
        throw e;
      }
    }
  }]);
  return SwaggerGenerator;
}(), _class2.identifier = _apiFlowConfig.target.identifier, _class2.title = _apiFlowConfig.target.humanTitle, _class2.help = 'https://github.com/luckymarmot/API-Flow', _class2.languageHighlighter = 'json', _class2.fileExtension = 'json', _temp)) || _class;

exports.default = SwaggerGenerator;

/***/ })
/******/ ]);
});