const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10" x 5.625"
pres.author = "Unveil";
pres.title = "Unveil Brand Identity Guidelines 2025";

// ─── PALETTE ────────────────────────────────────────────────────
const C = {
  deep:      "1a2010",
  forest:    "3a4a22",
  olive:     "4d5c2a",
  sage:      "7E8B78",
  mist:      "AFAB86",
  cream:     "f0ede4",
  parchment: "e8e3d8",
  offwhite:  "fafaf7",
};

// ─── FONTS ──────────────────────────────────────────────────────
const F = {
  serif: "Cormorant Garamond",
  sans:  "DM Sans",
};

// ════════════════════════════════════════════════════════════════
// SLIDE 1 — Cover
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.deep };

  // Subtle vertical rule left accent
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.2, w: 0.015, h: 3.2,
    fill: { color: C.mist, transparency: 55 }, line: { type: "none" },
  });

  // Wordmark
  s.addText("unveil", {
    x: 0, y: 1.55, w: 10, h: 2.0,
    fontFace: F.serif, fontSize: 112, color: C.cream,
    align: "center", valign: "middle", bold: false,
  });

  // Tagline
  s.addText("Male pleasure & sexual health", {
    x: 0, y: 3.75, w: 10, h: 0.45,
    fontFace: F.sans, fontSize: 9.5, color: C.mist,
    align: "center", charSpacing: 5, bold: false,
  });

  // Bottom label
  s.addText("Brand Identity Guidelines  ·  2025", {
    x: 0.5, y: 5.15, w: 9, h: 0.3,
    fontFace: F.sans, fontSize: 7.5, color: C.sage,
    align: "right", charSpacing: 2,
  });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 2 — Brand Story
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.deep };

  // Ghost "78%" watermark
  s.addText("78%", {
    x: 2.8, y: 0.3, w: 7, h: 5.0,
    fontFace: F.serif, fontSize: 260, color: C.mist,
    align: "left", valign: "middle", transparency: 88,
  });

  // Left column — quote
  s.addText("“Nobody taught you how your body actually works.”", {
    x: 0.55, y: 0.7, w: 5.8, h: 4.2,
    fontFace: F.serif, fontSize: 36, color: C.cream,
    italic: true, valign: "middle", align: "left",
  });

  // Right column — body
  s.addText([
    { text: "About Unveil", options: { bold: true, color: C.mist, fontSize: 9, charSpacing: 3, breakLine: true } },
    { text: "\n", options: { fontSize: 6, breakLine: true } },
    { text: "Unveil exists at the intersection of sexual wellness and editorial luxury. We believe understanding your body is not a luxury — it's a foundation.", options: { color: C.sage, fontSize: 13 } },
  ], {
    x: 6.8, y: 1.8, w: 2.9, h: 2.8,
    fontFace: F.sans, valign: "middle", align: "left",
  });

  // Vertical rule between columns
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.55, y: 1.2, w: 0.012, h: 3.1,
    fill: { color: C.forest }, line: { type: "none" },
  });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 3 — Color Palette
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offwhite };

  // Title
  s.addText("Color Palette", {
    x: 0.55, y: 0.38, w: 5, h: 0.6,
    fontFace: F.serif, fontSize: 32, color: C.deep, bold: false,
  });
  s.addText("The visual language of Unveil", {
    x: 0.55, y: 0.9, w: 6, h: 0.3,
    fontFace: F.sans, fontSize: 10, color: C.sage,
  });

  const swatches = [
    { color: C.deep,      hex: "#1A2010", name: "Deep",       group: "Primary" },
    { color: C.forest,    hex: "#3A4A22", name: "Forest",     group: "Primary" },
    { color: C.olive,     hex: "#4D5C2A", name: "Olive",      group: "Primary" },
    { color: C.mist,      hex: "#AFAB86", name: "Mist",       group: "Accent"  },
    { color: C.sage,      hex: "#7E8B78", name: "Sage",       group: "Neutral" },
    { color: C.cream,     hex: "#F0EDE4", name: "Cream",      group: "Neutral" },
    { color: C.parchment, hex: "#E8E3D8", name: "Parchment",  group: "Neutral" },
    { color: C.offwhite,  hex: "#FAFAF7", name: "Off-White",  group: "Neutral" },
  ];

  const startX = 0.42;
  const swW = 1.08;
  const swH = 2.0;
  const gap = 0.06;

  swatches.forEach((sw, i) => {
    const x = startX + i * (swW + gap);
    const swatchColor = sw.color === C.offwhite ? "ebebeb" : sw.color;

    // Group label on first of each group
    const prevGroup = i > 0 ? swatches[i-1].group : null;
    if (sw.group !== prevGroup) {
      // Find how many in this group
      const groupStart = swatches.findIndex(s2 => s2.group === sw.group);
      const groupCount = swatches.filter(s2 => s2.group === sw.group).length;
      const groupX = startX + groupStart * (swW + gap);
      const groupW = groupCount * swW + (groupCount - 1) * gap;

      const labelColor = sw.group === "Accent" ? C.mist : (sw.group === "Primary" ? C.deep : C.sage);
      s.addText(sw.group.toUpperCase(), {
        x: groupX, y: 1.25, w: groupW, h: 0.22,
        fontFace: F.sans, fontSize: 7.5, color: labelColor,
        align: "left", charSpacing: 2.5,
      });
    }

    // Swatch rect
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.58, w: swW, h: swH,
      fill: { color: swatchColor },
      line: sw.color === C.offwhite ? { color: "cccccc", width: 0.5 } : { type: "none" },
    });

    // Hex code
    const textColor = (sw.color === C.cream || sw.color === C.parchment || sw.color === C.offwhite) ? C.olive : C.offwhite;
    s.addText(sw.hex, {
      x, y: 1.58 + swH - 0.6, w: swW, h: 0.28,
      fontFace: F.sans, fontSize: 8, color: textColor,
      align: "center", bold: false,
    });

    // Name label below swatch
    s.addText(sw.name, {
      x, y: 1.58 + swH + 0.08, w: swW, h: 0.25,
      fontFace: F.sans, fontSize: 9.5, color: C.deep,
      align: "center",
    });
  });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 4 — Typography
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.parchment };

  // Title
  s.addText("TYPOGRAPHY", {
    x: 0.55, y: 0.35, w: 9, h: 0.35,
    fontFace: F.sans, fontSize: 9, color: C.olive,
    charSpacing: 4, bold: false,
  });

  // Divider
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.55, y: 0.78, w: 8.9, h: 0.01,
    fill: { color: C.olive, transparency: 70 }, line: { type: "none" },
  });

  // ── LEFT: Cormorant Garamond ──
  s.addText("Cormorant\nGaramond", {
    x: 0.55, y: 0.95, w: 4.5, h: 1.5,
    fontFace: F.serif, fontSize: 44, color: C.deep,
    align: "left", valign: "top",
  });

  s.addText("Aa Bb Cc Dd Ee Ff Gg Hh Ii", {
    x: 0.55, y: 2.55, w: 4.5, h: 0.4,
    fontFace: F.serif, fontSize: 14, color: C.olive,
    italic: true,
  });

  s.addText([
    { text: "Light 300  ·  ", options: { bold: false } },
    { text: "Regular 400  ·  ", options: { bold: false } },
    { text: "Medium 500  ·  ", options: { bold: false } },
    { text: "SemiBold 600", options: { bold: true } },
  ], {
    x: 0.55, y: 3.08, w: 4.5, h: 0.35,
    fontFace: F.serif, fontSize: 11, color: C.sage,
  });

  s.addText("Editorial  ·  Headings  ·  Display", {
    x: 0.55, y: 3.55, w: 4.5, h: 0.3,
    fontFace: F.sans, fontSize: 8.5, color: C.mist,
    charSpacing: 2,
  });

  // ── Vertical rule ──
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.25, y: 0.95, w: 0.012, h: 3.6,
    fill: { color: C.olive, transparency: 65 }, line: { type: "none" },
  });

  // ── RIGHT: DM Sans ──
  s.addText("DM\nSans", {
    x: 5.55, y: 0.95, w: 4.1, h: 1.5,
    fontFace: F.sans, fontSize: 44, color: C.deep,
    align: "left", valign: "top", bold: false,
  });

  s.addText("Aa Bb Cc Dd Ee Ff Gg Hh Ii", {
    x: 5.55, y: 2.55, w: 4.1, h: 0.4,
    fontFace: F.sans, fontSize: 14, color: C.olive,
  });

  s.addText("Light 300  ·  Regular 400  ·  Medium 500", {
    x: 5.55, y: 3.08, w: 4.1, h: 0.35,
    fontFace: F.sans, fontSize: 11, color: C.sage,
  });

  s.addText("Body  ·  Labels  ·  UI  ·  Navigation", {
    x: 5.55, y: 3.55, w: 4.1, h: 0.3,
    fontFace: F.sans, fontSize: 8.5, color: C.mist,
    charSpacing: 2,
  });

  // Usage note
  s.addText("Always pair these two. Cormorant for impact. DM Sans for clarity.", {
    x: 0.55, y: 5.1, w: 9, h: 0.3,
    fontFace: F.sans, fontSize: 9, color: C.sage,
    align: "center", italic: true,
  });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 5 — Logo & Wordmark
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.deep };

  s.addText("WORDMARK", {
    x: 0.55, y: 0.35, w: 9, h: 0.28,
    fontFace: F.sans, fontSize: 8.5, color: C.mist,
    charSpacing: 4, align: "center",
  });

  // Primary — full slide dark
  s.addText("unveil", {
    x: 0.5, y: 0.75, w: 9, h: 1.35,
    fontFace: F.serif, fontSize: 88, color: C.cream,
    align: "center", valign: "middle",
  });
  s.addText("on Deep  #1A2010  ·  primary usage", {
    x: 0.5, y: 2.05, w: 9, h: 0.25,
    fontFace: F.sans, fontSize: 8, color: C.sage,
    align: "center",
  });

  // Two variant boxes
  // Left: Forest bg
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.55, y: 2.55, w: 4.1, h: 2.35,
    fill: { color: C.forest }, line: { type: "none" },
  });
  s.addText("unveil", {
    x: 0.55, y: 2.55, w: 4.1, h: 1.8,
    fontFace: F.serif, fontSize: 58, color: C.cream,
    align: "center", valign: "middle",
  });
  s.addText("on Forest  #3A4A22", {
    x: 0.55, y: 4.25, w: 4.1, h: 0.4,
    fontFace: F.sans, fontSize: 8, color: C.sage,
    align: "center",
  });

  // Right: Parchment bg
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.35, y: 2.55, w: 4.1, h: 2.35,
    fill: { color: C.parchment }, line: { type: "none" },
  });
  s.addText("unveil", {
    x: 5.35, y: 2.55, w: 4.1, h: 1.8,
    fontFace: F.serif, fontSize: 58, color: C.deep,
    align: "center", valign: "middle",
  });
  s.addText("on Parchment  #E8E3D8", {
    x: 5.35, y: 4.25, w: 4.1, h: 0.4,
    fontFace: F.sans, fontSize: 8, color: C.olive,
    align: "center",
  });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 6 — Brand Voice
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.forest };

  s.addText("Brand Voice", {
    x: 0.55, y: 0.35, w: 9, h: 0.9,
    fontFace: F.serif, fontSize: 48, color: C.cream,
    italic: true, align: "left",
  });

  const pillars = [
    { num: "01", title: "Honest",          desc: "We say the things others avoid. Plainly, respectfully, fully." },
    { num: "02", title: "Intentional",     desc: "Every product, every word exists for a reason." },
    { num: "03", title: "Destigmatizing",  desc: "Curiosity about your body is not weakness. It's awareness." },
    { num: "04", title: "Premium",         desc: "Editorial luxury that treats men's health with the gravity it deserves." },
  ];

  pillars.forEach((p, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.55 + col * 4.75;
    const y = 1.55 + row * 2.0;

    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.3, h: 1.75,
      fill: { color: C.deep, transparency: 72 }, line: { type: "none" },
    });

    s.addText(p.num, {
      x: x + 0.25, y: y + 0.22, w: 0.6, h: 0.28,
      fontFace: F.sans, fontSize: 8.5, color: C.mist, charSpacing: 2,
    });
    s.addText(p.title, {
      x: x + 0.25, y: y + 0.52, w: 3.8, h: 0.42,
      fontFace: F.serif, fontSize: 24, color: C.cream,
    });
    s.addText(p.desc, {
      x: x + 0.25, y: y + 0.96, w: 3.8, h: 0.65,
      fontFace: F.sans, fontSize: 10.5, color: C.sage,
    });
  });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 7 — Brand Pillars
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.deep };

  s.addText("Three Pillars", {
    x: 0.55, y: 0.3, w: 9, h: 0.75,
    fontFace: F.serif, fontSize: 46, color: C.cream,
    align: "center",
  });

  const pillars = [
    { num: "01", title: "Body\nLiteracy",       desc: "Understanding how your body works is not optional — it's foundational." },
    { num: "02", title: "Zero\nShame",           desc: "Curiosity is not weakness. It's awareness." },
    { num: "03", title: "Intentional\nDesign",   desc: "Everything we make is built with purpose, quality, and discretion." },
  ];

  const colW = 2.8;
  const startX = 0.55;
  const ruleX  = [startX + colW + 0.35, startX + (colW + 0.35) * 2];

  // Vertical rules
  ruleX.forEach(rx => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: 1.25, w: 0.012, h: 4.0,
      fill: { color: C.forest }, line: { type: "none" },
    });
  });

  pillars.forEach((p, i) => {
    const x = startX + i * (colW + 0.36);

    s.addText(p.num, {
      x, y: 1.3, w: colW, h: 0.28,
      fontFace: F.sans, fontSize: 8.5, color: C.mist, charSpacing: 2,
    });
    s.addText(p.title, {
      x, y: 1.68, w: colW, h: 1.2,
      fontFace: F.serif, fontSize: 34, color: C.cream,
    });
    s.addText(p.desc, {
      x, y: 3.0, w: colW, h: 1.5,
      fontFace: F.sans, fontSize: 11.5, color: C.sage,
    });
  });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 8 — UI Components
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.cream };

  s.addText("UI COMPONENTS", {
    x: 0.55, y: 0.33, w: 9, h: 0.3,
    fontFace: F.sans, fontSize: 9, color: C.olive,
    charSpacing: 4,
  });
  s.addText("Design tokens in action", {
    x: 0.55, y: 0.72, w: 6, h: 0.28,
    fontFace: F.sans, fontSize: 10.5, color: C.sage,
  });

  // ─ BUTTONS row ─
  s.addText("BUTTONS", {
    x: 0.55, y: 1.2, w: 3, h: 0.22,
    fontFace: F.sans, fontSize: 7.5, color: C.sage, charSpacing: 2,
  });

  // Primary button – Mist bg, Deep text
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.55, y: 1.52, w: 1.9, h: 0.48,
    fill: { color: C.mist }, line: { type: "none" },
  });
  s.addText("EXPLORE PRODUCTS", {
    x: 0.55, y: 1.52, w: 1.9, h: 0.48,
    fontFace: F.sans, fontSize: 7.5, color: C.deep,
    align: "center", valign: "middle", charSpacing: 1.5, bold: true,
  });

  // Secondary button – Deep bg, Mist border+text
  s.addShape(pres.shapes.RECTANGLE, {
    x: 2.6, y: 1.52, w: 1.7, h: 0.48,
    fill: { color: C.deep }, line: { color: C.mist, width: 1.0 },
  });
  s.addText("ADD TO CART", {
    x: 2.6, y: 1.52, w: 1.7, h: 0.48,
    fontFace: F.sans, fontSize: 7.5, color: C.mist,
    align: "center", valign: "middle", charSpacing: 1.5,
  });

  // Ghost button
  s.addShape(pres.shapes.RECTANGLE, {
    x: 4.45, y: 1.52, w: 1.5, h: 0.48,
    fill: { color: C.cream }, line: { color: C.sage, width: 0.8 },
  });
  s.addText("LEARN MORE", {
    x: 4.45, y: 1.52, w: 1.5, h: 0.48,
    fontFace: F.sans, fontSize: 7.5, color: C.sage,
    align: "center", valign: "middle", charSpacing: 1.5,
  });

  // ─ TAGS / BADGES ─
  s.addText("TAGS & BADGES", {
    x: 0.55, y: 2.28, w: 3, h: 0.22,
    fontFace: F.sans, fontSize: 7.5, color: C.sage, charSpacing: 2,
  });
  const tags = ["NEW", "BESTSELLER", "BODY LITERACY"];
  tags.forEach((tag, i) => {
    const bx = 0.55 + i * 1.65;
    s.addShape(pres.shapes.RECTANGLE, {
      x: bx, y: 2.58, w: 1.48, h: 0.35,
      fill: { color: C.mist }, line: { type: "none" },
    });
    s.addText(tag, {
      x: bx, y: 2.58, w: 1.48, h: 0.35,
      fontFace: F.sans, fontSize: 7, color: C.deep,
      align: "center", valign: "middle", charSpacing: 2, bold: true,
    });
  });

  // ─ INPUT FIELD ─
  s.addText("INPUT FIELD", {
    x: 0.55, y: 3.18, w: 4, h: 0.22,
    fontFace: F.sans, fontSize: 7.5, color: C.sage, charSpacing: 2,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.55, y: 3.48, w: 3.8, h: 0.5,
    fill: { color: C.cream }, line: { color: C.olive, width: 0.75 },
  });
  s.addText("Your email address", {
    x: 0.75, y: 3.48, w: 3.6, h: 0.5,
    fontFace: F.sans, fontSize: 10, color: C.sage,
    valign: "middle",
  });
  // Submit
  s.addShape(pres.shapes.RECTANGLE, {
    x: 4.5, y: 3.48, w: 1.6, h: 0.5,
    fill: { color: C.deep }, line: { type: "none" },
  });
  s.addText("JOIN WAITLIST", {
    x: 4.5, y: 3.48, w: 1.6, h: 0.5,
    fontFace: F.sans, fontSize: 7, color: C.cream,
    align: "center", valign: "middle", charSpacing: 1.5,
  });

  // ─ NAV / TEXT STYLES ─
  s.addText("TYPOGRAPHY IN USE", {
    x: 6.5, y: 1.2, w: 3.2, h: 0.22,
    fontFace: F.sans, fontSize: 7.5, color: C.sage, charSpacing: 2,
  });
  s.addText("SHOP", {
    x: 6.5, y: 1.52, w: 3, h: 0.3,
    fontFace: F.sans, fontSize: 11, color: C.deep,
    charSpacing: 3,
  });
  s.addText("Intentionally designed", {
    x: 6.5, y: 1.9, w: 3.3, h: 0.55,
    fontFace: F.serif, fontSize: 28, color: C.deep,
  });
  s.addText("Products crafted for those who take their wellbeing seriously.", {
    x: 6.5, y: 2.55, w: 3.3, h: 0.6,
    fontFace: F.sans, fontSize: 10, color: C.olive,
  });
  s.addText("View all products →", {
    x: 6.5, y: 3.25, w: 3, h: 0.28,
    fontFace: F.sans, fontSize: 9, color: C.olive,
  });

  // Divider
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.25, y: 1.2, w: 0.01, h: 3.0,
    fill: { color: C.olive, transparency: 60 }, line: { type: "none" },
  });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 9 — Photography Direction
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.deep };

  s.addText("Visual Direction", {
    x: 0.55, y: 0.3, w: 9, h: 0.75,
    fontFace: F.serif, fontSize: 46, color: C.cream,
    italic: true,
  });

  // Photo placeholder – left
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.55, y: 1.25, w: 5.6, h: 4.0,
    fill: { color: C.forest }, line: { type: "none" },
  });
  // Inner label
  s.addText("Editorial — Masculine — Minimal", {
    x: 0.85, y: 4.35, w: 5.0, h: 0.35,
    fontFace: F.sans, fontSize: 9, color: C.mist, charSpacing: 2,
  });
  s.addText('"High contrast B&W or muted earthy tones.\nNever clinical. Never crude."', {
    x: 0.85, y: 1.55, w: 4.8, h: 0.8,
    fontFace: F.serif, fontSize: 16, color: C.cream,
    italic: true,
  });

  // Crosshair decoration
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.55, y: 2.65, w: 5.6, h: 0.008,
    fill: { color: C.mist, transparency: 75 }, line: { type: "none" },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 3.31, y: 1.25, w: 0.008, h: 4.0,
    fill: { color: C.mist, transparency: 75 }, line: { type: "none" },
  });

  // Right column
  s.addText("✓  DO", {
    x: 6.5, y: 1.25, w: 3.2, h: 0.35,
    fontFace: F.sans, fontSize: 10, color: C.mist,
    bold: true, charSpacing: 1,
  });
  const doItems = [
    "Moody editorial portraits",
    "Masculine silhouettes",
    "Soft natural light",
    "Minimalist interiors",
    "Earthy, desaturated tones",
  ];
  doItems.forEach((item, i) => {
    s.addText("— " + item, {
      x: 6.5, y: 1.68 + i * 0.32, w: 3.2, h: 0.3,
      fontFace: F.sans, fontSize: 10.5, color: C.sage,
    });
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.5, y: 3.52, w: 3.1, h: 0.01,
    fill: { color: C.forest }, line: { type: "none" },
  });

  s.addText("✗  DON'T", {
    x: 6.5, y: 3.65, w: 3.2, h: 0.35,
    fontFace: F.sans, fontSize: 10, color: C.sage,
    bold: true, charSpacing: 1,
  });
  const dontItems = [
    "Stock imagery",
    "Bright clinical lighting",
    "Generic wellness clichés",
    "Explicit content",
  ];
  dontItems.forEach((item, i) => {
    s.addText("— " + item, {
      x: 6.5, y: 4.08 + i * 0.3, w: 3.2, h: 0.28,
      fontFace: F.sans, fontSize: 10.5, color: C.sage,
      transparency: 35,
    });
  });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 10 — Tone of Voice
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.parchment };

  s.addText("Tone of Voice", {
    x: 0.55, y: 0.3, w: 9, h: 0.68,
    fontFace: F.serif, fontSize: 44, color: C.deep,
  });

  // Section labels
  const labels = ["HERO", "BODY", "CTA"];
  const cols = [0.55, 3.75, 7.1];
  const colW2 = [3.0, 3.1, 2.6];

  labels.forEach((lbl, i) => {
    s.addText(lbl, {
      x: cols[i], y: 1.18, w: colW2[i], h: 0.25,
      fontFace: F.sans, fontSize: 8, color: C.mist,
      charSpacing: 3,
    });
  });

  // Thin top rules
  labels.forEach((_, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: cols[i], y: 1.1, w: colW2[i] * 0.85, h: 0.01,
      fill: { color: C.mist }, line: { type: "none" },
    });
  });

  // HERO text
  s.addText("Your body is\nnot instinct.\nIt's a system.", {
    x: cols[0], y: 1.55, w: colW2[0], h: 3.6,
    fontFace: F.serif, fontSize: 32, color: C.deep,
    italic: true, valign: "top",
  });

  // BODY text
  s.addText("Nobody taught you how your body actually works. But understanding how it responds changes how you experience pleasure.", {
    x: cols[1], y: 1.55, w: colW2[1], h: 2.0,
    fontFace: F.sans, fontSize: 12.5, color: C.olive,
    valign: "top",
  });

  // CTA
  s.addShape(pres.shapes.RECTANGLE, {
    x: cols[2], y: 1.55, w: 1.85, h: 0.5,
    fill: { color: C.deep }, line: { type: "none" },
  });
  s.addText("JOIN WAITLIST", {
    x: cols[2], y: 1.55, w: 1.85, h: 0.5,
    fontFace: F.sans, fontSize: 8, color: C.cream,
    align: "center", valign: "middle", charSpacing: 2, bold: true,
  });

  s.addText("DM Sans · 8pt · Uppercase · Tracked", {
    x: cols[2], y: 2.22, w: 2.4, h: 0.3,
    fontFace: F.sans, fontSize: 8.5, color: C.sage,
  });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 11 — Digital Presence
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.forest };

  s.addText("Digital Presence", {
    x: 0.55, y: 0.3, w: 9, h: 0.78,
    fontFace: F.serif, fontSize: 46, color: C.cream,
    align: "left",
  });

  const channels = [
    {
      num: "01",
      channel: "Website",
      handle: "unveil.co",
      desc: "Dark editorial aesthetic. Typography-first. Premium wellness meets body literacy.",
      detail: "Next.js · Tailwind · Multilingual EN/PT/ES",
      bg: C.deep,
    },
    {
      num: "02",
      channel: "Instagram",
      handle: "@unveil",
      desc: "Editorial photography. Desaturated earthy tones. Zero sensationalism.",
      detail: "Feed · Stories · Educational carousels",
      bg: "232d17",
    },
    {
      num: "03",
      channel: "Newsletter",
      handle: "The Unveil Journal",
      desc: "Educational. Premium long-form. Sent to those who ask for it.",
      detail: "Body literacy · Health · Mindset",
      bg: C.deep,
    },
  ];

  channels.forEach((ch, i) => {
    const x = 0.45 + i * 3.12;
    const w = 2.95;

    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.32, w, h: 4.0,
      fill: { color: ch.bg }, line: { type: "none" },
    });

    s.addText(ch.num, {
      x: x + 0.22, y: 1.58, w: w - 0.4, h: 0.28,
      fontFace: F.sans, fontSize: 8, color: C.mist, charSpacing: 2,
    });
    s.addText(ch.channel, {
      x: x + 0.22, y: 1.92, w: w - 0.4, h: 0.45,
      fontFace: F.serif, fontSize: 24, color: C.cream,
    });
    s.addText(ch.handle, {
      x: x + 0.22, y: 2.45, w: w - 0.4, h: 0.3,
      fontFace: F.sans, fontSize: 9.5, color: C.mist,
    });
    s.addText(ch.desc, {
      x: x + 0.22, y: 2.9, w: w - 0.4, h: 1.2,
      fontFace: F.sans, fontSize: 10, color: C.sage,
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.22, y: 4.52, w: w - 0.44, h: 0.008,
      fill: { color: C.forest }, line: { type: "none" },
    });
    s.addText(ch.detail, {
      x: x + 0.22, y: 4.62, w: w - 0.44, h: 0.3,
      fontFace: F.sans, fontSize: 8, color: C.sage,
      charSpacing: 0.5,
    });
  });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 12 — Manifesto / Closing
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.deep };

  // Mist accent dot
  s.addShape(pres.shapes.OVAL, {
    x: 4.6, y: 0.85, w: 0.1, h: 0.1,
    fill: { color: C.mist }, line: { type: "none" },
  });

  // Main manifesto quote
  s.addText("That's why\nthis space exists.", {
    x: 0.5, y: 0.95, w: 9, h: 3.5,
    fontFace: F.serif, fontSize: 72, color: C.cream,
    italic: true, align: "center", valign: "middle",
  });

  // Wordmark
  s.addText("unveil", {
    x: 0, y: 4.55, w: 10, h: 0.55,
    fontFace: F.serif, fontSize: 28, color: C.mist,
    align: "center", charSpacing: 6,
  });

  // Copyright
  s.addText("© 2025 Unveil. All rights reserved.", {
    x: 0, y: 5.2, w: 10, h: 0.25,
    fontFace: F.sans, fontSize: 7.5, color: C.sage,
    align: "center",
  });
}

// ════════════════════════════════════════════════════════════════
// WRITE
// ════════════════════════════════════════════════════════════════
pres.writeFile({ fileName: "/Users/marymarquez/Desktop/unvail/Unveil_Brand_Identity.pptx" })
  .then(() => console.log("✅  Saved: /Users/marymarquez/Desktop/unvail/Unveil_Brand_Identity.pptx"))
  .catch(err => { console.error("❌", err); process.exit(1); });
