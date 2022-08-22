import { IfcNode } from "./ifc-node";
import { IfcManager } from "web-ifc-viewer/dist/components";
import StructureTree from "./structure-tree";
import StringUtils from "../../utils/string-utils";
import IconsProvider from "../icons/icons-provider";

export default class SimpleTree implements StructureTree {
	private static DEFAULT_NODE_NAME: string = "Unknown";

	private ifcManager: IfcManager;
	private treeRoot: HTMLElement;
	private iconsProvider: IconsProvider;

	constructor(ifcManager: IfcManager, treeRoot: HTMLElement) {
		this.ifcManager = ifcManager;
		this.treeRoot = treeRoot;
		this.iconsProvider = new IconsProvider();
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
		const children: IfcNode[] = ifcNode.children;

		if (children.length === 0) {
			this.createLeafNode(parent, ifcNode);
		} else {
			// If there are multiple categories, group them together
			const grouped = this.groupCategories(children);
			this.createBranchNode(parent, ifcNode, grouped);
		}
	}

	private createBranchNode(
		parent: HTMLElement,
		ifcNode: IfcNode,
		groupedChildren: IfcNode[]
	) {
		// container
		const nodeContainer = document.createElement("li");
		parent.appendChild(nodeContainer);

		// title
		const title = document.createElement("span");
		title.innerHTML = this.getNodeHTML(ifcNode);
		title.classList.add("caret", "ifc-node");
		title.dataset['ifcId'] = ifcNode.expressID.toString();
		nodeContainer.appendChild(title);

		// children
		const childrenContainer = document.createElement("ul");
		childrenContainer.classList.add("nested");
		nodeContainer.appendChild(childrenContainer);

		groupedChildren.forEach((child) =>
			this.createNode(childrenContainer, child)
		);
	}

	private createLeafNode(parent: HTMLElement, ifcNode: IfcNode) {
		const leaf = document.createElement("li") as HTMLLIElement;
		leaf.classList.add("leaf-node", "ifc-node");
		leaf.dataset['ifcId'] = ifcNode.expressID.toString();
		leaf.innerHTML = this.getNodeHTML(ifcNode);
		
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

	private getNodeHTML(node: IfcNode): string {
		let iconUnicode = this.iconsProvider.getIcon(node.type);

		let nodeName = SimpleTree.DEFAULT_NODE_NAME;

		if (!!node.Name) {
			nodeName = StringUtils.decodeIfcString(node.Name.value.toString());
		}

		return `<span class='icons-wrapper' title='${node.type}'><i class='material-icons'>${iconUnicode}</i></span>: ${nodeName}`;
	}
}
