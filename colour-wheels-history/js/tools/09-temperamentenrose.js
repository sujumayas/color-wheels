/* ═══════════════════════════════════════════════════════════════
   Tool 09: Goethe & Schiller's Temperamentenrose (1798/9)
   Rose of temperaments — 12 colours mapped to human occupations
   and character traits, grouped in 4 temperaments.
   Interactive: Edit traits and colours, remap the rose.
   ═══════════════════════════════════════════════════════════════ */

ColorTools.register('temperamentenrose-1799', {
  name: 'Temperamentenrose',
  shortName: 'Temperamentenrose',
  author: 'Goethe & Schiller',
  year: 1799,
  description: 'The Rose of Temperaments maps 12 colours to human character types, grouped into four temperaments. Click any trait to edit it, or change colours to create your own personality-colour mapping.',

  render(viz, controls, info) {
    controls.style.display = 'flex';
    info.style.display = 'block';

    // Original 12 segments from Goethe & Schiller
    const defaultSegments = [
      { trait: 'Tyrants', temperament: 'Choleric', hex: '#c83030' },
      { trait: 'Heroes', temperament: 'Choleric', hex: '#d45020' },
      { trait: 'Adventurers', temperament: 'Choleric', hex: '#d87028' },
      { trait: 'Hedonists', temperament: 'Sanguine', hex: '#d8a830' },
      { trait: 'Lovers', temperament: 'Sanguine', hex: '#c8c040' },
      { trait: 'Poets', temperament: 'Sanguine', hex: '#88a848' },
      { trait: 'Speakers', temperament: 'Melancholic', hex: '#488858' },
      { trait: 'Historians', temperament: 'Melancholic', hex: '#387080' },
      { trait: 'Teachers', temperament: 'Melancholic', hex: '#3050a0' },
      { trait: 'Philosophers', temperament: 'Phlegmatic', hex: '#4838a0' },
      { trait: 'Pedants', temperament: 'Phlegmatic', hex: '#7030a0' },
      { trait: 'Rulers', temperament: 'Phlegmatic', hex: '#a03060' }
    ];

    let segments = defaultSegments.map(s => ({ ...s }));

    const temperamentColors = {
      'Choleric': '#c84030',
      'Sanguine': '#c8a838',
      'Melancholic': '#3868a0',
      'Phlegmatic': '#6830a0'
    };

    const canvas = Draw.createCanvas(viz, 580, 580);
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      const cx = w / 2, cy = h / 2;
      Draw.parchmentBg(ctx, w, h);

      Draw.centeredText(ctx, 'TEMPERAMENTENROSE', cx, 22, 15, '#2a1f14', "small-caps 15px 'IM Fell DW Pica SC', Georgia, serif");
      Draw.centeredText(ctx, 'Rose of Temperaments', cx, 38, 11, '#8a7560', "italic 11px 'Crimson Text', Georgia, serif");

      const outerR = 240;
      const midR = 160;
      const innerR = 90;

      // Draw 12 outer segments (traits + colors)
      for (let i = 0; i < 12; i++) {
        const a1 = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const a2 = ((i + 1) / 12) * Math.PI * 2 - Math.PI / 2;

        Draw.wedge(ctx, cx, cy, midR, outerR, a1, a2, segments[i].hex);

        // Trait label
        const midAngle = a1 + (a2 - a1) / 2;
        const labelR = (midR + outerR) / 2;
        const lx = cx + Math.cos(midAngle) * labelR;
        const ly = cy + Math.sin(midAngle) * labelR;

        ctx.save();
        ctx.translate(lx, ly);
        const rot = midAngle + Math.PI / 2;
        ctx.rotate(rot > Math.PI * 0.4 && rot < Math.PI * 1.6 ? rot + Math.PI : rot);
        ctx.textAlign = 'center';
        ctx.font = "11px 'Crimson Text', Georgia, serif";
        ctx.fillStyle = CU.textColor(segments[i].hex);
        ctx.fillText(segments[i].trait, 0, 0);
        ctx.restore();
      }

      // Draw 4 inner segments (temperaments)
      const temps = ['Choleric', 'Sanguine', 'Melancholic', 'Phlegmatic'];
      for (let i = 0; i < 4; i++) {
        const a1 = (i / 4) * Math.PI * 2 - Math.PI / 2;
        const a2 = ((i + 1) / 4) * Math.PI * 2 - Math.PI / 2;

        Draw.wedge(ctx, cx, cy, innerR, midR, a1, a2, temperamentColors[temps[i]]);

        // Temperament label
        const midAngle = a1 + (a2 - a1) / 2;
        const lr = (innerR + midR) / 2;
        const lx = cx + Math.cos(midAngle) * lr;
        const ly = cy + Math.sin(midAngle) * lr;

        ctx.save();
        ctx.translate(lx, ly);
        const rot = midAngle + Math.PI / 2;
        ctx.rotate(rot > Math.PI * 0.4 && rot < Math.PI * 1.6 ? rot + Math.PI : rot);
        ctx.textAlign = 'center';
        ctx.font = "bold 12px 'Crimson Text', Georgia, serif";
        ctx.fillStyle = CU.textColor(temperamentColors[temps[i]]);
        ctx.fillText(temps[i], 0, 0);
        ctx.restore();
      }

      // Center circle
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.fillStyle = '#f7f0e0';
      ctx.fill();
      ctx.strokeStyle = 'rgba(42,31,20,0.3)';
      ctx.stroke();

      Draw.centeredText(ctx, 'Human', cx, cy - 8, 13, '#2a1f14');
      Draw.centeredText(ctx, 'Nature', cx, cy + 8, 13, '#2a1f14');

      // Outer decorative border
      ctx.beginPath();
      ctx.arc(cx, cy, outerR + 2, 0, Math.PI * 2);
      ctx.strokeStyle = '#2a1f14';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    // Click to edit traits
    canvas.onclick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX - canvas.width / 2;
      const y = (e.clientY - rect.top) * scaleY - canvas.height / 2;
      const dist = Math.sqrt(x * x + y * y);

      if (dist > 160 && dist < 240) {
        let angle = Math.atan2(y, x) + Math.PI / 2;
        if (angle < 0) angle += Math.PI * 2;
        const seg = Math.floor((angle / (Math.PI * 2)) * 12) % 12;

        const newTrait = prompt(`Edit trait (currently "${segments[seg].trait}"):`, segments[seg].trait);
        if (newTrait) {
          segments[seg].trait = newTrait;
          draw();
        }
      }
    };

    controls.innerHTML = `
      <div class="control-group"><label>Theme:</label>
        <select id="tempr-theme">
          <option value="original">Original (Goethe)</option>
          <option value="modern">Modern Traits</option>
          <option value="emotions">Emotions</option>
        </select>
      </div>
      <div class="control-group"><button class="btn" id="tempr-reset">Reset</button></div>
    `;

    const themes = {
      modern: ['Assertive', 'Ambitious', 'Spontaneous', 'Optimistic', 'Romantic', 'Creative', 'Eloquent', 'Analytical', 'Patient', 'Reflective', 'Meticulous', 'Commanding'],
      emotions: ['Rage', 'Courage', 'Excitement', 'Joy', 'Love', 'Awe', 'Serenity', 'Pensiveness', 'Sadness', 'Introspection', 'Anxiety', 'Determination']
    };

    document.getElementById('tempr-theme').onchange = (e) => {
      const theme = e.target.value;
      if (theme === 'original') {
        segments = defaultSegments.map(s => ({ ...s }));
      } else {
        const traits = themes[theme];
        segments.forEach((s, i) => { s.trait = traits[i]; });
      }
      draw();
    };

    document.getElementById('tempr-reset').onclick = () => {
      segments = defaultSegments.map(s => ({ ...s }));
      document.getElementById('tempr-theme').value = 'original';
      draw();
    };

    // Color controls for each segment
    const colorPanel = document.createElement('div');
    colorPanel.className = 'controls-panel';
    colorPanel.style.flexWrap = 'wrap';
    colorPanel.style.gap = '4px';
    colorPanel.innerHTML = segments.map((s, i) =>
      `<div class="control-group"><label style="font-size:0.7rem">${s.trait.substring(0,5)}:</label><input type="color" id="tempr-c${i}" value="${s.hex}" style="width:28px;height:22px"></div>`
    ).join('');
    viz.parentElement.insertBefore(colorPanel, viz.nextSibling);

    segments.forEach((_, i) => {
      document.getElementById(`tempr-c${i}`).oninput = (e) => {
        segments[i].hex = e.target.value;
        draw();
      };
    });

    info.textContent = 'Click any trait in the outer ring to rename it. Use the colour pickers below to adjust individual segment colours. Each quadrant represents one of the four classical temperaments.';
    draw();
  }
});
