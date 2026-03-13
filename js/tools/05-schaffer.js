/* ═══════════════════════════════════════════════════════════════
   Tool 05: Schäffer's Genealogia Colorum (1769)
   Colours as genealogical families — principal colors have
   "children" (derivatives). Hierarchical tree layout.
   Interactive: Change parent colors, children auto-derive.
   ═══════════════════════════════════════════════════════════════ */

ColorTools.register('schaffer-1769', {
  name: 'Genealogia Colorum',
  shortName: 'Genealogia',
  author: 'Jacob Christian Schäffer',
  year: 1769,
  description: 'Schäffer presented colour as genealogical and hierarchical — principal colours are families, each spawning derivative children. Change any parent colour and its descendants will update accordingly.',

  render(viz, controls, info) {
    controls.style.display = 'flex';
    info.style.display = 'block';

    let parents = [
      { name: 'Rubrum', hex: '#b82020' },
      { name: 'Aureum', hex: '#d4a020' },
      { name: 'Flavum', hex: '#e8d040' },
      { name: 'Viride', hex: '#2a8840' },
      { name: 'Caeruleum', hex: '#2850a0' },
      { name: 'Purpureum', hex: '#7030a0' },
      { name: 'Nigrum', hex: '#1a1a1a' }
    ];

    const deriveChildren = (parentHex, count = 5) => {
      const children = [];
      const rgb = CU.hexToRgb(parentHex);
      const hsl = CU.rgbToHsl(rgb.r, rgb.g, rgb.b);

      for (let i = 0; i < count; i++) {
        const t = (i + 1) / (count + 1);
        // Vary hue slightly, plus change saturation and lightness
        const hShift = (t - 0.5) * 30;
        const sShift = (t - 0.5) * -20;
        const lShift = (t - 0.5) * 40;
        children.push({
          hex: CU.hslToHex(
            (hsl.h + hShift + 360) % 360,
            Math.max(10, Math.min(100, hsl.s + sShift)),
            Math.max(10, Math.min(90, hsl.l + lShift))
          )
        });
      }
      return children;
    };

    const canvas = Draw.createCanvas(viz, 700, 600);
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      Draw.parchmentBg(ctx, w, h);

      Draw.centeredText(ctx, 'GENEALOGIA COLORUM', w / 2, 25, 16, '#2a1f14', "small-caps 16px 'IM Fell DW Pica SC', Georgia, serif");
      Draw.centeredText(ctx, 'The Family Tree of Colours', w / 2, 42, 11, '#8a7560', "italic 11px 'Crimson Text', Georgia, serif");

      const n = parents.length;
      const colW = (w - 40) / n;
      const parentY = 70;
      const parentR = 22;
      const childrenY = 160;
      const childR = 14;
      const grandChildY = 300;
      const grandR = 10;
      const greatGrandY = 420;
      const greatR = 7;

      parents.forEach((parent, i) => {
        const cx = 20 + colW * i + colW / 2;

        // Draw parent circle with ornamental border
        ctx.beginPath();
        ctx.arc(cx, parentY, parentR + 3, 0, Math.PI * 2);
        ctx.strokeStyle = '#8b4513';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, parentY, parentR, 0, Math.PI * 2);
        ctx.fillStyle = parent.hex;
        ctx.fill();
        ctx.strokeStyle = '#2a1f14';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Parent name
        Draw.centeredText(ctx, parent.name, cx, parentY + parentR + 14, 10, '#2a1f14', "italic 10px 'Crimson Text', Georgia, serif");

        // Children
        const children = deriveChildren(parent.hex, 4);
        children.forEach((child, j) => {
          const childX = cx - colW / 3 + (j / 3) * (colW * 2 / 3);
          const childYPos = childrenY + (j % 2) * 20;

          // Connection line
          ctx.beginPath();
          ctx.moveTo(cx, parentY + parentR);
          ctx.lineTo(childX, childYPos - childR);
          ctx.strokeStyle = 'rgba(139,69,19,0.3)';
          ctx.lineWidth = 0.7;
          ctx.stroke();

          // Child circle
          ctx.beginPath();
          ctx.arc(childX, childYPos, childR, 0, Math.PI * 2);
          ctx.fillStyle = child.hex;
          ctx.fill();
          ctx.strokeStyle = 'rgba(42,31,20,0.4)';
          ctx.lineWidth = 0.5;
          ctx.stroke();

          // Grandchildren
          const grandChildren = deriveChildren(child.hex, 3);
          grandChildren.forEach((gc, k) => {
            const gcX = childX - 15 + k * 15;
            const gcY = grandChildY + (k % 2) * 15;

            ctx.beginPath();
            ctx.moveTo(childX, childYPos + childR);
            ctx.lineTo(gcX, gcY - grandR);
            ctx.strokeStyle = 'rgba(139,69,19,0.15)';
            ctx.lineWidth = 0.5;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(gcX, gcY, grandR, 0, Math.PI * 2);
            ctx.fillStyle = gc.hex;
            ctx.fill();
            ctx.strokeStyle = 'rgba(42,31,20,0.2)';
            ctx.stroke();

            // Great grandchildren
            const greats = deriveChildren(gc.hex, 2);
            greats.forEach((gg, l) => {
              const ggX = gcX - 6 + l * 12;
              const ggY = greatGrandY + (l % 2) * 10 + Math.random() * 10;

              ctx.beginPath();
              ctx.moveTo(gcX, gcY + grandR);
              ctx.lineTo(ggX, ggY - greatR);
              ctx.strokeStyle = 'rgba(139,69,19,0.1)';
              ctx.lineWidth = 0.3;
              ctx.stroke();

              ctx.beginPath();
              ctx.arc(ggX, ggY, greatR, 0, Math.PI * 2);
              ctx.fillStyle = gg.hex;
              ctx.fill();
            });
          });
        });
      });

      // Generation labels
      Draw.centeredText(ctx, '— Principalia —', w / 2, parentY - 15, 10, '#8a7560');
      Draw.centeredText(ctx, '— Secundaria —', w / 2, childrenY - 18, 10, '#8a7560');
      Draw.centeredText(ctx, '— Tertiaria —', w / 2, grandChildY - 18, 10, '#8a7560');
      Draw.centeredText(ctx, '— Quaternaria —', w / 2, greatGrandY - 12, 10, '#8a7560');

      // Bottom ornament
      Draw.centeredText(ctx, parent.hex || '', w / 2, h - 15, 9, '#8a7560');
    };

    controls.innerHTML = parents.map((p, i) =>
      `<div class="control-group"><label>${p.name}:</label><input type="color" id="schaffer-c${i}" value="${p.hex}"></div>`
    ).join('') + `<div class="control-group"><button class="btn" id="schaffer-reset">Reset</button></div>`;

    const update = () => {
      parents.forEach((p, i) => {
        p.hex = document.getElementById(`schaffer-c${i}`).value;
      });
      draw();
    };

    parents.forEach((_, i) => {
      document.getElementById(`schaffer-c${i}`).oninput = update;
    });

    document.getElementById('schaffer-reset').onclick = () => {
      const defaults = ['#b82020', '#d4a020', '#e8d040', '#2a8840', '#2850a0', '#7030a0', '#1a1a1a'];
      parents.forEach((p, i) => {
        p.hex = defaults[i];
        document.getElementById(`schaffer-c${i}`).value = defaults[i];
      });
      draw();
    };

    info.textContent = 'Each "principal" colour spawns children by subtle shifts in hue, saturation, and lightness — forming a genealogical tree of four generations.';
    draw();
  }
});
