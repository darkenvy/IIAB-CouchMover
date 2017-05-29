'use strict'
let fs = require('fs');
let gulp = require('gulp');
let GulpSSH = require('gulp-ssh');
let beep = require('beepbeep')


let publicFolder = './public/';
let config = {
  host: 'schoolserver.local',
  port: 22,
  username: 'pi',
  password: 'raspberry'
}
let gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: config
});

// -------- Everything Frontend -------- //

gulp.task('copy-all-public', function () {
  return gulp
    .src([publicFolder + '**/*', '!**/node_modules/**'])
    .pipe(gulpSSH.dest('/library/www/html/home/'))
    .on('end', ()=> {beep([250,250])})
})


gulp.task('copy-css', function () {
  return gulp
    .src([publicFolder + 'css/**/*'])
    .pipe(gulpSSH.dest('/library/www/html/home/css/'))
    .on('end', ()=> {beep([250,250])})
})

gulp.task('copy-js', function () {
  return gulp
    .src([publicFolder + 'js/**/*'])
    .pipe(gulpSSH.dest('/library/www/html/home/js/'))
    .on('end', ()=> {beep([250,250])})
})

gulp.task('copy-index', function () {
  return gulp.src(publicFolder + 'index.html')
    .pipe(gulpSSH.sftp('write', '/library/www/html/home/index.html'))
    .on('end', ()=> {beep([250,250])})
})

gulp.task('copy-couchmover', function () {
  return gulp.src(publicFolder + 'couchmover.html')
    .pipe(gulpSSH.sftp('write', '/library/www/html/home/couchmover.html'))
    .on('end', ()=> {beep([250,250])})
})

// -------- Node Backend Tool -------- //

gulp.task('copy-modules', function () {
  return gulp
    .src(['modules/**/*'])
    .pipe(gulpSSH.dest('/library/node-couchmover/modules/'))
    .on('end', ()=> {beep([250,250])})
})

gulp.task('copy-node-index', function () {
  return gulp.src('index.js')
    .pipe(gulpSSH.sftp('write', '/library/node-couchmover/node-couchmover.js'))
    // .pipe(gulpSSH.exec(['node /library/node-couchmover/node-couchmover.js'], {filePath: 'commands.log'})
    // .on('ssh2Data', (chunk)=>{
    //   console.log(chunk.toString());
    //   beep([250,250])
    // }))
})

gulp.task('copy-package-json', function () {
  return gulp.src('node-couchmover.package.json')
    .pipe(gulpSSH.sftp('write', '/library/node-couchmover/package.json'))
})


// -------- Gulp Tasks -------- //

gulp.task('watch', function() {
  gulp.watch(publicFolder + 'img/**/*', ['all']);
  gulp.watch(publicFolder + 'css/**/*.css', ['copy-css']);
  gulp.watch(publicFolder + 'js/**/*.js', ['copy-js']);
  gulp.watch(publicFolder + 'index.html', ['copy-index']);
  gulp.watch(publicFolder + 'couchmover.html', ['copy-couchmover']);
  gulp.watch('modules/**/*', ['copy-modules']);
  gulp.watch('index.js', ['copy-node-index']);
});


gulp.task('default', ['watch']);
gulp.task('all', [
  'copy-all-public', 
  'copy-modules', 
  'copy-node-index', 
  'copy-package-json'
]);