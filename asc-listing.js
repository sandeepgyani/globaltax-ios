// Sets the App Store version localization texts for Hostel Rasoi.
// Usage: node asc-listing.js <ISSUER_ID>
const crypto = require('crypto'); const fs = require('fs'); const https = require('https');
const KEY_ID='AXSWLCWZ9K', P8='C:/Users/sande/Downloads/AuthKey_AXSWLCWZ9K.p8', ISSUER=process.argv[2];
const APP='6797386696';
if(!ISSUER){console.error('Pass Issuer ID');process.exit(1);}
function jwt(){const h=Buffer.from(JSON.stringify({alg:'ES256',kid:KEY_ID,typ:'JWT'})).toString('base64url');
const n=Math.floor(Date.now()/1000);const p=Buffer.from(JSON.stringify({iss:ISSUER,iat:n,exp:n+900,aud:'appstoreconnect-v1'})).toString('base64url');
const s=crypto.sign('sha256',Buffer.from(h+'.'+p),{key:fs.readFileSync(P8,'utf8'),dsaEncoding:'ieee-p1363'}).toString('base64url');return h+'.'+p+'.'+s;}
function api(m,path,body){return new Promise((res,rej)=>{const r=https.request({hostname:'api.appstoreconnect.apple.com',path,method:m,headers:{Authorization:'Bearer '+jwt(),'Content-Type':'application/json'}},x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>res({status:x.statusCode,body:d?JSON.parse(d):{}}));});r.on('error',rej);if(body)r.write(JSON.stringify(body));r.end();});}
const ok=(l,r)=>console.log(l+':', r.status<300?'OK':'ERR '+JSON.stringify(r.body.errors||r.body).slice(0,300));

const DESCRIPTION = `Global Tax is a complete Vedic astrology toolkit that works entirely on your iPhone or iPad. No internet, no sign-in, no data collection - every calculation happens on your own device.

BIRTH CHART (KUNDLI)
Enter name, date, time and place of birth and the app draws your Lagna chart (D1), Navamsa (D9) and Dashamsha (D10) in the traditional North-Indian style. All nine grahas are shown with sign, degree, house, nakshatra, pada, retrograde state and dignity, computed astronomically using the Lahiri (Chitrapaksha) ayanamsa.

DASHA AND DOSHA
Your full Vimshottari Mahadasha timeline with Antardashas, plus clear analysis of Manglik, Kaal Sarp and Sade Sati, and classical yogas such as Gajakesari, Budha-Aditya, Neech Bhang and Raj Yoga.

UPAY - CORRECTIONS, NOT JUST DIAGNOSIS
Every weakness found in your chart is listed with its traditional correction: the mantra with its count, the daan with its weekday, the puja or vrat, the gemstone with an honest caution, and one practical step you can actually take. Each finding is marked as needing attention, moderate or mild, so nothing is alarming.

PREDICTIONS
Daily, weekly, monthly and yearly outlooks drawn from your own chart, with star ratings for career, money, health, relationships, business, travel and education, based on current transits and your running dasha. Lucky colour, lucky number and a remedy for each period.

KUNDLI MATCHING
Full Ashtakoota guna milan out of 36 with all eight kootas explained, and Nadi and Bhakoot dosha alerts.

PANCHANG AND MUHURAT
Today's tithi, vara, nakshatra, yoga and karana, plus an auspicious-date finder for property purchase, vehicle purchase, a new business, griha pravesh, engagement and starting education.

GUIDANCE
Career suitability from your 10th house and strongest planet, business timing, child education and health indications, gemstone recommendations, and a prompt builder that copies your full chart data for use with any AI assistant.

HINDI
The whole app switches to Hindi with one tap, including every mantra and remedy.

PRIVATE BY DESIGN
Your birth details never leave your device. Nothing is uploaded, stored on a server or shared with anyone.

DISCLAIMER
Astrological content is provided for informational and cultural purposes and is not professional, medical, legal or financial advice. For important life decisions, please also consult a qualified astrologer.`;

(async()=>{
 let r=await api('GET','/v1/apps/'+APP+'/appStoreVersions?limit=1');
 const ver=r.body.data[0].id;
 r=await api('GET','/v1/appStoreVersions/'+ver+'/appStoreVersionLocalizations?limit=10');
 for(const loc of (r.body.data||[])){
   const pr=await api('PATCH','/v1/appStoreVersionLocalizations/'+loc.id,{data:{type:'appStoreVersionLocalizations',id:loc.id,attributes:{
     description: DESCRIPTION,
     keywords: 'kundli,vedic,astrology,horoscope,dasha,panchang,rashi,nakshatra,muhurat,upay,jyotish,hindi',
     supportUrl: 'https://pcssolutions.co.in',
     promotionalText: 'Now with a complete Upay section: for every dosha found in your chart you get the mantra, the daan, the puja, the gemstone and one practical step. Hindi included.'
   }}});
   ok('listing ('+loc.attributes.locale+')', pr);
 }
})().catch(e=>{console.error(e);process.exit(1);});
