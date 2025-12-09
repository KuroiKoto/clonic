import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasService } from '../../../../core/services/canvas.service';
import { HistoryService } from '../../../../core/services/history.service';
import { ProjectService } from '../../../../core/services/project.service';

@Component({
  selector: 'app-toolbar',
  imports: [CommonModule],
  template: `
    <div class="toolbar">
      <div class="toolbar-section">
        <!-- File Menu -->
        <div class="menu-dropdown">
          <button class="menu-btn" (click)="toggleFileMenu()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
              <polyline points="13 2 13 9 20 9"/>
            </svg>
            <span>File</span>
          </button>
          <div class="dropdown-menu" *ngIf="showFileMenu">
            <button class="dropdown-item" (click)="newProject()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
              <span>New Project</span>
            </button>
            <button class="dropdown-item" (click)="loadProject()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>Open Project...</span>
            </button>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item" (click)="saveProject()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              <span>Save Project</span>
              <span class="shortcut">Ctrl+S</span>
            </button>
          </div>
        </div>
        <div class="separator"></div>
        <button class="tool-btn" title="Sélectionner" [class.active]="activeTool === 'select'" (click)="selectTool('select')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
          </svg>
        </button>
        <div class="separator"></div>
        <button class="tool-btn" title="Rectangle" (click)="addRectangle()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
          </svg>
        </button>
        <button class="tool-btn" title="Cercle" (click)="addCircle()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="9"/>
          </svg>
        </button>
        <button class="tool-btn" title="Texte" (click)="addText()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
          </svg>
        </button>
      </div>

      <div class="toolbar-section">
        <button class="tool-btn" title="Annuler (Ctrl+Z)" [disabled]="!historyService.canUndo()" (click)="undo()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 7v6h6"/>
            <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/>
          </svg>
        </button>
        <button class="tool-btn" title="Refaire (Ctrl+Y)" [disabled]="!historyService.canRedo()" (click)="redo()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 7v6h-6"/>
            <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"/>
          </svg>
        </button>
        <div class="separator"></div>
        <button class="tool-btn" title="Supprimer" (click)="deleteSelected()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
          </svg>
        </button>
      </div>

      <div class="toolbar-section">
        <div class="zoom-controls">
          <button class="tool-btn-small" (click)="zoomOut()">−</button>
          <span class="zoom-value">{{ getZoomPercentage() }}%</span>
          <button class="tool-btn-small" (click)="zoomIn()">+</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      padding: 0 20px;
      background: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      gap: 20px;
    }

    .toolbar-section {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tool-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: none;
      background: transparent;
      border-radius: 6px;
      cursor: pointer;
      color: #374151;
      transition: all 0.2s;
    }

    .tool-btn:hover:not(:disabled) {
      background: #f3f4f6;
      color: #111827;
    }

    .tool-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .tool-btn.active {
      background: #e0e7ff;
      color: #4f46e5;
    }

    .separator {
      width: 1px;
      height: 24px;
      background: #e5e7eb;
      margin: 0 4px;
    }

    .zoom-controls {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;
      background: #f9fafb;
      border-radius: 6px;
    }

    .tool-btn-small {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: none;
      background: #ffffff;
      border-radius: 4px;
      cursor: pointer;
      font-size: 18px;
      color: #374151;
      transition: all 0.2s;
    }

    .tool-btn-small:hover {
      background: #e5e7eb;
    }

    .zoom-value {
      min-width: 50px;
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
    }

    .menu-dropdown {
      position: relative;
    }

    .menu-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      border: none;
      background: transparent;
      border-radius: 6px;
      cursor: pointer;
      color: #374151;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
    }

    .menu-btn:hover {
      background: #f3f4f6;
      color: #111827;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 4px;
      min-width: 220px;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      z-index: 1000;
      overflow: hidden;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 10px 16px;
      border: none;
      background: transparent;
      cursor: pointer;
      color: #374151;
      font-size: 14px;
      text-align: left;
      transition: all 0.2s;
    }

    .dropdown-item:hover {
      background: #f3f4f6;
      color: #111827;
    }

    .dropdown-item svg {
      flex-shrink: 0;
    }

    .dropdown-item span:first-of-type {
      flex: 1;
    }

    .shortcut {
      font-size: 12px;
      color: #9ca3af;
    }

    .dropdown-divider {
      height: 1px;
      background: #e5e7eb;
      margin: 4px 0;
    }
  `]
})
export class ToolbarComponent {
  protected readonly canvasService = inject(CanvasService);
  protected readonly historyService = inject(HistoryService);
  protected readonly projectService = inject(ProjectService);
  
  protected activeTool = 'select';
  protected zoom = this.canvasService.zoom;
  protected showFileMenu = false;

  constructor() {
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.menu-dropdown')) {
        this.showFileMenu = false;
      }
    });

    // Add keyboard shortcut for save (Ctrl+S)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        this.saveProject();
      }
    });
  }

  toggleFileMenu(): void {
    this.showFileMenu = !this.showFileMenu;
  }

  newProject(): void {
    this.projectService.newProject();
    this.showFileMenu = false;
  }

  saveProject(): void {
    this.projectService.saveProject();
    this.showFileMenu = false;
  }

  loadProject(): void {
    this.projectService.loadProject();
    this.showFileMenu = false;
  }

  selectTool(tool: string): void {
    this.activeTool = tool;
  }

  addRectangle(): void {
    this.canvasService.addRectangle();
  }

  addCircle(): void {
    this.canvasService.addCircle();
  }

  addText(): void {
    this.canvasService.addText();
  }

  deleteSelected(): void {
    this.canvasService.deleteSelected();
  }

  undo(): void {
    this.historyService.undo();
  }

  redo(): void {
    this.historyService.redo();
  }

  zoomIn(): void {
    const currentZoom = this.canvasService.zoom();
    this.canvasService.setZoom(currentZoom + 0.1);
  }

  zoomOut(): void {
    const currentZoom = this.canvasService.zoom();
    this.canvasService.setZoom(currentZoom - 0.1);
  }

  getZoomPercentage(): number {
    return Math.round(this.zoom() * 100);
  }
}
