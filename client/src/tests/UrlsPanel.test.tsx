import {describe, expect, test } from "vitest";
import {render,screen} from "@testing-library/react"
import { UrlsPanel } from "../components/UrlsPanel";
import { mockServerRes } from "../mocks/mockData";

const urls = mockServerRes.checks.urls

describe("Urls Panel Tests",()=>{
    
    test("matches snapshot",()=>{
        render(<UrlsPanel urls={urls}/>);
        expect(screen).toMatchSnapshot();
    });

    test("no url's passed",()=>{
    render(<UrlsPanel urls={[]}/>);

    let error = screen.getByText("No links found in the email body.");
    expect(error).toBeInTheDocument();

    });

    test("url's passed and results mapped",()=>{
        render(<UrlsPanel urls={urls}/>);
        let list = screen.getByRole("list");
        let link = screen.getByText(urls[0].url);
        let safe = screen.getByText("Safe");
        let unsafe = screen.getByText("Unsafe");

        expect(list.children.length).toEqual(2);
        expect(link).toBeInTheDocument();
        expect(safe).toBeInTheDocument();
        expect(unsafe).toBeInTheDocument();

    })
})