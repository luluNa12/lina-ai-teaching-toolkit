/**
 * UI module — renders sections, binds events, and keeps the live preview
 * in sync with application state.
 *
 * Each section is rendered by a dedicated function that reads from config.
 * Adding a new section requires only a new renderer + a call in renderWorkspace.
 */

import {
  APP_VERSION,
  QUICK_STARTS,
  GRAPHIC_TYPES,
  OPTIONS,
  ICON_PREFERENCES,
  ACCESSIBILITY,
  PEDAGOGICAL,
  MODELS,
  DEFAULT_STATE
} from './config.js';
import { buildPrompt, getPromptStatus } from './prompt-builder.js';
import {
  loadSettings,
  saveSettings,
  loadPresets,
  upsertPreset,
  deletePreset,
  downloadText,
  copyToClipboard
} from './storage.js';

/** Application state — single source of truth */
let state = loadSettings();

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/** Apply theme class to <html> */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
  state.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#0f1419' : '#F2F8FC');
  }
}

/** Persist state and refresh the prompt preview */
function commit(partial = {}) {
  Object.assign(state, partial);
  saveSettings(state);
  updatePromptPreview();
  updateStatus();
}

/** Render the entire application shell */
export function renderApp() {
  applyTheme(state.theme || 'light');

  const app = $('#app');
  if (!app) return;

  app.innerHTML = `
    <a class="skip-link" href="#workspace">Skip to workspace</a>

    <header class="site-header">
      <div class="header-inner">
        <div class="brand">
          <p class="eyebrow">AI Teaching Toolkit</p>
          <h1>Lina's AI Teaching Toolkit</h1>
          <p class="tagline">AI-powered tools for creating instructional graphics, learning resources, classroom activities, and educational content.</p>
        </div>
        <div class="header-actions">
          <button type="button" class="btn btn-ghost btn-icon" id="btn-theme" aria-label="Toggle dark mode" title="Toggle dark / light mode">
            <span class="theme-icon" aria-hidden="true"></span>
          </button>
          <span class="version-badge">v${APP_VERSION}</span>
          <span class="for-educators">For Educators</span>
        </div>
      </div>
    </header>

    <main class="main-layout">
      <div class="workspace" id="workspace" tabindex="-1">
        <!-- Sections injected by renderWorkspace -->
      </div>

      <aside class="preview-panel" aria-label="Generated prompt preview">
        <div class="preview-header">
          <h2>The Generated Prompt</h2>
          <span class="model-tag" id="preview-model-tag"></span>
        </div>
        <div class="preview-body">
          <pre id="prompt-output" class="prompt-output" tabindex="0" role="region" aria-live="polite" aria-label="Live prompt text"></pre>
          <p class="preview-placeholder" id="preview-placeholder"></p>
        </div>
        <div class="preview-actions">
          <button type="button" class="btn btn-primary" id="btn-copy">Copy</button>
          <button type="button" class="btn btn-secondary" id="btn-download">Download .txt</button>
          <button type="button" class="btn btn-secondary" id="btn-reset">Reset</button>
        </div>
        <div class="preview-status" id="preview-status" aria-live="polite"></div>
      </aside>
    </main>

    <footer class="site-footer">
      <p>Built for instructional designers. Every selection reshapes the prompt in real time.</p>
      <p class="footer-meta">Modular · Accessible · Local-first</p>
    </footer>

    <div class="toast" id="toast" role="status" aria-live="polite" hidden></div>

    <div class="modal" id="preset-modal" hidden>
      <div class="modal-backdrop" data-close-modal></div>
      <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="preset-modal-title">
        <h2 id="preset-modal-title">Save Preset</h2>
        <label class="field-label" for="preset-name">Preset name</label>
        <input type="text" id="preset-name" class="field-input" placeholder="e.g. Biology Concept Maps – High School" maxlength="80" />
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" data-close-modal>Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-confirm-save-preset">Save</button>
        </div>
      </div>
    </div>
  `;

  renderWorkspace();
  bindGlobalEvents();
  updatePromptPreview();
  updateStatus();
}

/** Render all form sections into #workspace */
function renderWorkspace() {
  const workspace = $('#workspace');
  if (!workspace) return;

  workspace.innerHTML = `
    ${renderQuickStart()}
    ${renderSectionContent()}
    ${renderSectionGraphicType()}
    ${renderSectionVisuals()}
    ${renderSectionLayout()}
    ${renderSectionOutput()}
    ${renderSectionAccessibility()}
    ${renderSectionPedagogical()}
    ${renderSectionModel()}
    ${renderSectionNotes()}
    ${renderPresetBar()}
  `;

  bindSectionEvents();
}

/* ================================================================== */
/*  Section renderers                                                  */
/* ================================================================== */

function renderQuickStart() {
  const buttons = QUICK_STARTS.map(qs =>
    `<button type="button" class="chip chip-quick" data-quick="${qs.id}">${qs.label}</button>`
  ).join('');

  return `
    <section class="section quick-start" aria-label="Quick start templates">
      <div class="quick-start-row">
        <span class="quick-label">Quick start →</span>
        ${buttons}
      </div>
    </section>
  `;
}

function renderSectionContent() {
  const subjectOpts = OPTIONS.subjectArea.map(o =>
    `<option value="${o.value}" ${state.subjectArea === o.value ? 'selected' : ''}>${o.label}</option>`
  ).join('');
  const gradeOpts = OPTIONS.gradeLevel.map(o =>
    `<option value="${o.value}" ${state.gradeLevel === o.value ? 'selected' : ''}>${o.label}</option>`
  ).join('');
  const bloomOpts = OPTIONS.bloomLevel.map(o =>
    `<option value="${o.value}" ${state.bloomLevel === o.value ? 'selected' : ''}>${o.label}</option>`
  ).join('');

  return `
    <section class="section" id="section-content" aria-labelledby="heading-content">
      <div class="section-header">
        <h2 id="heading-content"><span class="section-num">§ 01</span> Content</h2>
        <p class="section-desc">what is being taught</p>
      </div>

      <div class="field-group">
        <label class="field-label" for="topic">Topic or Lesson Title <span class="req" aria-hidden="true">*</span></label>
        <input type="text" id="topic" class="field-input"
               placeholder="e.g., SQL Joins, OSI Model Layers, Mitochondrial Respiration"
               value="${escapeAttr(state.topic)}" autocomplete="off" />
      </div>

      <div class="field-row">
        <div class="field-group">
          <label class="field-label" for="subjectArea">Subject Area</label>
          <select id="subjectArea" class="field-select">${subjectOpts}</select>
        </div>
        <div class="field-group">
          <label class="field-label" for="gradeLevel">Grade / Skill Level</label>
          <select id="gradeLevel" class="field-select">${gradeOpts}</select>
        </div>
      </div>

      <div class="field-group">
        <label class="field-label" for="audience">Audience</label>
        <input type="text" id="audience" class="field-input"
               placeholder="e.g., 10th-grade biology students, adult professional learners"
               value="${escapeAttr(state.audience)}" />
      </div>

      <div class="field-group">
        <label class="field-label" for="learningObjective">Learning Objective</label>
        <textarea id="learningObjective" class="field-textarea" rows="2"
                  placeholder="By the end of viewing this graphic, the learner will be able to…">${escapeHtml(state.learningObjective)}</textarea>
      </div>

      <div class="field-group">
        <label class="field-label" for="bloomLevel">Bloom's Taxonomy Level</label>
        <select id="bloomLevel" class="field-select">${bloomOpts}</select>
      </div>
    </section>
  `;
}

function renderSectionGraphicType() {
  const cards = GRAPHIC_TYPES.map(g => {
    const selected = state.graphicType === g.id ? 'is-selected' : '';
    return `
      <button type="button" class="graphic-card ${selected}" data-graphic="${g.id}"
              aria-pressed="${state.graphicType === g.id}" title="${escapeAttr(g.description)}">
        <span class="graphic-title">${g.title}</span>
        <span class="graphic-subtitle">${g.subtitle}</span>
        <span class="graphic-desc">${g.description}</span>
      </button>
    `;
  }).join('');

  return `
    <section class="section" id="section-graphic-type" aria-labelledby="heading-graphic">
      <div class="section-header">
        <h2 id="heading-graphic"><span class="section-num">§ 02</span> Graphic Type</h2>
        <p class="section-desc">how the information is shaped</p>
      </div>
      <div class="graphic-grid" role="group" aria-label="Select graphic type">
        ${cards}
      </div>
    </section>
  `;
}

function renderSectionVisuals() {
  const styleOpts = OPTIONS.visualStyle.map(o =>
    `<option value="${o.value}" ${state.visualStyle === o.value ? 'selected' : ''}>${o.label}</option>`
  ).join('');
  const toneOpts = OPTIONS.tone.map(o =>
    `<option value="${o.value}" ${state.tone === o.value ? 'selected' : ''}>${o.label}</option>`
  ).join('');
  const colorOpts = OPTIONS.colorScheme.map(o =>
    `<option value="${o.value}" ${state.colorScheme === o.value ? 'selected' : ''}>${o.label}</option>`
  ).join('');
  const complexOpts = OPTIONS.complexity.map(o =>
    `<option value="${o.value}" ${state.complexity === o.value ? 'selected' : ''}>${o.label}</option>`
  ).join('');

  const iconChips = ICON_PREFERENCES.map(p => {
    const active = (state.iconPreferences || []).includes(p.id) ? 'is-active' : '';
    return `<button type="button" class="chip chip-toggle ${active}" data-icon="${p.id}" aria-pressed="${active ? 'true' : 'false'}">${p.label}</button>`;
  }).join('');

  return `
    <section class="section" id="section-visuals" aria-labelledby="heading-visuals">
      <div class="section-header">
        <h2 id="heading-visuals"><span class="section-num">§ 03</span> Visuals</h2>
        <p class="section-desc">aesthetic &amp; tone</p>
      </div>

      <div class="field-row">
        <div class="field-group">
          <label class="field-label" for="visualStyle">Visual Style</label>
          <select id="visualStyle" class="field-select">${styleOpts}</select>
        </div>
        <div class="field-group">
          <label class="field-label" for="tone">Tone</label>
          <select id="tone" class="field-select">${toneOpts}</select>
        </div>
      </div>

      <div class="field-row">
        <div class="field-group">
          <label class="field-label" for="colorScheme">Color Palette</label>
          <select id="colorScheme" class="field-select">${colorOpts}</select>
        </div>
        <div class="field-group">
          <label class="field-label" for="complexity">Complexity / Density</label>
          <select id="complexity" class="field-select">${complexOpts}</select>
        </div>
      </div>

      <div class="field-group">
        <span class="field-label" id="icon-pref-label">Icon &amp; Illustration Preference</span>
        <div class="chip-row" role="group" aria-labelledby="icon-pref-label">
          ${iconChips}
        </div>
      </div>
    </section>
  `;
}

function renderSectionLayout() {
  const sizeOpts = OPTIONS.sizePreset.map(o =>
    `<option value="${o.value}" ${state.sizePreset === o.value ? 'selected' : ''}>${o.label}</option>`
  ).join('');
  const orientOpts = OPTIONS.orientation.map(o =>
    `<option value="${o.value}" ${state.orientation === o.value ? 'selected' : ''}>${o.label}</option>`
  ).join('');
  const textOpts = OPTIONS.amountOfText.map(o =>
    `<option value="${o.value}" ${state.amountOfText === o.value ? 'selected' : ''}>${o.label}</option>`
  ).join('');

  return `
    <section class="section" id="section-layout" aria-labelledby="heading-layout">
      <div class="section-header">
        <h2 id="heading-layout"><span class="section-num">§ 04</span> Layout &amp; Image Size</h2>
        <p class="section-desc">physical &amp; spatial form</p>
      </div>

      <div class="field-group">
        <label class="field-label" for="sizePreset">Size Preset</label>
        <select id="sizePreset" class="field-select">${sizeOpts}</select>
      </div>

      <div class="field-row">
        <div class="field-group">
          <label class="field-label" for="orientation">Orientation</label>
          <select id="orientation" class="field-select">${orientOpts}</select>
        </div>
        <div class="field-group">
          <label class="field-label" for="amountOfText">Amount of Text</label>
          <select id="amountOfText" class="field-select">${textOpts}</select>
        </div>
      </div>
    </section>
  `;
}

function renderSectionOutput() {
  const formatOpts = OPTIONS.fileFormat.map(o =>
    `<option value="${o.value}" ${state.fileFormat === o.value ? 'selected' : ''}>${o.label}</option>`
  ).join('');
  const resOpts = OPTIONS.resolution.map(o =>
    `<option value="${o.value}" ${state.resolution === o.value ? 'selected' : ''}>${o.label}</option>`
  ).join('');

  return `
    <section class="section" id="section-output" aria-labelledby="heading-output">
      <div class="section-header">
        <h2 id="heading-output"><span class="section-num">§ 05</span> Output Format</h2>
        <p class="section-desc">technical deliverable</p>
      </div>

      <div class="field-row">
        <div class="field-group">
          <label class="field-label" for="fileFormat">File Format</label>
          <select id="fileFormat" class="field-select">${formatOpts}</select>
        </div>
        <div class="field-group">
          <label class="field-label" for="resolution">Resolution</label>
          <select id="resolution" class="field-select">${resOpts}</select>
        </div>
      </div>

      <div class="checkbox-row">
        <label class="checkbox-label">
          <input type="checkbox" id="transparentBg" ${state.transparentBg ? 'checked' : ''} />
          <span>Transparent background</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" id="safeMargins" ${state.safeMargins ? 'checked' : ''} />
          <span>Include safe margins / bleed area</span>
        </label>
      </div>
    </section>
  `;
}

function renderSectionAccessibility() {
  const checks = ACCESSIBILITY.map(p => {
    const checked = (state.accessibility || []).includes(p.id) ? 'checked' : '';
    return `
      <label class="checkbox-label">
        <input type="checkbox" data-a11y="${p.id}" ${checked} />
        <span>${p.label}</span>
      </label>
    `;
  }).join('');

  return `
    <section class="section" id="section-accessibility" aria-labelledby="heading-a11y">
      <div class="section-header">
        <h2 id="heading-a11y"><span class="section-num">§ 06</span> Accessibility</h2>
        <p class="section-desc">inclusive design</p>
      </div>
      <div class="checkbox-grid">
        ${checks}
      </div>
    </section>
  `;
}

function renderSectionPedagogical() {
  const checks = PEDAGOGICAL.map(p => {
    const checked = (state.pedagogical || []).includes(p.id) ? 'checked' : '';
    return `
      <label class="checkbox-label">
        <input type="checkbox" data-pedagogical="${p.id}" ${checked} />
        <span>${p.label}</span>
      </label>
    `;
  }).join('');

  return `
    <section class="section" id="section-pedagogical" aria-labelledby="heading-pedagogical">
      <div class="section-header">
        <h2 id="heading-pedagogical"><span class="section-num">§ 07</span> Pedagogical Constraints</h2>
        <p class="section-desc">rigor &amp; learning design</p>
      </div>
      <div class="checkbox-grid">
        ${checks}
      </div>
    </section>
  `;
}

function renderSectionModel() {
  const modelButtons = MODELS.map(m => {
    const active = state.model === m.id ? 'is-active' : '';
    return `
      <button type="button" class="model-card ${active}" data-model="${m.id}" aria-pressed="${state.model === m.id}">
        <span class="model-name">${m.name}</span>
        <span class="model-tagline">${m.tagline}</span>
      </button>
    `;
  }).join('');

  return `
    <section class="section" id="section-model" aria-labelledby="heading-model">
      <div class="section-header">
        <h2 id="heading-model"><span class="section-num">§ 08</span> Target Model</h2>
        <p class="section-desc">tailored phrasing</p>
      </div>
      <div class="model-grid" role="group" aria-label="Select target AI model">
        ${modelButtons}
      </div>
    </section>
  `;
}

function renderSectionNotes() {
  return `
    <section class="section" id="section-notes" aria-labelledby="heading-notes">
      <div class="section-header">
        <h2 id="heading-notes"><span class="section-num">§ 09</span> Additional Instructions</h2>
        <p class="section-desc">optional free-form guidance</p>
      </div>
      <div class="field-group">
        <label class="field-label" for="extraNotes">Extra instructions or constraints</label>
        <textarea id="extraNotes" class="field-textarea" rows="3"
                  placeholder="Any specific content points, must-include examples, brand colors, or other constraints…">${escapeHtml(state.extraNotes || '')}</textarea>
      </div>
    </section>
  `;
}

function renderPresetBar() {
  const presets = loadPresets();
  const options = presets.map(p =>
    `<option value="${p.id}">${escapeHtml(p.name)}</option>`
  ).join('');

  return `
    <section class="section preset-bar" aria-label="Presets">
      <div class="preset-controls">
        <button type="button" class="btn btn-secondary" id="btn-save-preset">Save Preset</button>
        <div class="preset-load-group">
          <label class="visually-hidden" for="preset-select">Load preset</label>
          <select id="preset-select" class="field-select">
            <option value="">— Load preset —</option>
            ${options}
          </select>
          <button type="button" class="btn btn-ghost btn-sm" id="btn-delete-preset" title="Delete selected preset" ${presets.length ? '' : 'disabled'}>Delete</button>
        </div>
      </div>
    </section>
  `;
}

/* ================================================================== */
/*  Event binding                                                      */
/* ================================================================== */

function bindGlobalEvents() {
  $('#btn-theme')?.addEventListener('click', () => {
    const next = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    commit({ theme: next });
  });

  $('#btn-copy')?.addEventListener('click', async () => {
    const text = buildPrompt(state);
    const ok = await copyToClipboard(text);
    showToast(ok ? 'Copied to clipboard' : 'Copy failed — select and copy manually');
  });

  $('#btn-download')?.addEventListener('click', () => {
    const text = buildPrompt(state);
    const safeName = (state.topic || 'instructional-graphic-prompt')
      .slice(0, 40)
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase() || 'prompt';
    downloadText(`${safeName}.txt`, text);
    showToast('Download started');
  });

  $('#btn-reset')?.addEventListener('click', () => {
    if (!confirm('Reset all fields to defaults? This cannot be undone.')) return;
    state = { ...DEFAULT_STATE, theme: state.theme };
    saveSettings(state);
    renderWorkspace();
    updatePromptPreview();
    updateStatus();
    showToast('Reset to defaults');
  });

  $$('[data-close-modal]').forEach(el => {
    el.addEventListener('click', closePresetModal);
  });

  $('#btn-confirm-save-preset')?.addEventListener('click', () => {
    const name = ($('#preset-name')?.value || '').trim();
    if (!name) {
      showToast('Please enter a preset name');
      return;
    }
    upsertPreset(name, state);
    closePresetModal();
    renderWorkspace();
    showToast(`Preset “${name}” saved`);
  });

  // Escape closes modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const modal = $('#preset-modal');
      if (modal && !modal.hidden) closePresetModal();
    }
  });
}

function bindSectionEvents() {
  // Quick starts
  $$('[data-quick]').forEach(btn => {
    btn.addEventListener('click', () => {
      const qs = QUICK_STARTS.find(q => q.id === btn.dataset.quick);
      if (!qs) return;
      commit({ ...qs.values });
      renderWorkspace();
      showToast(`Applied “${qs.label}” template`);
    });
  });

  // Text inputs & textareas
  ['topic', 'audience', 'learningObjective', 'extraNotes'].forEach(id => {
    const el = $(`#${id}`);
    if (!el) return;
    el.addEventListener('input', () => commit({ [id]: el.value }));
  });

  // Selects
  [
    'subjectArea', 'gradeLevel', 'bloomLevel', 'visualStyle', 'tone',
    'colorScheme', 'complexity', 'sizePreset', 'orientation',
    'amountOfText', 'fileFormat', 'resolution'
  ].forEach(id => {
    const el = $(`#${id}`);
    if (!el) return;
    el.addEventListener('change', () => commit({ [id]: el.value }));
  });

  // Output checkboxes
  $('#transparentBg')?.addEventListener('change', e => commit({ transparentBg: e.target.checked }));
  $('#safeMargins')?.addEventListener('change', e => commit({ safeMargins: e.target.checked }));

  // Accessibility checkboxes
  $$('[data-a11y]').forEach(cb => {
    cb.addEventListener('change', () => {
      const id = cb.dataset.a11y;
      let list = [...(state.accessibility || [])];
      if (cb.checked) {
        if (!list.includes(id)) list.push(id);
      } else {
        list = list.filter(x => x !== id);
      }
      commit({ accessibility: list });
    });
  });

  // Pedagogical checkboxes
  $$('[data-pedagogical]').forEach(cb => {
    cb.addEventListener('change', () => {
      const id = cb.dataset.pedagogical;
      let list = [...(state.pedagogical || [])];
      if (cb.checked) {
        if (!list.includes(id)) list.push(id);
      } else {
        list = list.filter(x => x !== id);
      }
      commit({ pedagogical: list });
    });
  });

  // Graphic type cards
  $$('[data-graphic]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.graphic;
      commit({ graphicType: state.graphicType === id ? null : id });
      $$('[data-graphic]').forEach(b => {
        const selected = b.dataset.graphic === state.graphicType;
        b.classList.toggle('is-selected', selected);
        b.setAttribute('aria-pressed', selected);
      });
    });
  });

  // Icon preference chips
  $$('[data-icon]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.icon;
      let list = [...(state.iconPreferences || [])];
      if (list.includes(id)) {
        list = list.filter(x => x !== id);
      } else {
        list.push(id);
      }
      commit({ iconPreferences: list });
      btn.classList.toggle('is-active');
      btn.setAttribute('aria-pressed', list.includes(id));
    });
  });

  // Model cards
  $$('[data-model]').forEach(btn => {
    btn.addEventListener('click', () => {
      commit({ model: btn.dataset.model });
      $$('[data-model]').forEach(b => {
        const active = b.dataset.model === state.model;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', active);
      });
      updateModelTag();
    });
  });

  // Preset actions
  $('#btn-save-preset')?.addEventListener('click', openPresetModal);

  $('#preset-select')?.addEventListener('change', e => {
    const id = e.target.value;
    if (!id) return;
    const presets = loadPresets();
    const preset = presets.find(p => p.id === id);
    if (!preset) return;
    state = { ...DEFAULT_STATE, ...preset.state, theme: state.theme };
    saveSettings(state);
    renderWorkspace();
    updatePromptPreview();
    updateStatus();
    showToast(`Loaded “${preset.name}”`);
  });

  $('#btn-delete-preset')?.addEventListener('click', () => {
    const select = $('#preset-select');
    const id = select?.value;
    if (!id) {
      showToast('Select a preset to delete');
      return;
    }
    const presets = loadPresets();
    const preset = presets.find(p => p.id === id);
    if (!preset) return;
    if (!confirm(`Delete preset “${preset.name}”?`)) return;
    deletePreset(id);
    renderWorkspace();
    showToast('Preset deleted');
  });
}

/* ================================================================== */
/*  Live preview                                                       */
/* ================================================================== */

function updatePromptPreview() {
  const output = $('#prompt-output');
  const placeholder = $('#preview-placeholder');
  if (!output) return;

  const text = buildPrompt(state);
  output.textContent = text;

  const status = getPromptStatus(state);
  if (placeholder) {
    if (status.level === 'empty') {
      placeholder.textContent = status.label + '. Your prompt will compose itself here.';
      placeholder.hidden = false;
      output.classList.add('is-empty');
    } else {
      placeholder.hidden = true;
      output.classList.remove('is-empty');
    }
  }

  updateModelTag();
}

function updateModelTag() {
  const tag = $('#preview-model-tag');
  if (!tag) return;
  const model = MODELS.find(m => m.id === state.model);
  tag.textContent = model ? `For ${model.name}` : '';
}

function updateStatus() {
  const el = $('#preview-status');
  if (!el) return;
  const status = getPromptStatus(state);
  el.textContent = status.label;
  el.dataset.level = status.level;
}

/* ================================================================== */
/*  Modal & toast                                                      */
/* ================================================================== */

function openPresetModal() {
  const modal = $('#preset-modal');
  const input = $('#preset-name');
  if (!modal) return;
  modal.hidden = false;
  if (input) {
    input.value = state.topic ? `${state.topic.slice(0, 40)} preset` : '';
    setTimeout(() => input.focus(), 50);
  }
}

function closePresetModal() {
  const modal = $('#preset-modal');
  if (modal) modal.hidden = true;
}

function showToast(message, duration = 2200) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.hidden = true;
  }, duration);
}

/* ================================================================== */
/*  Utilities                                                          */
/* ================================================================== */

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/'/g, '&#39;');
}
