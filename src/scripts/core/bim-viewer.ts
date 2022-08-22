import * as THREE from 'three';
import { IfcViewerAPI, ViewerOptions } from 'web-ifc-viewer';
import BaseAction from "./actions/base-action";

/**
 * Wrapper of @see IfcViewerAPI for the BIM application
 */
export default class BimViewer extends IfcViewerAPI {
	private actions: BaseAction[] = [];

	constructor(options: ViewerOptions) {
		super(options);
	}

	public registerAction(action: BaseAction): void {
		this.actions.push(action);
		action.register();
	}

	public async dispose(): Promise<void> {
		await super.dispose();

		// unbind actions
		this.actions.forEach((action: BaseAction) => {
			action.dispose();
		});
		this.actions = [];
	}

	public getSelectedIDs(modelID: number): Set<number> {
		// ! hack to bypass the private modifier of selectedFaces,
		// so we create a new set to prevent directly modify the value
		const selectedIDs = this.IFC.selector.selection["selectedFaces"];
		return new Set<number>(selectedIDs?.[modelID]);
	}

	/**
	 * Set max camera distance for the large size BIM
	 *
	 * @param maxDistance
	 */
	public setMaxCameraDistance(maxDistance = 1200) {
		this.context.ifcCamera.cameraControls.maxDistance = maxDistance;
		this.context.ifcCamera.perspectiveCamera.updateProjectionMatrix();
	}
}