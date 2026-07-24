import { scoreGenerator } from "../utils/scoreGenerator";
import { extractUrls } from "../utils/extractUrls";
import { validationResult,mockBody } from "../mocks/mockData";


describe("Test utility files", () => {

  it("extracts all urls",  () => {
    const result = extractUrls(mockBody.text);
    expect(result.length).toEqual(2);
  });

  it("generates a score with sender validation result", async () => {
    const result = scoreGenerator(validationResult);
    expect(typeof(result)).toBe("number");
  });

  it("returns null if local-format-check",()=>{
    let modifiedResult = validationResult;
    modifiedResult.provider = "local-format-check";
    const result = scoreGenerator(modifiedResult);
    expect(result).toBe(null);
  })
});
