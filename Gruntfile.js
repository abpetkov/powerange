module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var config = {
      buildDir: 'build/'
    , distDir: 'dist/'
    , libDir: 'lib/'
    , name: 'Powerange'
  };

  grunt.initConfig({
      config: config
    , pkg: grunt.file.readJSON('package.json')

    , componentbuild: {
        development : {
              options: {
                  dev: true
                , sourceUrls: true
              }
            , dest: '<%= config.buildDir %>'
            , src: '.'
        }
        , standalone: {
              options: {
                  name: '<%= pkg.name %>'
                , standalone: '<%= config.name %>'
              }
            , dest: '<%= config.distDir %>'
            , src: '.'
          }
      }

    , uglify: {
        dist: {
            src: '<%= config.distDir %><%= pkg.name %>.js'
          , dest: '<%= config.distDir %><%= pkg.name %>.min.js'
        }
      }

    , cssmin: {
        minify: {
            src: '<%= config.distDir %><%= pkg.name %>.css'
          , dest: '<%= config.distDir %><%= pkg.name %>.min.css'
        }
      }

    , watch: {
          css: {
              files: ['<%= config.libDir %><%= pkg.name %>.css']
            , tasks: ['componentbuild:development']
          }
        , js: {
              files: ['<%= config.libDir %><%= pkg.name %>.js'
                    , '<%= config.libDir %>vertical.js'
                    , '<%= config.libDir %>horizontal.js'
                    , '<%= config.libDir %>main.js']
            , tasks: ['componentbuild:development']
          }
      }

    , clean: {
          development: ['<%= config.buildDir %>*']
        , standalone: ['<%= config.distDir %>*']
      }
  });

  grunt.registerTask('build', ['componentbuild', 'uglify:dist', 'cssmin:minify']);
  grunt.registerTask('default', 'build');
};