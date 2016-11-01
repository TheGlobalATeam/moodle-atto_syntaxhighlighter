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

var logic = {
    initializer: function() {
        this.addButton({
            icon: 'e/source_code',
            callback: this._toggleSyntaxHighliting
        });
    },
    _toggleSyntaxHighliting: function(event) {
        this.set('isHighlightingEnabled', !this.get('isHighlightingEnabled'));
        this._showHTML();
    },
    _showHTML: function() {

        var phpcode = '<?php'
                    + ' $variable = 100;'
                    + '?>';

        var html = '<link rel="stylesheet" href="{{style}}">'
                 + '<script src="{{lib}}"></script>'
                 + '<pre><code class="php">'
                 + '{{code}}'
                 + '</code></pre>';

        var template = Y.Handlebars.compile(html);
        var test = template({
            style: '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.7.0/styles/default.min.css',
            lib: '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.7.0/highlight.min.js',
            code: phpcode
        });

        // NOTE(thomas): How to insert this node into the texarea?
        var content = Y.Node.create(test);

        // NOTE(thomas):
        // Can listen on valuechanges on the textarea,
        // Might come in handy?
        var host = this.get('host');
        host.editor.on('valuechange', function() {
            console.log('change');
        });

        // NOTE(thomas) Make the syntax button toggable.
        if (!this.get('isHighlightingEnabled')) {
            this.unHighlightButtons('html');
            host.enablePlugins();
        } else {
            this.highlightButtons('html');
            host.disablePlugins();
            host.enablePlugins(this.name);
        }
    }
};

var data = {
    ATTRS: {
        isHighlightingEnabled: {
            value: false
        }
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
    Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], logic, data);
