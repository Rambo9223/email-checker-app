import {describe, expect, test, } from "vitest";
import {render,screen} from "@testing-library/react"
import { CheckItem } from "../components/CheckItem";
import { mockServerRes } from "../mocks/mockData";


const props = mockServerRes.checks.auth[0];

function MockCheckItem(){
    return <CheckItem label={props.name} status={props.status} detail={props.detail} />
}

describe("CheckItem Tests",()=>{
    test("matches snapshot",()=>{
        render(<MockCheckItem/>)
        expect(screen).toMatchSnapshot();
    })
    
    test('props pass element text', async () => {
        render(<MockCheckItem/>)
        let name = await screen.findByText("SPF");
        let status = await screen.findByText("✓");
        let detail = await screen.findByText("SPF passed for domain riverside.co.uk");
        expect(name).toBeInTheDocument();
        expect(status).toBeInTheDocument();
        expect(detail).toBeInTheDocument();
    })

    test('status_glyph changes based on status', async () => {
        const {rerender} = render(<CheckItem label="SPF" status="fail" detail="SPF failed" />)
        
        // fail 
        let glyph = await screen.findByText("✕")

        expect(glyph).toBeInTheDocument();

        // rerender with new status
        rerender(<CheckItem label="SPF" status="warn" detail=""/>)

        // expect glyph to change
        expect(glyph.innerText).not.toEqual("✕");

        glyph = await screen.findByText("!");
        // new glyph
        expect(glyph).toBeInTheDocument();

        // rerender with new status
        rerender(<CheckItem label="SPF" status="unknown" detail=""/>)

        // expect glyph to change
        expect(glyph.innerText).not.toEqual("!");

        glyph = await screen.findByText("?");
        expect(glyph).toBeInTheDocument();
    })
})