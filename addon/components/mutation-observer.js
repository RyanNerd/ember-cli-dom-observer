import Ember from 'ember';
import layout from '../templates/components/mutation-observer';

export default Ember.Component.extend(
{
  layout: layout,

  /**
   * Set to true if additions and removals of the target node's child elements (including text nodes) are to be observed.
   * @property bool
   */
  childList: false,

  /**
   * Set to true if mutations to target's attributes are to be observed.
   * @property bool
   */
  attributes: false,

  /**
   * Set to true if mutations to target's data are to be observed.
   * @property bool
   */
  characterData: false,

  /**
   * Set to true if mutations to target and target's descendants are to be observed.
   * @property: bool
   */
  subtree: false,

  /**
   * Set to true if attributes is set to true and target's attribute value before the mutation needs to be recorded.
   * @property bool
   */
  attributeOldValue: false,

  /**
   * Set to true if characterData is set to true and target's data before the mutation needs to be recorded.
   * @property bool
   */
  characterDataOldValue: false,

  /**
   * Set to an array of attribute local names (without namespace) if not all attribute mutations need to be observed.
   * @property JSON.string - passed in as a JSON string (e.g. '["one","two"]')
   */
  attributeFilter: [],

  /**
   * @protected
   * @property MutationObserver | null
   */
  _mutationObserver: null,

  /**
   * Component constructor
   */
  init()
  {
    this._super(...arguments);

    // Get the MutationObserver class.
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    //Instantiate a MutationObserver object and apply the mutation handler as an action.
    let self = this;
    this._mutationObserver = new MutationObserver(mutations =>
    {
      self.send('handleMutations', mutations);
    });
  },

  /**
   * Fires when component is injected into the DOM.
   */
  didInsertElement()
  {
    // Get this component DIV element.
    let elementId = this.get('elementId');
    let ownElement = document.getElementById(elementId);

    // Get the first child element in the component.
    let firstChild = ownElement.firstElementChild;

    // Do we have a child element?
    if (firstChild) {
      // Special handling for the attributeFilter property
      let attributeFilterArray = [];
      let attributeFilter = this.get('attributeFilter');

      // Is the attributeFilter specified?
      if (attributeFilter && attributeFilter.length !== 0) {
        // Is it a string? If so then treat it as a JSON array string.
        if (Ember.typeOf(attributeFilter) === 'string') {
          attributeFilterArray = JSON.parse(attributeFilter);
        }
      }

      // Get the configuration properties as set by our component.
      let config = {
        childList: this.get('childList'),
        attributes: this.get('attributes'),
        characterData: this.get('characterData'),
        subtree: this.get('subtree'),
        attributeOldValue: this.get('attributeOldValue'),
        characterDataOldValue: this.get('characterDataOldValue'),
        attributeFilter: attributeFilterArray
      };

      /**
       * Validate the configuration object.
       * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
       */
      let isValidConfig = config.childList || config.attributes || config.characterData;
      Ember.assert('At the very least, childList, attributes, or characterData must be set to true.', isValidConfig);

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
    if (this._mutationObserver !== null) {
      this._mutationObserver.disconnect();
    }
    this.set('_mutationObserver', null);
  },

  actions:
  {
    /**
     * Action delegate called to handle mutation events
     * @param mutations
     */
    handleMutations(mutations)
    {
      this.sendAction('handleMutations', mutations);
    }
  }
});
