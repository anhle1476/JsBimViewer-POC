import { IfcNode } from "./ifc-node";
import { IfcManager } from "web-ifc-viewer/dist/components";
import StructureTree from "./structure-tree";
import StringUtils from "../../utils/string-utils";

export default class SimpleTree implements StructureTree {
	private static DEFAULT_NODE_NAME: string = "Unknown";

	private ifcManager: IfcManager;
	private treeRoot: HTMLElement;

	constructor(ifcManager: IfcManager, treeRoot: HTMLElement) {
		this.ifcManager = ifcManager;
		this.treeRoot = treeRoot;
	}

	public async renderTree(modelID: number): Promise<void> {
		const ifcRootNode: IfcNode = await this.getSpatialStructureWithProps(
			modelID
		);
		console.log(ifcRootNode);
		this.createNode(this.treeRoot, ifcRootNode);
		this.generateTreeLogic();
	}

	public async showElement(expressID: number): Promise<void> {
		throw new Error("Method not implemented.");
	}

	public async hideElement(expressID: number): Promise<void> {
		throw new Error("Method not implemented.");
	}

	private async getSpatialStructureWithProps(
		modelID: number
	): Promise<IfcNode> {
		return this.ifcManager.getSpatialStructure(
			modelID,
			true
		) as Promise<IfcNode>;
	}

	private createNode(parent: HTMLElement, ifcNode: IfcNode) {
		const text: string = this.getNodeTextContent(ifcNode);
		const children: IfcNode[] = ifcNode.children;

		if (children.length === 0) {
			this.createLeafNode(parent, text);
		} else {
			// If there are multiple categories, group them together
			const grouped = this.groupCategories(children);
			this.createBranchNode(parent, text, grouped);
		}
	}

	private createBranchNode(
		parent: HTMLElement,
		text: string,
		children: IfcNode[]
	) {
		// container
		const nodeContainer = document.createElement("li");
		parent.appendChild(nodeContainer);

		// title
		const title = document.createElement("span");
		title.textContent = text;
		title.classList.add("caret");
		nodeContainer.appendChild(title);

		// children
		const childrenContainer = document.createElement("ul");
		childrenContainer.classList.add("nested");
		nodeContainer.appendChild(childrenContainer);

		children.forEach((child) => this.createNode(childrenContainer, child));
	}

	private createLeafNode(parent: HTMLElement, text: string) {
		const leaf = document.createElement("li") as HTMLLIElement;
		leaf.classList.add("leaf-node");
		leaf.textContent = text;
		parent.appendChild(leaf);
	}

	private groupCategories(children: IfcNode[]) {
		const types: string[] = children.map((child) => child.type);
		const uniqueTypes = new Set<string>(types);
		if (uniqueTypes.size > 1) {
			const uniquesArray: string[] = Array.from(uniqueTypes);
			children = uniquesArray.map((type) => {
				return {
					expressID: -1,
					type: type + "S",
					children: children.filter((child) => child.type.includes(type)),
				};
			});
		}
		return children;
	}

	private generateTreeLogic() {
		const toggler = [
			...document.getElementsByClassName("caret"),
		] as HTMLElement[];
		for (let i = 0; i < toggler.length; i++) {
			toggler[i].addEventListener("click", function () {
				this.classList.toggle("caret-down");
				this.parentElement
					?.querySelector(".nested")
					?.classList.toggle("active");
			});
		}
	}

	private getNodeTextContent(node: IfcNode): string {
		let nodeName = SimpleTree.DEFAULT_NODE_NAME;

		if (node.Name) {
			let nodeName = node.Name.value.toString();
			nodeName = StringUtils.decodeIfcString(nodeName);
		}

		return `${node.type}: ${nodeName}`;
	}
}
