import {describe, expect, test, } from "vitest";
import {render,screen} from "@testing-library/react"
import { ContentPanel } from "../components/ContentPanel";
import { mockServerRes } from "../mocks/mockData";


const content = mockServerRes.checks.content;

describe("ContentPanel Tests",()=>{

test("matches snapshot",()=>{
    render(<ContentPanel content={content}/>)
    expect(screen).toMatchSnapshot();

    })


test("no props passed, no content",()=>{
    render(<ContentPanel content={null} />)
    let noContent =  screen.getByText("Content scan unavailable or no body text found.");
    expect(noContent).toBeInTheDocument();
})

test("props passed, array of 9 items mapped",()=>{
    render(<ContentPanel content={content}/>);
    const listitem = content.rules[8]
    let list = screen.getAllByRole("listitem");
    expect(list.length).toEqual(9);
    expect(screen.getByText(listitem.description)).toBeInTheDocument();
})

})

