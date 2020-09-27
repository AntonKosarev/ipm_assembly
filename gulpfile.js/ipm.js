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
];
//pipe(postcss(processors))

const ROOT = {
    src: {
        rs: 'C:/COREL/IPM',
        wz: 'C:/COREL/IPM',
        ss: 'C:/COREL/IPM'
    },
    build: {
        rs: 'C:/COREL/bitbucket/reviversoft.com',
        wz: 'C:/COREL/bitbucket/reviversoft.com',
        ss: 'C:/COREL/bitbucket/simplestar'
    }
};
const ipms = {
    rs: [
        {prod: '', view: 'drtripm-reg-remexp6'}
    ],
    wz: [
        {prod: 'driver-updater', view: 'tripm-reg-remexp6'}
    ],
    ss: [
        {prod: '', view: 'sdutripm-reg-rem6-v3'},
        {prod: '', view: 'sdutripm-reg-rem7-v3'}
    ],
};
const paths = {
    rs: {
        src: {
            phtml: ROOT.src.rs + '/rs/*.phtml',
            css: ROOT.src.rs + '/*.css',
            img: ROOT.src.rs + '/rs/',
        },
        build: {
            phtml: ROOT.build.rs + '/application/views/scripts/start-message',
            css: ROOT.build.rs + '/httpdocs/start-message/css/',
            img: ROOT.build.rs + '/httpdocs/start-message/images/',
        },
        watch: {
            phtml: [ROOT.src.rs + '/rs/*.phtml', ROOT.src.rs + '/*.phtml'],
        }
    },
    ss: {
        src: {
            phtml: ROOT.src.ss + '/ss/*.phtml',
            css: ROOT.src.ss + '/*.css',
            img: ROOT.src.ss + '/ss/',
        },
        build: {
            phtml: ROOT.build.ss + '/application/views/scripts/start-message',
            css: ROOT.build.ss + '/httpdocs/start-message/css/',
            img: ROOT.build.ss + '/httpdocs/start-message/images/',
        },
        watch: {
            phtml: [ROOT.src.ss + '/ss/*.phtml', ROOT.src.ss + '/*.phtml'],
            css: [ROOT.src.ss + '/*.css'],
            img: [ROOT.src.ss + '/ss/'],
        }
    },
};

let assembly_ipm = {
    views: ipms.ss,
    path: paths.ss,
    build: {
        phtml: function (cd, path = assembly_ipm.path) {
            src(path.src.phtml)
                .pipe(fileinclude({
                    prefix: '@@',
                    basepath: '@file'
                }))
                .pipe(dest(path.build.phtml));
            cd();
        },
        css: function (cd, path = assembly_ipm.path, views = assembly_ipm.views) {
            for (let i = 0; i < views.length; i++) {
                src(path.src.css)
                    .pipe(postcss(processors))
                    .pipe(dest(path.build.css + views[i].view));
            }
            cd();
        },
        img: function (cd, path = assembly_ipm.path, views = assembly_ipm.views) {
            for (let i = 0; i < views.length; i++) {
                src(path.src.img + views[i].view + '/*.*').pipe(dest(path.build.img + views[i].view));
            }
            cd();
        }
    },
    watch: {
        phtml: function (cd, path = assembly_ipm.path) {
            gulp.watch(path.watch.phtml, series(assembly_ipm.build.phtml));
            cd();
        },
        css: function (cd, path = assembly_ipm.path) {
            gulp.watch(path.watch.css, series(assembly_ipm.build.css));
            cd();
        },
        img: function (cd, path = assembly_ipm.path, views = assembly_ipm.views) {
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
}

gulp.task('assembly_ipm', series(
    assembly_ipm.build.phtml,
    assembly_ipm.build.css,
    assembly_ipm.build.img,
    parallel(
        assembly_ipm.watch.phtml,
        assembly_ipm.watch.css,
        assembly_ipm.watch.img
    )
));


// End simplestar.com GULP NEW --------------------------------------------------------------------------------------
