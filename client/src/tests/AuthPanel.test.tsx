import {describe, expect, test, } from "vitest";
import {render,screen} from "@testing-library/react"
import { AuthPanel } from "../components/AuthPanel";
import { mockServerRes } from "../mocks/mockData";


const checks = mockServerRes.checks.auth;

describe("AuthPanel Tests",()=>{

test("matches snapshot",()=>{

    render(<AuthPanel checks={checks}/>)
    expect(screen).toMatchSnapshot();

    })

test('elements in the document & three items mapped from check item', async () => {
    render(<AuthPanel checks={checks}/>)
    const title = await screen.findByText("Authentication");
    const items = title.nextSibling?.childNodes
    expect(title).toBeInTheDocument();
    expect(items?.length).toEqual(3);    
})

})

