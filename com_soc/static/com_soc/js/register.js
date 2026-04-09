/**
 * Register Form Client-Side Validation
 * ENIDH - Comunicação Social
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('register-form');
    const usernameInput = document.getElementById('id_username');
    const emailInput = document.getElementById('id_email');
    const password1Input = document.getElementById('id_password1');
    const password2Input = document.getElementById('id_password2');
    const submitBtn = document.getElementById('submit-btn');

    // Validation rules
    const validators = {
        username: {
            validate: (value) => {
                if (value.trim().length < 3) return { valid: false, message: 'O nome de utilizador deve ter pelo menos 3 caracteres.' };
                if (value.trim().length > 150) return { valid: false, message: 'O nome de utilizador não pode ter mais de 150 caracteres.' };
                if (!/^[\w.@+-]+$/.test(value)) return { valid: false, message: 'O nome de utilizador só pode conter letras, números e @/./+/-/_' };
                return { valid: true };
            }
        },
        email: {
            validate: (value) => {
                if (!value.trim()) return { valid: false, message: 'O email é obrigatório.' };
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return { valid: false, message: 'Por favor introduza um email válido.' };
                return { valid: true };
            }
        },
        password1: {
            validate: (value) => {
                if (value.length < 8) return { valid: false, message: 'A palavra-passe deve ter pelo menos 8 caracteres.' };
                if (/^\d+$/.test(value)) return { valid: false, message: 'A palavra-passe não pode ser apenas numérica.' };
                return { valid: true };
            }
        },
        password2: {
            validate: (value) => {
                if (!value) return { valid: false, message: 'Por favor confirme a sua palavra-passe.' };
                if (value !== password1Input.value) return { valid: false, message: 'As palavras-passe não coincidem.' };
                return { valid: true };
            }
        }
    };

    /**
     * Show error message for a field
     */
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('has-error');
        formGroup.classList.remove('has-success');
        
        // Remove existing error message
        const existingError = formGroup.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        formGroup.appendChild(errorElement);
        
        input.classList.add('error');
        input.classList.remove('success');
    }

    /**
     * Clear error message for a field
     */
    function clearError(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('has-error');
        
        const existingError = formGroup.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        input.classList.remove('error');
    }

    /**
     * Show success state for a field
     */
    function showSuccess(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('has-success');
        formGroup.classList.remove('has-error');
        
        input.classList.add('success');
        input.classList.remove('error');
    }

    /**
     * Validate a single field
     */
    function validateField(input, validatorKey) {
        const value = input.value;
        const validator = validators[validatorKey];
        const result = validator.validate(value);
        
        clearError(input);
        
        if (!result.valid) {
            showError(input, result.message);
            return false;
        }
        
        showSuccess(input);
        return true;
    }

    /**
     * Calculate password strength
     */
    function calculatePasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        
        if (strength <= 2) return 'weak';
        if (strength <= 3) return 'medium';
        return 'strong';
    }

    /**
     * Update password strength indicator
     */
    function updatePasswordStrength(password) {
        const strengthContainer = document.getElementById('password-strength');
        if (!strengthContainer) return;
        
        const strengthBar = strengthContainer.querySelector('.strength-bar-fill');
        const strengthText = strengthContainer.querySelector('.strength-text');
        
        if (!password) {
            strengthBar.className = 'strength-bar-fill';
            strengthText.textContent = '';
            strengthText.className = 'strength-text';
            return;
        }
        
        const strength = calculatePasswordStrength(password);
        
        strengthBar.className = 'strength-bar-fill ' + strength;
        strengthText.className = 'strength-text ' + strength;
        
        const strengthLabels = {
            weak: 'Fraca',
            medium: 'Média',
            strong: 'Forte'
        };
        
        strengthText.textContent = 'Força: ' + strengthLabels[strength];
    }

    /**
     * Validate entire form
     */
    function validateForm() {
        const isUsernameValid = validateField(usernameInput, 'username');
        const isEmailValid = validateField(emailInput, 'email');
        const isPassword1Valid = validateField(password1Input, 'password1');
        const isPassword2Valid = validateField(password2Input, 'password2');
        
        return isUsernameValid && isEmailValid && isPassword1Valid && isPassword2Valid;
    }

    // Event listeners for real-time validation
    usernameInput.addEventListener('blur', function() {
        validateField(this, 'username');
    });

    usernameInput.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            validateField(this, 'username');
        }
    });

    emailInput.addEventListener('blur', function() {
        validateField(this, 'email');
    });

    emailInput.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            validateField(this, 'email');
        }
    });

    password1Input.addEventListener('blur', function() {
        validateField(this, 'password1');
    });

    password1Input.addEventListener('input', function() {
        updatePasswordStrength(this.value);
        if (this.classList.contains('error')) {
            validateField(this, 'password1');
        }
        // Also re-validate password2 if it has a value
        if (password2Input.value) {
            validateField(password2Input, 'password2');
        }
    });

    password2Input.addEventListener('blur', function() {
        validateField(this, 'password2');
    });

    password2Input.addEventListener('input', function() {
        if (this.classList.contains('error') || this.value === password1Input.value) {
            validateField(this, 'password2');
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        if (!validateForm()) {
            e.preventDefault();
            
            // Focus on first invalid field
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.focus();
            }
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    });
});
