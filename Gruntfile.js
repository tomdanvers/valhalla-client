module.exports = function (grunt) {

  'use strict';

  var root = 'build/public/';
  var assetRoot = 'build/public/assets';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      build: {
        src: [
            assetRoot + '/css/site.min.css',
            assetRoot + '/js/main.min.js'
          ]
      }
    },
    requirejs: {
      js: {
        options: {
          almond: true,
          logLevel: 2,
          mainConfigFile: assetRoot + '/js/main.js',
          baseUrl: assetRoot + '/js',
          name: 'lib/require/almond',
          include: ['main'],
          insertRequire: ['main'],
          out: assetRoot + '/js/main.min.js',
          optimize: 'uglify',
          preserveLicenseComments: false,
          wrap: false
        }
      },
      css: {
        options: {
          logLevel: 2,
          optimizeCss: 'standard',
          cssIn: assetRoot + '/css/main.css',
          out: assetRoot + '/css/main.min.css'
        }
      }
    },
    'json-minify': {
      build: {
        files: assetRoot + '/img/**/*.json'
      }
    },
    sass: {
      dist: {
        files: {
          'build/public/assets/css/main.css' : 'build/public/assets/css/sass/main.scss'
        }
      }
    },
    strip : {
      main : {
        src: assetRoot + '/js/main.min.js',
        dest: assetRoot + '/js/main.min.js'
      }
    },
    watch: {
      css: {
        files: [assetRoot + '/css/**/*.css', assetRoot + '/css/**/*.scss'],
        tasks: ['build:css'],
        options: {
          spawn: false
        }
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        assetRoot + '/js/**/*.js',
        '!' + assetRoot + '/js/lib/**/*.js',
        '!' + assetRoot + '/js/main.min.js'
      ],
      options: {
        'node': true,
        'browser': true,
        'es5': false,
        'esnext': true,
        'bitwise': true,
        'camelcase': false,
        'curly': true,
        'eqeqeq': true,
        'immed': true,
        'latedef': true,
        'newcap': true,
        'noarg': true,
        'quotmark': 'single',
        'regexp': true,
        'undef': true,
        'unused': true,
        'strict': true,
        'trailing': true,
        'smarttabs': true,
        'white': false,
        'laxcomma': true,

        'predef': [
          'swfobject',
          'define',
          '_gaq',
          'Modernizr',
          'SD'
        ]
      }
    }
  });

  // npm
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-strip');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-json-minify');

  // build
  grunt.registerTask('build:css', ['sass', 'requirejs:css']);
  grunt.registerTask('build:js', ['requirejs:js']);
  grunt.registerTask('build', ['build:css', 'build:js', 'strip']);
  grunt.registerTask('json', ['json-minify']);

  // hint
  grunt.registerTask('hint', ['jshint']);

  // default
  grunt.registerTask('default', ['build']);

};
