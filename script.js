// ======================================================
// ACX — Adrian Code X
// Main JavaScript
// ======================================================


// ======================================================
// GOOGLE APPS SCRIPT URL
// ======================================================

// Replace this with your deployed Apps Script Web App URL.

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbz-TWOqQtxGXEkitjacjRLRcbqG9j0wnvGGMK5eGVZr3xA5JoV2ePVQedP4MFF_8A5T/exec";


// ======================================================
// DOM READY
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initNavbar();

        initMobileMenu();

        initProjectFilter();

        initContactForm();

    }
);


// ======================================================
// NAVBAR
// ======================================================

function initNavbar() {

    const navbar =
        document.getElementById("navbar");


    function updateNavbar() {

        if (window.scrollY > 20) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }

    }


    updateNavbar();


    window.addEventListener(
        "scroll",
        updateNavbar
    );

}


// ======================================================
// MOBILE MENU
// ======================================================

function initMobileMenu() {

    const toggle =
        document.getElementById("menuToggle");

    const menu =
        document.getElementById("navMenu");


    toggle.addEventListener(
        "click",
        function () {

            menu.classList.toggle("open");

        }
    );


    const links =
        menu.querySelectorAll("a");


    links.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    menu.classList.remove("open");

                }
            );

        }
    );

}


// ======================================================
// PROJECT FILTER
// ======================================================

function initProjectFilter() {

    const buttons =
        document.querySelectorAll(".filter");

    const projects =
        document.querySelectorAll(".project-card");


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    buttons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const filter =
                        button.dataset.filter;


                    projects.forEach(
                        function (project) {

                            const category =
                                project.dataset.category;


                            if (
                                filter === "all" ||
                                category === filter
                            ) {

                                project.style.display =
                                    "block";

                            } else {

                                project.style.display =
                                    "none";

                            }

                        }
                    );

                }
            );

        }
    );

}


// ======================================================
// CONTACT FORM
// ======================================================

function initContactForm() {

    const form =
        document.getElementById(
            "contactForm"
        );


    const status =
        document.getElementById(
            "formStatus"
        );


    const submitButton =
        document.getElementById(
            "submitButton"
        );


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            status.textContent = "";


            // Browser validation

            if (!form.checkValidity()) {

                form.reportValidity();

                showStatus(
                    "Please complete all required fields.",
                    "error"
                );

                return;

            }


            // Email validation

            const email =
                form.elements.email.value.trim();


            if (!validateEmail(email)) {

                showStatus(
                    "Please enter a valid email address.",
                    "error"
                );

                return;

            }


            // Phone validation

            const phone =
                form.elements.phone.value.trim();


            if (!validatePhone(phone)) {

                showStatus(
                    "Please enter a valid phone number.",
                    "error"
                );

                return;

            }


            // Check Apps Script URL

            if (
                !GOOGLE_SCRIPT_URL ||
                GOOGLE_SCRIPT_URL.includes(
                    "PASTE_YOUR"
                )
            ) {

                showStatus(
                    "Google Sheets is not connected. Add your Apps Script Web App URL in script.js.",
                    "error"
                );

                return;

            }


            // Loading state

            submitButton.disabled = true;

            submitButton.textContent =
                "Sending Enquiry...";


            const formData =
                new FormData(form);


            const body =
                new URLSearchParams();


            for (
                const [key, value]
                of formData.entries()
            ) {

                body.append(
                    key,
                    String(value).trim()
                );

            }


            try {

                /*
                 * Send data to Google Apps Script.
                 *
                 * URLSearchParams sends normal
                 * form parameters.
                 */

                await fetch(
                    GOOGLE_SCRIPT_URL,
                    {
                        method: "POST",

                        mode: "no-cors",

                        body: body
                    }
                );


                // Clear form

                form.reset();


                showStatus(
                    "Thank you! Your project enquiry has been received. I'll get back to you soon.",
                    "success"
                );


                showToast(
                    "Project enquiry sent successfully."
                );


            } catch (error) {

                console.error(
                    "ACX Form Error:",
                    error
                );


                showStatus(
                    "Something went wrong. Please try again.",
                    "error"
                );

            }


            submitButton.disabled = false;

            submitButton.textContent =
                "Send Project Enquiry ↗";

        }
    );


    function showStatus(
        message,
        type
    ) {

        status.textContent =
            message;

        status.className =
            "form-status " + type;

    }

}


// ======================================================
// EMAIL VALIDATION
// ======================================================

function validateEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


// ======================================================
// PHONE VALIDATION
// ======================================================

function validatePhone(phone) {

    return /^[0-9+()\-\s]{7,20}$/
        .test(phone);

}


// ======================================================
// TOAST MESSAGE
// ======================================================

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        showToast.timer
    );


    showToast.timer =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            4000
        );

}