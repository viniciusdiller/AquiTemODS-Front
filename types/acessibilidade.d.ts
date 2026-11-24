export interface VLibrasWidgetOptions {
  rootPath: string;
  position?: "L" | "R" | "T" | "B";
  avatar?: string;
  opacity?: number;
}

export interface VLibrasNamespace {
  Widget: new (options: VLibrasWidgetOptions) => unknown;
}

export interface VLibrasWidgetInstance {
  open?: () => void;
  close?: () => void;
}

declare global {
  interface Window {
    VLibras?: VLibrasNamespace;
    VLibrasWidget?: VLibrasWidgetInstance;
    __asw__onClickScreenReader?: EventListener;
  }
}

export {};
