import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasService } from '../../../../core/services/canvas.service';

@Component({
  selector: 'app-properties-panel',
  imports: [CommonModule],
  template: `
    <div class="properties-panel">
      <div class="panel-header">
        <h3>Propriétés</h3>
        @if (hasSelection()) {
          <span class="object-type">{{ getObjectTypeName() }}</span>
        }
      </div>
      
      <div class="panel-content">
        @if (hasSelection()) {
          <!-- Position & Dimensions combinées -->
          <div class="property-section compact">
            <h4>Position & Dimensions</h4>
            <div class="property-grid-2x2">
              <div class="input-with-label">
                <span class="input-label">X</span>
                <input type="number" [value]="selectedX()" (input)="onPositionXChange($event)" />
              </div>
              <div class="input-with-label">
                <span class="input-label">Y</span>
                <input type="number" [value]="selectedY()" (input)="onPositionYChange($event)" />
              </div>
              <div class="input-with-label">
                <span class="input-label">L</span>
                <input type="number" [value]="selectedWidth()" (input)="onWidthChange($event)" min="1" />
              </div>
              <div class="input-with-label">
                <span class="input-label">H</span>
                <input type="number" [value]="selectedHeight()" (input)="onHeightChange($event)" min="1" />
              </div>
            </div>
          </div>

          <!-- Couleurs -->
          <div class="property-section compact">
            <h4>Couleurs</h4>
            <div class="color-row">
              <div class="color-picker-wrapper">
                <label>Fond</label>
                <div class="color-input-group">
                  <input type="color" [value]="selectedFill()" (input)="onFillChange($event)" />
                  <span class="color-value">{{ selectedFill() }}</span>
                </div>
              </div>
            </div>
            <div class="color-row">
              <div class="color-picker-wrapper">
                <label>Bordure</label>
                <div class="color-input-group">
                  <input type="color" [value]="selectedStroke()" (input)="onStrokeChange($event)" />
                  <input type="number" [value]="selectedStrokeWidth()" (input)="onStrokeWidthChange($event)" 
                         min="0" max="50" class="stroke-width" placeholder="Ép." />
                </div>
              </div>
            </div>
          </div>

          <!-- Typographie (texte uniquement) -->
          @if (isTextObject()) {
            <div class="property-section compact">
              <h4>Typographie</h4>
              <div class="font-controls">
                <select [value]="selectedFontFamily()" (change)="onFontFamilyChange($event)" class="font-select">
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Comic Sans MS">Comic Sans MS</option>
                  <option value="Impact">Impact</option>
                  <option value="Trebuchet MS">Trebuchet MS</option>
                  <option value="Arial Black">Arial Black</option>
                </select>
                <input type="number" [value]="selectedFontSize()" (input)="onFontSizeChange($event)" 
                       min="1" max="500" class="font-size" />
              </div>
              <div class="button-group">
                <button 
                  [class.active]="selectedFontWeight()" 
                  (click)="onFontWeightToggle()"
                  class="icon-button"
                  title="Gras">
                  <strong>B</strong>
                </button>
                <button 
                  [class.active]="selectedFontStyle()" 
                  (click)="onFontStyleToggle()"
                  class="icon-button"
                  title="Italique">
                  <em>I</em>
                </button>
                <div class="divider"></div>
                <button 
                  [class.active]="selectedTextAlign() === 'left'" 
                  (click)="onTextAlignChange('left')"
                  class="icon-button"
                  title="Gauche">⬅</button>
                <button 
                  [class.active]="selectedTextAlign() === 'center'" 
                  (click)="onTextAlignChange('center')"
                  class="icon-button"
                  title="Centre">↔</button>
                <button 
                  [class.active]="selectedTextAlign() === 'right'" 
                  (click)="onTextAlignChange('right')"
                  class="icon-button"
                  title="Droite">➡</button>
              </div>
            </div>
          }

          <!-- Transformation -->
          <div class="property-section compact">
            <h4>Transformation</h4>
            <div class="slider-group">
              <div class="slider-row">
                <label>Rotation</label>
                <div class="slider-input">
                  <input type="range" [value]="selectedRotation()" (input)="onRotationChange($event)" 
                         min="0" max="360" />
                  <span class="slider-value">{{ selectedRotation() }}°</span>
                </div>
              </div>
              <div class="slider-row">
                <label>Opacité</label>
                <div class="slider-input">
                  <input type="range" [value]="selectedOpacity()" (input)="onOpacityChange($event)" 
                         min="0" max="100" />
                  <span class="slider-value">{{ selectedOpacity() }}%</span>
                </div>
              </div>
            </div>
          </div>
        } @else {
          <div class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 2L7 7H2l5 4-2 7 6-4 6 4-2-7 5-4h-5l-2-5z"/>
            </svg>
            <p>Sélectionnez un objet pour voir ses propriétés</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      height: 100%;
    }

    .properties-panel {
      width: 280px;
      background: #fafafa;
      border-left: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .panel-header {
      padding: 16px;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      flex-shrink: 0;
    }

    .panel-header h3 {
      margin: 0 0 4px 0;
      font-size: 13px;
      font-weight: 600;
      color: #111827;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .object-type {
      font-size: 11px;
      color: #6b7280;
      font-weight: 500;
    }

    .panel-content {
      padding: 12px;
      overflow-y: auto;
      flex: 1;
      min-height: 0;
    }

    .property-section {
      background: white;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 8px;
      border: 1px solid #e5e7eb;
    }

    .property-section.compact {
      padding: 10px 12px;
    }

    .property-section:last-child {
      margin-bottom: 0;
    }

    .property-section h4 {
      margin: 0 0 10px 0;
      font-size: 10px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    /* Grid 2x2 pour position/dimensions */
    .property-grid-2x2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
    }

    .input-with-label {
      position: relative;
    }

    .input-label {
      position: absolute;
      left: 8px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 10px;
      font-weight: 600;
      color: #9ca3af;
      pointer-events: none;
      text-transform: uppercase;
    }

    .input-with-label input {
      width: 100%;
      padding: 6px 8px 6px 24px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      font-size: 12px;
      color: #111827;
      background: #f9fafb;
      transition: all 0.2s;
    }

    .input-with-label input:focus {
      outline: none;
      border-color: #4f46e5;
      background: white;
    }

    /* Couleurs */
    .color-row {
      margin-bottom: 8px;
    }

    .color-row:last-child {
      margin-bottom: 0;
    }

    .color-picker-wrapper label {
      display: block;
      font-size: 10px;
      font-weight: 600;
      color: #6b7280;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .color-input-group {
      display: flex;
      gap: 6px;
      align-items: center;
    }

    .color-input-group input[type="color"] {
      width: 44px;
      height: 32px;
      border: 2px solid #e5e7eb;
      border-radius: 6px;
      cursor: pointer;
      transition: border-color 0.2s;
    }

    .color-input-group input[type="color"]:hover {
      border-color: #4f46e5;
    }

    .color-value {
      font-size: 11px;
      color: #6b7280;
      font-family: 'Courier New', monospace;
      font-weight: 500;
      flex: 1;
    }

    .stroke-width {
      width: 60px;
      padding: 6px 8px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      font-size: 12px;
      text-align: center;
      background: #f9fafb;
    }

    .stroke-width:focus {
      outline: none;
      border-color: #4f46e5;
      background: white;
    }

    /* Typographie */
    .font-controls {
      display: flex;
      gap: 6px;
      margin-bottom: 8px;
    }

    .font-select {
      flex: 1;
      padding: 6px 8px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      font-size: 12px;
      background: #f9fafb;
      cursor: pointer;
    }

    .font-select:focus {
      outline: none;
      border-color: #4f46e5;
      background: white;
    }

    .font-size {
      width: 55px;
      padding: 6px 8px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      font-size: 12px;
      text-align: center;
      background: #f9fafb;
    }

    .font-size:focus {
      outline: none;
      border-color: #4f46e5;
      background: white;
    }

    /* Boutons */
    .button-group {
      display: flex;
      gap: 4px;
      align-items: center;
    }

    .divider {
      width: 1px;
      height: 20px;
      background: #e5e7eb;
      margin: 0 2px;
    }

    .icon-button {
      flex: 1;
      min-width: 32px;
      height: 32px;
      padding: 0;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      background: #f9fafb;
      color: #6b7280;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon-button:hover {
      background: white;
      border-color: #9ca3af;
      color: #111827;
    }

    .icon-button.active {
      background: #4f46e5;
      border-color: #4f46e5;
      color: white;
    }

    .icon-button strong,
    .icon-button em {
      font-style: normal;
    }

    /* Sliders */
    .slider-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .slider-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .slider-row label {
      font-size: 10px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .slider-input {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .slider-input input[type="range"] {
      flex: 1;
      height: 6px;
      cursor: pointer;
      accent-color: #4f46e5;
      border-radius: 3px;
    }

    .slider-value {
      font-size: 11px;
      color: #6b7280;
      font-weight: 600;
      min-width: 40px;
      text-align: right;
      font-family: 'Courier New', monospace;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      text-align: center;
      color: #9ca3af;
    }

    .empty-state svg {
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-state p {
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
    }
  `]
})
export class PropertiesPanelComponent {
  private readonly canvasService = inject(CanvasService);
  
  protected readonly selectedObjects = this.canvasService.selectedObjects;
  
  protected readonly hasSelection = computed(() => this.selectedObjects().length > 0);
  
  protected readonly selectedX = computed(() => {
    const objects = this.selectedObjects();
    return objects[0]?.left ?? 0;
  });
  
  protected readonly selectedY = computed(() => {
    const objects = this.selectedObjects();
    return objects[0]?.top ?? 0;
  });
  
  protected readonly selectedWidth = computed(() => {
    const objects = this.selectedObjects();
    return objects[0]?.width ?? 0;
  });
  
  protected readonly selectedHeight = computed(() => {
    const objects = this.selectedObjects();
    return objects[0]?.height ?? 0;
  });
  
  protected readonly selectedFill = computed(() => {
    const objects = this.selectedObjects();
    return objects[0]?.fill ?? '#000000';
  });

  protected readonly selectedStroke = computed(() => {
    const objects = this.selectedObjects();
    return objects[0]?.stroke ?? '#000000';
  });

  protected readonly selectedStrokeWidth = computed(() => {
    const objects = this.selectedObjects();
    return objects[0]?.strokeWidth ?? 0;
  });

  protected readonly selectedRotation = computed(() => {
    const objects = this.selectedObjects();
    return Math.round(objects[0]?.angle ?? 0);
  });

  protected readonly selectedOpacity = computed(() => {
    const objects = this.selectedObjects();
    return Math.round((objects[0]?.opacity ?? 1) * 100);
  });

  protected readonly isTextObject = computed(() => {
    const objects = this.selectedObjects();
    return objects.length === 1 && objects[0]?.type === 'text';
  });

  protected readonly selectedFontFamily = computed(() => {
    const objects = this.selectedObjects();
    const obj = objects[0] as any;
    return obj?.fontFamily ?? 'Arial';
  });

  protected readonly selectedFontSize = computed(() => {
    const objects = this.selectedObjects();
    const obj = objects[0] as any;
    return obj?.fontSize ?? 20;
  });

  protected readonly selectedFontWeight = computed(() => {
    const objects = this.selectedObjects();
    const obj = objects[0] as any;
    return obj?.fontWeight === 'bold';
  });

  protected readonly selectedFontStyle = computed(() => {
    const objects = this.selectedObjects();
    const obj = objects[0] as any;
    return obj?.fontStyle === 'italic';
  });

  protected readonly selectedTextAlign = computed(() => {
    const objects = this.selectedObjects();
    const obj = objects[0] as any;
    return obj?.textAlign ?? 'left';
  });

  protected getObjectTypeName(): string {
    const objects = this.selectedObjects();
    if (objects.length === 0) return '';
    
    const type = objects[0]?.type;
    switch (type) {
      case 'rect': return 'Rectangle';
      case 'circle': return 'Cercle';
      case 'text': return 'Texte';
      default: return 'Objet';
    }
  }

  protected onPositionXChange(event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    if (!isNaN(value)) {
      const y = this.selectedY();
      this.canvasService.updateObjectPosition(value, y);
    }
  }

  protected onPositionYChange(event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    if (!isNaN(value)) {
      const x = this.selectedX();
      this.canvasService.updateObjectPosition(x, value);
    }
  }

  protected onWidthChange(event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    if (!isNaN(value) && value > 0) {
      const height = this.selectedHeight();
      this.canvasService.updateObjectSize(value, height);
    }
  }

  protected onHeightChange(event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    if (!isNaN(value) && value > 0) {
      const width = this.selectedWidth();
      this.canvasService.updateObjectSize(width, value);
    }
  }

  protected onFillChange(event: Event): void {
    const color = (event.target as HTMLInputElement).value;
    this.canvasService.updateObjectFill(color);
  }

  protected onStrokeChange(event: Event): void {
    const color = (event.target as HTMLInputElement).value;
    this.canvasService.updateObjectStroke(color);
  }

  protected onStrokeWidthChange(event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    if (!isNaN(value) && value >= 0) {
      this.canvasService.updateObjectStrokeWidth(value);
    }
  }

  protected onRotationChange(event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    if (!isNaN(value)) {
      this.canvasService.updateObjectRotation(value);
    }
  }

  protected onOpacityChange(event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    if (!isNaN(value)) {
      this.canvasService.updateObjectOpacity(value / 100);
    }
  }

  protected onFontFamilyChange(event: Event): void {
    const fontFamily = (event.target as HTMLSelectElement).value;
    this.canvasService.updateObjectFontFamily(fontFamily);
  }

  protected onFontSizeChange(event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    if (!isNaN(value) && value > 0) {
      this.canvasService.updateObjectFontSize(value);
    }
  }

  protected onFontWeightToggle(): void {
    const isBold = !this.selectedFontWeight();
    this.canvasService.updateObjectFontWeight(isBold);
  }

  protected onFontStyleToggle(): void {
    const isItalic = !this.selectedFontStyle();
    this.canvasService.updateObjectFontStyle(isItalic);
  }

  protected onTextAlignChange(align: 'left' | 'center' | 'right'): void {
    this.canvasService.updateObjectTextAlign(align);
  }
}
