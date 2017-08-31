import Ember from 'ember';
import layout from '../templates/components/example-mutation';

export default Ember.Component.extend(
{
  layout: layout,

  width: null,
  styleAttribute: null,

  actions:
  {
    /**
     * MutationObserver callback handler
     *
     * @param {MutationRecord[]} mutations
     * @param {MutationObserver} observer
     */
    handleMutations(mutations, observer)
    {
      let self = this;
      mutations.forEach(function (mutation) {
        // Is the change to the element is a change in the observed attribute?
        if (mutation.type === 'attributes') {
          // Get the style attribute for the element
          let target = mutation.target;
          let styleAttribute = target.getAttribute('style');
          self.set('styleAttribute', styleAttribute);

          // Get the width from the style attribute
          let widthString = window.getComputedStyle(target).getPropertyValue('width');
          let width = parseFloat(widthString);
          self.set('width', width);

          // Is the width of the element is less than 250px and the backgroundColor is blue?
          if (width <= 250 && target.style.backgroundColor === "blue") {
            target.style.backgroundColor = "";
          }

          // Is the width of element more than 250px?
          if (width > 250) {
            /**
             * We have an issue here with Firefox where if you try and change the attribute of an element in the
             * MutationObserver callback Firefox will hang.
             *
             * @see https://jsfiddle.net/RyanNerd/60xw1mbd/6/ - for a non-Ember demonstration of this FF bug.
             */
            if (navigator.userAgent.search("Firefox") > -1) {
              alert('Firefox hangs if we change attributes while in a mutation handler. So we MUST disconnect from the observer.');
              observer.disconnect();
            }

            target.style.backgroundColor = "blue";
          }

          // If the width of the element is more than 300 then prevent the user from increasing the width.
          if (width > 300) {
            target.style.width = "300px";
          }
        }

        // Is the observed element change of the childList type?
        if (mutation.type === 'childList') {
          // Get the innterHTML values from the element's children nodes into and array.
          let target = mutation.target;
          let list = [].slice.call(target.children).map(function (node)
          {
            return (Ember.isBlank(node.innerHTML)) ? '(empty)' : node.innerHTML;
          });

          // If the change is not an "empty" node then set the itemList[] property so that handlebars can display it.
          if (list.length !== 0 && list[0] !== '(empty)') {
            self.set('itemList', list);
          }
        }
      });
    }
  }
});
