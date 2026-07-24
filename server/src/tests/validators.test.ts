import { validateContent } from "../validators/contentValidator";
import { validateAuthHeaders, summariseChecks } from "../validators/headerValidator";
import { ContentValidationResult, ValidationCheck } from "../types/email";
import { mockBody,parsedBadEmail,parsedEmail } from "../mocks/mockData";
//import { resolve } from "path";


//const fixture = (name:string) => resolve(__dirname,"../mocks/",name);


describe("Validators",()=>{

    describe("Content Validator",()=>{

        it("content validator returns null if no body",async()=>{
        const result = await validateContent(null,null);
        expect(result).toEqual(null);
    });

    it("returns spam score on valid body",async()=>{
        const result = await validateContent(mockBody.text,null);
        //console.log(result);
        expect(result?.provider).toEqual("PostmarkSpamCheck");
        expect<ContentValidationResult | null >(result).toBeInstanceOf<ContentValidationResult>
    });

    })

    describe("Header Validator",()=>{
        it("validates auth headers",()=>{

        const result = validateAuthHeaders(parsedEmail);
        //console.log(result);
        expect(result.length).toEqual(3);
        expect(result[0].name).toEqual("SPF");
        expect(result[1].name).toEqual("DKIM (example.com)");
        expect(result[2].name).toEqual("DMARC");

    });

    it("validates if dkim is missing, pushes replyTo object to result array if mismatch",()=>{
        const modifiedParsedEmail = {
            ...parsedEmail,
            dkim:[...parsedEmail.authentication.dkim=[]],
            replyTo:[...(parsedEmail.replyTo??[]),{name:"johnnyB",email:"johnnyB@bmail.com"}]
        }
        //console.log(modifiedParsedEmail);
        const result = validateAuthHeaders(modifiedParsedEmail);
        //console.log(result);
        expect(result.length).toEqual(4);
        expect(result[1].detail).toEqual("No DKIM signature found");
        expect(result[3].name).toEqual("Reply-To Domain");
    });

    it("summarises checks and returns pass with valid headers",()=>{
        let validatedHeaders = validateAuthHeaders(parsedEmail)
        let result = summariseChecks(validatedHeaders);
        expect(result).toEqual({ overallStatus: 'pass', passCount: 2, warnCount: 0, failCount: 0 })
    });

     it("summarises checks and returns warn with partial headers",()=>{
        const modifiedParsedEmail = {
            ...parsedEmail,
            dkim:[...parsedEmail.authentication.dkim=[]],
            replyTo:[...(parsedEmail.replyTo??[]),{name:"johnnyB",email:"johnnyB@bmail.com"}]
        }
        let validatedHeaders = validateAuthHeaders(modifiedParsedEmail)
        let result = summariseChecks(validatedHeaders);
        expect(result).toEqual({ overallStatus: 'warn', passCount: 2, warnCount: 1, failCount: 0 })
    });

     it("summarises checks and returns fail with bad headers",()=>{
        
        let validatedHeaders = validateAuthHeaders(parsedBadEmail)
        let result = summariseChecks(validatedHeaders);
        expect(result).toEqual({ overallStatus: 'fail', passCount: 0, warnCount: 1, failCount: 2 })
    });

    });

    describe("Sender Validator",()=>{
        // add tests for with api key and without
        
    })

    
})