import * as THREE from 'three';
import { IfcViewerAPI } from "web-ifc-viewer";
import BaseAction from "./actions/base-action";
import BimViewerOptions, { GeoInfo } from "./bim-viewer-options";
import Stats from "stats.js";
import MapboxIfcMap from "./components/mapbox-ifc-map";
import { IFCModel } from "three/examples/jsm/loaders/IFCLoader";
import GeoUtils from "../utils/geo-utils";

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
		const viewerCanvas = this.context.getDomElement();
		// assign a class and a random ID for the canvas, for easily reference
		viewerCanvas.id = crypto.randomUUID();
		viewerCanvas.classList.add("bim-canvas");

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
	public setMaxCameraDistance(maxDistance = 1200): void {
		this.context.ifcCamera.cameraControls.maxDistance = maxDistance;
		this.context.ifcCamera.perspectiveCamera.updateProjectionMatrix();
	}

	/**
	 * Show memory visualization
	 */
	private showStats(): void {
		const stats = new Stats();
		stats.showPanel(2);

		const statsDom = stats.dom;
		statsDom.style.position = "absolute";

		this.context.getContainerElement().appendChild(statsDom);
		this.context.stats = stats;
	}

	async loadIfcFile(ifcFile: File, geo?: GeoInfo): Promise<IFCModel> {
		const ifcURL = URL.createObjectURL(ifcFile);
		const ifcModel = (await this.IFC.loadIfcUrl(ifcURL)) as IFCModel;

		if (!!ifcModel && !!geo) {
			const pos3D = GeoUtils.coordsToPosition(geo.latitude, geo.longitude);
			ifcModel.position.set(pos3D.x, pos3D.y, pos3D.z);
			this.context.fitToFrame();
			this.loadMap(geo.latitude, geo.longitude);
		}

		return ifcModel;
	}

	loadMap(latitude: number, longitude: number): void {
		const mapComponent = new MapboxIfcMap(this.context);
		this.context.addComponent(mapComponent);

		mapComponent.loadMap(latitude, longitude);
	}
}