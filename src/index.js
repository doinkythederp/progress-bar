var AnsiCodes;
(function (AnsiCodes) {
    AnsiCodes["clear"] = "\u001B[2K";
    AnsiCodes["start"] = "\u001B[1000D";
})(AnsiCodes || (AnsiCodes = {}));
const spinStates = {
    0: "/",
    1: "—",
    2: "\\",
    3: "—"
};
/**
 * Progress bar that goes in the console
 */
export class ProgressBar {
    constructor(options = {}, out = process.stdout) {
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
    /** @protected */
    static _renderBar(out, length, label, percent, max) {
        out.write(AnsiCodes.clear);
        out.write(AnsiCodes.start);
        out.write(`${label ? label + " " : ""}[${"#".repeat(Math.floor(percent / (max / length)))}${" ".repeat(length - Math.floor(percent / (max / length)))}]`);
    }
    /** @protected */
    static _renderBarSpin(out, length, label, percent, max, spinState) {
        out.write(AnsiCodes.clear);
        out.write(AnsiCodes.start);
        out.write(`${label ? label + " " : ""}[${"#".repeat(Math.floor(percent / (max / length)))}${" ".repeat(length - Math.floor(percent / (max / length)))}]${percent !== max ? " " + spinStates[spinState] : " ✓"}`);
    }
    /** @protected */
    static _renderSpin(out, label, spinState) {
        out.write(AnsiCodes.clear);
        out.write(AnsiCodes.start);
        out.write(`${label ? label + " " : ""}${spinStates[spinState]}`);
    }
    /** @protected */
    static _renderPercent(out, label, percent, max) {
        out.write(AnsiCodes.clear);
        out.write(AnsiCodes.start);
        out.write(`${label ? label + " " : ""}${Math.floor(percent / (max / 100))}%`);
    }
    /** @protected */
    static _renderPercentSpin(out, label, percent, max, spinState) {
        out.write(AnsiCodes.clear);
        out.write(AnsiCodes.start);
        out.write(`${label ? label + " " : ""}${Math.floor(percent / (max / 100))}%${percent !== max ? " " + spinStates[spinState] : " ✓"}`);
    }
    /** @protected */
    static _renderBarPercent(out, length, label, percent, max) {
        out.write(AnsiCodes.clear);
        out.write(AnsiCodes.start);
        out.write(`${label ? label + " " : ""}[${"#".repeat(Math.floor(percent / (max / length)))}${" ".repeat(length - Math.floor(percent / (max / length)))}] ${Math.floor(percent / (max / 100))}%`);
    }
    /** @protected */
    static _renderBarPercentSpin(out, length, label, percent, max, spinState) {
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
    tick(percent = 1) {
        let doFinish = false;
        ++this._spinState;
        if (this._spinState > 3)
            this._spinState = 0;
        this.percent += percent;
        if (this.percent >= this.max) {
            this.percent = this.max;
            doFinish = true;
        }
        this.render();
        if (doFinish) {
            console.log();
            if (!this.isFinished)
                this._finish();
            this.isFinished = true;
        }
        return this;
    }
}
