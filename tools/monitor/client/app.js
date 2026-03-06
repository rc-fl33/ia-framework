/**
 * IA Framework Observability Dashboard
 *
 * Core functionality without ES module dependencies
 */

// ═══════════════════════════════════════════════════════════════
// State
// ═══════════════════════════════════════════════════════════════

let ws = null;
let editorInstance = null;
let currentFile = null;
let fileModified = null;
let isModified = false;
let events = [];
let fileTreeData = {};
let isPreviewMode = true;
let currentFileContent = '';
let currentFileType = 'markdown'; // markdown, mermaid, text, code, json, pdf, image
let isCodeEditMode = false;       // true when code/text editor is in edit mode
let expandedDirectories = new Set(); // Track expanded directories for persistence
let isLoadingFile = false; // Track if we're currently loading a file
let frameworkRoot = ''; // Absolute path to framework root (from server)

// File type icons
const FILE_TYPE_ICONS = {
  'markdown': '📝',
  'mermaid': '🔷',
  'code': '💻',
  'json': '📊',
  'text': '📄',
  'pdf': '📋',
  'image': '🖼️',
  'binary': '📦',
  'unknown': '📄'
};

// Language map for syntax highlighting
const LANGUAGE_MAP = {
  'js': 'javascript',
  'ts': 'typescript',
  'jsx': 'javascript',
  'tsx': 'typescript',
  'py': 'python',
  'sh': 'bash',
  'bash': 'bash',
  'zsh': 'bash',
  'json': 'json',
  'jsonl': 'json',
  'yaml': 'yaml',
  'yml': 'yaml',
  'md': 'markdown'
};

// ═══════════════════════════════════════════════════════════════
// Theme Management
// ═══════════════════════════════════════════════════════════════

function initTheme() {
  const saved = localStorage.getItem('ia-obs-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  document.getElementById('theme-select').value = saved;
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ia-obs-theme', theme);
  // Re-render Mermaid if it's currently visible
  if (currentFileType === 'mermaid') {
    var mmdTextarea = document.getElementById('mermaid-textarea');
    if (mmdTextarea) {
      renderMermaid(mmdTextarea.value);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// Font Size Management
// ═══════════════════════════════════════════════════════════════

function initFontSize() {
  const saved = localStorage.getItem('ia-obs-font-size') || 'medium';
  setFontSize(saved);
  document.getElementById('font-size-select').value = saved;
}

function setFontSize(size) {
  // Remove all font size classes
  document.documentElement.classList.remove('font-small', 'font-medium', 'font-large', 'font-xlarge');
  // Add the selected font size class
  document.documentElement.classList.add('font-' + size);
  localStorage.setItem('ia-obs-font-size', size);
}

// ═══════════════════════════════════════════════════════════════
// WebSocket Connection
// ═══════════════════════════════════════════════════════════════

function connect() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  ws = new WebSocket(`${protocol}//${window.location.host}/stream`);

  ws.onopen = () => {
    updateConnectionStatus(true);
  };

  ws.onclose = () => {
    updateConnectionStatus(false);
    setTimeout(connect, 3000);
  };

  ws.onerror = (err) => {
    console.error('WebSocket error:', err);
  };

  ws.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      handleMessage(message);
    } catch (err) {
      console.error('Failed to parse message:', err);
    }
  };
}

function updateConnectionStatus(connected) {
  const el = document.getElementById('connection-status');
  if (connected) {
    el.innerHTML = '<span class="status-dot"></span><span>Connected</span>';
    el.style.color = 'var(--accent-success)';
  } else {
    el.innerHTML = '<span class="status-dot" style="animation: none;"></span><span>Disconnected</span>';
    el.style.color = 'var(--accent-error)';
  }
}

function handleMessage(message) {
  switch (message.type) {
    case 'connected':
      if (message.payload.root) {
        frameworkRoot = message.payload.root.replace(/\/+$/, '');
      }
      if (message.payload.events) {
        events = message.payload.events;
        renderTimeline();
      }
      // Session stats removed - not needed
      break;

    case 'event':
      events.push(message.payload);
      renderTimeline();
      break;

    case 'session_update':
      // Session stats removed - not needed
      break;

    case 'file_change':
      // Smart refresh: only update the affected directory
      if (message.payload && message.payload.path) {
        handleFileChange(message.payload.path);
      }
      break;
  }
}

// ═══════════════════════════════════════════════════════════════
// Timeline
// ═══════════════════════════════════════════════════════════════

function renderTimeline() {
  const container = document.getElementById('timeline');

  if (events.length === 0) {
    container.innerHTML = '<div class="timeline-empty">Waiting for events...</div>';
    return;
  }

  const total = events.length;
  const recentEvents = events.slice(-100).reverse();

  container.innerHTML = recentEvents.map(function(event, j) {
    const eventIdx = total - 1 - j;
    const time = new Date(event.timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const toolClass = 'tool-' + event.tool.toLowerCase();
    let detail = '';
    let fullDetail = '';

    // Primary detail: file path or command
    if (event.file_path) {
      const fileName = event.file_path.split('/').pop();
      detail = fileName;
      fullDetail = event.file_path;
    } else if (event.command) {
      detail = event.command;
      fullDetail = event.command;
    }

    // Secondary context: operation details
    let contextHtml = '';
    if (event.context) {
      contextHtml = '<div class="timeline-event-context">' +
        escapeHtml(event.context) +
        '</div>';
    }

    return '<div class="timeline-event" data-event-idx="' + eventIdx + '" style="cursor:pointer;" title="Double-click to view full details">' +
      '<span class="timeline-event-time">' + time + '</span>' +
      '<span class="timeline-event-tool ' + toolClass + '">' + event.tool + '</span>' +
      '<div style="flex: 1; min-width: 0;">' +
        '<div class="timeline-event-detail" title="' + escapeHtml(fullDetail) + '">' +
          escapeHtml(detail) +
        '</div>' +
        contextHtml +
      '</div>' +
      '</div>';
  }).join('');
}

function openEventDetail(event) {
  if (event.file_path && !event.file_path.startsWith('glob:')) {
    var path = event.file_path;
    // Convert absolute path to relative if it's within the framework root
    if (frameworkRoot && path.startsWith(frameworkRoot + '/')) {
      path = path.slice(frameworkRoot.length + 1);
    }
    // If still absolute (outside framework root), show modal instead
    if (path.startsWith('/')) {
      showEventModal(event);
      return;
    }
    loadFile(path);
    return;
  }
  showEventModal(event);
}

function showEventModal(event) {
  // Remove any existing modal
  var existing = document.getElementById('event-detail-modal');
  if (existing) existing.remove();

  var time = new Date(event.timestamp).toLocaleString('en-US', {
    hour12: false, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  var rows = [
    ['Tool', event.tool],
    ['Time', time],
    ['Success', event.success ? 'Yes' : 'No'],
  ];
  if (event.agent)       rows.push(['Agent', event.agent]);
  if (event.duration_ms !== undefined) rows.push(['Duration', event.duration_ms + ' ms']);
  if (event.sessionId)   rows.push(['Session', event.sessionId]);
  if (event.file_path)   rows.push(['File', event.file_path]);
  if (event.command)     rows.push(['Command', event.command]);
  if (event.context)     rows.push(['Context', event.context]);

  var tableHtml = rows.map(function(row) {
    return '<tr>' +
      '<td style="padding:0.4rem 0.75rem 0.4rem 0;color:var(--text-secondary);white-space:nowrap;vertical-align:top;font-size:0.8rem;">' + escapeHtml(row[0]) + '</td>' +
      '<td style="padding:0.4rem 0 0.4rem 0.75rem;word-break:break-all;font-size:0.85rem;"><pre style="margin:0;white-space:pre-wrap;font-family:inherit;">' + escapeHtml(String(row[1])) + '</pre></td>' +
      '</tr>';
  }).join('');

  var overlay = document.createElement('div');
  overlay.id = 'event-detail-modal';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9000;display:flex;align-items:center;justify-content:center;';

  overlay.innerHTML =
    '<div style="background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:6px;padding:1.25rem 1.5rem;max-width:680px;width:90%;max-height:80vh;overflow-y:auto;box-shadow:0 8px 32px rgba(0,0,0,0.4);">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">' +
        '<span style="font-weight:600;font-size:0.95rem;">Event Detail — ' + escapeHtml(event.tool) + '</span>' +
        '<button id="event-modal-close" style="background:none;border:none;color:var(--text-secondary);font-size:1.25rem;cursor:pointer;padding:0 0.25rem;line-height:1;">×</button>' +
      '</div>' +
      '<table style="width:100%;border-collapse:collapse;">' + tableHtml + '</table>' +
    '</div>';

  document.body.appendChild(overlay);

  function closeModal() { overlay.remove(); }
  document.getElementById('event-modal-close').onclick = closeModal;
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', function onEsc(e) {
    if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', onEsc); }
  });
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}


// ═══════════════════════════════════════════════════════════════
// Session Stats (REMOVED - not needed)
// ═══════════════════════════════════════════════════════════════
// Session stats functionality removed to simplify UI and focus on file browser

// ═══════════════════════════════════════════════════════════════
// File Tree
// ═══════════════════════════════════════════════════════════════

/**
 * Reliably find a directory's children container.
 * Uses nextElementSibling when the item element is available to avoid ID
 * collisions — e.g. a folder named "foo-bar" and a nested path "foo/bar"
 * both produce the ID "tree-foo-bar" under the old replace(/\//g, '-') scheme.
 */
function getChildrenEl(path, itemElement) {
  if (itemElement) {
    var next = itemElement.nextElementSibling;
    return (next && next.classList.contains('file-tree-children')) ? next : null;
  }
  var item = document.querySelector('.file-tree-item.directory[data-dir="' + path + '"]');
  if (!item) return null;
  var next = item.nextElementSibling;
  return (next && next.classList.contains('file-tree-children')) ? next : null;
}

function loadFileTree() {
  const container = document.getElementById('file-tree');
  const roots = ['agents', 'commands', 'docs', 'hooks', 'methodologies', 'plans', 'private', 'sessions', 'skills', 'standards', 'tools'];

  let html = '';
  roots.forEach(function(root) {
    html += '<div class="file-tree-item directory" data-dir="' + root + '" style="position: relative;">' +
      '<span class="file-tree-icon">📁</span>' +
      '<span class="file-tree-name">' + root + '/</span>' +
      '<div class="file-tree-actions" style="position:absolute;right:4px;top:50%;transform:translateY(-50%);display:flex;gap:4px;">' +
        '<button class="file-tree-copy-btn" data-path="' + root + '" title="Copy path" style="background:var(--bg-tertiary);border:1px solid var(--border-color);border-radius:3px;padding:2px 6px;cursor:pointer;color:var(--text-primary);font-size:11px;">📋</button>' +
        '<button class="file-tree-delete-btn" data-path="' + root + '" data-type="directory" title="Delete folder" style="background:var(--bg-tertiary);border:1px solid var(--accent-error);border-radius:3px;padding:2px 6px;cursor:pointer;color:var(--accent-error);font-size:11px;">🗑️</button>' +
      '</div>' +
      '</div>' +
      '<div class="file-tree-children hidden" id="tree-' + root + '"></div>';
  });

  // Root files placeholder - will be loaded dynamically
  html += '<div id="tree-root-files"></div>';

  container.innerHTML = html;

  // Click/hover handlers managed by event delegation on #file-tree

  // Load root-level files dynamically
  loadRootFiles();
}

function loadRootFiles() {
  const rootFilesContainer = document.getElementById('tree-root-files');

  // Fetch root-level files from API
  return fetch('/api/files?path=')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // Filter for root-level files only (no slash in path)
      const rootFiles = data.filter(function(item) {
        return item.type === 'file' && !item.path.includes('/');
      });

      let html = '';

      rootFiles.forEach(function(file) {
        const icon = FILE_TYPE_ICONS[file.fileType] || '📄';
        html += '<div class="file-tree-item" data-file="' + file.name + '" style="position: relative;">' +
          '<span class="file-tree-icon">' + icon + '</span>' +
          '<span class="file-tree-name">' + file.name + '</span>' +
          '<button class="file-tree-copy-btn" data-path="' + file.name + '" title="Copy path" style="position:absolute;right:4px;top:50%;transform:translateY(-50%);background:var(--bg-tertiary);border:1px solid var(--border-color);border-radius:3px;padding:2px 6px;cursor:pointer;color:var(--text-primary);font-size:11px;">📋</button>' +
          '</div>';
      });

      rootFilesContainer.innerHTML = html;
      // Click/hover handlers managed by event delegation on #file-tree
    })
    .catch(function(err) {
      console.error('Failed to load root files:', err);
    });
}

function toggleDirectory(path, element) {
  console.log('toggleDirectory:', path);
  const childrenEl = getChildrenEl(path, element);

  if (!childrenEl) {
    console.error('Children element not found:', path);
    return;
  }

  if (childrenEl.classList.contains('hidden')) {
    currentDirectory = path;
    expandedDirectories.add(path);
    saveFileTreeState();

    // If cached, show immediately so the open feels instant
    if (fileTreeData[path]) {
      const depth = path.split('/').length;
      renderTreeChildren(childrenEl, fileTreeData[path], depth);
      childrenEl.classList.remove('hidden');
      element.querySelector('.file-tree-icon').textContent = '📂';
    }

    // Always fetch fresh data — updates silently if already shown
    fetch('/api/files?path=' + encodeURIComponent(path))
      .then(function(response) { return response.json(); })
      .then(function(data) {
        if (data.error) {
          console.error('API error:', data.error);
          return;
        }
        fileTreeData[path] = data;
        const depth = path.split('/').length;
        renderTreeChildren(childrenEl, data, depth);
        childrenEl.classList.remove('hidden');
        element.querySelector('.file-tree-icon').textContent = '📂';
      })
      .catch(function(err) {
        console.error('Failed to load directory:', err);
      });
  } else {
    childrenEl.classList.add('hidden');
    element.querySelector('.file-tree-icon').textContent = '📁';
    expandedDirectories.delete(path); // Remove from expanded state
    saveFileTreeState();
    if (currentDirectory === path) {
      currentDirectory = null; // Clear if closing the current directory
    }
  }
}

function renderTreeChildren(container, nodes, depth) {
  let html = '';

  nodes.forEach(function(node) {
    const indent = '<span class="file-tree-indent"></span>'.repeat(depth);

    if (node.type === 'directory') {
      const id = 'tree-' + node.path.replace(/\//g, '-');
      // Only show as expanded if data is actually cached — avoids "open but empty" state
      // after page reload where expandedDirectories is restored but fileTreeData is empty.
      const showExpanded = expandedDirectories.has(node.path) && !!fileTreeData[node.path];
      html += '<div class="file-tree-item directory" data-dir="' + node.path + '" style="position: relative;">' +
        indent +
        '<span class="file-tree-icon">' + (showExpanded ? '📂' : '📁') + '</span>' +
        '<span class="file-tree-name">' + node.name + '/</span>' +
        '<div class="file-tree-actions" style="position:absolute;right:4px;top:50%;transform:translateY(-50%);display:flex;gap:4px;">' +
          '<button class="file-tree-copy-btn" data-path="' + escapeHtml(node.path) + '" title="Copy path" style="background:var(--bg-tertiary);border:1px solid var(--border-color);border-radius:3px;padding:2px 6px;cursor:pointer;color:var(--text-primary);font-size:11px;">📋</button>' +
          '<button class="file-tree-delete-btn" data-path="' + escapeHtml(node.path) + '" data-type="directory" title="Delete folder" style="background:var(--bg-tertiary);border:1px solid var(--accent-error);border-radius:3px;padding:2px 6px;cursor:pointer;color:var(--accent-error);font-size:11px;">🗑️</button>' +
        '</div>' +
        '</div>' +
        '<div class="file-tree-children' + (showExpanded ? '' : ' hidden') + '" id="' + id + '"></div>';
    } else {
      const icon = node.fileType ? FILE_TYPE_ICONS[node.fileType] || '📄' : '📄';
      const isSelected = currentFile && node.path === currentFile;
      html += '<div class="file-tree-item' + (isSelected ? ' selected' : '') + '" data-file="' + node.path + '" style="position: relative;">' +
        indent +
        '<span class="file-tree-icon">' + icon + '</span>' +
        '<span class="file-tree-name">' + node.name + '</span>' +
        '<button class="file-tree-copy-btn" data-path="' + escapeHtml(node.path) + '" title="Copy path" style="position:absolute;right:4px;top:50%;transform:translateY(-50%);background:var(--bg-tertiary);border:1px solid var(--border-color);border-radius:3px;padding:2px 6px;cursor:pointer;color:var(--text-primary);font-size:11px;">📋</button>' +
        '</div>';
    }
  });

  container.innerHTML = html;

  // Re-expand nested directories that were previously open
  nodes.forEach(function(node) {
    if (node.type === 'directory' && expandedDirectories.has(node.path) && fileTreeData[node.path]) {
      var childrenEl = getChildrenEl(node.path, null);
      if (childrenEl) {
        var childDepth = node.path.split('/').length;
        renderTreeChildren(childrenEl, fileTreeData[node.path], childDepth);
      }
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// Markdown Preview/Edit Toggle
// ═══════════════════════════════════════════════════════════════

function renderMarkdownPreview(content) {
  const previewEl = document.getElementById('editor-preview');
  try {
    previewEl.innerHTML = marked.parse(content);
  } catch (err) {
    console.error('Markdown render error:', err);
    previewEl.innerHTML = '<pre>' + escapeHtml(content) + '</pre>';
  }
}

function toggleEditMode() {
  // Dispatch to the right toggle handler based on file type
  if (currentFileType === 'code' || currentFileType === 'json' ||
      currentFileType === 'text' || currentFileType === 'unknown') {
    toggleCodeEditMode();
    return;
  }

  // Markdown toggle
  const previewEl = document.getElementById('editor-preview');
  const editorEl = document.getElementById('editor-mount');
  const toggleBtn = document.getElementById('btn-toggle-mode');

  if (isPreviewMode) {
    // Switch to edit mode
    isPreviewMode = false;
    previewEl.style.display = 'none';
    editorEl.style.display = 'block';
    toggleBtn.textContent = 'Preview';
  } else {
    // Switch to preview mode
    isPreviewMode = true;
    const textarea = document.getElementById('editor-textarea');
    if (textarea) {
      currentFileContent = textarea.value;
    }
    previewEl.style.display = 'block';
    editorEl.style.display = 'none';
    toggleBtn.textContent = 'Edit';
    renderMarkdownPreview(currentFileContent);
  }
}

// ═══════════════════════════════════════════════════════════════
// Viewer Functions
// ═══════════════════════════════════════════════════════════════

function hideAllViewers() {
  document.getElementById('editor-preview').style.display = 'none';
  document.getElementById('editor-mount').style.display = 'none';
  document.getElementById('pdf-viewer').style.display = 'none';
  document.getElementById('code-editor').style.display = 'none';
  document.getElementById('code-viewer').style.display = 'none';
  document.getElementById('text-viewer').style.display = 'none';
  document.getElementById('mermaid-editor').style.display = 'none';
  document.getElementById('image-viewer').style.display = 'none';
}

function showViewer(type, path) {
  hideAllViewers();

  if (type === 'pdf') {
    const iframe = document.getElementById('pdf-viewer');
    iframe.src = '/api/file?path=' + encodeURIComponent(path);
    iframe.style.display = 'block';
  } else if (type === 'image') {
    const img = document.getElementById('image-viewer-content');
    img.src = '/api/file?path=' + encodeURIComponent(path);
    document.getElementById('image-viewer').style.display = 'block';
  }
}

function showCodeViewer(content, path) {
  hideAllViewers();

  const ext = path.split('.').pop().toLowerCase();
  const language = LANGUAGE_MAP[ext] || 'javascript';

  const codeEl = document.getElementById('code-viewer-content');
  codeEl.textContent = content;
  codeEl.className = 'language-' + language;

  // Apply syntax highlighting
  if (window.Prism) {
    Prism.highlightElement(codeEl);
  }

  document.getElementById('code-viewer').style.display = 'block';
}

function showTextViewer(content) {
  hideAllViewers();

  const textEl = document.getElementById('text-viewer-content');
  textEl.textContent = content;
  document.getElementById('text-viewer').style.display = 'block';
}

// ═══════════════════════════════════════════════════════════════
// Code / Text Editor
// ═══════════════════════════════════════════════════════════════

function showCodeEditor(content, path) {
  hideAllViewers();

  var textarea = document.getElementById('code-editor-textarea');
  var gutter = document.getElementById('code-editor-gutter');

  textarea.value = content;
  updateCodeGutter(textarea, gutter);

  // Sync scroll between gutter and textarea
  textarea.onscroll = function() {
    gutter.scrollTop = textarea.scrollTop;
  };

  // Update gutter as content changes
  textarea.oninput = function() {
    updateCodeGutter(textarea, gutter);
    if (!isModified) {
      isModified = true;
      updateTabModified(currentFile, true);
    }
  };

  // Tab key: insert spaces
  textarea.onkeydown = function(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      var start = textarea.selectionStart;
      var end = textarea.selectionEnd;
      var spaces = '  '; // 2 spaces
      textarea.value = textarea.value.substring(0, start) + spaces + textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      updateCodeGutter(textarea, gutter);
      if (!isModified) {
        isModified = true;
        updateTabModified(currentFile, true);
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveFile();
    }
  };

  document.getElementById('code-editor').style.display = 'flex';
  textarea.focus();
}

function updateCodeGutter(textarea, gutter) {
  var lineCount = textarea.value.split('\n').length;
  var lines = '';
  for (var i = 1; i <= lineCount; i++) {
    lines += i + '\n';
  }
  gutter.textContent = lines;
}

function toggleCodeEditMode() {
  isCodeEditMode = !isCodeEditMode;

  if (isCodeEditMode) {
    // Switch to edit mode — show code editor
    showCodeEditor(currentFileContent, currentFile);
    document.getElementById('btn-toggle-mode').textContent = 'View';
    document.getElementById('btn-save').style.display = 'inline-flex';
  } else {
    // Switch to view mode — re-read textarea and show viewer
    var textarea = document.getElementById('code-editor-textarea');
    if (textarea) {
      currentFileContent = textarea.value;
    }
    // text/unknown fall back to plain text viewer; code/json use syntax highlighting
    if (currentFileType === 'text' || currentFileType === 'unknown') {
      showTextViewer(currentFileContent);
    } else {
      showCodeViewer(currentFileContent, currentFile);
    }
    document.getElementById('btn-toggle-mode').textContent = 'Edit';
    document.getElementById('btn-save').style.display = 'none';
  }
}

// ═══════════════════════════════════════════════════════════════
// Mermaid Diagram Editor
// ═══════════════════════════════════════════════════════════════

// Debounce timer for mermaid re-render
var mermaidDebounceTimer = null;

function getMermaidTheme() {
  var style = getComputedStyle(document.documentElement);
  var themeVar = style.getPropertyValue('--mermaid-theme').trim();
  return themeVar || 'dark';
}

function showMermaidEditor(content) {
  hideAllViewers();

  var textarea = document.getElementById('mermaid-textarea');
  textarea.value = content;

  document.getElementById('mermaid-editor').style.display = 'flex';

  // Initial render
  renderMermaid(content);

  // Live preview on input with debounce
  textarea.oninput = function() {
    if (!isModified) {
      isModified = true;
      updateTabModified(currentFile, true);
    }
    clearTimeout(mermaidDebounceTimer);
    mermaidDebounceTimer = setTimeout(function() {
      renderMermaid(textarea.value);
    }, 400);
  };

  textarea.onkeydown = function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveFile();
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      var start = textarea.selectionStart;
      var end = textarea.selectionEnd;
      textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 2;
    }
  };
}

function renderMermaid(source) {
  var outputEl = document.getElementById('mermaid-output');
  var errorEl = document.getElementById('mermaid-error');

  if (!source || !source.trim()) {
    outputEl.innerHTML = '<span style="color: var(--text-muted); font-style: italic;">Enter Mermaid syntax to preview...</span>';
    errorEl.style.display = 'none';
    return;
  }

  var theme = getMermaidTheme();

  try {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme,
      securityLevel: 'loose',
      fontFamily: 'Menlo, Monaco, Courier New, monospace',
    });

    var uniqueId = 'mermaid-diagram-' + Date.now();
    mermaid.render(uniqueId, source).then(function(result) {
      outputEl.innerHTML = result.svg;
      errorEl.style.display = 'none';
    }).catch(function(err) {
      var msg = err && err.message ? err.message : String(err);
      errorEl.textContent = 'Syntax error: ' + msg;
      errorEl.style.display = 'block';
    });
  } catch (err) {
    var msg = err && err.message ? err.message : String(err);
    errorEl.textContent = 'Render error: ' + msg;
    errorEl.style.display = 'block';
  }
}

function exportMermaidSvg() {
  var outputEl = document.getElementById('mermaid-output');
  var svg = outputEl.querySelector('svg');

  if (!svg) {
    showToast('No diagram to export — render a valid diagram first', 'error');
    return;
  }

  // Serialize SVG
  var serializer = new XMLSerializer();
  var svgString = serializer.serializeToString(svg);
  var blob = new Blob([svgString], { type: 'image/svg+xml' });
  var url = URL.createObjectURL(blob);

  var fileName = currentFile
    ? currentFile.split('/').pop().replace(/\.(mmd|mermaid)$/, '') + '.svg'
    : 'diagram.svg';

  var link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(function() { URL.revokeObjectURL(url); }, 1000);

  showToast('SVG exported: ' + fileName);
}

function openMermaidEditor() {
  // Open Mermaid Live Editor in a new tab
  // Note: The Live Editor runs on localhost:8080
  window.open('http://localhost:8080', '_blank');
  showToast('Opening Mermaid Live Editor...');
}

function updateToolbar(fileType) {
  const btnEdit = document.getElementById('btn-toggle-mode');
  const btnSave = document.getElementById('btn-save');
  const exportDropdown = document.getElementById('export-dropdown');
  const btnExportSvg = document.getElementById('btn-export-svg');
  const btnOpenMermaid = document.getElementById('btn-open-mermaid');
  const btnDelete = document.getElementById('btn-delete');

  // Reset all
  btnEdit.style.display = 'none';
  btnSave.style.display = 'none';
  exportDropdown.style.display = 'none';
  btnExportSvg.style.display = 'none';
  btnOpenMermaid.style.display = 'none';
  closeExportMenu();

  if (fileType === 'markdown') {
    btnEdit.style.display = 'inline-flex';
    btnSave.style.display = 'inline-flex';
    exportDropdown.style.display = 'inline-block';
  } else if (fileType === 'mermaid') {
    // Mermaid: always in split edit mode, save + export SVG + open in editor
    btnSave.style.display = 'inline-flex';
    btnExportSvg.style.display = 'inline-flex';
    btnOpenMermaid.style.display = 'inline-flex';
  } else if (fileType === 'code' || fileType === 'json' || fileType === 'text' || fileType === 'unknown') {
    // Code/text: toggle edit mode, save when editing
    btnEdit.style.display = 'inline-flex';
    btnEdit.textContent = isCodeEditMode ? 'View' : 'Edit';
    if (isCodeEditMode) {
      btnSave.style.display = 'inline-flex';
    }
  }

  // Delete button is always visible for all file types
  btnDelete.style.display = 'inline-flex';
}

function closeExportMenu() {
  var menu = document.getElementById('export-menu');
  if (menu) menu.style.display = 'none';
}

function toggleExportMenu(e) {
  e.stopPropagation();
  var menu = document.getElementById('export-menu');
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// ═══════════════════════════════════════════════════════════════
// Clipboard & Utility Functions
// ═══════════════════════════════════════════════════════════════

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function() {
      showToast('Path copied to clipboard');
    }).catch(function(err) {
      console.error('Failed to copy:', err);
      showToast('Failed to copy path', 'error');
    });
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast('Path copied to clipboard');
    } catch (err) {
      console.error('Fallback copy failed:', err);
      showToast('Failed to copy path', 'error');
    }
    document.body.removeChild(textarea);
  }
}

// Check if a file is a supported markdown file (.md or .qmd)
function isMarkdownFile(path) {
  return path.endsWith('.md') || path.endsWith('.qmd');
}

// Get base filename without extension
function getBaseFilename(path) {
  return path.replace(/\.(md|qmd)$/, '');
}

function showToast(message, type) {
  type = type || 'success';
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = message;
  toast.style.cssText = 'position:fixed;bottom:2rem;right:2rem;padding:0.75rem 1rem;' +
    'background:' + (type === 'error' ? 'var(--accent-error)' : 'var(--accent-success)') + ';' +
    'color:white;border-radius:4px;z-index:10000;animation:slideIn 0.3s ease;';
  document.body.appendChild(toast);
  setTimeout(function() {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(function() {
      document.body.removeChild(toast);
    }, 300);
  }, 2000);
}

// ═══════════════════════════════════════════════════════════════
// File Loading & Editor
// ═══════════════════════════════════════════════════════════════

function loadFile(path) {
  console.log('loadFile:', path);

  // Set loading flag to prevent refresh interruption
  isLoadingFile = true;

  fetch('/api/file?path=' + encodeURIComponent(path))
    .then(function(response) {
      if (!response.ok) {
        // Check if this is a binary file (PDF or image)
        const contentType = response.headers.get('Content-Type');
        if (contentType && (contentType.includes('pdf') || contentType.includes('image'))) {
          // Handle binary files
          currentFile = path;
          currentFileType = contentType.includes('pdf') ? 'pdf' : 'image';
          isModified = false;
          document.getElementById('editor-path').textContent = path;
          document.getElementById('btn-copy-path').style.display = 'inline-flex';
          showEditorPanel();
          showViewer(currentFileType, path);
          updateToolbar(currentFileType);
          addTab(path);
          saveFileTreeState();
          highlightSelectedFile(path);
          isLoadingFile = false;
          return;
        }
        return response.json().then(function(err) {
          throw new Error(err.error || 'Unknown error');
        });
      }

      // Check if response is JSON (text-based files)
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        // Binary file - PDF or image
        currentFile = path;
        currentFileType = contentType.includes('pdf') ? 'pdf' : 'image';
        isModified = false;
        document.getElementById('editor-path').textContent = path;
        document.getElementById('btn-copy-path').style.display = 'inline-flex';
        showEditorPanel();
        showViewer(currentFileType, path);
        updateToolbar(currentFileType);
        addTab(path);
        saveFileTreeState();
        highlightSelectedFile(path);
        isLoadingFile = false;
      }
    })
    .then(function(data) {
      if (!data) return; // Binary file already handled

      currentFile = path;
      fileModified = data.modified;
      currentFileType = data.fileType || 'text';
      isModified = false;

      document.getElementById('editor-path').textContent = path;
      document.getElementById('btn-copy-path').style.display = 'inline-flex';
      showEditorPanel();

      // Route to appropriate viewer
      if (currentFileType === 'markdown') {
        createEditor(data.content, path);
      } else if (currentFileType === 'mermaid') {
        isCodeEditMode = false;
        showMermaidEditor(data.content);
      } else if (currentFileType === 'code' || currentFileType === 'json') {
        isCodeEditMode = false;
        showCodeViewer(data.content, path);
      } else {
        // text / unknown — show as read-only by default
        isCodeEditMode = false;
        showTextViewer(data.content);
      }

      updateToolbar(currentFileType);
      addTab(path);
      saveFileTreeState();
      highlightSelectedFile(path);

      // Clear loading flag
      isLoadingFile = false;
    })
    .catch(function(err) {
      console.error('Failed to load file:', err);
      alert('Failed to load file: ' + err.message + '\nPath: ' + path);

      // Clear loading flag on error too
      isLoadingFile = false;
    });
}

function createEditor(content, filePath) {
  // Hide non-markdown viewers only
  document.getElementById('pdf-viewer').style.display = 'none';
  document.getElementById('code-editor').style.display = 'none';
  document.getElementById('code-viewer').style.display = 'none';
  document.getElementById('text-viewer').style.display = 'none';
  document.getElementById('mermaid-editor').style.display = 'none';
  document.getElementById('image-viewer').style.display = 'none';

  const mount = document.getElementById('editor-mount');
  const previewEl = document.getElementById('editor-preview');

  currentFileContent = content;
  isPreviewMode = true;

  // Simple textarea editor (works without CodeMirror)
  mount.innerHTML = '<textarea id="editor-textarea" spellcheck="false">' +
    escapeHtml(content) + '</textarea>';

  const textarea = document.getElementById('editor-textarea');
  textarea.style.cssText = 'width:100%;height:100%;background:var(--bg-primary);color:var(--text-primary);' +
    'border:none;padding:1rem;font-family:Menlo,Monaco,monospace;font-size:0.875rem;resize:none;outline:none;';

  textarea.oninput = function() {
    if (!isModified) {
      isModified = true;
      updateTabModified(currentFile, true);
    }
  };

  // Ctrl+S to save
  textarea.onkeydown = function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveFile();
    }
  };

  // Double-click to edit
  previewEl.ondblclick = function() {
    if (isPreviewMode) {
      toggleEditMode();
      textarea.focus();
    }
  };

  // Show preview by default
  mount.style.display = 'none';
  previewEl.style.display = 'block';
  renderMarkdownPreview(content);
  document.getElementById('btn-toggle-mode').textContent = 'Edit';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function saveFile() {
  if (!currentFile) return;

  // Determine which textarea to read from based on file type
  var content;
  if (currentFileType === 'mermaid') {
    var mmdTextarea = document.getElementById('mermaid-textarea');
    if (!mmdTextarea) return;
    content = mmdTextarea.value;
  } else if (currentFileType === 'code' || currentFileType === 'json' ||
             currentFileType === 'text' || currentFileType === 'unknown') {
    var codeTextarea = document.getElementById('code-editor-textarea');
    if (!codeTextarea) return;
    content = codeTextarea.value;
  } else {
    // markdown
    var mdTextarea = document.getElementById('editor-textarea');
    if (!mdTextarea) return;
    content = mdTextarea.value;
  }

  fetch('/api/file', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: currentFile,
      content: content,
      expectedModified: fileModified
    })
  })
  .then(function(response) { return response.json(); })
  .then(function(data) {
    if (data.conflict) {
      if (confirm('File was modified externally. Overwrite?')) {
        fetch('/api/file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: currentFile, content: content })
        })
        .then(function(r) { return r.json(); })
        .then(function(d) {
          if (d.success) {
            fileModified = d.modified;
            isModified = false;
            updateTabModified(currentFile, false);
            currentFileContent = content;
            if (currentFileType === 'markdown' && !isPreviewMode) {
              toggleEditMode();
            } else {
              showToast('Saved');
            }
          }
        });
      }
    } else if (data.success) {
      fileModified = data.modified;
      isModified = false;
      updateTabModified(currentFile, false);
      currentFileContent = content;
      console.log('File saved:', currentFile);
      if (currentFileType === 'markdown' && !isPreviewMode) {
        toggleEditMode();
      } else {
        showToast('Saved');
      }
    } else {
      alert('Failed to save file: ' + (data.error || 'Unknown error'));
    }
  })
  .catch(function(err) {
    console.error('Save error:', err);
    alert('Failed to save file');
  });
}

function deleteFile() {
  if (!currentFile) {
    alert('No file open');
    return;
  }

  // Confirm deletion
  if (!confirm('Are you sure you want to delete this file?\n\n' + currentFile + '\n\nThis action cannot be undone.')) {
    return;
  }

  fetch('/api/file?path=' + encodeURIComponent(currentFile), {
    method: 'DELETE'
  })
  .then(function(response) { return response.json(); })
  .then(function(data) {
    if (data.success) {
      console.log('File deleted:', currentFile);

      // Get parent directory to refresh
      var pathParts = currentFile.split('/');
      if (pathParts.length > 1) {
        pathParts.pop(); // Remove filename
        var parentDir = pathParts.join('/');
        refreshSingleDirectory(parentDir);
      } else {
        // Root level file - refresh root files
        loadRootFiles();
      }

      // Close the tab and clear current file
      closeTab(currentFile);
      currentFile = null;
      showToast('File deleted successfully');
    } else {
      showToast('Failed to delete file: ' + (data.error || 'Unknown error'), 'error');
    }
  })
  .catch(function(err) {
    console.error('Delete error:', err);
    showToast('Failed to delete file', 'error');
  });
}

function deletePathItem(path, type) {
  // Confirm deletion
  var itemType = type === 'directory' ? 'folder' : 'file';
  var warningMsg = type === 'directory'
    ? 'Are you sure you want to delete this folder and ALL its contents?\n\n' + path + '\n\nThis action cannot be undone and will delete all files and subfolders!'
    : 'Are you sure you want to delete this file?\n\n' + path + '\n\nThis action cannot be undone.';

  if (!confirm(warningMsg)) {
    return;
  }

  var endpoint = type === 'directory' ? '/api/directory' : '/api/file';

  fetch(endpoint + '?path=' + encodeURIComponent(path), {
    method: 'DELETE'
  })
  .then(function(response) { return response.json(); })
  .then(function(data) {
    if (data.success) {
      console.log(itemType + ' deleted:', path);
      showToast(itemType.charAt(0).toUpperCase() + itemType.slice(1) + ' deleted successfully');

      // If it's the currently open file, close it
      if (currentFile === path) {
        closeTab(currentFile);
        currentFile = null;
      }

      // Smart refresh: only update the parent directory
      var pathParts = path.split('/');
      if (pathParts.length > 1) {
        // Remove the deleted item name to get parent directory
        pathParts.pop();
        var parentDir = pathParts.join('/');

        // If deleting a directory, also remove it from expanded directories
        if (type === 'directory') {
          expandedDirectories.delete(path);
          saveFileTreeState();
        }

        // Refresh only the parent directory
        refreshSingleDirectory(parentDir);
      } else {
        // Root level item - refresh root files
        loadRootFiles();
      }
    } else {
      showToast('Failed to delete ' + itemType + ': ' + (data.error || 'Unknown error'), 'error');
    }
  })
  .catch(function(err) {
    console.error('Delete error:', err);
    showToast('Failed to delete ' + itemType, 'error');
  });
}

function exportPdf() {
  closeExportMenu();
  if (!currentFile) { showToast('No file open', 'error'); return; }
  if (!isMarkdownFile(currentFile)) { showToast('Only markdown files (.md or .qmd) can be exported', 'error'); return; }

  var btn = document.getElementById('btn-export-pdf');
  var originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span style="display:inline-block;animation:spin 1s linear infinite;">⏳</span> Generating...';

  fetch('/api/download-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: currentFile }),
  })
    .then(function(response) {
      if (!response.ok) {
        return response.json().then(function(d) { throw new Error(d.error || 'Export failed'); });
      }
      return response.blob();
    })
    .then(function(blob) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = getBaseFilename(currentFile.split('/').pop()) + '.pdf';
      a.click();
      URL.revokeObjectURL(url);
      showToast('PDF ready — download started');
    })
    .catch(function(err) { showToast('PDF export failed: ' + err.message, 'error'); })

function exportPdfViaHtml() {
  closeExportMenu();
  if (!currentFile) { showToast('No file open', 'error'); return; }
  if (!isMarkdownFile(currentFile)) { showToast('Only markdown files (.md or .qmd) can be exported', 'error'); return; }

  var btn = document.getElementById('btn-export-pdf-via-html');
  var originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span style="display:inline-block;animation:spin 1s linear infinite;">⏳</span> Generating...';

  fetch('/api/download-pdf-via-html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: currentFile }),
  })
    .then(function(response) {
      if (!response.ok) {
        return response.json().then(function(d) { throw new Error(d.error || 'Export failed'); });
      }
      return response.blob();
    })
    .then(function(blob) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = getBaseFilename(currentFile.split('/').pop()) + '.pdf';
      a.click();
      URL.revokeObjectURL(url);
      showToast('PDF (HTML Style) ready — download started');
    })
    .catch(function(err) { showToast('PDF export failed: ' + err.message, 'error'); })
    .finally(function() { btn.disabled = false; btn.innerHTML = originalText; });
}
    .finally(function() { btn.disabled = false; btn.innerHTML = originalText; });
}

function exportHtml() {
  closeExportMenu();
  if (!currentFile) {
    showToast('No file open', 'error');
    return;
  }

  if (!isMarkdownFile(currentFile)) {
    showToast('Only markdown files can be exported to HTML', 'error');
    return;
  }

  var btn = document.getElementById('btn-export-html');
  var originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span style="display: inline-block; animation: spin 1s linear infinite;">⏳</span> Exporting...';

  fetch('/api/download-html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: currentFile })
  })
  .then(function(response) {
    if (!response.ok) {
      return response.json().then(function(d) { throw new Error(d.error || 'Export failed'); });
    }
    return response.blob();
  })
  .then(function(blob) {
    btn.disabled = false;
    btn.innerHTML = originalText;
    var filename = getBaseFilename(currentFile.split('/').pop()) + '.html';
    triggerDownload(blob, filename, 'text/html');
    showToast('HTML ready — open in browser, print to PDF if needed', 'success');
  })
  .catch(function(err) {
    btn.disabled = false;
    btn.innerHTML = originalText;
    console.error('Export error:', err);
    showToast('Failed to export HTML: ' + err.message, 'error');
  });
}

function exportDocx() {
  closeExportMenu();
  if (!currentFile) {
    showToast('No file open', 'error');
    return;
  }

  if (!isMarkdownFile(currentFile)) {
    showToast('Only markdown files can be exported to Word', 'error');
    return;
  }

  var btn = document.getElementById('btn-export-docx');
  var originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span style="display: inline-block; animation: spin 1s linear infinite;">⏳</span> Exporting...';

  fetch('/api/download-docx', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: currentFile })
  })
  .then(function(response) {
    if (!response.ok) {
      return response.json().then(function(d) { throw new Error(d.error || 'Export failed'); });
    }
    return response.blob();
  })
  .then(function(blob) {
    btn.disabled = false;
    btn.innerHTML = originalText;
    var filename = getBaseFilename(currentFile.split('/').pop()) + '.docx';
    triggerDownload(blob, filename, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    showToast('Word document ready — saving...', 'success');
  })
  .catch(function(err) {
    btn.disabled = false;
    btn.innerHTML = originalText;
    console.error('Export error:', err);
    showToast('Failed to export Word document: ' + err.message, 'error');
  });
}

function triggerDownload(blob, filename, mimeType) {
  // Use File System Access API for a real "Save As" dialog when available
  if (window.showSaveFilePicker) {
    var ext = filename.split('.').pop();
    var opts = {
      suggestedName: filename,
      types: [{ description: 'Document', accept: {} }],
    };
    opts.types[0].accept[mimeType] = ['.' + ext];
    window.showSaveFilePicker(opts)
      .then(function(fileHandle) { return fileHandle.createWritable(); })
      .then(function(writable) {
        return writable.write(blob).then(function() { return writable.close(); });
      })
      .catch(function(err) {
        // User cancelled or API unavailable — fall back to link download
        if (err.name !== 'AbortError') {
          blobLinkDownload(blob, filename);
        }
      });
  } else {
    blobLinkDownload(blob, filename);
  }
}

function blobLinkDownload(blob, filename) {
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function() { URL.revokeObjectURL(url); }, 10000);
}

// ═══════════════════════════════════════════════════════════════
// Tabs
// ═══════════════════════════════════════════════════════════════

function addTab(path) {
  const tabBar = document.getElementById('tab-bar');
  const existing = tabBar.querySelector('[data-path="' + path + '"]');

  if (existing) {
    activateTab(existing);
    return;
  }

  const name = path.split('/').pop();
  const tab = document.createElement('div');
  tab.className = 'tab';
  tab.dataset.path = path;
  tab.dataset.tab = 'editor';
  tab.innerHTML = '<span class="tab-modified hidden"></span>' +
    '<span>' + name + '</span>' +
    '<span class="tab-close">×</span>';

  tab.onclick = function(e) {
    if (e.target.classList.contains('tab-close')) {
      e.stopPropagation();
      closeTab(path);
    } else {
      loadFile(path);
    }
  };

  // Insert before tab-actions
  const tabActions = tabBar.querySelector('.tab-actions');
  if (tabActions) {
    tabBar.insertBefore(tab, tabActions);
  } else {
    tabBar.appendChild(tab);
  }

  activateTab(tab);
  updateTabActions();
}

function activateTab(tab) {
  const tabBar = document.getElementById('tab-bar');
  tabBar.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
  tab.classList.add('active');

  const tabType = tab.dataset.tab;
  document.getElementById('panel-timeline').classList.toggle('hidden', tabType !== 'timeline');
  document.getElementById('panel-editor').classList.toggle('hidden', tabType !== 'editor');
  const studioPanel = document.getElementById('panel-studio');
  if (studioPanel) studioPanel.classList.toggle('hidden', tabType !== 'studio');
  if (tabType === 'studio' && typeof Studio !== 'undefined') Studio.init();
}

function closeTab(path) {
  const tabBar = document.getElementById('tab-bar');
  const tab = tabBar.querySelector('[data-path="' + path + '"]');

  if (tab) {
    tab.remove();

    if (currentFile === path) {
      currentFile = null;
      document.getElementById('panel-editor').classList.add('hidden');
      document.getElementById('panel-timeline').classList.remove('hidden');

      const timelineTab = tabBar.querySelector('[data-tab="timeline"]');
      if (timelineTab) {
        tabBar.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
        timelineTab.classList.add('active');
      }

      // Clear selection highlight
      document.querySelectorAll('.file-tree-item').forEach(function(el) {
        el.classList.remove('selected');
      });

      // Clear saved file state
      localStorage.removeItem('ia-obs-current-file');
    }

    updateTabActions();
  }
}

function updateTabActions() {
  const tabBar = document.getElementById('tab-bar');
  const fileTabs = tabBar.querySelectorAll('.tab[data-path]');
  const btnCloseOther = document.getElementById('btn-close-other-tabs');
  const btnCloseAll = document.getElementById('btn-close-all-tabs');

  // Show buttons if there are file tabs open
  if (fileTabs.length > 0) {
    btnCloseAll.style.display = 'flex';
    // Only show "close other" if there are 2+ tabs
    btnCloseOther.style.display = fileTabs.length > 1 ? 'flex' : 'none';
  } else {
    btnCloseAll.style.display = 'none';
    btnCloseOther.style.display = 'none';
  }
}

function closeOtherTabs() {
  const tabBar = document.getElementById('tab-bar');
  const fileTabs = Array.from(tabBar.querySelectorAll('.tab[data-path]'));

  // Keep only the current tab if it exists
  fileTabs.forEach(function(tab) {
    const path = tab.dataset.path;
    if (path && path !== currentFile) {
      tab.remove();
    }
  });

  updateTabActions();
  showToast('Closed other tabs');
}

function closeAllTabs() {
  const tabBar = document.getElementById('tab-bar');
  const fileTabs = Array.from(tabBar.querySelectorAll('.tab[data-path]'));

  fileTabs.forEach(function(tab) {
    tab.remove();
  });

  // Return to timeline view
  currentFile = null;
  document.getElementById('panel-editor').classList.add('hidden');
  document.getElementById('panel-timeline').classList.remove('hidden');

  const timelineTab = tabBar.querySelector('[data-tab="timeline"]');
  if (timelineTab) {
    tabBar.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
    timelineTab.classList.add('active');
  }

  updateTabActions();
  showToast('Closed all tabs');
}

function updateTabModified(path, modified) {
  const tabBar = document.getElementById('tab-bar');
  const tab = tabBar.querySelector('[data-path="' + path + '"]');

  if (tab) {
    const indicator = tab.querySelector('.tab-modified');
    indicator.classList.toggle('hidden', !modified);
  }
}

function showEditorPanel() {
  document.getElementById('panel-timeline').classList.add('hidden');
  document.getElementById('panel-editor').classList.remove('hidden');
}

// ═══════════════════════════════════════════════════════════════
// File Browser Auto-Refresh
// ═══════════════════════════════════════════════════════════════

let currentDirectory = null;

function saveFileTreeState() {
  try {
    localStorage.setItem('ia-obs-expanded-dirs', JSON.stringify(Array.from(expandedDirectories)));
    if (currentFile) {
      localStorage.setItem('ia-obs-current-file', currentFile);
    }
  } catch (err) {
    console.error('Failed to save file tree state:', err);
  }
}

function loadFileTreeState() {
  try {
    const savedExpanded = localStorage.getItem('ia-obs-expanded-dirs');
    if (savedExpanded) {
      expandedDirectories = new Set(JSON.parse(savedExpanded));
    }
    const savedFile = localStorage.getItem('ia-obs-current-file');
    return savedFile;
  } catch (err) {
    console.error('Failed to load file tree state:', err);
    return null;
  }
}

function restoreExpandedDirectories() {
  expandedDirectories.forEach(function(path) {
    const element = document.querySelector('.file-tree-item.directory[data-dir="' + path + '"]');
    if (element) {
      // Don't trigger the full toggle, just restore the visual state
      const childrenEl = getChildrenEl(path, element);
      if (childrenEl && fileTreeData[path]) {
        const depth = path.split('/').length;
        renderTreeChildren(childrenEl, fileTreeData[path], depth);
        childrenEl.classList.remove('hidden');
        element.querySelector('.file-tree-icon').textContent = '📂';
      }
    }
  });
}

/**
 * Smart file change handler - only refresh affected directory
 */
function handleFileChange(changedPath) {
  // Don't refresh during active file loading
  if (isLoadingFile) {
    console.log('Skipping refresh - file load in progress');
    return;
  }

  // Skip noisy directories that users rarely browse during work
  const skipDirs = ['sessions/', '.git/', 'node_modules/'];
  for (const skip of skipDirs) {
    if (changedPath.startsWith(skip)) {
      return; // Silently skip refresh for these directories
    }
  }

  // Extract the directory path (parent of the changed file)
  const parts = changedPath.split('/');
  let dirPath = '';

  if (parts.length > 1) {
    // If it's a file in a subdirectory, get the parent directory
    parts.pop(); // Remove filename
    dirPath = parts.join('/');
  } else {
    // Root-level file changed
    loadRootFiles();
    return;
  }

  // Only refresh if this directory is currently expanded
  if (expandedDirectories.has(dirPath)) {
    console.log('Refreshing directory:', dirPath);
    refreshSingleDirectory(dirPath);
  }
}

// Click/hover handlers managed by event delegation on #file-tree (see DOMContentLoaded)

/**
 * Refresh a single directory without touching others
 */
function refreshSingleDirectory(path) {
  fetch('/api/files?path=' + encodeURIComponent(path))
    .then(function(response) { return response.json(); })
    .then(function(data) {
      if (data.error) {
        console.error('Failed to refresh directory:', data.error);
        return;
      }

      // Update the file tree data
      fileTreeData[path] = data;

      // Find and re-render just this directory's children
      const dirElement = document.querySelector('.file-tree-item[data-dir="' + path + '"]');
      if (dirElement) {
        const childrenEl = dirElement.nextElementSibling;
        if (childrenEl && childrenEl.classList.contains('file-tree-children')) {
          const depth = path.split('/').length;
          renderTreeChildren(childrenEl, data, depth);
        }
      }
    })
    .catch(function(err) {
      console.error('Failed to refresh directory:', err);
    });
}

function refreshCurrentDirectory() {
  // Always refresh root files
  loadRootFiles();

  // Refresh all expanded directories to preserve state
  const dirsToRefresh = Array.from(expandedDirectories);
  dirsToRefresh.forEach(function(path) {
    fetch('/api/files?path=' + encodeURIComponent(path))
      .then(function(response) { return response.json(); })
      .then(function(data) {
        if (data.error) {
          console.error('API error:', data.error);
          return;
        }
        fileTreeData[path] = data;
        const childrenEl = getChildrenEl(path, null);
        if (childrenEl && !childrenEl.classList.contains('hidden')) {
          const depth = path.split('/').length;
          renderTreeChildren(childrenEl, data, depth);
        }
      })
      .catch(function(err) {
        console.error('Failed to refresh directory:', err);
      });
  });

  // Re-highlight the current file if it's still open
  if (currentFile) {
    setTimeout(function() {
      highlightSelectedFile(currentFile);
    }, 100);
  }
}

function highlightSelectedFile(filePath) {
  // Remove previous highlights
  document.querySelectorAll('.file-tree-item').forEach(function(el) {
    el.classList.remove('selected');
  });

  // Add highlight to current file
  const fileElement = document.querySelector('.file-tree-item[data-file="' + filePath + '"]');
  if (fileElement) {
    fileElement.classList.add('selected');
  }
}

// ═══════════════════════════════════════════════════════════════
// Event Listeners
// ═══════════════════════════════════════════════════════════════

// Auto-refresh interval (30 seconds) - only refresh expanded directories
let autoRefreshInterval = null;

function startAutoRefresh() {
  if (autoRefreshInterval) return; // Already running

  autoRefreshInterval = setInterval(function() {
    // Only refresh if not currently loading a file
    if (isLoadingFile) {
      return;
    }

    // Refresh all expanded directories
    expandedDirectories.forEach(function(path) {
      fetch('/api/files?path=' + encodeURIComponent(path))
        .then(function(response) { return response.json(); })
        .then(function(data) {
          if (data.error) return;
          fileTreeData[path] = data;
          var childrenEl = getChildrenEl(path, null);
          if (childrenEl && !childrenEl.classList.contains('hidden')) {
            var depth = path.split('/').length;
            renderTreeChildren(childrenEl, data, depth);
          }
        })
        .catch(function() {
          // Silently fail - network issues shouldn't spam logs
        });
    });

    // Also refresh root-level files
    loadRootFiles();
  }, 30000); // 30 seconds
}

document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  initFontSize();
  connect();

  // Load saved file tree state
  const savedFile = loadFileTreeState();

  loadFileTree();

  // Event delegation for file tree — survives innerHTML rebuilds
  document.getElementById('file-tree').addEventListener('click', function(e) {
    // Copy button
    var copyBtn = e.target.closest('.file-tree-copy-btn');
    if (copyBtn) {
      e.stopPropagation();
      e.preventDefault();
      if (copyBtn.dataset.path) copyToClipboard(copyBtn.dataset.path);
      return;
    }

    // Delete button
    var deleteBtn = e.target.closest('.file-tree-delete-btn');
    if (deleteBtn) {
      e.stopPropagation();
      e.preventDefault();
      if (deleteBtn.dataset.path) deletePathItem(deleteBtn.dataset.path, deleteBtn.dataset.type);
      return;
    }

    // Directory or file item
    var item = e.target.closest('.file-tree-item');
    if (!item) return;

    e.stopPropagation();
    if (item.classList.contains('directory') && item.dataset.dir) {
      toggleDirectory(item.dataset.dir, item);
    } else if (item.dataset.file) {
      loadFile(item.dataset.file);
    }
  });

  // Start auto-refresh after initial load
  startAutoRefresh();

  // Restore expanded directories and selected file
  if (savedFile) {
    setTimeout(function() {
      restoreExpandedDirectories();
      loadFile(savedFile);
    }, 100);
  }

  document.getElementById('theme-select').onchange = function(e) {
    setTheme(e.target.value);
  };

  document.getElementById('font-size-select').onchange = function(e) {
    setFontSize(e.target.value);
  };

  document.getElementById('btn-toggle-mode').onclick = toggleEditMode;
  document.getElementById('btn-save').onclick = saveFile;
  document.getElementById('btn-export-toggle').onclick = toggleExportMenu;
  const btnPdf = document.getElementById('btn-export-pdf');
  if (btnPdf) btnPdf.onclick = exportPdf;
  const btnPdfHtml = document.getElementById('btn-export-pdf-via-html');
  if (btnPdfHtml) btnPdfHtml.onclick = exportPdfViaHtml;
  document.getElementById('btn-export-html').onclick = exportHtml;
  document.getElementById('btn-export-docx').onclick = exportDocx;
  document.getElementById('btn-export-svg').onclick = exportMermaidSvg;
  document.getElementById('btn-open-mermaid').onclick = openMermaidEditor;
  document.getElementById('btn-delete').onclick = deleteFile;
  document.addEventListener('click', closeExportMenu);
  document.getElementById('btn-copy-path').onclick = function() {
    if (currentFile) {
      copyToClipboard(currentFile);
    }
  };

  document.getElementById('btn-close-other-tabs').onclick = closeOtherTabs;
  document.getElementById('btn-close-all-tabs').onclick = closeAllTabs;
  document.querySelector('[data-tab="timeline"]').onclick = function() {
    activateTab(this);
  };

  // Double-click any activity item for full context
  document.getElementById('timeline').addEventListener('dblclick', function(e) {
    var row = e.target.closest('.timeline-event');
    if (!row) return;
    var idx = parseInt(row.dataset.eventIdx, 10);
    if (isNaN(idx) || idx < 0 || idx >= events.length) return;
    openEventDetail(events[idx]);
  });

  document.onkeydown = function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveFile();
    }
  };

  // Initialize resizers
  initSidebarResizer();
  initMermaidResizer();
});

console.log('IA Observability Dashboard loaded');

// ═══════════════════════════════════════════════════════════════
// Sidebar Horizontal Resizer
// ═══════════════════════════════════════════════════════════════

function initSidebarResizer() {
  const resizer = document.getElementById('sidebar-resizer');
  const sidebar = document.getElementById('sidebar');

  if (!resizer || !sidebar) {
    console.error('Sidebar resizer elements not found');
    return;
  }

  function initResize(e) {
    window.addEventListener('mousemove', resize, false);
    window.addEventListener('mouseup', stopResize, false);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }

  function resize(e) {
    const newWidth = e.clientX - sidebar.offsetLeft;
    const minWidth = 200;
    const maxWidth = 600;

    if (newWidth >= minWidth && newWidth <= maxWidth) {
      sidebar.style.width = newWidth + 'px';
    }
  }

  function stopResize(e) {
    window.removeEventListener('mousemove', resize, false);
    window.removeEventListener('mouseup', stopResize, false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }

  resizer.addEventListener('mousedown', initResize, false);
}

// ═══════════════════════════════════════════════════════════════
// Mermaid Panel Resizer
// ═══════════════════════════════════════════════════════════════

function initMermaidResizer() {
  var resizer = document.getElementById('mermaid-resizer');
  var editorPane = document.querySelector('.mermaid-editor-pane');

  if (!resizer || !editorPane) return;

  function initResize(e) {
    window.addEventListener('mousemove', resize, false);
    window.addEventListener('mouseup', stopResize, false);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  }

  function resize(e) {
    var container = document.getElementById('mermaid-editor');
    if (!container) return;
    var containerLeft = container.getBoundingClientRect().left;
    var newWidth = e.clientX - containerLeft;
    var minWidth = 150;
    var maxWidth = container.offsetWidth - 150;
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      editorPane.style.width = newWidth + 'px';
      editorPane.style.flex = 'none';
    }
  }

  function stopResize() {
    window.removeEventListener('mousemove', resize, false);
    window.removeEventListener('mouseup', stopResize, false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }

  resizer.addEventListener('mousedown', initResize, false);
}

// ── Quarto Studio Panel ────────────────────────────────────────────────────

const Studio = (() => {
  let currentEngagement = null;
  let currentSections = [];
  let dragSrcIdx = null;

  const engList = document.getElementById('studio-engagement-list');
  const sectionCards = document.getElementById('studio-section-cards');
  const sectionEditorWrap = document.getElementById('studio-section-editor-wrap');
  const sectionTextarea = document.getElementById('studio-section-textarea');
  const editingLabel = document.getElementById('studio-editing-label');
  const engNameEl = document.getElementById('studio-engagement-name');
  const previewIframe = document.getElementById('studio-preview-iframe');
  const previewPlaceholder = document.getElementById('studio-preview-placeholder');
  const previewLink = document.getElementById('studio-preview-link');
  const generateBtn = document.getElementById('btn-studio-generate');
  const draftToggle = document.getElementById('studio-draft-toggle');
  let editingSection = null;

  async function loadEngagements() {
    if (!engList) return;
    engList.innerHTML =
      '<div style="padding:0.5rem;font-size:0.75rem;color:var(--text-muted)">Loading...</div>';
    try {
      const res = await fetch('/api/studio/engagements');
      const { engagements } = await res.json();
      engList.innerHTML = '';
      if (!engagements?.length) {
        engList.innerHTML =
          '<div style="padding:0.5rem;font-size:0.75rem;color:var(--text-muted)">No engagements found</div>';
        return;
      }
      for (const eng of engagements) {
        const item = document.createElement('div');
        item.className = 'studio-engagement-item';
        item.textContent = eng.name;
        item.title = eng.path;
        item.addEventListener('click', () => selectEngagement(eng));
        engList.appendChild(item);
      }
    } catch {
      engList.innerHTML =
        '<div style="padding:0.5rem;font-size:0.75rem;color:var(--accent-error,#ef4444)">Failed to load</div>';
    }
  }

  async function selectEngagement(eng) {
    currentEngagement = eng;
    engNameEl.textContent = eng.name;
    generateBtn.disabled = false;

    // Highlight selected
    engList.querySelectorAll('.studio-engagement-item').forEach(el => {
      el.classList.toggle('active', el.title === eng.path);
    });

    // Load sections
    sectionCards.innerHTML =
      '<div style="padding:0.5rem;font-size:0.75rem;color:var(--text-muted)">Loading sections...</div>';
    sectionEditorWrap.style.display = 'none';
    try {
      const res = await fetch(`/api/studio/sections?eng=${encodeURIComponent(eng.path)}`);
      const { sections } = await res.json();
      currentSections = sections || [];
      renderSectionCards();
      showPreview(eng.path);
    } catch {
      sectionCards.innerHTML =
        '<div style="padding:0.5rem;font-size:0.75rem;color:var(--accent-error,#ef4444)">Failed to load sections</div>';
    }
  }

  function renderSectionCards() {
    sectionCards.innerHTML = '';
    currentSections.forEach((sec, idx) => {
      const card = document.createElement('div');
      card.className = 'studio-section-card';
      card.draggable = true;
      card.dataset.idx = idx;
      card.innerHTML = `
        <span class="studio-drag-handle" title="Drag to reorder">\u2807</span>
        <span class="studio-card-name">${sec.name}</span>
        <span class="studio-card-excerpt">${(sec.excerpt || '').slice(0, 60)}</span>
      `;
      card.addEventListener('click', () => openSectionEditor(sec, idx));
      card.addEventListener('dragstart', onDragStart);
      card.addEventListener('dragover', onDragOver);
      card.addEventListener('dragleave', onDragLeave);
      card.addEventListener('drop', onDrop);
      card.addEventListener('dragend', onDragEnd);
      sectionCards.appendChild(card);
    });
  }

  function onDragStart(e) {
    dragSrcIdx = parseInt(this.dataset.idx, 10);
    e.dataTransfer.effectAllowed = 'move';
  }

  function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
  }

  function onDragLeave() { this.classList.remove('drag-over'); }

  function onDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    const destIdx = parseInt(this.dataset.idx, 10);
    if (dragSrcIdx === null || dragSrcIdx === destIdx) return;
    const moved = currentSections.splice(dragSrcIdx, 1)[0];
    currentSections.splice(destIdx, 0, moved);
    renderSectionCards();
    saveOrder();
  }

  function onDragEnd() { dragSrcIdx = null; }

  async function saveOrder() {
    if (!currentEngagement) return;
    const order = currentSections.map(s => s.file);
    await fetch('/api/studio/sections/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ engagement: currentEngagement.path, order }),
    }).catch(() => {});
  }

  async function openSectionEditor(sec, idx) {
    editingSection = sec;
    editingLabel.textContent = sec.name;
    sectionTextarea.value = sec.content || '';
    sectionEditorWrap.style.display = '';
    sectionTextarea.focus();

    // Load latest content if not already loaded
    if (!sec.content) {
      try {
        const res = await fetch(
          `/api/studio/sections?eng=${encodeURIComponent(currentEngagement.path)}&file=${encodeURIComponent(sec.file)}`
        );
        const { content } = await res.json();
        sectionTextarea.value = content || '';
        sec.content = content;
      } catch { /* ignore */ }
    }
  }

  document.getElementById('btn-studio-cancel-edit')?.addEventListener('click', () => {
    sectionEditorWrap.style.display = 'none';
    editingSection = null;
  });

  document.getElementById('btn-studio-save-section')?.addEventListener('click', async () => {
    if (!editingSection || !currentEngagement) return;
    const content = sectionTextarea.value;
    try {
      await fetch('/api/studio/sections/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          engagement: currentEngagement.path,
          file: editingSection.file,
          content,
        }),
      });
      editingSection.content = content;
      editingSection.excerpt = content.slice(0, 100);
      renderSectionCards();
    } catch { /* ignore */ }
  });

  document.getElementById('btn-studio-render')?.addEventListener('click', async () => {
    if (!currentEngagement) return;
    previewPlaceholder.style.display = 'flex';
    previewIframe.style.display = 'none';
    previewPlaceholder.querySelector('p').textContent = 'Rendering...';
    const draft = draftToggle?.checked ?? true;
    try {
      const res = await fetch('/api/studio/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ engagement: currentEngagement.path, format: 'html', draft }),
      });
      const { ok, previewUrl } = await res.json();
      if (ok && previewUrl) {
        previewIframe.src = previewUrl;
        previewIframe.style.display = '';
        previewPlaceholder.style.display = 'none';
        previewLink.href = previewUrl;
        previewLink.style.display = '';
      } else {
        previewPlaceholder.querySelector('p').textContent = 'Render failed.';
      }
    } catch {
      previewPlaceholder.querySelector('p').textContent = 'Render error.';
    }
  });

  generateBtn?.addEventListener('click', async () => {
    if (!currentEngagement) return;
    const draft = draftToggle?.checked ?? true;
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';
    try {
      await fetch('/api/studio/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ engagement: currentEngagement.path, format: 'html', draft }),
      });
    } finally {
      generateBtn.disabled = false;
      generateBtn.textContent = 'Generate';
    }
  });

  document.getElementById('btn-studio-refresh')?.addEventListener('click', loadEngagements);

  function showPreview(engPath) {
    const url = `/api/studio/preview?eng=${encodeURIComponent(engPath)}`;
    previewIframe.src = url;
    previewIframe.style.display = '';
    previewPlaceholder.style.display = 'none';
    previewLink.href = url;
    previewLink.style.display = '';
  }

  // Studio pane resizer
  function initStudioResizer(resizerId, paneEl, side) {
    const resizer = document.getElementById(resizerId);
    if (!resizer || !paneEl) return;
    let startX, startW;
    resizer.addEventListener('mousedown', e => {
      startX = e.clientX;
      startW = paneEl.offsetWidth;
      const onMove = mv => {
        const delta = side === 'left' ? mv.clientX - startX : startX - mv.clientX;
        paneEl.style.width = Math.max(150, startW + delta) + 'px';
      };
      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  initStudioResizer('studio-resizer-left', document.querySelector('.studio-pane-left'), 'left');
  initStudioResizer('studio-resizer-right', document.querySelector('.studio-pane-right'), 'right');

  return { init: loadEngagements };
})();

// Wire Studio tab
document.addEventListener('DOMContentLoaded', () => {
  const tabStudio = document.getElementById('tab-studio');
  if (tabStudio) {
    tabStudio.addEventListener('click', () => activateTab(tabStudio));
  }
});
