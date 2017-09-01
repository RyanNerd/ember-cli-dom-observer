import Ember from 'ember';
import layout from '../templates/components/mutation-observer';

const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

export default Ember.Component.extend(
{
  layout: layout,

  /**
   * Set to true if additions and removals of the target node's child elements (including text nodes) are to be observed.
   * @public
   * @property {boolean}
   */
  childList: false,

  /**
   * Set to true if mutations to target's attributes are to be observed.
   * @public
   * @property {boolean}
   */
  attributes: false,

  /**
   * Set to true if mutations to target's data are to be observed.
   * @public
   * @property {boolean}
   */
  characterData: false,

  /**
   * Set to true if mutations to target and target's descendants are to be observed.
   * @public
   * @property: {boolean}
   */
  subtree: false,

  /**
   * Set to true if attributes is set to true and target's attribute value before the mutation needs to be recorded.
   * @public
   * @property {boolean}
   */
  attributeOldValue: false,

  /**
   * Set to true if characterData is set to true and target's data before the mutation needs to be recorded.
   * @public
   * @property {boolean}
   */
  characterDataOldValue: false,

  /**
   * Set to an array of attribute local names (without namespace) if not all attribute mutations need to be observed.
   * @public
   * @property {string} - JSON array as a string (e.g. '["disabled","style"]')
   */
  attributeFilter: [],

  /**
   * Set this to the id of the element that should be observed.
   * @public
   * @property {string | null}
   */
  targetId: null,

  /**
   * @protected
   * @property MutationObserver
   */
  _mutationObserver: null,

  /**
   * Set up a new MutationObserver instance and establish a callback action for DOM change events.
   */
  init()
  {
    this._super(...arguments);

    let self = this;
    this.set('_mutationObserver', new MutationObserver(function(mutations, observer)
    {
      self.send('handleMutations', mutations, observer);
    }));
  },

  /**
   * Fires when component is injected into the DOM.
   */
  didInsertElement()
  {
    /**
     * @type {Node}
     * @description The target element to be observed.
     */
    let firstChild;

    // If a targetId is indicated then use this to find the element to observe,
    // otherwise use the first element contained in this component.
    let targetId = this.get('targetId');
    if (!Ember.isEmpty(targetId)) {
      firstChild = document.getElementById(targetId);
    } else {
      // Get this components DIV element.
      let ownElement = document.getElementById(this.get('elementId'));

      // Get the first child element contained in the component.
      firstChild = ownElement.firstElementChild;
    }

    Ember.assert('mutation-observer: Unable to find target element', !Ember.isEmpty(firstChild));

    // Do we have a target element?
    if (firstChild) {
      // Special handling is needed if attributes property is true.
      let attributesFlag = this.get('attributes');

      // Get the configuration properties as set by our component.
      let config = {
        childList: this.get('childList'),
        attributes: attributesFlag,
        characterData: this.get('characterData'),
        subtree: this.get('subtree'),
        attributeOldValue: this.get('attributeOldValue'),
        characterDataOldValue: this.get('characterDataOldValue'),
      };

      // Special handling for the attributeFilter property is needed if this.attributes is true
      if (attributesFlag) {
        let attributeFilter = this.get('attributeFilter');

        // Is the attributeFilter specified?
        if (attributeFilter && attributeFilter.length !== 0) {
          // Is it a string? If so then treat it as a JSON array string.
          if (Ember.typeOf(attributeFilter) === 'string') {
            config.attributeFilter = JSON.parse(attributeFilter);
          }
        }
        Ember.assert('mutation-observer: Invalid attributeFilter. Must be a string formatted as a JSON array.', !Ember.isEmpty(config.attributeFilter));
      }

      /**
       * Validate the configuration object.
       * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
       */
      let isValidConfig = config.childList || config.attributes || config.characterData;
      Ember.assert('mutation-observer: At the very least, childList, attributes, or characterData must be set to true.', isValidConfig);

      // Are the config properties valid?
      if (isValidConfig) {
        // Hook the child element to the mutation observer.
        this._mutationObserver.observe(firstChild, config);
      }
    }
  },

  /**
   * If we have an existing mutationObserver object then disconnect any observers.
   */
  willDestroy()
  {
    let mutationObserver = this.get('_mutationObserver');
    if (mutationObserver !== null) {
      mutationObserver.disconnect();
    }
    this.set('_mutationObserver', null);
  },

  actions:
  {
    /**
     * Action delegate called to handle mutation events
     *
     * @param {MutationRecord[]} mutations
     * @param {MutationObserver} observer
     */
    handleMutations(mutations, observer)
    {
      this.sendAction('handleMutations', mutations, observer);
    }
  }
});
