import * as path from "path";
import * as fs from "fs-extra";

export function moveToVideoFolder(from: string) {
	const filename = path.basename(from);
	const target = path.join(from, "..", "..", "videos", filename);

	fs.moveSync(from, target, {
		overwrite: true,
	});
}
