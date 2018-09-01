#!/usr/bin/env node

var path = require('path')
var childProcess = require('child_process')

var FILENAME = path.join(__dirname, 'theme.mp3')

if(process.platform == 'win32') {
  return require('cmdmp3').play(FILENAME)
}

var bin = 'play'
var args = [FILENAME]

if (process.platform == 'darwin') bin = 'afplay'
if (process.platform == 'win32') {
  bin = 'powershell'
  args = ['-c', 'Add-Type -AssemblyName PresentationCore; ' +
                '$MediaPlayer = New-Object System.Windows.Media.Mediaplayer; ' +
                '$MediaPlayer.Open("' + FILENAME + '"); ' +
                '$MediaPlayer.Play(); ' +
                'Start-Sleep 273']
}

if (has('mplayer')) {
  bin = 'mplayer'
  args = ['-really-quiet', FILENAME]
}

var proc
var respawn = true

play()

function play () {
  if (!respawn) return

  proc = childProcess.spawn(bin, args)
  proc.stdout.resume()
  proc.stderr.resume()
  proc.unref()
  proc.on('exit', play)

  if (process.argv[2]) {
    proc.stdout.unref()
    proc.stderr.unref()
    proc.stdin.unref()
  }
}

function has (cmd) {
  try {
    childProcess.execSync('which ' + cmd + ' 2>/dev/null 2>/dev/null')
    return true
  } catch (err) {
    return false
  }
}

if (process.argv[2]) {
  childProcess.spawn(process.argv[2], process.argv.slice(3), {
    stdio: 'inherit'
  })
}

process.on('exit', function () {
  respawn = false
  proc.kill()
})
