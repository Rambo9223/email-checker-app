import {describe, expect, test,vi } from "vitest";
import {render,screen,fireEvent} from "@testing-library/react";
import { EmailDropzone } from "../components/EmailDropzone";
import testEml from "../mocks/test-clean.eml?raw";
import testMsg from "../mocks/test-clean.msg?raw"

describe("Email Dropzone Tests",()=>{


    test("matches snapshot",()=>{
        const onFileSelected = vi.fn()
        render(<EmailDropzone onFileSelected={onFileSelected} disabled={true}/>);
        expect(screen).toMatchSnapshot();
    });

    test("accepts an eml file via input", () => {
    const onFileSelected = vi.fn();
    render(<EmailDropzone onFileSelected={onFileSelected} />);

    // Convert the raw string to a File object
    const file = new File([testEml], "test-clean.eml", {
      type: "message/rfc822",
    });

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    Object.defineProperty(input, "files", {
      value: [file],
      configurable: true,
    });

    fireEvent.change(input);

    let rejectionMessage = screen.queryByText("test-clean.eml isn't a .eml or .msg file")

    expect(rejectionMessage).toEqual(null);
    expect(onFileSelected).toHaveBeenCalledWith(file);
  });

    test("accepts an msg file",()=>{
    const onFileSelected = vi.fn();
    render(<EmailDropzone onFileSelected={onFileSelected} />);
    const file = new File([testMsg], "test-clean.msg", {
    type: "application/vnd.ms-outlook",});

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    Object.defineProperty(input, "files", {
      value: [file],
      configurable: true,
    });

    fireEvent.change(input);

    let rejectionMessage = screen.queryByText("test-clean.eml isn't a .eml or .msg file")

    expect(rejectionMessage).toEqual(null);
    expect(onFileSelected).toHaveBeenCalledWith(file);

    })

    test("rejects a txt file",()=>{
    const onFileSelected = vi.fn();
    render(<EmailDropzone onFileSelected={onFileSelected} />);

    const file = new File(["some content"], "test-reject.txt", {
    type: "text/plain",
    });

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    Object.defineProperty(input, "files", { value: [file], configurable: true });
    fireEvent.change(input);

    let rejectionMessage = screen.getByText(`"test-reject.txt" isn't a .eml or .msg file`)

    expect(rejectionMessage).toBeInTheDocument();
    expect(onFileSelected).not.toHaveBeenCalled();
    })
})