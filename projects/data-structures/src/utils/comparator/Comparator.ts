export default class Comparator {
    compare
    /**
     * Constructor.
     * @param {function(a: *, b: *)} [compareFunction] - It may be custom compare function that, let's
     * say may compare custom objects together.
     */
    constructor(compareFunction = null) {
      this.compare = compareFunction || Comparator.defaultCompareFunction;
    }
  
    /**
     * Default comparison function. It just assumes that "a" and "b" are strings or numbers.
     * @param {(string|number)} a
     * @param {(string|number)} b
     * @returns {number}
     */
    static defaultCompareFunction(a: string | number, b: string | number) {
      if (a === b) {
        return 0;
      }
  
      return a < b ? -1 : 1;
    }
  
    /**
     * Checks if two variables are equal.
     * @param {*} a
     * @param {*} b
     * @return {boolean}
     */
    equal(a: any, b: any) {
      return this.compare(a, b) === 0;
    }
  
    /**
     * Checks if variable "a" is less than "b".
     * @param {*} a
     * @param {*} b
     * @return {boolean}
     */
    lessThan(a: any, b: any) {
      return this.compare(a, b) < 0;
    }
  
    /**
     * Checks if variable "a" is greater than "b".
     * @param {*} a
     * @param {*} b
     * @return {boolean}
     */
    greaterThan(a: any, b: any) {
      return this.compare(a, b) > 0;
    }
  
    /**
     * Checks if variable "a" is less than or equal to "b".
     * @param {*} a
     * @param {*} b
     * @return {boolean}
     */
    lessThanOrEqual(a: any, b: any) {
      return this.lessThan(a, b) || this.equal(a, b);
    }
  
    /**
     * Checks if variable "a" is greater than or equal to "b".
     * @param {*} a
     * @param {*} b
     * @return {boolean}
     */
    greaterThanOrEqual(a: any, b: any) {
      return this.greaterThan(a, b) || this.equal(a, b);
    }
  
    /**
     * Reverses the comparison order.
     */
    reverse() {
      const compareOriginal = this.compare;
      this.compare = (a: any, b: any) => compareOriginal(b, a);
    }
  }
  