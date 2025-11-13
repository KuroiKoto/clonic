import { Component, ElementRef, inject, OnInit, OnDestroy, ViewChild, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasService } from '../../../../core/services/canvas.service';

@Component({
  selector: 'app-canvas',
  imports: [CommonModule],
  template: `
    <div class="canvas-container" #canvasContainer>
      <canvas #fabricCanvas></canvas>
    </div>
  `,
  styles: [`
    :host {
      flex: 1;
      display: flex;
      min-width: 0;
      min-height: 0;
    }

    .canvas-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      overflow: hidden;
      position: relative;
      width: 100%;
      height: 100%;
    }

    canvas {
      box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 4px 6px -1px rgba(0,0,0,0.1);
      background: #ffffff;
    }
  `]
})
export class CanvasComponent implements OnInit, OnDestroy {
  @ViewChild('fabricCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasContainer', { static: true }) containerRef!: ElementRef<HTMLDivElement>;
  
  private readonly canvasService = inject(CanvasService);
  private resizeObserver?: ResizeObserver;

  constructor() {
    // Initialiser le canvas après le rendu
    afterNextRender(() => {
      if (this.canvasRef?.nativeElement) {
        this.initializeCanvas();
        this.setupResizeObserver();
      }
    });
  }

  ngOnInit(): void {
    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize.bind(this));
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private initializeCanvas(): void {
    const { width, height } = this.getCanvasSize();
    this.canvasService.initCanvas(this.canvasRef.nativeElement);
    this.canvasService.resize(width, height);
  }

  private setupResizeObserver(): void {
    // Utiliser ResizeObserver pour détecter les changements de taille du conteneur
    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize();
    });

    if (this.containerRef?.nativeElement) {
      this.resizeObserver.observe(this.containerRef.nativeElement);
    }
  }

  private handleResize(): void {
    const { width, height } = this.getCanvasSize();
    this.canvasService.resize(width, height);
  }

  private getCanvasSize(): { width: number; height: number } {
    if (this.containerRef?.nativeElement) {
      const container = this.containerRef.nativeElement;
      return {
        width: container.clientWidth,
        height: container.clientHeight
      };
    }
    
    // Fallback si le conteneur n'est pas disponible
    const toolbarHeight = 60;
    const leftPanelWidth = 280;
    const rightPanelWidth = 280;
    
    return {
      width: window.innerWidth - leftPanelWidth - rightPanelWidth,
      height: window.innerHeight - toolbarHeight
    };
  }
}
