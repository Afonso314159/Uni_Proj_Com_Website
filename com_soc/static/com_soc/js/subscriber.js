/* ==========================================
   Subscriber Page JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
    initChatFab();
});

/* ==========================================
   Chat FAB (Floating Action Button)
   ========================================== */
function initChatFab() {
    const chatFab = document.getElementById('chat-fab');
    const chatModal = document.getElementById('chat-modal');
    
    if (!chatFab || !chatModal) return;

    chatFab.addEventListener('click', function() {
        chatModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close button inside modal
    const chatModalClose = chatModal.querySelector('.modal-close');
    if (chatModalClose) {
        chatModalClose.addEventListener('click', function() {
            chatModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Click outside modal to close
    chatModal.addEventListener('click', function(e) {
        if (e.target === chatModal) {
            chatModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Escape key closes modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && chatModal.classList.contains('active')) {
            chatModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}
