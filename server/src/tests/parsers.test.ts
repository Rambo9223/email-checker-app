import { resolve } from "path";
import { readFileSync } from "fs";
import { parseEml } from "../parsers/emlParser";
import { parseMsg } from "../parsers/msgParser";

const fixture = (name: string): Buffer =>
  readFileSync(resolve(__dirname,"../mocks/",name));

describe("msg & eml Parsers", () => {

  it("parses a clean eml file", async () => {
    const buffer = fixture("test-clean.eml");
    const result = await parseEml(buffer);
    //console.log(result.authentication.dkim);
    expect(result.sourceFormat).toBe("eml");
    expect(result.from?.email).toBe("john.smith@example.com");
    expect(result.authentication.spf.result).toBe("pass");

  });

  it("parses a clean msg file", async () => {
    const buffer = fixture("test-message.msg");
    const result = await parseMsg(buffer);

    expect(result.sourceFormat).toBe("msg");
    expect(result.to[0].email).toBe("anemail@gmail.com");
    expect(result.authentication.spf.result).toBe("unknown");


  });
});
