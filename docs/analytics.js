(function () {
  "use strict";

  var optOutKey = "jaylen_ga4_opt_out";
  var measurementId = "G-V09SKB92BX";

  function optedOut() {
    try {
      return window.localStorage.getItem(optOutKey) === "true";
    } catch (error) {
      return false;
    }
  }

  window.disableSiteAnalytics = function () {
    try {
      window.localStorage.setItem(optOutKey, "true");
    } catch (error) {
      // Continue disabling analytics for this page when storage is unavailable.
    }
    window["ga-disable-" + measurementId] = true;
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", { analytics_storage: "denied" });
    }
  };

  var optOutButton = document.querySelector("[data-analytics-opt-out]");
  if (optOutButton) {
    optOutButton.addEventListener("click", function () {
      window.disableSiteAnalytics();
      optOutButton.textContent = "Analytics disabled";
      optOutButton.disabled = true;
    });
  }

  if (optedOut()) {
    window["ga-disable-" + measurementId] = true;
    return;
  }

  var campaignKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  var campaign = {};

  try {
    var query = new URLSearchParams(window.location.search);
    campaignKeys.forEach(function (key) {
      var value = query.get(key);
      if (value) sessionStorage.setItem("jaylen_" + key, value);
      var stored = sessionStorage.getItem("jaylen_" + key);
      if (stored) campaign[key] = stored;
    });
  } catch (error) {
    campaign = {};
  }

  function send(name, parameters) {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, Object.assign({}, campaign, parameters || {}));
    }
  }

  if (campaign.utm_source) {
    send("campaign_visit", {
      page_location: window.location.href,
      page_title: document.title
    });
  }

  var main = document.querySelector("main[data-page-type]");
  var openGraphType = document.querySelector('meta[property="og:type"]');
  var pageType = main ? main.dataset.pageType : (openGraphType && openGraphType.content === "article" ? "article" : "page");

  if (pageType === "article" || pageType === "blog_article") {
    send("article_view", {
      article_title: document.querySelector("h1") ? document.querySelector("h1").textContent.trim() : document.title,
      page_location: window.location.href
    });
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[href]");
    if (!link) return;

    var href = link.getAttribute("href") || "";
    var parameters = {
      link_text: link.textContent.trim().slice(0, 100),
      page_type: pageType
    };

    if (link.closest(".meeting-card")) {
      parameters.link_type = href.indexOf("tel:") === 0 ? "phone" : "form";
      send("booking_click", parameters);
    } else if (href.indexOf("tel:") === 0) {
      parameters.link_type = "phone";
      send("phone_click", parameters);
    } else if (href.indexOf("mailto:") === 0) {
      parameters.link_type = "email";
      send("email_click", parameters);
    } else if (link.hostname && link.hostname !== window.location.hostname) {
      parameters.link_type = "external";
      parameters.link_domain = link.hostname;
      send("outbound_click", parameters);
    }
  });

  window.trackSiteEvent = send;
})();
