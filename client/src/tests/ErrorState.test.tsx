import {describe, expect, test,vi } from "vitest";
import {render,screen} from "@testing-library/react"
import { ErrorState } from "../components/ErrorState";

const props = {
    message:"Failed to parse",
    onRetry:vi.fn()
}

describe("Error State Tests",()=>{
    
    test("matches snapshot",()=>{
        render(<ErrorState onRetry={props.onRetry} message={props.message}/>)
        expect(screen).toMatchSnapshot();
    });

    test("renders elements & props",()=>{
        render(<ErrorState onRetry={props.onRetry} message={props.message}/>)

        let message = screen.getByText(props.message);
        let button = screen.getByText("Try again");
        
        expect(message).toBeInTheDocument();
        expect(button).toBeInTheDocument();
    })

    test("onRetry is called on click",()=>{
        render(<ErrorState onRetry={props.onRetry} message={props.message}/>)

        let button = screen.getByText("Try again");

        button.click();

        expect(props.onRetry).toHaveBeenCalledTimes(1);

    })
})