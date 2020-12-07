const gulp = require('gulp');

const plumber = require('gulp-plumber');
const fileInclude = require('gulp-file-include');
const htmlValidator = require('gulp-w3c-html-validator');
const sourcemaps = require('gulp-sourcemaps');
const prefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const shorthand = require('gulp-shorthand');
const cleanCSS = require('gulp-clean-css');
const browserSync = require("browser-sync");
const rimraf = require('rimraf');
const rename = require("gulp-rename");
const imageMin = require('gulp-imagemin');
const rigger = require('gulp-rigger');
const minify = require('gulp-minify');
const concat = require('gulp-concat');;
const reload = browserSync.reload;

const path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/main.js', //В стилях и скриптах нам понадобятся только main файлы
        css: 'src/style/main.scss',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/*.js',
        css: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

const config = {
    server: {
        baseDir: "./build"
    },

    host: 'localhost',
    port: 9000,
    logPrefix: "Legal_tech"
};

const html = () => {
    return gulp
        .src(path.src.html)
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(htmlValidator())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}))
};

const css = () => {
    return gulp
        .src(path.src.css)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer({
            cascade: false
        }))
        .pipe(shorthand())
        .pipe(cleanCSS({
            debug: true,
            compatibility: '*'
        }, details => {
            console.log(`${details.name}: Original size:${details.stats.originalSize} - Minified size: ${details.stats.minifiedSize}`)
        }))
        .pipe(sourcemaps.write())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}))
};

const js = () => {
    return gulp
        .src(['./node_modules/jquery/dist/jquery.js',
            './node_modules/bootstrap/dist/js/bootstrap.js',
            './node_modules/slick-carousel/slick/slick.js',
            path.src.js])
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}))
};

const img = () => {
    return gulp
        .src(path.src.img)
        .pipe(imageMin())
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}))
};

const font = () => {
    return gulp
        .src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(reload({stream: true}))
};

gulp.task('build', gulp.series(gulp.parallel(html, css, img, font), js));

gulp.task('watch', function() {
    gulp.watch(path.watch.html, html);
    gulp.watch(path.watch.css, css);
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.img, img);
    gulp.watch(path.watch.fonts, font);
});

gulp.task('webServer', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', gulp.series('clean', 'build', gulp.parallel('webServer', 'watch')));
