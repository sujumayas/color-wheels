/* ═══════════════════════════════════════════════════════════════
   COLOUR WHEELS — Core Application & Shared Utilities
   ═══════════════════════════════════════════════════════════════ */

const ColorTools = {
  registry: [],
  activeIndex: -1,
  showReference: false,

  /* Original images & descriptions from the Public Domain Review collection */
  originals: {
    'waller-1686': {
      img: 'images/22669774209_81b504017a_o.webp',
      desc: 'Tabula Colorum Physiologica by Richard Waller (1686) — an early attempt to create a systematic colour chart. Waller organized pigments in a grid, mixing them together to fill each cell, creating one of the first practical tools for colour standardization in scientific communication.',
      source: 'Public Domain Review'
    },
    'boutet-1708': {
      img: 'images/23062054505_8f79710228_o.webp',
      desc: 'Cercle Chromatique by Claude Boutet (1708) — an early colour wheel based on painter\'s primaries (red, yellow, blue). Boutet\'s concentric rings show how primaries mix into secondaries and tertiaries, establishing a model that would influence colour theory for centuries.',
      source: 'Public Domain Review'
    },
    'gautier-1746': {
      img: 'images/22440853713_1c060a9e6c_o.webp',
      desc: 'Chromatogénésie by Jacques Fabien Gautier d\'Agoty (1746) — a plate from his treatise on colour, showing how colours emerge from the interplay of light and darkness. Gautier explored the physiological basis of colour perception and proposed theories about how the eye perceives different hues.',
      source: 'Public Domain Review'
    },
    'harris-1766': {
      img: 'images/22440853623_0cdecf4b77_o.webp',
      desc: 'The Natural System of Colours by Moses Harris (1766) — a prismatic colour wheel showing 18 segments shading from full saturation at the rim to near-black at the centre. Harris was one of the first to demonstrate the full range of tones achievable from three primaries.',
      source: 'Public Domain Review'
    },
    'schaffer-1769': {
      img: 'images/23049510172_7a587765ba_o.webp',
      desc: 'Genealogia Colorum by Jacob Christian Schäffer (1769) — a \"family tree\" of colours showing how primaries give birth to secondary and tertiary hues through successive mixing generations, an inventive metaphor for understanding colour relationships.',
      source: 'Public Domain Review'
    },
    'schiffermuller-1772': {
      img: 'images/22645267167_dfc6e9b8e6_c.webp',
      desc: 'Versuch eines Farbensystems by Ignaz Schiffermüller (1772) — a 12-part colour wheel designed to systematically classify the colours of insects and natural specimens. Each hue is carefully graded and named, making this one of the first colour systems for scientific taxonomy.',
      source: 'Public Domain Review'
    },
    'mayer-1775': {
      img: 'images/23048455302_cf035627e1_o.webp',
      desc: 'Triangulum Colorum by Tobias Mayer (1775, posthumous) — a triangular colour chart with red, yellow, and blue at its vertices. Each interior cell represents a precise mixture ratio, offering a mathematical approach to the colour space well ahead of its time.',
      source: 'Public Domain Review'
    },
    'lambert-1772': {
      img: 'images/23073227141_c0e3c61f87_c.webp',
      desc: 'Farbenpyramide by Johann Heinrich Lambert (1772) — an early attempt to represent colour as a three-dimensional solid. Lambert\'s pyramid has a triangular base of saturated hues that converge to black at the apex, illustrating how colours darken through mixing.',
      source: 'Public Domain Review'
    },
    'temperamentenrose-1799': {
      img: 'images/22645624708_6952091848_z.webp',
      desc: 'Temperamentenrose (1799), attributed to Goethe and Schiller — a circular diagram mapping human temperaments and character traits to colour sectors. This chart bridges colour theory with psychology, assigning twelve personality types to positions around a colour wheel.',
      source: 'Public Domain Review'
    },
    'goethe-1809': {
      img: 'images/23073226951_1bd5051df8_b.webp',
      desc: 'Farbenkreis zur Symbolisierung des menschlichen Geistes- und Seelenlebens by Johann Wolfgang von Goethe (1809) — a symbolic colour wheel that maps hues to human faculties and psychological states. Goethe\'s approach was poetic and phenomenological rather than purely scientific.',
      source: 'Public Domain Review'
    },
    'sowerby-1809': {
      img: 'images/23077444582_08a3eb6ede_b.webp',
      desc: 'A New Elucidation of Colours by James Sowerby (1809) — comparing prismatic (light-based) and material (pigment-based) colour mixing side by side. Sowerby demonstrated the fundamental difference between additive and subtractive colour blending.',
      source: 'Public Domain Review'
    },
    'runge-1810': {
      img: 'images/22643650408_c83de5310e_b.webp',
      desc: 'Farbenkugel by Philipp Otto Runge (1810) — a colour sphere with pure hues at the equator, white at the north pole, and black at the south. Runge\'s elegant three-dimensional model was among the first to systematically represent hue, lightness, and saturation as spatial dimensions.',
      source: 'Public Domain Review'
    },
    'bezold-1874': {
      img: 'images/22439266454_e52b7b8549_o.webp',
      desc: 'Farbentafel by Wilhelm von Bezold (1874) — a systematic colour table arranging hues in rows with varying lightness, showing how each hue family transitions from pale to dark. Bezold\'s work influenced understanding of simultaneous contrast effects.',
      source: 'Public Domain Review'
    },
    'babbitt-1878': {
      img: 'images/22672707798_9306f88ebd_b.webp',
      desc: 'Chromatic Harmony by Edwin D. Babbitt (1878) — a wheel designed to identify harmonious colour relationships: complementary, triadic, and analogous. Babbitt\'s work linked colour theory with principles of visual balance and aesthetic pleasure.',
      source: 'Public Domain Review'
    },
    'maycock-simul-1895': {
      img: 'images/23077855612_f24cc4a4d1_b.webp',
      desc: 'Simultaneous Contrast demonstration from A Class-Book of Color by Mark Maycock (1895) — illustrating how the same colour appears different when placed against different backgrounds, a phenomenon first described by Michel Eugène Chevreul.',
      source: 'Public Domain Review'
    },
    'maycock-comp-1895': {
      img: 'images/23102309831_aef59b3d98_b.webp',
      desc: 'Complementary Colours chart from A Class-Book of Color by Mark Maycock (1895) — showing pairs of complementary colours arranged on opposite sides of the wheel, demonstrating maximum visual contrast between opposing hues.',
      source: 'Public Domain Review'
    },
    'thought-forms-1905': {
      img: 'images/22442913533_9d0cd46fa9_b.webp',
      desc: 'Plate from Thought-Forms by Annie Besant & C.W. Leadbeater (1905) — a Theosophical work mapping specific colours to emotions and mental states. According to their system, each thought produces a visible coloured form in the \"aura\" surrounding a person.',
      source: 'Public Domain Review'
    },
    'advertising-1912': {
      img: 'images/23073226691_375ee2bd39_b.webp',
      desc: 'Colour principles from The Principles of Advertising Arrangement by Frank Alvah Parsons (1912) — early guidance on applying colour theory to commercial design, prescribing specific palettes for different moods, industries, and advertising goals.',
      source: 'Public Domain Review'
    },
    'ridgeway-1912': {
      img: 'images/22643742698_2a04d9379f_b.webp',
      desc: 'Color Standards and Color Nomenclature by Robert Ridgway (1912) — a comprehensive system of over 1,000 named colours intended for scientific use, particularly in ornithology. Each colour swatch is carefully named and classified by hue family.',
      source: 'Public Domain Review'
    },
    'catalogue-1914': {
      img: 'images/23050608862_0cc50aa2a5_b.webp',
      desc: 'Page from an artists\' materials catalogue by F.W. Devoe & Co. (c. 1914) — listing available oil pigments with their properties including permanence, transparency, and suggested uses. Such catalogues served as practical guides for painters selecting their palette.',
      source: 'Public Domain Review'
    }
  },

  register(id, config) {
    this.registry.push({ id, ...config });
  },

  init() {
    const nav = document.getElementById('nav-scroll');
    const main = document.getElementById('main-content');

    this.registry.sort((a, b) => a.year - b.year);

    // Group tools by century for sidebar nav
    const centuries = {};
    this.registry.forEach((tool, i) => {
      const c = Math.floor(tool.year / 100) + 1;
      const label = c <= 17 ? '17th Century' : c === 18 ? '18th Century' : c === 19 ? '19th Century' : '20th Century';
      if (!centuries[label]) centuries[label] = [];
      centuries[label].push({ tool, index: i });
    });

    // Build sidebar nav with century headings
    Object.entries(centuries).forEach(([label, items]) => {
      const heading = document.createElement('div');
      heading.className = 'nav-century';
      heading.textContent = label;
      nav.appendChild(heading);

      items.forEach(({ tool, index }) => {
        const tab = document.createElement('button');
        tab.className = 'nav-tab';
        tab.innerHTML = `<span class="tab-name">${tool.shortName || tool.name}</span><span class="tab-year">${tool.year}</span>`;
        tab.onclick = () => this.activate(index);
        tab.setAttribute('data-index', index);
        nav.appendChild(tab);
      });
    });

    // Build tool containers
    this.registry.forEach((tool, i) => {
      const orig = this.originals[tool.id] || {};
      const container = document.createElement('div');
      container.className = 'tool-container';
      container.id = `tool-${tool.id}`;
      container.innerHTML = `
        <div class="tool-header">
          <h2 class="tool-name">${tool.name}</h2>
          <div class="tool-author">${tool.author}, ${tool.year}</div>
          <p class="tool-description">${tool.description}</p>
        </div>
        <div id="ref-${tool.id}" class="reference-panel">
          ${orig.img ? `<img src="${orig.img}" alt="Original: ${tool.name}" loading="lazy" onerror="this.style.display='none'">` : ''}
          <div class="ref-text">
            <div class="ref-title">Original Reference</div>
            <div class="ref-description">${orig.desc || 'Description not available.'}</div>
            ${orig.source ? `<div class="ref-source">Source: ${orig.source}</div>` : ''}
          </div>
        </div>
        <div class="ornament">✦ ✦ ✦</div>
        <div id="controls-${tool.id}" class="controls-panel" style="display:none"></div>
        <div id="viz-${tool.id}" class="viz-area"></div>
        <div id="info-${tool.id}" class="info-panel" style="display:none"></div>
      `;
      main.appendChild(container);
    });

    // Activate first tool
    if (this.registry.length > 0) this.activate(0);
  },

  toggleReference(show) {
    this.showReference = show;
    document.querySelectorAll('.reference-panel').forEach(panel => {
      panel.classList.toggle('visible', show);
    });
  },

  activate(index) {
    if (this.activeIndex === index) return;

    // Cleanup previous
    if (this.activeIndex >= 0) {
      const prev = this.registry[this.activeIndex];
      if (prev.cleanup) prev.cleanup();
    }

    // Update tabs
    document.querySelectorAll('.nav-tab').forEach((tab, i) => {
      tab.classList.toggle('active', parseInt(tab.dataset.index) === index);
    });

    // Update containers
    document.querySelectorAll('.tool-container').forEach((c, i) => {
      c.classList.toggle('active', i === index);
    });

    // Scroll sidebar item into view
    const activeTab = document.querySelector(`.nav-tab[data-index="${index}"]`);
    if (activeTab) activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    this.activeIndex = index;
    const tool = this.registry[index];

    // Render if first time or re-render
    const viz = document.getElementById(`viz-${tool.id}`);
    const controls = document.getElementById(`controls-${tool.id}`);
    const info = document.getElementById(`info-${tool.id}`);

    if (!tool._rendered) {
      tool.render(viz, controls, info);
      tool._rendered = true;
    }
  }
};

/* ── Color Utility Functions ─────────────────────────────────── */

const CU = {
  // Hex to RGB
  hexToRgb(hex) {
    hex = hex.replace('#', '');
    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16)
    };
  },

  // RGB to Hex
  rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  },

  // RGB to HSL
  rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  },

  // HSL to RGB
  hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1; if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  },

  // HSL to Hex
  hslToHex(h, s, l) {
    const { r, g, b } = this.hslToRgb(h, s, l);
    return this.rgbToHex(r, g, b);
  },

  // Lerp between two colors (hex)
  lerp(hex1, hex2, t) {
    const c1 = this.hexToRgb(hex1);
    const c2 = this.hexToRgb(hex2);
    return this.rgbToHex(
      c1.r + (c2.r - c1.r) * t,
      c1.g + (c2.g - c1.g) * t,
      c1.b + (c2.b - c1.b) * t
    );
  },

  // Subtractive mix (pigment-like)
  mixSubtractive(colors) {
    if (colors.length === 0) return '#808080';
    let c = 0, m = 0, y = 0, k = 0;
    colors.forEach(hex => {
      const rgb = this.hexToRgb(hex);
      const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
      const k1 = 1 - Math.max(r, g, b);
      const c1 = k1 < 1 ? (1 - r - k1) / (1 - k1) : 0;
      const m1 = k1 < 1 ? (1 - g - k1) / (1 - k1) : 0;
      const y1 = k1 < 1 ? (1 - b - k1) / (1 - k1) : 0;
      c += c1; m += m1; y += y1; k += k1;
    });
    const n = colors.length;
    c /= n; m /= n; y /= n; k /= n;
    const r = 255 * (1 - c) * (1 - k);
    const g = 255 * (1 - m) * (1 - k);
    const b = 255 * (1 - y) * (1 - k);
    return this.rgbToHex(r, g, b);
  },

  // Additive mix (light-like)
  mixAdditive(colors) {
    if (colors.length === 0) return '#000000';
    let r = 0, g = 0, b = 0;
    colors.forEach(hex => {
      const c = this.hexToRgb(hex);
      r += c.r; g += c.g; b += c.b;
    });
    const n = colors.length;
    return this.rgbToHex(r / n, g / n, b / n);
  },

  // Get complementary color
  complement(hex) {
    const { r, g, b } = this.hexToRgb(hex);
    return this.rgbToHex(255 - r, 255 - g, 255 - b);
  },

  // Adjust lightness
  adjustLightness(hex, amount) {
    const { r, g, b } = this.hexToRgb(hex);
    const hsl = this.rgbToHsl(r, g, b);
    hsl.l = Math.max(0, Math.min(100, hsl.l + amount));
    return this.hslToHex(hsl.h, hsl.s, hsl.l);
  },

  // Get contrast text color
  textColor(hex) {
    const { r, g, b } = this.hexToRgb(hex);
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return lum > 0.5 ? '#2a1f14' : '#f0e2c4';
  },

  // Darken
  darken(hex, amount) { return this.adjustLightness(hex, -amount); },

  // Lighten
  lighten(hex, amount) { return this.adjustLightness(hex, amount); },

  // Random color
  random() {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  },

  // Rotate hue
  rotateHue(hex, degrees) {
    const { r, g, b } = this.hexToRgb(hex);
    const hsl = this.rgbToHsl(r, g, b);
    hsl.h = (hsl.h + degrees + 360) % 360;
    return this.hslToHex(hsl.h, hsl.s, hsl.l);
  }
};

/* ── Canvas Drawing Helpers ──────────────────────────────────── */

const Draw = {
  createCanvas(parent, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.maxWidth = '100%';
    canvas.style.height = 'auto';
    parent.appendChild(canvas);
    return canvas;
  },

  wedge(ctx, cx, cy, r1, r2, startAngle, endAngle, color) {
    ctx.beginPath();
    ctx.arc(cx, cy, r2, startAngle, endAngle);
    ctx.arc(cx, cy, r1, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(42,31,20,0.2)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  },

  textOnArc(ctx, text, cx, cy, radius, angle, fontSize, color) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${fontSize}px 'Crimson Text', Georgia, serif`;
    ctx.fillStyle = color || '#2a1f14';
    ctx.fillText(text, 0, -radius);
    ctx.restore();
  },

  centeredText(ctx, text, x, y, fontSize, color, font) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${fontSize}px ${font || "'Crimson Text', Georgia, serif"}`;
    ctx.fillStyle = color || '#2a1f14';
    ctx.fillText(text, x, y);
  },

  parchmentBg(ctx, w, h) {
    ctx.fillStyle = '#f7f0e0';
    ctx.fillRect(0, 0, w, h);
    // Subtle grain
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const a = Math.random() * 0.03;
      ctx.fillStyle = `rgba(139, 119, 90, ${a})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
};
