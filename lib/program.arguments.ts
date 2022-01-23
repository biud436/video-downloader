namespace EntryPoint {
	export class ProgramArguments {
		public tslist: string;
		public videoName: string;
		public option: string;
		public concat?: boolean = false;
		public export?: boolean = false;
		public m3u8?: boolean = false;
		public inputFile?: string = undefined;
		public referrer?: string = undefined;

		constructor(argv: any) {
			this.tslist = argv._[0];
			this.videoName = argv._[1];
			this.option = argv._[2];

			this.concat = argv.concat ? true : false;
			this.export = argv.export ? true : false;
			this.m3u8 = argv.m3u8 ? true : false;
			if (argv.inputFile) this.inputFile = argv.inputFile;
			if (argv.referrer) this.referrer = argv.referrer;
		}
	}

	export interface IRuntimeVariables {
		productName: string;
		outputPath: string;
		output: string[];
		outputRaw: string;
		isValidCygwin: boolean;

		// 정의되지 않은 키도 사용 가능
		[arg: string]: any;
	}

	export class NoProgramArgumentsError extends Error {
		public static MESSAGE = "프로그램 커맨드 라인 매개변수를 입력해주세요.";

		constructor(message?: string) {
			super(message ? message : NoProgramArgumentsError.MESSAGE);
		}
	}

	// 터미널의 현재 폴더를 lib 내부로 변경합니다.
	process.chdir(__dirname);

	export const mainPath = <string>process.cwd().replace(/\\/g, "/");

	export function handleRuntimeVariables(args: ProgramArguments) {
		let productName = args.videoName || "TMP-000";
		let outputPath = `${EntryPoint.mainPath}/.tmp-avgle~${productName}`.replace(
			/\\/g,
			"/"
		);

		return new (class {
			public productName: string = productName;
			public outputPath: string = outputPath;
			public output: string[] = [];
			public outputRaw?: string = undefined;
			public isValidCygwin: boolean = false;
		})();
	}
}

export = EntryPoint;
