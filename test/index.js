import { ProgressBar } from "../src/index.js";
import { promisify } from "util";
import readline from "readline";

const rl = readline.createInterface(process.stdin, process.stdout);
const input = (label) => {
	return new Promise(resolve => rl.question(label, resolve));
}

async function run() {
	console.log('Allowed types: "bar" | "bar/spin" | "spin" | "percent" | "percent/spin" | "bar/percent" | "bar/percent/spin"');
	const type = await input("Enter type: ");
	const label = await input("Enter label (optional): ");
	const length = await input("Enter length (if applicable; optional): ");

	let bar = new ProgressBar({
		max: 40,
		type,
		label: label || undefined,
		length
	});

	let i = setInterval(() => bar.tick(), 100);

	bar.finish.then(() => {
		clearInterval(i);
		console.log("Done!");
		process.exit(0);
	});
}

run();