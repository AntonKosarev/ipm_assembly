'use strict';
const gulp = require('gulp');
const HubRegistry = require('gulp-hub');

const ipm_assembly = new HubRegistry(['ipm.js']);
gulp.registry(ipm_assembly);

// const hub = new HubRegistry(['gulp-tasks/**/*.js']);
// gulp.registry(hub);
