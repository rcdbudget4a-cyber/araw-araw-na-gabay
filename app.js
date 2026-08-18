const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
let content=null,selectedDate=new Date(),selectedZodiac=localStorage.getItem("aag-zodiac")||"Aries",deferred=null,currentPage="home";
const PH_TZ="Asia/Manila";
const work=["Unahin ang pinakamahalagang gawain at iwasang sabay-sabayin ang lahat.","Maging mahinahon sa pakikipag-usap sa katrabaho.","Suriin ang detalye bago magsumite ng mahalagang trabaho.","Kung may hindi pagkakaunawaan, alamin muna ang buong kuwento.","Ang pagiging maaasahan ay mahalaga kahit walang pumapansin.","Maglaan ng oras para ayusin ang isang gawaing matagal nang ipinagpapaliban.","Huwag hayaang ang inis mula sa trabaho ang magdikta sa pakikitungo mo sa iba.","Makinig muna bago magbigay ng sagot o mungkahi.","Piliin ang tamang prayoridad kaysa subukang tapusin ang lahat.","Kung kailangan ng tulong, humingi nito nang maaga."];
const money=["Bantayan ang maliliit na gastusin na paulit-ulit.","Bago bumili, tanungin kung kailangan o gusto lamang.","Magtabi ng maliit na halaga para sa biglaang pangangailangan.","Iwasang gumawa ng malaking desisyong pinansyal dahil sa pressure.","Kung may utang, gumawa ng malinaw na plano sa pagbabayad.","Suriin ang mga subscription o bayaring hindi na kailangan.","Kung may dagdag na kita, maglaan muna ng bahagi para sa ipon.","Iwasang makipagsabayan sa gastos ng ibang tao.","Magplano ng gastusin bago dumating ang payday.","Ang disiplina sa pera ay mas mahalaga kaysa impresyon sa iba."];
const love=["Magsalita nang mahinahon kahit may hindi pagkakaunawaan.","Makinig nang buo bago sumagot.","Ang simpleng oras na magkakasama ay mahalaga.","Kung may sama ng loob, pag-usapan ito kapag kalmado.","Huwag magdesisyon tungkol sa relasyon dahil lamang sa isang masamang araw.","Ang tiwala ay nabubuo sa maliliit na tapat na gawain.","Magpasalamat sa isang mabuting katangian ng taong mahalaga sa iyo.","Humingi ng tawad kung may nasabi o nagawa kang mali.","Huwag gawing sukatan ng pagmamahal ang mamahaling bagay.","Maglaan ng panahon sa taong mahalaga sa iyo."];
const family=["Kumustahin ang isang kapamilya na tahimik nitong mga araw.","Makinig sa bata o matanda sa pamilya nang walang pagmamadali.","Kung may tensyon sa bahay, piliin ang mahinahong salita.","Magpasalamat sa isang taong tumutulong sa inyong tahanan.","Ang maliliit na gawaing bahay ay paraan din ng pag-aalaga.","Huwag agad sisihin ang isa't isa kapag may problema.","Maglaan ng oras sa pamilya kahit maikli.","Kung may kapamilyang malayo, magpadala ng simpleng mensahe.","Maging mabuting halimbawa sa mga bata sa paraan ng pagsasalita.","Piliin ang respeto kahit pagod ang lahat."];
function dayOfYear(d){const y=d.getFullYear();const start=new Date(y,0,1);return Math.floor((d-start)/86400000)+1}
function planDay(d){let n=dayOfYear(d);if(n>365)n=365;return n}
function iso(d){return d.toISOString().slice(0,10)}
function displayDate(d){return new Intl.DateTimeFormat("en-PH",{timeZone:PH_TZ,weekday:"long",month:"long",day:"numeric",year:"numeric"}).format(d)}
function greeting(){const h=new Date().getHours();return h<12?"Magandang umaga.":h<18?"Magandang araw.":"Magandang gabi."}
function saved(){return JSON.parse(localStorage.getItem("aag-saved")||"[]")}
function readDays(){return JSON.parse(localStorage.getItem("aag-read")||"[]")}
function dayIndex(){return planDay(selectedDate)-1}
function zodiac(){return content.zodiacs.find(z=>z.name===selectedZodiac)||content.zodiacs[0]}
async function getVerse(ref){
 const key="aag-kjv-"+ref.replaceAll(" ","_");
 const c=localStorage.getItem(key);if(c)return JSON.parse(c);
 try{
  const r=await fetch("https://dailybible.ca/api/"+encodeURIComponent(ref)+"?translation=kjv",{headers:{Accept:"application/json"}});
  if(!r.ok)throw new Error("API");
  const j=await r.json();const text=j.text||((j.verses||[]).map(v=>v.text).join(" "));
  const out={ref:j.reference||ref,text};localStorage.setItem(key,JSON.stringify(out));return out;
 }catch(e){return{ref,text:"KJV text is unavailable offline for this verse. Open the app while connected to the internet to cache it on this device."}}
}
function renderZodiac(){
 const box=$("#zodiacPicker");
 box.innerHTML=content.zodiacs.map(z=>`<button class="${z.name===selectedZodiac?"active":""}" data-z="${z.name}">${z.symbol}<small>${z.name}</small></button>`).join("");
 box.querySelectorAll("button").forEach(b=>b.onclick=()=>{selectedZodiac=b.dataset.z;localStorage.setItem("aag-zodiac",selectedZodiac);renderHoroscope()});
}
function renderHoroscope(){
 const z=zodiac(),i=dayIndex(),seed=(i*17+content.zodiacs.findIndex(x=>x.name===selectedZodiac)*31)%365;
 $("#horoscopeBody").innerHTML=`<div class="horo-title">${z.symbol} ${z.name}</div>
 <div class="horo-grid">
 <div class="horo-item"><b>💼 Work</b>${work[seed%work.length]}</div>
 <div class="horo-item"><b>💰 Money</b>${money[(seed*3)%money.length]}</div>
 <div class="horo-item"><b>❤️ Love</b>${love[(seed*5)%love.length]}</div>
 <div class="horo-item"><b>👨‍👩‍👧 Family</b>${family[(seed*7)%family.length]}</div>
 </div><div class="horo-note">Zodiac dates: ${z.dates}</div>`;
}
async function render(){
 if(!content)return;
 const d=content.days[dayIndex()],v=await getVerse(d.reference);
 const bgUrl = d.background.startsWith("./") ? d.background : "./" + d.background;
 const probe=new Image();
 probe.onload=()=>{$("#bg").style.backgroundImage=`url("${bgUrl}")`};
 probe.onerror=()=>{$("#bg").style.backgroundImage=`url("./assets/backgrounds/bg-01.svg")`};
 probe.src=bgUrl;
 $("#dateText").textContent=displayDate(selectedDate);
 $("#greeting").textContent=greeting();
 $("#natureText").textContent=`${d.theme} • Day ${d.day} of 365`;
 $("#dayLabel").textContent=`Day ${d.day} of 365`;
 $("#themeLabel").textContent=d.theme;
 $("#verseRef").textContent=v.ref;
 $("#verseText").textContent=`“${v.text}”`;
 $("#reflection").textContent=d.reflection;
 $("#prayer").textContent=d.prayer;
 $("#action").textContent=d.action;
 $("#datePicker").value=iso(selectedDate);
 $("#favBtn").textContent=saved().includes(iso(selectedDate))?"♥ Saved":"♡ Save Verse";
 $("#markBtn").textContent=readDays().includes(iso(selectedDate))?"✓ Read":"✓ Mark as Read";
 renderZodiac();renderHoroscope();updateProgress();
}
function move(n){selectedDate=new Date(selectedDate);selectedDate.setDate(selectedDate.getDate()+n);render();window.scrollTo({top:0,behavior:"smooth"})}
function markRead(){const k=iso(selectedDate),a=readDays();if(!a.includes(k))a.push(k);localStorage.setItem("aag-read",JSON.stringify(a));render()}
function toggleSaved(){const k=iso(selectedDate),a=saved(),i=a.indexOf(k);if(i<0)a.push(k);else a.splice(i,1);localStorage.setItem("aag-saved",JSON.stringify(a));render()}
function showPage(p){
 currentPage=p;["home","saved","calendar","progress","about"].forEach(x=>{$("#"+x+"Page")?.classList.toggle("hidden",x!==p)});
 $("#homePage").classList.toggle("hidden",p!=="home");$("#drawer").classList.remove("open");
 if(p==="saved")renderSaved();if(p==="calendar")renderCalendar();if(p==="progress")updateProgressPage();if(p==="about"){}
}
function renderSaved(){
 const box=$("#savedList"),a=saved();box.innerHTML="";
 if(!a.length){box.innerHTML='<div class="card"><p>Wala ka pang naka-save na devotional.</p></div>';return}
 a.sort().reverse().forEach(k=>{const d=new Date(k+"T12:00:00"),day=planDay(d),item=content.days[day-1];const el=document.createElement("div");el.className="saved-item";el.innerHTML=`<b>${displayDate(d)}</b><br>${item.reference} • ${item.theme}<br><button class="secondary wide">Open</button>`;el.querySelector("button").onclick=()=>{selectedDate=d;showPage("home");render()};box.appendChild(el)})
}
function renderCalendar(){
 const box=$("#calendar"),d=new Date(selectedDate),y=d.getFullYear(),m=d.getMonth(),first=new Date(y,m,1),last=new Date(y,m+1,0);
 const names=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];let h=`<div class="calendar-head"><button id="cmPrev" class="secondary">←</button><b>${first.toLocaleDateString("en-PH",{month:"long",year:"numeric"})}</b><button id="cmNext" class="secondary">→</button></div><div class="cal-grid">${names.map(n=>`<div class="source" style="text-align:center">${n}</div>`).join("")}`;
 for(let i=0;i<first.getDay();i++)h+="<div></div>";
 const s=saved(),r=readDays(),today=iso(new Date());
 for(let n=1;n<=last.getDate();n++){const x=new Date(y,m,n),k=iso(x),cl=["cal-cell","day",k===today?"today":"",r.includes(k)?"read":"",s.includes(k)?"saved":""].join(" ");h+=`<button class="${cl}" data-date="${k}">${n}</button>`}
 h+="</div>";box.innerHTML=h;
 $("#cmPrev").onclick=()=>{selectedDate=new Date(y,m-1,1);renderCalendar()};
 $("#cmNext").onclick=()=>{selectedDate=new Date(y,m+1,1);renderCalendar()};
 box.querySelectorAll("[data-date]").forEach(b=>b.onclick=()=>{selectedDate=new Date(b.dataset.date+"T12:00:00");showPage("home");render()});
}
function updateProgress(){
 const n=readDays().length,p=Math.min(100,Math.round(n/365*100));
 const pb=document.querySelector("#progressPage .progressbar");if(pb)pb.firstElementChild.style.width=p+"%";
}
function updateProgressPage(){
 const n=readDays().length,p=Math.min(100,Math.round(n/365*100)),s=saved().length;
 $("#progress").innerHTML=`<div class="card"><div class="stat"><b>${n}</b> of 365 days read</div><div class="progressbar"><div style="width:${p}%"></div></div><div class="stat">${p}% complete</div><div class="stat">❤️ ${s} saved devotional${s===1?"":"s"}</div><div class="stat">🔥 ${streak()} day streak</div></div>`;
}
function streak(){const a=new Set(readDays());let n=0,d=new Date();while(a.has(iso(d))){n++;d.setDate(d.getDate()-1)}return n}
function search(q){
 const box=$("#searchResults");q=q.trim().toLowerCase();if(!q){box.innerHTML="";return}
 const results=content.days.filter(d=>(d.reference+" "+d.theme+" "+d.reflection+" "+d.action).toLowerCase().includes(q)).slice(0,25);
 box.innerHTML=results.length?results.map(d=>`<div class="result-item"><b>Day ${d.day} • ${d.theme}</b><br>${d.reference}<br><button class="secondary wide" data-day="${d.day}">Open</button></div>`).join(""):'<div class="source">Walang nahanap.</div>';
 box.querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{selectedDate=new Date(new Date().getFullYear(),0,Number(b.dataset.day));showPage("home");render()});
}
$("#menuBtn").onclick=()=>$("#drawer").classList.toggle("open");
$("#drawer").querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>showPage(b.dataset.page));
$("#prevBtn").onclick=()=>move(-1);$("#nextBtn").onclick=()=>move(1);
$("#todayBtn").onclick=()=>{selectedDate=new Date();showPage("home");render()};
$("#datePicker").onchange=e=>{selectedDate=new Date(e.target.value+"T12:00:00");render()};
$("#favBtn").onclick=toggleSaved;$("#markBtn").onclick=markRead;
$("#shareBtn").onclick=async()=>{const text=`Araw-Araw na Gabay\n${displayDate(selectedDate)}\n${$("#verseRef").textContent}\n${$("#verseText").textContent}\n\n${$("#reflection").textContent}\n\n${$("#prayer").textContent}`;if(navigator.share)await navigator.share({title:"Araw-Araw na Gabay",text});else{await navigator.clipboard.writeText(text);alert("Nakopya ang devotional.");}};
$("#searchBox").oninput=e=>search(e.target.value);
$$("[data-nav]").forEach(b=>b.onclick=()=>{const n=b.dataset.nav;if(n==="home"){showPage("home");window.scrollTo({top:0,behavior:"smooth"})}else if(n==="bible"){showPage("home");document.querySelector(".scripture").scrollIntoView({behavior:"smooth"})}else if(n==="horoscope"){showPage("home");document.querySelector(".horoscope").scrollIntoView({behavior:"smooth"})}else showPage("calendar")});
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferred=e;$("#installBtn").classList.remove("hidden")});
$("#installBtn").onclick=async()=>{if(!deferred)return;deferred.prompt();await deferred.userChoice;deferred=null;$("#installBtn").classList.add("hidden")};
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js"));

fetch("data/content.json").then(r=>r.json()).then(x=>{content=x;render()}).catch(()=>{$("#verseText").textContent="Hindi ma-load ang app data. I-refresh kapag may internet."});
