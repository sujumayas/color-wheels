/* ═══════════════════════════════════════════════════════════════
   Tool 18: Principles of Advertising Arrangement (1912)
   Colour applied to commercial design — showing which colour
   combinations attract attention and convey messages.
   Interactive: Pick industry/mood, generate colour scheme.
   ═══════════════════════════════════════════════════════════════ */

ColorTools.register('advertising-1912', {
  name: 'Advertising Chromatics',
  shortName: 'Advertising',
  author: 'Frank Alvah Parsons',
  year: 1912,
  description: 'Early 20th-century principles of colour in advertising — which combinations attract the eye, convey luxury, economy, or urgency. Choose a mood and target to generate a period-appropriate colour scheme for your "advertisement."',

  render(viz, controls, info) {
    controls.style.display = 'flex';
    info.style.display = 'block';

    const moods = {
      luxury: { name: 'Luxury & Elegance', colors: ['#1a1028', '#8b4513', '#d4a440', '#f0e6d0', '#701830'], desc: 'Deep, rich tones with gold accents' },
      economy: { name: 'Economy & Value', colors: ['#cc3030', '#f8f0d0', '#2060a0', '#f0c020', '#ffffff'], desc: 'Bold primaries that command attention' },
      nature: { name: 'Nature & Health', colors: ['#3a6830', '#6aaa50', '#d8c870', '#8b6030', '#f5f0e0'], desc: 'Earth tones conveying vitality' },
      urgency: { name: 'Urgency & Action', colors: ['#cc2020', '#f8d020', '#000000', '#ffffff', '#ff6030'], desc: 'High-contrast alarm colours' },
      trust: { name: 'Trust & Authority', colors: ['#1a3060', '#3060a0', '#a0a8b0', '#f0f0f0', '#c8a040'], desc: 'Cool blues with dignified accents' },
      feminine: { name: 'Feminine & Delicate', colors: ['#d88098', '#f0c8d0', '#e8d0e0', '#a06880', '#f8f0f0'], desc: 'Soft roses and lavenders' },
      modern: { name: 'Modern & Progressive', colors: ['#e06020', '#282828', '#f0f0f0', '#40a0a0', '#d8d0c0'], desc: 'Bold contrast with accent colour' },
      festive: { name: 'Festive & Celebratory', colors: ['#cc2830', '#208838', '#d8a020', '#f0f0e8', '#801830'], desc: 'Rich, warm celebration tones' }
    };

    let currentMood = 'luxury';
    let customColors = [...moods[currentMood].colors];

    const canvas = Draw.createCanvas(viz, 700, 480);
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      Draw.parchmentBg(ctx, w, h);

      Draw.centeredText(ctx, 'ADVERTISING CHROMATICS', w / 2, 22, 14, '#2a1f14', "small-caps 14px 'IM Fell DW Pica SC', Georgia, serif");
      Draw.centeredText(ctx, moods[currentMood].name, w / 2, 40, 12, '#8b4513', "italic 12px 'Crimson Text', Georgia, serif");

      // Main colour palette display
      const paletteY = 60;
      const paletteH = 80;
      const paletteW = w - 80;
      const swatchW = paletteW / customColors.length;

      customColors.forEach((c, i) => {
        const x = 40 + i * swatchW;
        ctx.fillStyle = c;
        ctx.fillRect(x, paletteY, swatchW, paletteH);
        ctx.strokeStyle = 'rgba(42,31,20,0.3)';
        ctx.strokeRect(x, paletteY, swatchW, paletteH);

        // Labels
        Draw.centeredText(ctx, c, x + swatchW / 2, paletteY + paletteH + 14, 9, '#2a1f14');
        const roles = ['Background', 'Primary', 'Accent', 'Text', 'Highlight'];
        Draw.centeredText(ctx, roles[i] || '', x + swatchW / 2, paletteY + paletteH + 26, 8, '#8a7560');
      });

      // Mock advertisement preview
      const adX = 60, adY = 200, adW = w - 120, adH = 240;

      // Background
      ctx.fillStyle = customColors[0];
      ctx.fillRect(adX, adY, adW, adH);

      // Border
      ctx.strokeStyle = customColors[1];
      ctx.lineWidth = 3;
      ctx.strokeRect(adX + 8, adY + 8, adW - 16, adH - 16);

      // Headline
      ctx.textAlign = 'center';
      ctx.font = "bold 28px 'IM Fell DW Pica SC', Georgia, serif";
      ctx.fillStyle = customColors[3];
      ctx.fillText('YOUR HEADLINE HERE', adX + adW / 2, adY + 55);

      // Decorative line
      ctx.beginPath();
      ctx.moveTo(adX + 80, adY + 70);
      ctx.lineTo(adX + adW - 80, adY + 70);
      ctx.strokeStyle = customColors[2];
      ctx.lineWidth = 2;
      ctx.stroke();

      // Body text simulation
      ctx.font = "14px 'Crimson Text', Georgia, serif";
      ctx.fillStyle = customColors[3];
      const bodyLines = [
        'A demonstration of colour principles',
        'in the arrangement of advertising matter.',
        'The careful selection of harmonious tones',
        'creates an impression upon the reader.'
      ];
      bodyLines.forEach((line, i) => {
        ctx.fillText(line, adX + adW / 2, adY + 100 + i * 22);
      });

      // Accent box
      const boxW = 180, boxH = 40;
      ctx.fillStyle = customColors[4] || customColors[2];
      ctx.fillRect(adX + adW / 2 - boxW / 2, adY + adH - 70, boxW, boxH);
      ctx.font = "bold 16px 'IM Fell DW Pica SC', Georgia, serif";
      ctx.fillStyle = CU.textColor(customColors[4] || customColors[2]);
      ctx.fillText('CALL TO ACTION', adX + adW / 2, adY + adH - 45);

      // Frame
      ctx.strokeStyle = '#2a1f14';
      ctx.lineWidth = 1;
      ctx.strokeRect(adX, adY, adW, adH);

      Draw.centeredText(ctx, '— Advertisement Preview —', w / 2, adY + adH + 18, 10, '#8a7560');
      Draw.centeredText(ctx, moods[currentMood].desc, w / 2, adY + adH + 32, 9, '#8a7560', "italic 9px 'Crimson Text', Georgia, serif");
    };

    controls.innerHTML = `
      <div class="control-group"><label>Mood:</label>
        <select id="adv-mood">
          ${Object.entries(moods).map(([k, v]) => `<option value="${k}" ${k === currentMood ? 'selected' : ''}>${v.name}</option>`).join('')}
        </select>
      </div>
      ${customColors.map((c, i) =>
        `<div class="control-group"><label>${['Bg', 'Primary', 'Accent', 'Text', 'CTA'][i]}:</label><input type="color" id="adv-c${i}" value="${c}"></div>`
      ).join('')}
      <div class="control-group"><button class="btn" id="adv-reset">Reset</button></div>
    `;

    document.getElementById('adv-mood').onchange = (e) => {
      currentMood = e.target.value;
      customColors = [...moods[currentMood].colors];
      customColors.forEach((c, i) => {
        document.getElementById(`adv-c${i}`).value = c;
      });
      draw();
    };

    customColors.forEach((_, i) => {
      document.getElementById(`adv-c${i}`).oninput = (e) => {
        customColors[i] = e.target.value;
        draw();
      };
    });

    document.getElementById('adv-reset').onclick = () => {
      currentMood = 'luxury';
      customColors = [...moods[currentMood].colors];
      document.getElementById('adv-mood').value = currentMood;
      customColors.forEach((c, i) => {
        document.getElementById(`adv-c${i}`).value = c;
      });
      draw();
    };

    info.textContent = 'Early advertising theory prescribed specific colour palettes for different commercial purposes. Select a mood to see a period-appropriate palette applied to a mock advertisement.';
    draw();
  }
});
