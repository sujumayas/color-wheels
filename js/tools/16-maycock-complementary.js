/* ═══════════════════════════════════════════════════════════════
   Tool 16: Maycock's Complementary Contrasts (1895)
   Circular chart of complementary colour pairs. Each pair
   sits opposite on the wheel, creating maximum contrast.
   Interactive: Pick any colour, instantly see its complement.
   ═══════════════════════════════════════════════════════════════ */

ColorTools.register('maycock-comp-1895', {
  name: 'Complementary Contrasts',
  shortName: 'Compl. Contrasts',
  author: 'Mark Maycock',
  year: 1895,
  description: 'Maycock\'s circular chart highlights complementary pairs — colours opposite each other on the wheel that create maximum visual contrast. Click any segment to highlight its pair, or pick a custom colour.',

  render(viz, controls, info) {
    controls.style.display = 'flex';
    info.style.display = 'block';

    let segments = 12;
    let selectedIdx = -1;
    let customColor = null;
    let saturation = 75;
    let lightness = 48;

    const canvas = Draw.createCanvas(viz, 580, 560);
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      const cx = w / 2, cy = h / 2 - 10;
      Draw.parchmentBg(ctx, w, h);

      Draw.centeredText(ctx, 'COMPLEMENTARY CONTRASTS', cx, 22, 14, '#2a1f14', "small-caps 14px 'IM Fell DW Pica SC', Georgia, serif");

      const outerR = 220;
      const innerR = 120;

      for (let i = 0; i < segments; i++) {
        const hue = (i / segments) * 360;
        const a1 = (i / segments) * Math.PI * 2 - Math.PI / 2;
        const a2 = ((i + 1) / segments) * Math.PI * 2 - Math.PI / 2;
        const color = CU.hslToHex(hue, saturation, lightness);
        const isSelected = selectedIdx === i;
        const isComplement = selectedIdx >= 0 && i === (selectedIdx + segments / 2) % segments;

        const r = (isSelected || isComplement) ? outerR + 10 : outerR;
        Draw.wedge(ctx, cx, cy, innerR, r, a1, a2, color);

        if (isSelected || isComplement) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, a1, a2);
          ctx.arc(cx, cy, innerR, a2, a1, true);
          ctx.closePath();
          ctx.strokeStyle = isSelected ? '#2a1f14' : '#f0e2c4';
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      }

      // Complementary connection line
      if (selectedIdx >= 0) {
        const a1 = ((selectedIdx + 0.5) / segments) * Math.PI * 2 - Math.PI / 2;
        const compIdx = (selectedIdx + segments / 2) % segments;
        const a2 = ((compIdx + 0.5) / segments) * Math.PI * 2 - Math.PI / 2;
        const midR = (innerR + outerR) / 2;

        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a1) * midR, cy + Math.sin(a1) * midR);
        ctx.lineTo(cx + Math.cos(a2) * midR, cy + Math.sin(a2) * midR);
        ctx.strokeStyle = '#2a1f14';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Center display
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.fillStyle = '#f7f0e0';
      ctx.fill();
      ctx.strokeStyle = 'rgba(42,31,20,0.3)';
      ctx.stroke();

      if (selectedIdx >= 0) {
        const hue1 = (selectedIdx / segments) * 360;
        const hue2 = ((selectedIdx + segments / 2) % segments / segments) * 360;
        const c1 = CU.hslToHex(hue1, saturation, lightness);
        const c2 = CU.hslToHex(hue2, saturation, lightness);

        // Show pair
        ctx.fillStyle = c1;
        ctx.fillRect(cx - 50, cy - 30, 40, 40);
        ctx.strokeStyle = '#2a1f14';
        ctx.strokeRect(cx - 50, cy - 30, 40, 40);

        ctx.fillStyle = c2;
        ctx.fillRect(cx + 10, cy - 30, 40, 40);
        ctx.strokeRect(cx + 10, cy - 30, 40, 40);

        Draw.centeredText(ctx, '⟷', cx, cy - 10, 16, '#8a7560');
        Draw.centeredText(ctx, c1, cx - 30, cy + 22, 9, '#2a1f14');
        Draw.centeredText(ctx, c2, cx + 30, cy + 22, 9, '#2a1f14');

        // Contrast swatch: half and half
        ctx.fillStyle = c1;
        ctx.fillRect(cx - 40, cy + 38, 40, 30);
        ctx.fillStyle = c2;
        ctx.fillRect(cx, cy + 38, 40, 30);
        ctx.strokeStyle = '#2a1f14';
        ctx.strokeRect(cx - 40, cy + 38, 80, 30);
        Draw.centeredText(ctx, 'Maximum Contrast', cx, cy + 80, 9, '#8a7560');
      } else if (customColor) {
        const comp = CU.complement(customColor);
        ctx.fillStyle = customColor;
        ctx.fillRect(cx - 50, cy - 25, 40, 40);
        ctx.strokeStyle = '#2a1f14';
        ctx.strokeRect(cx - 50, cy - 25, 40, 40);

        ctx.fillStyle = comp;
        ctx.fillRect(cx + 10, cy - 25, 40, 40);
        ctx.strokeRect(cx + 10, cy - 25, 40, 40);

        Draw.centeredText(ctx, '⟷', cx, cy - 5, 16, '#8a7560');
        Draw.centeredText(ctx, customColor, cx - 30, cy + 26, 9, '#2a1f14');
        Draw.centeredText(ctx, comp, cx + 30, cy + 26, 9, '#2a1f14');
      } else {
        Draw.centeredText(ctx, 'Click a', cx, cy - 10, 11, '#8a7560');
        Draw.centeredText(ctx, 'segment', cx, cy + 6, 11, '#8a7560');
      }
    };

    canvas.onclick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX - canvas.width / 2;
      const y = (e.clientY - rect.top) * scaleY - (canvas.height / 2 - 10);
      const dist = Math.sqrt(x * x + y * y);

      if (dist > 120 && dist < 230) {
        let angle = Math.atan2(y, x) + Math.PI / 2;
        if (angle < 0) angle += Math.PI * 2;
        selectedIdx = Math.floor((angle / (Math.PI * 2)) * segments) % segments;
        customColor = null;
        draw();
      }
    };

    controls.innerHTML = `
      <div class="control-group"><label>Custom colour:</label><input type="color" id="mcomp-custom" value="#cc3030"></div>
      <div class="control-group"><button class="btn" id="mcomp-find">Find Complement</button></div>
      <div class="control-group"><label>Segments:</label>
        <select id="mcomp-seg"><option value="6">6</option><option value="12" selected>12</option><option value="24">24</option></select>
      </div>
      <div class="control-group"><label>Saturation:</label><input type="range" id="mcomp-sat" min="20" max="100" value="${saturation}" style="width:80px"></div>
      <div class="control-group"><button class="btn" id="mcomp-reset">Reset</button></div>
    `;

    document.getElementById('mcomp-find').onclick = () => {
      customColor = document.getElementById('mcomp-custom').value;
      selectedIdx = -1;
      draw();
    };

    const update = () => {
      segments = parseInt(document.getElementById('mcomp-seg').value);
      saturation = parseInt(document.getElementById('mcomp-sat').value);
      selectedIdx = -1;
      customColor = null;
      draw();
    };

    ['mcomp-seg', 'mcomp-sat'].forEach(id => {
      document.getElementById(id).oninput = update;
    });

    document.getElementById('mcomp-reset').onclick = () => {
      segments = 12; saturation = 75; lightness = 48; selectedIdx = -1; customColor = null;
      document.getElementById('mcomp-seg').value = '12';
      document.getElementById('mcomp-sat').value = 75;
      draw();
    };

    info.textContent = 'Complementary colours sit directly opposite each other on the wheel. When placed side by side, they create maximum visual vibration and contrast.';
    draw();
  }
});
