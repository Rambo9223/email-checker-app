import request from "supertest";
import app from "../index";
import { resolve } from "path";

const fixture = (name:string) => resolve(__dirname,"../mocks/",name);


describe("Index Tests & Routes",()=>{

    it("GET/api/email/health should return list of active api providers",async()=>{
        
        const response = await request(app).get("/api/email/health");

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

        expect(response.status).toEqual(200);
        expect(response.body.providers).toEqual(mockProviders);
    });

    it("POST /api/email/check without file throws error",async()=>{
        const response = await request(app).post("/api/email/check");
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({ success: false, error: "No file uploaded" })
    });

    it("POST /api/email/check accepts .msg",async()=>{
        
        const response = await request(app).post("/api/email/check").attach("file",fixture("test-clean.msg"))
        expect(response.status).toEqual(200);
        expect(response.body.success).toBe(true);
    })

    it("POST /api/email/check accepts .eml",async()=>{

        const response = await request(app).post("/api/email/check").attach("file",fixture("test-clean.eml"))
        expect(response.status).toEqual(200);
        expect(response.body.success).toBe(true);
    })

    it("POST /api/email/check rejects .txt",async()=>{

        const response = await request(app).post("/api/email/check").attach("file",fixture("test-reject.txt"));
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({ success: false, error: "Only .eml and .msg files are accepted" });

    })
})
