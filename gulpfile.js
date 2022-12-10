const {src, dest, watch, parallel} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss')
const sourceMaps = require('gulp-sourcemaps');
const cache = require('gulp-cache');
const cssnano = require('cssnano');
const plumber = require('gulp-plumber');
const webp = require('gulp-webp');
const avif = require('gulp-avif');
const imagemin = require('gulp-imagemin');

function css (done) {
    src('src/scss/**/*.scss')
        .pipe(plumber())
        .pipe(sourceMaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourceMaps.write('.'))
        .pipe(dest('build/css'))
    
    done();
}

function images () {
    return src('src/img/**/*.svg')
            .pipe(dest('build/img'))
}

function optimages () {
    return src('src/img/**/*.{jpg,png}')
            .pipe(cache(imagemin({optimizationLevel: 3})))
            .pipe(dest('build/img'))
}

function convertWebp () {
    const options = {
        quality: 50
    }
    return src('src/img/**/*.{jpg,png')
            .pipe(webp(options))
            .pipe(dest('build/img'))
}

function convertAvif () {
    const options = {
        quality: 50
    }
    return src('src/img/**/*.{jpg,png}')
            .pipe(avif(options))
            .pipe(dest('build/img'))
}

function dev (done) {
    watch('src/scss/**/*.scss', css);
    watch('src/img/**/*', imagemin, images, convertWebp, convertAvif);

    done();
}

exports.css = css;
exports.images = images;
exports.optimages = optimages;
exports.convertAvif = convertAvif;
exports.convertWebp = convertWebp;
exports.dev = parallel(css, optimages, images, convertWebp, convertAvif, dev);