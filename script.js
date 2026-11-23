document.addEventListener('DOMContentLoaded', () => {
  // =========================================
  // 1. LIVE DIGITAL CLOCK (Format: HH.MM)
  // =========================================
  const compactClock = document.getElementById('compactClock');
  const expandedClock = document.getElementById('expandedClock');

  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formatted = `${hours}.${minutes}`;
    compactClock.textContent = formatted;
    expandedClock.textContent = formatted;
  }

  updateClock();
  setInterval(updateClock, 10000);

  // =========================================
  // 2. NOTCH EXPAND / COLLAPSE INTERACTION
  // =========================================
  const notchWidget = document.getElementById('notchWidget');
  const notchCompact = document.getElementById('notchCompact');
  const btnCollapse = document.getElementById('btnCollapse');
  const toggleModeChip = document.getElementById('toggleModeChip');

  let isExpanded = false;

  function setNotchMode(expand) {
    isExpanded = expand;
    if (isExpanded) {
      notchWidget.classList.remove('is-compact');
      notchWidget.classList.add('is-expanded');
      toggleModeChip.textContent = 'Switch ke Mode Compact';
    } else {
      notchWidget.classList.remove('is-expanded');
      notchWidget.classList.add('is-compact');
      toggleModeChip.textContent = 'Switch ke Mode Expanded';
    }
  }

  notchCompact.addEventListener('click', () => setNotchMode(true));
  btnCollapse.addEventListener('click', (e) => {
    e.stopPropagation();
    setNotchMode(false);
  });
  toggleModeChip.addEventListener('click', () => setNotchMode(!isExpanded));

  // =========================================
  // 3. DEMO PLAYLIST & SYNCED LYRICS ENGINE
  // =========================================
  const playlist = [
    {
      title: 'Rasah Bali',
      artist: 'Lavora',
      artLabel: 'Rasah<br/>Bali',
      artGradient: 'linear-gradient(135deg, #d7d4cd 0%, #8f8a81 100%)',
      duration: 264, // 4:24
      startTime: 71, // 1:11
      lyrics: [
        { time: 0, text: 'Opo ora ngerti roso ati iki' },
        { time: 45, text: 'Biyen kowe tau ngelarani' },
        { time: 60, text: 'Tatu uwis mari, ora arep baleni' },
        { time: 70, text: 'Nimas, aku uwis ora sudi' },
        { time: 82, text: 'Wis saben dinane mung mikirke kowe' },
        { time: 96, text: 'Mergo aku wes kadung jeru tresnoku' },
        { time: 112, text: 'Nanging kabeh saiki wes dadi kenangan' }
      ]
    },
    {
      title: 'Night Drive',
      artist: 'Rashfox Synth',
      artLabel: 'Night<br/>Drive',
      artGradient: 'linear-gradient(135deg, #38bdf8 0%, #312e81 100%)',
      duration: 195,
      startTime: 24,
      lyrics: [
        { time: 0, text: 'City lights fading in the rearview' },
        { time: 18, text: 'Cruising past midnight under neon skies' },
        { time: 35, text: 'Zero distractions on the top of my screen' },
        { time: 52, text: 'Smooth transitions in every single frame' }
      ]
    }
  ];

  let currentTrackIndex = 0;
  let currentSec = playlist[0].startTime;
  let isPlaying = true;

  // DOM References
  const trackTitle = document.getElementById('trackTitle');
  const trackArtist = document.getElementById('trackArtist');
  const albumArt = document.getElementById('albumArt');
  const currentTimeEl = document.getElementById('currentTimeEl');
  const remainingTimeEl = document.getElementById('remainingTimeEl');
  const progressFill = document.getElementById('progressFill');
  const progressTrack = document.getElementById('progressTrack');
  const playStatusLabel = document.getElementById('playStatusLabel');

  const compactLyric = document.getElementById('compactLyric');
  const lyricPrev = document.getElementById('lyricPrev');
  const lyricCurrent = document.getElementById('lyricCurrent');
  const lyricNext = document.getElementById('lyricNext');

  const btnPlayPause = document.getElementById('btnPlayPause');
  const iconPause = document.getElementById('iconPause');
  const iconPlay = document.getElementById('iconPlay');
  const btnRewind = document.getElementById('btnRewind');
  const btnForward = document.getElementById('btnForward');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');

  function formatTime(sec) {
    const safeSec = Math.max(0, Math.floor(sec));
    const m = Math.floor(safeSec / 60);
    const s = String(safeSec % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  function renderPlayerState() {
    const track = playlist[currentTrackIndex];
    const progressPercent = Math.min(100, Math.max(0, (currentSec / track.duration) * 100));

    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    albumArt.style.background = track.artGradient;
    albumArt.innerHTML = `<span class="art-title">${track.artLabel}</span>`;

    currentTimeEl.textContent = formatTime(currentSec);
    remainingTimeEl.textContent = `-${formatTime(track.duration - currentSec)}`;
    progressFill.style.width = `${progressPercent}%`;

    // Find active lyric index
    let activeIdx = 0;
    for (let i = 0; i < track.lyrics.length; i++) {
      if (currentSec >= track.lyrics[i].time) {
        activeIdx = i;
      } else {
        break;
      }
    }

    const prevLine = track.lyrics[activeIdx - 1]?.text || '♪ • • •';
    const currLine = track.lyrics[activeIdx]?.text || track.title;
    const nextLine = track.lyrics[activeIdx + 1]?.text || '♪ • • •';

    lyricPrev.textContent = prevLine;
    lyricCurrent.textContent = currLine;
    lyricNext.textContent = nextLine;
    compactLyric.textContent = currLine;
  }

  function loadTrack(index) {
    currentTrackIndex = (index + playlist.length) % playlist.length;
    currentSec = playlist[currentTrackIndex].startTime;
    renderPlayerState();
  }

  // Playback Tick
  setInterval(() => {
    if (!isPlaying) return;
    const track = playlist[currentTrackIndex];
    currentSec += 1;
    if (currentSec >= track.duration) {
      loadTrack(currentTrackIndex + 1);
    } else {
      renderPlayerState();
    }
  }, 1000);

  // Play / Pause Toggle
  btnPlayPause.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playStatusLabel.textContent = isPlaying ? 'PLAYING' : 'PAUSED';
    iconPause.classList.toggle('hidden', !isPlaying);
    iconPlay.classList.toggle('hidden', isPlaying);
  });

  // Seek -10s / +10s
  btnRewind.addEventListener('click', () => {
    currentSec = Math.max(0, currentSec - 10);
    renderPlayerState();
  });

  btnForward.addEventListener('click', () => {
    const max = playlist[currentTrackIndex].duration;
    currentSec = Math.min(max, currentSec + 10);
    renderPlayerState();
  });

  // Click on Progress Bar to Seek
  progressTrack.addEventListener('click', (e) => {
    const rect = progressTrack.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    currentSec = Math.floor(ratio * playlist[currentTrackIndex].duration);
    renderPlayerState();
  });

  // Prev / Next Track
  btnPrev.addEventListener('click', () => loadTrack(currentTrackIndex - 1));
  btnNext.addEventListener('click', () => loadTrack(currentTrackIndex + 1));

  // Initial Render
  renderPlayerState();

  // =========================================
  // 4. QUICK ACTIONS INTERACTIVITY
  // =========================================
  const mockupToast = document.getElementById('mockupToast');
  let toastTimeout;

  function showToast(message) {
    mockupToast.textContent = message;
    mockupToast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      mockupToast.classList.remove('show');
    }, 1800);
  }

  // Toggle buttons (Wi-Fi, Bluetooth, Mic, Airplane)
  document.querySelectorAll('.action-btn[data-toggle="true"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const active = btn.classList.toggle('is-active');
      const stateText = active ? 'ON' : 'OFF';
      btn.querySelector('.toggle-state').textContent = stateText;
      showToast(`${btn.dataset.name}: ${stateText}`);
    });
  });

  // Volume Cycle Button
  const btnVolume = document.getElementById('btnVolume');
  const volumeLabel = document.getElementById('volumeLabel');
  const volumeLevels = ['10%', '45%', '80%', '100%', 'MUTE'];
  let volIdx = 0;

  btnVolume.addEventListener('click', () => {
    volIdx = (volIdx + 1) % volumeLevels.length;
    const currentVol = volumeLevels[volIdx];
    volumeLabel.textContent = currentVol;
    btnVolume.classList.toggle('is-active', currentVol !== 'MUTE');
    showToast(`Volume Sistem: ${currentVol}`);
  });

  // Settings Button Feedback
  document.getElementById('btnSettings').addEventListener('click', () => {
    showToast('Membuka Pengaturan Notch-Desktop...');
  });
});