## Moodles Atto Syntax Highlighter
Highlight code snippets in atto, a text editor in Moodle.

## Setup
1. Clone this repo under `moodle\lib\editor\atto\plugins\`, and rename the directory to `syntaxhighlighter`.

In order to get the button appear in the atto toolbar, first you need to build the plugin (generate minified files). This is done by shifter through Grunt. To do this, go to the Moodles root file directory in a command prompt (where the Grunfile.js is located) and

2. type `npm install` (if not done already).
3. Typing `grunt` and hit enter to start minification and compilation of Moodle files.
One might get LF vs CLRF errors, either make eslint ignore it, or use some tool to fix them.
4. To only run shifter type `grunt shifter` and it will first check for eslint errors, if any errors appear run `grunt eslint:yui` to see where they come from and what they are.
On success a build directory should be located under `syntaxhighlighter\yui\` with 3 files.

5. Go to Moodle and install the new plugin. This can be done from `Site administration > Notification`.
5. In Moodle go to `Site administration > Plugins > Text editors > Atto HTML editor > Atto toolbar settings`. From here, make sure the plugin named `Syntax Highlighter` is in the list of Atto plugins with the toolbar config string `syntaxhighlighter`. In the Toolbar config textarea add `syntaxhighlighter` to the `other` entry like so: `other = html, syntaxhighlighter`.
Save changes and find somewhere in Moodle where the Atto editor is provided; expand for more buttons and a new button should be beside the HTML (<>) button, equal to the 'strikethrough' one.
