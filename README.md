# Weekly Goal 2025 - Vue3 + Vite + Capacitor

Weekly goal tracking app built with Vue 3, Vite, and Capacitor for iOS deployment.

## Basic commands

- `pnpm i` : install all packages & dependencies
- `pnpm dev` : start dev server with hotreload
- `pnpm build` : build the productions files in /dist

## iOS Development with Capacitor

### Prerequisites
- macOS with Xcode installed (latest version recommended)
- CocoaPods: `sudo gem install cocoapods`
- iOS Simulator or a physical iOS device for testing

### Capacitor Commands

- `pnpm ios` : Build web app, sync to iOS, and run on simulator/device (shortcut)
- `pnpm cap:sync` : Build the web app and sync to iOS project
- `pnpm cap:open:ios` : Open the iOS project in Xcode
- `pnpm cap:run:ios` : Build, sync, and run the app on iOS

### First Time Setup

1. Install dependencies:
   ```bash
   pnpm i
   ```

2. Build the web app and sync to iOS:
   ```bash
   pnpm cap:sync
   ```

3. Open in Xcode to configure signing:
   ```bash
   pnpm cap:open:ios
   ```
   - In Xcode, select the "App" target
   - Go to "Signing & Capabilities"
   - Select your development team
   - Xcode will automatically create a provisioning profile

4. Run the app:
   ```bash
   pnpm ios
   ```

### Development Workflow

1. Make changes to your web app in `src/`
2. Run `pnpm cap:sync` to rebuild and sync changes to iOS
3. The app will hot-reload in the simulator/device

### Important Notes

- The iOS project is located in the `ios/` directory
- Native iOS code can be modified in Xcode if needed
- App configuration is in `capacitor.config.ts`
- Always run `pnpm cap:sync` after making changes to ensure iOS project is updated

## Optimize Commands

- `pnpm optimizeImg`: Convert .jpg/.png to .webp/.avif in `public/img/`
  - New files are lossy 90%
  - Delete original files
  - Skip if .webp/.avif exists
- `pnpm optimizeAudio`: Optimize audio in `public/audio/`
- `pnpm optimizeVideo`: Optimize video in `public/video/`
- `pnpm optimizeKtx`: convert img to textures

## Workflow commands 
- `pnpm copyDropbox` : watch a dropbox/drive folder and copy the assets to `public/`
- `pnpm updateTrad` : update traduction files from airtable
  - Config your airtable apikey in .env file
  - Need install : `pnpm i airtable dotenv`
  - Works perfectly with /src/plugins/TranslationPlugins


## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + extensions : 
  - Formating and linting
    + [Eslint] linting & code formating
    + [EditorConfig] code formating (spacing/tabs)
    + [Vue - Volar] Format vue file
  - Code assistant
    + [Git Copilot] 
    + [Path Intellisense]
    + [Npm Intellisens]

VSCode `settings.json` in your user preference
```json
{
  "editor.inlineSuggest.enabled": true,
  "settingsSync.ignoredExtensions": [],
  "settingsSync.ignoredSettings": [],
  "editor.formatOnSave": true,
  "editor.formatOnType": false,
  "editor.codeActionsOnSave": [
    "source.fixAll"
  ],
  "eslint.codeActionsOnSave.mode": "all",
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "vue",
    "json",
    "jsonc",
    "json5"
  ],
  "editor.formatOnSaveMode": "file",
  "files.autoSave": "onFocusChange",
  "git.confirmSync": false,
  "git.enableSmartCommit": true,
  "javascript.updateImportsOnFileMove.enabled": "always",
  "git.autofetch": true,
  "workbench.colorTheme": "Default Dark Modern",
  "security.workspace.trust.untrustedFiles": "open",
  "githubPullRequests.pullBranch": "never",
  "explorer.confirmDelete": false,
  "github.copilot.editor.enableAutoCompletions": true,
  "eslint.format.enable": true,
  "eslint.lintTask.enable": true,
  "eslint.ignoreUntitled": true,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.formatOnPaste": true,
  "diffEditor.ignoreTrimWhitespace": false,
  "[javascript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[jsonc]": {
    "editor.tabCompletion": "on",
    "editor.tabSize": 2
  },
  "[vue]": {
    "editor.defaultFormatter": "Vue.volar"
  }
}
```