import * as icons from "./ifc-icons.json";

/**
 * Provide unicode icon for the structure tree
 */
export default class IconsProvider {
	private iconsMap: Map<string, string> = new Map<string, string>();

	constructor() {
		this.init();
	}

	private init() {
		const iconMap = icons as Record<string, string>;
		const ifcTypes: string[] = Object.keys(iconMap);
		ifcTypes.forEach((ifcType) => {
			this.iconsMap.set(ifcType.toUpperCase(), iconMap[ifcType]);
		});
	}

  /**
   * Get ifc unicode icon by type
   * 
   * @param ifcType the ifc type
   * @returns unicode icon
   */
	public getIcon(ifcType: string): string {
		return this.iconsMap.get(ifcType) || "\uf1c4";
	}
}
