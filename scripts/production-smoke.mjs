const base=(process.env.PRODUCTION_URL||"https://sponsorloop-gold.vercel.app").replace(/\/$/,"");
const timeout=Number(process.env.SMOKE_TIMEOUT_MS||10000);
async function get(path,{json=false}={}){const c=new AbortController();const timer=setTimeout(()=>c.abort(),timeout);try{const r=await fetch(base+path,{signal:c.signal,headers:{"User-Agent":"SponsorLoop-Production-Smoke/1.0"}});const body=json?await r.json().catch(()=>null):await r.text();if(!r.ok)throw new Error(`${path} HTTP ${r.status}`);return body;}finally{clearTimeout(timer)}}
for(const path of ["/ar","/en"]){const html=await get(path);if(!html.includes("SponsorLoop"))throw new Error(`${path} missing SponsorLoop shell`);}
const health=await get("/api/health",{json:true});
if(!health||health.status==="degraded")throw new Error(`SponsorLoop health degraded: ${JSON.stringify(health)}`);
if(health.database!=="connected")throw new Error(`SponsorLoop database is not connected: ${JSON.stringify(health)}`);
const opportunities=await get("/api/opportunities",{json:true});
if(!opportunities||!Array.isArray(opportunities.data))throw new Error("Marketplace opportunities endpoint did not return a data array");
console.log("SponsorLoop production core: PASS");
for(const [name,value] of Object.entries({ai:health.ai,storage:health.storage,payments:health.payments,esign:health.esign})) console.log(`${name}: ${value}`);
if(health.storage!=="configured")console.warn("WARN: document upload requires Cloudflare R2 production credentials.");
if(health.ai!=="openai-configured")console.warn("WARN: matching uses deterministic fallback instead of OpenAI.");
if(health.payments!=="configured")console.warn("WARN: payment settlement is not connected.");
if(health.esign!=="configured")console.warn("WARN: e-sign is not connected.");
