/**
 * Renders keyboard layouts and handles key press visualization.
 * 
 * This class manages the display of keyboard HTML templates and provides
 * real-time visual feedback when physical keys are pressed by the user.
 */
export class KeyboardRenderer {

  /** The DOM element that contains the keyboard visualization */
  private container: HTMLElement;
  
  /** Set of currently pressed key codes to prevent duplicate animations */
  private activeKeys: Set<string> = new Set();

  /**
   * Creates a new KeyboardRenderer instance.
   * 
   * @param containerId - The ID of the DOM element where the keyboard will be rendered
   * @throws Error if no element with the specified ID exists
   * 
   * @example
   * const renderer = new KeyboardRenderer('keyboard');
   */
  constructor(containerId: string) {
    const element = document.getElementById(containerId);
    if (!element) {
      throw new Error(`Container "${containerId}" not found`);
    }
    this.container = element;
  }

  /**
   * Renders a keyboard layout from an HTML template string.
   * 
   * Replaces the container's content with the provided HTML and
   * sets up event listeners for key press visualization.
   * 
   * @param html - The keyboard HTML template to render
   * 
   * @example
   * const html = await KeyboardLoader.loadTemplate('logitech-k380');
   * renderer.render(html);
   */
  render(html: string): void {
    this.container.innerHTML = html;
    this.attachEventListeners();
  }

  /**
   * Attaches keyboard event listeners to the document.
   * 
   * Listens for keydown and keyup events globally to provide
   * visual feedback on the rendered keyboard.
   * 
   * @private
   */
  private attachEventListeners(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  /**
   * Handles keydown events to highlight pressed keys.
   * 
   * When a physical key is pressed, finds the corresponding visual key
   * in the rendered keyboard and applies active styling (scale down,
   * blue highlight, glow effect).
   * 
   * @param event - The keyboard event from the browser
   * @private
   */
  private handleKeyDown(event: KeyboardEvent): void {
    const key = this.container.querySelector(`[data-key="${event.code}"]`) as HTMLElement;
    if (key && !this.activeKeys.has(event.code)) {
      key.classList.add('scale-95', 'bg-blue-500');
      key.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.6)';
      this.activeKeys.add(event.code);
    }
  }

  /**
   * Handles keyup events to remove key highlighting.
   * 
   * When a physical key is released, removes the active styling
   * from the corresponding visual key.
   * 
   * @param event - The keyboard event from the browser
   * @private
   */
  private handleKeyUp(event: KeyboardEvent): void {
    const key = this.container.querySelector(`[data-key="${event.code}"]`) as HTMLElement;
    if (key) {
      key.classList.remove('scale-95', 'bg-blue-500');
      key.style.boxShadow = '';
      this.activeKeys.delete(event.code);
    }
  }

  /**
   * Cleans up the renderer by removing the keyboard and clearing state.
   * 
   * Removes all rendered content from the container and clears the
   * active keys set. Call this before destroying the renderer instance
   * or switching to a different keyboard.
   * 
   * @example
   * renderer.destroy();
   */
  destroy(): void {
    this.container.innerHTML = '';
    this.activeKeys.clear();
  }

}
