export default interface StructureTree {
	renderTree(modelID: number): Promise<void>;

	showElement(expressID: number): Promise<void>;

	hideElement(expressID: number): Promise<void>;
}
