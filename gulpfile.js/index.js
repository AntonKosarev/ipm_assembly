'use strict';
const gulp = require('gulp');
const HubRegistry = require('gulp-hub');

/* load some files into the registry */
const ipm = new HubRegistry(['ipm.js']);
// const hub = new HubRegistry(['gulp-tasks/**/*.js']);

/* tell gulp to use the tasks just loaded */
gulp.registry(ipm);
gulp.registry(hub);
