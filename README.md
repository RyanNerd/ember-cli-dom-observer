# ember-cli-dom-observer

Implementation of [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) / [DOM Mutation Observers](http://dom.spec.whatwg.org/#mutation-observers) as an Ember component.

Uses
----
* Browser extensions - You've created a [browser extension in Ember](https://www.youtube.com/watch?v=NtkpDL2yKGo) and 
  need to monitor changes to the DOM to trigger your extension. 
* Overcome HTML shortcomings by allowing you to monitor changes to attributes, elements
  and nodes (**anything** in the DOM).
* Hook into 3rd party components that you are otherwise unable to see changes that these components make to the 
  DOM (e.g. Jquery Addon).
* Troubleshooting - Examine misbehaving components as they change within the DOM.

Features
--------
* **Fast** DOM change event capture.
* Capture snapshot DOM change comparison events for specific elements.
* Any DOM change can be captured including very complex events.
* Finite control allowing you to select what elements are observed and what changes to monitor.

How does this work?
-------------------
By using the Ember component methodology to _wrap_ a
[MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) around 
an HTML element (see example code below).

Further information on MutationObserver can be found in these excellent blog posts:
- [Overview](http://updates.html5rocks.com/2012/02/Detect-DOM-changes-with-Mutation-Observers)
- [In-depth](http://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/)
- [Screencast](http://www.youtube.com/watch?v=eRZ4pO0gVWw)

 
## Addon Installation

* `ember install ember-cli-dom-observer`

## Requirements
* Ember 2.14 
  - Older Ember 2.x versions may work but this component has not been used/tested with previous versions.
  - If you are using Ember 1.x or your version of Ember does not work with this component
    then use [this](https://github.com/topaxi/ember-mutation-observer) Addon instead.
* Only works with [modern web browsers](http://caniuse.com/#search=mutationobserver)
  - Chrome 49+
  - Edge 14+
  - Firefox 52+
  - IE 11
  - Opera 46+
  - Safari 10.1+

## Addon Usage

```handlebars
{{#mutation-observer
    handleMutations=(action "handleMutations")
    attributes=true
    childList=true
    characterData=true
    subtree=true
    attributeFilter='["JSON","string","array"]'
}}
  <ol contenteditable>
    <li>Click here and press enter</li>
  </ol>
{{/mutation-observer}}
```

```ecmascript 6
  import Ember from 'ember';
  export default Ember.Component.extend({

  actions: 
  {
    /**
     * MutationObserver triggered events action handler
     * 
     * @param {MutationRecord[]} mutationRecords The triggered mutation records
     */
    handleMutations(mutationRecords) {
      // Do something with mutation records
    }
  }
})
```

In the example above [MutationRecords](https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord)
will be sent to the handleMutations() action function
when any changes (e.g. new `<LI>` node was added) to the ordered list occur.

## Installation

* `git clone https://github.com/RyanNerd/ember-cli-dom-observer.git` 
* `npm install` or `yarn install`

## Running Example

* `ember server`
* Go to http://localhost:4200 in your web browser.

## Installation

* `git clone https://github.com/RyanNerd/ember-cli-dom-observer`
* `cd ember-cli-dom-observer`
* `npm install`

## TODO
* Add property to indicate a target element via element id.
* Create meaningful unit tests.
