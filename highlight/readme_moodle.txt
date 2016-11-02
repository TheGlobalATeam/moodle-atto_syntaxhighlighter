## highlight.js

1. Clone the repository from `https://github.com/isagalaev/highlight.js`
2. Run `npm install` inside the cloned directory to download libraries for building the minimized version.
3. Run 'node tools/build.js' and the minimized file is located in `build/highlight.pack.js`.
4. Replace the file into the `highlight` directory inside `atto/plugins/syntaxhighlighter/`.
5. Update the `lib/thirdpartylibs.xml` file with the new version number of the library.
