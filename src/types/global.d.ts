export {}; // makes it a module

declare global {
  interface Window {
    lenis?: {
      scrollTo: (target: string) => void;
      // Add other Lenis methods if needed
      raf?: (time: number) => void;
      destroy?: () => void;
    };
  }
}
