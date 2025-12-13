export interface KeyDefinition {
  key: string;
  label: string;
  width?: 'normal' | 'small' | 'wide' | 'extra-wide' | 'spacebar' | 'shift' | 'enter' | 'backspace' | 'tab' | 'caps';
  type?: 'normal' | 'modifier' | 'function' | 'arrow';
  sublabel?: string;
}

export interface KeyboardRow {
  keys: KeyDefinition[];
  gap?: string;
}

export interface KeyboardLayout {
  id: string;
  name: string;
  description: string;
  style: 'rounded' | 'square' | 'compact';
  brand?: string;
  rows: KeyboardRow[];
}

export interface KeyboardIndex {
  keyboards: Array<{
    id: string;
    file: string;
  }>;
  default: string;
}
