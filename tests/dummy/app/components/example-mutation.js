import { isBlank } from '@ember/utils';
import Component from '@ember/component';
import layout from '../templates/components/example-mutation';

export default Component.extend(
{
  layout: layout,

  width: null,
  styleAttribute: null,
  buttonText: null,

  actions:
  {
    /**
     * MutationObserver callback handler
     * We use the same handleMutations() action for both the textarea and ordered list elements.
     * This is bad practice and is done this way only to show it is possible.
     * The README and wiki docs note that this is bad practice.
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

            // Throw away queued mutation records to prevent recursion (only a problem in Firefox) but best practice
            // when changing attributes in the call back function that is observing changes to attributes.
            observer.takeRecords();
          }

          // Is the width of element more than 250px?
          if (width > 250) {
            /**
             * We have an issue here with Firefox where if you try and change the attribute of an element in the
             * MutationObserver callback Firefox will hang.
             *
             * @see https://jsfiddle.net/RyanNerd/60xw1mbd/6/ - for a non-Ember demonstration of this FF bug.
             *
             * Workaround for FF hanging is to empty the queued observer events via takeRecords()
             */
              target.style.backgroundColor = "blue";

              // Throw away queued mutation records to prevent recursion (only a problem in Firefox) but best practice
              // when changing attributes in the call back function that is observing changes to attributes.
              observer.takeRecords();
          }

          // If the width of the element is more than 300 then prevent the user from increasing the width.
          if (width > 300) {
            target.style.width = "300px";

            // Throw away queued mutation records to prevent recursion (only a problem in Firefox) but best practice
            // when changing attributes in the call back function that is observing changes to attributes.
            observer.takeRecords();
          }
          return;
        }

        // Is the observed element change of the childList type?
        if (mutation.type === 'childList') {
          // Get the innterHTML values from the element's children nodes into and array.
          let target = mutation.target;
          let list = [].slice.call(target.children).map(function (node)
          {
            return (isBlank(node.innerHTML)) ? '(empty)' : node.innerHTML;
          });

          // If the change is not an "empty" node then set the itemList[] property so that handlebars can display it.
          if (list.length !== 0 && list[0] !== '(empty)') {
            self.set('itemList', list);
          }
        }

        /* Sharing the same mutationHandler action between elements is BAD PRACTICE -- the code below illustrates this.
        if (mutation.type === 'characterData') {
          // Because we are using the same action function for all observers we need to figure out
          // which element we are dealing with and if it is the button element then we update the buttonText.
          // mutation.target is a Node which is not necessarily an Element. Better to use a separate action for
          // each observed element. This code shows the WRONG WAY.
          let node = mutation.target.parentElement;
          if (node !== null && node.nodeType === 1 && node.id === 'btn') {
            self.set('buttonText', mutation.target.textContent);
          }
        }
        */
      });
    },

    /**
     * Handle mutation changes to the button element.
     * @param {MutationRecord[]} mutations
     * @param [{MutationObserver}] observer
     */
    handleMutationsBtn(mutations)
    {
      let self = this;
      mutations.forEach(function (mutation) {
        if (mutation.type === 'characterData')
        {
          self.set('buttonText', mutation.target.textContent);
        }
      });
    }
  }
});
