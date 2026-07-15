import {describe, expect, test,vi } from "vitest";
import {render,screen,fireEvent} from "@testing-library/react"
import App from "../App";
import * as useEmailChecker from "../hooks/useEmailChecker";
import testEml from "../mocks/test-clean.eml?raw";


describe("App Tests",()=>{
    
    
    test("matches snapshot",()=>{
        render(<App/>);
        expect(screen).toMatchSnapshot();
    });


    test("email checker called when a file is dropped",()=>{
        const spy = vi.spyOn(useEmailChecker,"useEmailChecker")
        render(<App/>);
         // Convert the raw string to a File object
        const file = new File([testEml], "test-clean.eml", {
          type: "message/rfc822",
        });

        const input = document.querySelector(
      'input[type="file"]') as HTMLInputElement;

        Object.defineProperty(input, "files", {
          value: [file],
          configurable: true,
        });
        // called on idle state
        expect(spy).toHaveBeenCalledTimes(1);

        fireEvent.change(input);
        // called again on loading
        expect(spy).toHaveBeenCalledTimes(2);

        // would expect a 3rd on sucess or error 
    })
})