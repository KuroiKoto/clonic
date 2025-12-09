import { Injectable, inject } from '@angular/core';
import { CanvasService } from './canvas.service';
import * as fabric from 'fabric';

export interface ProjectData {
  version: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  canvasData: any;
  canvasBackground?: string;
  canvasWidth?: number;
  canvasHeight?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly canvasService = inject(CanvasService);
  private currentProjectName = 'Untitled Project';

  /**
   * Sauvegarde le projet actuel en JSON
   */
  saveProject(): void {
    const canvas = this.canvasService.getCanvas();
    if (!canvas) {
      console.error('Canvas not initialized');
      return;
    }

    const projectData: ProjectData = {
      version: '1.0',
      name: this.currentProjectName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      canvasData: canvas.toJSON(),
      canvasBackground: canvas.backgroundColor as string,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height
    };

    const json = JSON.stringify(projectData, null, 2);
    this.downloadFile(json, `${this.currentProjectName}.json`, 'application/json');
  }

  /**
   * Restaure un projet depuis un fichier JSON
   */
  loadProject(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const json = event.target?.result as string;
          const projectData: ProjectData = JSON.parse(json);
          this.restoreProject(projectData);
        } catch (error) {
          console.error('Error loading project:', error);
          alert('Failed to load project. Invalid file format.');
        }
      };
      reader.readAsText(file);
    };

    input.click();
  }

  /**
   * Restaure le projet avec les données JSON
   */
  private restoreProject(projectData: ProjectData): void {
    const canvas = this.canvasService.getCanvas();
    if (!canvas) {
      console.error('Canvas not initialized');
      return;
    }

    // Clear current canvas
    this.canvasService.clear();

    // Restore canvas size
    if (projectData.canvasWidth && projectData.canvasHeight) {
      this.canvasService.resize(projectData.canvasWidth, projectData.canvasHeight);
    }

    // Restore canvas background
    if (projectData.canvasBackground) {
      canvas.backgroundColor = projectData.canvasBackground;
    }

    // Restore canvas objects
    canvas.loadFromJSON(projectData.canvasData, () => {
      canvas.renderAll();
      this.currentProjectName = projectData.name;
      console.log('Project loaded successfully:', projectData.name);
    });
  }

  /**
   * Crée un nouveau projet vide
   */
  newProject(): void {
    if (confirm('Create a new project? All unsaved changes will be lost.')) {
      this.canvasService.clear();
      this.currentProjectName = 'Untitled Project';
    }
  }

  /**
   * Télécharge un fichier
   */
  private downloadFile(content: string, fileName: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Récupère le nom du projet actuel
   */
  getCurrentProjectName(): string {
    return this.currentProjectName;
  }

  /**
   * Définit le nom du projet actuel
   */
  setCurrentProjectName(name: string): void {
    this.currentProjectName = name;
  }
}
