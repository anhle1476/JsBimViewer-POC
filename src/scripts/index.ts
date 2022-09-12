import { IFCModel } from "web-ifc-three/IFC/components/IFCModel";
import { Color, Vector3 } from "three";
import SelectAction from "./core/actions/select/select-action";
import BimViewer from "./core/bim-viewer";
import SimpleTree from "./structures/tree/simple-tree";
import * as dat from "dat.gui";
import { GeoInfo } from "./core/bim-viewer-options";
import GuiProvider from "./gui/gui-provider";

const container = document.getElementById("viewer-container")! as HTMLElement;
const viewer = new BimViewer({
	viewer: {
		container,
		backgroundColor: new Color(0xffffff),
	},
	showStats: true,
	cameraMaxDistance: 1200,
});
viewer.axes.setAxes();
viewer.grid.setGrid();

const geoOptions: GeoInfo = {
	latitude: 35.834236,
	longitude: 128.53421,
	offset: new Vector3(0, 0, 0),
	rotation: new Vector3(0, 0, 0),
};

const gui = new GuiProvider(container);

const treeRoot = document.getElementById("myUL") as HTMLUListElement;
const treeMenu = new SimpleTree(viewer.IFC, treeRoot);

const input = document.getElementById("file-input")! as HTMLInputElement;
input.addEventListener(
	"change",
	async (changed: Event) => {
		const target = changed.target as HTMLInputElement;
		if (!target.files) return;
		const file = target.files[0];
		await viewer.loadIfcFile(file, geoOptions);
		treeMenu.renderTree(0);
		gui.setupGeoInfoGui(viewer, geoOptions);
	},
	false
);

const selectAction = new SelectAction(viewer);
viewer.registerAction(selectAction);

// viewer.clipper.active = true;
//
// window.onkeydown = (event) => {
// 	if (event.code === "KeyP") {
// 		viewer.clipper.createPlane();
// 		console.log('create')
// 	} else if (event.code === "KeyO") {
// 		viewer.clipper.deletePlane();
// 		console.log('delete')
// 	}
// };

// GUI
// const scene = this.context.getScene();
//     const box = new Box3().setFromObject(scene.children[scene.children.length - 1]);
//     const sceneSize = new Vector3();
//     box.getSize(sceneSize);
//     const sceneCenter = new Vector3();
//     box.getCenter(sceneCenter);
//     const nearFactor = 0.5;
//     const radius = Math.max(sceneSize.x, sceneSize.y, sceneSize.z) * nearFactor;
//     const sphere = new Sphere(sceneCenter, radius);
//     await this.ifcCamera.cameraControls.fitToSphere(sphere, true);

// DEBUG
// TODO: remove, for DEV only
(window as Record<string, any>)._viewer = viewer;
