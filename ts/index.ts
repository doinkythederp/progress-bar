import { Writable as WriteStream } from "stream";
/** The type of the progress bar */
export type ProgressBarType = "bar" | "bar/spin" | "spin" | "percent" | "percent/spin" | "bar/percent" | "bar/percent/spin";

enum AnsiCodes {
	clear = "\u001b[2K",
	start = "\u001b[1000D"
}

const spinStates = {
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

/**
 * Progress bar that goes in the console
 */
export class ProgressBar {
	constructor(options: ProgressBarOptions = {}, out: typeof process.stdout = process.stdout) {
		this.type = options.type ?? "bar",
		this.out = out, this.percent = options.start ?? 0,
		this.max = options.max ?? 100,
		this.label = options.label ?? "",
		this._spinState = 0,
		this.isFinished = false,
		this.rendered = false,
		this.barLength = options.length ?? 20;

		this.finish = new Promise((resolve) => {
			this._finish = resolve;
		});
	}

	/** The length of the bar when using bar types */
	barLength: number;

	/**
	 * Whether or not the progress bar has been rendered
	 * @protected
	 */
	rendered: boolean;

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
	_spinState: number;

	/** Promise that resolves when the bar has finished (when `this.percent >= this.max`) */
	finish: Promise<void>;

	/** @private */
	_finish: Function;

	/** Whether or not the progress bar has finished - if true, means that logging to the console is safe. */
	isFinished: boolean;

	/** @protected */
	static _renderBar(out: WriteStream, length: number, label: string, percent: number, max: number) {
		out.write(AnsiCodes.clear);
		out.write(AnsiCodes.start);
		out.write(`${label ? label + " " : ""}[${"#".repeat(Math.floor(percent / (max / length)))}${" ".repeat(length - Math.floor(percent / (max / length)))}]`);
	}

	/** @protected */
	static _renderBarSpin(out: WriteStream, length: number, label: string, percent: number, max: number, spinState: number) {
		out.write(AnsiCodes.clear);
		out.write(AnsiCodes.start);
		out.write(`${label ? label + " " : ""}[${"#".repeat(Math.floor(percent / (max / length)))}${" ".repeat(length - Math.floor(percent / (max / length)))}]${percent !== max ? " " + spinStates[spinState] : " ✓"}`);
	}

	/** @protected */
	static _renderSpin(out: WriteStream, label: string, spinState: number) {
		out.write(AnsiCodes.clear);
		out.write(AnsiCodes.start);
		out.write(`${label ? label + " " : ""}${spinStates[spinState]}`);
	}

	/** @protected */
	static _renderPercent(out: WriteStream, label: string, percent: number, max: number) {
		out.write(AnsiCodes.clear);
		out.write(AnsiCodes.start);
		out.write(`${label ? label + " " : ""}${Math.floor(percent / (max / 100))}%`);
	}

	/** @protected */
	static _renderPercentSpin(out: WriteStream, label: string, percent: number, max: number, spinState: number) {
		out.write(AnsiCodes.clear);
		out.write(AnsiCodes.start);
		out.write(`${label ? label + " " : ""}${Math.floor(percent / (max / 100))}%${percent !== max ? " " + spinStates[spinState] : " ✓"}`);
	}

	/** @protected */
	static _renderBarPercent(out: WriteStream, length: number, label: string, percent: number, max: number) {
		out.write(AnsiCodes.clear);
		out.write(AnsiCodes.start);
		out.write(`${label ? label + " " : ""}[${"#".repeat(Math.floor(percent / (max / length)))}${" ".repeat(length - Math.floor(percent / (max / length)))}] ${Math.floor(percent / (max / 100))}%`);
	}

	/** @protected */
	static _renderBarPercentSpin(out: WriteStream, length: number, label: string, percent: number, max: number, spinState: number) {
		out.write(AnsiCodes.clear);
		out.write(AnsiCodes.start);
		out.write(`${label ? label + " " : ""}[${"#".repeat(Math.floor(percent / (max / length)))}${" ".repeat(length - Math.floor(percent / (max / length)))}] ${Math.floor(percent / (max / 100))}%${percent !== max ? " " + spinStates[spinState] : " ✓"}`);
	}

	render() {
		switch (this.type) {
			case "bar":
				ProgressBar._renderBar(this.out, this.barLength, this.label, this.percent, this.max);
				break;
			case "bar/spin":
				ProgressBar._renderBarSpin(this.out, this.barLength, this.label, this.percent, this.max, this._spinState);
				break;
			case "spin":
				ProgressBar._renderSpin(this.out, this.label, this._spinState);
				break;
			case "percent":
				ProgressBar._renderPercent(this.out, this.label, this.percent, this.max);
				break;
			case "percent/spin":
				ProgressBar._renderPercentSpin(this.out, this.label, this.percent, this.max, this._spinState);
				break;
			case "bar/percent":
				ProgressBar._renderBarPercent(this.out, this.barLength, this.label, this.percent, this.max);
				break;
			case "bar/percent/spin":
				ProgressBar._renderBarPercentSpin(this.out, this.barLength, this.label, this.percent, this.max, this._spinState);
				break;
		}
	}

	tick(percent: number = 1) {
		let doFinish = false;

		++this._spinState;
		if (this._spinState > 3) this._spinState = 0;

		this.percent += percent;
		if (this.percent >= this.max) {
			this.percent = this.max;

			doFinish = true;
		}
		this.render()

		if (doFinish) {
			console.log();
			if (!this.isFinished) this._finish();
			this.isFinished = true;
		}
		return this;
	}
}