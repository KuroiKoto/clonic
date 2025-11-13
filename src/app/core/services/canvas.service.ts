import { Injectable, signal } from '@angular/core';
import * as fabric from 'fabric';
import { DesignObject, ObjectType } from '../models/design-object.model';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {
  private canvas: fabric.Canvas | null = null;
  
  // Signaux pour l'état réactif
  public selectedObjects = signal<fabric.Object[]>([]);
  public canvasObjects = signal<fabric.Object[]>([]);
  public zoom = signal<number>(1);

  /**
   * Initialise le canvas Fabric.js
   */
  initCanvas(canvasElement: HTMLCanvasElement, width?: number, height?: number): void {
    const defaultWidth = width || window.innerWidth - 560; // Largeur - sidebars (280 + 280)
    const defaultHeight = height || window.innerHeight - 60; // Hauteur - toolbar
    
    this.canvas = new fabric.Canvas(canvasElement, {
      width: defaultWidth,
      height: defaultHeight,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true
    });

    this.setupEventListeners();
  }

  /**
   * Configure les écouteurs d'événements du canvas
   */
  private setupEventListeners(): void {
    if (!this.canvas) return;

    this.canvas.on('selection:created', (e: any) => {
      this.selectedObjects.set(e.selected || []);
    });

    this.canvas.on('selection:updated', (e: any) => {
      this.selectedObjects.set(e.selected || []);
    });

    this.canvas.on('selection:cleared', () => {
      this.selectedObjects.set([]);
    });

    this.canvas.on('object:added', () => {
      this.updateCanvasObjects();
    });

    this.canvas.on('object:removed', () => {
      this.updateCanvasObjects();
    });
  }

  /**
   * Met à jour la liste des objets du canvas
   */
  private updateCanvasObjects(): void {
    if (!this.canvas) return;
    this.canvasObjects.set(this.canvas.getObjects());
  }

  /**
   * Ajoute un rectangle au canvas
   */
  addRectangle(): void {
    if (!this.canvas) return;

    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 150,
      fill: '#3b82f6',
      stroke: '#1e40af',
      strokeWidth: 2
    });

    this.canvas.add(rect);
    this.canvas.setActiveObject(rect);
    this.canvas.renderAll();
  }

  /**
   * Ajoute un cercle au canvas
   */
  addCircle(): void {
    if (!this.canvas) return;

    const circle = new fabric.Circle({
      left: 150,
      top: 150,
      radius: 75,
      fill: '#10b981',
      stroke: '#059669',
      strokeWidth: 2
    });

    this.canvas.add(circle);
    this.canvas.setActiveObject(circle);
    this.canvas.renderAll();
  }

  /**
   * Ajoute du texte au canvas
   */
  addText(text: string = 'Texte'): void {
    if (!this.canvas) return;

    const textObj = new fabric.IText(text, {
      left: 100,
      top: 100,
      fontSize: 24,
      fill: '#000000',
      fontFamily: 'Arial'
    });

    this.canvas.add(textObj);
    this.canvas.setActiveObject(textObj);
    this.canvas.renderAll();
  }

  /**
   * Supprime les objets sélectionnés
   */
  deleteSelected(): void {
    if (!this.canvas) return;

    const activeObjects = this.canvas.getActiveObjects();
    if (activeObjects.length) {
      activeObjects.forEach((obj: any) => this.canvas?.remove(obj));
      this.canvas.discardActiveObject();
      this.canvas.renderAll();
    }
  }

  /**
   * Ajuste le zoom du canvas
   */
  setZoom(value: number): void {
    if (!this.canvas) return;

    const zoom = Math.max(0.1, Math.min(5, value));
    this.canvas.setZoom(zoom);
    this.zoom.set(zoom);
    this.canvas.renderAll();
  }

  /**
   * Redimensionne le canvas
   */
  resize(width: number, height: number): void {
    if (!this.canvas) return;
    
    // S'assurer que les dimensions sont valides
    const validWidth = Math.max(100, width);
    const validHeight = Math.max(100, height);
    
    this.canvas.setDimensions({ 
      width: validWidth, 
      height: validHeight 
    });
    
    // Maintenir le zoom actuel lors du redimensionnement
    const currentZoom = this.canvas.getZoom();
    this.canvas.setViewportTransform(this.canvas.viewportTransform!);
    
    this.canvas.renderAll();
  }

  /**
   * Nettoie le canvas
   */
  clear(): void {
    if (!this.canvas) return;
    this.canvas.clear();
    this.canvas.backgroundColor = '#ffffff';
    this.canvas.renderAll();
  }

  /**
   * Récupère l'instance du canvas
   */
  getCanvas(): fabric.Canvas | null {
    return this.canvas;
  }

  /**
   * Exporte le canvas en image
   */
  exportToImage(format: 'png' | 'jpeg' = 'png'): string {
    if (!this.canvas) return '';
    return this.canvas.toDataURL({ format, quality: 1, multiplier: 1 });
  }

  /**
   * Exporte le canvas en SVG
   */
  exportToSVG(): string {
    if (!this.canvas) return '';
    return this.canvas.toSVG();
  }
}
