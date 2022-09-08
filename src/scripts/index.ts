import { Color } from "three";
import SelectAction from "./core/actions/select/select-action";
import BimViewer from "./core/bim-viewer";
import SimpleTree from "./structures/tree/simple-tree";

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

const treeRoot = document.getElementById("myUL") as HTMLUListElement;
const treeMenu = new SimpleTree(viewer.IFC, treeRoot);

const input = document.getElementById("file-input")! as HTMLInputElement;
input.addEventListener(
	"change",
	async (changed: Event) => {
		const target = changed.target as HTMLInputElement;
		if (!target.files) return;
		const file = target.files[0];
		await viewer.loadIfcFile(file, {
			latitude: 35.834236,
			longitude: 128.53421,
		});
		treeMenu.renderTree(0);
	},
	false
);

const selectAction = new SelectAction(viewer);
viewer.registerAction(selectAction);

viewer.clipper.active = true;

window.onkeydown = (event) => {
	if (event.code === "KeyP") {
		viewer.clipper.createPlane();
	} else if (event.code === "KeyO") {
		viewer.clipper.deletePlane();
	}
};

// TODO: remove, for DEV only
(window as Record<string, any>)._viewer = viewer;