# Poke-extention
・This extension is loaded by placing the "dist-chrome" folder.
・You are not allowed to use this extension for commercial purposes.
・You can select the Mouse Tracker mode and Corner Pin mode from the [PokeExtension] option in the right-click menu.
・When in Corner Pin mode, if you click on a Pokémon, it will move clockwise, and the displayed Pokémon will change accordingly.
# Template for a browser extension

Build a browser extension with React + TypeScript + esbuild.
Supporting both Firefox and Chrome.

## Basic Usage

Following examples are for `yarn`. For `npm`, please translate by yourself.

### Build

Firefox:

```.bash
npm run build:firefox
```

With watch mode:

```.bash
npm run build:firefox --watch
```

Enable source map:

```.bash
npm run build:firefox --dev
```

Chrome:

```.bash
npm run build:chrome
```

Build for both browsers:

```.bash
npm run build
```

### Run with browsers

Firefox:

```.bash
npm run run:firefox
```

Chrome

```.bash
npm run run:chrome
```

### Create a package for Firefox (zip)

```.bash
npm run package:firefox
```

To install an unsigned add-on, you must use Firefox Developer Edition.
<https://support.mozilla.org/en-US/kb/add-on-signing-in-firefox>

## Customization

### Change Add-on ID for Firefox

Edit `firefox.json`.
It looks like ID need to match following format:

- `{<UUID>}`
  - e.g. `{abac34b6-b4bd-4fc7-af89-6f7d30be386b}`
- `<alphanum>@<alphanum>`
  - e.g. `dummy@dummy`

cf. <https://stackoverflow.com/questions/45339492/firefox-add-on-id-conventions>

### Add background_scripts, etc

Edit `build.ts` and configure [esbuild](https://esbuild.github.io/).

## For Japanese users

Here is an article about this template.

- <https://zenn.dev/htlsne/articles/web-ext-react-esbuild>
ld
- <https://zenn.dev/sota_yamaguchi/articles/6e70026e1465e4>
