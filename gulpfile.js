'use strict'
let fs = require('fs');
let gulp = require('gulp');
let GulpSSH = require('gulp-ssh');

let publicFolder = './public/';
var config = {
  host: 'schoolserver.local',
  port: 22,
  username: 'pi',
  password: 'raspberry'
}
var gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: config
});


gulp.task('watch', function() {
  gulp.watch(publicFolder + 'img/**/*', ['all']);
  gulp.watch(publicFolder + 'css/*.css', ['copy-css']);
  gulp.watch(publicFolder + 'js/*.css', ['copy-js']);
  gulp.watch(publicFolder + 'index.html', ['copy-index']);
  gulp.watch('index.js', ['copy-node-index']);
});

gulp.task('copy-all', function () {
  return gulp
    .src([publicFolder + '**/*', '!**/node_modules/**'])
    .pipe(gulpSSH.dest('/library/www/html/home/'))
})

gulp.task('copy-css', function () {
  return gulp
    .src([publicFolder + 'css/**/*'])
    .pipe(gulpSSH.dest('/library/www/html/home/css/'))
})

gulp.task('copy-js', function () {
  return gulp
    .src([publicFolder + 'js/**/*'])
    .pipe(gulpSSH.dest('/library/www/html/home/js/'))
})

gulp.task('copy-index', function () {
  return gulp.src(publicFolder + 'index.html')
    .pipe(gulpSSH.sftp('write', '/library/www/html/home/index.html'))
})

gulp.task('copy-node-index', function () {
  return gulp.src('index.js')
    .pipe(gulpSSH.sftp('write', '/library/www/html/home/node-couchmover.js'))
    .pipe(gulpSSH.exec(['node /library/www/html/home/node-couchmover.js'], {filePath: 'commands.log'})
    .on('ssh2Data', (chunk)=>{
      console.log(chunk.toString())
    }))
    
})

// gulp.task('all', ['copy-all']);
gulp.task('default', ['watch']);