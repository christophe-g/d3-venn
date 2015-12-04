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
}

function applier(component, options) {
	for (var key in options) {
        if(component[key] && (typeof component[key] == "function")) {
            component[key](options[key]);
        }
    }
    return component;
}

function binder(component, options) {
	for (var key in options) {
        if(!component[key]) {
            component[key] = getSet(key, component).bind(options);
        }
    }
}

export {binder, applier};