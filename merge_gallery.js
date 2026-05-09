const fs = require("fs");

let indexHtml = fs.readFileSync("index.html", "utf8");
let galleryHtml = fs.readFileSync("gallery.html", "utf8");
let stylesCss = fs.readFileSync("styles.css", "utf8");
let galleryCss = fs.readFileSync("gallery.css", "utf8");

// Extract the Gallery HTML content
let galleryMatch = galleryHtml.match(/<main class="gallery-stage">([\s\S]*?)<\/main>/);
let modalMatch = galleryHtml.match(/<div id="video-modal" class="video-modal">([\s\S]*?)<\/div>/);

// Extract the scripts from gallery
let scriptMatches = galleryHtml.matchAll(/<script>([\s\S]*?)<\/script>/g);
let scripts = Array.from(scriptMatches).map(m => m[1]);
let carouselScript = scripts[1] || "";
let modalScript = scripts[2] || "";

let combinedHtml = `
  <!-- CINEMATIC FADE TRIGGER -->
  <div class="cinematic-fade-trigger"></div>

  <!-- GALLERY STAGE -->
  <main class="gallery-stage" id="gallery-stage">
${galleryMatch[1]}
  </main>

  <!-- VIDEO MODAL -->
  <div id="video-modal" class="video-modal">
${modalMatch[1]}
  </div>
`;

indexHtml = indexHtml.replace("</section>", "</section>\n" + combinedHtml);

let gsapScriptAdd = `
      // 4. CINEMATIC FADE TO BLACK AND GALLERY REVEAL
      gsap.to("body", {
        backgroundColor: "#080808",
        color: "#ffffff",
        scrollTrigger: {
          trigger: ".cinematic-fade-trigger",
          start: "top 60%",
          end: "bottom 20%",
          scrub: true
        }
      });
      gsap.to(".bg-vignette, .bg-grain", {
        opacity: 1,
        scrollTrigger: {
          trigger: ".cinematic-fade-trigger",
          start: "top 60%",
          end: "bottom 20%",
          scrub: true
        }
      });
      // Optionally pin the gallery stage so it feels like a native section
      // But user just wanted smooth scroll, so no pin unless required.

      // 5. GALLERY CAROUSEL LOGIC
      ${carouselScript.replace(/document\.addEventListener.*?\{/, "").replace(/\}\s*\);?\s*$/, "").trim()}

      // 6. MODAL LOGIC
      ${modalScript.trim()}
`;

indexHtml = indexHtml.replace("});\n    });\n  </script>", "});\n" + gsapScriptAdd + "\n    });\n  </script>");

fs.writeFileSync("index.html", indexHtml);

// ------------------------------------
// MERGE CSS
// ------------------------------------
// Remove HTML/Body from galleryCss
galleryCss = galleryCss.replace(/html, body \{[^}]*\}/g, "");
galleryCss = galleryCss.replace(/\* \{ margin: 0; padding: 0; box-sizing: border-box; \}/g, "");
galleryCss = galleryCss.replace(/body:not\(\.ready\) \* \{ transition: none !important; \}/g, "");

// Modify bg-vignette and bg-grain to be fixed and global
galleryCss = galleryCss.replace(/\.bg-vignette \{[\s\S]*?\}/, `.bg-vignette {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse 55% 65% at 20% 55%, transparent 30%, rgba(0,0,0,0.82) 100%),
    radial-gradient(ellipse 55% 65% at 80% 55%, transparent 30%, rgba(0,0,0,0.82) 100%),
    radial-gradient(ellipse 100% 50% at 50% 100%, rgba(0,0,0,0.95) 0%, transparent 60%),
    radial-gradient(ellipse 100% 30% at 50% 0%,  rgba(0,0,0,0.90) 0%, transparent 60%);
  pointer-events: none;
  z-index: 9997; /* Below Modal */
  opacity: 0; /* Handled by GSAP */
}`);

galleryCss = galleryCss.replace(/\.bg-grain \{[\s\S]*?\}/, `.bg-grain {
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'300\\' height=\\'300\\'%3E%3Cfilter id=\\'noise\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.75\\' numOctaves=\\'4\\' stitchTiles=\\'stitch\\'/%3E%3CfeColorMatrix type=\\'saturate\\' values=\\'0\\'/%3E%3C/filter%3E%3Crect width=\\'300\\' height=\\'300\\' filter=\\'url(%23noise)\\' opacity=\\'0.07\\'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 9998; /* Below Modal */
  opacity: 0; /* Handled by GSAP */
}`);

let mergedCss = stylesCss + "\n\n/* ---------------- NEW GALLERY STYLES ---------------- */\n" + galleryCss;

// Fade trigger style
mergedCss += `
/* FADE TRIGGER */
.cinematic-fade-trigger {
  height: 60vh;
  width: 100%;
  pointer-events: none;
}
`;

fs.writeFileSync("styles.css", mergedCss);
console.log("Merged successfully.");
