/* ═══════════════════════════════════════════════════════════════
   Tool 10: Goethe's Farbenkreis (1809)
   Six-part colour wheel with symbolic/allegorical meanings
   assigned to each colour (Beautiful, Noble, Good, Useful, etc.)
   Interactive: Change colours and edit symbolic associations.
   ═══════════════════════════════════════════════════════════════ */

ColorTools.register('goethe-1809', {
  name: 'Farbenkreis',
  shortName: 'Farbenkreis',
  author: 'Johann Wolfgang von Goethe',
  year: 1809,
  description: 'Goethe\'s symbolic colour wheel assigns allegorical qualities to six colours — Beautiful, Noble, Good, Useful, Common, and Unnecessary. Change the colours or click the labels to edit symbolic meanings.',

  render(viz, controls, info) {
    controls.style.display = 'flex';
    info.style.display = 'block';

    const defaultSegments = [
      { color: '#c83030', name: 'Roth', symbol: 'Schön (Beautiful)', quality: 'Noble' },
      { color: '#d87830', name: 'Orange', symbol: 'Edel (Noble)', quality: 'Active' },
      { color: '#d8c830', name: 'Gelb', symbol: 'Gut (Good)', quality: 'Warm' },
      { color: '#38a048', name: 'Grün', symbol: 'Nützlich (Useful)', quality: 'Peaceful' },
      { color: '#3050a8', name: 'Blau', symbol: 'Gemein (Common)', quality: 'Passive' },
      { color: '#7838a0', name: 'Violett', symbol: 'Unnöthig (Unnecessary)', quality: 'Cold' }
    ];

    let segments = defaultSegments.map(s => ({ ...s }));

    // Goethe's pairings: opposite sides are complementary contrasts
    const pairings = [
      { plus: 'Plus (+)', minus: 'Minus (−)', desc: 'Active / Passive' },
      { plus: 'Power', minus: 'Gentleness', desc: 'Warm side / Cold side' },
      { plus: 'Light', minus: 'Shadow', desc: 'Brightness / Darkness' }
    ];

    const canvas = Draw.createCanvas(viz, 580, 580);
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      const cx = w / 2, cy = h / 2;
      Draw.parchmentBg(ctx, w, h);

      Draw.centeredText(ctx, 'FARBENKREIS', cx, 20, 16, '#2a1f14', "small-caps 16px 'IM Fell DW Pica SC', Georgia, serif");
      Draw.centeredText(ctx, 'zur Symbolisierung des menschlichen Geistes- und Seelenlebens', cx, 37, 10, '#8a7560', "italic 10px 'Crimson Text', Georgia, serif");

      const outerR = 220;
      const midR = 150;
      const innerR = 80;

      // Main 6 segments
      for (let i = 0; i < 6; i++) {
        const a1 = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const a2 = ((i + 1) / 6) * Math.PI * 2 - Math.PI / 2;

        // Outer: full color
        Draw.wedge(ctx, cx, cy, midR, outerR, a1, a2, segments[i].color);

        // Inner: lighter tint
        Draw.wedge(ctx, cx, cy, innerR, midR, a1, a2, CU.lighten(segments[i].color, 20));

        // Color name
        const midAngle = a1 + (a2 - a1) / 2;
        const nameR = (midR + outerR) / 2;
        const nx = cx + Math.cos(midAngle) * nameR;
        const ny = cy + Math.sin(midAngle) * nameR;

        ctx.save();
        ctx.translate(nx, ny);
        const rot = midAngle + Math.PI / 2;
        ctx.rotate(rot > Math.PI * 0.4 && rot < Math.PI * 1.6 ? rot + Math.PI : rot);
        ctx.textAlign = 'center';
        ctx.font = "bold 12px 'Crimson Text', Georgia, serif";
        ctx.fillStyle = CU.textColor(segments[i].color);
        ctx.fillText(segments[i].name, 0, -6);
        ctx.font = "italic 9px 'Crimson Text', Georgia, serif";
        ctx.fillText(segments[i].symbol, 0, 8);
        ctx.restore();

        // Quality in inner ring
        const qR = (innerR + midR) / 2;
        const qx = cx + Math.cos(midAngle) * qR;
        const qy = cy + Math.sin(midAngle) * qR;
        ctx.save();
        ctx.translate(qx, qy);
        ctx.rotate(rot > Math.PI * 0.4 && rot < Math.PI * 1.6 ? rot + Math.PI : rot);
        ctx.textAlign = 'center';
        ctx.font = "10px 'Crimson Text', Georgia, serif";
        ctx.fillStyle = CU.textColor(CU.lighten(segments[i].color, 20));
        ctx.fillText(segments[i].quality, 0, 0);
        ctx.restore();
      }

      // Center
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.fillStyle = '#f7f0e0';
      ctx.fill();
      ctx.strokeStyle = 'rgba(42,31,20,0.3)';
      ctx.stroke();

      // Complementary lines through center
      for (let i = 0; i < 3; i++) {
        const a1 = (i / 6) * Math.PI * 2 - Math.PI / 2 + Math.PI / 6;
        const a2 = a1 + Math.PI;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a1) * (innerR - 5), cy + Math.sin(a1) * (innerR - 5));
        ctx.lineTo(cx + Math.cos(a2) * (innerR - 5), cy + Math.sin(a2) * (innerR - 5));
        ctx.strokeStyle = 'rgba(42,31,20,0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Center labels
      Draw.centeredText(ctx, '+', cx - 25, cy - 25, 18, '#c83030');
      Draw.centeredText(ctx, '−', cx + 25, cy + 25, 18, '#3050a8');
      Draw.centeredText(ctx, 'Geist', cx, cy - 6, 11, '#2a1f14');
      Draw.centeredText(ctx, '&', cx, cy + 4, 9, '#8a7560');
      Draw.centeredText(ctx, 'Seele', cx, cy + 14, 11, '#2a1f14');

      // Outer border
      ctx.beginPath();
      ctx.arc(cx, cy, outerR + 2, 0, Math.PI * 2);
      ctx.strokeStyle = '#2a1f14';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Plus/minus side labels
      Draw.centeredText(ctx, '← Plus Side (Warm, Active) →', cx, h - 35, 10, '#8a7560');
      Draw.centeredText(ctx, '← Minus Side (Cold, Passive) →', cx, 52, 10, '#8a7560');
    };

    // Click to edit labels
    canvas.onclick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX - canvas.width / 2;
      const y = (e.clientY - rect.top) * scaleY - canvas.height / 2;
      const dist = Math.sqrt(x * x + y * y);

      if (dist > 150 && dist < 220) {
        let angle = Math.atan2(y, x) + Math.PI / 2;
        if (angle < 0) angle += Math.PI * 2;
        const seg = Math.floor((angle / (Math.PI * 2)) * 6) % 6;

        const newSymbol = prompt(`Edit symbolic meaning for "${segments[seg].name}":`, segments[seg].symbol);
        if (newSymbol) {
          segments[seg].symbol = newSymbol;
          draw();
        }
      }
    };

    controls.innerHTML = segments.map((s, i) =>
      `<div class="control-group"><label>${s.name}:</label><input type="color" id="goethe-c${i}" value="${s.color}"></div>`
    ).join('') + `<div class="control-group"><button class="btn" id="goethe-reset">Reset</button></div>`;

    const update = () => {
      segments.forEach((s, i) => {
        s.color = document.getElementById(`goethe-c${i}`).value;
      });
      draw();
    };

    segments.forEach((_, i) => {
      document.getElementById(`goethe-c${i}`).oninput = update;
    });

    document.getElementById('goethe-reset').onclick = () => {
      segments = defaultSegments.map(s => ({ ...s }));
      segments.forEach((s, i) => {
        document.getElementById(`goethe-c${i}`).value = s.color;
      });
      draw();
    };

    info.textContent = 'Click any label in the outer ring to edit its symbolic meaning. Goethe divided colour into a "plus" (warm, active) side and a "minus" (cold, passive) side, with each hue carrying allegorical weight.';
    draw();
  }
});
