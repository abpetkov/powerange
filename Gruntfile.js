module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var config = {
      buildDir: 'build/'
    , distDir: 'dist/'
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
              files: ['<%= pkg.name %>.css']
            , tasks: ['componentbuild:development']
          }
        , js: {
              files: ['<%= pkg.name %>.js', 'vertical.js', 'horizontal.js', 'main.js']
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