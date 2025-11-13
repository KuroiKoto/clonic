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

  /**
   * Met à jour la position d'un objet
   */
  updateObjectPosition(x: number, y: number): void {
    if (!this.canvas) return;
    
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) return;

    activeObject.set({ left: x, top: y });
    this.canvas.renderAll();
  }

  /**
   * Met à jour les dimensions d'un objet
   */
  updateObjectSize(width: number, height: number): void {
    if (!this.canvas) return;
    
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) return;

    activeObject.set({ 
      width: width,
      height: height,
      scaleX: 1,
      scaleY: 1
    });
    activeObject.setCoords();
    this.canvas.renderAll();
  }

  /**
   * Met à jour la couleur de remplissage d'un objet
   */
  updateObjectFill(color: string): void {
    if (!this.canvas) return;
    
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) return;

    activeObject.set({ fill: color });
    this.canvas.renderAll();
  }

  /**
   * Met à jour la couleur de bordure d'un objet
   */
  updateObjectStroke(color: string): void {
    if (!this.canvas) return;
    
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) return;

    activeObject.set({ stroke: color });
    this.canvas.renderAll();
  }

  /**
   * Met à jour l'épaisseur de bordure d'un objet
   */
  updateObjectStrokeWidth(width: number): void {
    if (!this.canvas) return;
    
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) return;

    activeObject.set({ strokeWidth: width });
    this.canvas.renderAll();
  }

  /**
   * Met à jour l'opacité d'un objet
   */
  updateObjectOpacity(opacity: number): void {
    if (!this.canvas) return;
    
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) return;

    activeObject.set({ opacity: opacity / 100 });
    this.canvas.renderAll();
  }

  /**
   * Met à jour la rotation d'un objet
   */
  updateObjectRotation(angle: number): void {
    if (!this.canvas) return;
    
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) return;

    activeObject.set({ angle: angle });
    this.canvas.renderAll();
  }

  /**
   * Met à jour la police d'un objet texte
   */
  updateObjectFontFamily(fontFamily: string): void {
    if (!this.canvas) return;
    
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'text') return;

    activeObject.set({ fontFamily: fontFamily });
    this.canvas.renderAll();
  }

  /**
   * Met à jour la taille de police d'un objet texte
   */
  updateObjectFontSize(fontSize: number): void {
    if (!this.canvas) return;
    
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'text') return;

    activeObject.set({ fontSize: fontSize });
    this.canvas.renderAll();
  }

  /**
   * Met à jour le style gras d'un objet texte
   */
  updateObjectFontWeight(isBold: boolean): void {
    if (!this.canvas) return;
    
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'text') return;

    activeObject.set({ fontWeight: isBold ? 'bold' : 'normal' });
    this.canvas.renderAll();
  }

  /**
   * Met à jour le style italique d'un objet texte
   */
  updateObjectFontStyle(isItalic: boolean): void {
    if (!this.canvas) return;
    
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'text') return;

    activeObject.set({ fontStyle: isItalic ? 'italic' : 'normal' });
    this.canvas.renderAll();
  }

  /**
   * Met à jour l'alignement du texte
   */
  updateObjectTextAlign(align: 'left' | 'center' | 'right'): void {
    if (!this.canvas) return;
    
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'text') return;

    activeObject.set({ textAlign: align });
    this.canvas.renderAll();
  }
}
