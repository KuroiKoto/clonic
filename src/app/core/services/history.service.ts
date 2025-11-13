import { Injectable, signal } from '@angular/core';
import { HistoryState } from '../models/design-object.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private history: HistoryState[] = [];
  private currentIndex = -1;
  private maxHistorySize = 50;

  public canUndo = signal<boolean>(false);
  public canRedo = signal<boolean>(false);

  /**
   * Ajoute un état à l'historique
   */
  addState(state: any): void {
    // Supprimer les états "futurs" si on est au milieu de l'historique
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    // Ajouter le nouvel état
    this.history.push({
      objects: JSON.parse(JSON.stringify(state)),
      timestamp: Date.now()
    });

    // Limiter la taille de l'historique
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    } else {
      this.currentIndex++;
    }

    this.updateFlags();
  }

  /**
   * Annule la dernière action (Undo)
   */
  undo(): HistoryState | null {
    if (this.canUndo()) {
      this.currentIndex--;
      this.updateFlags();
      return this.history[this.currentIndex];
    }
    return null;
  }

  /**
   * Refait l'action annulée (Redo)
   */
  redo(): HistoryState | null {
    if (this.canRedo()) {
      this.currentIndex++;
      this.updateFlags();
      return this.history[this.currentIndex];
    }
    return null;
  }

  /**
   * Réinitialise l'historique
   */
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
    this.updateFlags();
  }

  /**
   * Met à jour les flags undo/redo
   */
  private updateFlags(): void {
    this.canUndo.set(this.currentIndex > 0);
    this.canRedo.set(this.currentIndex < this.history.length - 1);
  }
}
