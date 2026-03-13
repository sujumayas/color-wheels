/* ═══════════════════════════════════════════════════════════════
   Tool 06: Schiffermüller's Farbensystem (1772)
   A 12-segment systematic colour wheel, one of the earliest
   truly systematic arrangements of colour.
   Interactive: Rotate the base hue, adjust saturation/lightness,
   explore complementary pairs by clicking segments.
   ═══════════════════════════════════════════════════════════════ */

ColorTools.register('schiffermuller-1772', {
  name: 'Farbensystem',
  shortName: 'Farbensystem',
  author: 'Ignaz Schiffermüller',
  year: 1772,
  description: 'A systematic 12-section colour wheel. Rotate the starting hue to explore different harmonies. Click any segment to see its complementary pair highlighted.',

  render(viz, controls, info) {
    controls.style.display = 'flex';
    info.style.display = 'block';

    let baseHue = 0;
    let saturation = 72;
    let lightness = 48;
    let selectedSeg = -1;

    // Original-style names for 12 segments
    const segNames = ['Roth', 'Orange', 'Gelb', 'Gelbgrün', 'Grün', 'Blaugrün', 'Blau', 'Ultramarin', 'Violett', 'Purpur', 'Karmin', 'Scharlach'];

    const canvas = Draw.createCanvas(viz, 560, 560);
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      const cx = w / 2, cy = h / 2;
      Draw.parchmentBg(ctx, w, h);

      Draw.centeredText(ctx, 'VERSUCH EINES FARBENSYSTEMS', cx, 22, 14, '#2a1f14', "small-caps 14px 'IM Fell DW Pica SC', Georgia, serif");

      const outerR = 230;
      const innerR = 100;

      // Draw 12 segments
      for (let i = 0; i < 12; i++) {
        const hue = (baseHue + i * 30) % 360;
        const a1 = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const a2 = ((i + 1) / 12) * Math.PI * 2 - Math.PI / 2;

        const color = CU.hslToHex(hue, saturation, lightness);

        // Outer ring
        Draw.wedge(ctx, cx, cy, innerR + 30, outerR, a1, a2, color);

        // Inner ring (darker version)
        Draw.wedge(ctx, cx, cy, innerR, innerR + 30, a1, a2, CU.hslToHex(hue, saturation, lightness * 0.6));

        // Highlight selected + complement
        if (selectedSeg === i || selectedSeg === (i + 6) % 12) {
          ctx.beginPath();
          ctx.arc(cx, cy, outerR, a1, a2);
          ctx.arc(cx, cy, innerR, a2, a1, true);
          ctx.closePath();
          ctx.strokeStyle = selectedSeg === i ? '#2a1f14' : '#f0e2c4';
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Labels
        const midAngle = a1 + (a2 - a1) / 2;
        const labelR = outerR + 20;
        const lx = cx + Math.cos(midAngle) * labelR;
        const ly = cy + Math.sin(midAngle) * labelR;

        ctx.save();
        ctx.translate(lx, ly);
        const rot = midAngle + Math.PI / 2;
        ctx.rotate(rot > Math.PI * 0.5 && rot < Math.PI * 1.5 ? rot + Math.PI : rot);
        ctx.textAlign = 'center';
        ctx.font = "10px 'Crimson Text', Georgia, serif";
        ctx.fillStyle = '#2a1f14';
        ctx.fillText(segNames[i], 0, 0);
        ctx.restore();

        // Degree number
        const numR = (innerR + outerR) / 2;
        const nx = cx + Math.cos(midAngle) * numR;
        const ny = cy + Math.sin(midAngle) * numR;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = "bold 11px 'Crimson Text', Georgia, serif";
        ctx.fillStyle = CU.textColor(color);
        ctx.fillText(`${(i + 1)}`, nx, ny);
      }

      // Center
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.fillStyle = '#f7f0e0';
      ctx.fill();
      ctx.strokeStyle = 'rgba(42,31,20,0.3)';
      ctx.stroke();

      // Center info
      if (selectedSeg >= 0) {
        const hue1 = (baseHue + selectedSeg * 30) % 360;
        const hue2 = (baseHue + ((selectedSeg + 6) % 12) * 30) % 360;
        const c1 = CU.hslToHex(hue1, saturation, lightness);
        const c2 = CU.hslToHex(hue2, saturation, lightness);

        // Show complementary pair
        ctx.beginPath();
        ctx.arc(cx - 25, cy - 10, 18, 0, Math.PI * 2);
        ctx.fillStyle = c1;
        ctx.fill();
        ctx.strokeStyle = '#2a1f14';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx + 25, cy - 10, 18, 0, Math.PI * 2);
        ctx.fillStyle = c2;
        ctx.fill();
        ctx.strokeStyle = '#2a1f14';
        ctx.stroke();

        Draw.centeredText(ctx, '⟷', cx, cy - 10, 14, '#8a7560');
        Draw.centeredText(ctx, 'Complementary Pair', cx, cy + 18, 10, '#8a7560');
        Draw.centeredText(ctx, `${segNames[selectedSeg]} & ${segNames[(selectedSeg + 6) % 12]}`, cx, cy + 32, 9, '#2a1f14');
      } else {
        Draw.centeredText(ctx, 'Click a', cx, cy - 12, 11, '#8a7560');
        Draw.centeredText(ctx, 'segment', cx, cy + 2, 11, '#8a7560');
      }
    };

    // Click handler
    canvas.onclick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX - canvas.width / 2;
      const y = (e.clientY - rect.top) * scaleY - canvas.height / 2;
      const dist = Math.sqrt(x * x + y * y);

      if (dist > 100 && dist < 230) {
        let angle = Math.atan2(y, x) + Math.PI / 2;
        if (angle < 0) angle += Math.PI * 2;
        selectedSeg = Math.floor((angle / (Math.PI * 2)) * 12) % 12;
        draw();
      }
    };

    controls.innerHTML = `
      <div class="control-group"><label>Base hue rotation:</label><input type="range" id="schiff-hue" min="0" max="359" value="${baseHue}" style="width:150px"><span id="schiff-hue-val">${baseHue}°</span></div>
      <div class="control-group"><label>Saturation:</label><input type="range" id="schiff-sat" min="10" max="100" value="${saturation}" style="width:100px"></div>
      <div class="control-group"><label>Lightness:</label><input type="range" id="schiff-lit" min="15" max="75" value="${lightness}" style="width:100px"></div>
      <div class="control-group"><button class="btn" id="schiff-reset">Reset</button></div>
    `;

    const update = () => {
      baseHue = parseInt(document.getElementById('schiff-hue').value);
      saturation = parseInt(document.getElementById('schiff-sat').value);
      lightness = parseInt(document.getElementById('schiff-lit').value);
      document.getElementById('schiff-hue-val').textContent = baseHue + '°';
      selectedSeg = -1;
      draw();
    };

    ['schiff-hue', 'schiff-sat', 'schiff-lit'].forEach(id => {
      document.getElementById(id).oninput = update;
    });

    document.getElementById('schiff-reset').onclick = () => {
      baseHue = 0; saturation = 72; lightness = 48; selectedSeg = -1;
      document.getElementById('schiff-hue').value = 0;
      document.getElementById('schiff-sat').value = 72;
      document.getElementById('schiff-lit').value = 48;
      draw();
    };

    info.textContent = 'Click any segment to highlight its complementary opposite. Rotate the base hue to explore how all 12 harmonies shift together.';
    draw();
  }
});
