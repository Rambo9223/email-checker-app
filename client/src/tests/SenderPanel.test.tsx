import {describe, expect, test } from "vitest";
import {render,screen} from "@testing-library/react"
import { SenderPanel } from "../components/SenderPanel";

const mockSenderValidation = {
            "Address": "laine@riverside.co.uk",
            "catch_all": false,
            "Status": "Valid",
            "Disposable_Domain": false,
            "Role_Based": false,
            "Free_Domain": false,
            "GreyListed":false,
            "Diagnosis": "Mailbox exists and active. Safe to send (D2)",
            "score": 100,
            "provider": "My Email Verifier",
            "raw": {
                "Address": "laine@riverside.co.uk",
                "catch_all": false,
                "Disposable_Domain": false,
                "Role_Based": false,
                "Free_Domain": false,
                "Greylisted": false,
                "Status": "Valid",
                "Diagnosis": "Mailbox exists and active. Safe to send (D2)"
            }
        }

describe("Sender Panel Tests",()=>{

    test("matches snapshot",()=>{
        render(<SenderPanel sender={mockSenderValidation}/>);
        expect(screen).toMatchSnapshot();
    });

    test("no validation result",()=>{
        render(<SenderPanel sender={null}/>)
        let noSender = screen.getByText("No sender address found to validate.");
        expect(noSender).toBeInTheDocument();
    });

    test("validation result passes and props render",()=>{
        render(<SenderPanel sender={mockSenderValidation}/>);

        let title = screen.getByText(`Sender — ${mockSenderValidation.Address}`);
        let score = screen.getByText("100/100");
        let panelGrid = document.querySelector('div[class="sender-panel__grid"]') as HTMLDivElement
        let checkedvia = screen.getByText(`Checked via ${mockSenderValidation.provider}`)
        expect(title).toBeInTheDocument();
        expect(score).toBeInTheDocument();
        expect(checkedvia).toBeInTheDocument();
        expect(panelGrid.children.length).toEqual(8);

    })


})