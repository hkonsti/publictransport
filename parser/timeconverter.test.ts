import {TimeConverter} from "./timeconverter";

test("Test time conversion", () => {
    const day = 1;
    const time = "10:35:11";

    const res = TimeConverter.convert(day, time);
    expect(res).toBe(day*60*24+10*60+35);
});