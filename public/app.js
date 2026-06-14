const butterfliesInput = document.getElementById("butterflies");
        const packageSelect = document.getElementById("package");
        const totalPriceOutput = document.getElementById("totalPrice");
        const paymentSelect = document.getElementById("payment");
        const payidDetails = document.getElementById("payidDetails");
    
        function calculatePrice() {
            const butterflies = parseInt(butterfliesInput.value, 10) || 0;
            const packagePrice = packageSelect.value;
            let total = 0;
    
            if (packageSelect.value == "10") {
    total = butterflies * (10 + 11);  // $21 per butterfly
} else {
    total = (butterflies * 11) + parseInt(packagePrice, 10);
}

    
            totalPriceOutput.textContent = `Total: $${total}`;
        }
    
        butterfliesInput.addEventListener("input", calculatePrice);
        packageSelect.addEventListener("change", calculatePrice);
    
        paymentSelect.addEventListener("change", function() {
            payidDetails.style.display = this.value === "payid" ? "block" : "none";
        });
    
        // FAQ accordion
        const faqQuestions = document.querySelectorAll(".faq-question");
        faqQuestions.forEach(q => {
            q.addEventListener("click", () => {
                const item = q.parentElement;
                item.classList.toggle("active");
            });
        });
    
        // Animate hero text on load
        window.addEventListener('load', () => {
            const elements = document.querySelectorAll('.fade-slide');
            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('visible');
                }, index * 200);
            });
        });
    
        // === NEW: Package selection from buttons ===
        const packageButtons = document.querySelectorAll(".btn-select");
        const packageMapping = {
            "Individual Release": "10",
            "Extra Small Cage": "45",
            "Small Cage": "70",
            "Large Cage": "85",
            "Extra Large Cage": "95"
        };
    
        packageButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                e.preventDefault(); // prevent default anchor behavior
                const packageName = button.parentElement.querySelector("h3").textContent;
                packageSelect.value = packageMapping[packageName];
                calculatePrice(); // update the total price
                document.getElementById("enquiry").scrollIntoView({ behavior: "smooth" });
            });
        });

        const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');





form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const quantity =
        parseInt(document.getElementById("butterflies").value, 10) || 0;

    try {

        // Check stock
        const stockResponse = await fetch("/stock");

console.log("Stock response:", stockResponse.status);

const stockData = await stockResponse.json();

console.log("Stock data:", stockData);

        if (quantity > stockData.quantity) {

            formMessage.textContent =
                `Sorry, only ${stockData.quantity} butterflies are currently available.`;

            return;
        }

        const formData = new FormData(form);

        // Send to Formspree
        const response = await fetch(
            'https://formspree.io/f/meoralvr',
            {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        if (response.ok) {

            // Reduce stock
            const reduceResponse = await fetch(
                "/reduce-stock",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        quantity: quantity
                    })
                }
            );
            
            console.log("Reduce stock:", reduceResponse.status);

            formMessage.textContent =
                "Thank you! Your enquiry has been sent.";

            form.reset();

            totalPriceOutput.textContent = "Total: $0";

            payidDetails.style.display = "none";

        } else {

            formMessage.textContent =
                "Oops! There was a problem sending your enquiry. Please try again.";
        }

    } catch (error) {

        console.error(error);

        formMessage.textContent =
            "An error occurred. Please try again.";
    }
});

