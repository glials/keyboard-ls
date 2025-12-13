export class KeyboardRenderer {
  private container: HTMLElement;
  private activeKeys: Set<string> = new Set();

  constructor(containerId: string) {
    const element = document.getElementById(containerId);
    if (!element) {
      throw new Error(`Container "${containerId}" not found`);
    }
    this.container = element;
  }

  render(html: string): void {
    this.container.innerHTML = html;
    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const key = this.container.querySelector(`[data-key="${event.code}"]`) as HTMLElement;
    if (key && !this.activeKeys.has(event.code)) {
      key.classList.add('scale-95', 'bg-blue-500');
      key.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.6)';
      this.activeKeys.add(event.code);
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    const key = this.container.querySelector(`[data-key="${event.code}"]`) as HTMLElement;
    if (key) {
      key.classList.remove('scale-95', 'bg-blue-500');
      key.style.boxShadow = '';
      this.activeKeys.delete(event.code);
    }
  }

  destroy(): void {
    this.container.innerHTML = '';
    this.activeKeys.clear();
  }
}
