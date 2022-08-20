import * as THREE from 'three';
import { IfcViewerAPI, ViewerOptions } from 'web-ifc-viewer';

/**
 * Wrapper of @see IfcViewerAPI for the BIM application
 */
export default class BimViewer extends IfcViewerAPI {
  constructor(options: ViewerOptions) {
    super(options);
  }

  
}