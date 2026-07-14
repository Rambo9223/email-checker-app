import {describe, expect, test, } from "vitest";
import {render,screen} from "@testing-library/react"
import { EmailEnvelope } from "../components/EmailEnvelope";
import { mockServerRes } from "../mocks/mockData";
import { formatDate } from "../utils/format";

const parsedEmail = mockServerRes.parsedEmail

describe("Email Envelope Tests",()=>{

    test("matches snapshot",()=>{
        render(<EmailEnvelope email={parsedEmail}/>)
        expect(screen).toMatchSnapshot();
    });

    test("passes props and renders content",()=>{
        render(<EmailEnvelope email={parsedEmail}/>)
        let from = screen.getByText(parsedEmail.from.email);
        let subject = screen.getByText(parsedEmail.subject);
        let to = screen.getByText(parsedEmail.to[0].name,{exact:false});
        let date = screen.getByText(formatDate(parsedEmail.date));
        let id = screen.getByText(parsedEmail.messageId);
        let sourceFormat = screen.getByText(parsedEmail.sourceFormat.toUpperCase())
        let attachments = screen.getByRole("list");

        expect(from).toBeInTheDocument()
        expect(subject).toBeInTheDocument()
        expect(to).toBeInTheDocument()
        expect(date).toBeInTheDocument()
        expect(id).toBeInTheDocument()
        expect(sourceFormat).toBeInTheDocument()
        expect(attachments).toBeInTheDocument();

    })
})