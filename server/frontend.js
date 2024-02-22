const form = document.getElementById("customerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const customerData = Object.fromEntries(formData);
  try {
    const response = await fetch("/api/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });
    if (response.ok) {
      alert("Customer data submitted successfully!");
      form.reset();
    } else {
      const errorMessage = await response.text();
      alert(`Error: ${errorMessage}`);
    }
  } catch (err) {
    console.error("Error:", err);
    alert("An error occurred. Please try again later.");
  }
});
