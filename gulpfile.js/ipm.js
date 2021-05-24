"use strict";

const gulp = require('gulp');
const watch = require('gulp-watch');
const {series, parallel, src, dest} = require('gulp');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const pxtoremorem = require('postcss-pxtoremorem');
const fileinclude = require('gulp-file-include');
const clean = require('gulp-clean');

const processors = [
    pxtoremorem({
        selectorBlackList: [/^html$/],
        replace: true,
        rootValue: 16,
        propList: [
            'border-radius',
            'box-shadow',
            'font',
            'font-size',
            'line-height',
            'letter-spacing',
            'margin',
            'margin-top',
            'margin-right',
            'margin-bottom',
            'margin-left',
            'padding',
            'padding-top',
            'padding-right',
            'padding-bottom',
            'padding-left',
            'height',
            'width',
            'min-height',
            'min-width',
            'top',
            'right',
            'bottom',
            'left',
        ],
    }),
    autoprefixer(),
]; //pipe(postcss(processors))

const root = {
    src: {
        rs: 'IPM',
        wz: 'IPM',
        ss: 'IPM'
    },
    build: {
        rs: 'IPM/build/rs',
        wz: 'IPM/build/wz',
        ss: 'IPM/build/ss'
    }
};

const ipms = {
    rs: [
        {prod: '', view: 'drtripm-reg-remexp6'}
    ],
    wz: [
        {prod: 'driver-updater/', view: 'tripm-reg-remexp6'}
    ],
    ss: [
        {prod: '', view: 'sdutripm-reg-rem6-v3'},
        {prod: '', view: 'sdutripm-reg-rem7-v3'}
    ],
};
const paths = {
    rs: {
        src: {
            phtml: root.src.rs + '/rs/',
            css: root.src.rs + '/*.css',
            img: root.src.rs + '/rs/',
        },
        build: {
            phtml: root.build.rs + '/application/views/scripts/start-message',
            css: root.build.rs + '/httpdocs/start-message/css/',
            img: root.build.rs + '/httpdocs/start-message/images/',
        },
        watch: {
            phtml: [root.src.rs + '/rs/*.phtml', root.src.rs + '/*.phtml'],
            css: [root.src.rs + '/*.css'],
            img: [root.src.rs + '/ss/'],
        }
    },
    ss: {
        src: {
            phtml: root.src.ss + '/ss/',
            css: root.src.ss + '/*.css',
            img: root.src.ss + '/ss/',
        },
        build: {
            phtml: root.build.ss + '/application/views/scripts/start-message',
            css: root.build.ss + '/httpdocs/start-message/css/',
            img: root.build.ss + '/httpdocs/start-message/images/',
        },
        watch: {
            phtml: [root.src.ss + '/ss/*.phtml', root.src.ss + '/*.phtml'],
            css: [root.src.ss + '/*.css'],
            img: [root.src.ss + '/ss/'],
        }
    },
    wz: {
        src: {
            phtml: root.src.wz + '/wz/',
            css: root.src.wz + '/*.css',
            img: root.src.wz + '/wz/',
        },
        build: {
            phtml: root.build.wz + '/application/ipm/views/scripts/',
            css: root.build.wz + '/httpdocs/ipm/',
            img: root.build.wz + '/httpdocs/ipm/',
        },
        watch: {
            phtml: [root.src.wz + '/wz/**/*.phtml', root.src.wz + '/*.phtml'],
            css: [root.src.wz + '/*.css'],
            img: [root.src.wz + '/wz/**/img/*'],
        }
    },
};

function Assembly(views, path) {
    let assembly = {
        vars: function (cd) {
            console.log('views: ', views);
            console.log('path: ', path);
            cd();
        },
        build: {
            phtml: function (cd) {
                for (let i = 0; i < views.length; i++) {
                    src(path.src.phtml + views[i].prod + '*.phtml')
                        .pipe(fileinclude({
                            prefix: '@@',
                            basepath: '@file'
                        }))
                        .pipe(dest(path.build.phtml + views[i].prod));
                }
                cd();
            },
            css: function (cd) {
                for (let i = 0; i < views.length; i++) {
                    console.log('src: ', path.src.phtml + views[i].prod + '*.phtml');
                    console.log('build: ', path.build.phtml + views[i].prod);
                    if (views[i].prod === '') { // only for rs and ss
                        src(path.src.css)
                            .pipe(postcss(processors))
                            .pipe(dest(path.build.css + views[i].view));
                    } else { // only for wz
                        src(path.src.css)
                            .pipe(postcss(processors))
                            .pipe(dest(path.build.css + views[i].prod + 'css/' + views[i].view));
                    }
                }
                cd();
            },
            img: function (cd) {
                for (let i = 0; i < views.length; i++) {
                    if (views[i].prod === '') { // only for rs and ss
                        src(path.src.img + views[i].view + '/*.*')
                            .pipe(dest(path.build.img + views[i].view));
                    } else { // only for wz
                        src(path.src.img + views[i].prod + '/img/*.*')
                            .pipe(dest(path.build.img + views[i].prod + '/images/' + views[i].view));
                    }
                }
                cd();
            }
        },
        watch: {
            phtml: function (cd) {
                gulp.watch(path.watch.phtml, series(assembly.build.phtml));
                cd();
            },
            css: function (cd) {
                gulp.watch(path.watch.css, series(assembly.build.css));
                cd();
            },
            img: function (cd) {
                for (let i = 0; i < views.length; i++) {
                    gulp.watch(path.watch.img + views[i].view + '/*.*', function (done) {
                        src(path.build.img + views[i].view + '/*.*', {read: false}).pipe(clean());
                        src(path.src.img + views[i].view + '/*.*').pipe(dest(path.build.img + views[i].view));
                        done();
                    });
                }
                cd();
            },
        }
    };
    return assembly;
}

let assembly_ss = Assembly(ipms.ss, paths.ss);
gulp.task('build_ss', series(assembly_ss.build.phtml, assembly_ss.build.css, assembly_ss.build.img));
gulp.task('watch_ss', parallel(assembly_ss.watch.phtml, assembly_ss.watch.css, assembly_ss.watch.img));
gulp.task('assembly_ss', series('build_ss', 'watch_ss'));

let assembly_rs = Assembly(ipms.rs, paths.rs);
gulp.task('build_rs', series(assembly_rs.build.phtml, assembly_rs.build.css, assembly_rs.build.img));
gulp.task('watch_rs', parallel(assembly_rs.watch.phtml, assembly_rs.watch.css, assembly_rs.watch.img));
gulp.task('assembly_rs', series('build_rs', 'watch_rs'));

let assembly_wz = Assembly(ipms.wz, paths.wz);
gulp.task('build_wz', series(assembly_wz.build.phtml, assembly_wz.build.css, assembly_wz.build.img));
gulp.task('watch_wz', parallel(assembly_wz.watch.phtml, assembly_wz.watch.css, assembly_wz.watch.img));
gulp.task('assembly_wz', series('build_wz', 'watch_wz'));

gulp.task('ipm_assembly_build', parallel('build_ss', 'build_rs', 'build_wz'));
gulp.task('ipm_assembly_watch', parallel('watch_ss', 'watch_rs', 'watch_wz'));
gulp.task('ipm_assembly', series('ipm_assembly_build', 'ipm_assembly_watch'));