import Ember from 'ember';
import layout from '../templates/components/mutation-observer';

/**
 * @constant
 * @type {MutationObserver}
 * @default
 */
const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

export default Ember.Component.extend(
{
  layout: layout,

  /**
   * Set to true if additions and removals of the target node's child elements are to be observed.
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
   * @property {boolean}
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
   * @property {string | null} - JSON array as a string (e.g. '["disabled","style"]')
   */
  attributeFilter: null,

  /**
   * Set this to the id of the element that should be observed.
   * @public
   * @property {string | null}
   */
  targetId: null,

  /**
   * @protected
   * @property {MutationObserver}
   */
  _mutationObserver: null,

  /**
   * @protected
   * @property {Element}
   */
  _targetElement: null,

  /**
   * Set up a new MutationObserver instance and establish a callback action for DOM change events.
   * @throws {Ember.assert}
   */
  init()
  {
    this._super(...arguments);

    try {
      let self = this;

      /**
       * @param {MutationRecord[]} mutations
       * @callback this.actions.handleMutations()
       */
      this.set('_mutationObserver', new MutationObserver(function(mutations)
      {
        self.send('handleMutations', mutations, self.get('_mutationObserver'));
      }));
    } catch(e) {
      Ember.assert('mutation-observer: ' + e.message, false);
    }
  },

  /**
   * Fires when component is injected into the DOM.
   * @throws {Ember.assert}
   */
  didInsertElement()
  {
    /**
     * @type {Element}
     * @description The target element to be observed.
     */
    let targetElement;

    /**
     * If a targetId is indicated then use this to find the element to observe,
     * otherwise use the first element contained in this component.
     * @type {string | null} - The element Id of the target or null if not specified.
     */
    let targetId = this.get('targetId');
    if (!Ember.isEmpty(targetId)) {
      targetElement = document.getElementById(targetId);
    } else {
      /**
       * Get this components DIV element.
       * @type {Element}
       */
      let ownElement = document.getElementById(this.get('elementId'));

      // Get the first child element contained in the component.
      targetElement = ownElement.firstElementChild;
    }

    Ember.assert('mutation-observer: Unable to find target element.', !Ember.isEmpty(targetElement));

    // Do we have a target element?
    if (targetElement && targetElement.nodeType === 1) {
      /**
       * Cache the attributes property.
       * @type {boolean}
       */
      let attributesFlag = this.get('attributes');

      /**
       * Set the configuration object as indicated by the properties of the component.
       * @typedef {object} config
       * @property {boolean} childList
       * @property {boolean} attributes
       * @property {boolean} characterData
       * @property {boolean} subtree
       * @property {boolean} attributeOldValue
       * @property {boolean} characterDataOldValue
       * @property {string[]} attributeFilter
       */
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
        /**
         * Get the attributeFilter property.
         * @type {string | null}
         */
        let attributeFilter = this.get('attributeFilter');

        // Is the attributeFilter specified?
        if (attributeFilter !== null) {
          // Is it a string? If so then treat it as a JSON array string.
          if (Ember.typeOf(attributeFilter) === 'string') {
            config.attributeFilter = JSON.parse(attributeFilter);
          }

          Ember.assert('mutation-observer: Invalid attributeFilter property value.',
            Ember.typeOf(config.attributeFilter) === 'array' && attributeFilter.length > 0);

        }
      }

      /**
       * Validate the configuration object.
       * @type {boolean}
       */
      let isValidConfig = config.childList || config.attributes || config.characterData;

      Ember.assert('mutation-observer: At the very least, childList, attributes, or characterData must be set to true.',
        isValidConfig);

      // Are the config properties valid?
      if (isValidConfig) {
        // Hook the child element to the mutation observer.
        try {
          this.get('_mutationObserver').observe(targetElement, config);
        } catch(e) {
          Ember.assert('mutation-observer: ' + e.message, false);
        }
      }
    }
  },

  /**
   * Fires before this component is removed from the DOM.
   * @throws {Ember.assert}
   */
  willDestroy()
  {
    try {
      /**
       * @type {MutationObserver | null}
       */
      let mutationObserver = this.get('_mutationObserver');

      // Is the Mutation Observer object set for this component?
      if (mutationObserver !== null) {
        // stop observing mutations.
        mutationObserver.disconnect();
      }

      // Release the Mutation Observer instance.
      this.set('_mutationObserver', null);
    } catch(e) {
      Ember.assert('mutation-observer: ' + e.message, false);
    }
  },

  actions:
  {
    /**
     * Action delegate called to handle mutation events.
     * @callback
     * @param {MutationRecord[]} mutations
     * @param {MutationObserver} observer
     */
    handleMutations(mutations, observer)
    {
      // Bubble the action up.
      this.sendAction('handleMutations', mutations, observer);
    }
  }
});
