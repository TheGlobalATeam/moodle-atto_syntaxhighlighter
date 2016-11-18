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
                    /**
                     * The labels in the dialog box is globalized with language library files, 
                     * using get_string 
                     */  
                    '<label for="{{elementid}}_atto_syntaxhighlighter_codearea">{{get_string "optionslabel" component}}</label>' +
                    '<select class="language">' +
                        '<option value="c">C</option>' +
                        '<option value="cpp">C++</option>' +
                        '<option value="html">HTML</option>' +
                        '<option value="javascript">Javascript</option>' +
                        '<option value="php">PHP</option>' +
                        '<option value="python">Python</option>' +
                        '<option value="sql">SQL</option>' +
                    '</select>' +
                    '<textarea class="fullwidth code {{style.CODEAREA}}" rows="12"></textarea><br>' +
                    '<div class="mdl-align">' +
                        '<br>' +
                        /**
                        * The labels in the dialog box is globalized with language library files, 
                        * using get_string 
                        */  
                        '<button type="submit" class="submit">{{get_string "submitbutton" component}}</button>' +
                    '</div>' +
                '</form>';

/**
 * The object containign all logic and info for this plugin.
 */

var logic = {

    /**
     * The selected programming language to syntax highlight.
     *
     * @property _selectedLanguage
     * @type String
     * @default null
     * @private
     */
    _selectedLanguage: null,

    /**
     * The selection object returned by the browser.
     *
     * @property _currentSelection
     * @type Range
     * @default null
     * @private
     */
    _currentSelection: null,

    /**
     * A reference to the dialogue content.
     *
     * @property _content
     * @type Node
     * @private
     */
    _content: null,
    initializer: function() {
        this.addButton({
            icon: 'e/source_code',
            callback: this._displayDialogue
        });
    },

    _escapeHTML: function(html) {
        var tagsToReplace = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;'
        };
        return html.replace(/[&<>]/g, function(tag) {
            return tagsToReplace[tag] || tag;
        });
    },

    /**
     * Display the syntax-highlighter editor.
     *
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function() {
        this._currentSelection = this.get('host').getSelection();
        if (this._currentSelection === false) {
            return;
        }

        var dialogue = this.getDialogue({
            /**
            * The headerContent is globalized with language library files, 
            * using get_string 
            */
            headerContent: M.util.get_string('dialogboxtitle', COMPONENTNAME),
            focusAfterHide: true,
            focusOnShowSelector: SELECTORS.CODEAREA
        });

        dialogue.set('bodyContent', this._getDialogueContent());
        dialogue.show();
    },
    /**
     * Display the syntax-highlighter editor.
     * The callback from clicking the submit button.
     *
     * @method _submitCodeForHighlighting
     * @private
     */
    _submitCodeForHighlighting: function(event) {
        event.preventDefault();
        this.getDialogue({
            focusAfterHide: null
        }).hide();

        var input = this._content.one('.code');
        var value = input.get('value');

        this._wrapCode(value);
    },

    /**
     * Wrap the input with the <pre> anc <code> elements
     * as required by Highlight.js library.
     *
     * @method _wrapCode
     * @private
     */
    _wrapCode: function(code) {
        this.editor.focus();
        var host = this.get('host');
        host.setSelection(this._currentSelection);

        var selectednode;
        var collapsed = (this._currentSelection[0].collapsed);
        if (collapsed) {

            if (this._selectedLanguage === 'html') {
                code = this._escapeHTML(code);
            }

            var codenode = Y.Node.create('<code>' + code + '</code>');

            codenode.setAttribute('class', this._selectedLanguage);
            var prenode = Y.Node.create('<pre>' + codenode.get('outerHTML') + '</pre>');

            selectednode = host.insertContentAtFocusPoint(prenode.get('outerHTML'));
            host.setSelection(host.getSelectionFromNode(selectednode));
        }

        if (!selectednode) {
            return;
        }
        return selectednode;
    },

    /**
     * Return the dialogue content with attached events.
     *
     * @method _wrapCode
     * @return {Node}
     * @private
     */
    _getDialogueContent: function() {
        var template = Y.Handlebars.compile(TEMPLATE);
        this._content = Y.Node.create(template({
            component: COMPONENTNAME,
            style: STYLE
        }));

        this._content.one('.language').on('valuechange', function(event) {
            this._selectedLanguage = event.newVal;
        }, this);

        this._content.one('.submit').on('click', this._submitCodeForHighlighting, this);

        return this._content;
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
