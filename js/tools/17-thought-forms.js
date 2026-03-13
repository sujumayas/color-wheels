/* ═══════════════════════════════════════════════════════════════
   Tool 17: Besant & Leadbetter's Thought-Forms (1905)
   Theosophical colour-to-emotion mapping. Each emotion
   corresponds to a specific colour/aura.
   Interactive: Adjust emotion sliders, see blended aura colour.
   ═══════════════════════════════════════════════════════════════ */

ColorTools.register('thought-forms-1905', {
  name: 'Thought-Forms',
  shortName: 'Thought-Forms',
  author: 'Besant & Leadbetter',
  year: 1905,
  description: 'Besant and Leadbetter\'s Theosophical system ascribed colours to emotions and states of mind. Adjust the intensity of each emotion to see how your "thought-form" aura blends.',

  render(viz, controls, info) {
    controls.style.display = 'none'; // We'll build inline controls
    info.style.display = 'block';

    const emotions = [
      { name: 'High Spirituality', color: '#4050d0', intensity: 0 },
      { name: 'Devotion', color: '#3040a8', intensity: 0 },
      { name: 'Strong Affection', color: '#d03060', intensity: 0 },
      { name: 'Selfless Love', color: '#e090b0', intensity: 0 },
      { name: 'Intellect', color: '#d8c828', intensity: 0 },
      { name: 'Strong Intellect', color: '#d89010', intensity: 0 },
      { name: 'Pride', color: '#c86018', intensity: 0 },
      { name: 'Anger', color: '#c82020', intensity: 30 },
      { name: 'Sensuality', color: '#a03050', intensity: 0 },
      { name: 'Jealousy', color: '#507020', intensity: 0 },
      { name: 'Adaptability', color: '#30a048', intensity: 0 },
      { name: 'Sympathy', color: '#38b868', intensity: 50 },
      { name: 'Depression', color: '#404850', intensity: 0 },
      { name: 'Fear', color: '#686870', intensity: 0 },
      { name: 'Deceit', color: '#605838', intensity: 0 },
      { name: 'Malice', color: '#1a1a18', intensity: 0 }
    ];

    const canvas = Draw.createCanvas(viz, 320, 400);
    canvas.style.display = 'inline-block';
    canvas.style.verticalAlign = 'top';

    const ctx = canvas.getContext('2d');

    // Build controls panel next to canvas
    const controlDiv = document.createElement('div');
    controlDiv.style.display = 'inline-block';
    controlDiv.style.verticalAlign = 'top';
    controlDiv.style.marginLeft = '1rem';
    controlDiv.style.maxWidth = '350px';

    controlDiv.innerHTML = `
      <div style="font-family:'IM Fell DW Pica SC',Georgia,serif;font-size:0.9rem;margin-bottom:0.5rem;color:#2a1f14">Emotional Intensities</div>
      ${emotions.map((e, i) => `
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
          <div style="width:16px;height:16px;background:${e.color};border:1px solid #2a1f14;border-radius:2px;flex-shrink:0"></div>
          <label style="font-size:0.75rem;color:#5c4a3a;width:110px;flex-shrink:0">${e.name}</label>
          <input type="range" id="tf-e${i}" min="0" max="100" value="${e.intensity}" style="width:100px;accent-color:${e.color}">
          <span id="tf-v${i}" style="font-size:0.65rem;color:#8a7560;width:30px">${e.intensity}%</span>
        </div>
      `).join('')}
      <div style="margin-top:0.5rem;display:flex;gap:6px">
        <button class="btn" id="tf-clear">Clear All</button>
        <button class="btn" id="tf-random">Random State</button>
        <button class="btn" id="tf-preset1">Peaceful</button>
        <button class="btn" id="tf-preset2">Passionate</button>
      </div>
    `;
    viz.appendChild(controlDiv);

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      const cx = w / 2, cy = h / 2;
      Draw.parchmentBg(ctx, w, h);

      Draw.centeredText(ctx, 'THOUGHT-FORM', cx, 18, 13, '#2a1f14', "small-caps 13px 'IM Fell DW Pica SC', Georgia, serif");

      // Calculate blended aura color from active emotions
      const active = emotions.filter(e => e.intensity > 0);
      let auraColor = '#808080';

      if (active.length > 0) {
        let r = 0, g = 0, b = 0, totalWeight = 0;
        active.forEach(e => {
          const c = CU.hexToRgb(e.color);
          const weight = e.intensity / 100;
          r += c.r * weight;
          g += c.g * weight;
          b += c.b * weight;
          totalWeight += weight;
        });
        if (totalWeight > 0) {
          auraColor = CU.rgbToHex(r / totalWeight, g / totalWeight, b / totalWeight);
        }
      }

      // Draw aura — concentric glow
      const maxR = 140;
      for (let ring = maxR; ring > 0; ring -= 2) {
        const t = ring / maxR;
        const alpha = 0.3 + (1 - t) * 0.5;
        const rgb = CU.hexToRgb(auraColor);
        const lighter = CU.rgbToHex(
          rgb.r + (255 - rgb.r) * (1 - t) * 0.4,
          rgb.g + (255 - rgb.g) * (1 - t) * 0.4,
          rgb.b + (255 - rgb.b) * (1 - t) * 0.4
        );
        ctx.beginPath();
        ctx.ellipse(cx, cy + 10, ring, ring * 1.2, 0, 0, Math.PI * 2);
        ctx.fillStyle = lighter;
        ctx.globalAlpha = alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Central form — a silhouette
      ctx.beginPath();
      ctx.ellipse(cx, cy - 10, 35, 50, 0, 0, Math.PI * 2);
      ctx.fillStyle = CU.darken(auraColor, 20);
      ctx.fill();
      ctx.strokeStyle = 'rgba(42,31,20,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Show dominant emotion
      if (active.length > 0) {
        const dominant = active.reduce((a, b) => a.intensity > b.intensity ? a : b);
        Draw.centeredText(ctx, dominant.name, cx, h - 45, 11, '#2a1f14');
        Draw.centeredText(ctx, auraColor, cx, h - 28, 10, '#8a7560');
      } else {
        Draw.centeredText(ctx, 'Neutral State', cx, h - 45, 11, '#8a7560');
      }

      // Active emotion badges
      let badgeY = h - 14;
      Draw.centeredText(ctx, `${active.length} active emotion${active.length !== 1 ? 's' : ''}`, cx, badgeY, 9, '#8a7560');
    };

    // Wire up sliders
    emotions.forEach((e, i) => {
      document.getElementById(`tf-e${i}`).oninput = (ev) => {
        e.intensity = parseInt(ev.target.value);
        document.getElementById(`tf-v${i}`).textContent = e.intensity + '%';
        draw();
      };
    });

    const setAll = (vals) => {
      emotions.forEach((e, i) => {
        e.intensity = vals[i] || 0;
        document.getElementById(`tf-e${i}`).value = e.intensity;
        document.getElementById(`tf-v${i}`).textContent = e.intensity + '%';
      });
      draw();
    };

    document.getElementById('tf-clear').onclick = () => setAll(new Array(16).fill(0));
    document.getElementById('tf-random').onclick = () => setAll(emotions.map(() => Math.random() < 0.4 ? Math.floor(Math.random() * 100) : 0));
    document.getElementById('tf-preset1').onclick = () => setAll([30, 20, 0, 40, 20, 0, 0, 0, 0, 0, 30, 60, 0, 0, 0, 0]);
    document.getElementById('tf-preset2').onclick = () => setAll([0, 10, 70, 20, 0, 0, 30, 50, 40, 0, 0, 0, 0, 0, 0, 0]);

    info.textContent = 'Adjust emotion sliders to blend your "thought-form" aura. Besant and Leadbetter believed thoughts and emotions radiated visible coloured fields around a person.';
    draw();
  }
});
