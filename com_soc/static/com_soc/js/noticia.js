/* ==========================================
   Noticia Detail Page JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
    initComments();
    initReportButtons();
});

/* ==========================================
   Comment Submission
   ========================================== */
function initComments() {
    const section = document.getElementById('comments-section');
    if (!section) return;

    const commentUrl = section.getAttribute('data-comment-url');
    const submitBtn = document.getElementById('comment-submit');
    const textarea = document.getElementById('comment-input');
    const list = document.getElementById('comments-list');

    if (!submitBtn || !textarea) return;

    submitBtn.addEventListener('click', function() {
        postComment();
    });

    textarea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            postComment();
        }
    });

    function postComment() {
        const conteudo = textarea.value.trim();
        if (!conteudo) return;

        submitBtn.disabled = true;

        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]');
        const formData = new FormData();
        formData.append('conteudo', conteudo);
        if (csrfToken) formData.append('csrfmiddlewaretoken', csrfToken.value);

        fetch(commentUrl, {
            method: 'POST',
            body: formData,
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Remove empty-state placeholder if present
                const placeholder = document.getElementById('no-comments-placeholder');
                if (placeholder) placeholder.remove();

                // Build and prepend the new comment
                const comment = data.comment;
                const div = document.createElement('div');
                div.className = 'comment comment-new';
                div.id = 'comment-' + comment.id;
                div.innerHTML = `
                    <div class="comment-avatar">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </div>
                    <div class="comment-content">
                        <div class="comment-header">
                            <span class="comment-author">${escapeHtml(comment.author)}</span>
                        </div>
                        <div class="comment-body">${escapeHtml(comment.conteudo)}</div>
                    </div>
                    <div class="comment-actions">
                        <button class="report-btn" title="Reportar comentário" data-comment-id="${comment.id}">!</button>
                    </div>
                `;
                list.insertBefore(div, list.firstChild);
                textarea.value = '';

                // Bind report button on the new comment
                const newReportBtn = div.querySelector('.report-btn');
                if (newReportBtn) bindReportBtn(newReportBtn);
            }
        })
        .catch(() => {})
        .finally(() => {
            submitBtn.disabled = false;
            textarea.focus();
        });
    }
}

/* ==========================================
   Report Button Functionality
   ========================================== */
function initReportButtons() {
    document.querySelectorAll('.report-btn').forEach(btn => bindReportBtn(btn));
}

function bindReportBtn(button) {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        this.style.color = 'var(--error-text)';
        this.title = 'Reportado';
        this.disabled = true;
    });
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
