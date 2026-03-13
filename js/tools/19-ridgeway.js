/* ═══════════════════════════════════════════════════════════════
   Tool 19: Ridgeway's Color Standards & Nomenclature (1912)
   Systematic color naming — named swatches organized by hue
   family, each with a poetic/descriptive name.
   Interactive: Browse by hue family, click to select, search.
   ═══════════════════════════════════════════════════════════════ */

ColorTools.register('ridgeway-1912', {
  name: 'Color Standards & Nomenclature',
  shortName: 'Color Standards',
  author: 'Robert Ridgeway',
  year: 1912,
  description: 'Ridgeway catalogued over 1,000 named colours for scientific use. Browse by hue family, click any swatch to see its full name and specifications. Search for colours by name.',

  render(viz, controls, info) {
    controls.style.display = 'flex';
    info.style.display = 'block';

    // Sample of Ridgeway-style named colors organized by hue
    const families = {
      'Reds': [
        { name: 'Scarlet-Red', hex: '#cc2020' }, { name: 'Nopal Red', hex: '#b82830' },
        { name: 'Carmine', hex: '#a02040' }, { name: 'Rose Red', hex: '#c84860' },
        { name: 'Geranium Pink', hex: '#d87080' }, { name: 'Shell Pink', hex: '#e8a8a8' },
        { name: 'Brick Red', hex: '#a03830' }, { name: 'Indian Red', hex: '#883028' },
        { name: 'Dragon\'s Blood', hex: '#782020' }, { name: 'Pompeian Red', hex: '#a03028' },
        { name: 'Ox Blood', hex: '#682028' }, { name: 'Claret Brown', hex: '#581828' }
      ],
      'Oranges': [
        { name: 'Cadmium Orange', hex: '#e06820' }, { name: 'Mars Orange', hex: '#c86028' },
        { name: 'Orange-Rufous', hex: '#b05020' }, { name: 'Tawny', hex: '#a05830' },
        { name: 'Cinnamon', hex: '#a07040' }, { name: 'Buff', hex: '#d0a868' },
        { name: 'Apricot Orange', hex: '#d89050' }, { name: 'Flesh Ochre', hex: '#c8a870' },
        { name: 'Burnt Sienna', hex: '#985030' }, { name: 'Raw Sienna', hex: '#b08038' },
        { name: 'Peach Red', hex: '#d07850' }, { name: 'Salmon', hex: '#d89878' }
      ],
      'Yellows': [
        { name: 'Lemon Yellow', hex: '#e8d838' }, { name: 'Cadmium Yellow', hex: '#d8b828' },
        { name: 'Naples Yellow', hex: '#d8c070' }, { name: 'Straw Yellow', hex: '#d0c880' },
        { name: 'Cream', hex: '#e8d8b0' }, { name: 'Ivory', hex: '#f0e8c8' },
        { name: 'Old Gold', hex: '#b89830' }, { name: 'Amber Yellow', hex: '#c8a028' },
        { name: 'Mustard Yellow', hex: '#b09020' }, { name: 'Olive-Yellow', hex: '#908020' },
        { name: 'Citron Yellow', hex: '#c0c040' }, { name: 'Sulphur Yellow', hex: '#d8d060' }
      ],
      'Greens': [
        { name: 'Emerald Green', hex: '#28a048' }, { name: 'Malachite Green', hex: '#208838' },
        { name: 'Viridian', hex: '#288850' }, { name: 'Terre Verte', hex: '#507840' },
        { name: 'Olive Green', hex: '#506828' }, { name: 'Sea Green', hex: '#38a078' },
        { name: 'Nile Blue', hex: '#60a890' }, { name: 'Lincoln Green', hex: '#386828' },
        { name: 'Sage Green', hex: '#809878' }, { name: 'Celadon', hex: '#88b0a0' },
        { name: 'Verdigris', hex: '#48a888' }, { name: 'Paris Green', hex: '#30a040' }
      ],
      'Blues': [
        { name: 'Ultramarine', hex: '#2840a0' }, { name: 'Cobalt Blue', hex: '#2858b0' },
        { name: 'Prussian Blue', hex: '#183060' }, { name: 'Cerulean Blue', hex: '#3888c0' },
        { name: 'Sky Blue', hex: '#70a8d0' }, { name: 'Nile Blue', hex: '#68b0c0' },
        { name: 'Turquoise', hex: '#38a0a8' }, { name: 'Dusky Blue', hex: '#506888' },
        { name: 'Steel Blue', hex: '#4878a0' }, { name: 'Slate Blue', hex: '#607088' },
        { name: 'Cadet Blue', hex: '#5a8898' }, { name: 'Baby Blue', hex: '#a0c8e0' }
      ],
      'Violets': [
        { name: 'Blue-Violet', hex: '#5030a0' }, { name: 'Pansy Purple', hex: '#6028a0' },
        { name: 'Mauve', hex: '#9068b0' }, { name: 'Heliotrope', hex: '#a878c8' },
        { name: 'Lavender', hex: '#b098c8' }, { name: 'Lilac', hex: '#c0a8d0' },
        { name: 'Plum', hex: '#682870' }, { name: 'Magenta', hex: '#a02080' },
        { name: 'Dahlia Purple', hex: '#782088' }, { name: 'Orchid', hex: '#b070b0' },
        { name: 'Wistaria', hex: '#8878b0' }, { name: 'Amethyst', hex: '#7860a8' }
      ],
      'Neutrals': [
        { name: 'White', hex: '#f8f8f8' }, { name: 'Ivory White', hex: '#f0e8d8' },
        { name: 'Pearl Gray', hex: '#c8c0b8' }, { name: 'Smoke Gray', hex: '#a8a098' },
        { name: 'Drab Gray', hex: '#888078' }, { name: 'Mouse Gray', hex: '#706860' },
        { name: 'Deep Slate', hex: '#484040' }, { name: 'Charcoal', hex: '#303030' },
        { name: 'Bone Brown', hex: '#a09070' }, { name: 'Sepia', hex: '#604830' },
        { name: 'Vandyke Brown', hex: '#483018' }, { name: 'Jet Black', hex: '#181818' }
      ]
    };

    let currentFamily = 'Reds';
    let selectedColor = null;

    const draw = () => {
      viz.innerHTML = '';

      // Family swatches
      const container = document.createElement('div');
      container.style.maxWidth = '800px';
      container.style.margin = '0 auto';

      const colors = families[currentFamily];

      const grid = document.createElement('div');
      grid.className = 'color-grid';
      grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
      grid.style.maxWidth = '600px';
      grid.style.margin = '0 auto';

      colors.forEach(c => {
        const cell = document.createElement('div');
        cell.className = 'color-cell';
        cell.style.background = c.hex;
        cell.style.color = CU.textColor(c.hex);
        cell.style.minHeight = '70px';
        cell.style.cursor = 'pointer';
        cell.style.border = selectedColor && selectedColor.hex === c.hex ? '3px solid #2a1f14' : 'none';
        cell.innerHTML = `<span class="cell-name" style="font-size:0.7rem">${c.name}</span><span class="cell-hex">${c.hex}</span>`;

        cell.onclick = () => {
          selectedColor = c;
          draw();
          info.innerHTML = `<strong>${c.name}</strong> — ${c.hex} — from the ${currentFamily} family. `
            + `HSL: ${(() => { const rgb = CU.hexToRgb(c.hex); const hsl = CU.rgbToHsl(rgb.r, rgb.g, rgb.b); return `${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%`; })()}`;
        };
        cell.ondblclick = () => {
          navigator.clipboard.writeText(c.hex);
          info.textContent = `Copied ${c.hex} (${c.name}) to clipboard`;
        };
        grid.appendChild(cell);
      });

      container.appendChild(grid);

      // Selected color detail
      if (selectedColor) {
        const detail = document.createElement('div');
        detail.style.textAlign = 'center';
        detail.style.marginTop = '1rem';
        detail.style.padding = '0.8rem';
        detail.style.background = 'var(--control-bg)';
        detail.style.border = '1px solid var(--control-border)';
        detail.style.borderRadius = '4px';

        // Show related colors (lighter and darker variants)
        const rgb = CU.hexToRgb(selectedColor.hex);
        const hsl = CU.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const variants = [];
        for (let l = 90; l >= 10; l -= 10) {
          variants.push(CU.hslToHex(hsl.h, hsl.s, l));
        }

        detail.innerHTML = `
          <div style="font-size:0.9rem;margin-bottom:0.5rem"><strong>${selectedColor.name}</strong> — ${selectedColor.hex}</div>
          <div style="display:flex;gap:2px;justify-content:center">
            ${variants.map(v => `<div style="width:35px;height:35px;background:${v};border:1px solid rgba(42,31,20,0.2);border-radius:2px" title="${v}"></div>`).join('')}
          </div>
          <div style="font-size:0.7rem;color:#8a7560;margin-top:0.3rem">Lightness variants of the same hue and saturation</div>
        `;
        container.appendChild(detail);
      }

      viz.appendChild(container);
    };

    controls.innerHTML = `
      <div class="control-group"><label>Family:</label>
        <select id="ridge-family">
          ${Object.keys(families).map(f => `<option value="${f}" ${f === currentFamily ? 'selected' : ''}>${f}</option>`).join('')}
        </select>
      </div>
      <div class="control-group"><label>Search:</label><input type="text" id="ridge-search" placeholder="e.g. Scarlet"></div>
      <div class="control-group"><button class="btn" id="ridge-go">Find</button></div>
    `;

    document.getElementById('ridge-family').onchange = (e) => {
      currentFamily = e.target.value;
      selectedColor = null;
      draw();
    };

    document.getElementById('ridge-go').onclick = () => {
      const query = document.getElementById('ridge-search').value.toLowerCase();
      if (!query) return;
      for (const [family, colors] of Object.entries(families)) {
        const found = colors.find(c => c.name.toLowerCase().includes(query));
        if (found) {
          currentFamily = family;
          document.getElementById('ridge-family').value = family;
          selectedColor = found;
          draw();
          info.textContent = `Found: ${found.name} (${found.hex}) in ${family}`;
          return;
        }
      }
      info.textContent = `No colour matching "${query}" found.`;
    };

    info.textContent = 'Browse hue families and click any swatch to see its full name, hex code, and lightness variants. Double-click to copy the hex code.';
    draw();
  }
});
