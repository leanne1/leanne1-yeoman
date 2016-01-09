import gulp from 'gulp';
import less from 'gulp-less';
import csslint from 'gulp-csslint';
import autoprefixer from 'gulp-autoprefixer';
import reporter from 'gulp-less-reporter';
import connect from 'gulp-connect';
import htmlhint from 'gulp-htmlhint';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import lessBower from 'less-plugin-bower-resolve';
import gutil from 'gulp-util';
import runSequence from 'run-sequence';
import { Server } from 'karma';
import eslint from 'gulp-eslint';
import del from 'del';
import replace from 'gulp-replace';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import minifyCss from 'gulp-minify-css';
import assign from 'lodash.assign';
import watchify from 'watchify';
import buffer from 'vinyl-buffer';
import uglify from 'gulp-uglify';
import todo from 'gulp-todo';

//++++++++++++++++++++++
//+ Private vars
//++++++++++++++++++++++

const portNumber = 8080;

//++++++++++++++++++++++++
//+ CLI tasks [public]
//++++++++++++++++++++++++

gulp.task('default', callback => {
	runSequence(
		[
			'clean:build',
		],
		[
			'todo',
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

gulp.task('test:tdd', () => gulp.start('test:dev'));

//++++++++++++++++++++++
//+ Tasks [private]
//++++++++++++++++++++++

//++++++++++++++++++++++
//+ Less
//++++++++++++++++++++++

const bundleAppCssDebug = 'app.debug.css';

gulp.task('modules:app-less', () => lessModules(['./styles/index.less'], bundleAppCssDebug));

const lessModules = (sourceFiles, bundleDebugName) => {
    gulp.src(sourceFiles)
        .pipe(less({
            plugins: [lessBower]
        }))
        .on('error', err => {
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
};

//++++++++++++++++++++++
//+ Javascript
//++++++++++++++++++++++

const destJs = './build/js/';

const globalBrowserifyOpts = {
    paths: [
        './node_modules', 
        './bower_components/',
	],
    debug: true
};

const bundle = (b, bundleName, bundleDest) => {
    return b.bundle()
        .on('error', err => {
            gutil.log(gutil.colors.red(Error ('Browserify Error: ') + err.message));
            this.emit('end');
        })
        .pipe(source(bundleName))
        // .pipe(buffer())
        // .pipe(sourcemaps.init({loadMaps: true}))
        // .pipe(gulp.dest(destJs))
        // .pipe(rename(bundleName.replace('debug', 'min')))
        // .pipe(uglify())
        // .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(bundleDest));
};

const setUpBrowserify = (browserifyOpts, bundleName, bundleDest) => {
    const opts = assign( {}, watchify.args, globalBrowserifyOpts, browserifyOpts );
    const b = watchify( browserify(opts) ); 
        b.transform(babelify);
        b.on('update', () => {
            bundle(b, bundleName, bundleDest);
        });
        b.on('log', gutil.log);
    return b;
};

// Define Browserify bundles, setup Browserify tasks and gulp tasks
// MAIN BUNDLE
const mainBundleOpts = {
    entry: './app/index.js',
    bundleFilename: 'app.debug.js',
    bundleDest: destJs
};
const mainBundle = setUpBrowserify({
        entries: [mainBundleOpts.entry]
    },
    mainBundleOpts.bundleFilename,
    mainBundleOpts.bundleDest
);
gulp.task('modules:app-js', () => bundle(mainBundle, mainBundleOpts.bundleFilename, mainBundleOpts.bundleDest));

//++++++++++++++++++++++
//+ Lint
//++++++++++++++++++++++

gulp.task('lint:js', () => {
	return gulp.src(['./app/**/*.{js,jsx}'])
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('lint:html', () => {
	return gulp.src(['./app/**/*.html'])
		.pipe(htmlhint('./htmlhintrc.json'))
		.pipe(htmlhint.reporter())
});

//++++++++++++++++++++++
//+ Copy
//++++++++++++++++++++++

gulp.task('copy:html', () => {
	return gulp.src('./app/index.html')
		.pipe(gulp.dest('./build/'));
});

gulp.task('copy:package-bundles', () => {
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

gulp.task('clean:build', callback => del(['./build/'], callback));

gulp.task('clean:js-modules', callback => del(['./build/**/*.js', '!./build/bundles/*.*'], callback));

gulp.task('clean:css-modules', callback => del(['./build/**/*.css', '!./build/bundles/*.*'], callback));


//++++++++++++++++++++++
//+ Server
//++++++++++++++++++++++

gulp.task('serve:dev', () => {
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
gulp.task('test', done => {
	Server.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, result => {
		if ( result === 0 ){
			done();
		} else if ( result === 1 ) {
			gutil.log(gutil.colors.bgRed(new Error('Failing tests. Please fix tests before continuing ')));
		}
	});
});

// TDD test task
gulp.task('test:dev', done => {
	 Server.start({
		configFile: __dirname + '/karma.conf.js',
		autoWatch: true
	}, () => {
		done();
	});
});

//++++++++++++++++++++++
//+ Todo
//++++++++++++++++++++++

gulp.task('todo', ()  => {
	return gulp.src([
		'./app/**/*.js',
		'./styles/**/*.less'
	], { base: './' })
	.pipe(todo())
	.pipe(gulp.dest('./'));
});

//++++++++++++++++++++++
//+ Watch
//++++++++++++++++++++++

gulp.task('watch:less', () => {
	return gulp.watch([
		'styles/**/*.less'
	], ['modules:app-less']);
});

gulp.task('watch:html', () => {
	return gulp.watch([
		'app/**/*.html'
	], ['copy:html', 'lint:html']);
});

gulp.task('watch:js', () => {
	return gulp.watch([
		'app/**/*.js'
	], ['lint:js']);
});
