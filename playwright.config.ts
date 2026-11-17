import { defineConfig } from "@playwright/test";
export default defineConfig({
 testDir:"./tests",testMatch:/browser\.spec\.ts$/,timeout:120000,
 use:{baseURL:"http://127.0.0.1:4173",browserName:"chromium",viewport:{width:1320,height:900}},
 webServer:{command:"npm run preview -- --host 127.0.0.1",url:"http://127.0.0.1:4173",reuseExistingServer:!process.env.CI},
 reporter:"list"
});
