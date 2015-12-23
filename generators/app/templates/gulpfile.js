var gulp = require('gulp');
var less = require('gulp-less');
var csslint = require('gulp-csslint');
var autoprefixer = require('gulp-autoprefixer');
var reporter = require('gulp-less-reporter');
var connect = require('gulp-connect');
var htmlhint = require('gulp-htmlhint');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var lessBower = require('less-plugin-bower-resolve');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var Server = require('karma').Server;
var eslint = require('gulp-eslint');
var del = require('del');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var minifyCss = require('gulp-minify-css');
var assign = require('lodash.assign');
var watchify = require('watchify');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');

//++++++++++++++++++++++
//+ Private vars
//++++++++++++++++++++++

var portNumber = 3001;

//++++++++++++++++++++++++
//+ CLI tasks [public]
//++++++++++++++++++++++++

gulp.task('default', function( callback ) {
	runSequence(
		[
			'clean:build',
		],
		[
			'copy:package-bundles',
			'copy:html',
		],
		[
			'modules:app-less',
			'modules:app-js',
			'lint:js',
			'lint:html',
			'serve:dev',
			'watch:html',
			'watch:less',
			'watch:js',
			'test'
		]
	, callback);
});

//++++++++++++++++++++++
//+ Tasks [private]
//++++++++++++++++++++++

//++++++++++++++++++++++
//+ Less
//++++++++++++++++++++++

var bundleAppCssDebug = 'app.debug.css';

gulp.task('modules:app-less', function () {
    lessModules(['./app/index.less'], bundleAppCssDebug);
});

function lessModules (sourceFiles, bundleDebugName) {
    gulp.src(sourceFiles)
        .pipe(less({
            plugins: [lessBower]
        }))
        .on('error', function(err){
            gutil.log(gutil.colors.red(Error ('Less Error: ') + err.message));
            this.emit('end');
        })
        .pipe(autoprefixer())
        .pipe(csslint('./csslintrc.json'))
        .pipe(csslint.reporter())
        .pipe(rename(bundleDebugName))
        .pipe(gulp.dest('./build/css'))
        .pipe(rename(bundleDebugName.replace('debug', 'min')))
        .pipe(sourcemaps.init())
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build/css'));
}

//++++++++++++++++++++++
//+ Javascript
//++++++++++++++++++++++

var destJs =  './build/js/'

var globalBrowserifyOpts = {
    paths: [
        './node_modules', 
        './bower_components/',
	],
    debug: true
};

function bundle(b, bundleName, bundleDest) {
    return b.bundle()
        .on('error', function(err){
            gutil.log(gutil.colors.red(Error ('Browserify Error: ') + err.message));
            this.emit('end');
        })
        .pipe(source(bundleName))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(gulp.dest(destJs))
        .pipe(rename(bundleName.replace('debug', 'min')))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(bundleDest));
}

function setUpBrowserify(browserifyOpts, bundleName, bundleDest) {
    var opts = assign( {}, watchify.args, globalBrowserifyOpts, browserifyOpts );
    var b = watchify( browserify(opts) ); 
        b.transform(babelify);
        b.on('update', function(){
            bundle(b, bundleName, bundleDest);
        });
        b.on('log', gutil.log);
    return b;
}

// Define Browserify bundles, setup Browserify tasks and gulp tasks
// MAIN BUNDLE
var mainBundleOpts = {
    entry: './app/index.js',
    bundleFilename: 'app.debug.js',
    bundleDest: destJs
}
var mainBundle = setUpBrowserify({
        entries: [mainBundleOpts.entry]
    },
    mainBundleOpts.bundleFilename,
    mainBundleOpts.bundleDest
);
gulp.task('modules:app-js', function() { 
    bundle(mainBundle, mainBundleOpts.bundleFilename, mainBundleOpts.bundleDest);
});

//++++++++++++++++++++++
//+ Lint
//++++++++++++++++++++++

gulp.task('lint:js', function() {
	return gulp.src(['./app/**/*.{js,jsx}'])
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('lint:html', function() {
	return gulp.src(['./app/**/*.html'])
		.pipe(htmlhint('./htmlhintrc.json'))
		.pipe(htmlhint.reporter())
});

//++++++++++++++++++++++
//+ Copy
//++++++++++++++++++++++

gulp.task('copy:html', function () {
	return gulp.src('./app/index.html')
		.pipe(gulp.dest('./build/'));
});

gulp.task('copy:package-bundles', function () {
	return gulp.src([
			'./bundles/global.min.css',
			'./bundles/global.min.css.map',
			'./bundles/global.min.js',
			'./bundles/global.min.js.map',
		])
		.pipe(gulp.dest('./build/bundles/'));
});

//++++++++++++++++++++++
//+ Clean
//++++++++++++++++++++++

gulp.task('clean:build', function ( callback ) {
	del(['./build/'], callback);
});

gulp.task('clean:js-modules', function ( callback ) {
	del(['./build/**/*.js', '!./build/bundles/*.*'], callback);
});

gulp.task('clean:css-modules', function ( callback ) {
	del(['./build/**/*.css', '!./build/bundles/*.*'], callback);
});


//++++++++++++++++++++++
//+ Server
//++++++++++++++++++++++

gulp.task('serve:dev', function() {
	connect.server({
		root: 'build',
		port: portNumber,
		livereload: true
	});
});

//++++++++++++++++++++++
//+ Test
//++++++++++++++++++++++

// Pre-release test task
gulp.task('test', function(done) {
	Server.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, function( result ) {
		if ( result === 0 ){
			done();
		} else if ( result === 1 ) {
			gutil.log(gutil.colors.bgRed(new Error('Failing tests. Please fix tests before continuing ')));
		}
	});
});

// TDD test task
gulp.task('test:dev', function (done) {
	 Server.start({
		configFile: __dirname + '/karma.conf.js',
		autoWatch: true
	}, function() {
		done();
	});
});

//++++++++++++++++++++++
//+ Watch
//++++++++++++++++++++++

gulp.task('watch:less', function () {
	return gulp.watch([
		'app/**/*.less'
	], ['modules:app-less']);
});

gulp.task('watch:html', function () {
	return gulp.watch([
		'app/**/*.html'
	], ['copy:html', 'lint:html']);
});

gulp.task('watch:js', function () {
	return gulp.watch([
		'app/**/*.js'
	], ['modules:app-js', 'lint:js']);
});
