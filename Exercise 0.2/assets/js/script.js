/* =========================================
   CURRENT YEAR
========================================= */

const yearElement = document.getElementById("currentYear");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* =========================================
   FAQ ACCORDION
========================================= */

const faqQuestions =
    document.querySelectorAll(".faq-question");


faqQuestions.forEach(function (question) {

    question.addEventListener("click", function () {

        const answer =
            question.nextElementSibling;

        const icon =
            question.querySelector("span");


        if (answer.classList.contains("show")) {

            answer.classList.remove("show");

            icon.textContent = "+";

        } else {

            answer.classList.add("show");

            icon.textContent = "−";

        }

    });

});


/* =========================================
   ENERGY CALCULATOR
========================================= */

const calculator =
    document.getElementById("energyCalculator");


if (calculator) {

    calculator.addEventListener("submit", function (event) {

        /*
         * Prevent the form from refreshing
         * the webpage.
         */
        event.preventDefault();


        /* Get values from the input fields */

        const power =
            parseFloat(
                document.getElementById("power").value
            );


        const hours =
            parseFloat(
                document.getElementById("hours").value
            );


        const price =
            parseFloat(
                document.getElementById("price").value
            );


        /* Results container */

        const results =
            document.getElementById(
                "calculatorResults"
            );


        /* =====================================
           VALIDATION
        ===================================== */

        if (
            isNaN(power) ||
            isNaN(hours) ||
            isNaN(price)
        ) {

            results.innerHTML = `
                <h3>Invalid Input</h3>

                <p>
                    Please enter a value in all three fields.
                </p>
            `;

            return;
        }


        if (power <= 0) {

            results.innerHTML = `
                <h3>Invalid Power</h3>

                <p>
                    Appliance power must be greater than 0 watts.
                </p>
            `;

            return;
        }


        if (hours < 0 || hours > 24) {

            results.innerHTML = `
                <h3>Invalid Usage Time</h3>

                <p>
                    Hours used per day must be between 0 and 24.
                </p>
            `;

            return;
        }


        if (price < 0) {

            results.innerHTML = `
                <h3>Invalid Electricity Price</h3>

                <p>
                    Electricity price cannot be negative.
                </p>
            `;

            return;
        }


        /* =====================================
           CALCULATIONS
        ===================================== */


        /*
         * Convert watts to kilowatts
         */
        const powerInKilowatts =
            power / 1000;


        /*
         * Daily energy consumption
         *
         * kWh = kW × hours
         */
        const dailyEnergy =
            powerInKilowatts * hours;


        /*
         * Monthly energy consumption
         *
         * Assume 30 days per month.
         */
        const monthlyEnergy =
            dailyEnergy * 30;


        /*
         * Yearly energy consumption
         *
         * Assume 365 days per year.
         */
        const yearlyEnergy =
            dailyEnergy * 365;


        /*
         * Monthly cost
         *
         * price is cents/kWh,
         * therefore divide by 100
         * to convert cents to dollars.
         */
        const monthlyCost =
            (monthlyEnergy * price) / 100;


        /*
         * Yearly cost
         */
        const yearlyCost =
            (yearlyEnergy * price) / 100;


        /* =====================================
           DISPLAY RESULTS
        ===================================== */

        results.innerHTML = `

            <h3>Energy Consumption Results</h3>

            <p>
                <strong>Daily energy:</strong>
                ${dailyEnergy.toFixed(2)} kWh
            </p>

            <p>
                <strong>Monthly energy:</strong>
                ${monthlyEnergy.toFixed(2)} kWh
            </p>

            <p>
                <strong>Yearly energy:</strong>
                ${yearlyEnergy.toFixed(2)} kWh
            </p>

            <p>
                <strong>Estimated monthly cost:</strong>
                $${monthlyCost.toFixed(2)}
            </p>

            <p>
                <strong>Estimated yearly cost:</strong>
                $${yearlyCost.toFixed(2)}
            </p>

        `;

    });

}