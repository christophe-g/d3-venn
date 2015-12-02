/**
 * getSet creates a getter/setter function for a re-usable D3.js component. 
 *
 * @method getSet
 * @param  {string}   option    - the name of the object in the string you want agetter/setter for.
 * @param  {function} component - the D3 component this getter/setter relates to.
 *
 * @return {mixed} The value of the option or the component.
 */

function getSet(option, component) {
  return function(_) {
    if (! arguments.length) {
      return this[option];
    }

    this[option] = _;

    return component;
  };
};

export default getSet;