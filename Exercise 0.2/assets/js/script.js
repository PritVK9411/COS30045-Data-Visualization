/*FAQ ACCORDION*/

document.addEventListener("DOMContentLoaded", function () {

    // Find all FAQ questions
    const faqQuestions = document.querySelectorAll(".faq-question");

    // Add a click event to every FAQ question
    faqQuestions.forEach(function (question) {

        question.addEventListener("click", function () {

            // Find the answer belonging to this question
            const answer = this.nextElementSibling;

            // Show or hide the answer
            answer.classList.toggle("show");

        });

    });

});