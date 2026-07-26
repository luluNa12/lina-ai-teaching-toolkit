/**
 * Prompt Builder — composes the master instructional-graphic prompt
 * from the current application state.
 *
 * Designed so new fields can be added by extending the composition
 * functions without rewriting core logic.
 */

import {
  GRAPHIC_TYPES,
  OPTIONS,
  ICON_PREFERENCES,
  ACCESSIBILITY,
  PEDAGOGICAL,
  MODELS
} from './config.js';

/** Look up a label from an options list by value */
function labelOf(list, value) {
  const item = list.find(o => o.value === value);
  return item ? item.label : value || '';
}

/** Look up graphic type object */
function getGraphicType(id) {
  return GRAPHIC_TYPES.find(g => g.id === id) || null;
}

/** Look up model object */
function getModel(id) {
  return MODELS.find(m => m.id === id) || MODELS[MODELS.length - 1];
}

/**
 * Build the complete prompt string from state.
 * Returns a ready-to-copy, model-aware instructional design prompt.
 */
export function buildPrompt(state) {
  const lines = [];
  const model = getModel(state.model);
  const graphic = getGraphicType(state.graphicType);

  // --- Role & intent ---
  lines.push('You are an expert instructional designer and visual communication specialist. Create a detailed, classroom-ready instructional graphic based on the following specifications.');
  lines.push('');

  // --- Content core ---
  lines.push('## Content');
  if (state.topic?.trim()) {
    lines.push(`- Topic / Lesson Title: ${state.topic.trim()}`);
  } else {
    lines.push('- Topic / Lesson Title: [Please specify the topic]');
  }

  if (state.subjectArea) {
    lines.push(`- Subject Area: ${labelOf(OPTIONS.subjectArea, state.subjectArea)}`);
  }
  if (state.gradeLevel) {
    lines.push(`- Grade / Skill Level: ${labelOf(OPTIONS.gradeLevel, state.gradeLevel)}`);
  }
  if (state.audience?.trim()) {
    lines.push(`- Target Audience: ${state.audience.trim()}`);
  }
  if (state.learningObjective?.trim()) {
    lines.push(`- Learning Objective: By the end of viewing this graphic, the learner will be able to ${state.learningObjective.trim()}`);
  }
  if (state.bloomLevel) {
    lines.push(`- Bloom's Taxonomy Level: ${labelOf(OPTIONS.bloomLevel, state.bloomLevel)}`);
  }
  lines.push('');

  // --- Graphic type ---
  lines.push('## Graphic Type');
  if (graphic) {
    lines.push(`- Type: ${graphic.title}`);
    lines.push(`- Purpose: ${graphic.description}`);
    lines.push(`- Design intent: ${graphic.subtitle}`);
  } else {
    lines.push('- Type: [Select a graphic type]');
  }
  lines.push('');

  // --- Visual style ---
  lines.push('## Visual Style & Aesthetic');
  lines.push(`- Visual Style: ${labelOf(OPTIONS.visualStyle, state.visualStyle)}`);
  lines.push(`- Tone: ${labelOf(OPTIONS.tone, state.tone)}`);
  lines.push(`- Color Palette: ${labelOf(OPTIONS.colorScheme, state.colorScheme)}`);
  lines.push(`- Complexity / Density: ${labelOf(OPTIONS.complexity, state.complexity)}`);

  if (state.iconPreferences?.length) {
    const iconLabels = state.iconPreferences
      .map(id => ICON_PREFERENCES.find(p => p.id === id)?.label)
      .filter(Boolean);
    if (iconLabels.length) {
      lines.push(`- Icon & Illustration Preference: ${iconLabels.join('; ')}`);
    }
  }
  lines.push('');

  // --- Layout & size ---
  lines.push('## Layout & Image Size');
  lines.push(`- Size Preset: ${labelOf(OPTIONS.sizePreset, state.sizePreset)}`);
  lines.push(`- Orientation: ${labelOf(OPTIONS.orientation, state.orientation)}`);
  lines.push(`- Amount of Text: ${labelOf(OPTIONS.amountOfText, state.amountOfText)}`);
  lines.push('');

  // --- Output specs ---
  lines.push('## Output Format');
  lines.push(`- File Format: ${labelOf(OPTIONS.fileFormat, state.fileFormat)}`);
  lines.push(`- Resolution: ${labelOf(OPTIONS.resolution, state.resolution)}`);
  lines.push(`- Transparent Background: ${state.transparentBg ? 'Yes' : 'No'}`);
  lines.push(`- Include Safe Margins / Bleed Area: ${state.safeMargins ? 'Yes' : 'No'}`);
  lines.push('');

  // --- Accessibility ---
  const activeA11y = (state.accessibility || [])
    .map(id => ACCESSIBILITY.find(p => p.id === id)?.label)
    .filter(Boolean);

  if (activeA11y.length) {
    lines.push('## Accessibility');
    activeA11y.forEach(label => lines.push(`- ${label}`));
    lines.push('');
  }

  // --- Pedagogical constraints ---
  const activePed = (state.pedagogical || [])
    .map(id => PEDAGOGICAL.find(p => p.id === id)?.label)
    .filter(Boolean);

  if (activePed.length) {
    lines.push('## Pedagogical Constraints');
    activePed.forEach(label => lines.push(`- ${label}`));
    lines.push('');
  }

  // --- Extra notes ---
  if (state.extraNotes?.trim()) {
    lines.push('## Additional Instructions');
    lines.push(state.extraNotes.trim());
    lines.push('');
  }

  // --- Model-specific guidance ---
  lines.push('## Generation Instructions');
  lines.push(`Target model: ${model.name} (${model.tagline})`);
  lines.push(model.promptHint);
  lines.push('');
  lines.push('Produce a single, coherent, high-quality instructional graphic that fully satisfies every constraint above. Prioritize clarity, accuracy, and educational effectiveness. If any required detail is missing, make reasonable, research-based assumptions and note them briefly.');

  return lines.join('\n').trim();
}

/**
 * Returns a short status summary for the UI (completeness indicator).
 */
export function getPromptStatus(state) {
  const hasTopic = Boolean(state.topic?.trim());
  const hasType = Boolean(state.graphicType);
  const hasObjective = Boolean(state.learningObjective?.trim());

  if (hasTopic && hasType && hasObjective) {
    return { level: 'complete', label: 'Ready to generate' };
  }
  if (hasTopic && hasType) {
    return { level: 'partial', label: 'Add a learning objective for best results' };
  }
  if (hasTopic || hasType) {
    return { level: 'partial', label: 'Select a topic and graphic type' };
  }
  return {
    level: 'empty',
    label: 'Begin by entering a topic and selecting a graphic type'
  };
}
