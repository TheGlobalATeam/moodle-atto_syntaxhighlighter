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

function getScript(src, callback) {
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onreadystatechange = s.onload = function() {
        if (!callback.done && (!s.readyState || /loaded|complete/.test(s.readyState))) {
            callback.done = true;
            callback();
        }
    };
    document.querySelector('head').appendChild(s);
}

// TODO(thomas):
// Does not work, as YUI escapes html tags.
// Need to find the proper way of inserting the list with YUI.
function appendLanguages(languages) {
    var options = '';
    languages.forEach(function(language) {
        options += '<option value="' + language + '">' + language + '</option>';
    });
    return options;
}

// TODO(thomas):
//  Ask Moodle experts about how to proberly
//  load third party libs into an atto plugin!
var OPTIONS = '';
getScript('//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.8.0/highlight.min.js', function() {
    var languages = hljs.listLanguages();
    OPTIONS = appendLanguages(languages);
});

var COMPONENTNAME = 'atto_syntaxhighlighter';
var STYLE = {
    CODEAREA: 'atto_syntaxhighlighter_codearea'
};
var SELECTORS = {
    CODEAREA: '.atto_syntaxhighlighter_codearea'
};
var TEMPLATE = '<form class="atto_form">' +
                    '<label for="{{elementid}}_atto_syntaxhighlighter_codearea">Some label</label>' +
                    '<select class="language">' +
                        '<option value="autoDetect">Auto Detect</option>' +
                        '<option value="apache">apache</option>' +
                        '<option value="bash">bash</option>' +
                        '<option value="coffeescript">coffeescript</option>' +
                        '<option value="cpp">cpp</option>' +
                        '<option value="cs">cs</option>' +
                        '<option value="css">css</option>' +
                        '<option value="diff">diff</option>' +
                        '<option value="javascript">javascript</option>' +
                        '<option value="json">json</option>' +
                        '<option value="makefile">makefile</option>' +
                        '<option value="xml">xml</option>' +
                        '<option value="markdown">markdown</option>' +
                        '<option value="nginx">nginx</option>' +
                        '<option value="objectivec">objectivec</option>' +
                        '<option value="perl">perl</option>' +
                        '<option value="php">php</option>' +
                        '<option value="python">python</option>' +
                        '<option value="python">ruby</option>' +
                        '<option value="python">sql</option>' +
                    '</select>' +
                    '<textarea class="fullwidth code {{style.CODEAREA}}" rows="12"></textarea><br>' +
                    '<div class="mdl-align">' +
                        '<br>' +
                        '<button type="submit" class="submit">Add codesnippet</button>' +
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
    _selectedLanguage: 'autoDetect',

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
            headerContent: 'Some header content', //M.util.get_string('Add code snippet', COMPONENTNAME),
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

            if (this._selectedLanguage !== 'autoDetect') {
                codenode.setAttribute('class', this._selectedLanguage);
            }
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
