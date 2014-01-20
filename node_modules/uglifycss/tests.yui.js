#! /usr/bin/env node

// var stuff
var	util = require( 'util' ),
	fs = require( 'fs' ),
	uglifycss = require( './uglifycss-lib' ),
	path = '../yuicompressor/tests',
	files = fs.readdirSync(path).sort(),
	file, i, ugly, failed = 0, total = 0;

// trim results (some ref minified files have new lines at the end)
function trim( str ) {
	return str.toString().replace( /(^\s*|\s*$)/g, '' );
}

// remove previous failures
for ( i in files ) {
	if ( /\.FAILED$/.test( files[ i ] ) ) {
		fs.unlink( path + '/' + files[ i ] );
	}
}

// check files
for ( i in files ) {
	file = path + '/' + files[ i ];
	if ( /\.css$/.test( file ) ) {
		ugly = uglifycss.processFiles( [ file ] );
		if ( trim( ugly ) != trim( fs.readFileSync( file + '.min' ) ) ) {
			util.puts( file + ': FAILED' );
			fs.writeFile( file + '.FAILED', ugly );
			failed += 1;
		}
		total += 1;
	}
}

// report total
if ( failed ) {
	util.puts( total + ' tests, ' + failed + ' failed' );
} else {
	util.puts( total + ' tests, no failure!' );
}
