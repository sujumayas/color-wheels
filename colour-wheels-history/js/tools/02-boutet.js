/* ═══════════════════════════════════════════════════════════════
   Tool 02: Boutet's Colour Circles (1708)
   Concentric circles showing primary, secondary, and tertiary
   colour mixing for painters.
   Interactive: Change the 3 primaries — secondaries & tertiaries
   auto-derive via subtractive (pigment) mixing.
   ═══════════════════════════════════════════════════════════════ */

ColorTools.register('boutet-1708', {
  name: 'Cercle Chromatique',
  shortName: 'Cercle Chromatique',
  author: 'Claude Boutet',
  year: 1708,
  description: 'An artist\'s colour circle showing how primary pigments mix to create secondaries and tertiaries. Change the three primaries — all derived colours update via subtractive (pigment) mixing.',

  render(viz, controls, info) {
    controls.style.display = 'flex';
    info.style.display = 'block';

    let primaries = ['#cc3333', '#d4b820', '#2a55a0']; // RYB-style defaults

    const canvas = Draw.createCanvas(viz, 560, 560);
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      const cx = w / 2, cy = h / 2;
      Draw.parchmentBg(ctx, w, h);

      // Title
      Draw.centeredText(ctx, 'CERCLE CHROMATIQUE', cx, 28, 16, '#2a1f14', "small-caps 16px 'IM Fell DW Pica SC', Georgia, serif");

      const [p1, p2, p3] = primaries;

      // Secondary mixes (between adjacent primaries)
      const s1 = CU.mixSubtractive([p1, p2]); // P1+P2
      const s2 = CU.mixSubtractive([p2, p3]); // P2+P3
      const s3 = CU.mixSubtractive([p3, p1]); // P3+P1

      // Tertiaries (primary + adjacent secondary)
      const t1 = CU.mixSubtractive([p1, s1]); // P1 + (P1+P2)
      const t2 = CU.mixSubtractive([p2, s1]); // P2 + (P1+P2)
      const t3 = CU.mixSubtractive([p2, s2]); // P2 + (P2+P3)
      const t4 = CU.mixSubtractive([p3, s2]); // P3 + (P2+P3)
      const t5 = CU.mixSubtractive([p3, s3]); // P3 + (P3+P1)
      const t6 = CU.mixSubtractive([p1, s3]); // P1 + (P3+P1)

      // 12 colors around the wheel
      const wheel12 = [p1, t1, s1, t2, p2, t3, s2, t4, p3, t5, s3, t6];
      const labels = ['I', '', 'II', '', 'I', '', 'II', '', 'I', '', 'II', ''];

      // Outer ring — 12 tertiary segments
      const r3 = 220, r2 = 160, r1 = 100, r0 = 50;

      for (let i = 0; i < 12; i++) {
        const a1 = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const a2 = ((i + 1) / 12) * Math.PI * 2 - Math.PI / 2;
        Draw.wedge(ctx, cx, cy, r2, r3, a1, a2, wheel12[i]);
      }

      // Middle ring — 6 segments (primaries + secondaries)
      const wheel6 = [p1, s1, p2, s2, p3, s3];
      for (let i = 0; i < 6; i++) {
        const a1 = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const a2 = ((i + 1) / 6) * Math.PI * 2 - Math.PI / 2;
        Draw.wedge(ctx, cx, cy, r1, r2, a1, a2, wheel6[i]);
      }

      // Inner ring — 3 primaries
      for (let i = 0; i < 3; i++) {
        const a1 = (i / 3) * Math.PI * 2 - Math.PI / 2;
        const a2 = ((i + 1) / 3) * Math.PI * 2 - Math.PI / 2;
        Draw.wedge(ctx, cx, cy, r0, r1, a1, a2, primaries[i]);
      }

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, r0, 0, Math.PI * 2);
      ctx.fillStyle = CU.mixSubtractive(primaries);
      ctx.fill();
      ctx.strokeStyle = 'rgba(42,31,20,0.3)';
      ctx.stroke();

      // Labels around the outside
      const ringLabels = ['Primary', 'Tert.', 'Secondary', 'Tert.', 'Primary', 'Tert.', 'Secondary', 'Tert.', 'Primary', 'Tert.', 'Secondary', 'Tert.'];
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2 + Math.PI / 12;
        const lx = cx + Math.cos(angle) * (r3 + 20);
        const ly = cy + Math.sin(angle) * (r3 + 20);
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(angle + Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = "9px 'Crimson Text', Georgia, serif";
        ctx.fillStyle = '#8a7560';
        ctx.fillText(ringLabels[i], 0, 0);
        ctx.restore();
      }

      // Ring labels
      Draw.centeredText(ctx, '— Tertiaries —', cx, cy + r3 + 40, 11, '#8a7560');
      Draw.centeredText(ctx, '— Secondaries —', cx, cy + r2 + 8, 9, 'rgba(42,31,20,0.5)');
    };

    controls.innerHTML = `
      <div class="control-group"><label>Primary I:</label><input type="color" id="boutet-p1" value="${primaries[0]}"></div>
      <div class="control-group"><label>Primary II:</label><input type="color" id="boutet-p2" value="${primaries[1]}"></div>
      <div class="control-group"><label>Primary III:</label><input type="color" id="boutet-p3" value="${primaries[2]}"></div>
      <div class="control-group"><button class="btn" id="boutet-reset">Reset to RYB</button></div>
      <div class="control-group"><button class="btn" id="boutet-rgb">Try RGB</button></div>
    `;

    const update = () => {
      primaries = [
        document.getElementById('boutet-p1').value,
        document.getElementById('boutet-p2').value,
        document.getElementById('boutet-p3').value
      ];
      draw();
    };

    ['boutet-p1', 'boutet-p2', 'boutet-p3'].forEach(id => {
      document.getElementById(id).oninput = update;
    });

    document.getElementById('boutet-reset').onclick = () => {
      primaries = ['#cc3333', '#d4b820', '#2a55a0'];
      document.getElementById('boutet-p1').value = primaries[0];
      document.getElementById('boutet-p2').value = primaries[1];
      document.getElementById('boutet-p3').value = primaries[2];
      draw();
    };

    document.getElementById('boutet-rgb').onclick = () => {
      primaries = ['#ff0000', '#00ff00', '#0000ff'];
      document.getElementById('boutet-p1').value = primaries[0];
      document.getElementById('boutet-p2').value = primaries[1];
      document.getElementById('boutet-p3').value = primaries[2];
      draw();
    };

    info.textContent = 'Inner ring: 3 primaries. Middle ring: 6 (primaries + secondaries). Outer ring: 12 (with tertiaries). Centre shows the mix of all three primaries.';
    draw();
  }
});
