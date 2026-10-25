(function () {
  var pref = "system";
  try {
    var stored = localStorage.getItem("pipsology-appearance");
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
    chalk: "#F5F5F5",
    night: "#121212",
    slate: "#E8EEF4",
    ledger: "#14161C",
    meadow: "#E6F2EA",
  };
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", colors[theme] || colors.chalk);
})();
