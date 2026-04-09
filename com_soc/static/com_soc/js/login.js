/**
 * Login Form Client-Side Validation
 * ENIDH - Comunicação Social
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-form');
    const usernameInput = document.getElementById('id_username');
    const passwordInput = document.getElementById('id_password');
    const submitBtn = document.getElementById('submit-btn');

    // Validation rules
    const validators = {
        username: {
            validate: (value) => value.trim().length >= 3,
            message: 'O nome de utilizador deve ter pelo menos 3 caracteres.'
        },
        password: {
            validate: (value) => value.length >= 1,
            message: 'Por favor introduza a sua palavra-passe.'
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
        
        clearError(input);
        
        if (!validator.validate(value)) {
            showError(input, validator.message);
            return false;
        }
        
        showSuccess(input);
        return true;
    }

    /**
     * Validate entire form
     */
    function validateForm() {
        const isUsernameValid = validateField(usernameInput, 'username');
        const isPasswordValid = validateField(passwordInput, 'password');
        
        return isUsernameValid && isPasswordValid;
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

    passwordInput.addEventListener('blur', function() {
        validateField(this, 'password');
    });

    passwordInput.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            validateField(this, 'password');
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
