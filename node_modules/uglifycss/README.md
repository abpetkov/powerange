UglifyCSS is a port of [YUI Compressor](https://github.com/yui/yuicompressor), for its CSS part, to [NodeJS](http://nodejs.org). Its name is a reference to the awesome [UglifyJS](https://github.com/mishoo/UglifyJS) but UglifyCSS is not a CSS parser. Like YUI CSS Compressor, it applies many regexp replacements.

Usage: `uglifycss [options] css1 [css2] [...] > output`

Options:

* `--max-line-len n` adds a newline (approx.) every `n` characters; `0` means no newline and is the default value
* `--expand-vars` expands variables; by default, `@variables` blocks are preserved and `var(x)`s are not expanded
* `--ugly-comments` removes newlines within preserved comments; by default, newlines are preserved
* `--cute-comments` preserves newlines within and around preserved comments

A [port to javascript](https://github.com/yui/yuicompressor/blob/master/ports/js/cssmin.js) is also available in the YUI Compressor repository.

2 functions are provided:

* `processString( content, options )`
* `processFiles( [ filename1, ... ], options )`

See test.js for example.

UglifyCSS passes successfully the test suite of YUI compressor CSS.

UglifyCSS is MIT licensed.
