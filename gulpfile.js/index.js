'use strict';
const gulp = require('gulp');
const HubRegistry = require('gulp-hub');

/* load some files into the registry */
const ipm = new HubRegistry(['ipm.js']);
gulp.registry(ipm);

/* tell gulp to use the tasks just loaded */
// const hub = new HubRegistry(['gulp-tasks/**/*.js']);
// gulp.registry(hub);
