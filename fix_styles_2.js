const fs = require('fs');
let text = fs.readFileSync('styles.css', 'utf8');

let splitIdx = text.indexOf('/* 4. Prevent bottom card clipping */');
if (splitIdx === -1) {
  splitIdx = text.lastIndexOf('.v-card {');
}

if (splitIdx > -1) {
  text = text.substring(0, splitIdx);
}

text += `/* 4. Prevent bottom card clipping */
.v-card {
  width: var(--card-w);
  height: var(--card-h);
  flex-shrink: 0;
}

/* 5. Smooth cinematic figure shrink */
.performer-figure {
  transition: transform 1.4s cubic-bezier(0.25, 0.1, 0.25, 1),
              opacity 1.4s ease;
  transform-origin: center bottom;
}

/* ============================================================
   PATCH — Fix bottom card clipping and arrow alignment
   ============================================================ */

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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between; /* evenly distribute arrows and cards */
  height: calc((var(--card-h) * 3) + 140px); /* total visible area + breathing room */
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
`;

fs.writeFileSync('styles.css', text);
console.log('Styles fixed');
