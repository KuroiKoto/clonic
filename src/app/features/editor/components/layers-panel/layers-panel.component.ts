import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasService } from '../../../../core/services/canvas.service';

@Component({
  selector: 'app-layers-panel',
  imports: [CommonModule],
  template: `
    <div class="layers-panel">
      <div class="panel-header">
        <h3>Calques</h3>
      </div>
      
      <div class="panel-content">
        @if (objects().length > 0) {
          <div class="layers-list">
            @for (object of objects(); track $index) {
              <div class="layer-item">
                <div class="layer-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                  </svg>
                </div>
                <span class="layer-name">{{ getObjectName(object, $index) }}</span>
              </div>
            }
          </div>
        } @else {
          <div class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <p>Aucun calque<br>Ajoutez des objets pour commencer</p>
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

    .layers-panel {
      width: 280px;
      background: #ffffff;
      border-right: 1px solid #e5e7eb;
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
      flex: 1;
      overflow-y: auto;
    }

    .layers-list {
      padding: 8px;
    }

    .layer-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .layer-item:hover {
      background: #f3f4f6;
    }

    .layer-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: #f9fafb;
      border-radius: 4px;
      color: #6b7280;
    }

    .layer-name {
      flex: 1;
      font-size: 14px;
      color: #374151;
      font-weight: 500;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
      color: #9ca3af;
      height: 100%;
    }

    .empty-state svg {
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-state p {
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
    }
  `]
})
export class LayersPanelComponent {
  private readonly canvasService = inject(CanvasService);
  
  protected readonly objects = this.canvasService.canvasObjects;

  protected getObjectName(object: any, index: number): string {
    return object.type ? `${object.type} ${index + 1}` : `Objet ${index + 1}`;
  }
}
