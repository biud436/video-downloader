import minimist from "minimist";
import { Utils } from "./utils";
import { EventEmitter } from "events";
import {
	ProgramArguments,
	IRuntimeVariables,
	NoProgramArgumentsError,
	mainPath,
	handleRuntimeVariables,
} from "./program.arguments";

// 추론
const argv = minimist(process.argv.slice(2));

namespace EntryPoint {
	let RUNTIME_VARIABLES: IRuntimeVariables;

	/**
	 * @class Application
	 */
	export class Application extends EventEmitter {
		constructor(public readonly argv: ProgramArguments) {
			super();
			this.initMembers();
		}

		public initMembers(): void {}

		public start(): void {
			if (!this.checkDepndencies()) {
				throw new NoProgramArgumentsError();
			}
		}

		private checkDepndencies(): boolean {
			let result = true;
			const args = this.argv;

			if (!args.videoName || args.videoName === "") {
				console.warn("node index.js tslist.txt TMP-000");
				return (result = false);
			}

			RUNTIME_VARIABLES = <IRuntimeVariables>handleRuntimeVariables(args);
			this.emit("ready", RUNTIME_VARIABLES, args);

			return result;
		}
	}
}

const onReadyEvent = (runtime: IRuntimeVariables, args: ProgramArguments) => {
	let utils = new Utils(runtime, args);
	if (argv.concat) {
		utils.createConcatList();
	} else if (argv.export) {
		utils.encodingVideoWindows();
	} else if (argv.m3u8) {
		// node index.js tslist.txt XXX-010 --mu38
		utils.startDownloadFromM3U8();
	} else {
		utils.loadTsList();
	}
};

const entryPoint = new EntryPoint.Application(
	<ProgramArguments>(<unknown>minimist(process.argv.slice(2)))
);
entryPoint.on("ready", onReadyEvent);
entryPoint.start();
