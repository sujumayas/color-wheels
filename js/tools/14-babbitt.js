/* ═══════════════════════════════════════════════════════════════
   Tool 14: Babbitt's Chromatic Harmony (1878)
   Harmonic colour relationships shown as a wheel with inner
   connection lines showing triadic, complementary, etc.
   Interactive: Pick a key colour, see harmonic relationships.
   ═══════════════════════════════════════════════════════════════ */

ColorTools.register('babbitt-1878', {
  name: 'Chromatic Harmony',
  shortName: 'Chromatic Harmony',
  author: 'Edwin D. Babbitt',
  year: 1878,
  description: 'Babbitt mapped "harmonic laws" of colour — triadic, complementary, split-complementary, and analogous relationships. Choose a key colour and harmony type to see the mathematical relationships visualized.',

  render(viz, controls, info) {
    controls.style.display = 'flex';
    info.style.display = 'block';

    let keyHue = 0;
    let harmonyType = 'complementary';
    let segments = 24;

    const harmonies = {
      complementary: { name: 'Complementary', offsets: [0, 180] },
      triadic: { name: 'Triadic', offsets: [0, 120, 240] },
      'split-complementary': { name: 'Split-Complementary', offsets: [0, 150, 210] },
      tetradic: { name: 'Tetradic', offsets: [0, 90, 180, 270] },
      analogous: { name: 'Analogous', offsets: [0, 30, 60] },
      'double-complementary': { name: 'Double Complementary', offsets: [0, 30, 180, 210] }
    };

    const canvas = Draw.createCanvas(viz, 580, 580);
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      const cx = w / 2, cy = h / 2;
      Draw.parchmentBg(ctx, w, h);

      Draw.centeredText(ctx, 'CHROMATIC HARMONY', cx, 22, 15, '#2a1f14', "small-caps 15px 'IM Fell DW Pica SC', Georgia, serif");
      Draw.centeredText(ctx, harmonies[harmonyType].name, cx, 40, 12, '#8b4513', "italic 12px 'Crimson Text', Georgia, serif");

      const outerR = 220;
      const innerR = 140;
      const harmony = harmonies[harmonyType];

      // Draw wheel
      for (let i = 0; i < segments; i++) {
        const hue = (i / segments) * 360;
        const a1 = (i / segments) * Math.PI * 2 - Math.PI / 2;
        const a2 = ((i + 1) / segments) * Math.PI * 2 - Math.PI / 2;
        const color = CU.hslToHex(hue, 75, 50);

        // Check if this segment is part of the harmony
        const isActive = harmony.offsets.some(offset => {
          const targetHue = (keyHue + offset) % 360;
          const segHue = (i / segments) * 360;
          return Math.abs(segHue - targetHue) < (360 / segments / 2) ||
                 Math.abs(segHue - targetHue + 360) < (360 / segments / 2) ||
                 Math.abs(segHue - targetHue - 360) < (360 / segments / 2);
        });

        Draw.wedge(ctx, cx, cy, innerR, isActive ? outerR + 8 : outerR, a1, a2, color);

        if (isActive) {
          // Highlight border
          ctx.beginPath();
          ctx.arc(cx, cy, outerR + 8, a1, a2);
          ctx.arc(cx, cy, innerR, a2, a1, true);
          ctx.closePath();
          ctx.strokeStyle = '#2a1f14';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
      }

      // Draw connection lines between harmony points
      const points = harmony.offsets.map(offset => {
        const angle = ((keyHue + offset) / 360) * Math.PI * 2 - Math.PI / 2;
        return {
          x: cx + Math.cos(angle) * ((innerR + outerR) / 2),
          y: cy + Math.sin(angle) * ((innerR + outerR) / 2),
          hue: (keyHue + offset) % 360
        };
      });

      // Connection polygon
      if (points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.strokeStyle = '#2a1f14';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = 'rgba(42,31,20,0.05)';
        ctx.fill();
      }

      // Dots at harmony points
      points.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = CU.hslToHex(p.hue, 75, 50);
        ctx.fill();
        ctx.strokeStyle = '#2a1f14';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Center: show the harmony palette
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.fillStyle = '#f7f0e0';
      ctx.fill();
      ctx.strokeStyle = 'rgba(42,31,20,0.3)';
      ctx.stroke();

      Draw.centeredText(ctx, '— Palette —', cx, cy - 45, 10, '#8a7560');

      const paletteColors = harmony.offsets.map(o => CU.hslToHex((keyHue + o) % 360, 75, 50));
      const pw = 30;
      const totalW = paletteColors.length * pw + (paletteColors.length - 1) * 4;
      paletteColors.forEach((c, i) => {
        const px = cx - totalW / 2 + i * (pw + 4);
        ctx.fillStyle = c;
        ctx.fillRect(px, cy - 28, pw, pw);
        ctx.strokeStyle = '#2a1f14';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(px, cy - 28, pw, pw);
        Draw.centeredText(ctx, c, px + pw / 2, cy + 14, 8, '#8a7560');
      });

      // Harmony angle info
      const angleStr = harmony.offsets.map(o => o + '°').join(', ');
      Draw.centeredText(ctx, `Angles: ${angleStr}`, cx, cy + 35, 9, '#8a7560');
    };

    controls.innerHTML = `
      <div class="control-group"><label>Key hue:</label><input type="range" id="babbitt-hue" min="0" max="359" value="${keyHue}" style="width:150px"><span id="babbitt-hueval">${keyHue}°</span></div>
      <div class="control-group"><label>Harmony:</label>
        <select id="babbitt-harm">
          ${Object.entries(harmonies).map(([k, v]) => `<option value="${k}" ${k === harmonyType ? 'selected' : ''}>${v.name}</option>`).join('')}
        </select>
      </div>
      <div class="control-group"><label>Segments:</label>
        <select id="babbitt-seg"><option value="12">12</option><option value="24" selected>24</option><option value="36">36</option></select>
      </div>
      <div class="control-group"><button class="btn" id="babbitt-reset">Reset</button></div>
    `;

    const update = () => {
      keyHue = parseInt(document.getElementById('babbitt-hue').value);
      harmonyType = document.getElementById('babbitt-harm').value;
      segments = parseInt(document.getElementById('babbitt-seg').value);
      document.getElementById('babbitt-hueval').textContent = keyHue + '°';
      draw();
    };

    ['babbitt-hue', 'babbitt-harm', 'babbitt-seg'].forEach(id => {
      document.getElementById(id).oninput = update;
    });

    document.getElementById('babbitt-reset').onclick = () => {
      keyHue = 0; harmonyType = 'complementary'; segments = 24;
      document.getElementById('babbitt-hue').value = 0;
      document.getElementById('babbitt-harm').value = 'complementary';
      document.getElementById('babbitt-seg').value = '24';
      draw();
    };

    info.textContent = 'Rotate the key hue to explore different starting points. The connecting lines show the geometric relationship between harmony colours on the wheel.';
    draw();
  }
});
