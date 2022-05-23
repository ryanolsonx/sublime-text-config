#!/usr/bin/env node

const fs = require("fs").promises;

async function main() {
  const [, , colorSchemeName, vsCodeJsonFilePath] = process.argv;

  const file = await fs.readFile(vsCodeJsonFilePath, "utf-8");
  const uncommented = file
    .split("\n")
    .map(line => line.split("//").join(""))
    .join("\n");

  const theme = JSON.parse(uncommented);
  const subl = {
    globals: {},
    rules: []
  };

  subl.globals.background = theme.colors["editor.background"];
  subl.globals.foreground = theme.colors["editor.foreground"];
  subl.globals.selection = theme.colors["editor.selectionBackground"];
  subl.globals.gutter_foreground = theme.colors["editorLineNumber.foreground"];
  subl.globals.gutter_foreground_highlight =
    theme.colors["editorLineNumber.activeForeground"];
  subl.globals.caret = theme.colors["editorCursor.foreground"];
  subl.globals.block_caret = theme.colors["editorCursor.foreground"];
  subl.globals.find_highlight = theme.colors["editor.findMatchBackground"];
  subl.globals.highlight = theme.colors["editor.findMatchHighlightBackground"];

  theme.tokenColors.forEach(token => {
    const rule = {};

    if (typeof token.scope === "string") {
      rule.scope = token.scope;
    } else {
      rule.scope = token.scope.join(", ");
    }

    if (token.settings) {
      if (token.settings.foreground) {
        rule.foreground = token.settings.foreground;
      }

      if (token.settings.background) {
        rule.background = token.settings.background;
      }
    }

    subl.rules.push(rule);
  });

  await fs.writeFile(
    `${colorSchemeName}.sublime-color-scheme`,
    JSON.stringify(subl, null, 4)
  );
}

main();
