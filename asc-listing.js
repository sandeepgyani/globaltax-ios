// Sets the App Store version localization texts for Hostel Rasoi.
// Usage: node asc-listing.js <ISSUER_ID>
const crypto = require('crypto'); const fs = require('fs'); const https = require('https');
const KEY_ID='AXSWLCWZ9K', P8='C:/Users/sande/Downloads/AuthKey_AXSWLCWZ9K.p8', ISSUER=process.argv[2];
const APP='6797626391';
if(!ISSUER){console.error('Pass Issuer ID');process.exit(1);}
function jwt(){const h=Buffer.from(JSON.stringify({alg:'ES256',kid:KEY_ID,typ:'JWT'})).toString('base64url');
const n=Math.floor(Date.now()/1000);const p=Buffer.from(JSON.stringify({iss:ISSUER,iat:n,exp:n+900,aud:'appstoreconnect-v1'})).toString('base64url');
const s=crypto.sign('sha256',Buffer.from(h+'.'+p),{key:fs.readFileSync(P8,'utf8'),dsaEncoding:'ieee-p1363'}).toString('base64url');return h+'.'+p+'.'+s;}
function api(m,path,body){return new Promise((res,rej)=>{const r=https.request({hostname:'api.appstoreconnect.apple.com',path,method:m,headers:{Authorization:'Bearer '+jwt(),'Content-Type':'application/json'}},x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>res({status:x.statusCode,body:d?JSON.parse(d):{}}));});r.on('error',rej);if(body)r.write(JSON.stringify(body));r.end();});}
const ok=(l,r)=>console.log(l+':', r.status<300?'OK':'ERR '+JSON.stringify(r.body.errors||r.body).slice(0,300));

const DESCRIPTION = `Planning a move abroad? Comparing job offers? Wondering how much you need in the bank to retire? Global Tax & Cost of Living combines four planners in one fully offline app.

TAX CALCULATOR
Estimate personal income tax in 15 countries: India, USA, UK, Canada, Australia, Germany, France, Japan, Singapore, Hong Kong, Hungary, Romania, Bulgaria, UAE and Bahamas. Enter salary, investments, rental income, capital gains and family details; see income tax, social security, take-home pay, effective and marginal rates. India automatically compares the Old and New regimes and picks the cheaper one.

COMPARE COUNTRIES
One tap shows your take-home pay in all 15 countries, sorted best first, with effective tax rates.

COST OF LIVING (CostCompass)
Rank 181 countries and 2,100+ cities by cost of living, rent, safety, healthcare and happiness. Build a personal monthly budget, run what-if scenarios and export a PDF report.

RETIREMENT PLANNER
Set your age, expenses and inflation (7% default) to see the corpus you need on retirement day, the lump sum needed in the bank today, or the monthly investment that gets you there.

MIGRATION PLANNER
Pick a destination: see the main visa routes, the budget needed to keep your current standard of living there, and the gross salary that covers it after local taxes.

WHAT YOUR TAXES FUND
Star-rated government benefits for every country: roads, citizen safety, healthcare, law and order, education, employment support, pensions and housing.

WHERE TO INVEST
Long-term and short-term tax-saving ideas per country: PPF, ELSS and NPS in India; 401(k), ISA, superannuation, CPF and more elsewhere.

SIX LANGUAGES
English, Hindi, French, Spanish, German and Chinese.

PRIVATE BY DESIGN
Works completely offline. No account, no ads, no analytics. Nothing you type ever leaves your device.

DISCLAIMER
All results are simplified educational estimates - not tax, legal, investment or financial advice. PCS Solutions is not affiliated with any government or tax authority. Verify current rules with official sources such as incometax.gov.in, irs.gov, gov.uk, canada.ca and ato.gov.au, or consult a qualified adviser before making decisions.`;

(async()=>{
 let r=await api('GET','/v1/apps/'+APP+'/appStoreVersions?limit=1');
 const ver=r.body.data[0].id;
 r=await api('GET','/v1/appStoreVersions/'+ver+'/appStoreVersionLocalizations?limit=10');
 for(const loc of (r.body.data||[])){
   const pr=await api('PATCH','/v1/appStoreVersionLocalizations/'+loc.id,{data:{type:'appStoreVersionLocalizations',id:loc.id,attributes:{
     description: DESCRIPTION,
     keywords: 'tax,calculator,cost of living,retirement,migration,expat,salary,take home,NRI,visa,planner',
     supportUrl: 'https://pcssolutions.co.in',
     promotionalText: 'One app for the big money questions: what will I pay in tax, what does life cost there, how much do I need to retire, and what does it take to move abroad?'
   }}});
   ok('listing ('+loc.attributes.locale+')', pr);
 }
})().catch(e=>{console.error(e);process.exit(1);});
