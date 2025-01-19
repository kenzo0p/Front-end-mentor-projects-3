// Get DOM elements
const form = document.querySelector('.form');
const ticketSection = document.querySelector('.ticket');
const formContainer = document.querySelector('.form-container');
const ticketNameSpan = document.querySelector('.ticket .name');
const ticketEmailSpan = document.querySelector('.ticket .email');
const randomNumberSpan = document.querySelector('.random');
const fileInput = document.querySelector('#file-input');
const dropArea = document.querySelector('#drop-area');
const avatarDisplay = document.querySelector('.card_info img');
const mainHeading = document.querySelector('.main-heading');
const subHeading = document.querySelector('.sub-heading');
const ticketOverall = document.querySelector('.ticket-overall');

// Add error message styling
const style = document.createElement('style');
style.textContent = `
    .error-message {
        color: #ff4444;
        font-size: 12px;
        margin-top: 4px;
    }
    .input-error {
        border: 1px solid #ff4444 !important;
    }
    .drop-area-error {
        border: 2px dashed #ff4444 !important;
    }
`;
document.head.appendChild(style);

// Handle drag and drop functionality
dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('drag-active');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('drag-active');
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('drag-active');
    const file = e.dataTransfer.files[0];
    handleFile(file);
});

// Handle click to upload
dropArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    handleFile(file);
});

function handleFile(file) {
    if (file) {
        // Check file size (500KB limit)
        if (file.size > 500 * 1024) {
            showError(dropArea, 'File size must be less than 500KB');
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            showError(dropArea, 'Please upload an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            // Create an image element for preview with controlled size
            dropArea.innerHTML = `
                <img src="${e.target.result}" alt="Preview" 
                     style="max-width: 100px; max-height: 100px; object-fit: cover; border-radius: 10px;">
                <p>Image uploaded successfully!</p>
            `;
            // Save the image data for later use
            dropArea.dataset.imageData = e.target.result;
            removeError(dropArea);
        };
        reader.readAsDataURL(file);
    }
}

// Show error message
function showError(element, message) {
    // Remove any existing error message
    removeError(element);
    
    // Add error styling
    element.classList.add(element.classList.contains('drop-area') ? 'drop-area-error' : 'input-error');
    
    // Create and add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    element.parentNode.appendChild(errorDiv);
}

// Remove error message
function removeError(element) {
    element.classList.remove('input-error', 'drop-area-error');
    const existingError = element.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// Validate form
function validateForm() {
    let isValid = true;
    
    // Validate name
    const nameInput = form.querySelector('.name');
    if (!nameInput.value.trim()) {
        showError(nameInput, 'Please enter your name');
        isValid = false;
    } else {
        removeError(nameInput);
    }
    
    // Validate email
    const emailInput = form.querySelector('[type="email"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
        showError(emailInput, 'Please enter your email');
        isValid = false;
    } else if (!emailRegex.test(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email');
        isValid = false;
    } else {
        removeError(emailInput);
    }
    
    // Validate GitHub username
    const githubInput = form.querySelector('.github');
    if (!githubInput.value.trim()) {
        showError(githubInput, 'Please enter your GitHub username');
        isValid = false;
    } else {
        removeError(githubInput);
    }
    
    // Validate image upload
    if (!dropArea.dataset.imageData) {
        showError(dropArea, 'Please upload an avatar image');
        isValid = false;
    } else {
        removeError(dropArea);
    }
    
    return isValid;
}

// Handle form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
        return;
    }
    
    // Get form values
    const nameInput = form.querySelector('.name');
    const emailInput = form.querySelector('[type="email"]');
    const githubInput = form.querySelector('.github');
    
    // Update ticket with form values
    ticketNameSpan.textContent = nameInput.value;
    ticketEmailSpan.textContent = emailInput.value;
    
    // Update avatar if one was uploaded
    const uploadedImage = dropArea.dataset.imageData;
    if (uploadedImage && avatarDisplay) {
        avatarDisplay.src = uploadedImage;
        avatarDisplay.style.width = '50px';
        avatarDisplay.style.height = '50px';
        avatarDisplay.style.objectFit = 'cover';
        avatarDisplay.style.borderRadius = '10px';
    }
    
    // Generate random ticket number
    const randomNumber = Math.floor(Math.random() * 100000);
    randomNumberSpan.textContent = `#${randomNumber}`;
    
    // Hide form and show ticket
    ticketOverall.style.display = 'none';
    ticketSection.style.display = 'flex';
});

// Add real-time validation on input
const inputs = form.querySelectorAll('.input');
inputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.value.trim()) {
            removeError(input);
        }
    });
});

// Add return button
function addReturnButton() {
    const returnButton = document.createElement('button');
    returnButton.textContent = 'Generate Another Ticket';
    returnButton.className = 'form__button';
    returnButton.style.marginTop = '20px';
    
    returnButton.addEventListener('click', () => {
        ticketSection.style.display = 'none';
        ticketOverall.style.display = 'flex';
        mainHeading.style.display = 'block';
        subHeading.style.display = 'block';
        
        // Reset the form and drop area
        form.reset();
        dropArea.innerHTML = `
            <img src="/assets/images/icon-upload.svg" alt="" class="drag-drop" />
            <p>Drag and Drop image here or click to upload.</p>
        `;
        delete dropArea.dataset.imageData;
        
        // Remove any existing error messages
        document.querySelectorAll('.error-message').forEach(error => error.remove());
        document.querySelectorAll('.input-error, .drop-area-error').forEach(element => {
            element.classList.remove('input-error', 'drop-area-error');
        });
    });
    
    ticketSection.appendChild(returnButton);
}
