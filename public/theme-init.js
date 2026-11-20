(function () {
  var pref = "system";
  try {
    var stored = localStorage.getItem("tradey-markets-appearance");
    if (
      stored === "system" ||
      stored === "chalk" ||
      stored === "night" ||
      stored === "slate" ||
      stored === "ledger" ||
      stored === "meadow"
    ) {
      pref = stored;
    }
  } catch (e) {
    pref = "system";
  }
  var dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  var theme = pref === "system" ? (dark ? "night" : "chalk") : pref;
  document.documentElement.setAttribute("data-appearance", pref);
  document.documentElement.setAttribute("data-theme", theme);
  var colors = {
    chalk: "#FFFFFF",
    night: "#0B0D10",
    slate: "#F0F5FA",
    ledger: "#10131A",
    meadow: "#EEF7FC",
  };
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", colors[theme] || colors.chalk);
})();
