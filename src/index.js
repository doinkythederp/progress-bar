/**
 * @module @doinkythederp/progress-bar
 */

const AnsiCodes = {
  clear: "\u001b[2K",
  start: "\u001b[1000D",
};

const spinStates = {
  0: "/",
  1: "—",
  2: "\\",
  3: "—",
};

module.exports = class ProgressBar {
  constructor(options, out = process.stdout) {
    options = options ?? {};
    (this.type = options.type ?? "bar"),
      (this.out = out),
      (this.percent = options.start ?? 0),
      (this.max = options.max ?? 100),
      (this.label = options.label ?? ""),
      (this._spinState = 0),
      (this.isFinished = false),
      (this.rendered = false),
      (this.barLength = options.length ?? 20);

    this.finish = new Promise((resolve) => {
      this._finish = resolve;
    });
  }

  barLength;

  rendered;

  type;

  percent;

  max;

  out;

  label;

  _spinState;

  finish;

  _finish;

  isFinished;

  static _renderBar(out, length, label, percent, max) {
    out.write(AnsiCodes.clear);
    out.write(AnsiCodes.start);
    out.write(
      `${label ? label + " " : ""}[${createBar(percent, max, length)}]`.substr(
        0,
        out.columns
      )
    );
  }

  /** @protected */
  static _renderBarSpin(out, length, label, percent, max, spinState) {
    out.write(AnsiCodes.clear);
    out.write(AnsiCodes.start);
    out.write(
      `${label ? label + " " : ""}[${createBar(percent, max, length)}]${
        percent !== max ? " " + spinStates[spinState] : " ✓"
      }`.substr(0, out.columns)
    );
  }

  /** @protected */
  static _renderSpin(out, label, spinState) {
    out.write(AnsiCodes.clear);
    out.write(AnsiCodes.start);
    out.write(
      `${label ? label + " " : ""}${spinStates[spinState]}`.substr(
        0,
        out.columns
      )
    );
  }

  /** @protected */
  static _renderPercent(out, label, percent, max) {
    out.write(AnsiCodes.clear);
    out.write(AnsiCodes.start);
    out.write(
      `${label ? label + " " : ""}${getPercent(percent, max)}%`.substr(
        0,
        out.columns
      )
    );
  }

  /** @protected */
  static _renderPercentSpin(out, label, percent, max, spinState) {
    out.write(AnsiCodes.clear);
    out.write(AnsiCodes.start);
    out.write(
      `${label ? label + " " : ""}${getPercent(percent, max)}%${
        percent !== max ? " " + spinStates[spinState] : " ✓"
      }`.substr(0, out.columns)
    );
  }

  /** @protected */
  static _renderBarPercent(out, length, label, percent, max) {
    out.write(AnsiCodes.clear);
    out.write(AnsiCodes.start);
    out.write(
      `${label ? label + " " : ""}[${createBar(
        percent,
        max,
        length
      )}] ${getPercent(percent, max)}%`.substr(0, out.columns)
    );
  }

  /** @protected */
  static _renderBarPercentSpin(out, length, label, percent, max, spinState) {
    out.write(AnsiCodes.clear);
    out.write(AnsiCodes.start);
    out.write(
      `${label ? label + " " : ""}[${createBar(
        percent,
        max,
        length
      )}] ${getPercent(percent, max)}%${
        percent !== max ? " " + spinStates[spinState] : " ✓"
      }`.substr(0, out.columns)
    );
  }

  render() {
    switch (this.type) {
      case "bar":
        ProgressBar._renderBar(
          this.out,
          this.barLength,
          this.label,
          this.percent,
          this.max
        );
        break;
      case "bar/spin":
        ProgressBar._renderBarSpin(
          this.out,
          this.barLength,
          this.label,
          this.percent,
          this.max,
          this._spinState
        );
        break;
      case "spin":
        ProgressBar._renderSpin(this.out, this.label, this._spinState);
        break;
      case "percent":
        ProgressBar._renderPercent(
          this.out,
          this.label,
          this.percent,
          this.max
        );
        break;
      case "percent/spin":
        ProgressBar._renderPercentSpin(
          this.out,
          this.label,
          this.percent,
          this.max,
          this._spinState
        );
        break;
      case "bar/percent":
        ProgressBar._renderBarPercent(
          this.out,
          this.barLength,
          this.label,
          this.percent,
          this.max
        );
        break;
      case "bar/percent/spin":
        ProgressBar._renderBarPercentSpin(
          this.out,
          this.barLength,
          this.label,
          this.percent,
          this.max,
          this._spinState
        );
        break;
    }

    return this;
  }

  tick(percent = 1) {
    let doFinish = false;

    ++this._spinState;
    if (this._spinState > 3) this._spinState = 0;

    this.percent += percent;
    if (getPercent(this.percent, this.max) === 100) {
      this.percent = this.max;

      doFinish = true;
    }
    this.render();

    if (doFinish) {
      console.log();
      if (!this.isFinished) this._finish();
      this.isFinished = true;
    }
    return this;
  }

  setFinished() {
    (this.max = 100), (this.percent = 100);
    this.tick(0);
  }
};
/**
 * Returns a percent from a value and a maximum
 * @param {number} current
 * @param {number} max
 */
function getPercent(current, max) {
  let percent = Math.floor(current / (max / 100));
  if (isNaN(percent)) percent = 100;
  return percent;
}

/**
 * Creates a bar that is partly filled based on the inputs
 * @param {number} current
 * @param {number} max
 * @param {number} length - The length of the bar
 */
function createBar(current, max, length) {
  return `${"#".repeat((getPercent(current, max) / 100) * length)}${" ".repeat(
    length - (getPercent(current, max) / 100) * length
  )}`;
}
