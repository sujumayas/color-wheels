/* ═══════════════════════════════════════════════════════════════
   Tool 12: Runge's Farbenkugel (1810)
   A colour sphere — equator shows full hues, poles are white
   (top) and black (bottom). Cross-sections reveal layers.
   Interactive: Rotate latitude/longitude, see cross-sections.
   ═══════════════════════════════════════════════════════════════ */

ColorTools.register('runge-1810', {
  name: 'Farbenkugel',
  shortName: 'Farbenkugel',
  author: 'Philipp Otto Runge',
  year: 1810,
  description: 'Runge conceived colour as a sphere — pure hues at the equator, white at the north pole, black at the south pole. Adjust latitude to see horizontal cross-sections, or rotate the view.',

  render(viz, controls, info) {
    controls.style.display = 'flex';
    info.style.display = 'block';

    let latitude = 0; // -90 to 90, 0 = equator
    let rotation = 0; // 0-360 hue rotation
    let viewMode = 'surface'; // surface, horizontal, vertical

    const canvas = Draw.createCanvas(viz, 560, 520);
    const ctx = canvas.getContext('2d');

    const getColorAtPoint = (hue, lat) => {
      // lat: -90 (black) to 0 (full color) to +90 (white)
      const h = (hue + rotation) % 360;
      const s = Math.cos(lat * Math.PI / 180) * 100; // saturation drops at poles
      let l;
      if (lat >= 0) {
        l = 50 + (lat / 90) * 50; // 50% to 100% (equator to white)
      } else {
        l = 50 + (lat / 90) * 50; // 50% to 0% (equator to black)
      }
      return CU.hslToHex(h, Math.max(0, s), Math.max(0, Math.min(100, l)));
    };

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      const cx = w / 2, cy = h / 2;
      Draw.parchmentBg(ctx, w, h);

      Draw.centeredText(ctx, 'FARBENKUGEL', cx, 20, 16, '#2a1f14', "small-caps 16px 'IM Fell DW Pica SC', Georgia, serif");
      Draw.centeredText(ctx, 'The Colour Sphere', cx, 36, 10, '#8a7560', "italic 10px 'Crimson Text', Georgia, serif");

      const sphereR = 200;

      if (viewMode === 'surface') {
        // Draw the sphere surface as a pixel grid
        const step = 4;
        for (let px = -sphereR; px < sphereR; px += step) {
          for (let py = -sphereR; py < sphereR; py += step) {
            const dist = Math.sqrt(px * px + py * py);
            if (dist > sphereR) continue;

            // Map pixel to sphere coordinates
            const lat = (py / sphereR) * -90; // top = +90 (white), bottom = -90 (black)
            const lon = Math.atan2(px, Math.sqrt(sphereR * sphereR - px * px - py * py)) * 180 / Math.PI;
            const hue = (lon + 180) % 360;

            const color = getColorAtPoint(hue, lat);
            ctx.fillStyle = color;
            ctx.fillRect(cx + px, cy + py, step, step);
          }
        }

        // Sphere outline
        ctx.beginPath();
        ctx.arc(cx, cy, sphereR, 0, Math.PI * 2);
        ctx.strokeStyle = '#2a1f14';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Equator line
        ctx.beginPath();
        ctx.ellipse(cx, cy, sphereR, 15, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(42,31,20,0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Latitude indicator
        const latY = cy - (latitude / 90) * sphereR;
        const latRx = Math.sqrt(Math.max(0, sphereR * sphereR - (latY - cy) * (latY - cy)));
        if (latRx > 5) {
          ctx.beginPath();
          ctx.ellipse(cx, latY, latRx, Math.max(3, latRx * 0.08), 0, 0, Math.PI * 2);
          ctx.strokeStyle = '#8b4513';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Pole labels
        Draw.centeredText(ctx, 'White (N)', cx, cy - sphereR - 12, 10, '#8a7560');
        Draw.centeredText(ctx, 'Black (S)', cx, cy + sphereR + 16, 10, '#8a7560');

      } else if (viewMode === 'horizontal') {
        // Horizontal cross-section at selected latitude
        const sliceR = Math.cos(latitude * Math.PI / 180) * sphereR * 0.9;

        Draw.centeredText(ctx, `Horizontal Cross-Section at ${latitude}°`, cx, 55, 11, '#8a7560');

        if (sliceR > 5) {
          const step = 4;
          for (let px = -sliceR; px < sliceR; px += step) {
            for (let py = -sliceR; py < sliceR; py += step) {
              const dist = Math.sqrt(px * px + py * py);
              if (dist > sliceR) continue;

              const hue = (Math.atan2(py, px) * 180 / Math.PI + 360) % 360;
              const satScale = dist / sliceR;
              const color = getColorAtPoint(hue, latitude * (1 - satScale * 0.3));
              ctx.fillStyle = color;
              ctx.fillRect(cx + px, cy + py, step, step);
            }
          }

          ctx.beginPath();
          ctx.arc(cx, cy, sliceR, 0, Math.PI * 2);
          ctx.strokeStyle = '#2a1f14';
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          // Near pole — show just the pole color
          const poleColor = latitude > 0 ? '#ffffff' : '#000000';
          ctx.beginPath();
          ctx.arc(cx, cy, 20, 0, Math.PI * 2);
          ctx.fillStyle = poleColor;
          ctx.fill();
          ctx.strokeStyle = '#2a1f14';
          ctx.stroke();
        }

      } else if (viewMode === 'vertical') {
        // Vertical cross-section through the sphere
        Draw.centeredText(ctx, 'Vertical Cross-Section', cx, 55, 11, '#8a7560');

        const step = 4;
        for (let px = -sphereR; px < sphereR; px += step) {
          for (let py = -sphereR; py < sphereR; py += step) {
            const dist = Math.sqrt(px * px + py * py);
            if (dist > sphereR) continue;

            const lat = (-py / sphereR) * 90;
            const lonFraction = px / sphereR;
            const hue = rotation + lonFraction * 180;
            const color = getColorAtPoint(hue, lat);
            ctx.fillStyle = color;
            ctx.fillRect(cx + px, cy + py, step, step);
          }
        }

        ctx.beginPath();
        ctx.arc(cx, cy, sphereR, 0, Math.PI * 2);
        ctx.strokeStyle = '#2a1f14';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    controls.innerHTML = `
      <div class="control-group"><label>Latitude:</label><input type="range" id="runge-lat" min="-85" max="85" value="${latitude}" style="width:150px"><span id="runge-latval">${latitude}°</span></div>
      <div class="control-group"><label>Rotation:</label><input type="range" id="runge-rot" min="0" max="359" value="${rotation}" style="width:120px"></div>
      <div class="control-group"><label>View:</label>
        <select id="runge-view">
          <option value="surface">Surface</option>
          <option value="horizontal">Horizontal Slice</option>
          <option value="vertical">Vertical Slice</option>
        </select>
      </div>
      <div class="control-group"><button class="btn" id="runge-reset">Reset</button></div>
    `;

    const update = () => {
      latitude = parseInt(document.getElementById('runge-lat').value);
      rotation = parseInt(document.getElementById('runge-rot').value);
      viewMode = document.getElementById('runge-view').value;
      document.getElementById('runge-latval').textContent = latitude + '°';
      draw();
    };

    ['runge-lat', 'runge-rot', 'runge-view'].forEach(id => {
      document.getElementById(id).oninput = update;
    });

    document.getElementById('runge-reset').onclick = () => {
      latitude = 0; rotation = 0; viewMode = 'surface';
      document.getElementById('runge-lat').value = 0;
      document.getElementById('runge-rot').value = 0;
      document.getElementById('runge-view').value = 'surface';
      draw();
    };

    info.textContent = 'The equator holds fully saturated hues. Moving toward the north pole adds white; moving south adds black. Every possible colour exists somewhere on or within this sphere.';
    draw();
  }
});
