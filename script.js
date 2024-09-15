document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tshirtForm");
  const submitBtn = document.getElementById("submitBtn");

  form.addEventListener("input", handleInput);
  submitBtn.addEventListener("click", handleSubmit);

  function handleInput(event) {
    validateField(event.target);
  }

  function handleSubmit(event) {
    event.preventDefault(); // Prevent form submission
    if (validateForm()) {
      showModal();
    }
  }

  function validateField(field) {
    const validationRules = {
      tagline: (value) =>
        value.length <= 50 || "Tagline should not exceed 50 characters.",
      phone: (value) =>
        /^\d{10}$/.test(value) || "Phone number should be exactly 10 digits.",
      quantity: (value) =>
        (value >= 1 && value <= 100) || "Quantity should be between 1 and 100.",
      deliveryDate: (value) =>
        new Date(value) >= new Date() || "Delivery date cannot be in the past.",
    };

    const validate = validationRules[field.id];
    if (validate) {
      const message = validate(field.value);
      if (message !== true) {
        showError(field, message);
        return false;
      }
    }

    removeError(field);
    return true;
  }

  function validateForm() {
    let isFormValid = true;
    const fields = form.elements;

    for (let field of fields) {
      if (field.type !== "button" && field.type !== "reset") {
        if (!validateField(field)) {
          isFormValid = false;
        }
      }
    }

    return isFormValid;
  }

  function showError(field, message) {
    field.classList.add("invalid");
    let errorElement = field.nextElementSibling;

    if (!errorElement || !errorElement.classList.contains("error-message")) {
      errorElement = document.createElement("div");
      errorElement.className = "error-message";
      field.parentNode.insertBefore(errorElement, field.nextSibling);
    }

    errorElement.textContent = message;
  }

  function removeError(field) {
    field.classList.remove("invalid");
    const errorElement = field.nextElementSibling;

    if (errorElement && errorElement.classList.contains("error-message")) {
      errorElement.remove();
    }
  }

  function showModal() {
    const modal = document.getElementById("receiptModal");
    const receiptDetails = document.getElementById("receiptDetails");

    // Get individual form elements
    const tagline = document.getElementById("tagline").value;
    const color =
      document.getElementById("color").options[
        document.getElementById("color").selectedIndex
      ].text;
    const size =
      document.getElementById("size").options[
        document.getElementById("size").selectedIndex
      ].text;
    const quantity = document.getElementById("quantity").value;
    const deliveryDate = document.getElementById("deliveryDate").value;
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const comments =
      document.getElementById("comments").value || "No additional comments";

    // Format the receipt text
    const receiptText = `
            <p><strong>Order Details:</strong></p>
            <p><strong>Tagline:</strong> ${tagline}</p>
            <p><strong>Color:</strong> ${color}</p>
            <p><strong>Size:</strong> ${size}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Delivery Date:</strong> ${deliveryDate}</p>
            <p><strong>Recipient's Name:</strong> ${name}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Additional Comments:</strong> ${comments}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        `;

    // Display the receipt text in the modal
    receiptDetails.innerHTML = receiptText;
    modal.style.display = "block";

    // Close modal on clicking the close button or confirm button
    document.querySelector(".close").onclick = () =>
      (modal.style.display = "none");
    document.getElementById("confirmBtn").onclick = () => {
      generatePDF(receiptText);
      modal.style.display = "none";
    };
  }

  function generatePDF(receiptText) {
    const pdfWindow = window.open("", "", "width=800,height=600");
    pdfWindow.document.write(`
            <html>
                <head><title>Receipt</title></head>
                <body>${receiptText}</body>
            </html>
        `);
    pdfWindow.document.close();
    // pdfWindow.focus();
    pdfWindow.print();
  }
 

});
