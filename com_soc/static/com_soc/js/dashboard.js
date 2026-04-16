/* ==========================================
   Dashboard JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
    initModals();
    initCreateNews();
});

/* ==========================================
   Sidebar Toggle
   ========================================== */
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const dashboard = document.getElementById('dashboard');
    const menuBtn = document.getElementById('mobile-menu-btn');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    const DESKTOP_BREAKPOINT = 769;
    const isDesktop = () => window.innerWidth >= DESKTOP_BREAKPOINT;

    // On desktop: sidebar starts open (via CSS), on mobile: starts closed (via CSS)
    // No localStorage, no animation on load - just respect CSS defaults

    // Toggle button click handler
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            if (sidebar.classList.contains('open')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    // Overlay click closes sidebar
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            closeSidebar();
        });
    }

    // Escape key closes sidebar
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    });

    // Handle resize: reset to default state when crossing breakpoint
    let wasDesktop = isDesktop();
    window.addEventListener('resize', function() {
        const nowDesktop = isDesktop();
        
        if (wasDesktop !== nowDesktop) {
            // Reset to CSS default when crossing breakpoint
            sidebar.classList.remove('open', 'closed');
            dashboard.classList.remove('sidebar-open', 'sidebar-closed');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        wasDesktop = nowDesktop;
    });

    function openSidebar() {
        sidebar.classList.add('open');
        sidebar.classList.remove('closed');
        dashboard.classList.add('sidebar-open');
        dashboard.classList.remove('sidebar-closed');
        
        // Show overlay on mobile
        if (!isDesktop()) {
            sidebarOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        sidebar.classList.add('closed');
        dashboard.classList.remove('sidebar-open');
        dashboard.classList.add('sidebar-closed');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* ==========================================
   Modal Management
   ========================================== */
function initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    const modalCloseButtons = document.querySelectorAll('.modal-close');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-modal-target');
            const modal = document.getElementById(targetId);
            if (modal) openModal(modal);
        });
    });

    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal-overlay');
            if (modal) closeModal(modal);
        });
    });

    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) closeModal(this);
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) closeModal(activeModal);
        }
    });
}

function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) setTimeout(() => focusable.focus(), 100);
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

/* ==========================================
   Create News Modal
   ========================================== */
function initCreateNews() {
    const fileInput = document.getElementById('news-create-images-input');
    const previewsContainer = document.getElementById('news-create-previews');
    const submitBtn = document.getElementById('news-create-submit');
    const cancelBtn = document.getElementById('news-create-cancel');
    const form = document.getElementById('news-create-form');
    const errorEl = document.getElementById('news-create-error');
    const tituloInput = document.getElementById('news-create-titulo');
    const corpoInput = document.getElementById('news-create-corpo');
    const modal = document.getElementById('add-news-modal');

    if (!form) return;

    // Track selected files manually so we can delete individually
    let selectedFiles = [];

    fileInput.addEventListener('change', function() {
        const newFiles = Array.from(this.files);
        newFiles.forEach(file => {
            if (!selectedFiles.find(f => f.name === file.name && f.size === file.size)) {
                selectedFiles.push(file);
                addPreview(file);
            }
        });
        // Reset input so same file can be re-added after deletion
        this.value = '';
    });

    function addPreview(file) {
        const wrap = document.createElement('div');
        wrap.className = 'news-preview-item';
        wrap.dataset.fileName = file.name;
        wrap.dataset.fileSize = file.size;

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'news-preview-delete';
        deleteBtn.title = 'Remover';
        deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 9l-6 6M9 9l6 6"/></svg>`;

        deleteBtn.addEventListener('click', function() {
            selectedFiles = selectedFiles.filter(f => !(f.name === file.name && f.size === file.size));
            wrap.remove();
        });

        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.alt = file.name;
            const reader = new FileReader();
            reader.onload = e => { img.src = e.target.result; };
            reader.readAsDataURL(file);
            wrap.appendChild(img);
        } else {
            const icon = document.createElement('div');
            icon.className = 'news-preview-video-icon';
            icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"/></svg>`;
            const name = document.createElement('span');
            name.textContent = file.name;
            wrap.appendChild(icon);
            wrap.appendChild(name);
        }

        wrap.appendChild(deleteBtn);
        previewsContainer.appendChild(wrap);
    }

    function showError(msg) {
        errorEl.textContent = msg;
        errorEl.style.display = 'block';
    }

    function hideError() {
        errorEl.style.display = 'none';
        errorEl.textContent = '';
    }

    // Cancel resets the form
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            resetForm();
            closeModal(modal);
        });
    }

    // Submit
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            hideError();

            const titulo = tituloInput.value.trim();
            const corpo = corpoInput.value.trim();

            if (!titulo) {
                showError('Por favor insira um título.');
                tituloInput.focus();
                return;
            }
            if (corpo.length < 20) {
                showError('A descrição deve ter pelo menos 20 caracteres.');
                corpoInput.focus();
                return;
            }

            // Build FormData manually with our tracked files
            const fd = new FormData();
            const csrf = form.querySelector('[name=csrfmiddlewaretoken]');
            if (csrf) fd.append('csrfmiddlewaretoken', csrf.value);
            fd.append('titulo', titulo);
            fd.append('corpo_texto', corpo);
            selectedFiles.forEach(f => fd.append('imagens', f));

            submitBtn.disabled = true;

            fetch(form.action, {
                method: 'POST',
                body: fd,
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    resetForm();
                    closeModal(modal);
                    window.location.reload();
                } else {
                    showError(data.error || 'Erro ao submeter notícia.');
                }
            })
            .catch(() => showError('Erro de ligação. Tente novamente.'))
            .finally(() => { submitBtn.disabled = false; });
        });
    }

    function resetForm() {
        form.reset();
        selectedFiles = [];
        previewsContainer.innerHTML = '';
        hideError();
    }
}
