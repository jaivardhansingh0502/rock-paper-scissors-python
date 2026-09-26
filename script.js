/**
 * CYBER CLASH // STONE PAPER SCISSORS GAME ENGINE
 * Core Logic 100% Compatible with Python main.py
 * 
 * Mapping:
 * 1 = Stone, 0 = Paper, -1 = Scissor
 */

(function () {
  'use strict';

  // --- PYTHON COMPATIBLE CONSTANTS ---
  const D = {
    "Stone": 1,
    "Paper": 0,
    "Scissor": -1
  };

  const REVERSE = {
    1: "Stone",
    0: "Paper",
    "-1": "Scissor"
  };

  const WEAPON_ICONS = {
    "Stone": "🪨",
    "Paper": "📄",
    "Scissor": "✂️"
  };

  // --- AUDIO SYNTHESIZER ENGINE (Web Audio API) ---
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.sfxEnabled = true;
      this.bgmEnabled = false;
      this.bgmInterval = null;
      this.bgmNoteIndex = 0;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(freq, type = 'sine', duration = 0.15, vol = 0.2) {
      if (!this.sfxEnabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        console.warn('Audio play failed', e);
      }
    }

    playClash() {
      if (!this.sfxEnabled) return;
      this.init();
      if (!this.ctx) return;
      // White noise punch + low bass drop
      try {
        const bufferSize = this.ctx.sampleRate * 0.15;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();

        this.playTone(90, 'triangle', 0.25, 0.4);
      } catch (e) {}
    }

    playWin() {
      if (!this.sfxEnabled) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        setTimeout(() => this.playTone(freq, 'triangle', 0.2, 0.25), idx * 70);
      });
    }

    playLose() {
      if (!this.sfxEnabled) return;
      const notes = [400, 350, 280, 200];
      notes.forEach((freq, idx) => {
        setTimeout(() => this.playTone(freq, 'sawtooth', 0.18, 0.2), idx * 90);
      });
    }

    playDraw() {
      if (!this.sfxEnabled) return;
      this.playTone(440, 'sine', 0.1, 0.2);
      setTimeout(() => this.playTone(440, 'sine', 0.18, 0.2), 120);
    }

    toggleBGM() {
      this.init();
      this.bgmEnabled = !this.bgmEnabled;
      if (this.bgmEnabled) {
        this.startBGM();
      } else {
        this.stopBGM();
      }
      return this.bgmEnabled;
    }

    startBGM() {
      if (this.bgmInterval) clearInterval(this.bgmInterval);
      // Synthwave bassline arpeggio notes
      const bassline = [110, 110, 130.81, 110, 146.83, 110, 164.81, 146.83];
      this.bgmInterval = setInterval(() => {
        if (!this.bgmEnabled || !this.ctx) return;
        const freq = bassline[this.bgmNoteIndex % bassline.length];
        this.playTone(freq, 'sawtooth', 0.1, 0.04);
        this.bgmNoteIndex++;
      }, 200);
    }

    stopBGM() {
      if (this.bgmInterval) {
        clearInterval(this.bgmInterval);
        this.bgmInterval = null;
      }
    }
  }

  // --- PARTICLE PHYSICS ENGINE ---
  class ParticleEngine {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.particles = [];
      this.bursts = [];
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.init();
    }

    init() {
      if (!this.canvas) return;
      this.resize();
      window.addEventListener('resize', () => this.resize());
      
      // Seed ambient background particles
      for (let i = 0; i < 45; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          radius: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -Math.random() * 0.5 - 0.2,
          alpha: Math.random() * 0.6 + 0.2,
          color: Math.random() > 0.5 ? '#00f2fe' : '#ff0844'
        });
      }

      this.loop = this.loop.bind(this);
      requestAnimationFrame(this.loop);
    }

    resize() {
      if (!this.canvas) return;
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    createExplosion(x, y, color = '#00f2fe', count = 35) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        this.bursts.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 4 + 2,
          alpha: 1,
          color: color,
          gravity: 0.12,
          decay: Math.random() * 0.02 + 0.015
        });
      }
    }

    loop() {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Ambient particles
      this.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) p.y = this.height;
        if (p.x < 0) p.x = this.width;
        if (p.x > this.width) p.x = 0;

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.alpha;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = p.color;
        this.ctx.fill();
      });

      // Explosion sparks
      for (let i = this.bursts.length - 1; i >= 0; i--) {
        const b = this.bursts[i];
        b.x += b.vx;
        b.y += b.vy;
        b.vy += b.gravity;
        b.alpha -= b.decay;

        if (b.alpha <= 0) {
          this.bursts.splice(i, 1);
          continue;
        }

        this.ctx.beginPath();
        this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = b.color;
        this.ctx.globalAlpha = b.alpha;
        this.ctx.shadowBlur = 12;
        this.ctx.shadowColor = b.color;
        this.ctx.fill();
      }

      this.ctx.globalAlpha = 1;
      this.ctx.shadowBlur = 0;
      requestAnimationFrame(this.loop);
    }
  }

  // --- MAIN GAME STATE & CONTROLLER ---
  class CyberClashGame {
    constructor() {
      // Scoreboard from main.py
      this.PlayerScore = 0;
      this.ComputerScore = 0;
      this.draws = 0;
      this.round = 1;
      this.currentStreak = 0;
      this.bestStreak = parseInt(localStorage.getItem('rps_best_streak') || '0', 10);
      this.totalGames = parseInt(localStorage.getItem('rps_total_games') || '0', 10);
      this.totalWins = parseInt(localStorage.getItem('rps_total_wins') || '0', 10);
      this.weaponUsage = JSON.parse(localStorage.getItem('rps_weapon_usage') || '{"Stone":0,"Paper":0,"Scissor":0}');

      // Game Modes: 'classic', 'bestof', 'survival', 'boss'
      this.gameMode = 'classic';
      this.targetWins = 3; // For best-of-5
      this.bossHp = 100;
      this.bossMaxHp = 100;
      
      // Timer for survival blitz
      this.timerInterval = null;
      this.timeLeft = 3.0;

      this.isClashing = false;
      this.historyLog = [];

      this.sound = new SoundEngine();
      this.particles = new ParticleEngine('bg-canvas');

      this.cacheDOMElements();
      this.bindEvents();
      this.updateStatsModalUI();
    }

    cacheDOMElements() {
      // Scoreboard
      this.playerScoreEl = document.getElementById('player-score');
      this.cpuScoreEl = document.getElementById('cpu-score');
      this.roundCounterEl = document.getElementById('round-counter-display');
      this.currentModeLabelEl = document.getElementById('current-mode-label');
      this.playerStreakEl = document.getElementById('player-streak');
      this.cpuNameEl = document.getElementById('cpu-name');
      this.cpuAvatarEl = document.getElementById('cpu-avatar');

      // Arena holograms
      this.arenaEl = document.getElementById('battle-arena');
      this.fighterLeftEl = document.getElementById('fighter-left');
      this.fighterRightEl = document.getElementById('fighter-right');
      this.playerChoiceHolo = document.getElementById('player-choice-holo');
      this.playerChoiceIcon = document.getElementById('player-choice-icon');
      this.playerChoiceLabel = document.getElementById('player-choice-label');
      this.cpuChoiceHolo = document.getElementById('cpu-choice-holo');
      this.cpuChoiceIcon = document.getElementById('cpu-choice-icon');
      this.cpuChoiceLabel = document.getElementById('cpu-choice-label');

      // Clash result
      this.resultHeadlineEl = document.getElementById('result-headline');
      this.resultSubtextEl = document.getElementById('result-subtext');
      this.historyListEl = document.getElementById('history-list');

      // Survival Timer & Boss elements
      this.timerContainerEl = document.getElementById('timer-container');
      this.timerBarEl = document.getElementById('timer-bar');
      this.timerTextEl = document.getElementById('timer-text');
      this.bossHealthContainerEl = document.getElementById('boss-health-container');
      this.bossTitleEl = document.getElementById('boss-title');
      this.bossHpFillEl = document.getElementById('boss-hp-fill');

      // Modals
      this.gameoverModal = document.getElementById('gameover-modal');
      this.modalPlayerScore = document.getElementById('modal-player-score');
      this.modalCpuScore = document.getElementById('modal-cpu-score');
      this.modalWinnerText = document.getElementById('modal-winner-text');
      this.modalResultIcon = document.getElementById('modal-result-icon');
      this.modalStatsBreakdown = document.getElementById('modal-stats-breakdown');

      this.helpModal = document.getElementById('help-modal');
      this.statsModal = document.getElementById('stats-modal');

      // Audio buttons
      this.sfxToggleBtn = document.getElementById('sfx-toggle');
      this.bgmToggleBtn = document.getElementById('bgm-toggle');
    }

    bindEvents() {
      // Weapon button clicks
      document.querySelectorAll('.weapon-card').forEach(card => {
        card.addEventListener('click', () => {
          const choice = card.getAttribute('data-choice');
          this.handlePlayerMove(choice);
        });
        card.addEventListener('mouseenter', () => {
          this.sound.playTone(700, 'sine', 0.05, 0.05);
        });
      });

      // Mode switch buttons
      document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.setGameMode(btn.getAttribute('data-mode'));
        });
      });

      // Quick actions
      document.getElementById('btn-reset-match').addEventListener('click', () => {
        this.resetMatch();
        this.showToast('Match scoreboard reset!');
      });

      document.getElementById('btn-end-match').addEventListener('click', () => {
        this.showFinalScoreModal();
      });

      document.getElementById('btn-random-pick').addEventListener('click', () => {
        const keys = ['Stone', 'Paper', 'Scissor'];
        const randomChoice = keys[Math.floor(Math.random() * keys.length)];
        this.handlePlayerMove(randomChoice);
      });

      document.getElementById('clear-log-btn').addEventListener('click', () => {
        this.historyLog = [];
        this.renderHistory();
      });

      // Modal buttons
      document.getElementById('btn-play-again').addEventListener('click', () => {
        this.gameoverModal.classList.remove('active');
        this.resetMatch();
      });

      document.getElementById('btn-close-modal').addEventListener('click', () => {
        this.gameoverModal.classList.remove('active');
      });

      // Audio toggles
      this.sfxToggleBtn.addEventListener('click', () => {
        this.sound.sfxEnabled = !this.sound.sfxEnabled;
        this.sfxToggleBtn.classList.toggle('active', this.sound.sfxEnabled);
        this.sfxToggleBtn.querySelector('.btn-icon').textContent = this.sound.sfxEnabled ? '🔊' : '🔇';
        this.showToast(this.sound.sfxEnabled ? 'SFX Enabled' : 'SFX Muted');
      });

      this.bgmToggleBtn.addEventListener('click', () => {
        const active = this.sound.toggleBGM();
        this.bgmToggleBtn.classList.toggle('active', active);
        this.showToast(active ? 'Synthwave BGM Started 🎵' : 'BGM Paused');
      });

      // Info modals
      document.getElementById('help-toggle').addEventListener('click', () => {
        this.helpModal.classList.add('active');
      });
      document.getElementById('btn-close-help').addEventListener('click', () => {
        this.helpModal.classList.remove('active');
      });

      document.getElementById('stats-toggle').addEventListener('click', () => {
        this.updateStatsModalUI();
        this.statsModal.classList.add('active');
      });
      document.getElementById('btn-close-stats').addEventListener('click', () => {
        this.statsModal.classList.remove('active');
      });

      // Keyboard support
      window.addEventListener('keydown', (e) => {
        if (this.gameoverModal.classList.contains('active')) {
          if (e.key.toUpperCase() === 'Y' || e.key === 'Enter') {
            this.gameoverModal.classList.remove('active');
            this.resetMatch();
          }
          return;
        }

        const k = e.key.toLowerCase();
        if (k === '1' || k === 's') this.handlePlayerMove('Stone');
        else if (k === '2' || k === 'p') this.handlePlayerMove('Paper');
        else if (k === '3' || k === 'c') this.handlePlayerMove('Scissor');
        else if (k === 'r') {
          const keys = ['Stone', 'Paper', 'Scissor'];
          this.handlePlayerMove(keys[Math.floor(Math.random() * keys.length)]);
        }
      });
    }

    setGameMode(mode) {
      this.gameMode = mode;
      this.resetMatch();

      this.timerContainerEl.style.display = (mode === 'survival') ? 'block' : 'none';
      this.bossHealthContainerEl.style.display = (mode === 'boss') ? 'block' : 'none';

      if (mode === 'classic') {
        this.currentModeLabelEl.textContent = 'ENDLESS ARCADE (main.py)';
        this.cpuNameEl.textContent = 'AI Core';
        this.cpuAvatarEl.textContent = '🤖';
      } else if (mode === 'bestof') {
        this.currentModeLabelEl.textContent = 'TOURNAMENT (FIRST TO 3)';
        this.cpuNameEl.textContent = 'Grandmaster Bot';
        this.cpuAvatarEl.textContent = '👾';
      } else if (mode === 'survival') {
        this.currentModeLabelEl.textContent = 'SURVIVAL BLITZ (3s / MOVE)';
        this.cpuNameEl.textContent = 'Blitz Cyber';
        this.cpuAvatarEl.textContent = '⚡';
        this.startSurvivalTimer();
      } else if (mode === 'boss') {
        this.currentModeLabelEl.textContent = 'BOSS RAID (100 HP)';
        this.cpuNameEl.textContent = 'CYBER TITAN';
        this.cpuAvatarEl.textContent = '👹';
        this.bossHp = 100;
        this.updateBossHpUI();
      }

      this.showToast(`Mode switched to ${this.currentModeLabelEl.textContent}`);
    }

    startSurvivalTimer() {
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.timeLeft = 3.0;
      this.timerBarEl.style.width = '100%';
      this.timerTextEl.textContent = '3.0s';

      this.timerInterval = setInterval(() => {
        this.timeLeft -= 0.1;
        if (this.timeLeft <= 0) {
          this.timeLeft = 0;
          clearInterval(this.timerInterval);
          this.timerTextEl.textContent = 'TIME UP!';
          this.showToast('Time expired! Auto pick randomly.');
          const keys = ['Stone', 'Paper', 'Scissor'];
          this.handlePlayerMove(keys[Math.floor(Math.random() * keys.length)]);
        } else {
          this.timerTextEl.textContent = this.timeLeft.toFixed(1) + 's';
          this.timerBarEl.style.width = ((this.timeLeft / 3.0) * 100) + '%';
        }
      }, 100);
    }

    // --- MAIN GAME LOGIC (Exact Python main.py parity) ---
    handlePlayerMove(MyChoice) {
      if (this.isClashing) return;
      this.isClashing = true;

      // Track weapon usage
      this.weaponUsage[MyChoice] = (this.weaponUsage[MyChoice] || 0) + 1;
      localStorage.setItem('rps_weapon_usage', JSON.stringify(this.weaponUsage));

      // 1. Python mapping:
      // D = {"Stone" : 1 , "Paper" : 0,"Scissor" : -1}
      const choice = D[MyChoice];

      // 2. Python CPU pick:
      // computer = random.choice([-1,0,1])
      const choices = [-1, 0, 1];
      let computer;
      
      // Boss smart AI logic option or standard random
      if (this.gameMode === 'boss' && Math.random() < 0.25) {
        // Boss predicts player move and counter-picks sometimes
        if (choice === 1) computer = 0; // Paper wraps Stone
        else if (choice === 0) computer = -1; // Scissor cuts Paper
        else computer = 1; // Stone crushes Scissor
      } else {
        computer = choices[Math.floor(Math.random() * choices.length)];
      }

      const cpuChoiceName = REVERSE[computer];

      // 3. Trigger cinematic battle animation
      this.playBattleAnimation(MyChoice, cpuChoiceName, () => {
        // 4. Python main.py Evaluation logic:
        let result = ''; // 'win', 'lose', 'draw'
        let message = '';
        let submessage = `You chose ${MyChoice} • Computer chose ${cpuChoiceName}`;

        if (computer === choice) {
          // Draw!\nTry Again!
          result = 'draw';
          message = '🤝 ROUND DRAW!';
          this.draws++;
          this.sound.playDraw();
        } else {
          if (computer === 1 && choice === 0) {
            // computer == 1 (Stone) and choice == 0 (Paper) => You win!
            result = 'win';
            message = '🎉 YOU WIN! Paper wraps Stone';
            this.PlayerScore++;
          } else if (computer === 1 && choice === -1) {
            // computer == 1 (Stone) and choice == -1 (Scissor) => You lose!
            result = 'lose';
            message = '💥 YOU LOSE! Stone crushes Scissor';
            this.ComputerScore++;
          } else if (computer === 0 && choice === -1) {
            // computer == 0 (Paper) and choice == -1 (Scissor) => You win!
            result = 'win';
            message = '🎉 YOU WIN! Scissor cuts Paper';
            this.PlayerScore++;
          } else if (computer === 0 && choice === 1) {
            // computer == 0 (Paper) and choice == 1 (Stone) => You lose!
            result = 'lose';
            message = '💥 YOU LOSE! Paper wraps Stone';
            this.ComputerScore++;
          } else if (computer === -1 && choice === 0) {
            // computer == -1 (Scissor) and choice == 0 (Paper) => You lose!
            result = 'lose';
            message = '💥 YOU LOSE! Scissor cuts Paper';
            this.ComputerScore++;
          } else if (computer === -1 && choice === 1) {
            // computer == -1 (Scissor) and choice == 1 (Stone) => You win!
            result = 'win';
            message = '🎉 YOU WIN! Stone crushes Scissor';
            this.PlayerScore++;
          } else {
            result = 'error';
            message = 'Something went wrong1';
          }
        }

        // Post-round updates
        this.processRoundResult(result, message, submessage, MyChoice, cpuChoiceName);
        this.isClashing = false;

        // Reset survival timer if active
        if (this.gameMode === 'survival') {
          this.startSurvivalTimer();
        }
      });
    }

    playBattleAnimation(playerChoice, cpuChoice, callback) {
      // Audio SFX
      this.sound.playTone(400, 'square', 0.1, 0.15);
      
      // Update holograms with fighting icons
      this.playerChoiceIcon.textContent = WEAPON_ICONS[playerChoice];
      this.playerChoiceLabel.textContent = playerChoice.toUpperCase();
      this.cpuChoiceIcon.textContent = '❓';
      this.cpuChoiceLabel.textContent = 'SCANNING...';

      // Animate fighters slamming forward
      this.fighterLeftEl.classList.add('clash-anim-left');
      this.fighterRightEl.classList.add('clash-anim-right');
      this.arenaEl.classList.add('arena-shake');

      // Midpoint revelation
      setTimeout(() => {
        this.cpuChoiceIcon.textContent = WEAPON_ICONS[cpuChoice];
        this.cpuChoiceLabel.textContent = cpuChoice.toUpperCase();
        this.sound.playClash();

        // Spawn particle blast at center arena
        const rect = this.arenaEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        this.particles.createExplosion(centerX, centerY, '#00f2fe', 40);
        this.particles.createExplosion(centerX, centerY, '#ff0844', 30);
      }, 250);

      // Finish clash
      setTimeout(() => {
        this.fighterLeftEl.classList.remove('clash-anim-left');
        this.fighterRightEl.classList.remove('clash-anim-right');
        this.arenaEl.classList.remove('arena-shake');
        if (callback) callback();
      }, 550);
    }

    processRoundResult(result, message, submessage, playerChoice, cpuChoice) {
      this.round++;
      this.totalGames++;
      localStorage.setItem('rps_total_games', this.totalGames.toString());

      if (result === 'win') {
        this.currentStreak++;
        this.totalWins++;
        localStorage.setItem('rps_total_wins', this.totalWins.toString());
        if (this.currentStreak > this.bestStreak) {
          this.bestStreak = this.currentStreak;
          localStorage.setItem('rps_best_streak', this.bestStreak.toString());
        }
        this.sound.playWin();
        this.playerChoiceHolo.querySelector('.holo-icon').classList.add('winner-glow-cyan');
        setTimeout(() => this.playerChoiceHolo.querySelector('.holo-icon').classList.remove('winner-glow-cyan'), 1200);

        if (this.gameMode === 'boss') {
          this.bossHp = Math.max(0, this.bossHp - 25);
          this.updateBossHpUI();
        }
      } else if (result === 'lose') {
        this.currentStreak = 0;
        this.sound.playLose();
        this.cpuChoiceHolo.querySelector('.holo-icon').classList.add('winner-glow-magenta');
        setTimeout(() => this.cpuChoiceHolo.querySelector('.holo-icon').classList.remove('winner-glow-magenta'), 1200);

        if (this.gameMode === 'boss') {
          // Boss counterattacks
          this.showToast('💥 Cyber Titan dealt critical damage!');
        }
      } else {
        this.currentStreak = 0;
      }

      // Update UI displays
      this.playerScoreEl.textContent = this.PlayerScore;
      this.cpuScoreEl.textContent = this.ComputerScore;
      this.roundCounterEl.textContent = `ROUND ${this.round}`;
      this.playerStreakEl.textContent = this.currentStreak;
      
      this.resultHeadlineEl.textContent = message;
      this.resultHeadlineEl.style.color = (result === 'win') ? '#00f59b' : (result === 'lose') ? '#ff0844' : '#ffb703';
      this.resultSubtextEl.textContent = submessage;

      // Add to combat log
      this.historyLog.unshift({
        round: this.round - 1,
        result: result,
        player: playerChoice,
        cpu: cpuChoice,
        text: message
      });
      this.renderHistory();

      // Check mode victory conditions
      if (this.gameMode === 'bestof') {
        if (this.PlayerScore >= 3 || this.ComputerScore >= 3) {
          setTimeout(() => this.showFinalScoreModal(), 600);
        }
      } else if (this.gameMode === 'boss') {
        if (this.bossHp <= 0) {
          this.showToast('🏆 CYBER TITAN DEFEATED! YOU SAVED THE MATRIX!');
          setTimeout(() => this.showFinalScoreModal(), 800);
        }
      }
    }

    updateBossHpUI() {
      this.bossHpFillEl.style.width = `${(this.bossHp / this.bossMaxHp) * 100}%`;
      this.bossTitleEl.textContent = `🤖 CYBER TITAN [HP: ${this.bossHp}/${this.bossMaxHp}]`;
    }

    renderHistory() {
      if (this.historyLog.length === 0) {
        this.historyListEl.innerHTML = '<div class="history-empty">No rounds recorded yet. Choose a move to clash!</div>';
        return;
      }

      this.historyListEl.innerHTML = this.historyLog.slice(0, 15).map(item => `
        <div class="history-row ${item.result}">
          <span>R${item.round}: ${WEAPON_ICONS[item.player]} vs ${WEAPON_ICONS[item.cpu]}</span>
          <span>${item.result.toUpperCase()}</span>
        </div>
      `).join('');
    }

    // --- FINAL MATCH SUMMARY MODAL (matches main.py exit logic) ---
    showFinalScoreModal() {
      if (this.timerInterval) clearInterval(this.timerInterval);

      this.modalPlayerScore.textContent = this.PlayerScore;
      this.modalCpuScore.textContent = this.ComputerScore;

      // Python main.py final winner logic:
      // if PlayerScore > ComputerScore:
      //     print("Overall Winner : You 🎉")
      // elif ComputerScore > PlayerScore:
      //     print("Overall Winner : Computer 🤖")
      // else:
      //     print("Overall Match Draw 🤝")

      if (this.PlayerScore > this.ComputerScore) {
        this.modalWinnerText.textContent = "Overall Winner : You 🎉";
        this.modalWinnerText.style.color = "#00f59b";
        this.modalWinnerText.style.borderColor = "#00f59b";
        this.modalResultIcon.textContent = "🏆";
        this.sound.playWin();

        // Confetti shower
        const rect = this.gameoverModal.getBoundingClientRect();
        this.particles.createExplosion(window.innerWidth / 2, window.innerHeight / 2, '#00f59b', 60);
        this.particles.createExplosion(window.innerWidth / 2, window.innerHeight / 2, '#00f2fe', 60);
      } else if (this.ComputerScore > this.PlayerScore) {
        this.modalWinnerText.textContent = "Overall Winner : Computer 🤖";
        this.modalWinnerText.style.color = "#ff0844";
        this.modalWinnerText.style.borderColor = "#ff0844";
        this.modalResultIcon.textContent = "💀";
        this.sound.playLose();
      } else {
        this.modalWinnerText.textContent = "Overall Match Draw 🤝";
        this.modalWinnerText.style.color = "#ffb703";
        this.modalWinnerText.style.borderColor = "#ffb703";
        this.modalResultIcon.textContent = "🤝";
        this.sound.playDraw();
      }

      this.modalStatsBreakdown.innerHTML = `
        <div class="stat-card" style="width: 100%;">
          <div class="stat-label">Total Rounds: ${this.round - 1} | Draws: ${this.draws} | Win Streak: ${this.currentStreak}</div>
        </div>
      `;

      this.gameoverModal.classList.add('active');
    }

    resetMatch() {
      this.PlayerScore = 0;
      this.ComputerScore = 0;
      this.draws = 0;
      this.round = 1;
      this.currentStreak = 0;
      if (this.gameMode === 'boss') this.bossHp = 100;

      this.playerScoreEl.textContent = '0';
      this.cpuScoreEl.textContent = '0';
      this.roundCounterEl.textContent = 'ROUND 1';
      this.playerStreakEl.textContent = '0';
      this.resultHeadlineEl.textContent = 'MAKE YOUR MOVE';
      this.resultHeadlineEl.style.color = '#fff';
      this.resultSubtextEl.textContent = 'Choose Stone, Paper, or Scissor below';

      this.playerChoiceIcon.textContent = '❓';
      this.playerChoiceLabel.textContent = 'READY';
      this.cpuChoiceIcon.textContent = '❓';
      this.cpuChoiceLabel.textContent = 'WAITING';

      if (this.gameMode === 'survival') {
        this.startSurvivalTimer();
      } else if (this.gameMode === 'boss') {
        this.updateBossHpUI();
      }
    }

    updateStatsModalUI() {
      const winRate = this.totalGames > 0 ? Math.round((this.totalWins / this.totalGames) * 100) : 0;
      document.getElementById('stat-total-games').textContent = this.totalGames;
      document.getElementById('stat-win-rate').textContent = `${winRate}%`;
      document.getElementById('stat-best-streak').textContent = this.bestStreak;

      let fav = 'Stone';
      let maxCount = -1;
      for (const [weapon, count] of Object.entries(this.weaponUsage)) {
        if (count > maxCount) {
          maxCount = count;
          fav = weapon;
        }
      }
      document.getElementById('stat-fav-weapon').textContent = `${WEAPON_ICONS[fav] || ''} ${fav}`;
    }

    showToast(message) {
      const container = document.getElementById('toast-container');
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      container.appendChild(toast);
      setTimeout(() => {
        toast.remove();
      }, 2500);
    }
  }

  // Launch on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    window.game = new CyberClashGame();
  });
})();
