import * as fs from "fs";
import * as readline from "readline";

export class Reader {

	private static splitLineIntoValues(line: string): string[] {
		enum State {
			READING_NUMBER,
			READING_STRING,
			COMMA,
			WAITING_FOR_COMMA,
		};

		line += ","

		const res: string[] = [];
		let state: State = State.COMMA;
		let current = "";

		for (const c of line) {
			if (state === State.COMMA) {
				if (c === '"') {
					state = State.READING_STRING;
				} else if (c === ",") {
					res.push("");
				} else {
					state = State.READING_NUMBER;
					current += c;
				}
			} else if (state === State.READING_STRING) {
				if (c === '"') {
					state = State.WAITING_FOR_COMMA;
					res.push(current)
					current = "";
				} else {
					current += c;
				}
			} else if (state === State.READING_NUMBER) {
				if (c === ",") {
					state = State.COMMA;
					res.push(current);
					current = ""
				} else {
					current += c;
				}
			} else if (state === State.WAITING_FOR_COMMA) {
				state = State.COMMA;
			}
		}

		return res;
	}

	public static async readLines(path: string, callback: (line: string[]) => void, skipFirst = true): Promise<void> {
		await fs.promises.access(path);
		return new Promise((res, rej) => {


			const rl = readline.createInterface({
				input: fs.createReadStream(path),
			});

			let skipped = false;

			rl.on("line", line => {
				if (!skipped && skipFirst) {
					skipped = true;
					return
				}
				try {
					callback(Reader.splitLineIntoValues(line));
				} catch (e: any) {
					rej((e as Error).message);
					rl.close();
				}
			});

			rl.on("close", () => {
				res();
			})
		});
	}


}