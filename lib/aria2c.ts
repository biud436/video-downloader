var __aria2cPath = "aria2c";
import cp from "child_process";

interface IAria2cHeader {
	referrer: string;
	userAgent: string;
	inputFile: string;
	logFile: string;
}

type Aria2cCallback = (error: any, stdout: any, stderr: any) => void;

export default class Aria2c {
	private _process: cp.ChildProcess;
	private _header: IAria2cHeader;
	private _callback: Aria2cCallback;
	private _args: string[];

	get internel() {
		return this._process;
	}

	/**
     * 
     * @param {{
        referrer : string,
        userAgent : string,
        inputFile : string,
        logFile : string,
    }} header 
     * @param {*} callback 
     */
	constructor(header: IAria2cHeader, callback: Aria2cCallback) {
		this._header = header;
		this._callback = callback;
		this._process = null;
		this._args = null;

		this.makeCommand();
		this.run();
	}

	makeCommand() {
		const referrer = this._header.referrer;
		const userAgent = this._header.userAgent;
		const inputFile = this._header.inputFile;
		const logFile = this._header.logFile;

		this._args = [
			`--referer=${referrer}`,
			`--user-agent=${userAgent}`,
			`--show-files`,
			`--continue=true`,
			`--retry-wait=2`,
			`--split=6`,
			`-i ${inputFile}`,
			`--log-level=info`,
		];
	}

	run() {
		this._process = cp.execFile(
			__aria2cPath,
			this._args,
			{
				encoding: "utf8",
				maxBuffer: 1024 * 1024,
			},
			this._callback
		);
		if (!this._process) return;
		this._process.stdout.on("data", function (data: any) {
			console.clear();
			console.log(data);
		});
		this._process.stdout.on("end", function (data: any) {
			console.log(data);
		});
		this._process.stdin.end();
		return this;
	}

	pendingTerminate() {
		if (!this._process) return;
		this._process.on("beforeExit", () => this._process.kill());
	}

	onExit(callback: (...args: any[]) => void) {
		if (!this._process) return;
		this._process.on("exit", callback);
	}
}
