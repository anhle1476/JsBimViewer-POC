import * as THREE from "three";
import { IfcViewerAPI } from "web-ifc-viewer";
import BaseAction from "./actions/base-action";
import BimViewerOptions, { GeoInfo } from "./bim-viewer-options";
import Stats from "stats.js";
import MapboxIfcMap from "./components/mapbox-ifc-map";
import { IFCModel } from "web-ifc-three/IFC/components/IFCModel";
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
			this.moveIfcModelToCoords(ifcModel, geo);
			this.fitObjectToFrame(ifcModel);
			this.loadMap(geo.latitude, geo.longitude);
		}

		return ifcModel;
	}

	moveIfcModelToCoords(ifcModel: IFCModel, geo: GeoInfo): void {
		let coordPos: THREE.Vector3 = GeoUtils.coordsToPosition(
			geo.latitude,
			geo.longitude
		);
		if (!!geo.offset) {
			coordPos = coordPos.add(geo.offset);
		}
		ifcModel.position.set(coordPos.x, coordPos.y, coordPos.z);

		if (!!geo.rotation) {
			ifcModel.rotation.setFromVector3(geo.rotation);
		}
	}

	loadMap(latitude: number, longitude: number): void {
		const mapComponent = new MapboxIfcMap(this.context);
		this.context.addComponent(mapComponent);

		mapComponent.loadMap(latitude, longitude);
	}

	/**
	 * Fit an 3D object to frame. Use this instead of `context.fitToFrame()` when the map is used,
	 * so we only care about the specific object rather then the whole map
	 * @param obj
	 * @param nearFactor
	 */
	async fitObjectToFrame(
		obj: THREE.Object3D<THREE.Event>,
		nearFactor: number = 0.5
	): Promise<void> {
		const box = new THREE.Box3().setFromObject(obj);
		const objSize = new THREE.Vector3();
		box.getSize(objSize);
		const objCenter = new THREE.Vector3();
		box.getCenter(objCenter);

		const radius = Math.max(objSize.x, objSize.y, objSize.z) * nearFactor;
		const sphere = new THREE.Sphere(objCenter, radius);
		await this.context.ifcCamera.cameraControls.fitToSphere(sphere, true);
	}
}
