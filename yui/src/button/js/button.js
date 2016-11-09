// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * String for component 'atto_syntaxhighlighter', language 'en'
 *
 * @package     atto_syntaxhighlighter
 * @copyright   2016 The Global A Team
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

 /**
  * @module moodle-atto_syntaxhighlighter-button
  */
var COMPONENTNAME = 'atto_syntaxhighlighter';
var STYLE = {
    CODEAREA: 'atto_syntaxhighlighter_codearea'
};
var SELECTORS = {
    CODEAREA: '.atto_syntaxhighlighter_codearea'
};

var TEMPLATE = '<form class="atto_form">' +
                    '<label for="{{elementid}}_atto_syntaxhighlighter_codearea">Some label</label>' +
                    '<textarea class="fullwidth code {{style.CODEAREA}}" type="text"' +
                              'id="{{elementid}}_atto_syntaxhighlighter_codearea"/><br>' +
                    '<div class="mdl-align">' +
                        '<br/>' +
                        '<button type="submit" class="submit">Add codesnippet</button>' +
                    '</div>' +
                '</form>';

var logic = {
    _currentSelection: null,
    _content: null,
    initializer: function() {
        this.addButton({
            icon: 'e/source_code',
            callback: this._displayDialogue
        });
    },

    _displayDialogue: function() {
        this._currentSelection = this.get('host').getSelection();
        if (this._currentSelection === false) {
            return;
        }

        var dialogue = this.getDialogue({
            headerContent: 'Some header content', //M.util.get_string('Add code snippet', COMPONENTNAME),
            focusAfterHide: true,
            focusOnShowSelector: SELECTORS.CODEAREA
        });

        dialogue.set('bodyContent', this._getDialogueContent());
        //this._resolveAnchors();
        dialogue.show();
    },

    _setCode: function(event) {
        event.preventDefault();
        this.getDialogue({
            focusAfterHide: null
        }).hide();

        var input = this._content.one('.code');

        var value = input.get('value');

        this._wrapCode(value);
    },
    _wrapCode: function(code) {
        this.editor.focus();
        var host = this.get('host');
        host.setSelection(this._currentSelection);

        var collapsed = (this._currentSelection[0].collapsed);
        var selectednode;

        if (collapsed) {
            var codenode = Y.Node.create('<code>' + code + '</code>');
            codenode.setAttribute('class', 'PHP');
            var prenode = Y.Node.create('<pre>' + codenode + '</pre>');

            selectednode = host.insertContentAtFocusPoint(prenode.get('outerHTML'));
            host.setSelection(host.getSelectionFromNode(selectednode));
        } else {
            document.execCommand();
            selectednode = host.getSelectionParentNode();
        }
        if (!selectednode) {
            return;
        }
        return selectednode;
    },
    _getDialogueContent: function() {
        var template = Y.Handlebars.compile(TEMPLATE);
        this._content = Y.Node.create(template({
            component: COMPONENTNAME,
            style: STYLE
        }));
        //console.log(this._content);
        //this._content.one('.submit').on('click', this._setCode, this);
    }
};

 /**
  * Atto text editor syntax highlighter plugin.
  *
  * @namespace M.atto_syntaxhighlighter
  * @class button
  * @extends M.editor_atto.EditorPlugin
  */
Y.namespace('M.atto_syntaxhighlighter').Button =
    Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], logic);
