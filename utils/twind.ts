import { IS_BROWSER } from "$fresh/runtime.ts";
import { apply, Configuration, cssomSheet, setup, Sheet } from "twind";
export * from "twind";
export const config: Configuration = {
  darkMode: "class",
  mode: "silent",
  hash: true
};
if (IS_BROWSER) {
  const el = document.getElementById("__FRSH_STYLE");
  const rules = el.innerText.split("\n");
  const mappings = JSON.parse(rules.pop()!.slice(2, -2));
  const precedences = JSON.parse(rules.pop()!.slice(2, -2));
  const state = [precedences, new Set(rules), new Map(mappings), true];
  const sheet: Sheet = {
    ...cssomSheet({ target: el.sheet! }),
    init(cb) {
      return cb(state.shift());
    },
  };
  config.sheet = sheet;
  setup(config);
}
