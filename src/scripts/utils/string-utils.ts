export default class StringUtils {
	private static IFC_UNICODE_REGEX = /\\X2\\(.*?)\\X0\\/giu;

	/**
	 * Decode the string in IFC files by the ISO 10303-21 standard. Will return the original string if it's not encoded
	 *
	 * @link https://technical.buildingsmart.org/resources/ifcimplementationguidance/string-encoding/
	 * @param ifcString encoded string
	 */
	public static decodeIfcString(ifcString: string): string {
		// Based on https://github.com/IFCjs/web-ifc/issues/58#issuecomment-870344068
		// ! TODO: revisit this if bad performance.
		let resultString = ifcString;
		let match = StringUtils.IFC_UNICODE_REGEX.exec(ifcString);
		while (match) {
			const unicodeChar = String.fromCharCode(parseInt(match[1], 16));
			resultString = resultString.replace(match[0], unicodeChar);
			match = StringUtils.IFC_UNICODE_REGEX.exec(ifcString);
		}
		return resultString;
	}
}
