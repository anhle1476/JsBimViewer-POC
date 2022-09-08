import { ViewerOptions } from "web-ifc-viewer";

export interface GeoInfo {
	latitude: number;
	longitude: number;
}

export default interface BimViewerOptions {
	viewer: ViewerOptions;
	showStats?: boolean;
	cameraMaxDistance?: number;
}
