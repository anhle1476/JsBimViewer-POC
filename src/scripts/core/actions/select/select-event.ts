export const IfcSelect = {
	ifcSelect: "ifcSelect",
	ifcSelectAll: "ifcSelectAll",
	IfcDeselectAll: "IfcDeselectAll",
};

export interface IfcSelectEvent extends CustomEventInit {
	targetId: number;
	deselect: boolean;
	preserveSelected: boolean;
	selectedIDs: Set<number>;
}

export interface IfcSelectAllEvent extends CustomEventInit {}

export interface IfcDeselectAllEvent extends CustomEventInit {}
