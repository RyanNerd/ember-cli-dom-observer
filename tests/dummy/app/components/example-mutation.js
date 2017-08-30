import Ember from 'ember';
import layout from '../templates/components/example-mutation';

export default Ember.Component.extend(
{
  layout: layout,

  itemList: [],

  actions:
  {
    handleMutations(mutations)
    {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          let target = mutation.target;
          let list = [].slice.call(target.children)
          .map(function (node) {
            return (Ember.isBlank(node.innerHTML)) ? '(empty)' : node.innerHTML;
          });

          if (list.length !== 0 && list[0] !== '(empty)') {
            this.set('itemList', list);
          }
        }
      });
    }
  }
});
