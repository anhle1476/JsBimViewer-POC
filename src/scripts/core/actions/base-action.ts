export default interface BaseAction {
	/**
	 * Register event handler for the child actions
	 */
	register(): void;

	/**
	 * dispose event handler
	 */
	dispose(): void;
}
