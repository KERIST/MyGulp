var gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    uncss = require('gulp-uncss'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    wiredep = require('wiredep').stream,
    gulpif = require('gulp-if'),
    useref = require('gulp-useref'),
    reload = browserSync.reload;


var path = {
    src: {
        html: 'src/*.html',
        js: 'src/js/*.js',
        style: 'src/style/styles.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    build: {
        html: 'build/',
        js: 'build/script/',
        css: 'build/style/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/script/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    }
};
//show website
gulp.task('show', function () {
    browserSync.init({
        server: {
            baseDir: './src'
        },
        tunnel: true,
        host: 'localhost',
        port: 8080,
        logPrefix: 'Test Project'
    });
});

//live reload
gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: './src'
        }
    });
});
//watch
gulp.task('sass', function () {
    gulp.src('./src/style/styles.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./src/style'))
        .pipe(reload({stream: true}))
});

gulp.task('reload', function () {
    reload();
});

gulp.task('bower', function () {
    gulp.src('./src/index.html')
        .pipe(wiredep({
            directory : 'src/bower_components'
        }))
        .pipe(gulp.dest('./src'));
});

gulp.task('sass:watch', function () {
    gulp.watch(path.watch.style, ['sass']);
});

gulp.task('html:watch', function () {
    gulp.watch(path.watch.html, ['reload'])
});

gulp.task('bower:watch', function () {
    gulp.watch('./bower.json', ['bower']);
});

gulp.task('js:watch', function () {
   gulp.watch(path.watch.src, ['reload']);
});

gulp.task('watch', ['sass', 'browser-sync', 'html:watch', 'sass:watch','bower:watch', 'js:watch']);
// build

gulp.task('html:build', function () {
    gulp.src('./src/index.html')
        .pipe(rigger())//want to import use in index.html => "//= ./footer.html"
        .pipe(useref())
        .pipe(gulp.dest(path.build.html));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('sass:build', function () {
    gulp.src(path.src.style)
        .pipe(sass())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
});

gulp.task('build', ['html:build', 'sass:build', 'js:build', 'image:build']);