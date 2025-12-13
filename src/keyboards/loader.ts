import { KeyboardMetadata, KeyboardIndex } from './types';

export class KeyboardLoader {

  /**
   * In-memory cache for loaded keyboard HTML templates.
   * Maps keyboard ID to HTML content to avoid repeated file fetches.
   */
  private static cache: Map<string, string> = new Map();

  /**
   * Cached keyboard index containing metadata for all available keyboards.
   * Loaded once from index.json and reused for subsequent requests.
   */
  private static index: KeyboardIndex | null = null;

  /**
   * Loads the keyboard index from index.json.
   * The index contains metadata for all available keyboard layouts.
   *
   * This method implements caching - subsequent calls return the cached index
   * instead of fetching from the file again.
   *
   * @returns Promise that resolves to the keyboard index
   * @throws Error if the index file cannot be loaded or parsed
   *
   * @example
   * const index = await KeyboardLoader.loadIndex();
   * console.log(index.keyboards); // Array of keyboard metadata
   */
  static async loadIndex(): Promise<KeyboardIndex> {
    if (this.index) {
      return this.index; // Return cached index if already loaded
    }

    try {
      const response = await fetch('/src/keyboards/index.json');
      if (!response.ok) {
        throw new Error(`Failed to load keyboard index: ${response.statusText}`);
      }
      this.index = await response.json() as KeyboardIndex;
      return this.index;
    } catch (error) {
      console.error('Error loading keyboard index:', error);
      throw error;
    }
  }

  /**
   * Loads the HTML template for a specific keyboard layout.
   *
   * Templates are fetched from /src/keyboards/{id}/keyboard.html and cached
   * in memory. Subsequent calls for the same keyboard return the cached HTML
   * without making another network request.
   *
   * @param id - The unique identifier of the keyboard layout (e.g., "logitech-k380")
   * @returns Promise that resolves to the HTML template as a string
   * @throws Error if the keyboard ID is not found in the index
   * @throws Error if the template file cannot be loaded
   *
   * @example
   * const html = await KeyboardLoader.loadTemplate('logitech-k380');
   * document.getElementById('keyboard').innerHTML = html;
   */
  static async loadTemplate(id: string): Promise<string> {
    if (this.cache.has(id)) {
      return this.cache.get(id)!; // Return cached template if already loaded
    }

    try {
      // Load index to find keyboard metadata
      const index = await this.loadIndex();
      const keyboard = index.keyboards.find(kb => kb.id === id);

      if (!keyboard) {
        throw new Error(`Keyboard with id "${id}" not found`);
      }

      // Fetch the HTML template file
      const response = await fetch(`/src/keyboards/${keyboard.id}/keyboard.html`);
      if (!response.ok) {
        throw new Error(`Failed to load template: ${response.statusText}`);
      }

      const html = await response.text();

      // Cache the template for future use
      this.cache.set(id, html);

      return html;
    } catch (error) {
      console.error(`Error loading keyboard "${id}":`, error);
      throw error;
    }
  }

  /**
   * Loads the default keyboard layout.
   * 
   * Attempts to find a keyboard marked as default in the index.
   * If no default is specified, returns the first keyboard in the index.
   * 
   * @returns Promise that resolves to an object containing the keyboard ID and HTML template
   * @throws Error if the index is empty or the template cannot be loaded
   * 
   * @example
   * const { id, html } = await KeyboardLoader.loadDefaultKeyboard();
   * console.log(`Loaded default keyboard: ${id}`);
   */
  static async loadDefaultKeyboard(): Promise<{ id: string; html: string }> {
    const index = await this.loadIndex();
    const defaultKb = index.keyboards.find(kb => kb.default) || index.keyboards[0];

    const html = await this.loadTemplate(defaultKb.id);
    return { id: defaultKb.id, html };
  }

  /**
   * Detects the currently connected keyboard based on USB vendor/product IDs.
   * 
   * This method will query the system for connected USB devices and match them
   * against the vendor/product IDs defined in the keyboard metadata.
   * 
   * @returns Promise that resolves to the detected keyboard's ID and HTML, or null if no match found
   * @todo Implement USB device detection using Tauri backend
   * 
   * @example
   * const detected = await KeyboardLoader.detectKeyboard();
   * if (detected) {
   *   console.log(`Detected keyboard: ${detected.id}`);
   * }
   */
  static async detectKeyboard(): Promise<{ id: string; html: string } | null> {
    // TODO: Implement with Tauri backend
    return null;
  }

  /**
   * Retrieves metadata for all available keyboard layouts.
   * 
   * This is useful for displaying a list of keyboards in the UI
   * (e.g., in a dropdown menu for manual keyboard selection).
   * 
   * @returns Promise that resolves to an array of keyboard metadata objects
   * @throws Error if the index cannot be loaded
   * 
   * @example
   * const keyboards = await KeyboardLoader.getAllKeyboards();
   * keyboards.forEach(kb => console.log(kb.name));
   */
  static async getAllKeyboards(): Promise<KeyboardMetadata[]> {
    const index = await this.loadIndex();
    return index.keyboards;
  }

  /**
   * Clears all cached data including loaded templates and the keyboard index.
   * 
   * This forces subsequent calls to reload data from disk.
   * Useful for development or when keyboard configurations are updated at runtime.
   * 
   * @example
   * KeyboardLoader.clearCache();
   * // Next loadTemplate() call will fetch from disk
   */
  static clearCache(): void {
    this.cache.clear();
    this.index = null;
  }

}
