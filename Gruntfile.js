module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    dist: 'dist',
    pkgFile: 'bower.json',
    pkg: grunt.file.readJSON('bower.json'),
    meta: {
      banner:
        '/*\n'+
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' * Created by <%= pkg.author %>; Licensed under <%= pkg.license %>\n' +
        ' */\n' +
        '\n(function() {\n',
      footer: '\n}());'
    },

    watch: {
      scripts: {
        files: ['src/**/*.js', 'test/unit/**/*.js'],
        tasks: ['jshint','karma:watch:run']
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['jshint']
      }
    },

    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        eqeqeq: true,
        globals: {
          angular: true
        }
      }
    },

    concat: {
      dist: {
        options: {
          banner: '<%= meta.banner %>',
          footer: '<%= meta.footer %>'
        },
        files: {
          '<%= dist %>/promise-tracker.js': ['src/**/*.js']
        }
      }
    },

    uglify: {
      dist: {
        options: {
          banner: "<%= meta.banner %>",
          footer: '<%= meta.footer %>'
        },
        files: {
          '<%= dist %>/promise-tracker.min.js': ['src/**/*.js']
        }
      }
    },

    clean: ['demo/**/*'],

    copy: {
      release: {
        files: {
          'promise-tracker.js': '<%= dist %>/promise-tracker.js',
          'promise-tracker.min.js': '<%= dist %>/promise-tracker.min.js'
        }
      }
    },

    karma: {
      watch: {
        configFile: 'test/karma.conf.js',
        background: true,
      },
      single: {
        configFile: 'test/karma.conf.js',
        singleRun: true,
        browsers: [process.env.TRAVIS ? 'Firefox' : 'Chrome'],
      }
    },

    changelog: {
      options: {
        dest: 'CHANGELOG.md'
      }
    },

    shell: {
      release: {
        command: [
          'cp <%= dist %>/promise-tracker.js <%= dist %>/promise-tracker.min.js .',
          'git commit -am "release(): v<%= pkg.version %>"',
          'git tag v<%= pkg.version %>'
        ].join(' && ')
      }
    }
  });

  grunt.registerTask('dev', ['karma:watch', 'watch']);

  grunt.registerTask('default', ['jshint', 'test', 'build']);
  grunt.registerTask('test', ['karma:single']);
  grunt.registerTask('build', ['concat', 'uglify']);
};
