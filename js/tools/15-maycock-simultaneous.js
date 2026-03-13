/* ═══════════════════════════════════════════════════════════════
   Tool 15: Maycock's Simultaneous Contrasts (1895)
   Demonstrates how the same colour looks different when placed
   on different backgrounds — the simultaneous contrast effect.
   Interactive: Change center and background colours.
   ═══════════════════════════════════════════════════════════════ */

ColorTools.register('maycock-simul-1895', {
  name: 'Simultaneous Contrasts',
  shortName: 'Simul. Contrasts',
  author: 'Mark Maycock',
  year: 1895,
  description: 'Maycock demonstrated that the same colour appears different depending on its surroundings. All centre squares below are identical — only the background changes. Adjust the centre colour to explore the illusion.',

  render(viz, controls, info) {
    controls.style.display = 'flex';
    info.style.display = 'block';

    let centerColor = '#808080'; // Neutral gray for maximum effect
    let backgrounds = ['#cc3030', '#3060cc', '#30a030', '#d8c030', '#202020', '#e8e0d0', '#cc6030', '#6030a0'];

    const canvas = Draw.createCanvas(viz, 700, 500);
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      Draw.parchmentBg(ctx, w, h);

      Draw.centeredText(ctx, 'SIMULTANEOUS CONTRASTS', w / 2, 22, 15, '#2a1f14', "small-caps 15px 'IM Fell DW Pica SC', Georgia, serif");
      Draw.centeredText(ctx, 'The same colour on different backgrounds', w / 2, 40, 11, '#8a7560', "italic 11px 'Crimson Text', Georgia, serif");

      const cols = 4;
      const rows = Math.ceil(backgrounds.length / cols);
      const cellW = 145;
      const cellH = 145;
      const gap = 15;
      const startX = (w - cols * (cellW + gap) + gap) / 2;
      const startY = 60;
      const innerSize = 50;

      backgrounds.forEach((bg, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * (cellW + gap);
        const y = startY + row * (cellH + gap + 20);

        // Background square
        ctx.fillStyle = bg;
        ctx.fillRect(x, y, cellW, cellH);
        ctx.strokeStyle = 'rgba(42,31,20,0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellW, cellH);

        // Center square (same color for all)
        const ix = x + (cellW - innerSize) / 2;
        const iy = y + (cellH - innerSize) / 2;
        ctx.fillStyle = centerColor;
        ctx.fillRect(ix, iy, innerSize, innerSize);
        ctx.strokeStyle = 'rgba(42,31,20,0.1)';
        ctx.strokeRect(ix, iy, innerSize, innerSize);

        // Label
        Draw.centeredText(ctx, `bg: ${bg}`, x + cellW / 2, y + cellH + 12, 9, '#8a7560');
      });

      // Bottom reference
      const refY = startY + rows * (cellH + gap + 20) + 10;
      Draw.centeredText(ctx, `All centre squares are: ${centerColor}`, w / 2, refY, 12, '#2a1f14');

      // Reference swatch
      ctx.fillStyle = centerColor;
      ctx.fillRect(w / 2 - 20, refY + 10, 40, 25);
      ctx.strokeStyle = '#2a1f14';
      ctx.strokeRect(w / 2 - 20, refY + 10, 40, 25);
      Draw.centeredText(ctx, '← actual colour, no background', w / 2 + 65, refY + 22, 9, '#8a7560');
    };

    controls.innerHTML = `
      <div class="control-group"><label>Centre colour:</label><input type="color" id="msim-center" value="${centerColor}"></div>
      <div class="control-group"><label>Preset:</label>
        <select id="msim-preset">
          <option value="gray">Gray (maximum effect)</option>
          <option value="warm">Warm tone</option>
          <option value="cool">Cool tone</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      <div class="control-group"><button class="btn" id="msim-reset">Reset</button></div>
    `;

    const presets = {
      gray: '#808080',
      warm: '#c89060',
      cool: '#6080a0',
      custom: centerColor
    };

    const update = () => {
      centerColor = document.getElementById('msim-center').value;
      draw();
    };

    document.getElementById('msim-center').oninput = update;

    document.getElementById('msim-preset').onchange = (e) => {
      const preset = e.target.value;
      if (presets[preset]) {
        centerColor = presets[preset];
        document.getElementById('msim-center').value = centerColor;
        draw();
      }
    };

    document.getElementById('msim-reset').onclick = () => {
      centerColor = '#808080';
      document.getElementById('msim-center').value = centerColor;
      document.getElementById('msim-preset').value = 'gray';
      draw();
    };

    info.textContent = 'Simultaneous contrast is an optical illusion: a colour shifts toward the complement of its background. Gray on red appears greenish; gray on blue appears yellowish. Try different centre colours to see the effect.';
    draw();
  }
});
