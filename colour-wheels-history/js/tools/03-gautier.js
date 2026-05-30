/* ═══════════════════════════════════════════════════════════════
   Tool 03: Gautier's Colour Chart (1746)
   Theory that primaries are Black & White, with RGB as secondary.
   Colours emerge from darkness via presence of light.
   Interactive: Adjust light intensity slider to see colors emerge.
   ═══════════════════════════════════════════════════════════════ */

ColorTools.register('gautier-1746', {
  name: 'Lumière et Ombre',
  shortName: 'Lumière et Ombre',
  author: 'Jacques-Fabien Gautier',
  year: 1746,
  description: 'Gautier theorized that Black and White are the true primaries, with colours drawn out of shadow by the presence of light. Adjust the light intensity to watch colours emerge from darkness, and change the three secondary hues.',

  render(viz, controls, info) {
    controls.style.display = 'flex';
    info.style.display = 'block';

    let lightLevel = 50;
    let secondaries = ['#c83333', '#d4c020', '#3355aa']; // Red, Yellow, Blue

    const canvas = Draw.createCanvas(viz, 600, 500);
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      Draw.parchmentBg(ctx, w, h);

      Draw.centeredText(ctx, 'LUMIÈRE ET OMBRE', w / 2, 25, 16, '#2a1f14', "small-caps 16px 'IM Fell DW Pica SC', Georgia, serif");

      const t = lightLevel / 100; // 0 = pure dark, 1 = pure light

      // Black to White gradient bar at top
      const barY = 50, barH = 35;
      const grad = ctx.createLinearGradient(50, 0, w - 50, 0);
      grad.addColorStop(0, '#000000');
      grad.addColorStop(1, '#ffffff');
      ctx.fillStyle = grad;
      ctx.fillRect(50, barY, w - 100, barH);
      ctx.strokeStyle = '#2a1f14';
      ctx.lineWidth = 1;
      ctx.strokeRect(50, barY, w - 100, barH);

      // Light level indicator
      const indicatorX = 50 + t * (w - 100);
      ctx.beginPath();
      ctx.moveTo(indicatorX, barY + barH + 2);
      ctx.lineTo(indicatorX - 6, barY + barH + 12);
      ctx.lineTo(indicatorX + 6, barY + barH + 12);
      ctx.closePath();
      ctx.fillStyle = '#8b4513';
      ctx.fill();

      Draw.centeredText(ctx, 'BLACK', 50, barY - 8, 10, '#2a1f14');
      Draw.centeredText(ctx, 'WHITE', w - 50, barY - 8, 10, '#2a1f14');
      Draw.centeredText(ctx, `Light: ${lightLevel}%`, w / 2, barY + barH + 22, 11, '#8a7560');

      // For each secondary color, show how it appears at this light level
      // At 0% light: everything is black. At 100%: everything is white/washed out
      // Colors are most vivid around 40-60%

      const colY = 130;
      const colW = 140, colH = 280;
      const gap = 20;
      const startX = (w - (3 * colW + 2 * gap)) / 2;

      secondaries.forEach((baseHex, i) => {
        const x = startX + i * (colW + gap);
        const rgb = CU.hexToRgb(baseHex);
        const hsl = CU.rgbToHsl(rgb.r, rgb.g, rgb.b);

        // Create a vertical gradient: from black (bottom) through the color to white (top)
        // The light level determines which "slice" is highlighted
        const steps = 20;
        const stepH = colH / steps;

        for (let s = 0; s < steps; s++) {
          const fraction = s / (steps - 1); // 0 = top (light) to 1 = bottom (dark)
          const lightness = 100 - fraction * 100;

          const col = CU.hslToHex(hsl.h, hsl.s, lightness);
          ctx.fillStyle = col;
          ctx.fillRect(x, colY + s * stepH, colW, stepH + 1);

          // Highlight the current light level slice
          const sliceFraction = 1 - t;
          if (Math.abs(fraction - sliceFraction) < 0.06) {
            ctx.strokeStyle = '#2a1f14';
            ctx.lineWidth = 2;
            ctx.strokeRect(x - 3, colY + s * stepH - 1, colW + 6, stepH + 2);
          }
        }

        // Border
        ctx.strokeStyle = '#2a1f14';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, colY, colW, colH);

        // Label
        const currentL = t * 80 + 10; // Map light level to lightness range
        const currentColor = CU.hslToHex(hsl.h, hsl.s, currentL);
        Draw.centeredText(ctx, ['Rouge', 'Jaune', 'Bleu'][i], x + colW / 2, colY + colH + 18, 13, '#2a1f14');
        Draw.centeredText(ctx, currentColor, x + colW / 2, colY + colH + 34, 10, '#8a7560');

        // Show the current extracted color as a circle
        ctx.beginPath();
        ctx.arc(x + colW / 2, colY + colH + 55, 15, 0, Math.PI * 2);
        ctx.fillStyle = currentColor;
        ctx.fill();
        ctx.strokeStyle = '#2a1f14';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Show the "extracted" combined result
      const extractedColors = secondaries.map(hex => {
        const rgb = CU.hexToRgb(hex);
        const hsl = CU.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const currentL = t * 80 + 10;
        return CU.hslToHex(hsl.h, hsl.s, currentL);
      });

      const mixedResult = CU.mixSubtractive(extractedColors);
      Draw.centeredText(ctx, 'Combined at this light level:', w / 2, colY + colH + 82, 11, '#8a7560');

      ctx.beginPath();
      ctx.arc(w / 2, colY + colH + 106, 18, 0, Math.PI * 2);
      ctx.fillStyle = mixedResult;
      ctx.fill();
      ctx.strokeStyle = '#2a1f14';
      ctx.stroke();
    };

    controls.innerHTML = `
      <div class="control-group"><label>Light intensity:</label><input type="range" id="gautier-light" min="0" max="100" value="${lightLevel}" style="width:200px"></div>
      <div class="control-group"><label>Hue I:</label><input type="color" id="gautier-c1" value="${secondaries[0]}"></div>
      <div class="control-group"><label>Hue II:</label><input type="color" id="gautier-c2" value="${secondaries[1]}"></div>
      <div class="control-group"><label>Hue III:</label><input type="color" id="gautier-c3" value="${secondaries[2]}"></div>
      <div class="control-group"><button class="btn" id="gautier-reset">Reset</button></div>
    `;

    const update = () => {
      lightLevel = parseInt(document.getElementById('gautier-light').value);
      secondaries = [
        document.getElementById('gautier-c1').value,
        document.getElementById('gautier-c2').value,
        document.getElementById('gautier-c3').value
      ];
      draw();
    };

    ['gautier-light', 'gautier-c1', 'gautier-c2', 'gautier-c3'].forEach(id => {
      document.getElementById(id).oninput = update;
    });

    document.getElementById('gautier-reset').onclick = () => {
      lightLevel = 50;
      secondaries = ['#c83333', '#d4c020', '#3355aa'];
      document.getElementById('gautier-light').value = 50;
      document.getElementById('gautier-c1').value = secondaries[0];
      document.getElementById('gautier-c2').value = secondaries[1];
      document.getElementById('gautier-c3').value = secondaries[2];
      draw();
    };

    info.textContent = 'Gautier believed all colours emerge from the interplay of light (white) and shadow (black). The three columns show how each hue appears across the full range from dark to light.';
    draw();
  }
});
