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

	async dispose(): Promise<void> {
		await super.dispose();

		// unbind actions
		this.actions.forEach((action: BaseAction) => {
			action.dispose();
		});
		this.actions = [];
	}

	getSelectedIDs(): Set<number> {
		// ! hack to bypass the private modifier of selectedFaces,
		// so we create a new set to prevent directly modify the value
		const selectedIDs = this.IFC.selector.selection["selectedFaces"];
		return new Set<number>(selectedIDs);
	}
}