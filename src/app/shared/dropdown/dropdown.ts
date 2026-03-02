import { Component, Input, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ]
})
export class DropdownComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() options: string[] = [];
  @Input() placeholder: string = 'Seleccionar...';

  public value = signal<string | null>(null);
  public isOpen = signal(false);

  // Funciones para ControlValueAccessor
  onChange: any = () => { };
  onTouched: any = () => { };

  toggle() {
    this.isOpen.update(v => !v);
  }

  selectOption(option: string) {
    this.value.set(option);
    this.onChange(option);
    this.onTouched();
    this.isOpen.set(false);
  }

  // Métodos requeridos por la interfaz ControlValueAccessor
  writeValue(val: string): void { this.value.set(val); }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
}