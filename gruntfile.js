/*global module */

module.exports = function (grunt) {

    'use strict';

    // grunt configuration

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: {
                src: ['www/js/**/*.js'],
                options: {
                    jshintrc: '.jshintrc'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.option('force', false);

    // tasks

    grunt.registerTask('default', ['jshint:all']);
};
