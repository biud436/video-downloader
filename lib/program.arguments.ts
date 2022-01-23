namespace EntryPoint {
	/**
	 * @class ProgramArguments
	 * @description
	 * 이 클래스는 프로그램 인자를 타입스크립트에서 타입 별로 읽을 수 있게 파싱하고 처리하는 기능을 합니다.
	 */
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

	/**
	 * @interface IRuntimeVariables
	 * @description
	 * 프로세스 런타임 중에 사용되는 변수 목록입니다.
	 */
	export interface IRuntimeVariables {
		productName: string;
		outputPath: string;
		output: string[];
		outputRaw: string;
		isValidCygwin: boolean;

		// 정의되지 않은 키도 사용 가능
		[arg: string]: any;
	}

	/**
	 * @class NoProgramArgumentsError
	 * @description
	 * 중요한 프로그램 인자가 비어있을 때 발생하는 오류입니다.
	 * 예를 들면, 저장하고자 하는 영상 파일 명을 적지 않았을 때 생깁니다.
	 * 영상 파일명을 임시로 만들어서 오류를 처리하지 않을 수도 있으나,
	 * 설계상 그런 처리는 하지 않고 있으며 오류를 내 영상 제목을 반드시 입력하도록 유도하고 있습니다.
	 */
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
