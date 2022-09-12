import { GeoInfo } from "./../core/bim-viewer-options";
import * as dat from "dat.gui";
import BimViewer from "../core/bim-viewer";
import { Vector3 } from "three";
import { IFCModel } from "web-ifc-three/IFC/components/IFCModel";

const DEFAULT_GUI_PARAMS: dat.GUIParams = {
	closed: true,
	closeOnTop: true,
};

/**
 * Provide GUI for controlling the IFC models
 */
export default class GuiProvider {
	private gui: dat.GUI;

	constructor(container: HTMLElement, guiParams: dat.GUIParams = {}) {
		this.gui = new dat.GUI({
			...DEFAULT_GUI_PARAMS,
			...guiParams,
			autoPlace: false,
		});
		this.gui.hide();

		container.appendChild(this.gui.domElement);

		this.onChangeGeoInfo = this.onChangeGeoInfo.bind(this);
		this.setupGeoInfoGui = this.setupGeoInfoGui.bind(this);
		this.setupCoordsGui = this.setupCoordsGui.bind(this);
		this.setupOffsetGui = this.setupOffsetGui.bind(this);
		this.setupRotationGui = this.setupRotationGui.bind(this);
	}

	/**
	 * Setup GUI for control the IFC model in the map
	 * @param viewer
	 * @param geo
	 */
	public setupGeoInfoGui(viewer: BimViewer, geo: GeoInfo) {
		this.setupCoordsGui(geo, () => this.onChangeGeoInfo(viewer, geo, true));
		this.setupOffsetGui(geo, () => this.onChangeGeoInfo(viewer, geo, false));
		this.setupRotationGui(geo, () => this.onChangeGeoInfo(viewer, geo, false));

		this.gui.show();
	}

	public destroy() {
		this.gui.destroy();
	}

	private setupCoordsGui(geo: GeoInfo, callback: (value?: any) => void) {
		const folder = this.gui.addFolder("Coords");
		folder
			.add(geo, "latitude")
			.onChange(callback)
			.step(0.000001)
			.updateDisplay();
		folder
			.add(geo, "longitude")
			.onChange(callback)
			.step(0.000001)
			.updateDisplay();
	}

	private setupOffsetGui(geo: GeoInfo, callback: (value?: any) => void) {
		if (!geo.offset) {
			geo.offset = new Vector3(0, 0, 0);
		}
		const folder = this.gui.addFolder("Offset");
		folder.add(geo.offset, "x", -100, 100, 0.1).onChange(callback);
		folder.add(geo.offset, "y", -100, 100, 0.1).onChange(callback);
		folder.add(geo.offset, "z", -100, 100, 0.1).onChange(callback);
	}

	private setupRotationGui(geo: GeoInfo, callback: (value?: any) => void) {
		if (!geo.rotation) {
			geo.rotation = new Vector3(0, 0, 0);
		}
		const folder = this.gui.addFolder("Rotation");
		folder.add(geo.rotation, "x", -10, 10, 0.01).onChange(callback);
		folder.add(geo.rotation, "y", -10, 10, 0.01).onChange(callback);
		folder.add(geo.rotation, "z", -10, 10, 0.01).onChange(callback);
	}

	private onChangeGeoInfo(
		viewer: BimViewer,
		geo: GeoInfo,
		fitToFrame: boolean
	) {
		const ifcModel: IFCModel = viewer.context.items.ifcModels[0];
		if (!ifcModel) {
			console.error(
				"GUI change error",
				"Attempt to change geographical info when no model is loaded"
			);
			return;
		}

		viewer.moveIfcModelToCoords(ifcModel, geo);

		if (fitToFrame) {
			viewer.fitObjectToFrame(ifcModel);
		}
	}
}
