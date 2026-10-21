(function () {
      "use strict";

      /* Visual rendering and interaction are separate from the small content model. */
      var contentConfig = window.PERSONAL_SITE_CONFIG;
      var siteCopy = contentConfig.site;
      var boardPages = contentConfig.board.pages;
      var boardLanguages = contentConfig.board.languages;

      var boardLanguageIndex = 0;
      var boardPageIndex = 0;
      var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      var pendingRollElements = new Set();
      var pendingRollFrame = 0;
      var boardIsVisible = false;
      var scrollFlightFrame = 0;

      function scheduleRoll(element) {
        pendingRollElements.add(element);
        if (pendingRollFrame) return;
        pendingRollFrame = window.requestAnimationFrame(function () {
          pendingRollFrame = 0;
          var elements = Array.from(pendingRollElements);
          pendingRollElements.clear();
          elements.forEach(function (target) {
            if (target.isConnected && target.querySelector(".flight-roll-new")) {
              target.classList.add("is-rolling");
            }
          });
        });
      }

      function makeElement(tagName, className, text) {
        var element = document.createElement(tagName);
        if (className) element.className = className;
        if (typeof text !== "undefined") element.textContent = text;
        return element;
      }

      function makeAircraftIcon() {
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("aria-hidden", "true");
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M12 2.25c-.9 0-1.55.72-1.55 1.62v5.8L3 14.02v2.1l7.45-2.22v5.02l-2.08 1.45v1.54L12 20.84l3.63 1.07v-1.54l-2.08-1.45V13.9L21 16.12v-2.1l-7.45-4.35v-5.8c0-.9-.65-1.62-1.55-1.62Z");
        svg.appendChild(path);
        return svg;
      }

      function appendTemplateHeader(section, template, localized) {
        var header = makeElement("div", "template-page-head");
        header.appendChild(makeElement("span", "index", "T2 / " + template.index));
        var copy = makeElement("div");
        var title = makeElement("h2", "", localized.title);
        title.id = template.id + "-title";
        copy.appendChild(title);
        copy.appendChild(makeElement("p", "", localized.intro));
        header.appendChild(copy);
        section.appendChild(header);
        section.setAttribute("aria-labelledby", title.id);
      }

      function renderProfileTemplate(section, localized) {
        var ticket = makeElement("article", "profile-ticket");
        var route = makeElement("div", "ticket-route");
        route.appendChild(makeElement("small", "", "PERSONAL PROFILE / 个人档案 / 個人情報"));
        route.appendChild(makeElement("strong", "", localized.statement));
        var details = makeElement("div", "ticket-details");
        var detailsTop = makeElement("div", "ticket-details-top");
        detailsTop.appendChild(makeElement("span", "", "PASSENGER INFORMATION"));
        detailsTop.appendChild(makeElement("span", "", localized.status));
        details.appendChild(detailsTop);
        var facts = makeElement("dl", "ticket-facts");
        localized.facts.forEach(function (fact) {
          var row = makeElement("div", "ticket-fact");
          row.appendChild(makeElement("dt", "", fact.label));
          row.appendChild(makeElement("dd", "", fact.value));
          facts.appendChild(row);
        });
        details.appendChild(facts);
        ticket.appendChild(route);
        ticket.appendChild(details);
        section.appendChild(ticket);
      }

      function renderProjectsTemplate(section, localized) {
        var board = makeElement("div", "project-board");
        var head = makeElement("div", "project-board-head");
        head.appendChild(makeElement("b", "", "DEP"));
        head.appendChild(makeElement("strong", "", localized.boardTitle));
        head.appendChild(makeElement("span", "", "GATE / 项目编号 / STATUS"));
        board.appendChild(head);
        localized.items.forEach(function (item) {
          var row = makeElement("article", "project-row");
          row.appendChild(makeElement("b", "", item.code));
          var heading = makeElement("h3");
          if (item.url) {
            var link = makeElement("a", "", item.title);
            link.href = item.url;
            heading.appendChild(link);
          } else {
            heading.textContent = item.title;
          }
          row.appendChild(heading);
          row.appendChild(makeElement("p", "", item.text));
          row.appendChild(makeElement("span", "project-status", item.status));
          board.appendChild(row);
        });
        section.appendChild(board);
      }

      function renderTimelineTemplate(section, localized) {
        var panel = makeElement("div", "timeline-panel");
        var route = makeElement("div", "timeline-route");
        localized.items.forEach(function (item, index) {
          var stop = makeElement("article", "timeline-stop");
          stop.appendChild(makeElement("time", "", "STOP " + String(index + 1).padStart(2, "0")));
          stop.appendChild(makeElement("h3", "", item.title));
          stop.appendChild(makeElement("p", "", item.text));
          route.appendChild(stop);
        });
        panel.appendChild(route);
        section.appendChild(panel);
      }

      function renderTemplatePages(lang) {
        if (!contentConfig || !contentConfig.templates) return;
        var suite = document.querySelector(".template-suite");
        var nav = document.querySelector(".template-nav");
        var host = document.getElementById("template-pages");
        if (!host) {
          host = makeElement("div");
          host.id = "template-pages";
          suite.insertAdjacentElement("afterend", host);
          document.querySelectorAll(".template-page").forEach(function (page) { page.remove(); });
        }
        nav.textContent = "";
        host.textContent = "";
        contentConfig.templates.forEach(function (template) {
          var localized = template.copy[lang] || template.copy.zh;
          var navLink = makeElement("a", "", template.nav[lang] || template.nav.zh);
          navLink.href = "#" + template.id;
          navLink.setAttribute("data-number", template.index);
          nav.appendChild(navLink);

          var section = makeElement("section", "wrap template-page");
          section.id = template.id;
          appendTemplateHeader(section, template, localized);
          if (template.type === "profile") renderProfileTemplate(section, localized);
          if (template.type === "projects") renderProjectsTemplate(section, localized);
          if (template.type === "timeline") renderTimelineTemplate(section, localized);
          host.appendChild(section);
        });
      }

      function rollText(element, nextText, animate) {
        if (!element) return;
        if (!element.hasAttribute("data-current-text")) {
          element.setAttribute("data-current-text", element.textContent);
        }
        var oldValue = element.getAttribute("data-current-text");
        if (oldValue === nextText) return;
        /* Store the destination immediately so rapid input cannot replay stale text. */
        element.setAttribute("data-current-text", nextText);
        if (!animate || reduceMotion.matches) {
          pendingRollElements.delete(element);
          element.classList.remove("is-rolling", "flight-roll");
          element.textContent = nextText;
          return;
        }
        element.classList.remove("is-rolling");
        element.classList.add("flight-roll");
        element.textContent = "";
        var oldText = document.createElement("span");
        oldText.className = "flight-roll-old";
        oldText.textContent = oldValue;
        var newText = document.createElement("span");
        newText.className = "flight-roll-new";
        newText.textContent = nextText;
        element.appendChild(oldText);
        element.appendChild(newText);
        scheduleRoll(element);
        newText.addEventListener("animationend", function () {
          if (newText.parentNode !== element) return;
          element.classList.remove("is-rolling", "flight-roll");
          element.textContent = nextText;
        }, { once: true });
      }

      function setDestinationContent(container, value, label) {
        container.textContent = "";
        var primary = document.createElement("strong");
        primary.className = "board-value";
        primary.textContent = value;
        var secondary = document.createElement("small");
        secondary.className = "board-label";
        secondary.textContent = label;
        container.appendChild(primary);
        container.appendChild(secondary);
        container.setAttribute("data-current-destination", value);
        container.setAttribute("data-current-label", label);
      }

      function rollDestination(container, item, languageIndex, animate) {
        var nextValue = item.destination;
        var nextLabel = item.labels[languageIndex];
        if (!container.hasAttribute("data-current-destination")) {
          container.setAttribute("data-current-destination", container.querySelector(".board-value").textContent);
          container.setAttribute("data-current-label", container.querySelector(".board-label").textContent);
        }
        var currentValue = container.getAttribute("data-current-destination");
        var currentLabel = container.getAttribute("data-current-label");
        if (currentValue === nextValue && currentLabel === nextLabel) return;
        if (!animate || reduceMotion.matches) {
          pendingRollElements.delete(container);
          container.classList.remove("is-rolling", "flight-roll", "destination-roll");
          setDestinationContent(container, nextValue, nextLabel);
          return;
        }
        /* Track the requested value, not the last animation that happened to finish. */
        container.setAttribute("data-current-destination", nextValue);
        container.setAttribute("data-current-label", nextLabel);
        var oldPair = document.createElement("span");
        var newPair = document.createElement("span");
        oldPair.className = "flight-roll-old destination-pair";
        newPair.className = "flight-roll-new destination-pair";
        [
          [oldPair, currentValue, currentLabel],
          [newPair, nextValue, nextLabel]
        ].forEach(function (entry) {
          var primary = document.createElement("strong");
          var secondary = document.createElement("small");
          primary.textContent = entry[1];
          secondary.textContent = entry[2];
          entry[0].appendChild(primary);
          entry[0].appendChild(secondary);
        });
        container.classList.remove("is-rolling");
        container.classList.add("flight-roll", "destination-roll");
        container.textContent = "";
        container.appendChild(oldPair);
        container.appendChild(newPair);
        scheduleRoll(container);
        newPair.addEventListener("animationend", function () {
          if (newPair.parentNode !== container) return;
          container.classList.remove("is-rolling", "flight-roll", "destination-roll");
          setDestinationContent(container, nextValue, nextLabel);
        }, { once: true });
      }

      function renderBoardNavigation() {
        var routeMap = document.querySelector(".route-map");
        var pager = document.querySelector(".board-pager");
        routeMap.textContent = "";
        pager.textContent = "";
        boardPages.forEach(function (page, index) {
          var route = makeElement("a", "route-stop" + (index === 0 ? " is-current" : ""));
          route.href = "#flight-board";
          route.setAttribute("data-board-page", String(index));
          route.appendChild(makeElement("b", "", String(index + 1).padStart(2, "0")));
          var label = makeElement("span", "", page.name[1]);
          label.appendChild(makeElement("small", "", page.name[0] + " · " + page.name[2]));
          route.appendChild(label);
          routeMap.appendChild(route);

          var button = makeElement("button");
          button.type = "button";
          button.setAttribute("data-page", String(index));
          button.setAttribute("aria-pressed", String(index === 0));
          button.setAttribute("aria-label", "第 " + (index + 1) + " 页");
          pager.appendChild(button);
        });
        document.querySelector(".board-row:nth-child(2) span:last-child").textContent = String(boardPages.length).padStart(2, "0") + " PAGES";
      }

      function syncPageNavigation() {
        document.querySelectorAll("[data-board-page], .board-pager button").forEach(function (control) {
          var rawPage = control.hasAttribute("data-board-page") ? control.getAttribute("data-board-page") : control.getAttribute("data-page");
          var active = Number(rawPage) === boardPageIndex;
          control.classList.toggle("is-current", active);
          if (control.matches("button")) control.setAttribute("aria-pressed", String(active));
        });
        document.querySelector(".board-page-count").innerHTML = "PAGE <b>" + String(boardPageIndex + 1).padStart(2, "0") + "</b> / " + String(boardPages.length).padStart(2, "0");
        var posterCount = document.querySelector(".poster-note span:last-child");
        posterCount.innerHTML = "PAGE <b id=\"poster-page\">" + String(boardPageIndex + 1).padStart(2, "0") + "</b> / " + String(boardPages.length).padStart(2, "0");
      }

      function ensureBoardRows(count) {
        var rowsHost = document.querySelector(".flight-rows");
        while (rowsHost.children.length > count) rowsHost.lastElementChild.remove();
        while (rowsHost.children.length < count) {
          var row = makeElement("div", "flight-row");
          row.appendChild(makeElement("time", "scheduled-time"));
          row.appendChild(makeElement("time", "revised-time"));
          var destination = makeElement("span", "flight-destination");
          destination.appendChild(makeElement("strong", "board-value"));
          destination.appendChild(makeElement("small", "board-label"));
          row.appendChild(destination);
          var flightCode = makeElement("span", "flight-code");
          flightCode.appendChild(makeElement("span", "airline-logo logo-kite", "KITE"));
          flightCode.appendChild(makeElement("b", "flight-number"));
          row.appendChild(flightCode);
          row.appendChild(makeElement("span", "flight-note"));
          rowsHost.appendChild(row);
        }
        document.querySelector(".flight-board").style.setProperty("--board-row-count", String(count));
      }

      function setBoard(pageIndex, languageIndex, animate) {
        boardPageIndex = (pageIndex + boardPages.length) % boardPages.length;
        boardLanguageIndex = (languageIndex + boardLanguages.length) % boardLanguages.length;
        var language = boardLanguages[boardLanguageIndex];
        var page = boardPages[boardPageIndex];
        ensureBoardRows(page.rows.length);
        var rows = document.querySelectorAll(".flight-row");
        rows.forEach(function (row, index) {
          var item = page.rows[index];
          rollText(row.querySelector(".scheduled-time"), item.time, animate);
          rollText(row.querySelector(".revised-time"), item.revised, animate);
          rollDestination(row.querySelector(".flight-destination"), item, boardLanguageIndex, animate);
          rollText(row.querySelector(".flight-number"), item.number, animate);
          var note = row.querySelector(".flight-note");
          if (item.url && note.tagName !== "A") {
            var noteLink = makeElement("a", "flight-note");
            note.replaceWith(noteLink);
            note = noteLink;
          } else if (!item.url && note.tagName === "A") {
            var noteText = makeElement("span", "flight-note");
            note.replaceWith(noteText);
            note = noteText;
          }
          if (item.url) {
            note.href = item.url;
            if (/^https?:/i.test(item.url)) {
              note.target = "_blank";
              note.rel = "noopener noreferrer";
            }
          }
          rollText(note, item.note || "", animate);
          var logo = row.querySelector(".airline-logo");
          var carrier = item.airline === "KT"
            ? { name: "KITE", className: "logo-kite" }
            : { name: "ARC", className: "logo-orbit" };
          logo.textContent = "";
          logo.appendChild(makeAircraftIcon());
          logo.appendChild(makeElement("span", "", carrier.name));
          logo.className = "airline-logo " + carrier.className;
        });
        var message = language.message.replace("%p", String(boardPageIndex + 1)).replace("%n", page.name[boardLanguageIndex]);
        rollText(document.querySelector(".flight-message-text"), message, animate);
        var languageCount = String(boardLanguages.length).padStart(2, "0");
        rollText(document.querySelector(".flight-language"), language.code + "  0" + (boardLanguageIndex + 1) + " / " + languageCount, animate);
        syncPageNavigation();
      }

      function setSiteLanguage(lang) {
        var copy = siteCopy[lang] || siteCopy.zh;
        document.documentElement.lang = copy.htmlLang;
        document.documentElement.setAttribute("data-ui-lang", lang);
        document.title = copy.title;
        document.querySelector(".skip").textContent = copy.skip;
        document.querySelector(".topline > span:first-child").textContent = copy.city;
        document.querySelector(".topline .terminal").textContent = copy.terminal;
        document.getElementById("hero-greeting").textContent = copy.greeting;
        document.querySelector(".name-zh").textContent = contentConfig.identity.name;
        document.getElementById("hero-lede").textContent = copy.lede;
        document.getElementById("hero-meta").innerHTML = "<span>" + copy.meta[0] + "</span><span>" + copy.meta[1] + "</span>";
        document.getElementById("flight-title").textContent = copy.flightTitle;
        document.getElementById("flight-intro-copy").textContent = copy.flightIntro;
        document.getElementById("template-suite-title").textContent = copy.suiteTitle;
        document.querySelector(".template-suite-copy p").textContent = copy.suiteIntro;
        document.querySelector(".board-prev").setAttribute("aria-label", copy.prev);
        document.querySelector(".board-next").setAttribute("aria-label", copy.next);
        var footer = document.querySelector("footer");
        footer.setAttribute("data-route", copy.route);
        footer.querySelector("p").textContent = copy.footer;
        footer.querySelector("small").textContent = copy.footerSmall;
        renderTemplatePages(lang);
        document.querySelectorAll(".lang-switch button").forEach(function (button) {
          button.setAttribute("aria-pressed", String(button.getAttribute("data-lang") === lang));
        });
        var languageMap = { zh: 0, en: 1, ja: 2 };
        setBoard(boardPageIndex, languageMap[lang], false);
      }

      function updateHanedaClock() {
        var clock = document.querySelector(".flight-clock");
        var now = new Date();
        clock.textContent = "HND  " + new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Tokyo",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }).format(now);
        clock.setAttribute("datetime", now.toISOString());
      }

      function scheduleScrollFlight() {
        if (scrollFlightFrame) return;
        scrollFlightFrame = window.requestAnimationFrame(function () {
          scrollFlightFrame = 0;
          var aircraft = document.querySelector(".scroll-flight");
          var scrollRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
          var progress = Math.max(0, Math.min(1, window.scrollY / scrollRange));
          var aircraftWidth = aircraft.getBoundingClientRect().width;
          var travel = Math.max(0, window.innerWidth - aircraftWidth);
          aircraft.style.setProperty("--flight-x", (travel * progress) + "px");
          aircraft.style.setProperty("--flight-progress", String(progress));
        });
      }

      renderBoardNavigation();
      document.querySelectorAll(".lang-switch button").forEach(function (button) {
        button.addEventListener("click", function () { setSiteLanguage(button.getAttribute("data-lang")); });
      });
      document.querySelectorAll("[data-board-page], .board-pager button").forEach(function (control) {
        control.addEventListener("click", function () {
          var rawPage = control.hasAttribute("data-board-page") ? control.getAttribute("data-board-page") : control.getAttribute("data-page");
          setBoard(Number(rawPage), boardLanguageIndex, true);
        });
      });
      document.querySelector(".board-prev").addEventListener("click", function () {
        setBoard(boardPageIndex - 1, boardLanguageIndex, true);
      });
      document.querySelector(".board-next").addEventListener("click", function () {
        setBoard(boardPageIndex + 1, boardLanguageIndex, true);
      });

      var boardElement = document.querySelector(".flight-board");
      if ("IntersectionObserver" in window) {
        var boardObserver = new IntersectionObserver(function (entries) {
          boardIsVisible = entries.some(function (entry) { return entry.isIntersecting; });
        }, { threshold: 0.12 });
        boardObserver.observe(boardElement);
      } else {
        boardIsVisible = true;
      }
      window.setInterval(function () {
        if (!boardIsVisible || document.hidden || reduceMotion.matches || boardElement.matches(":focus-within")) return;
        setBoard(boardPageIndex + 1, boardLanguageIndex, true);
      }, 7000);

      window.addEventListener("scroll", scheduleScrollFlight, { passive: true });
      window.addEventListener("resize", scheduleScrollFlight, { passive: true });

      setSiteLanguage("zh");
      updateHanedaClock();
      scheduleScrollFlight();
      window.setInterval(updateHanedaClock, 30000);

    }());
