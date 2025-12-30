/**
 * main.js - Payment Form Logic
 * This file handles formatting, validation, and UI toggling
 */

// 1. Wait for the HTML to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    
    // Select Elements
    const paymentForm = document.getElementById('paymentForm');
    const cardInput = document.getElementById('cardNumber');
    const expiryInput = document.getElementById('expiry');
    const cvvInput = document.getElementById('cvv');
    const successContainer = document.getElementById('successContainer');

    /**
     * Formatting Card Number: Adds a space every 4 digits
     */
    cardInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });

    /**
     * Formatting Expiry Date: Adds a slash (/) after 2 digits
     */
    expiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length >= 2) {
            e.target.value = value.slice(0, 2) + '/' + value.slice(2, 4);
        } else {
            e.target.value = value;
        }
    });

    /**
     * Form Submission Logic
     */
    paymentForm.addEventListener('submit', (event) => {
        // Stop the page from refreshing
        event.preventDefault();

        // Basic clean-up of data for checking
        const rawCardNo = cardInput.value.replace(/\s/g, '');

        // Validation: Check if the card number is long enough
        if (rawCardNo.length < 16) {
            alert("Error: Card number must be 16 digits.");
            return;
        }

        // Validation: Check CVV length
        if (cvvInput.value.length < 3) {
            alert("Error: Invalid CVV.");
            return;
        }

        // --- SUCCESS ACTIONS ---
        
        // 1. Hide the payment form class
        paymentForm.style.display = 'none';

        // 2. Show the success message container
        if (successContainer) {
            successContainer.style.display = 'block';
        }

        console.log("Payment Successful - Form Hidden");
    });
});
document.addEventListener('DOMContentLoaded', function() {
    
    // Select elements
    const form = document.getElementById('paymentForm');
    const cardInput = document.getElementById('cardNumber');
    const expiryInput = document.getElementById('expiry');
    const successDiv = document.getElementById('successContainer');

    // Check if elements actually exist to avoid errors
    if (!form || !successDiv) {
        console.error("Required elements not found in HTML!");
        return;
    }

    // 1. Formatting Card Number
    cardInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, ''); // Remove non-digits
        let finalVal = val.match(/.{1,4}/g)?.join(' ') || val;
        e.target.value = finalVal;
    });

    // 2. Formatting Expiry Date
    expiryInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length >= 2) {
            e.target.value = val.slice(0, 2) + '/' + val.slice(2, 4);
        } else {
            e.target.value = val;
        }
    });

    // 3. Handling Submit Action
    form.addEventListener('submit', function(event) {
        // Stop the form from refreshing the page
        event.preventDefault();

        // Perform visual actions
        form.style.display = 'none';      // Hide the form
        successDiv.style.display = 'block'; // Show success message
        
        console.log("Process complete: Form hidden, Success shown.");
    });

});