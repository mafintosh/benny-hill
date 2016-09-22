#!/usr/bin/env node

var path = require('path')
var childProcess = require('child_process')

var FILENAME = path.join(__dirname, 'theme.mp3')

var bin = 'play'
var args = [FILENAME]

if (process.platform == 'darwin') bin = 'afplay'

var proc = childProcess.spawn(bin, args)

proc.stdout.resume()
proc.stderr.resume()
proc.unref()

if (process.argv[2]) {
  proc.stdout.unref()
  proc.stderr.unref()
  proc.stdin.unref()

  childProcess.spawn(process.argv[2], process.argv.slice(3), {
    stdio: 'inherit'
  })
}

process.on('exit', function () {
  proc.kill()
})
