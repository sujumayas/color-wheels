/* ═══════════════════════════════════════════════════════════════
   Tool 08: Lambert's Farbenpyramide (1772)
   3D color pyramid — white apex, colors at base triangle.
   Cross-sections at different heights show progressively
   lighter/desaturated colors.
   Interactive: Adjust height slider to see cross-section layers.
   ═══════════════════════════════════════════════════════════════ */

ColorTools.register('lambert-1772', {
  name: 'Farbenpyramide',
  shortName: 'Farbenpyramide',
  author: 'Johann Heinrich Lambert',
  year: 1772,
  description: 'Lambert extended Mayer\'s triangle into the third dimension — a pyramid with white at the apex and full-saturation colours at the base. Slide the height to see how colours lighten and converge toward white.',

  render(viz, controls, info) {
    controls.style.display = 'flex';
    info.style.display = 'block';

    let baseColors = ['#cc2020', '#d4c820', '#2040a0'];
    let sliceHeight = 0; // 0 = base, 100 = apex (white)
    const apexColor = '#ffffff';

    const canvas = Draw.createCanvas(viz, 600, 560);
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      Draw.parchmentBg(ctx, w, h);

      Draw.centeredText(ctx, 'FARBENPYRAMIDE', w / 2, 22, 16, '#2a1f14', "small-caps 16px 'IM Fell DW Pica SC', Georgia, serif");

      const t = sliceHeight / 100; // 0 = base, 1 = apex

      // The cross-section at height t is a triangle that shrinks and brightens
      // Colors blend toward white as we go up

      // Left side: 3D pyramid side view
      const pyX = 140, pyY = 70, pyW = 120, pyH = 400;
      const apexPt = { x: pyX + pyW / 2, y: pyY };
      const baseL = { x: pyX, y: pyY + pyH };
      const baseR = { x: pyX + pyW, y: pyY + pyH };

      // Draw pyramid outline
      ctx.beginPath();
      ctx.moveTo(apexPt.x, apexPt.y);
      ctx.lineTo(baseL.x, baseL.y);
      ctx.lineTo(baseR.x, baseR.y);
      ctx.closePath();
      ctx.strokeStyle = '#2a1f14';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Fill with gradient
      const grad = ctx.createLinearGradient(0, pyY, 0, pyY + pyH);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(1, CU.mixSubtractive(baseColors));
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.3;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Slice line
      const sliceY = pyY + (1 - t) * pyH;
      const sliceW = pyW * (1 - t);
      const sliceL = pyX + pyW / 2 - sliceW / 2;
      const sliceR = pyX + pyW / 2 + sliceW / 2;

      ctx.beginPath();
      ctx.moveTo(sliceL, sliceY);
      ctx.lineTo(sliceR, sliceY);
      ctx.strokeStyle = '#8b4513';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Height indicator
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(sliceR + 5, sliceY);
      ctx.lineTo(pyX + pyW + 30, sliceY);
      ctx.strokeStyle = '#8a7560';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.setLineDash([]);

      Draw.centeredText(ctx, `${sliceHeight}%`, pyX + pyW + 45, sliceY, 10, '#8b4513');
      Draw.centeredText(ctx, 'White', apexPt.x, apexPt.y - 10, 10, '#8a7560');
      Draw.centeredText(ctx, 'Base', pyX + pyW / 2, baseL.y + 15, 10, '#8a7560');
      Draw.centeredText(ctx, 'Side View', pyX + pyW / 2, baseL.y + 32, 9, '#8a7560', "italic 9px 'Crimson Text', Georgia, serif");

      // Right side: the cross-section triangle at current height
      const triCx = 420, triCy = 280;
      const maxTriR = 200;
      const triR = maxTriR * (1 - t);

      // The colors at this slice are base colors blended toward white by t
      const sliceColors = baseColors.map(c => CU.lerp(c, apexColor, t));

      if (triR > 5) {
        const triTop = { x: triCx, y: triCy - triR * 0.866 };
        const triLeft = { x: triCx - triR, y: triCy + triR * 0.5 };
        const triRight = { x: triCx + triR, y: triCy + triR * 0.5 };

        // Draw filled triangle grid
        const n = Math.max(3, Math.round(9 * (1 - t)));
        for (let row = 0; row <= n; row++) {
          for (let col = 0; col <= n - row; col++) {
            const third = n - row - col;
            const u = row / n, v = col / n, wgt = third / n;

            const x = triTop.x * u + triLeft.x * v + triRight.x * wgt;
            const y = triTop.y * u + triLeft.y * v + triRight.y * wgt;

            const c0 = CU.hexToRgb(sliceColors[0]);
            const c1 = CU.hexToRgb(sliceColors[1]);
            const c2 = CU.hexToRgb(sliceColors[2]);

            const r = c0.r * u + c1.r * v + c2.r * wgt;
            const g = c0.g * u + c1.g * v + c2.g * wgt;
            const b = c0.b * u + c1.b * v + c2.b * wgt;
            const color = CU.rgbToHex(r, g, b);

            const cellR = triR / (n * 1.2);
            ctx.beginPath();
            for (let a = 0; a < 6; a++) {
              const angle = (a * 60 - 30) * Math.PI / 180;
              const hx = x + cellR * Math.cos(angle);
              const hy = y + cellR * Math.sin(angle);
              if (a === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = 'rgba(42,31,20,0.1)';
            ctx.lineWidth = 0.3;
            ctx.stroke();
          }
        }

        // Triangle outline
        ctx.beginPath();
        ctx.moveTo(triTop.x, triTop.y);
        ctx.lineTo(triLeft.x, triLeft.y);
        ctx.lineTo(triRight.x, triRight.y);
        ctx.closePath();
        ctx.strokeStyle = 'rgba(42,31,20,0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        // Near apex — just a white dot
        ctx.beginPath();
        ctx.arc(triCx, triCy, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#2a1f14';
        ctx.stroke();
      }

      Draw.centeredText(ctx, `Cross-Section at ${sliceHeight}% Height`, triCx, triCy + maxTriR * 0.5 + 30, 11, '#8a7560');
    };

    controls.innerHTML = `
      <div class="control-group"><label>Height (0=base, 100=apex):</label><input type="range" id="lambert-h" min="0" max="95" value="${sliceHeight}" style="width:200px"><span id="lambert-hval">${sliceHeight}%</span></div>
      <div class="control-group"><label>Base I:</label><input type="color" id="lambert-c0" value="${baseColors[0]}"></div>
      <div class="control-group"><label>Base II:</label><input type="color" id="lambert-c1" value="${baseColors[1]}"></div>
      <div class="control-group"><label>Base III:</label><input type="color" id="lambert-c2" value="${baseColors[2]}"></div>
      <div class="control-group"><button class="btn" id="lambert-reset">Reset</button></div>
    `;

    const update = () => {
      sliceHeight = parseInt(document.getElementById('lambert-h').value);
      document.getElementById('lambert-hval').textContent = sliceHeight + '%';
      baseColors = [
        document.getElementById('lambert-c0').value,
        document.getElementById('lambert-c1').value,
        document.getElementById('lambert-c2').value
      ];
      draw();
    };

    ['lambert-h', 'lambert-c0', 'lambert-c1', 'lambert-c2'].forEach(id => {
      document.getElementById(id).oninput = update;
    });

    document.getElementById('lambert-reset').onclick = () => {
      sliceHeight = 0;
      baseColors = ['#cc2020', '#d4c820', '#2040a0'];
      document.getElementById('lambert-h').value = 0;
      document.getElementById('lambert-c0').value = baseColors[0];
      document.getElementById('lambert-c1').value = baseColors[1];
      document.getElementById('lambert-c2').value = baseColors[2];
      draw();
    };

    info.textContent = 'The pyramid shows every possible combination of the three base colours at every lightness level, from full saturation at the base to pure white at the apex.';
    draw();
  }
});
