// https://developer.mozilla.org/en-US/Apps/Fundamentals/Audio_and_video_delivery/cross_browser_video_player

// Get our elements
const player = document.querySelector('.player');
const videoContainer = player.querySelector('.video-container');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const progressBufferedBar = player.querySelector('.progress-buffered');
const togglePlay = player.querySelector('.toggle-play');
const toggleFullscreen = player.querySelector('.toggle-fullscreen');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

// Build out functions
function handleTogglePlay() {
  video.paused ? video.play() : video.pause();
}

function updatePlayButton() {
  togglePlay.innerHTML = video.paused ? '<i class="far fa-play-circle fa-2x"></i>' : '<i class="far fa-pause-circle fa-2x"></i>';
}

function handleToggleFullscreen() {
  if (isFullScreen()) {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
    // setFullscreenData(false);
  } else {
    if (videoContainer.requestFullscreen) videoContainer.requestFullscreen();
    else if (videoContainer.mozRequestFullScreen) videoContainer.mozRequestFullScreen();
    else if (videoContainer.webkitRequestFullScreen) videoContainer.webkitRequestFullScreen();
    else if (videoContainer.msRequestFullscreen) videoContainer.msRequestFullscreen();
    // setFullscreenData(true);
  }
  updateFullscreenButton();
}

function updateFullscreenButton() {
  if (isFullScreen()) {
    toggleFullscreen.innerHTML = '<i class="fas fa-expand fa-2x">';
  } else {
    toggleFullscreen.innerHTML = '<i class="fas fa-compress fa-2x">';
  }
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
  console.log(this.dataset.skip);
}

function handleRangeUpdate() {
  console.log(this.value);
  video[this.name] = this.value;
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

function handleBuffer(e) {
  const percent = (video.buffered.end(0) / video.duration) * 100;
  progressBufferedBar.style.flexBasis = `${percent}%`;
}

// Hook up the event listeners
video.controls = false;
let mousedown = false;
let fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);
if (!fullScreenEnabled) {
  fullscreen.style.display = 'none';
}
let isFullScreen = () => {
  return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
}

video.addEventListener('click', handleTogglePlay);
togglePlay.addEventListener('click', handleTogglePlay);
video.addEventListener('play', updatePlayButton);
video.addEventListener('pause', updatePlayButton);
toggleFullscreen.addEventListener('click', handleToggleFullscreen);
// videoContainer.addEventListener('onfullscreenchange', updateFullscreenButton);
skipButtons.forEach(skipButton => skipButton.addEventListener('click', skip));
ranges.forEach(range => {
  range.addEventListener('mousedown', () => true);
  range.addEventListener('mouseup', () => false);
  range.addEventListener('change', handleRangeUpdate);
  range.addEventListener('mousemove', () => mousedown && handleRangeUpdate);
});
video.addEventListener('timeupdate', handleProgress);
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
video.addEventListener('progress', handleBuffer);