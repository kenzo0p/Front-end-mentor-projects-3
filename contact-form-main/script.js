// Get form elements
const form = document.querySelector('form');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const queryRadios = document.querySelectorAll('input[name="query"]');
const message = document.getElementById('message');
const consentCheckbox = document.getElementById('check');
const successMessage = document.querySelector('.success__message');
const formContainer = document.querySelector('.form__container');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Function to show error state
const showError = (element) => {
    const parentContainer = element.closest('.form__input, .form__email, .form__message, .form__query, .form__check');
    if (parentContainer) {
        const errorSpan = parentContainer.querySelector('.error__state');
        if (errorSpan) {
            errorSpan.style.visibility = 'visible';
        }
    }
};

// Function to hide error state
const hideError = (element) => {
    const parentContainer = element.closest('.form__input, .form__email, .form__message, .form__query, .form__check');
    if (parentContainer) {
        const errorSpan = parentContainer.querySelector('.error__state');
        if (errorSpan) {
            errorSpan.style.visibility = 'hidden';
        }
    }
};

// Function to validate radio buttons
const validateRadioButtons = () => {
    const isChecked = Array.from(queryRadios).some(radio => radio.checked);
    const queryContainer = document.querySelector('.form__query');
    const errorElement = queryContainer.querySelector('.error__state');
    
    if (!isChecked) {
        errorElement.style.visibility = 'visible';
        return false;
    }
    errorElement.style.visibility = 'hidden';
    return true;
};

// Form submission handler
form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // First Name validation
    if (!firstName.value.trim()) {
        showError(firstName);
        isValid = false;
    } else {
        hideError(firstName);
    }

    // Last Name validation
    if (!lastName.value.trim()) {
        showError(lastName);
        isValid = false;
    } else {
        hideError(lastName);
    }

    // Email validation
    if (!email.value.trim() || !emailRegex.test(email.value)) {
        showError(email);
        isValid = false;
    } else {
        hideError(email);
    }

    // Query Type validation
    if (!validateRadioButtons()) {
        isValid = false;
    }

    // Message validation
    if (!message.value.trim()) {
        showError(message);
        isValid = false;
    } else {
        hideError(message);
    }

    // Consent checkbox validation
    if (!consentCheckbox.checked) {
        const checkboxContainer = consentCheckbox.closest('.form__check');
        const errorElement = checkboxContainer.querySelector('.error__state');
        errorElement.style.visibility = 'visible';
        isValid = false;
    } else {
        const checkboxContainer = consentCheckbox.closest('.form__check');
        const errorElement = checkboxContainer.querySelector('.error__state');
        errorElement.style.visibility = 'hidden';
    }

    // If form is valid, show success message
    if (isValid) {
        successMessage.style.visibility = 'visible';
        formContainer.style.display = 'none';
        form.reset();
    }
});

// Real-time validation
firstName.addEventListener('input', () => {
    if (firstName.value.trim()) {
        hideError(firstName);
    }
});

lastName.addEventListener('input', () => {
    if (lastName.value.trim()) {
        hideError(lastName);
    }
});

email.addEventListener('input', () => {
    if (email.value.trim() && emailRegex.test(email.value)) {
        hideError(email);
    }
});

message.addEventListener('input', () => {
    if (message.value.trim()) {
        hideError(message);
    }
});

queryRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        if (radio.checked) {
            const queryContainer = document.querySelector('.form__query');
            const errorElement = queryContainer.querySelector('.error__state');
            errorElement.style.visibility = 'hidden';
        }
    });
});

consentCheckbox.addEventListener('change', () => {
    if (consentCheckbox.checked) {
        const checkboxContainer = consentCheckbox.closest('.form__check');
        const errorElement = checkboxContainer.querySelector('.error__state');
        errorElement.style.visibility = 'hidden';
    }
});

// Initial state
successMessage.style.visibility = 'hidden';
