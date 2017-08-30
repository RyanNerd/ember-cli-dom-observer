/* eslint-env node */
'use strict';

const LINE1 = '  ___                _  _            _ ';
const LINE2 = ' | _ \\_  _ __ _ _ _ | \\| |___ _ _ __| |';
const LINE3 = ' |   / || / _` | \' \\| .` / -_) \'_/ _` |';
const LINE4 = ' |_|_\\\\_, \\__,_|_||_|_|\\_\\___|_| \\__,_|';
const LINE5 = '      |__/                             ';
const LINE6 ='https://github.com/RyanNerd/ember-cli-mutation-observer';

module.exports = {
  name: 'ember-cli-dom-observer',

  included(app)
  {
    this._super.included.apply(this, arguments);

    this.ui.writeLine(LINE1);
    this.ui.writeLine(LINE2);
    this.ui.writeLine(LINE3);
    this.ui.writeLine(LINE4);
    this.ui.writeLine(LINE5);
    this.ui.writeLine('');
    this.ui.writeLine(LINE6);
    this.ui.writeLine('');
  }
};
