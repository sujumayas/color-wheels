/* ═══════════════════════════════════════════════════════════════
   Tool 13: Bezold's Farbentafel (1874)
   A systematic colour table showing variations of hue across
   rows and saturation/brightness down columns.
   Interactive: Change base hues, adjust the variation axes.
   ═══════════════════════════════════════════════════════════════ */

ColorTools.register('bezold-1874', {
  name: 'Farbentafel',
  shortName: 'Farbentafel',
  author: 'Wilhelm von Bezold',
  year: 1874,
  description: 'Bezold\'s colour table systematically maps hue across columns and lightness down rows, creating a complete reference chart. Adjust the hue range and number of steps to generate your own table.',

  render(viz, controls, info) {
    controls.style.display = 'flex';
    info.style.display = 'block';

    let hueStart = 0;
    let hueSteps = 12;
    let lightnessSteps = 8;
    let saturation = 80;

    const draw = () => {
      viz.innerHTML = '';

      const grid = document.createElement('div');
      grid.className = 'color-grid';
      grid.style.gridTemplateColumns = `60px repeat(${hueSteps}, 1fr)`;
      grid.style.maxWidth = '100%';
      grid.style.width = `${Math.min(900, 60 + hueSteps * 65)}px`;

      // Header row
      const corner = document.createElement('div');
      corner.className = 'color-cell';
      corner.style.background = '#f0e2c4';
      corner.style.minWidth = '55px';
      corner.innerHTML = '<span class="cell-name" style="font-style:italic;color:#8a7560">H → L ↓</span>';
      grid.appendChild(corner);

      for (let col = 0; col < hueSteps; col++) {
        const hue = (hueStart + (col / hueSteps) * 360) % 360;
        const color = CU.hslToHex(hue, saturation, 50);
        const header = document.createElement('div');
        header.className = 'color-cell';
        header.style.background = color;
        header.style.color = CU.textColor(color);
        header.style.minHeight = '40px';
        header.innerHTML = `<span class="cell-name">${Math.round(hue)}°</span>`;
        grid.appendChild(header);
      }

      // Data rows
      for (let row = 0; row < lightnessSteps; row++) {
        const lightness = 90 - (row / (lightnessSteps - 1)) * 80; // 90% down to 10%

        // Row label
        const label = document.createElement('div');
        label.className = 'color-cell';
        label.style.background = '#f0e2c4';
        label.style.minWidth = '55px';
        label.innerHTML = `<span class="cell-name" style="color:#8a7560">L:${Math.round(lightness)}%</span>`;
        grid.appendChild(label);

        for (let col = 0; col < hueSteps; col++) {
          const hue = (hueStart + (col / hueSteps) * 360) % 360;
          const color = CU.hslToHex(hue, saturation, lightness);

          const cell = document.createElement('div');
          cell.className = 'color-cell';
          cell.style.background = color;
          cell.style.color = CU.textColor(color);
          cell.style.minHeight = '50px';
          cell.innerHTML = `<span class="cell-hex">${color}</span>`;
          cell.title = `H:${Math.round(hue)}° S:${saturation}% L:${Math.round(lightness)}%`;
          cell.ondblclick = () => {
            navigator.clipboard.writeText(color);
            info.textContent = `Copied ${color} (H:${Math.round(hue)}° S:${saturation}% L:${Math.round(lightness)}%)`;
          };
          grid.appendChild(cell);
        }
      }

      viz.appendChild(grid);
    };

    controls.innerHTML = `
      <div class="control-group"><label>Start hue:</label><input type="range" id="bezold-hue" min="0" max="359" value="${hueStart}" style="width:120px"><span id="bezold-hueval">${hueStart}°</span></div>
      <div class="control-group"><label>Hue steps:</label>
        <select id="bezold-hsteps">
          <option value="6">6</option>
          <option value="8">8</option>
          <option value="10">10</option>
          <option value="12" selected>12</option>
          <option value="18">18</option>
          <option value="24">24</option>
        </select>
      </div>
      <div class="control-group"><label>Light steps:</label>
        <select id="bezold-lsteps">
          <option value="5">5</option>
          <option value="8" selected>8</option>
          <option value="10">10</option>
          <option value="12">12</option>
        </select>
      </div>
      <div class="control-group"><label>Saturation:</label><input type="range" id="bezold-sat" min="10" max="100" value="${saturation}" style="width:100px"><span id="bezold-satval">${saturation}%</span></div>
      <div class="control-group"><button class="btn" id="bezold-reset">Reset</button></div>
    `;

    const update = () => {
      hueStart = parseInt(document.getElementById('bezold-hue').value);
      hueSteps = parseInt(document.getElementById('bezold-hsteps').value);
      lightnessSteps = parseInt(document.getElementById('bezold-lsteps').value);
      saturation = parseInt(document.getElementById('bezold-sat').value);
      document.getElementById('bezold-hueval').textContent = hueStart + '°';
      document.getElementById('bezold-satval').textContent = saturation + '%';
      draw();
    };

    ['bezold-hue', 'bezold-hsteps', 'bezold-lsteps', 'bezold-sat'].forEach(id => {
      document.getElementById(id).oninput = update;
    });

    document.getElementById('bezold-reset').onclick = () => {
      hueStart = 0; hueSteps = 12; lightnessSteps = 8; saturation = 80;
      document.getElementById('bezold-hue').value = 0;
      document.getElementById('bezold-hsteps').value = '12';
      document.getElementById('bezold-lsteps').value = '8';
      document.getElementById('bezold-sat').value = 80;
      draw();
    };

    info.textContent = 'Double-click any cell to copy its hex code. Columns vary by hue, rows by lightness — giving a complete systematic overview of colour space at the chosen saturation.';
    draw();
  }
});
