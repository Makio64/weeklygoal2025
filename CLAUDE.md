# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 + Vite boilerplate for creative coding, visual experiments, and interactive websites. It integrates Three.js (WebGPU version) for 3D graphics with a custom creative coding framework called "makio".

## Essential Commands

### Development
- `pnpm dev` - Start development server with host access
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint with auto-fix

### Asset Optimization
- `pnpm optimizeImg` - Convert images to WebP/AVIF (lossy 90%, deletes originals)
- `pnpm optimizeAudio` - Optimize audio files
- `pnpm optimizeVideo` - Optimize video files
- `pnpm optimizeKtx` - Convert images to KTX textures for 3D

### Workflow
- `pnpm copyDropbox` - Watch and copy assets from Dropbox/Drive
- `pnpm updateTrad` - Update translations from Airtable (requires .env setup)

## Architecture

### Core Structure
- **Entry**: `index.html` → `src/main.js` → `src/App.vue`
- **Views**: `src/views/` - Vue components for different routes
- **3D Management**: `src/3d/Manager3D.js` - Three.js scene setup and management
- **2D Management**: `src/2d/Manager2D.js` - 2D graphics management (Pixi.js support)
- **Makio Framework**: `src/makio/` - Extensive utility library

### Makio Framework (`/src/makio/`)

#### Core Classes
- **Signal** - Event dispatcher with pooled nodes
- **Stage** - Main update/render loop manager

#### 2D Graphics
- **Stage2d** - Pixi.js integration and scene management

#### Audio
- **AudioAnalyser** - Real-time frequency/wave analysis
- **AudioDebuger** - Visual frequency debug tool
- **FrequencyRangeAnalyser** - Beat detection for ranges
- **SongSpectrum** - Waveform visualization generator
- **audio** - Main audio manager with playlist

#### Generative/Procedural
- **Border** - Bordered frame mesh generator
- **Circle** - Circular mesh with texture mapping
- **Grid** - 2D grid with zone allocation
- **QuadTree** - 2D recursive space partitioning
- **QuadTree3D** - 3D octree partitioning
- **SVG** - SVG path builder with animation

#### Three.js Integration
- **Stage3D** - WebGPU/WebGL renderer management
- **Assets** - GLTF/texture loader with tracking
- **PostProcess** - Effects composer
- **TextureAtlas** - Dynamic atlas generator
- **OrbitControl** - Camera orbit controls
- **RoundedBox** - Rounded corner geometry
- **text2geometries** - Text to 3D geometry
- **text2texture** - Text to texture renderer

#### TSL Shader Nodes
- **snoise/snoise3d** - Simplex noise generators
- **fastnoise/vnoise** - Optimized noise functions
- **vignette** - Screen vignette effects
- **dithering** - Dithering patterns
- **gradient** - Color gradient mapping
- **oklabmix** - Perceptual color mixing
- **jelly** - Deformation effects

#### Input Handling
- **SwipeManager** - Touch/mouse swipe detection
- **keyboard/mouse/wheel** - Input event handlers
- **pinch** - Pinch gesture detection

#### Utils
- **CanvasImage** - Optimized image loader
- **Scene/sceneTraveler** - Scene management
- **ObjectPool** - Performance object pooling
- **DoubleLinkedList** - Linked list structure
- **InactivityDetector** - User activity monitor
- **TaskTimer/Ticker** - Timing utilities

### TSL Shaders
Custom Three.js Shading Language nodes in `src/makio/tsl/`:
- Color manipulation (HSL, OKLab)
- Noise generators (fbm, perlin, voronoi)
- Effects (blur, chromatic aberration, distortion)
- Utility functions for creative effects

## Key Technical Details

### Build Configuration
- **Vite**: HTTPS dev server, auto-imports, CSS injection
- **Three.js**: Uses WebGPU renderer by default
- **Stylus**: CSS preprocessor support
- **ESLint**: No semicolons, tabs for indentation

### Performance Optimizations
- Aggressive minification in production
- Asset optimization pipeline for images/audio/video
- Font subsetting support
- Progressive web app capabilities

### Development Patterns
- Vue 3 Composition API
- Signal-based state management (custom implementation)
- Modular architecture with clear separation of concerns
- WebGPU-first approach for 3D graphics

## Common Tasks

### Adding a New 3D Scene
1. Create component in `src/views/`
2. Import and initialize `Manager3D`
3. Use makio utilities for scene setup
4. Leverage TSL shaders for custom effects

### Working with Assets
- Place assets in `public/` directory
- Use optimization commands before deployment
- Images: prefer WebP/AVIF formats
- 3D textures: use KTX format for performance

### Internationalization
- Translation files in `src/locales/`
- Use `vue-tiny-translation` plugin
- Update from Airtable with `pnpm updateTrad`