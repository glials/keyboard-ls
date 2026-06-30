<p align="center">
  <img src="logo.png" />
</p>

<p align="center">A desktop app for viewing and exploring keyboard layouts.</p>

## Prerequisites

Install the following before cloning the repository.

### Rust

Tauri compiles a Rust backend. Install Rust with [rustup](https://rustup.rs/):

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Restart your terminal after installation, then verify:

```bash
rustc --version
cargo --version
```

### Node.js

Use the current [Node.js LTS](https://nodejs.org/) release (v20 or later recommended).

```bash
node -v
npm -v
```

### Yarn

Tauri's build hooks invoke Yarn to start the Vite dev server and build the frontend. Enable it via [Corepack](https://nodejs.org/api/corepack.html) (included with Node.js):

```bash
corepack enable
yarn -v
```

### Linux system dependencies

On Debian, Ubuntu, Pop!_OS, and other Debian-based distros, install Tauri's required libraries:

```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

For other Linux distributions, see the [Tauri prerequisites guide](https://v2.tauri.app/start/prerequisites/).

### macOS

Install Xcode (from the App Store) or the Xcode Command Line Tools:

```bash
xcode-select --install
```

### Windows

Install the [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) with the **Desktop development with C++** workload, and the [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/).

See the [Tauri prerequisites guide](https://v2.tauri.app/start/prerequisites/) for full platform-specific instructions.

## Installation

Clone the repository and install JavaScript dependencies:

```bash
git clone git@github.com:glials/keyboard-ls.git
cd keyboard-ls
npm install
```

You can use Yarn instead if you prefer (`yarn install`). Either package manager works; both lockfiles are present in the repo.

> **Note:** `npm install` (or `yarn install`) is required before running any Tauri commands. The Tauri CLI is installed locally as a dev dependency — it is not available globally unless you install it separately.

## Development

Start the app in development mode (Vite on port 1420 + Tauri window):

```bash
npm run tauri dev
```

The first run compiles Rust dependencies and may take several minutes. Subsequent runs are much faster.

To work on the frontend only in a browser (without the Tauri shell):

```bash
npm run dev
```

Then open [http://localhost:1420](http://localhost:1420).

## Building

Create a production build and installer/bundle for your platform:

```bash
npm run tauri build
```

Output is written to `src-tauri/target/release/` and `src-tauri/target/release/bundle/`.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server on port 1420 |
| `npm run build` | Type-check and build the frontend to `dist/` |
| `npm run preview` | Preview the production frontend build |
| `npm run tauri dev` | Run the full Tauri development app |
| `npm run tauri build` | Build the production desktop app |

## Project structure

```
keyboard-ls/
├── src/                  # Frontend (TypeScript, Tailwind)
│   ├── keyboards/        # Keyboard layout definitions and rendering
│   └── ui/               # Title bar, mode selector, keyboard manager
├── src-tauri/            # Rust backend and Tauri configuration
└── dist/                 # Production frontend build output
```

## Troubleshooting

### `sh: 1: tauri: not found`

Dependencies are not installed. Run `npm install` in the project root.

### `yarn: command not found` when running `npm run tauri dev`

Tauri uses Yarn internally for the frontend dev server and build step. Run `corepack enable`, then verify with `yarn -v`.

### Missing system libraries on Linux

If the Rust build fails with errors about `webkit2gtk`, `gtk`, or similar, install the [Linux system dependencies](#linux-system-dependencies) listed above.

### Port 1420 already in use

Another process is using the Vite dev port. Stop that process or change the port in `vite.config.ts` and update `devUrl` in `src-tauri/tauri.conf.json` to match.

For more help, see the [Tauri troubleshooting guide](https://v2.tauri.app/develop/debug/) or the [Tauri Discord](https://discord.com/invite/tauri).

## Recommended IDE setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

<hr />

<center>
Built with <a href="https://v2.tauri.app" target="_blank">Tauri 2</a>, <a href="https://vite.dev" target="_blank">Vite</a>, TypeScript, and Tailwind CSS.
</center>
