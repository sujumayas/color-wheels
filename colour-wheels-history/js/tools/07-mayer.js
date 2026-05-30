/* ═══════════════════════════════════════════════════════════════
   Tool 07: Tobias Mayer / Lichtenberg's Colour Triangle
   Three primaries at vertices, all interpolations in a triangular
   grid showing how colours blend between them.
   Interactive: Change the 3 corner colours.
   ═══════════════════════════════════════════════════════════════ */

ColorTools.register('mayer-1775', {
  name: 'Triangulum Colorum',
  shortName: 'Color Triangle',
  author: 'Tobias Mayer / G.C. Lichtenberg',
  year: 1775,
  description: 'Mayer\'s triangular colour chart places three primaries at the vertices and shows every possible mixture between them. Change any corner colour to see the entire triangle of interpolations update.',

  render(viz, controls, info) {
    controls.style.display = 'flex';
    info.style.display = 'block';

    let corners = ['#cc2020', '#d4c820', '#2040a0']; // RYB
    let gridSize = 9;

    const canvas = Draw.createCanvas(viz, 600, 560);
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      Draw.parchmentBg(ctx, w, h);

      Draw.centeredText(ctx, 'TRIANGULUM COLORUM', w / 2, 22, 15, '#2a1f14', "small-caps 15px 'IM Fell DW Pica SC', Georgia, serif");

      // Triangle vertices
      const margin = 60;
      const triTop = { x: w / 2, y: margin + 20 };
      const triLeft = { x: margin + 20, y: h - margin - 10 };
      const triRight = { x: w - margin - 20, y: h - margin - 10 };

      // Draw grid of hexagons within the triangle
      const n = gridSize;
      const cellR = Math.min(
        (triRight.x - triLeft.x) / (n * 2),
        (triLeft.y - triTop.y) / (n * 1.8)
      ) * 0.9;

      for (let row = 0; row <= n; row++) {
        for (let col = 0; col <= n - row; col++) {
          const third = n - row - col;
          // Barycentric coordinates
          const u = row / n; // amount of corner 0 (top)
          const v = col / n; // amount of corner 1 (left)
          const wt = third / n; // amount of corner 2 (right)

          // Position
          const x = triTop.x * u + triLeft.x * v + triRight.x * wt;
          const y = triTop.y * u + triLeft.y * v + triRight.y * wt;

          // Color interpolation
          const c0 = CU.hexToRgb(corners[0]);
          const c1 = CU.hexToRgb(corners[1]);
          const c2 = CU.hexToRgb(corners[2]);

          const r = c0.r * u + c1.r * v + c2.r * wt;
          const g = c0.g * u + c1.g * v + c2.g * wt;
          const b = c0.b * u + c1.b * v + c2.b * wt;
          const color = CU.rgbToHex(r, g, b);

          // Draw hexagonal cell
          ctx.beginPath();
          for (let a = 0; a < 6; a++) {
            const angle = (a * 60 - 30) * Math.PI / 180;
            const hx = x + cellR * Math.cos(angle);
            const hy = y + cellR * Math.sin(angle);
            if (a === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
          ctx.strokeStyle = 'rgba(42,31,20,0.15)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Corner labels
      const labels = ['I', 'II', 'III'];
      const points = [triTop, triLeft, triRight];
      const offsets = [{ x: 0, y: -18 }, { x: -18, y: 15 }, { x: 18, y: 15 }];

      points.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x + offsets[i].x, p.y + offsets[i].y, 12, 0, Math.PI * 2);
        ctx.fillStyle = corners[i];
        ctx.fill();
        ctx.strokeStyle = '#2a1f14';
        ctx.lineWidth = 1;
        ctx.stroke();

        Draw.centeredText(ctx, labels[i], p.x + offsets[i].x, p.y + offsets[i].y + 22, 10, '#2a1f14');
      });

      // Triangle outline
      ctx.beginPath();
      ctx.moveTo(triTop.x, triTop.y - 10);
      ctx.lineTo(triLeft.x - 10, triLeft.y + 5);
      ctx.lineTo(triRight.x + 10, triRight.y + 5);
      ctx.closePath();
      ctx.strokeStyle = 'rgba(42,31,20,0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    controls.innerHTML = `
      <div class="control-group"><label>Vertex I:</label><input type="color" id="mayer-c0" value="${corners[0]}"></div>
      <div class="control-group"><label>Vertex II:</label><input type="color" id="mayer-c1" value="${corners[1]}"></div>
      <div class="control-group"><label>Vertex III:</label><input type="color" id="mayer-c2" value="${corners[2]}"></div>
      <div class="control-group"><label>Resolution:</label>
        <select id="mayer-res">
          <option value="5">5</option>
          <option value="7">7</option>
          <option value="9" selected>9</option>
          <option value="12">12</option>
          <option value="16">16</option>
        </select>
      </div>
      <div class="control-group"><button class="btn" id="mayer-reset">Reset</button></div>
      <div class="control-group"><button class="btn" id="mayer-cmy">CMY</button></div>
    `;

    const update = () => {
      corners = [
        document.getElementById('mayer-c0').value,
        document.getElementById('mayer-c1').value,
        document.getElementById('mayer-c2').value
      ];
      gridSize = parseInt(document.getElementById('mayer-res').value);
      draw();
    };

    ['mayer-c0', 'mayer-c1', 'mayer-c2', 'mayer-res'].forEach(id => {
      document.getElementById(id).oninput = update;
    });

    document.getElementById('mayer-reset').onclick = () => {
      corners = ['#cc2020', '#d4c820', '#2040a0'];
      gridSize = 9;
      document.getElementById('mayer-c0').value = corners[0];
      document.getElementById('mayer-c1').value = corners[1];
      document.getElementById('mayer-c2').value = corners[2];
      document.getElementById('mayer-res').value = '9';
      draw();
    };

    document.getElementById('mayer-cmy').onclick = () => {
      corners = ['#00cccc', '#cc00cc', '#cccc00'];
      document.getElementById('mayer-c0').value = corners[0];
      document.getElementById('mayer-c1').value = corners[1];
      document.getElementById('mayer-c2').value = corners[2];
      draw();
    };

    info.textContent = 'Each cell\'s colour is the weighted blend of the three vertex colours based on its position. The triangle shows every possible mixture ratio of the three chosen colours.';
    draw();
  }
});
