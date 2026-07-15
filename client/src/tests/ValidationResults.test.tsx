import {describe, expect, test,vi } from "vitest";
import {render,screen} from "@testing-library/react"
import { ValidationResults } from "../components/ValidationResults";
import { resBasic } from "../mocks/mockData";

const props = {
    report:resBasic,
    onReset:vi.fn()
}

describe("Validation Results tests",()=>{

    test("matches snapshot",()=>{
        render(<ValidationResults report={props.report} onReset={props.onReset}/>)
        expect(screen).toMatchSnapshot();
    })

    test("all results render",()=>{
        render(<ValidationResults report={props.report} onReset={props.onReset}/>)
        let parent = document.querySelector('div[class="results"]');
        let button = screen.getByText("Check another email");
        let grid = parent?.children[1];

        expect(parent?.children.length).toEqual(2);
        expect(button).toBeInTheDocument();
        expect(grid?.children.length).toEqual(5);
    });

    test("expect onReset to be called on click",()=>{
        render(<ValidationResults report={props.report} onReset={props.onReset}/>)

        let button = screen.getByText("Check another email");

        button.click();
        expect(props.onReset).toHaveBeenCalledTimes(1);
    })

});