import { Component } from '@angular/core';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { PropertiesPanelComponent } from './components/properties-panel/properties-panel.component';
import { LayersPanelComponent } from './components/layers-panel/layers-panel.component';

@Component({
  selector: 'app-editor',
  imports: [
    ToolbarComponent,
    CanvasComponent,
    PropertiesPanelComponent,
    LayersPanelComponent
  ],
  template: `
    <div class="editor-container">
      <app-toolbar />
      <div class="editor-content">
        <app-layers-panel />
        <app-canvas />
        <app-properties-panel />
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      width: 100%;
      height: 100%;
    }

    .editor-container {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100vh;
      overflow: hidden;
    }

    .editor-content {
      display: flex;
      flex: 1;
      overflow: hidden;
      min-height: 0;
    }
  `]
})
export class EditorComponent {}
