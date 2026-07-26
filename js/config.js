/**
 * Configuration module — The Instructional Graphic Prompt Atelier
 * ----------------------------------------------------------------
 * Single source of truth for every option, model, and default.
 * To extend the app (new graphic types, colors, models, etc.),
 * edit only this file. The UI and prompt builder pick up changes
 * automatically.
 */

export const APP_VERSION = '1.0.0';
export const STORAGE_KEY = 'igpa-settings-v1';
export const PRESETS_KEY = 'igpa-presets-v1';

/* ------------------------------------------------------------------ */
/*  Quick-start templates                                              */
/* ------------------------------------------------------------------ */
export const QUICK_STARTS = [
  {
    id: 'classroom',
    label: 'Classroom Activity',
    values: {
      audience: 'K–12 students in a classroom setting',
      bloomLevel: 'understand',
      complexity: 'moderate',
      amountOfText: 'moderate-labels',
      pedagogical: ['factual-accuracy', 'clear-hierarchy'],
      accessibility: ['color-blind-safe', 'alt-text', 'readability-distance']
    }
  },
  {
    id: 'lecture',
    label: 'Lecture',
    values: {
      audience: 'College or adult learners in a lecture environment',
      bloomLevel: 'analyze',
      complexity: 'detailed',
      amountOfText: 'moderate-labels',
      pedagogical: ['factual-accuracy', 'clear-hierarchy'],
      accessibility: ['alt-text', 'readability-distance']
    }
  },
  {
    id: 'training',
    label: 'Training',
    values: {
      audience: 'Professional adult learners in corporate or skills training',
      bloomLevel: 'apply',
      complexity: 'moderate',
      amountOfText: 'key-terms',
      pedagogical: ['factual-accuracy', 'clear-hierarchy'],
      accessibility: ['color-blind-safe', 'readability-distance']
    }
  },
  {
    id: 'summary',
    label: 'Learning Summary',
    values: {
      audience: 'Learners reviewing or consolidating knowledge',
      bloomLevel: 'remember',
      complexity: 'minimal',
      amountOfText: 'key-terms',
      pedagogical: ['clear-hierarchy'],
      accessibility: ['readability-distance', 'alt-text']
    }
  }
];

/* ------------------------------------------------------------------ */
/*  Graphic types                                                      */
/* ------------------------------------------------------------------ */
export const GRAPHIC_TYPES = [
  {
    id: 'concept-map',
    title: 'Concept Map',
    subtitle: 'Show relationships',
    description: 'Connects ideas with labeled links to reveal how concepts interrelate.'
  },
  {
    id: 'flowchart',
    title: 'Flowchart',
    subtitle: 'Clarify process steps',
    description: 'Sequential decision-based steps showing how a process unfolds.'
  },
  {
    id: 'infographic',
    title: 'Infographic',
    subtitle: 'Combine data & narrative',
    description: 'Mixes statistics, illustrations, and short text into a scannable visual story.'
  },
  {
    id: 'timeline',
    title: 'Timeline',
    subtitle: 'Show chronology',
    description: 'Plots events along a horizontal or vertical axis to reveal order and pacing.'
  },
  {
    id: 'comparison',
    title: 'Comparison Chart',
    subtitle: 'Emphasize differences',
    description: 'Side-by-side or matrix layout that contrasts two or more items across attributes.'
  },
  {
    id: 'labeled-diagram',
    title: 'Labeled Diagram',
    subtitle: 'Identify parts',
    description: 'A clear illustration with callout labels pointing to each component.'
  },
  {
    id: 'cycle',
    title: 'Cycle Diagram',
    subtitle: 'Show repeating processes',
    description: 'Circular arrangement of stages that loop back to the beginning.'
  },
  {
    id: 'hierarchy',
    title: 'Hierarchy / Org Chart',
    subtitle: 'Show structure',
    description: 'Tree-like arrangement showing levels of authority, taxonomy, or containment.'
  },
  {
    id: 'venn',
    title: 'Venn Diagram',
    subtitle: 'Show overlap & intersection',
    description: 'Overlapping circles that reveal shared and distinct attributes.'
  },
  {
    id: 'matrix',
    title: '2×2 Matrix',
    subtitle: 'Categorize by two axes',
    description: 'Quadrant grid that classifies items along two intersecting dimensions.'
  },
  {
    id: 'mind-map',
    title: 'Mind Map',
    subtitle: 'Brainstorm & explore',
    description: 'Radial branching from a central topic, capturing free associations.'
  },
  {
    id: 'sequence',
    title: 'Sequence / Step-by-Step',
    subtitle: 'Demonstrate procedure',
    description: 'Numbered panels that show a linear how-to procedure.'
  },
  {
    id: 'anatomy',
    title: 'Anatomy / Cross-Section',
    subtitle: 'Reveal internal structure',
    description: 'Cutaway view exposing the internal workings of a subject.'
  },
  {
    id: 'data-viz',
    title: 'Data Visualization',
    subtitle: 'Display quantitative evidence',
    description: 'Charts, graphs, or plots conveying numeric information clearly.'
  },
  {
    id: 'visual-analogy',
    title: 'Visual Analogy',
    subtitle: 'Bridge unfamiliar to familiar',
    description: 'Pairs an abstract concept with a concrete, everyday metaphor.'
  },
  {
    id: 'reference-poster',
    title: 'Reference Poster',
    subtitle: 'At-a-glance teaching wall piece',
    description: 'Dense, visually rich poster designed to live on a classroom wall.'
  }
];

/* ------------------------------------------------------------------ */
/*  Select / dropdown option groups                                    */
/* ------------------------------------------------------------------ */
export const OPTIONS = {
  subjectArea: [
    { value: '', label: '— select —' },
    { value: 'science', label: 'Science' },
    { value: 'math', label: 'Mathematics' },
    { value: 'history', label: 'History / Social Studies' },
    { value: 'language-arts', label: 'Language Arts / Literacy' },
    { value: 'computer-science', label: 'Computer Science / IT' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'business', label: 'Business / Economics' },
    { value: 'health', label: 'Health / Medicine' },
    { value: 'arts', label: 'Arts / Design' },
    { value: 'world-languages', label: 'World Languages' },
    { value: 'career-tech', label: 'Career & Technical Education' },
    { value: 'other', label: 'Other / Interdisciplinary' }
  ],

  gradeLevel: [
    { value: '', label: '— select —' },
    { value: 'elementary', label: 'Elementary (K–5)' },
    { value: 'middle', label: 'Middle School (6–8)' },
    { value: 'high', label: 'High School (9–12)' },
    { value: 'college', label: 'College / University' },
    { value: 'adult', label: 'Adult / Professional' },
    { value: 'mixed', label: 'Mixed / Multi-level' }
  ],

  bloomLevel: [
    { value: '', label: '— select —' },
    { value: 'remember', label: 'Remember — recall facts and basic concepts' },
    { value: 'understand', label: 'Understand — explain ideas or concepts' },
    { value: 'apply', label: 'Apply — use information in new situations' },
    { value: 'analyze', label: 'Analyze — draw connections among ideas' },
    { value: 'evaluate', label: 'Evaluate — justify a decision or course of action' },
    { value: 'create', label: 'Create — produce new or original work' }
  ],

  visualStyle: [
    { value: 'flat-vector', label: 'Flat vector illustration' },
    { value: 'line-art', label: 'Clean line art' },
    { value: 'isometric', label: 'Isometric' },
    { value: 'hand-drawn', label: 'Hand-drawn / sketch' },
    { value: 'realistic', label: 'Semi-realistic illustration' },
    { value: 'minimal-geometric', label: 'Minimal geometric' },
    { value: 'infographic-modern', label: 'Modern infographic style' },
    { value: 'textbook', label: 'Classic textbook diagram' }
  ],

  tone: [
    { value: 'professional', label: 'Professional / formal' },
    { value: 'friendly', label: 'Friendly / approachable' },
    { value: 'playful', label: 'Playful / engaging' },
    { value: 'academic', label: 'Academic / scholarly' },
    { value: 'technical', label: 'Technical / precise' },
    { value: 'inspirational', label: 'Inspirational / motivational' }
  ],

  colorScheme: [
    { value: 'editorial-neutrals', label: 'Editorial neutrals (cream, ink, single accent)' },
    { value: 'cool-blues', label: 'Cool blues & grays' },
    { value: 'warm-earth', label: 'Warm earth tones' },
    { value: 'high-contrast', label: 'High-contrast (black, white, bold accent)' },
    { value: 'pastel', label: 'Soft pastels' },
    { value: 'vibrant', label: 'Vibrant multi-color' },
    { value: 'monochrome', label: 'Monochrome + one accent' },
    { value: 'brand-neutral', label: 'Brand-neutral educational palette' }
  ],

  complexity: [
    { value: 'minimal', label: 'Minimal — single concept, sparse' },
    { value: 'moderate', label: 'Moderate — clear structure, balanced' },
    { value: 'detailed', label: 'Detailed — rich but organized' },
    { value: 'dense', label: 'Dense — reference-level information' }
  ],

  sizePreset: [
    { value: 'us-letter-portrait', label: 'US Letter — 8.5 × 11 in (portrait)' },
    { value: 'us-letter-landscape', label: 'US Letter — 11 × 8.5 in (landscape)' },
    { value: 'a4-portrait', label: 'A4 — 210 × 297 mm (portrait)' },
    { value: 'a4-landscape', label: 'A4 — 297 × 210 mm (landscape)' },
    { value: 'slide-16-9', label: 'Presentation slide — 16:9' },
    { value: 'slide-4-3', label: 'Presentation slide — 4:3' },
    { value: 'square', label: 'Square — social / digital' },
    { value: 'poster-tabloid', label: 'Tabloid / Poster — 11 × 17 in' },
    { value: 'custom', label: 'Custom (describe in notes)' }
  ],

  orientation: [
    { value: 'as-preset', label: 'As specified by size preset' },
    { value: 'portrait', label: 'Portrait' },
    { value: 'landscape', label: 'Landscape' },
    { value: 'square', label: 'Square' }
  ],

  amountOfText: [
    { value: 'key-terms', label: 'Minimal labels — title + key terms only' },
    { value: 'moderate-labels', label: 'Moderate — short captions and labels' },
    { value: 'explanatory', label: 'Explanatory — brief supporting sentences' },
    { value: 'detailed', label: 'Detailed — paragraphs allowed where needed' }
  ],

  fileFormat: [
    { value: 'png', label: 'PNG — screen & presentation (transparency-capable)' },
    { value: 'svg', label: 'SVG — scalable vector' },
    { value: 'pdf', label: 'PDF — print-ready' },
    { value: 'jpg', label: 'JPG — photographic / web' },
    { value: 'webp', label: 'WebP — modern web' }
  ],

  resolution: [
    { value: '72', label: '72 DPI (screen)' },
    { value: '150', label: '150 DPI (good quality)' },
    { value: '300', label: '300 DPI (print quality)' },
    { value: '600', label: '600 DPI (high-end print)' }
  ]
};

/* ------------------------------------------------------------------ */
/*  Icon & illustration preference chips (multi-select)                */
/* ------------------------------------------------------------------ */
export const ICON_PREFERENCES = [
  { id: 'icons-only', label: 'Icons only' },
  { id: 'icons-illustrations', label: 'Icons + illustrations' },
  { id: 'people', label: 'Illustrations of people' },
  { id: 'abstract', label: 'Abstract shapes only' },
  { id: 'labeled-diagrams', label: 'Labeled diagrams' },
  { id: 'type-only', label: 'Type only' }
];

/* ------------------------------------------------------------------ */
/*  Accessibility options                                              */
/* ------------------------------------------------------------------ */
export const ACCESSIBILITY = [
  { id: 'color-blind-safe', label: 'Color-blind-safe palette' },
  { id: 'alt-text', label: 'Include alt-text description' },
  { id: 'readability-distance', label: 'Prioritize readability at distance' },
  { id: 'high-contrast', label: 'High-contrast text and shapes' },
  { id: 'large-labels', label: 'Large, legible labels' }
];

/* ------------------------------------------------------------------ */
/*  Pedagogical constraints                                            */
/* ------------------------------------------------------------------ */
export const PEDAGOGICAL = [
  { id: 'factual-accuracy', label: 'Enforce factual & technical accuracy' },
  { id: 'clear-hierarchy', label: 'Clear visual hierarchy' },
  { id: 'cite-sources', label: 'Cite sources in caption' },
  { id: 'age-appropriate', label: 'Age-appropriate content and imagery' },
  { id: 'scaffold-complexity', label: 'Scaffold complexity for the stated grade level' }
];

/* ------------------------------------------------------------------ */
/*  Target AI models                                                   */
/* ------------------------------------------------------------------ */
export const MODELS = [
  {
    id: 'claude',
    name: 'Claude',
    tagline: 'Structured · Anthropic',
    promptHint: 'Use precise, structured language. Prefer explicit constraints and numbered requirements. Claude responds well to clear role and output-format instructions.'
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    tagline: 'Conversational · OpenAI',
    promptHint: 'Use clear, conversational yet precise language. Explicitly request step-by-step reasoning when helpful and specify the desired output format.'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    tagline: 'Multimodal · Google',
    promptHint: 'Leverage multimodal strengths. Be explicit about visual composition, layout, and any reference to real-world educational contexts.'
  },
  {
    id: 'grok',
    name: 'Grok',
    tagline: 'Truth-seeking · xAI',
    promptHint: 'Be direct and precise. Emphasize accuracy, clarity, and practical usefulness. Avoid unnecessary flourish; favor concrete visual specifications.'
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    tagline: 'Research-first',
    promptHint: 'Emphasize accuracy and sourcing. Request citations or verification of factual content where appropriate.'
  },
  {
    id: 'generic',
    name: 'Generic / Other',
    tagline: 'Model-agnostic',
    promptHint: 'Write in clear, model-agnostic instructional-design language that works across most modern LLMs.'
  }
];

/* ------------------------------------------------------------------ */
/*  Default application state                                          */
/* ------------------------------------------------------------------ */
export const DEFAULT_STATE = {
  topic: '',
  subjectArea: '',
  gradeLevel: '',
  audience: '',
  learningObjective: '',
  bloomLevel: '',
  graphicType: null,
  visualStyle: 'flat-vector',
  tone: 'professional',
  colorScheme: 'editorial-neutrals',
  complexity: 'moderate',
  iconPreferences: ['icons-illustrations'],
  sizePreset: 'us-letter-portrait',
  orientation: 'as-preset',
  amountOfText: 'key-terms',
  fileFormat: 'png',
  resolution: '300',
  transparentBg: false,
  safeMargins: true,
  accessibility: ['color-blind-safe', 'alt-text', 'readability-distance'],
  pedagogical: ['factual-accuracy', 'clear-hierarchy'],
  model: 'claude',
  extraNotes: '',
  theme: 'light'
};
