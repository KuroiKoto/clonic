import { Component, signal } from '@angular/core';
import { EditorComponent } from './features/editor/editor.component';

@Component({
  selector: 'app-root',
  imports: [EditorComponent],
  template: `<app-editor />`,
  styleUrl: './app.scss',
  styles: [`
    :host {
      display: flex;
      width: 100%;
      height: 100vh;
    }
  `]
})
export class App {
  protected readonly title = signal('clonic');
}
