# ⚡ Cyber Clash: Stone Paper Scissors (Ultra Edition)

A high-octane Cyberpunk / Neon Arcade implementation of the classic **Stone Paper Scissors** game. Featuring a rich Web UI with battle clash animations, particle physics, retro Web Audio synthesizer, multiple game modes, and full compatibility with the original Python CLI logic!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.x-brightgreen.svg)
![HTML5](https://img.shields.io/badge/HTML5-WebAudio-orange.svg)

---

## 🎮 Features & Highlights

- ⚡ **Cinematic Battle Arena**: Screen-shaking combat clash animations with particle bursts, spark physics, and glowing holographic pedestals.
- 🎵 **Built-in Web Audio Synthesizer**: Zero external audio dependencies! Real-time sound effects for clashing, victory fanfare, defeat glitch, and procedural synthwave background music.
- 🕹️ **Multiple Game Modes**:
  - **Classic Mode**: Continuous scoreboard tracking, exactly replicating `main.py`.
  - **Best of 5 Tournament**: First to reach 3 round victories takes the championship.
  - **Survival Blitz**: 3-second rapid move timer with streak multiplier!
  - **Cyber Boss Raid**: Battle against the 100 HP *Cyber Titan* with boss-rage mechanics!
- ⌨️ **Keyboard Controls**: Instant hotkeys (`1`/`S` for Stone, `2`/`P` for Paper, `3`/`C` for Scissor, `R` for Random).
- 📊 **Career Statistics**: Persistent tracking in LocalStorage (Win rate, Best streak, Weapon usage).
- 🐍 **100% Python Parity**: Keeps the original `main.py` CLI game 100% untouched and functional.

---

## 📁 Project Structure

```text
rock-paper-scissors-python/
│── main.py            # Original Python CLI game (100% intact)
│── server.py          # Python web server (zero-dependency, auto-opens browser)
│── index.html         # Cyber Clash Neon Arena UI
│── styles.css         # Cyberpunk theme, glassmorphism, keyframe animations
│── script.js          # Web Audio synth, physics engine, clash logic & game modes
│── README.md          # Project documentation
```

---

## 🚀 Getting Started

### Option 1: Play the Web Game (via Python Server)
Run the built-in zero-dependency Python server:
```bash
python server.py
```
*This will automatically launch `http://localhost:8000` in your default browser.*

### Option 2: Play Standalone (No Server Required)
Simply double-click **`index.html`** in any modern web browser or deploy to **GitHub Pages**!

### Option 3: Play Original Python CLI Game
Run the classic terminal game as originally built:
```bash
python main.py
```

---

## 🧠 Python Logic Mapping

The mathematical logic follows the exact mapping defined in `main.py`:
- `Stone` = `1`
- `Paper` = `0`
- `Scissor` = `-1`

| Player Move | CPU Move | Result | Condition |
| :--- | :--- | :--- | :--- |
| **Paper (0)** | **Stone (1)** | **Win 🎉** | `cpu == 1 and choice == 0` |
| **Scissor (-1)** | **Paper (0)** | **Win 🎉** | `cpu == 0 and choice == -1` |
| **Stone (1)** | **Scissor (-1)** | **Win 🎉** | `cpu == -1 and choice == 1` |
| *Same* | *Same* | **Draw 🤝** | `cpu == choice` |

---

## 👤 Author

**Jaivardhan Singh**
- GitHub: [@jaivardhansingh0502](https://github.com/jaivardhansingh0502)
