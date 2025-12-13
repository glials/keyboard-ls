export interface KeyboardMetadata {
  id: string;
  name: string;
  template: string;
  vendorId?: string;
  productIds?: string[];
  default?: boolean;
}

export interface KeyboardIndex {
  keyboards: KeyboardMetadata[];
}

export class KeyboardLoader {
  private static cache: Map<string, string> = new Map();
  private static index: KeyboardIndex | null = null;

  static async loadIndex(): Promise<KeyboardIndex> {
    if (this.index) {
      return this.index;
    }

    try {
      const response = await fetch('/src/keyboards/index.json');
      if (!response.ok) {
        throw new Error(`Failed to load keyboard index: ${response.statusText}`);
      }
      this.index = await response.json();
      return this.index;
    } catch (error) {
      console.error('Error loading keyboard index:', error);
      throw error;
    }
  }

  static async loadTemplate(id: string): Promise<string> {
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }

    try {
      const index = await this.loadIndex();
      const keyboard = index.keyboards.find(kb => kb.id === id);

      if (!keyboard) {
        throw new Error(`Keyboard with id "${id}" not found`);
      }

      const response = await fetch(`/src/keyboards/templates/${keyboard.template}`);
      if (!response.ok) {
        throw new Error(`Failed to load template: ${response.statusText}`);
      }

      const html = await response.text();
      this.cache.set(id, html);
      
      return html;
    } catch (error) {
      console.error(`Error loading keyboard "${id}":`, error);
      throw error;
    }
  }

  static async loadDefaultKeyboard(): Promise<{ id: string; html: string }> {
    const index = await this.loadIndex();
    const defaultKb = index.keyboards.find(kb => kb.default) || index.keyboards[0];
    
    const html = await this.loadTemplate(defaultKb.id);
    return { id: defaultKb.id, html };
  }

  static async detectKeyboard(): Promise<{ id: string; html: string } | null> {
    // TODO: Implement with Tauri backend
    return null;
  }

  static async getAllKeyboards(): Promise<KeyboardMetadata[]> {
    const index = await this.loadIndex();
    return index.keyboards;
  }

  static clearCache(): void {
    this.cache.clear();
    this.index = null;
  }
}
