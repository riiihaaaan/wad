// Get form and field references once so we can reuse them in functions.
const form = document.getElementById("feedbackForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const ratingInput = document.getElementById("rating");
const commentsInput = document.getElementById("comments");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const ratingError = document.getElementById("ratingError");
const commentsError = document.getElementById("commentsError");
const successMessage = document.getElementById("successMessage");

// Validation function for name: must not be empty.
function validateName() {
    const nameValue = nameInput.value.trim();

    if (nameValue === "") {
        nameError.textContent = "Name is required.";
        return false;
    }

    nameError.textContent = "";
    return true;
}

// Validation function for email using a simple regex format check.
function validateEmail() {
    const emailValue = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue === "") {
        emailError.textContent = "Email is required.";
        return false;
    }

    if (!emailPattern.test(emailValue)) {
        emailError.textContent = "Please enter a valid email address.";
        return false;
    }

    emailError.textContent = "";
    return true;
}

// Validation function for rating: must be selected and between 1 and 5.
function validateRating() {
    const ratingValue = Number(ratingInput.value);

    if (ratingInput.value === "") {
        ratingError.textContent = "Rating is required.";
        return false;
    }

    if (ratingValue < 1 || ratingValue > 5) {
        ratingError.textContent = "Rating must be between 1 and 5.";
        return false;
    }

    ratingError.textContent = "";
    return true;
}

// Validation function for comments: must not be empty.
function validateComments() {
    const commentsValue = commentsInput.value.trim();

    if (commentsValue === "") {
        commentsError.textContent = "Comments are required.";
        return false;
    }

    commentsError.textContent = "";
    return true;
}

// Run all validation functions and return true only when all are valid.
function validateForm() {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isRatingValid = validateRating();
    const isCommentsValid = validateComments();

    return isNameValid && isEmailValid && isRatingValid && isCommentsValid;
}

// Handle submit event: prevent default submit, show errors or success message.
form.addEventListener("submit", function (event) {
    event.preventDefault();
    successMessage.textContent = "";

    if (validateForm()) {
        successMessage.textContent = "Feedback submitted successfully!";
        form.reset();
    }
});

// Optional live validation: checks each field after the user leaves the input.
nameInput.addEventListener("blur", validateName);
emailInput.addEventListener("blur", validateEmail);
ratingInput.addEventListener("blur", validateRating);
commentsInput.addEventListener("blur", validateComments);
