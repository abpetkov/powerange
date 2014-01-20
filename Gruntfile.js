module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    shell: {
      componentbuild: {
        command: 'component build'
      }
    },
    copy: {
      main: {
        expand: true,
        cwd: 'build/',
        src: ['**/*'],
        dest: 'dist/',
        rename: function(dest, src) {
          return dest + src.replace(src.substring(src.lastIndexOf('/') + 1, src.lastIndexOf('.')), "<%= pkg.name %>");
        }
      }
    },
    uglify: {
      dist: {
        src: 'build/build.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    cssmin: {
      minify: {
        src: 'build/build.css',
        dest: 'dist/<%= pkg.name %>.min.css'
      }
    },
    watch: {
      css: {
        files: ['<%= pkg.name %>.css'],
        tasks: ['shell:componentbuild']
      },
      js: {
        files: ['<%= pkg.name %>.js'],
        tasks: ['shell:componentbuild']
      }
    }
  });

  grunt.registerTask('build', [
    'shell:componentbuild',
    'copy:main',
    'cssmin:minify',
    'uglify:dist'
  ]);

  grunt.registerTask('default', 'build');
}