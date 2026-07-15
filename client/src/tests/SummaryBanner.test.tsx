import {describe, expect, test } from "vitest";
import {render,screen} from "@testing-library/react"
import { SummaryBanner } from "../components/SummaryBanner";

const props = {
        "overallStatus": "pass",
        "passCount": 3,
        "warnCount": 1,
        "failCount": 0,
        "generatedAt": "2026-07-10T09:59:44.312Z"
    }

describe("Summary Banner Tests",()=>{

    test("matches snapshot",()=>{
        render(<SummaryBanner summary={props}/>);
        expect(screen).toMatchSnapshot();
    });

    test("props pass and elements render",()=>{
        render(<SummaryBanner summary={props}/>);
        let status = screen.getByText("Pass");
        let passCount = screen.getByText("3 pass");
        let warnCount = screen.getByText("1 warn")
        let failCount = screen.getByText("0 fail");

        expect(status).toBeInTheDocument();
        expect(passCount).toBeInTheDocument();
        expect(warnCount).toBeInTheDocument();
        expect(failCount).toBeInTheDocument();

    });

})