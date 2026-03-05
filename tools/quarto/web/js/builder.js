/**
 * Template Builder - Interactive UI for editing report templates
 *
 * Loads templates.yaml, allows editing sections, and saves back to config
 */

let templatesConfig = null;
let currentSkill = null;
let originalConfig = null;

// ── Initialization ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[builder] DOM loaded, initializing...');
  await loadConfig();
  renderSkillsList();
  setupEventListeners();
  console.log('[builder] Initialization complete');
});

// ── API ───────────────────────────────────────────────────────────────────
async function loadConfig() {
  console.log('[builder] Loading config...');
  try {
    const response = await fetch('/builder-config');
    const data = await response.json();

    if (data.ok) {
      templatesConfig = jsyaml.load(data.config);
      originalConfig = data.config;
      console.log('[builder] Config loaded, skills:', Object.keys(templatesConfig.skills || {}));
    } else {
      showToast('Error', data.error || 'Failed to load config', 'danger');
    }
  } catch (err) {
    showToast('Error', 'Failed to load templates config', 'danger');
    console.error('[builder] Load config error:', err);
  }
}

async function saveConfig() {
  try {
    const configStr = jsyaml.dump(templatesConfig);
    const response = await fetch('/builder-save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: configStr }),
    });

    const data = await response.json();
    if (data.ok) {
      originalConfig = configStr;
      showToast('Saved', 'Template configuration saved successfully', 'success');
      return true;
    } else {
      showToast('Error', data.error || 'Failed to save config', 'danger');
      return false;
    }
  } catch (err) {
    showToast('Error', 'Failed to save configuration', 'danger');
    console.error(err);
    return false;
  }
}

async function regenerateTemplates() {
  try {
    const response = await fetch('/builder-regenerate', {
      method: 'POST',
    });

    const data = await response.json();
    if (data.ok) {
      showToast('Regenerated', 'All templates have been regenerated', 'success');
      return true;
    } else {
      showToast('Error', data.error || 'Failed to regenerate templates', 'danger');
      return false;
    }
  } catch (err) {
    showToast('Error', 'Failed to regenerate templates', 'danger');
    console.error(err);
    return false;
  }
}

// ── Rendering ──────────────────────────────────────────────────────────────
function renderSkillsList() {
  console.log('[builder] renderSkillsList called, templatesConfig:', !!templatesConfig);

  // Populate left pane skill select
  const skillSelect = document.getElementById('template-skill-select-left');
  console.log('[builder] renderSkillsList - skillSelect:', !!skillSelect, 'skills:', !!templatesConfig?.skills);
  if (skillSelect && templatesConfig?.skills) {
    skillSelect.innerHTML = '<option value="">Choose a skill...</option>';
    const skills = Object.entries(templatesConfig.skills);
    skills.forEach(([key, skill]) => {
      const opt = document.createElement('option');
      opt.value = key;
      const sectionCount = (skill.sections?.length || 0) + (skill.unique_sections?.length || 0);
      opt.textContent = `${skill.name} (${sectionCount} sections)`;
      skillSelect.appendChild(opt);
    });
    console.log('[builder] Added', skills.length, 'skills to dropdown');
  } else {
    console.log('[builder] Skipping - no skillSelect or no skills');
  }

  // Also populate preview pane skill select if exists
  const previewSkillSelect = document.getElementById('template-skill-select');
  // Already done above - same element
}

function populateSectionSelect(skillKey) {
  // Populate left dropdown
  const sectionSelectLeft = document.getElementById('template-section-select-left');
  // Populate right dropdown
  const sectionSelectRight = document.getElementById('template-section-select');

  const skill = templatesConfig.skills?.[skillKey];
  const options = ['<option value="">Choose a section...</option>', '<option value="frontmatter">Front Matter</option>'];

  if (skill) {
    // Add base sections
    const baseSections = templatesConfig.sections || {};
    (skill.sections || []).forEach(sectionId => {
      const section = baseSections[sectionId];
      if (section) {
        options.push(`<option value="base:${sectionId}">Base: ${section.name || sectionId}</option>`);
      }
    });

    // Add unique sections
    (skill.unique_sections || []).forEach(section => {
      options.push(`<option value="unique:${section.id}">Unique: ${section.name || section.id}</option>`);
    });
  }

  const html = options.join('');
  if (sectionSelectLeft) sectionSelectLeft.innerHTML = html;
  if (sectionSelectRight) sectionSelectRight.innerHTML = html;
}

function selectSkill(skillKey) {
  currentSkill = skillKey;

  // Update active state in both left and right pane selects
  const skillSelectLeft = document.getElementById('template-skill-select-left');
  const skillSelectRight = document.getElementById('template-skill-select');
  if (skillSelectLeft) skillSelectLeft.value = skillKey;
  if (skillSelectRight) skillSelectRight.value = skillKey;

  // Get skill config
  const skill = templatesConfig.skills?.[skillKey];
  if (!skill) return;

  // Show/hide containers - left pane (section select) and right pane (drag/drop)
  document.getElementById('section-select-container').style.display = 'block';
  document.getElementById('base-sections-container').style.display = 'block';
  document.getElementById('unique-sections-container').style.display = 'block';

  // Populate both section dropdowns
  populateSectionSelect(skillKey);

  // Hide editors until a section is selected
  document.getElementById('frontmatter-editor').style.display = 'none';
  document.getElementById('section-editor').style.display = 'none';

  // Render sections with drag-and-drop in right pane
  renderBaseSections(skill);
  renderUniqueSections(skill);
}

function renderBaseSections(skill) {
  const container = document.getElementById('base-sections');
  container.innerHTML = '';

  const baseSections = templatesConfig.sections || {};
  const sectionOrder = skill.sections || [];

  sectionOrder.forEach((sectionId, index) => {
    const section = baseSections[sectionId];
    if (!section) return;

    const item = createSectionItem(sectionId, section, true, index);
    container.appendChild(item);
  });

  setupDragAndDrop(container);
}

function renderUniqueSections(skill) {
  const container = document.getElementById('unique-sections');
  container.innerHTML = '';

  const uniqueSections = skill.unique_sections || [];

  uniqueSections.forEach((section, index) => {
    const item = createSectionItem(section.id, section, false, index, true);
    container.appendChild(item);
  });

  setupDragAndDrop(container);
}

function createSectionItem(id, section, isBase, index, isUnique = false) {
  const li = document.createElement('li');
  li.className = 'section-item';
  li.dataset.id = id;
  li.dataset.index = index;
  li.draggable = true;

  const required = isBase ? section.required : section.required;

  li.innerHTML = `
    <span class="drag-handle"><i class="bi bi-grip-vertical"></i></span>
    <div class="section-info">
      <div class="section-name">
        ${section.name}
        ${required ? '<span class="badge badge-required ms-1">Required</span>' : ''}
      </div>
      <div class="section-desc">${section.description || section.file || ''}</div>
    </div>
    <div class="form-check form-switch section-toggle">
      <input class="form-check-input" type="checkbox" ${required ? 'checked disabled' : ''}>
    </div>
    ${isUnique && !required ? `
      <button class="btn btn-sm btn-remove" title="Remove section">
        <i class="bi bi-trash"></i>
      </button>
    ` : ''}
  `;

  // Event listeners
  const checkbox = li.querySelector('.form-check-input');
  if (checkbox && !checkbox.disabled) {
    checkbox.addEventListener('change', () => {
      toggleSection(id, checkbox.checked, isUnique);
    });
  }

  const removeBtn = li.querySelector('.btn-remove');
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      removeUniqueSection(id);
    });
  }

  return li;
}

function updateConfigPreview() {
  if (!currentSkill || !templatesConfig) return;

  const skill = templatesConfig.skills[currentSkill];
  const preview = {
    skill: currentSkill,
    name: skill.name,
    sections: skill.sections,
    unique_sections: skill.unique_sections,
  };

  document.getElementById('config-preview').textContent = JSON.stringify(preview, null, 2);
}

// ── Section Management ────────────────────────────────────────────────────
function toggleSection(sectionId, enabled, isUnique) {
  if (!currentSkill || !templatesConfig) return;

  const skill = templatesConfig.skills[currentSkill];

  if (isUnique) {
    if (enabled) {
      // Add to unique sections if not already present
      const exists = skill.unique_sections.some(s => s.id === sectionId);
      if (!exists) {
        // Find section template from config
        skill.unique_sections.push({
          id: sectionId,
          name: sectionId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          file: `_${sectionId}.qmd`,
          description: 'Custom section',
          required: false,
          content_template: sectionId,
        });
      }
    } else {
      // Remove from unique sections
      skill.unique_sections = skill.unique_sections.filter(s => s.id !== sectionId);
    }
  }

  updateConfigPreview();
}

function removeUniqueSection(sectionId) {
  if (!currentSkill || !templatesConfig) return;

  const skill = templatesConfig.skills[currentSkill];
  skill.unique_sections = skill.unique_sections.filter(s => s.id !== sectionId);

  renderUniqueSections(skill);
  updateConfigPreview();
}

function addUniqueSection() {
  if (!currentSkill || !templatesConfig) return;

  // Show a simple prompt for the section name
  const name = prompt('Enter section name (e.g., "new-section"):');
  if (!name) return;

  const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const skill = templatesConfig.skills[currentSkill];

  // Check if already exists
  if (skill.unique_sections.some(s => s.id === id)) {
    showToast('Error', 'Section already exists', 'warning');
    return;
  }

  skill.unique_sections.push({
    id,
    name: name,
    file: `_${id}.qmd`,
    description: 'New custom section',
    required: false,
    content_template: id,
  });

  renderUniqueSections(skill);
  updateConfigPreview();
  showToast('Added', `Section "${name}" added`, 'success');
}

// ── Drag and Drop ─────────────────────────────────────────────────────────
function setupDragAndDrop(container) {
  let draggedItem = null;

  container.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('section-item')) {
      draggedItem = e.target;
      e.target.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    }
  });

  container.addEventListener('dragend', (e) => {
    if (e.target.classList.contains('section-item')) {
      e.target.classList.remove('dragging');
      container.querySelectorAll('.section-item').forEach(item => {
        item.classList.remove('dragging');
      });
    }
  });

  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const dragging = container.querySelector('.dragging');
    if (dragging) {
      if (afterElement == null) {
        container.appendChild(dragging);
      } else {
        container.insertBefore(dragging, afterElement);
      }
    }
  });

  container.addEventListener('drop', (e) => {
    e.preventDefault();
    updateSectionOrder();
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.section-item:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;

    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateSectionOrder() {
  if (!currentSkill || !templatesConfig) return;

  const skill = templatesConfig.skills[currentSkill];
  const baseList = document.getElementById('base-sections');
  const uniqueList = document.getElementById('unique-sections');

  // Update base sections order
  const newOrder = [...baseList.querySelectorAll('.section-item')].map(item => item.dataset.id);
  skill.sections = newOrder;

  // Update unique sections order
  const newUniqueOrder = [...uniqueList.querySelectorAll('.section-item')].map(item => item.dataset.id);
  skill.unique_sections = newUniqueOrder.map(id => skill.unique_sections.find(s => s.id === id));

  updateConfigPreview();
}

// ── Event Listeners ───────────────────────────────────────────────────────
function setupEventListeners() {
  // Save button
  document.getElementById('btn-save').addEventListener('click', async () => {
    const saved = await saveConfig();
    if (saved) {
      await regenerateTemplates();
    }
  });

  // Left pane: Skill select change
  const skillSelectLeft = document.getElementById('template-skill-select-left');
  if (skillSelectLeft) {
    skillSelectLeft.addEventListener('change', (e) => {
      const value = e.target.value;
      // Sync with right dropdown
      const skillSelectRight = document.getElementById('template-skill-select');
      if (skillSelectRight) skillSelectRight.value = value;

      if (value) {
        selectSkill(value);
      } else {
        resetTemplateView();
      }
    });
  }

  // Right pane: Skill select change
  const skillSelectRight = document.getElementById('template-skill-select');
  if (skillSelectRight) {
    skillSelectRight.addEventListener('change', (e) => {
      const value = e.target.value;
      // Sync with left dropdown
      if (skillSelectLeft) skillSelectLeft.value = value;

      if (value) {
        selectSkill(value);
      } else {
        resetTemplateView();
      }
    });
  }

  function resetTemplateView() {
    document.getElementById('section-select-container').style.display = 'none';
    document.getElementById('base-sections-container').style.display = 'none';
    document.getElementById('unique-sections-container').style.display = 'none';
    document.getElementById('frontmatter-editor').style.display = 'none';
    document.getElementById('section-editor').style.display = 'none';
  }

  // Left pane: Section select change
  // Left pane: Section select (just triggers right pane)
  const sectionSelectLeft = document.getElementById('template-section-select-left');
  if (sectionSelectLeft) {
    sectionSelectLeft.addEventListener('change', (e) => {
      const value = e.target.value;
      // Sync with right dropdown
      const rightSelect = document.getElementById('template-section-select');
      if (rightSelect) rightSelect.value = value;
      handleSectionChange(value);
    });
  }

  // Right pane: Section select
  const sectionSelectRight = document.getElementById('template-section-select');
  if (sectionSelectRight) {
    sectionSelectRight.addEventListener('change', (e) => {
      const value = e.target.value;
      // Sync with left dropdown
      if (sectionSelectLeft) sectionSelectLeft.value = value;
      handleSectionChange(value);
    });
  }

  // Handle section selection - show appropriate editor in right pane
  function handleSectionChange(value) {
    if (!value) {
      document.getElementById('frontmatter-editor').style.display = 'none';
      document.getElementById('section-editor').style.display = 'none';
      return;
    }

    if (value === 'frontmatter') {
      document.getElementById('frontmatter-editor').style.display = 'flex';
      document.getElementById('section-editor').style.display = 'none';
    } else {
      document.getElementById('frontmatter-editor').style.display = 'none';
      document.getElementById('section-editor').style.display = 'flex';
      const [type, sectionId] = value.split(':');
      loadSectionForEditing(type, sectionId);
    }
  }

  // Right pane: Save section button
  const saveSectionBtn = document.getElementById('btn-save-section');
  if (saveSectionBtn) {
    saveSectionBtn.addEventListener('click', () => {
      showToast('Saved', 'Section saved successfully', 'success');
    });
  }

  // Load Defaults (Keep Logo) button
  const loadDefaultsBtn = document.getElementById('btn-load-defaults');
  if (loadDefaultsBtn) {
    loadDefaultsBtn.addEventListener('click', async () => {
      try {
        const response = await fetch('/builder-load-defaults', { method: 'POST' });
        const data = await response.json();
        if (data.ok) {
          // Reload brand config (which now has defaults but keeps logo)
          if (typeof loadBrand === 'function') {
            await loadBrand();
          }
          showToast('Loaded', 'Default colors loaded (logo preserved)', 'success');
        } else {
          showToast('Error', data.error || 'Failed to load defaults', 'danger');
        }
      } catch (err) {
        showToast('Error', 'Failed to load defaults', 'danger');
      }
    });
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      document.getElementById('btn-save').click();
    }
  });
}

// Load section content for editing
function loadSectionForEditing(type, sectionId) {
  const skill = templatesConfig.skills?.[currentSkill];
  if (!skill) return;

  console.log('[loadSectionForEditing] type:', type, 'sectionId:', sectionId);

  let section = null;
  if (type === 'base') {
    section = templatesConfig.sections?.[sectionId];
    console.log('[loadSectionForEditing] base section:', section);
  } else if (type === 'unique') {
    section = skill.unique_sections?.find(s => s.id === sectionId);
    console.log('[loadSectionForEditing] unique section:', section);
  }

  if (section) {
    // Show right pane section editor
    document.getElementById('section-editor').style.display = 'flex';
    document.getElementById('section-content').value = JSON.stringify(section, null, 2);
    console.log('[loadSectionForEditing] Loaded section into right pane editor');
  } else {
    console.log('[loadSectionForEditing] Section not found!');
  }
}

// ── Utilities ─────────────────────────────────────────────────────────────
function showToast(title, message, type = 'info') {
  const toast = new bootstrap.Toast(document.getElementById('toast'));
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-body').textContent = message;

  const toastEl = document.getElementById('toast');
  toastEl.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info');
  toastEl.classList.add(`bg-${type}`, 'text-white');

  toast.show();
}

// YAML utilities - uses jsyaml from CDN (loaded in builder.html)
// jsyaml is available as a global
