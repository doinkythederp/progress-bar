/** The type of the progress bar */
export type ProgressBarType = "bar" | "bar/spin" | "spin" | "percent" | "percent/spin" | "bar/percent" | "bar/percent/spin";

declare const AnsiCodes: {
	clear: "\u001b[2K",
	start: "\u001b[1000D"
}

declare const spinStates: {
	0: "/",
	1: "—",
	2: "\\",
	3: "—"
}

interface ProgressBarOptions {
	type?: ProgressBarType,
	label?: string,
	start?: number,
	max?: number,
	length?: number
}

declare class ProgressBar {
    /**
     * Create a new ProgressBar
     * Hidden by default, unless render or tick is called.
     * @param options 
     * @param out 
     */
	constructor(options?: ProgressBarOptions, out?: typeof process.stdout);

	/** The length of the bar when using bar types */
	barLength: number;

	/**
	 * Whether or not the progress bar has been rendered
	 * @protected
	 */
    protected rendered: boolean;

	/** The type of this progress bar */
	type: ProgressBarType;

	/** The percent completion of the progress bar. */
	percent: number;

	/** 
	 * The number `this.percent` has to get to before the bar is complete
	 * @default 100
	 */
	max: number;

	/** The write stream to log to */
	out: typeof process.stdout;

	/** The label of the progress bar */
	label: string;

	/** @protected */
	protected _spinState: number;

	/** Promise that resolves when the bar has finished (when `this.percent >= this.max`) */
	finish: Promise<void>;

	/** @private */
	private _finish: Function;

	/** Whether or not the progress bar has finished - if true, means that logging to the console is safe. */
	isFinished: boolean;

	/** @protected */
	protected static _renderBar(out: typeof process.stdout, length: number, label: string, percent: number, max: number): void
	/** @protected */
	protected static _renderBarSpin(out: typeof process.stdout, length: number, label: string, percent: number, max: number, spinState: number): void

	/** @protected */
	protected static _renderSpin(out: typeof process.stdout, label: string, spinState: number): void

	/** @protected */
	protected static _renderPercent(out: typeof process.stdout, label: string, percent: number, max: number): void

	/** @protected */
	protected static _renderPercentSpin(out: typeof process.stdout, label: string, percent: number, max: number, spinState: number): void

	/** @protected */
	protected static _renderBarPercent(out: typeof process.stdout, length: number, label: string, percent: number, max: number): void

	/** @protected */
	protected static _renderBarPercentSpin(out: typeof process.stdout, length: number, label: string, percent: number, max: number, spinState: number): void

    /**
     * Render the progress bar
     */
	render(): this

    /**
     * Update the progress bar.
     * @param percent - Change the completion percent by this much
     */
	tick(percent: number): this

    /** Set the completion to 100% */
	setFinished(): void
}

export default ProgressBar;

declare function getPercent(current: number, max: number): number

declare function createBar(current: number, max: number, length: number): string