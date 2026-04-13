/*jshint node:true*/
'use strict';

// Добавляем импорт современного Sass в начало файла
const sassImplementation = require('sass');

var CONFIG = {
  pages: 'pages/',
  source: 'static/',
  static: './build/static/',
  deploy: './build/'
};

module.exports = function (grunt) {
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt)({
    loadTasks : 'grunt/tasks'
  });

  [
    'autoprefixer',
    'clean',
    'connect',
    'copy',
    'handlebars',
    'haychtml',
    'jshint',
    'neuter',
    'notify',
    'sass',
    'uglify',
    'watch'
  ].forEach(function (key) {
    // Получаем конфиг из внешнего файла
    var taskConfig = require('./grunt/config/' + key)(CONFIG);
    
    // СПЕЦИАЛЬНЫЙ ХАК ДЛЯ SASS:
    // Если это конфиг для sass, принудительно вставляем в него реализацию
    if (key === 'sass') {
      if (!taskConfig.options) { taskConfig.options = {}; }
      taskConfig.options.implementation = sassImplementation;
    }

    grunt.config(key, taskConfig);
  });

  grunt.registerTask('server', function (port) {
    var livereloadPort = Math.round(port) + 30000;
    if (port) {
      grunt.config('watch.livereload.options.livereload', livereloadPort);
      grunt.config('connect.options.livereload', livereloadPort);
      grunt.config('connect.options.port', port);
    }

    grunt.task.run([
      'develop',
      'connect',
      'watch'
    ]);
  });

  grunt.registerTask('develop', [
    'clean',
    'handlebars',
    'neuter',
    'shaderChunks',
    'sass:develop',
    'autoprefixer:develop',
    'haychtml:develop',
    'copy:develop',
    'copy:build'
  ]);

  grunt.registerTask('build', [
    'clean',
    'jshint',
    'handlebars',
    'neuter',
    'shaderChunks',
    'uglify',
    'sass:build',
    'autoprefixer:build',
    'haychtml:build',
    'copy:build',
    'clean:temp',
    'notify:build'
  ]);

  grunt.registerTask('default', ['build']);
};