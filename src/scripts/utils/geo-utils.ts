import { UnitsUtils } from "geo-three";
import { Vector2, Vector3 } from "three";

export default class GeoUtils {
	static coordsToPosition(latitude: number, longitude: number): Vector3 {
		const pos2D: Vector2 = UnitsUtils.datumsToSpherical(latitude, longitude);
		return new Vector3(pos2D.x, 0, -pos2D.y);
	}
}
