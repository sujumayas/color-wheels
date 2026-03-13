/* ═══════════════════════════════════════════════════════════════
   Tool 20: Artists' Materials Catalogue (1914)
   A pigment catalog with colour swatches, pigment names, and
   descriptions — simulating an art supply catalogue page.
   Interactive: Build custom palettes by selecting pigments.
   ═══════════════════════════════════════════════════════════════ */

ColorTools.register('catalogue-1914', {
  name: 'Artist\'s Palette Catalogue',
  shortName: 'Artist\'s Catalogue',
  author: 'Devoe & Raynolds Co.',
  year: 1914,
  description: 'A period artists\' materials catalogue listing pigments with their names, properties, and swatches. Click pigments to build a custom palette, then see how they mix together.',

  render(viz, controls, info) {
    controls.style.display = 'flex';
    info.style.display = 'block';

    const pigments = [
      { name: 'Flake White', hex: '#f0e8d8', group: 'Whites', opacity: 'Opaque', permanence: '★★★' },
      { name: 'Zinc White', hex: '#f8f4f0', group: 'Whites', opacity: 'Semi-transp.', permanence: '★★★★' },
      { name: 'Naples Yellow', hex: '#e0c870', group: 'Yellows', opacity: 'Opaque', permanence: '★★★' },
      { name: 'Cadmium Yellow Lt.', hex: '#e8d040', group: 'Yellows', opacity: 'Opaque', permanence: '★★★★' },
      { name: 'Cadmium Yellow Dk.', hex: '#d0a828', group: 'Yellows', opacity: 'Opaque', permanence: '★★★★' },
      { name: 'Yellow Ochre', hex: '#c0a040', group: 'Yellows', opacity: 'Opaque', permanence: '★★★★★' },
      { name: 'Raw Sienna', hex: '#b08038', group: 'Earth', opacity: 'Transp.', permanence: '★★★★★' },
      { name: 'Burnt Sienna', hex: '#985030', group: 'Earth', opacity: 'Transp.', permanence: '★★★★★' },
      { name: 'Raw Umber', hex: '#786040', group: 'Earth', opacity: 'Transp.', permanence: '★★★★★' },
      { name: 'Burnt Umber', hex: '#603828', group: 'Earth', opacity: 'Semi-transp.', permanence: '★★★★★' },
      { name: 'Cadmium Orange', hex: '#e06020', group: 'Oranges', opacity: 'Opaque', permanence: '★★★★' },
      { name: 'Vermilion', hex: '#c83028', group: 'Reds', opacity: 'Opaque', permanence: '★★' },
      { name: 'Cadmium Red Lt.', hex: '#d03030', group: 'Reds', opacity: 'Opaque', permanence: '★★★★' },
      { name: 'Cadmium Red Dk.', hex: '#a02028', group: 'Reds', opacity: 'Opaque', permanence: '★★★★' },
      { name: 'Alizarin Crimson', hex: '#881830', group: 'Reds', opacity: 'Transp.', permanence: '★★' },
      { name: 'Rose Madder', hex: '#b04060', group: 'Reds', opacity: 'Transp.', permanence: '★' },
      { name: 'Viridian', hex: '#288858', group: 'Greens', opacity: 'Transp.', permanence: '★★★★★' },
      { name: 'Terre Verte', hex: '#607848', group: 'Greens', opacity: 'Transp.', permanence: '★★★★★' },
      { name: 'Chromium Oxide', hex: '#588040', group: 'Greens', opacity: 'Opaque', permanence: '★★★★★' },
      { name: 'Cerulean Blue', hex: '#3888c0', group: 'Blues', opacity: 'Opaque', permanence: '★★★★★' },
      { name: 'Cobalt Blue', hex: '#2858b0', group: 'Blues', opacity: 'Semi-transp.', permanence: '★★★★★' },
      { name: 'French Ultramarine', hex: '#2840a0', group: 'Blues', opacity: 'Transp.', permanence: '★★★★' },
      { name: 'Prussian Blue', hex: '#183060', group: 'Blues', opacity: 'Transp.', permanence: '★★★' },
      { name: 'Cobalt Violet', hex: '#703888', group: 'Violets', opacity: 'Semi-transp.', permanence: '★★★★' },
      { name: 'Ivory Black', hex: '#202018', group: 'Blacks', opacity: 'Opaque', permanence: '★★★★★' },
      { name: 'Lamp Black', hex: '#181810', group: 'Blacks', opacity: 'Opaque', permanence: '★★★★★' }
    ];

    let selectedPigments = [];
    let filterGroup = 'All';

    const draw = () => {
      viz.innerHTML = '';

      const container = document.createElement('div');
      container.style.maxWidth = '900px';
      container.style.margin = '0 auto';
      container.style.display = 'flex';
      container.style.gap = '1rem';
      container.style.flexWrap = 'wrap';

      // Left: catalogue listing
      const listing = document.createElement('div');
      listing.style.flex = '1';
      listing.style.minWidth = '400px';

      const filtered = filterGroup === 'All' ? pigments : pigments.filter(p => p.group === filterGroup);

      const table = document.createElement('table');
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      table.style.fontFamily = "'Crimson Text', Georgia, serif";
      table.style.fontSize = '0.8rem';

      table.innerHTML = `
        <thead>
          <tr style="border-bottom:2px solid #9e8565">
            <th style="padding:4px 8px;text-align:left;font-style:italic;color:#5c4a3a">Swatch</th>
            <th style="padding:4px 8px;text-align:left;font-style:italic;color:#5c4a3a">Pigment Name</th>
            <th style="padding:4px 8px;text-align:left;font-style:italic;color:#5c4a3a">Opacity</th>
            <th style="padding:4px 8px;text-align:left;font-style:italic;color:#5c4a3a">Perm.</th>
            <th style="padding:4px 8px;text-align:center;font-style:italic;color:#5c4a3a">Select</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map((p, i) => {
            const isSelected = selectedPigments.some(s => s.name === p.name);
            return `
              <tr style="border-bottom:1px solid #e0cdaa;background:${isSelected ? '#e8d5b4' : 'transparent'};cursor:pointer" data-idx="${pigments.indexOf(p)}">
                <td style="padding:4px 8px"><div style="width:30px;height:20px;background:${p.hex};border:1px solid #2a1f14;border-radius:2px"></div></td>
                <td style="padding:4px 8px;color:#2a1f14">${p.name}</td>
                <td style="padding:4px 8px;color:#8a7560;font-size:0.7rem">${p.opacity}</td>
                <td style="padding:4px 8px;font-size:0.7rem">${p.permanence}</td>
                <td style="padding:4px 8px;text-align:center">${isSelected ? '✓' : '○'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      `;

      table.querySelectorAll('tbody tr').forEach(row => {
        row.onclick = () => {
          const idx = parseInt(row.dataset.idx);
          const p = pigments[idx];
          const existing = selectedPigments.findIndex(s => s.name === p.name);
          if (existing >= 0) {
            selectedPigments.splice(existing, 1);
          } else if (selectedPigments.length < 8) {
            selectedPigments.push(p);
          }
          draw();
        };
      });

      listing.appendChild(table);

      // Right: Selected palette + mixing
      const palette = document.createElement('div');
      palette.style.width = '280px';
      palette.style.flexShrink = '0';

      let paletteHTML = `<div style="font-family:'IM Fell DW Pica SC',Georgia,serif;font-size:0.9rem;color:#2a1f14;margin-bottom:0.5rem;text-align:center">Your Palette</div>`;

      if (selectedPigments.length === 0) {
        paletteHTML += `<div style="text-align:center;color:#8a7560;font-style:italic;font-size:0.8rem;padding:2rem">Click pigments to add them to your palette</div>`;
      } else {
        // Palette swatches
        paletteHTML += `<div style="display:flex;gap:3px;flex-wrap:wrap;justify-content:center;margin-bottom:0.8rem">`;
        selectedPigments.forEach(p => {
          paletteHTML += `<div style="width:45px;text-align:center">
            <div style="width:45px;height:35px;background:${p.hex};border:1px solid #2a1f14;border-radius:2px"></div>
            <div style="font-size:0.55rem;color:#5c4a3a;margin-top:2px">${p.name.split(' ').slice(0, 2).join(' ')}</div>
          </div>`;
        });
        paletteHTML += `</div>`;

        // Mixed result
        if (selectedPigments.length >= 2) {
          const mixed = CU.mixSubtractive(selectedPigments.map(p => p.hex));
          paletteHTML += `
            <div style="text-align:center;margin-top:0.5rem">
              <div style="font-style:italic;color:#8a7560;font-size:0.75rem;margin-bottom:4px">All Pigments Mixed (Subtractive):</div>
              <div style="width:80px;height:50px;background:${mixed};border:2px solid #2a1f14;margin:0 auto;border-radius:3px"></div>
              <div style="font-size:0.75rem;color:#2a1f14;margin-top:4px">${mixed}</div>
            </div>
          `;

          // Pairwise mixes
          paletteHTML += `<div style="margin-top:0.8rem;font-style:italic;color:#8a7560;font-size:0.7rem;text-align:center">Pairwise Mixes:</div>`;
          paletteHTML += `<div style="display:flex;flex-wrap:wrap;gap:3px;justify-content:center;margin-top:4px">`;
          for (let a = 0; a < Math.min(selectedPigments.length, 6); a++) {
            for (let b = a + 1; b < Math.min(selectedPigments.length, 6); b++) {
              const m = CU.mixSubtractive([selectedPigments[a].hex, selectedPigments[b].hex]);
              paletteHTML += `<div style="width:28px;height:28px;background:${m};border:1px solid rgba(42,31,20,0.3);border-radius:2px" title="${selectedPigments[a].name} + ${selectedPigments[b].name} = ${m}"></div>`;
            }
          }
          paletteHTML += `</div>`;
        }
      }

      palette.innerHTML = paletteHTML;

      container.appendChild(listing);
      container.appendChild(palette);
      viz.appendChild(container);
    };

    const groups = ['All', ...new Set(pigments.map(p => p.group))];
    controls.innerHTML = `
      <div class="control-group"><label>Group:</label>
        <select id="cat-group">${groups.map(g => `<option value="${g}">${g}</option>`).join('')}</select>
      </div>
      <div class="control-group"><button class="btn" id="cat-clear">Clear Palette</button></div>
    `;

    document.getElementById('cat-group').onchange = (e) => {
      filterGroup = e.target.value;
      draw();
    };

    document.getElementById('cat-clear').onclick = () => {
      selectedPigments = [];
      draw();
    };

    info.textContent = 'Click pigments in the catalogue to build a palette (up to 8). Hover pairwise mixes to see which two pigments produced them. Permanence stars indicate lightfastness.';
    draw();
  }
});
