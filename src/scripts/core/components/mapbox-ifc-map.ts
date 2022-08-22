import { IfcComponent } from "web-ifc-viewer";
import { IfcContext } from "web-ifc-viewer/dist/components";
import IfcMap from "./ifc-map";
import mapboxgl from "mapbox-gl";

export default class MapboxIfcMap extends IfcComponent implements IfcMap {
	private initSuccess = false;
	private map?: mapboxgl.Map;

	constructor(context: IfcContext) {
		super(context);
		this.init();
	}

	update(_delta: number): void {
		if (!this.initSuccess || !this.map) return;
		this.map.triggerRepaint();
	}

	private init() {
		const token = process.env.MAPBOX_TOKEN;
		if (!token) {
			console.error(
				"Mapbox init error",
				"No mapbox token is provided. Please set MAPBOX_TOKEN env variable"
			);
			return;
		}

		// hack to avoid the bug of can not assign accessToken
		(mapboxgl as any).accessToken = token;

		this.initSuccess = true;

		this.map = new mapboxgl.Map({
			container: "map",
			style: "mapbox://styles/mapbox/light-v10",
			zoom: 20.5,
			center: [13.4453, 52.491],
			pitch: 75,
			bearing: -80,
			antialias: true,
		});

		const modelOrigin = [13.4453, 52.491];
		const modelAltitude = 0;
		const modelRotate = [Math.PI / 2, 0.72, 0];

		/* const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
			modelOrigin,
			modelAltitude
		);

		const modelTransform = {
			translateX: modelAsMercatorCoordinate.x,
			translateY: modelAsMercatorCoordinate.y,
			translateZ: modelAsMercatorCoordinate.z,
			rotateX: modelRotate[0],
			rotateY: modelRotate[1],
			rotateZ: modelRotate[2],
			scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
		}; */
	}
}
