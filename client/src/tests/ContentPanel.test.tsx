import {describe, expect, test, } from "vitest";
import {render,screen} from "@testing-library/react"
import { ContentPanel } from "../components/ContentPanel";
import { mockServerRes } from "../mocks/mockData";


const content = mockServerRes.checks.content;

describe("ContentPanel Tests",()=>{

test("matches snapshot",()=>{
    // fix type error with content
    render(<ContentPanel content={content}/>)
    expect(screen).toMatchSnapshot();

    })



})

