import { Sound } from "./sound";
import { el } from "./util";

const GESTURES = ["pointerdown", "keydown", "touchend"] as const;

/**
 * The «آوا» button (bottom left) and the rules for starting sound. Sound is
 * on by default, but browsers only allow it after the reader's first click,
 * key or tap: it starts at once if they have already interacted (for example
 * clicked "Begin" on the home page), otherwise on that first gesture. Until
 * then the button pulses gently.
 */
export class SoundToggle {
  readonly button: HTMLButtonElement;

  constructor(
    host: HTMLElement,
    private sound: Sound,
  ) {
    this.button = el("button", "sound-toggle", host);
    this.button.type = "button";
    this.button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path class="sound-toggle__body" d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path class="sound-toggle__waves" d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/><path class="sound-toggle__off" d="M16 9.5l5 5M21 9.5l-5 5"/></svg><span class="sound-toggle__label">آوا</span>`;
    this.button.addEventListener("click", () => {
      if (this.sound.enabled) this.sound.disable();
      else this.start();
      this.show();
    });
    this.show();
    if (!Sound.wanted) return;
    if (navigator.userActivation?.hasBeenActive) this.start();
    else for (const type of GESTURES) window.addEventListener(type, this.onFirstGesture);
  }

  destroy() {
    this.disarm();
    this.button.remove();
  }

  private start() {
    void this.sound.enable().then(() => this.show());
  }

  private show() {
    const on = this.sound.enabled;
    this.button.classList.toggle("is-on", on);
    this.button.classList.toggle("is-waiting", !on && Sound.wanted);
    this.button.setAttribute("aria-pressed", String(on));
    this.button.setAttribute("aria-label", on ? "خاموش کردن آوا" : "روشن کردن آوا");
  }

  private disarm() {
    for (const type of GESTURES) window.removeEventListener(type, this.onFirstGesture);
  }

  private onFirstGesture = (e: Event) => {
    this.disarm();
    if (e.target instanceof Element && e.target.closest(".sound-toggle")) return; // the button handles itself
    if (!this.sound.enabled) this.start();
  };
}
