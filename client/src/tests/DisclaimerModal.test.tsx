import {describe, expect, test,vi } from "vitest";
import {render,screen,fireEvent} from "@testing-library/react";
import { DisclaimerModal } from "../components/DisclaimerModal";


describe("Disclaimer Modal Tests",()=>{

const mockOnClose = vi.fn()

test("matches snapshot",()=>{
    render(<DisclaimerModal isOpen={true} onClose={mockOnClose}/>);
    expect(screen).toMatchSnapshot();
})

test("elements render as expected",()=>{
    render(<DisclaimerModal isOpen={true} onClose={mockOnClose}/>);

    let headings = screen.getAllByRole("heading");
    let paragraphs = screen.getAllByRole("paragraph");
    let buttons = screen.getAllByRole("button");
    let someText = screen.getByText("While the app is capable of",{exact:false});

    expect(headings.length).toEqual(4)
    expect(paragraphs.length).toEqual(5);
    expect(buttons.length).toEqual(2);
    expect(someText).toBeInTheDocument();
});

test("buttons and escape key trigger close",async()=>{

    const {container} = render(<DisclaimerModal isOpen={true} onClose={mockOnClose}/>);
    let buttons = screen.getAllByRole("button");
    buttons[0].click();
    buttons[1].click();
    fireEvent.keyDown(container,{key: 'Escape', code: 'Escape', charCode: 27});

    expect(mockOnClose).toHaveBeenCalledTimes(3);
})

})
