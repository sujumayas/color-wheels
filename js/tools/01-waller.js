/* ═══════════════════════════════════════════════════════════════
   Tool 01: Waller's Tabula Colorum Physiologica (1686)
   A grid of named colors showing simple and mixed colours.
   Interactive: Click any cell to change its color. Auto-generates
   mixed colors between adjacent cells.
   ═══════════════════════════════════════════════════════════════ */

ColorTools.register('waller-1686', {
  name: 'Tabula Colorum Physiologica',
  shortName: 'Tabula Colorum',
  author: 'Richard Waller',
  year: 1686,
  description: 'A systematic catalogue of simple and mixed colours. Click any primary colour (left column) to change it — mixed colours between rows update automatically. Double-click any cell to copy its hex code.',

  render(viz, controls, info) {
    controls.style.display = 'flex';
    info.style.display = 'block';

    // Waller's original had a grid of named colors: simple colors + their mixtures
    const simpleColors = [
      { name: 'Snow White', hex: '#f0ead6' },
      { name: 'Lead White', hex: '#e8e0d0' },
      { name: 'King\'s Yellow', hex: '#d4a842' },
      { name: 'Orpiment', hex: '#e8a830' },
      { name: 'Vermilion', hex: '#c83228' },
      { name: 'Red Lead', hex: '#d44020' },
      { name: 'Carmine', hex: '#96284a' },
      { name: 'Burnt Umber', hex: '#6e4234' },
      { name: 'Indigo', hex: '#2e4268' },
      { name: 'Smalt', hex: '#4a6ea0' },
      { name: 'Verdigris', hex: '#4a8c6a' },
      { name: 'Terre Verte', hex: '#5c7a4a' },
      { name: 'Lamp Black', hex: '#28241e' }
    ];

    let colors = simpleColors.map(c => ({ ...c }));

    const buildGrid = () => {
      viz.innerHTML = '';
      const cols = colors.length;

      // Create a table: each row is a primary color, columns show mixes with all others
      const wrapper = document.createElement('div');
      wrapper.style.overflowX = 'auto';
      wrapper.style.width = '100%';

      const grid = document.createElement('div');
      grid.className = 'color-grid';
      grid.style.gridTemplateColumns = `repeat(${cols}, 80px)`;

      // Header row: color names
      colors.forEach((c, j) => {
        const cell = document.createElement('div');
        cell.className = 'color-cell';
        cell.style.background = c.hex;
        cell.style.color = CU.textColor(c.hex);
        cell.style.minHeight = '60px';
        cell.innerHTML = `<span class="cell-name">${c.name}</span><span class="cell-hex">${c.hex}</span>`;
        cell.onclick = () => {
          const input = document.createElement('input');
          input.type = 'color';
          input.value = c.hex;
          input.onchange = () => {
            colors[j].hex = input.value;
            buildGrid();
          };
          input.click();
        };
        cell.ondblclick = (e) => {
          e.preventDefault();
          navigator.clipboard.writeText(c.hex);
          info.textContent = `Copied ${c.hex} (${c.name}) to clipboard`;
        };
        grid.appendChild(cell);
      });

      // Mix rows: show pairwise mixes
      for (let i = 0; i < Math.min(colors.length, 8); i++) {
        colors.forEach((c, j) => {
          const mixed = CU.mixSubtractive([colors[i].hex, c.hex]);
          const cell = document.createElement('div');
          cell.className = 'color-cell';
          cell.style.background = mixed;
          cell.style.color = CU.textColor(mixed);
          const n1 = colors[i].name.split(' ').pop();
          const n2 = c.name.split(' ').pop();
          cell.innerHTML = `<span class="cell-name">${i === j ? '—' : n1 + ' + ' + n2}</span><span class="cell-hex">${mixed}</span>`;
          cell.ondblclick = (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(mixed);
            info.textContent = `Copied ${mixed} to clipboard`;
          };
          grid.appendChild(cell);
        });
      }

      wrapper.appendChild(grid);
      viz.appendChild(wrapper);
    };

    // Controls
    controls.innerHTML = `
      <div class="control-group">
        <button class="btn" id="waller-reset">Reset to Defaults</button>
      </div>
      <div class="control-group">
        <button class="btn" id="waller-random">Random Palette</button>
      </div>
      <div class="control-group">
        <label>Grid rows:</label>
        <select id="waller-rows">
          <option value="4">4</option>
          <option value="6">6</option>
          <option value="8" selected>8</option>
        </select>
      </div>
    `;

    document.getElementById('waller-reset').onclick = () => {
      colors = simpleColors.map(c => ({ ...c }));
      buildGrid();
    };

    document.getElementById('waller-random').onclick = () => {
      const names = ['Cerulean', 'Ochre', 'Umber', 'Sienna', 'Crimson', 'Viridian', 'Azure', 'Scarlet', 'Prussian', 'Cadmium', 'Cobalt', 'Naples', 'Flake'];
      colors = colors.map((c, i) => ({
        name: names[i] || c.name,
        hex: CU.random()
      }));
      buildGrid();
    };

    info.textContent = 'Click a colour in the top row to change it. Mixed colours update automatically. Double-click any cell to copy its hex code.';

    buildGrid();
  }
});
