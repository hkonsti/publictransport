
export class TimeConverter {

	private static minutesInWeek = 60 * 24 * 7;

	/**
	 * Converts a time stamp and a day of the week in minute of the week.
	 * Drops seconds.
	 * 
	 * Doesn't validate input.
	 * @param dayOfWeek Number between 0 and 6
	 * @param time Format: hh:mm:ss
	 * @returns Time as minute in the week.
	 */
	public static convert(dayOfWeek: number, time: string): number {
		const split = time.split(":");
		const h = parseInt(split[0]!);
		const m = parseInt(split[1]!);

		const minutesPerDay = 60 * 24;

		const days = dayOfWeek * minutesPerDay
		const hours = h * 60;
		return (days + hours + m) % TimeConverter.minutesInWeek;
	}

}