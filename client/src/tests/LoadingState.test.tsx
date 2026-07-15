import {describe, expect, test } from "vitest";
import {render,screen} from "@testing-library/react"
import { LoadingState } from "../components/LoadingState";


const props = {
    fileName:"Email.msg"
}

describe("Loading State Tests",()=>{
    
    test("matches snapshot",()=>{
        render(<LoadingState fileName={props.fileName}/>)
        expect(screen).toMatchSnapshot();
    });

    test("renders elements & props",()=>{
        render(<LoadingState fileName={props.fileName}/>)

        let text = screen.getByText(props.fileName);
        
        expect(text).toBeInTheDocument();
    })

})