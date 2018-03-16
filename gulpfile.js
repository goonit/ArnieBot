const gulp = require('gulp');
const gulpTs = require('gulp-typescript');
const del = require('del');
const tslint = require('tslint');

const project = gulpTs.createProject('tsconfig.json');
const linter = tslint.Linter.createProgram('tsconfig.json');

let _gulpTsLint;
const gulpTsLint = () => (_gulpTsLint = _gulpTsLint || require('gulp-tslint'));

gulp.task('default', ['lint', 'build']);

gulp.task('lint', () => {
	gulp
		.src(['./src/**/*.ts'])
		.pipe(
			gulpTsLint()({
				configuration: 'tslint.json',
				formatter: 'prose',
				program: linter
			})
		)
		.pipe(gulpTsLint().report());
});

gulp.task('build', () => {
	del.sync(['dist/**/*.*']);
	del.sync(['typings/**/*.*']);

	const tsCompile = gulp.src('./src/**/*.ts').pipe(project());
	tsCompile.pipe(gulp.dest('dist/'));
	gulp.src('./src/**/*.js').pipe(gulp.dest('dist/'));
	gulp.src('./src/**.json').pipe(gulp.dest('dist/'));
	return tsCompile.js.pipe(gulp.dest('dist/'));
});
