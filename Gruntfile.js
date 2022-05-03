module.exports = function(grunt) {
  
  grunt.initConfig({
    // concat: {
    //   js: {
    //     options: {
    //       separator: ';'
    //     },
    //     src: [
    //       'javascript/*.js'
    //     ],
    //     dest: 'public/js/main.min.js'
    //   },
    // },
    // uglify: {
    //   options: {
    //     mangle: false
    //   },
    //   js: {
    //     files: {
    //       'public/js/main.min.js': ['public/js/main.min.js']
    //     }
    //   }
    // },
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      // define the files to lint
      files: ['Gruntfile.js', 'sketch.js'],
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
          // more options here if you want to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    },
    watch: {
      js: {
        files: ['*.js'],
        tasks: ['jshint'],
        options: {
          livereload: true,
        }
      },
      css: {
        files: 'sassy.sass/dev.sass',
        tasks: ['sass'],
        options: {
          livereload: true,
        },
      },
    }
  });
 
  // grunt.loadNpmTasks('grunt-contrib-concat');
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  // grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch', 'sass', 'jshint']);
  // grunt.registerTask('watch', [ 'watch' ]);

};
