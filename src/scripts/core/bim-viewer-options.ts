import { Vector3 } from "three";
import { ViewerOptions } from "web-ifc-viewer";

export interface GeoInfo {
	latitude: number;
	longitude: number;
	offset?: Vector3;
	rotation?: Vector3;
}

export default interface BimViewerOptions {
	viewer: ViewerOptions;
	showStats?: boolean;
	cameraMaxDistance?: number;
}
