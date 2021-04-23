/** The type of the progress bar */
export declare type ProgressBarType = "bar" | "bar/spin" | "spin" | "percent" | "percent/spin" | "bar/percent" | "bar/percent/spin";
interface ProgressBarOptions {
    type?: ProgressBarType;
    label?: string;
    start?: number;
    max?: number;
    length?: number;
}
/**
 * Progress bar that goes in the console
 */
export default class ProgressBar {
    constructor(options?: ProgressBarOptions, out?: typeof process.stdout);
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
    static _renderBar(out: typeof process.stdout, length: number, label: string, percent: number, max: number): void;
    /** @protected */
    static _renderBarSpin(out: typeof process.stdout, length: number, label: string, percent: number, max: number, spinState: number): void;
    /** @protected */
    static _renderSpin(out: typeof process.stdout, label: string, spinState: number): void;
    /** @protected */
    static _renderPercent(out: typeof process.stdout, label: string, percent: number, max: number): void;
    /** @protected */
    static _renderPercentSpin(out: typeof process.stdout, label: string, percent: number, max: number, spinState: number): void;
    /** @protected */
    static _renderBarPercent(out: typeof process.stdout, length: number, label: string, percent: number, max: number): void;
    /** @protected */
    static _renderBarPercentSpin(out: typeof process.stdout, length: number, label: string, percent: number, max: number, spinState: number): void;
    render(): this;
    tick(percent?: number): this;
    setFinished(): void;
}
export {};
