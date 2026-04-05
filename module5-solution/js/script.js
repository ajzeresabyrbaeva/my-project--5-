(function () {
  "use strict";

  var baseUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/";

  var $dc = {};
  window.$dc = $dc;

  function ajaxGet(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        callback(xhr.responseText); 
      }
    };
    xhr.send();
  }

  function insertProperty(str, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    return str.replace(new RegExp(propToReplace, "g"), propValue);
  }

  function chooseRandomCategory(categories) {
    var randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex];
  }

  function buildAndShowHomeHTML(homeHtmlSnippet, categories) {
    var randomCategory = chooseRandomCategory(categories);
    var homeHtml = insertProperty(homeHtmlSnippet, "randomCategoryShortName", randomCategory.short_name);
    document.querySelector("#main-content").innerHTML = homeHtml;
  }

  function showHome() {
    ajaxGet("snippets/home-snippet.html", function (homeHtmlSnippet) {
      ajaxGet(baseUrl + "categories.json", function (categories) {
        buildAndShowHomeHTML(homeHtmlSnippet, categories);
      });
    });
  }

  $dc.loadMenuItems = function (categoryShortName) {
    ajaxGet("snippets/menu-items-snippet.html", function (menuItemsHtmlSnippet) {
      ajaxGet(baseUrl + "menu_items/" + categoryShortName + ".json", function (categoryData) {
        var finalHTML = "";
        var items = categoryData.menu_items;
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          var itemHtml = menuItemsHtmlSnippet;
          itemHtml = insertProperty(itemHtml, "short_name", categoryShortName);
          itemHtml = insertProperty(itemHtml, "number", item.number);
          itemHtml = insertProperty(itemHtml, "name", item.name);
          itemHtml = insertProperty(itemHtml, "description", item.description);
          itemHtml = insertProperty(itemHtml, "price_small", item.price_small !== undefined ? "$" + item.price_small : "");
          itemHtml = insertProperty(itemHtml, "price_large", item.price_large !== undefined ? "$" + item.price_large : "");
          finalHTML += itemHtml;
        }
        document.querySelector("#main-content").innerHTML = "<h1>" + categoryData.category.name + "</h1>" + finalHTML;
      });
    });
  };

  function getRandomStarCount() {
    return Math.floor(Math.random() * 5) + 1;
  }

  function showAbout() {
    ajaxGet("snippets/about.html", function (aboutSnippet) {
      var starCount = getRandomStarCount();
      var processedHtml = aboutSnippet;
      for (var i = 1; i <= 5; i++) {
        var starClass = i <= starCount ? "fa fa-star" : "fa fa-star-o";
        processedHtml = insertProperty(processedHtml, "class" + i, starClass);
      }
      processedHtml = insertProperty(processedHtml, "starCount", starCount);
      document.querySelector("#main-content").innerHTML = processedHtml;
    });
  }

  function setupEventListeners() {
    document.querySelector("#restaurant-name a").addEventListener("click", function (e) {
      e.preventDefault();
      showHome();
    });
    document.querySelector("a[href='#about']").addEventListener("click", function (e) {
      e.preventDefault();
      showAbout();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupEventListeners();
    showHome();
  });
})();
