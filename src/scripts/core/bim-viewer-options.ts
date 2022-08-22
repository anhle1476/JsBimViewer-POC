import { ViewerOptions } from "web-ifc-viewer";

export default interface BimViewerOptions {
	viewer: ViewerOptions;
	showStats?: boolean;
	cameraMaxDistance?: number;
}
