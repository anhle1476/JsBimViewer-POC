import { MapBoxProvider, MapView } from "geo-three";
import { IfcComponent } from "web-ifc-viewer";
import { IfcContext } from "web-ifc-viewer/dist/components";
import GeoUtils from "../../utils/geo-utils";

export default class MapboxIfcMap extends IfcComponent {
	private context: IfcContext;
	private map?: MapView;

	constructor(context: IfcContext) {
		super(context);
		this.context = context;

		this.loadMap = this.loadMap.bind(this);
	}

	update(_delta: number): void {}

	loadMap(
		latitude: number = 37.52762656961364,
		longitude: number = 127.0283651087938
	): void {
		var mapboxToken = process.env.MAPBOX_TOKEN || "";
		var provider = new MapBoxProvider(
			mapboxToken,
			"mapbox/streets-v10",
			MapBoxProvider.STYLE
		);
		this.map = new MapView(MapView.PLANAR, provider);
		this.context.getScene().add(this.map);
	}
}
