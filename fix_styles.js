
const fs = require('fs');
let text = fs.readFileSync('styles.css', 'utf8');

// I will just replace the messed up end of the file by cutting it and appending a fresh copy.
// Let's find where '/* ============================================================' 
// '   PATCH — 2-CARD VISIBLE CAROUSEL' starts and cut everything from there.

let splitIdx = text.indexOf('/* ============================================================\n   PATCH — 2-CARD VISIBLE CAROUSEL');
if (splitIdx === -1) {
  splitIdx = text.indexOf('/* ============================================================\r\n   PATCH — 2-CARD VISIBLE CAROUSEL');
}
if (splitIdx === -1) {
  // Try 3. Prevent bottom card clipping
  splitIdx = text.indexOf('/* 4. Prevent bottom card clipping');
}

if (splitIdx > -1) {
  text = text.substring(0, splitIdx);
} else {
  // fallback if I can't find it, look for .v-card {
  splitIdx = text.lastIndexOf('.v-card {');
  text = text.substring(0, splitIdx);
}

// Append the correct end.
text += \
.v-card {
  width: var(--card-w);
  height: var(--card-h);
  flex-shrink: 0;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  overflow: hidden;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
}
.v-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.v-card p {
  display: none;
}

/* ============================================================
   PATCH — 3-CARD VISIBLE CAROUSEL
   ============================================================ */
:root {
  --card-w: 360px;   /* wider for readability */
  --card-h: 210px;   /* taller to preserve poster proportions */
}

/* 1. Adjust carousel height to account for arrows */
.v-track {
  height: calc((var(--card-h) * 3) + 78px); /* 3 cards + gaps + arrow space */
  overflow-y: hidden; /* prevent clipping */
  scroll-snap-type: y mandatory;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 0 6px;
  align-items: center;
}

/* 2. Center arrows relative to visible cards */
.v-carousel {
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between; /* evenly distribute arrows and cards */
  height: calc((var(--card-h) * 3) + 140px); /* total visible area + breathing room */
  width: var(--card-w);
  gap: 12px;
}

.v-arrow {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 3. Smooth cinematic figure shrink */
.performer-figure {
  transition: transform 1.2s cubic-bezier(0.25, 0.1, 0.25, 1),
              opacity 1.2s ease;
  transform-origin: center bottom;
}

.video-modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
  z-index: 9999;
}

.video-modal.open {
  opacity: 1;
  pointer-events: auto;
}

.video-modal-content {
  position: relative;
  width: 80vw;
  height: 45vw;
  max-width: 1200px;
  max-height: 675px;
  animation: fadeIn 0.4s ease;
}

#video-frame {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.video-close {
  position: absolute;
  top: -40px;
  right: 0;
  font-size: 2.5rem;
  color: white;
  cursor: pointer;
  user-select: none;
}

@keyframes fadeIn {
  from { transform: scale(0.95); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

/* FADE TRIGGER */
.cinematic-fade-trigger {
  height: 60vh;
  width: 100%;
  pointer-events: none;
}
\;

fs.writeFileSync('styles.css', text);
console.log('Fixed styles.css successfully.');

