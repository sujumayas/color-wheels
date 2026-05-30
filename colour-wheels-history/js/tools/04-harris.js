/* ═══════════════════════════════════════════════════════════════
   Tool 04: Moses Harris's Prismatic Wheel (1766)
   A shaded colour wheel with 18 sections, each showing gradual
   shading from the pure hue to black at the center.
   Interactive: Set 3 primary hues — the wheel auto-generates
   all intermediate hues with shading.
   ═══════════════════════════════════════════════════════════════ */

ColorTools.register('harris-1766', {
  name: 'The Prismatic Wheel',
  shortName: 'Prismatic Wheel',
  author: 'Moses Harris',
  year: 1766,
  description: 'Harris\'s wheel shows 18 hues arranged in a circle, each shading from vivid at the rim to black at the centre. Set three base hues — all intermediates and shading are generated automatically.',

  render(viz, controls, info) {
    controls.style.display = 'flex';
    info.style.display = 'block';

    let primaries = ['#cc2222', '#cccc22', '#2244aa']; // R, Y, B
    let segments = 18;

    const canvas = Draw.createCanvas(viz, 580, 580);
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      const cx = w / 2, cy = h / 2;
      Draw.parchmentBg(ctx, w, h);

      Draw.centeredText(ctx, 'THE PRISMATIC WHEEL', cx, 22, 15, '#2a1f14', "small-caps 15px 'IM Fell DW Pica SC', Georgia, serif");

      // Generate N hues by interpolating around the primaries
      const hues = [];
      const pHsls = primaries.map(hex => {
        const rgb = CU.hexToRgb(hex);
        return CU.rgbToHsl(rgb.r, rgb.g, rgb.b);
      });

      for (let i = 0; i < segments; i++) {
        const t = i / segments;
        // Map to position between primaries (3 primaries at 0, 1/3, 2/3)
        let idx, localT;
        if (t < 1/3) { idx = 0; localT = t * 3; }
        else if (t < 2/3) { idx = 1; localT = (t - 1/3) * 3; }
        else { idx = 2; localT = (t - 2/3) * 3; }

        const next = (idx + 1) % 3;
        let h1 = pHsls[idx].h, h2 = pHsls[next].h;
        // Handle hue wrapping
        if (Math.abs(h2 - h1) > 180) {
          if (h1 < h2) h1 += 360; else h2 += 360;
        }
        const hue = ((h1 + (h2 - h1) * localT) + 360) % 360;
        const sat = pHsls[idx].s + (pHsls[next].s - pHsls[idx].s) * localT;
        hues.push({ h: hue, s: sat });
      }

      // Draw the shaded wheel
      const outerR = 250;
      const innerR = 30;
      const rings = 10;

      for (let ring = 0; ring < rings; ring++) {
        const r1 = innerR + (outerR - innerR) * (ring / rings);
        const r2 = innerR + (outerR - innerR) * ((ring + 1) / rings);
        const lightness = 10 + (ring / (rings - 1)) * 45; // 10% (dark center) to 55% (vivid edge)

        for (let i = 0; i < segments; i++) {
          const a1 = (i / segments) * Math.PI * 2 - Math.PI / 2;
          const a2 = ((i + 1) / segments) * Math.PI * 2 - Math.PI / 2;
          const color = CU.hslToHex(hues[i].h, hues[i].s, lightness);
          Draw.wedge(ctx, cx, cy, r1, r2, a1, a2, color);
        }
      }

      // Center circle (near black)
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.fillStyle = '#1a1510';
      ctx.fill();
      ctx.strokeStyle = 'rgba(42,31,20,0.3)';
      ctx.stroke();

      // Outer ring labels
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2 - Math.PI / 2 + Math.PI / segments;
        const fullColor = CU.hslToHex(hues[i].h, hues[i].s, 50);
        const lx = cx + Math.cos(angle) * (outerR + 16);
        const ly = cy + Math.sin(angle) * (outerR + 16);
        ctx.save();
        ctx.translate(lx, ly);
        const rot = angle + Math.PI / 2;
        ctx.rotate(rot > Math.PI / 2 && rot < Math.PI * 1.5 ? rot + Math.PI : rot);
        ctx.textAlign = 'center';
        ctx.font = "9px 'Crimson Text', Georgia, serif";
        ctx.fillStyle = '#8a7560';
        ctx.fillText((i + 1).toString(), 0, 0);
        ctx.restore();
      }

      // Mark primaries
      for (let i = 0; i < 3; i++) {
        const segIdx = Math.round(i * segments / 3);
        const angle = (segIdx / segments) * Math.PI * 2 - Math.PI / 2 + Math.PI / segments;
        const mx = cx + Math.cos(angle) * (outerR + 28);
        const my = cy + Math.sin(angle) * (outerR + 28);
        ctx.beginPath();
        ctx.arc(mx, my, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#8b4513';
        ctx.fill();
      }
    };

    controls.innerHTML = `
      <div class="control-group"><label>Primary I:</label><input type="color" id="harris-p1" value="${primaries[0]}"></div>
      <div class="control-group"><label>Primary II:</label><input type="color" id="harris-p2" value="${primaries[1]}"></div>
      <div class="control-group"><label>Primary III:</label><input type="color" id="harris-p3" value="${primaries[2]}"></div>
      <div class="control-group"><label>Segments:</label>
        <select id="harris-seg">
          <option value="12">12</option>
          <option value="18" selected>18</option>
          <option value="24">24</option>
          <option value="36">36</option>
        </select>
      </div>
      <div class="control-group"><button class="btn" id="harris-reset">Reset</button></div>
    `;

    const update = () => {
      primaries = [
        document.getElementById('harris-p1').value,
        document.getElementById('harris-p2').value,
        document.getElementById('harris-p3').value
      ];
      segments = parseInt(document.getElementById('harris-seg').value);
      draw();
    };

    ['harris-p1', 'harris-p2', 'harris-p3', 'harris-seg'].forEach(id => {
      document.getElementById(id).oninput = update;
    });

    document.getElementById('harris-reset').onclick = () => {
      primaries = ['#cc2222', '#cccc22', '#2244aa'];
      segments = 18;
      document.getElementById('harris-p1').value = primaries[0];
      document.getElementById('harris-p2').value = primaries[1];
      document.getElementById('harris-p3').value = primaries[2];
      document.getElementById('harris-seg').value = '18';
      draw();
    };

    info.textContent = 'Each segment shades from vivid colour at the rim to near-black at the centre, showing the full tonal range of each hue. Three small dots mark the primary positions.';
    draw();
  }
});
