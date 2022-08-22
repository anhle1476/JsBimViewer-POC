import { IfcSelect, IfcSelectEvent } from "./select-event";
import BaseAction from "../base-action";
import BimViewer from "../../bim-viewer";

export default class SelectAction implements BaseAction {
	private viewer: BimViewer;
	private domElement: HTMLElement;

	constructor(bimViewer: BimViewer) {
		this.viewer = bimViewer;
		this.domElement = bimViewer.context.getDomElement();
	}

	public register(): void {
		this.domElement.addEventListener("dblclick", this.handleSelectIfcItem);
		this.domElement.addEventListener("mousemove", this.handlePrePickIfcItem);
	}

	public dispose(): void {
		this.domElement.removeEventListener("dblclick", this.handleSelectIfcItem);
		this.domElement.removeEventListener("mousemove", this.handlePrePickIfcItem);
	}

	handleSelectIfcItem = async (event: MouseEvent) => {
		console.log("select", event);

		const focusSelection = false;
		const preserveSelected = event.ctrlKey;
		const pick = await this.viewer.IFC.selector.pickIfcItem(
			focusSelection,
			preserveSelected
		);

		if (!pick) return;

		// dispatch ifcSelect event
		const eventArgs: IfcSelectEvent = {
			targetId: pick.id,
			deselect: false,
			preserveSelected: false,
			selectedIDs: this.viewer.getSelectedIDs(),
		};
		const selectEvent = new CustomEvent(IfcSelect.ifcSelect, eventArgs);
		this.domElement.dispatchEvent(selectEvent);
	};

	handlePrePickIfcItem = async (event: Event) => {
		this.viewer.IFC.selector.prePickIfcItem();
	};
}
