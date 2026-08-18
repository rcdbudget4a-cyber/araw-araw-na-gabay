
const $ = s => document.querySelector(s);
let content = null;
let selectedDate = new Date();
let selectedZodiac = localStorage.getItem("zodiac") || "Aries";
let deferredInstall = null;

const zodiacNames = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const zodiacIcons = {"Aries":"♈","Taurus":"♉","Gemini":"♊","Cancer":"♋","Leo":"♌","Virgo":"♍","Libra":"♎","Scorpio":"♏","Sagittarius":"♐","Capricorn":"♑","Aquarius":"♒","Pisces":"♓"};

function dayIndex(d){
  const start = new Date(d.getFullYear(),0,0);
  return Math.max(0, Math.floor((d-start)/86400000)-1);
}
function fmt(d){return d.toLocaleDateString("en-PH",{weekday:"long",month:"long",day:"numeric",year:"numeric"});}
function currentDay(){return dayIndex(selectedDate)%365;}
function greeting(){const h=new Date().getHours(); return h<12?"Magandang umaga.":h<18?"Magandang araw.":"Magandang gabi.";}
function prayer(ref){
  return `Panginoon, salamat sa araw na ito at sa mga taong inilagay Mo sa aking buhay. Tulungan Mo akong isabuhay ang mensahe ng Iyong Salita sa trabaho, sa tahanan, sa pakikitungo sa kapwa, at sa mga desisyong kailangan kong gawin. Bigyan Mo ako ng karunungan, pagtitiis, at pusong marunong magpasalamat. Ingatan Mo ang aking pamilya at gabayan Mo kami sa bawat hakbang. Sa pangalan ni Jesus, Amen.`;
}
function zodiacForDate(name){
  const z = content.zodiacs.find(x=>x.name===name) || content.zodiacs[0];
  return z;
}
function renderPicker(){
  const wrap=$("#zodiacPicker");
  wrap.innerHTML=content.zodiacs.map(z=>`<button class="${z.name===selectedZodiac?'active':''}" data-z="${z.name}">${z.symbol}<small>${z.name}</small></button>`).join("");
  wrap.querySelectorAll("button").forEach(b=>b.onclick=()=>{selectedZodiac=b.dataset.z;localStorage.setItem("zodiac",selectedZodiac);render();});
}
function render(){
  const i=currentDay();
  const v=content.verses[i%content.verses.length];
  const bg=content.backgrounds[i%content.backgrounds.length];
  $("#bg").style.backgroundImage=`url("${bg}")`;
  $("#dateText").textContent=fmt(selectedDate);
  $("#greeting").textContent=greeting();
  $("#natureText").textContent=["Tahimik na bundok para sa pagninilay.","Luntiang umaga para sa bagong simula.","Tahimik na dagat para sa pusong naghahanap ng kapayapaan.","Gubat at ulan, paalala na may buhay kahit sa tahimik na panahon.","Liwanag sa kabundukan, paalala na may panibagong umaga.","Lambak at langit, panahon para huminga at magpasalamat.","Luntiang tanawin, paalala na lumago nang dahan-dahan.","Mga puno at hangin, paalala na hindi kailangang madaliin ang lahat.","Mga bulaklak, paalala na may kagandahan sa maliliit na bagay.","Malawak na tanawin, panahon para tingnan ang mas malaking larawan.","Tahimik na kapaligiran, panahon para makinig at manalangin.","Mga punong nakatayo sa gitna ng hangin, paalala ng katatagan."][i%12];
  $("#verseRef").textContent=v.ref;
  $("#verseText").textContent=`“${v.text}”`;
  $("#reflection").textContent=content.themes[i%content.themes.length];
  $("#prayer").textContent=prayer(v.ref);
  renderPicker();
  const zi=zodiacNames.indexOf(selectedZodiac);
  const advice=content.zodiacAdvice[(i+zi)%content.zodiacAdvice.length];
  const z=zodiacForDate(selectedZodiac);
  $("#horoscope").innerHTML=`<div class="horo-title">${z.symbol} ${z.name}</div>
  <div class="horo-grid">
    <div class="horo-item"><b>💼 Work</b>${advice}</div>
    <div class="horo-item"><b>💰 Money</b>${content.zodiacAdvice[(i+zi+3)%12]}</div>
    <div class="horo-item"><b>❤️ Love</b>${content.zodiacAdvice[(i+zi+5)%12]}</div>
    <div class="horo-item"><b>👨‍👩‍👧 Family</b>${content.zodiacAdvice[(i+zi+8)%12]}</div>
  </div>
  <div class="notice">Zodiac dates: ${z.dates}. Daily reading ${i+1} of 365.</div>`;
  $("#datePicker").value = selectedDate.toISOString().slice(0,10);
}
async function init(){
  content=await fetch("data/content.json").then(r=>r.json());
  render();
  const today=new Date(); $("#datePicker").value=today.toISOString().slice(0,10);
}
$("#datePicker").onchange=e=>{selectedDate=new Date(e.target.value+"T12:00:00");render();};
$("#todayBtn").onclick=()=>{selectedDate=new Date();render();window.scrollTo({top:0,behavior:"smooth"});};
$("#favBtn").onclick=()=>{const key=selectedDate.toISOString().slice(0,10);const f=JSON.parse(localStorage.getItem("favorites")||"[]");if(!f.includes(key))f.push(key);localStorage.setItem("favorites",JSON.stringify(f));$("#favBtn").textContent="♥ Saved";};
$("#darkBtn").onclick=()=>document.body.classList.toggle("lightread");
$("#shareBtn").onclick=async()=>{const text=`Araw-Araw na Gabay\n${$("#verseRef").textContent}\n${$("#verseText").textContent}\n\n${$("#reflection").textContent}`;if(navigator.share)await navigator.share({title:"Araw-Araw na Gabay",text});else await navigator.clipboard.writeText(text);};
document.querySelectorAll(".bottom-nav button").forEach(b=>b.onclick=()=>{const x=b.dataset.scroll;document.querySelector(x==="top"?"main":x==="scripture"?".scripture":x==="horoscope"?".horoscope-card":"#datePicker").scrollIntoView({behavior:"smooth"});});
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstall=e;$("#installBtn").hidden=false;});
$("#installBtn").onclick=async()=>{if(deferredInstall){deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;$("#installBtn").hidden=true;}};
if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js"));
init();
