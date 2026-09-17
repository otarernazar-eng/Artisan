export interface BoundingBox {
  label: string;
  box: [number, number, number, number];
}

export interface GeneratedProject {
  projectName: string;
  projectDescription: string;
  confidence: string;
  boundingBoxes: BoundingBox[];
  instructions: string[];
  arduinoCode: string;
}

export interface SavedProject {
  id: string;
  date: string;
  image: string;
  data: GeneratedProject;
}
