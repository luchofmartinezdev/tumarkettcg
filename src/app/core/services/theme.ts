import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    readonly isDark = signal(false);

    constructor() {
        const saved = localStorage.getItem('theme');
        const prefersDark =
            saved === 'dark' ||
            (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches);

        this.isDark.set(prefersDark);
        this._applyClass(prefersDark);

        effect(() => {
            const dark = this.isDark();
            this._applyClass(dark);
            localStorage.setItem('theme', dark ? 'dark' : 'light');
        });
    }

    toggle(): void {
        this.isDark.update(v => !v);
    }

    private _applyClass(dark: boolean): void {
        document.documentElement.classList.toggle('dark', dark);
    }
}
