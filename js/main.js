/* ==========================================================================
   JK Fencing — Trial Funnel interactions
   Vanilla JS, no dependencies. Builds WhatsApp deep-links from user input.
   ========================================================================== */

(function () {
  "use strict";

  /* --------------------------------------------------------------------
   * CONFIG — replace before going live
   * ------------------------------------------------------------------ */
  // JK Fencing's real WhatsApp number, digits only, country code first
  // (e.g. "60123456789" for a Malaysian +60 12-345 6789 number).
  // Left as a non-numeric placeholder on purpose so this demo can never
  // accidentally message a real stranger. [Confirm with JK Fencing]
  var WHATSAPP_NUMBER = "60XXXXXXXXX";

  function isNumberConfigured() {
    return /^\d{8,15}$/.test(WHATSAPP_NUMBER);
  }

  function waLink(message) {
    var number = isNumberConfigured() ? WHATSAPP_NUMBER : "";
    return "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
  }

  function openWhatsApp(message) {
    if (!isNumberConfigured()) {
      // eslint-disable-next-line no-console
      console.warn(
        "[JK Fencing] WhatsApp number is not yet configured in js/main.js — " +
        "update WHATSAPP_NUMBER before launch."
      );
    }
    window.open(waLink(message), "_blank", "noopener");
  }

  /* --------------------------------------------------------------------
   * Year stamp
   * ------------------------------------------------------------------ */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --------------------------------------------------------------------
   * Quick WhatsApp enquiry (hero + trial section shortcut)
   * Template: "Hi JK Fencing, I'm interested in the RM80 trial class for
   * [my child/myself]. The participant is [age] years old. Could I check
   * the available beginner sessions?"
   * ------------------------------------------------------------------ */
  var quickForm = document.getElementById("quick-whatsapp-form");
  if (quickForm) {
    quickForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(quickForm);
      var forWhom = data.get("forWhom") || "my child";
      var age = (data.get("quickAge") || "").toString().trim();

      var ageClause = age ? age + " years old" : "[age to be shared]";
      var message =
        "Hi JK Fencing, I'm interested in the RM80 trial class for " +
        forWhom +
        ". The participant is " +
        ageClause +
        ". Could I check the available beginner sessions?";

      openWhatsApp(message);
    });
  }

  /* --------------------------------------------------------------------
   * Full lead form -> WhatsApp enquiry
   * ------------------------------------------------------------------ */
  var leadForm = document.getElementById("lead-form");
  var leadStatus = document.getElementById("lead-form-status");

  if (leadForm) {
    leadForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!leadForm.checkValidity()) {
        leadForm.reportValidity();
        return;
      }

      var data = new FormData(leadForm);
      var name = (data.get("name") || "").toString().trim();
      var age = (data.get("age") || "").toString().trim();
      var firstTimer = data.get("firstTimer") || "[not specified]";
      var preferred = data.get("preferredTime") || "[not specified]";
      var phone = (data.get("phone") || "").toString().trim();

      var lines = [
        "Hi JK Fencing, I'd like to enquire about the RM80 trial class.",
        "Name: " + (name || "[not provided]"),
        "Age of participant: " + (age || "[not provided]"),
        "First-time fencer: " + firstTimer,
        "Preferred day/time: " + preferred,
        "Contact number: " + (phone || "[not provided]"),
      ];

      var message = lines.join("\n");

      if (leadStatus) {
        leadStatus.textContent = isNumberConfigured()
          ? "Opening WhatsApp with your details filled in…"
          : "Thanks! (Demo mode: add JK Fencing's WhatsApp number in js/main.js to enable live sending.)";
        leadStatus.className = "form-status form-status--ok";
      }

      openWhatsApp(message);
    });
  }

  /* --------------------------------------------------------------------
   * Populate every data-wa-link element with a plain enquiry link
   * (used for the header/secondary "Ask on WhatsApp" buttons)
   * ------------------------------------------------------------------ */
  var genericMessage =
    "Hi JK Fencing, I'd like to find out more about the RM80 trial class.";
  document.querySelectorAll("[data-wa-link]").forEach(function (el) {
    el.setAttribute("href", waLink(genericMessage));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
})();
