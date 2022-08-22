import * as THREE from 'three';
import { IfcViewerAPI, ViewerOptions } from 'web-ifc-viewer';
import BaseAction from "./actions/base-action";
import BimViewerOptions from "./bim-viewer-options";
import Stats from "stats.js";

/**
 * Wrapper of @see IfcViewerAPI for the BIM application
 */
export default class BimViewer extends IfcViewerAPI {
	private readonly actions: BaseAction[] = [];

	constructor(options: BimViewerOptions) {
		super(options.viewer);

		this.init(options);
	}

	private init(options: BimViewerOptions): void {
		if (!!options.cameraMaxDistance) {
			this.setMaxCameraDistance(options.cameraMaxDistance);
		}

		if (!!options.showStats) {
			this.showStats();
		}
	}

	public registerAction(action: BaseAction): void {
		this.actions.push(action);
		action.register();
	}

	public async dispose(): Promise<void> {
		await super.dispose();

		// unbind and remove actions
		while (this.actions.length > 0) {
			const action = this.actions.pop();
			action?.dispose();
		}
	}

	/**
	 * Get selected element express IDs
	 * @param modelID model ID
	 * @returns Set of selected express IDs
	 */
	public getSelectedIDs(modelID: number): Set<number> {
		// ! hack to bypass the private modifier of selectedFaces, create a new set to prevent modification
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

	/**
	 * Show memory visualization
	 */
	private showStats() {
		const stats = new Stats();
		stats.showPanel(2);

		const statsDom = stats.dom;
		statsDom.style.position = "absolute";

		this.context.getContainerElement().appendChild(statsDom);
		this.context.stats = stats;
	}
}