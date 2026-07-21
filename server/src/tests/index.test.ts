import request from "supertest";
import app from "../index";

describe("Index Tests",()=>{

    it("GET/api/email/health should return list of active api providers",async()=>{
        const response = await request(app).get("/api/email/health");
        console.log(process.env);
        expect(response.status).toEqual(200);
        let mockProviders = {
            senderValidation : "local-format-only",
            urlScanning: 'disabled',
            contentSpam: 'PostmarkSpamCheck (free)'
        };
        if(process.env.MY_EMAIL_VERIFIER_KEY){
            mockProviders.senderValidation = "My Email Verifier"
        }
        if(process.env.GOOGLE_SAFE_BROWSING_KEY){
            mockProviders.urlScanning = "GoogleSafeBrowsing";
        }
        expect(response.body.providers).toEqual(mockProviders);
    })
})
