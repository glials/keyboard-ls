import { getCurrentWindow } from '@tauri-apps/api/window';
import { KeyboardRenderer } from './keyboards/renderer';
import { KeyboardLoader } from './keyboards/loader';
import { KeyboardLayout } from './keyboards/layouts';

// Titlebar controls
const minimizeBtn = document.getElementById('titlebar-minimize');
const maximizeBtn = document.getElementById('titlebar-maximize');
const closeBtn = document.getElementById('titlebar-close');

const appWindow = getCurrentWindow();

minimizeBtn?.addEventListener('click', () => appWindow.minimize());
maximizeBtn?.addEventListener('click', () => appWindow.toggleMaximize());
closeBtn?.addEventListener('click', () => appWindow.close());

// Initialize keyboard renderer
let keyboardRenderer: KeyboardRenderer;
let currentKeyboardId: string;

// Mode toggle buttons
const linuxBtn = document.getElementById('mode-linux') as HTMLButtonElement;
const macosBtn = document.getElementById('mode-macos') as HTMLButtonElement;
const explanationText = document.getElementById('mode-explanation') as HTMLParagraphElement;

let currentMode: 'linux' | 'macos' = 'linux';

const explanations = {
  linux: 'Commands will use <span class="text-blue-400 font-medium">Ctrl+C</span>, <span class="text-blue-400 font-medium">Ctrl+V</span>, <span class="text-blue-400 font-medium">Alt+Tab</span>, etc.',
  macos: 'Commands will use <span class="text-blue-400 font-medium">Cmd+C</span>, <span class="text-blue-400 font-medium">Cmd+V</span>, <span class="text-blue-400 font-medium">Cmd+Tab</span>, etc.'
};

function setMode(mode: 'linux' | 'macos') {
  currentMode = mode;
  
  if (mode === 'linux') {
    linuxBtn.classList.add('bg-neutral-600', 'text-white');
    linuxBtn.classList.remove('text-gray-300', 'hover:bg-neutral-600');
    
    macosBtn.classList.remove('bg-neutral-600', 'text-white');
    macosBtn.classList.add('text-gray-300', 'hover:bg-neutral-600');
  } else {
    macosBtn.classList.add('bg-neutral-600', 'text-white');
    macosBtn.classList.remove('text-gray-300', 'hover:bg-neutral-600');
    
    linuxBtn.classList.remove('bg-neutral-600', 'text-white');
    linuxBtn.classList.add('text-gray-300', 'hover:bg-neutral-600');
  }
  
  explanationText.innerHTML = explanations[mode];
  
  // Update Win/Cmd labels on keyboard
  updateMetaKeyLabels(mode);
  
  console.log('Mode switched to:', mode);
}

function updateMetaKeyLabels(mode: 'linux' | 'macos') {
  const metaLeft = document.querySelector('[data-key="MetaLeft"]');
  const metaRight = document.querySelector('[data-key="MetaRight"]');
  
  if (metaLeft && metaRight) {
    const label = mode === 'linux' ? 'win' : 'cmd';
    const sublabel = mode === 'linux' ? 'alt' : 'opt';
    
    metaLeft.innerHTML = `<span class="text-center leading-tight text-[10px]">${label}<br/>${sublabel}</span>`;
    metaRight.innerHTML = `<span class="text-center leading-tight text-[10px]">${label}<br/>${sublabel}</span>`;
  }
}

linuxBtn?.addEventListener('click', () => setMode('linux'));
macosBtn?.addEventListener('click', () => setMode('macos'));

// Initialize keyboard
async function initializeKeyboard() {
  try {
    console.log('Loading keyboard...');
    
    let keyboard = await KeyboardLoader.detectKeyboard();
    
    if (!keyboard) {
      keyboard = await KeyboardLoader.loadDefaultKeyboard();
    }

    currentKeyboardId = keyboard.id;
    console.log('Loaded:', currentKeyboardId);
    
    keyboardRenderer = new KeyboardRenderer('keyboard');
    keyboardRenderer.render(keyboard.html);
    
    console.log('Keyboard rendered');
  } catch (error) {
    console.error('Failed to load keyboard:', error);
  }
}

async function switchKeyboard(keyboardId: string) {
  try {
    const html = await KeyboardLoader.loadTemplate(keyboardId);
    keyboardRenderer.render(html);
    currentKeyboardId = keyboardId;
    console.log('Switched to:', keyboardId);
  } catch (error) {
    console.error('Failed to switch keyboard:', error);
  }
}

initializeKeyboard();

(window as any).switchKeyboard = switchKeyboard;
