/* ═══════════════════════════════════════════════════════════════
   Tool 11: Sowerby's Prismatic & Material Colours (1809)
   Side-by-side comparison of additive (prismatic/light) vs
   subtractive (material/pigment) colour mixing.
   Interactive: Pick colours, see both mixing results.
   ═══════════════════════════════════════════════════════════════ */

ColorTools.register('sowerby-1809', {
  name: 'Prismatic & Material Colours',
  shortName: 'Prismatic & Material',
  author: 'James Sowerby',
  year: 1809,
  description: 'Sowerby distinguished between prismatic (light) and material (pigment) colours — the same hues mix differently depending on the medium. Choose colours to compare additive (light) vs subtractive (pigment) mixing side by side.',

  render(viz, controls, info) {
    controls.style.display = 'flex';
    info.style.display = 'block';

    let selectedColors = ['#cc2020', '#2040a0', '#d8c830'];

    const canvas = Draw.createCanvas(viz, 700, 480);
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      Draw.parchmentBg(ctx, w, h);

      Draw.centeredText(ctx, 'PRISMATIC & MATERIAL COLOURS', w / 2, 22, 14, '#2a1f14', "small-caps 14px 'IM Fell DW Pica SC', Georgia, serif");

      const leftX = w / 4;
      const rightX = 3 * w / 4;
      const topY = 60;

      // Headers
      Draw.centeredText(ctx, 'Prismatic (Light / Additive)', leftX, topY, 12, '#2a1f14');
      Draw.centeredText(ctx, 'Material (Pigment / Subtractive)', rightX, topY, 12, '#2a1f14');

      // Draw input colors
      const swatchY = topY + 30;
      const swatchR = 22;
      const gap = 60;
      const startX = (w / 2 - (selectedColors.length - 1) * gap / 2) / 2;

      // Left side inputs
      selectedColors.forEach((c, i) => {
        const x = leftX - (selectedColors.length - 1) * gap / 2 + i * gap;
        ctx.beginPath();
        ctx.arc(x, swatchY, swatchR, 0, Math.PI * 2);
        ctx.fillStyle = c;
        ctx.fill();
        ctx.strokeStyle = '#2a1f14';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Right side inputs
      selectedColors.forEach((c, i) => {
        const x = rightX - (selectedColors.length - 1) * gap / 2 + i * gap;
        ctx.beginPath();
        ctx.arc(x, swatchY, swatchR, 0, Math.PI * 2);
        ctx.fillStyle = c;
        ctx.fill();
        ctx.strokeStyle = '#2a1f14';
        ctx.stroke();
      });

      // Mixing arrows
      Draw.centeredText(ctx, '↓ mix ↓', leftX, swatchY + 45, 11, '#8a7560');
      Draw.centeredText(ctx, '↓ mix ↓', rightX, swatchY + 45, 11, '#8a7560');

      // Results
      const resultY = swatchY + 80;
      const resultR = 45;

      // Additive (light) mix
      const additive = CU.mixAdditive(selectedColors);
      ctx.beginPath();
      ctx.arc(leftX, resultY, resultR, 0, Math.PI * 2);
      ctx.fillStyle = additive;
      ctx.fill();
      ctx.strokeStyle = '#2a1f14';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      Draw.centeredText(ctx, additive, leftX, resultY + resultR + 18, 11, '#2a1f14');
      Draw.centeredText(ctx, 'Additive Result', leftX, resultY + resultR + 32, 10, '#8a7560');

      // Subtractive (pigment) mix
      const subtractive = CU.mixSubtractive(selectedColors);
      ctx.beginPath();
      ctx.arc(rightX, resultY, resultR, 0, Math.PI * 2);
      ctx.fillStyle = subtractive;
      ctx.fill();
      ctx.strokeStyle = '#2a1f14';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      Draw.centeredText(ctx, subtractive, rightX, resultY + resultR + 18, 11, '#2a1f14');
      Draw.centeredText(ctx, 'Subtractive Result', rightX, resultY + resultR + 32, 10, '#8a7560');

      // Pairwise mixes
      const pairY = resultY + resultR + 60;
      Draw.centeredText(ctx, '— Pairwise Mixing —', w / 2, pairY, 11, '#8a7560');

      let py = pairY + 25;
      for (let i = 0; i < selectedColors.length; i++) {
        for (let j = i + 1; j < selectedColors.length; j++) {
          const addPair = CU.mixAdditive([selectedColors[i], selectedColors[j]]);
          const subPair = CU.mixSubtractive([selectedColors[i], selectedColors[j]]);

          // Left (additive)
          const lx = leftX - 60;
          ctx.beginPath(); ctx.arc(lx, py, 12, 0, Math.PI * 2);
          ctx.fillStyle = selectedColors[i]; ctx.fill(); ctx.stroke();
          Draw.centeredText(ctx, '+', lx + 20, py, 11, '#8a7560');
          ctx.beginPath(); ctx.arc(lx + 38, py, 12, 0, Math.PI * 2);
          ctx.fillStyle = selectedColors[j]; ctx.fill(); ctx.stroke();
          Draw.centeredText(ctx, '=', lx + 58, py, 11, '#8a7560');
          ctx.beginPath(); ctx.arc(lx + 78, py, 14, 0, Math.PI * 2);
          ctx.fillStyle = addPair; ctx.fill(); ctx.stroke();
          Draw.centeredText(ctx, addPair, lx + 115, py, 8, '#8a7560');

          // Right (subtractive)
          const rx = rightX - 60;
          ctx.beginPath(); ctx.arc(rx, py, 12, 0, Math.PI * 2);
          ctx.fillStyle = selectedColors[i]; ctx.fill(); ctx.stroke();
          Draw.centeredText(ctx, '+', rx + 20, py, 11, '#8a7560');
          ctx.beginPath(); ctx.arc(rx + 38, py, 12, 0, Math.PI * 2);
          ctx.fillStyle = selectedColors[j]; ctx.fill(); ctx.stroke();
          Draw.centeredText(ctx, '=', rx + 58, py, 11, '#8a7560');
          ctx.beginPath(); ctx.arc(rx + 78, py, 14, 0, Math.PI * 2);
          ctx.fillStyle = subPair; ctx.fill(); ctx.stroke();
          Draw.centeredText(ctx, subPair, rx + 115, py, 8, '#8a7560');

          py += 35;
        }
      }

      // Dividing line
      ctx.beginPath();
      ctx.moveTo(w / 2, topY + 15);
      ctx.lineTo(w / 2, py + 10);
      ctx.strokeStyle = 'rgba(42,31,20,0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    controls.innerHTML = selectedColors.map((c, i) =>
      `<div class="control-group"><label>Colour ${i + 1}:</label><input type="color" id="sow-c${i}" value="${c}"></div>`
    ).join('') + `
      <div class="control-group"><button class="btn" id="sow-add">+ Add Colour</button></div>
      <div class="control-group"><button class="btn" id="sow-remove">− Remove</button></div>
      <div class="control-group"><button class="btn" id="sow-reset">Reset</button></div>
    `;

    const rebuildControls = () => {
      const panel = controls;
      panel.innerHTML = selectedColors.map((c, i) =>
        `<div class="control-group"><label>Colour ${i + 1}:</label><input type="color" id="sow-c${i}" value="${c}"></div>`
      ).join('') + `
        <div class="control-group"><button class="btn" id="sow-add">+ Add</button></div>
        <div class="control-group"><button class="btn" id="sow-remove">− Remove</button></div>
        <div class="control-group"><button class="btn" id="sow-reset">Reset</button></div>
      `;
      selectedColors.forEach((_, i) => {
        document.getElementById(`sow-c${i}`).oninput = (e) => {
          selectedColors[i] = e.target.value;
          draw();
        };
      });
      document.getElementById('sow-add').onclick = () => {
        if (selectedColors.length < 6) {
          selectedColors.push(CU.random());
          rebuildControls();
          draw();
        }
      };
      document.getElementById('sow-remove').onclick = () => {
        if (selectedColors.length > 2) {
          selectedColors.pop();
          rebuildControls();
          draw();
        }
      };
      document.getElementById('sow-reset').onclick = () => {
        selectedColors = ['#cc2020', '#2040a0', '#d8c830'];
        rebuildControls();
        draw();
      };
    };

    rebuildControls();
    info.textContent = 'Light mixing (additive) tends toward white; pigment mixing (subtractive) tends toward dark. The same input colours produce very different results depending on the medium.';
    draw();
  }
});
