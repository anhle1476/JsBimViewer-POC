import { Color } from "three";
import BimViewer from "./core/bim-viewer";

const container = document.getElementById("root")! as HTMLElement;
const viewer = new BimViewer({
	container,
	backgroundColor: new Color(0xffffff),
});
viewer.axes.setAxes();
viewer.grid.setGrid();

const input = document.getElementById("file-input")! as HTMLInputElement;
input.addEventListener(
	"change",
	async (changed : Event) => {
		const target = changed.target as HTMLInputElement;
		if (!target.files) return;
		const file = target.files[0];
		const ifcURL = URL.createObjectURL(file);
		viewer.IFC.loadIfcUrl(ifcURL);
	},
	false
);

window.ondblclick = () => viewer.IFC.selector.pickIfcItem(true);
window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();
viewer.clipper.active = true;

window.onkeydown = (event) => {
	if (event.code === "KeyP") {
		viewer.clipper.createPlane();
	} else if (event.code === "KeyO") {
		viewer.clipper.deletePlane();
	}
};

//DEBUG
(window as Record<string, any>)._viewer = viewer;
