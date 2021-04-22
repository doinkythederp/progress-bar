/// <reference types="node" />
import { Writable as WriteStream } from "stream";
/** The type of the progress bar */
export declare type ProgressBarType = "bar" | "bar/spin" | "spin" | "percent" | "percent/spin" | "bar/percent" | "bar/percent/spin";
interface ProgressBarOptions {
    type?: ProgressBarType;
    label?: string;
    start?: number;
    max?: number;
}
/**
 * Progress bar that goes in the console
 */
export declare class ProgressBar {
    constructor(options?: ProgressBarOptions, out?: WriteStream);
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
    /**  */
    out: WriteStream;
    label: string;
    /** @protected */
    _spinState: number;
    finish: Promise<void>;
    /** @private */
    _finish: Function;
    /** Whether or not the progress bar has finished - if true, means that logging is safe. */
    isFinished: boolean;
    /** @protected */
    static _renderBar(out: WriteStream, label: string, percent: number, max: number): void;
    /** @protected */
    static _renderBarSpin(out: WriteStream, label: string, percent: number, max: number, spinState: number): void;
    /** @protected */
    static _renderSpin(out: WriteStream, label: string, spinState: number): void;
    /** @protected */
    static _renderPercent(out: WriteStream, label: string, percent: number, max: number): void;
    /** @protected */
    static _renderPercentSpin(out: WriteStream, label: string, percent: number, max: number, spinState: number): void;
    /** @protected */
    static _renderBarPercent(out: WriteStream, label: string, percent: number, max: number): void;
    /** @protected */
    static _renderBarPercentSpin(out: WriteStream, label: string, percent: number, max: number, spinState: number): void;
    render(): void;
    tick(percent?: number): this;
}
export {};
