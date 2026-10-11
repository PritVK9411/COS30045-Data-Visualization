/* =========================================================
   main.js
   Shared behaviour used across every page:
   - Insert the current year into the footer
   - FAQ accordion (show/hide) on the Home page
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  setFooterYear();
  initFaqAccordion();
});

/**
 * Writes the current year into any element with
 * data-current-year, so the footer never goes stale.
 */
function setFooterYear() {
  var yearTargets = document.querySelectorAll("[data-current-year]");
  var year = new Date().getFullYear();

  yearTargets.forEach(function (el) {
    el.textContent = year;
  });
}

/**
 * Accordion behaviour for the FAQ section.
 * Each question is a <button class="faq-question"> that
 * controls a sibling <div class="faq-answer">. Answers are
 * hidden by default (max-height: 0 in CSS) and are revealed
 * by setting max-height to the answer's real scrollHeight.
 *
 * Only one FAQ item is open at a time, and clicking an open
 * question closes it again.
 */
function initFaqAccordion() {
  var questions = document.querySelectorAll(".faq-question");

  if (!questions.length) {
    return; // Not on a page with a FAQ section
  }

  questions.forEach(function (button) {
    button.addEventListener("click", function () {
      var isOpen = button.getAttribute("aria-expanded") === "true";
      var answer = document.getElementById(button.getAttribute("aria-controls"));

      // Close every other item first (classic accordion behaviour)
      questions.forEach(function (otherButton) {
        if (otherButton !== button) {
          closeFaqItem(otherButton);
        }
      });

      if (isOpen) {
        closeFaqItem(button);
      } else {
        openFaqItem(button, answer);
      }
    });
  });
}

function openFaqItem(button, answer) {
  button.setAttribute("aria-expanded", "true");
  answer.style.maxHeight = answer.scrollHeight + "px";
}

function closeFaqItem(button) {
  var answer = document.getElementById(button.getAttribute("aria-controls"));
  button.setAttribute("aria-expanded", "false");
  if (answer) {
    answer.style.maxHeight = "0px";
  }
}
