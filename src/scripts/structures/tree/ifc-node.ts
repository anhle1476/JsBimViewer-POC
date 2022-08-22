export type TypeValue = {
	type: number;
	value: number | string;
};

export type IfcNode = {
	expressID: number;
	type: string;
	children: IfcNode[];

	Name?: TypeValue;
	Description?: TypeValue;
	Tag?: TypeValue;
	CompositionType?: TypeValue;
	ElevationOfHeight?: TypeValue;
	ElevationOfTerrain?: TypeValue;
	GlobalId?: TypeValue;
	ObjectPlacement?: TypeValue;
	OwnerHistory?: TypeValue;
	Representation?: TypeValue;

	RefElevation?: TypeValue;
	RefLatitude?: TypeValue[];
	RefLongitude?: TypeValue[];
};
