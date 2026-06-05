import type { BlogArticle, LeadMagnet, Product } from "@/types/content";

const text = (en: string) => ({ en, pt: "", es: "" });

export const fallbackProducts: Product[] = [
  {
    _id: "fallback-the-clarity-oil",
    title: text("The Clarity Oil"),
    slug: "the-clarity-oil",
    shortDescription: text("A discreet daily body oil for skin nourishment and recovery rituals."),
    fullDescription: text("A premium oil designed for modern masculine self-care, with a calm finish and understated scent profile."),
    category: "Grooming & Self-Care",
    productType: "physical",
    price: 48,
    currency: "EUR",
    images: [],
    stockStatus: "in_stock",
    sku: "UNV-CLARITY-OIL",
    tags: ["Bestseller"],
    benefits: ["Supports a calm grooming ritual", "Nourishes skin", "Discreet scent"],
    howToUse: ["Apply a small amount to clean skin", "Use after showering or before rest"],
    materials: ["Botanical oils"],
    careInstructions: ["Store away from direct sunlight"],
    safetyNotes: ["External use only", "Patch test before use"],
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: "fallback-the-modern-man-code",
    title: text("The Modern Man Code"),
    slug: "the-modern-man-code",
    shortDescription: text("A premium digital guide to body literacy, self-respect, emotional intelligence, and refined masculine care."),
    fullDescription: text("UNVEIL's foundational paid ebook for modern men who want a calm, discreet, and education-first framework for hygiene, intimacy, emotional intelligence, and self-care."),
    category: "Male Optimization",
    productType: "digital",
    price: 39,
    currency: "EUR",
    images: [],
    stockStatus: "in_stock",
    sku: "UNV-MODERN-MAN-CODE",
    tags: ["Digital", "Ebook", "Foundational"],
    benefits: ["Builds body literacy", "Supports emotional maturity", "Creates a discreet self-care framework"],
    howToUse: ["Read one section at a time", "Use the reflection prompts privately", "Return to the routines as a reference"],
    materials: ["Protected PDF ebook"],
    careInstructions: ["Store in your private digital library"],
    safetyNotes: ["Educational content only", "Not a substitute for medical or mental health care"],
    fulfillmentType: "digital",
    isFeatured: true,
    isPublished: true,
    publicationStatus: "published",
    publishedAt: "2026-02-21",
  },
  {
    _id: "fallback-pelvic-control-digital-guide",
    title: text("Pelvic Control Digital Guide"),
    slug: "pelvic-control-digital-guide",
    shortDescription: text("A calm introductory guide to pelvic floor awareness and control."),
    fullDescription: text("An educational digital guide focused on anatomy, breath, nervous system awareness, and safe practice."),
    category: "Pelvic Floor & Control",
    productType: "digital",
    price: 29,
    currency: "EUR",
    images: [],
    stockStatus: "in_stock",
    sku: "UNV-PELVIC-GUIDE",
    tags: ["Digital"],
    benefits: ["Builds body literacy", "Supports intentional practice", "Discreet format"],
    howToUse: ["Read one chapter at a time", "Practice gently and consistently"],
    materials: ["PDF guide"],
    careInstructions: [],
    safetyNotes: ["Educational content only", "Consult a professional for medical concerns"],
    fulfillmentType: "digital",
    isFeatured: true,
    isPublished: true,
  },
];

function article(input: {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  contentType?: BlogArticle["contentType"];
  difficulty?: BlogArticle["difficulty"];
  estimatedReadingMinutes?: number;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  content: string;
  publishedAt: string;
}): BlogArticle {
  return {
    _id: `fallback-${input.slug}`,
    title: text(input.title),
    slug: input.slug,
    excerpt: text(input.excerpt),
    content: text(input.content),
    category: input.category,
    tags: input.tags,
    coverImage: { url: "", alt: `${input.title} editorial image by UNVEIL` },
    author: { name: "UNVEIL Editorial", role: "Education" },
    readingTime: input.estimatedReadingMinutes || 7,
    estimatedReadingMinutes: input.estimatedReadingMinutes || 7,
    contentType: input.contentType || "article",
    difficulty: input.difficulty || "beginner",
    relatedArticles: [],
    relatedProducts: [],
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    isPublished: true,
    publishedAt: input.publishedAt,
  };
}

export const fallbackBlogArticles: BlogArticle[] = [
  article({
    title: "Male Intimate Hygiene: What Most Men Were Never Taught",
    slug: "male-intimate-hygiene-what-most-men-were-never-taught",
    excerpt: "A calm foundation for daily hygiene, body awareness, and discreet self-care without shame or exaggeration.",
    category: "Male Hygiene",
    contentType: "guide",
    estimatedReadingMinutes: 8,
    seoTitle: "Male Intimate Hygiene: What Most Men Were Never Taught | UNVEIL",
    seoDescription: "A refined educational guide to male intimate hygiene, body literacy, and daily self-care.",
    tags: ["male hygiene", "body literacy", "self-care", "daily ritual"],
    content:
      "Most men are taught to be clean, but few are taught how hygiene connects to skin, comfort, confidence, and communication. Male intimate hygiene is not about fear or perfection. It is about noticing the body, respecting its signals, and building a routine that is simple enough to repeat.\n\nStart with the basics: gentle cleansing, drying properly, choosing breathable fabrics, and paying attention to irritation, persistent odor, pain, or discharge. Those signs deserve professional medical support rather than guesswork.\n\nUNVEIL frames hygiene as body literacy. Read next: /learn/the-7-hygiene-mistakes-most-men-make and request the free guide at /lead-magnets/7-hygiene-mistakes.",
    publishedAt: "2026-02-01",
  }),
  article({
    title: "The 7 Hygiene Mistakes Most Men Make",
    slug: "the-7-hygiene-mistakes-most-men-make",
    excerpt: "A practical look at common hygiene gaps, from harsh products to inconsistent routines and overlooked recovery.",
    category: "Male Hygiene",
    contentType: "guide",
    estimatedReadingMinutes: 7,
    seoTitle: "The 7 Hygiene Mistakes Most Men Make | UNVEIL",
    seoDescription: "Seven common male hygiene mistakes explained with calm, practical, non-judgmental guidance.",
    tags: ["hygiene mistakes", "male hygiene", "grooming", "skin comfort"],
    content:
      "The most common hygiene mistakes are usually ordinary: washing too aggressively, skipping proper drying, ignoring fabric choice, using strongly scented products on sensitive skin, treating irritation as normal, forgetting recovery after sweat, and avoiding medical support when symptoms persist.\n\nA better routine is restrained. Use gentle products, let the skin dry, change out of damp clothing, and notice what changes over time. Hygiene should make the body feel calmer, not more irritated.\n\nFor a broader foundation, read /learn/male-intimate-hygiene-what-most-men-were-never-taught and download the checklist at /lead-magnets/7-hygiene-mistakes.",
    publishedAt: "2026-02-03",
  }),
  article({
    title: "Your Body Is Not Instinct. It Is a System.",
    slug: "your-body-is-not-instinct-it-is-a-system",
    excerpt: "The UNVEIL foundation: understanding sensation, stress, recovery, hygiene, and communication as one connected system.",
    category: "Male Optimization",
    estimatedReadingMinutes: 6,
    seoTitle: "Your Body Is Not Instinct. It Is a System. | UNVEIL",
    seoDescription: "A premium introduction to male body literacy and the systems behind modern masculine self-care.",
    tags: ["body literacy", "male optimization", "self-awareness", "education"],
    content:
      "Many men are told to rely on instinct, but the body is more interesting than instinct. It is a system shaped by sleep, stress, hormones, circulation, nervous system state, habits, hygiene, and emotional safety.\n\nWhen men understand the system, self-care becomes less performative and more precise. Instead of chasing quick fixes, the question becomes: what is the body telling me, and what context have I ignored?\n\nContinue with /learn/performance-anxiety-is-a-nervous-system-issue and request the foundation guide at /lead-magnets/body-literacy-checklist.",
    publishedAt: "2026-02-05",
  }),
  article({
    title: "Performance Anxiety Is a Nervous System Issue",
    slug: "performance-anxiety-is-a-nervous-system-issue",
    excerpt: "A grounded explanation of how stress, pressure, and threat response can shape intimate confidence.",
    category: "Emotional Intelligence",
    difficulty: "intermediate",
    estimatedReadingMinutes: 8,
    seoTitle: "Performance Anxiety Is a Nervous System Issue | UNVEIL",
    seoDescription: "Educational guidance on performance anxiety, stress response, and emotional regulation for men.",
    tags: ["performance anxiety", "nervous system", "emotional regulation", "intimacy education"],
    content:
      "Performance anxiety is often framed as a confidence problem. In many cases, it is also a nervous system problem: pressure, fear of judgment, lack of safety, or past embarrassment can move the body into a stress state.\n\nA stress state changes attention, breathing, muscle tension, and arousal patterns. That does not mean something is wrong with a man. It means the body is responding to perceived pressure.\n\nSupport can include slower pacing, communication, breath, rest, and professional help when anxiety is severe or persistent. Read next: /learn/talking-about-sex-is-a-learnable-skill.",
    publishedAt: "2026-02-07",
  }),
  article({
    title: "The Pelvic Floor: The Muscle Group Nobody Told You About",
    slug: "the-pelvic-floor-the-muscle-group-nobody-told-you-about",
    excerpt: "A beginner-friendly guide to pelvic floor awareness, tension, breath, and control.",
    category: "Sexual Health",
    contentType: "guide",
    estimatedReadingMinutes: 8,
    seoTitle: "The Pelvic Floor: The Muscle Group Nobody Told You About | UNVEIL",
    seoDescription: "A safe educational introduction to the male pelvic floor, awareness, and responsible practice.",
    tags: ["pelvic floor", "body awareness", "control", "breath"],
    content:
      "The pelvic floor is a group of muscles involved in support, continence, breathing mechanics, and sexual function. Many men only hear about it when something feels off, but awareness can begin earlier and more calmly.\n\nPelvic floor education is not simply about squeezing. Tension, relaxation, breathing, posture, and stress all matter. Overtraining or forcing exercises can make discomfort worse for some people, so persistent pain or urinary symptoms deserve professional assessment.\n\nRelated reading: /learn/premature-ejaculation-causes-and-what-helps and /learn/your-body-is-not-instinct-it-is-a-system.",
    publishedAt: "2026-02-09",
  }),
  article({
    title: "The Prostate: The Organ Nobody Talks About",
    slug: "the-prostate-the-organ-nobody-talks-about",
    excerpt: "A non-alarming introduction to prostate awareness, symptoms worth noticing, and mature preventive care.",
    category: "Sexual Health",
    estimatedReadingMinutes: 7,
    seoTitle: "The Prostate: The Organ Nobody Talks About | UNVEIL",
    seoDescription: "A calm educational introduction to prostate awareness and responsible male wellness.",
    tags: ["prostate wellness", "male health", "body literacy", "preventive care"],
    content:
      "The prostate is often treated as a topic for later life, but awareness does not need to begin with fear. Basic prostate literacy helps men understand urinary changes, pelvic discomfort, ejaculation changes, and when to seek professional support.\n\nPersistent pelvic pain, blood in urine or semen, fever, painful urination, or sudden changes should be discussed with a qualified clinician. Education is useful, but it is not a replacement for medical care.\n\nRead next: /learn/what-happens-to-the-male-body-after-40.",
    publishedAt: "2026-02-11",
  }),
  article({
    title: "What Happens to the Male Body After 40",
    slug: "what-happens-to-the-male-body-after-40",
    excerpt: "A balanced view of recovery, hormones, stress, sleep, and body awareness after 40.",
    category: "Hormones & Performance",
    difficulty: "intermediate",
    estimatedReadingMinutes: 9,
    seoTitle: "What Happens to the Male Body After 40 | UNVEIL",
    seoDescription: "A nuanced educational guide to male wellness, recovery, hormones, and self-care after 40.",
    tags: ["male health after 40", "hormones", "recovery", "longevity"],
    content:
      "After 40, the body often becomes less forgiving of poor sleep, chronic stress, inconsistent training, alcohol, and neglected health checks. This does not mean decline is inevitable. It means feedback becomes clearer.\n\nHormones matter, but they are not the whole story. Cardiovascular health, metabolic health, recovery, emotional regulation, and relationship quality all shape how a man feels in his body.\n\nMen with persistent fatigue, erectile dysfunction, depression, severe anxiety, or sudden changes should seek professional support. Read next: /learn/your-body-is-not-instinct-it-is-a-system.",
    publishedAt: "2026-02-13",
  }),
  article({
    title: "Does Size Really Matter?",
    slug: "does-size-really-matter",
    excerpt: "A mature, non-vulgar look at confidence, perception, communication, and what intimacy research tends to miss.",
    category: "Intimacy Education",
    estimatedReadingMinutes: 6,
    seoTitle: "Does Size Really Matter? | UNVEIL",
    seoDescription: "A discreet educational article on male confidence, body perception, and intimacy communication.",
    tags: ["confidence", "body image", "intimacy education", "communication"],
    content:
      "The question of size is rarely only about anatomy. It often carries comparison, shame, unrealistic media exposure, and fear of not being enough. A more useful conversation includes confidence, communication, emotional safety, and understanding a partner's preferences without making assumptions.\n\nBody confidence is not built by denial. It is built by replacing vague fear with context, skill, and healthier communication. If anxiety about the body becomes obsessive or affects daily life, professional mental health support can help.\n\nRelated reading: /learn/talking-about-sex-is-a-learnable-skill.",
    publishedAt: "2026-02-15",
  }),
  article({
    title: "Premature Ejaculation: Causes and What Helps",
    slug: "premature-ejaculation-causes-and-what-helps",
    excerpt: "A calm educational overview of common contributing factors and support options.",
    category: "Sexual Health",
    contentType: "guide",
    difficulty: "intermediate",
    estimatedReadingMinutes: 9,
    seoTitle: "Premature Ejaculation: Causes and What Helps | UNVEIL",
    seoDescription: "A responsible educational guide to premature ejaculation, contributing factors, and support options.",
    tags: ["premature ejaculation", "pelvic floor", "nervous system", "sexual health"],
    content:
      "Premature ejaculation can be influenced by anxiety, arousal patterns, pelvic floor tension, relationship pressure, lack of body awareness, or medical factors. It is common, and it is not a character flaw.\n\nWhat helps depends on the person. Options may include education, pacing, breathing, pelvic floor relaxation, communication, and support from a qualified clinician or therapist. Avoid aggressive promises or miracle solutions.\n\nStart with context: /learn/the-pelvic-floor-the-muscle-group-nobody-told-you-about and /learn/performance-anxiety-is-a-nervous-system-issue.",
    publishedAt: "2026-02-17",
  }),
  article({
    title: "Talking About Sex Is a Learnable Skill",
    slug: "talking-about-sex-is-a-learnable-skill",
    excerpt: "A refined guide to communication, consent, honesty, and emotional maturity in intimate conversations.",
    category: "Dating & Communication",
    contentType: "guide",
    estimatedReadingMinutes: 7,
    seoTitle: "Talking About Sex Is a Learnable Skill | UNVEIL",
    seoDescription: "A mature educational guide to intimate communication, consent, and emotional intelligence.",
    tags: ["communication", "consent", "emotional intelligence", "dating"],
    content:
      "Many men are expected to communicate with confidence, but few are taught how. Intimate communication is a skill: naming preferences calmly, asking questions without pressure, listening without defensiveness, and respecting boundaries.\n\nGood communication reduces guessing. It also creates safety, which can change the entire experience of intimacy. The goal is not a script. The goal is presence and honesty.\n\nRelated reading: /learn/performance-anxiety-is-a-nervous-system-issue and /learn/does-size-really-matter.",
    publishedAt: "2026-02-19",
  }),
];

export const fallbackLeadMagnets: LeadMagnet[] = [
  {
    _id: "fallback-body-literacy-checklist",
    title: "UNVEIL Body Awareness Guide",
    slug: "body-literacy-checklist",
    description: "A calm starter guide for men who want a clearer relationship with body literacy, hygiene, and self-care.",
    coverImage: { url: "", alt: "Minimal UNVEIL lead magnet cover" },
    category: "Sexual Health",
    isPublished: true,
  },
  {
    _id: "fallback-7-hygiene-mistakes",
    title: "7 Hygiene Mistakes Modern Men Overlook",
    slug: "7-hygiene-mistakes",
    description: "A discreet educational guide to common hygiene gaps, written with calm practical clarity.",
    coverImage: { url: "", alt: "UNVEIL hygiene guide cover" },
    category: "Male Hygiene",
    isPublished: true,
  },
];

export function getFallbackProduct(slug: string) {
  return fallbackProducts.find((product) => product.slug === slug);
}

export function getFallbackBlogArticle(slug: string) {
  return fallbackBlogArticles.find((article) => article.slug === slug);
}

export function getFallbackLeadMagnet(slug: string) {
  return fallbackLeadMagnets.find((leadMagnet) => leadMagnet.slug === slug);
}
