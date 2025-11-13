export enum ObjectType {
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  TRIANGLE = 'triangle',
  LINE = 'line',
  TEXT = 'text',
  IMAGE = 'image',
  GROUP = 'group'
}

export interface DesignObject {
  id: string;
  type: ObjectType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  zIndex: number;
}

export interface Layer {
  id: string;
  name: string;
  objects: DesignObject[];
  visible: boolean;
  locked: boolean;
}

export interface HistoryState {
  objects: DesignObject[];
  timestamp: number;
}
