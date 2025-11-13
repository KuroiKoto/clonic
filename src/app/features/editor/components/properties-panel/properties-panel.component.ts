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
      </div>
      
      <div class="panel-content">
        @if (hasSelection()) {
          <div class="property-section">
            <h4>Position</h4>
            <div class="property-grid">
              <div class="property-item">
                <label>X</label>
                <input type="number" [value]="selectedX()" readonly />
              </div>
              <div class="property-item">
                <label>Y</label>
                <input type="number" [value]="selectedY()" readonly />
              </div>
            </div>
          </div>

          <div class="property-section">
            <h4>Dimensions</h4>
            <div class="property-grid">
              <div class="property-item">
                <label>Largeur</label>
                <input type="number" [value]="selectedWidth()" readonly />
              </div>
              <div class="property-item">
                <label>Hauteur</label>
                <input type="number" [value]="selectedHeight()" readonly />
              </div>
            </div>
          </div>

          <div class="property-section">
            <h4>Apparence</h4>
            <div class="property-item full">
              <label>Couleur de remplissage</label>
              <input type="color" [value]="selectedFill()" readonly />
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
      background: #ffffff;
      border-left: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      height: 100%;
    }

    .panel-header {
      padding: 20px;
      border-bottom: 1px solid #e5e7eb;
    }

    .panel-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #111827;
    }

    .panel-content {
      padding: 20px;
    }

    .property-section {
      margin-bottom: 24px;
    }

    .property-section h4 {
      margin: 0 0 12px 0;
      font-size: 13px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .property-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .property-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .property-item.full {
      grid-column: 1 / -1;
    }

    .property-item label {
      font-size: 13px;
      color: #374151;
      font-weight: 500;
    }

    .property-item input {
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      color: #111827;
      transition: border-color 0.2s;
    }

    .property-item input:focus {
      outline: none;
      border-color: #4f46e5;
    }

    .property-item input[type="color"] {
      height: 40px;
      cursor: pointer;
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
}
