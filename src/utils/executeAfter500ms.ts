export function executeAfter500ms(callback: () => void) {
  setTimeout(callback, 500);
}
