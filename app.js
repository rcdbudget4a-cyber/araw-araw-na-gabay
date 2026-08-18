const $=s=>document.querySelector(s);
let content=null, selectedDate=new Date(), selectedZodiac=localStorage.getItem("zodiac")||"Aries", deferredInstall=null;
const work=["Tapusin muna ang pinakamahalagang gawain bago tumanggap ng panibagong obligasyon.", "Mag-ingat sa pakikipag-usap. Ang mahinahong salita ay makatutulong sa trabaho.", "May pagkakataong kailangan mong maging mas organisado. Gumawa ng simpleng listahan at unahin ang mahalaga.", "Kung may hindi pagkakaunawaan, alamin muna ang buong kuwento bago magpasya.", "Ang pagiging maaasahan ay mas mahalaga kaysa pagiging pinakamabilis.", "Maglaan ng oras upang suriin ang isang detalye na maaaring magdulot ng problema kung mapabayaan."];
const money=["Mag-ingat sa maliliit na gastos na paulit-ulit. Bantayan ang budget.", "Kung may bibilhin, itanong muna kung kailangan ba talaga ito ngayon.", "Magtabi kahit maliit na halaga kung kaya. Ang consistency ay mahalaga.", "Iwasang gumawa ng desisyong pinansyal dahil lamang sa pressure ng iba.", "Kung may utang o obligasyon, unahin ang malinaw na plano sa pagbabayad.", "Ang praktikal na pagtitipid ngayon ay maaaring makatulong sa isang biglaang pangangailangan."];
const love=["Sabihin ang nararamdaman nang may respeto. Iwasang magsalita habang galit.", "Sa relasyon, mas mahalaga ang pakikinig kaysa sa pagkapanalo sa argumento.", "Isang simpleng mensahe o oras na magkasama ay maaaring makapagpagaan ng araw.", "Kung may sama ng loob, pag-usapan ito kapag pareho nang kalmado.", "Huwag magdesisyon tungkol sa relasyon batay lamang sa isang masamang araw.", "Ang tiwala ay nabubuo sa maliliit na tapat na gawain."];
const family=["Maglaan ng oras sa pamilya kahit abala ang araw. Ang presensya ay mahalaga.", "Makinig sa isang kapamilya na may gustong sabihin.", "Kung may tensyon sa bahay, piliin muna ang kapayapaan bago ang pagtatalo.", "Magpasalamat sa isang taong tumutulong sa pamilya.", "Ang maliliit na gawaing bahay ay paraan din ng pag-aalaga sa isa't isa.", "Kung may problema ang pamilya, harapin ito nang sama-sama sa halip na sisihin ang isa't isa."];
const personal=["Maglaan ng ilang minuto para sa tahimik na panalangin.", "Huwag ikumpara ang progress mo sa ibang tao.", "Kung pagod ka, magpahinga bago gumawa ng mahalagang desisyon.", "Ang isang maliit na mabuting hakbang ngayon ay sapat na para magsimula.", "Mag-ingat sa mga salitang sinasabi mo sa sarili. Pumili ng katotohanan at pag-asa.", "Tapusin ang araw sa pasasalamat kaysa sa pagbilang lamang ng mga problema."];

function localDay(d){const y=d.getFullYear(),start=new Date(y,0,0);return Math.max(1,Math.floor((d-start)/86400000));}
function idx(){return (localDay(selectedDate)-1)%365}
function fmt(d){return d.toLocaleDateString("en-PH",{weekday:"long",month:"long",day:"numeric",year:"numeric"});}
function greeting(){const h=new Date().getHours();return h<12?"Magandang umaga.":h<18?"Magandang araw.":"Magandang gabi."}
function z(){return content.zodiacs.find(x=>x.name===selectedZodiac)||content.zodiacs[0]}
function cacheKey(ref){return "aag-kjv-"+ref}
async function verse(ref){
  const key=cacheKey(ref), cached=localStorage.getItem(key);
  if(cached) return JSON.parse(cached);
  const url="https://dailybible.ca/api/"+encodeURIComponent(ref)+"?translation=kjv";
  try{
    const r=await fetch(url,{headers:{Accept:"application/json"}});
    if(!r.ok) throw new Error("Bible lookup failed");
    const j=await r.json();
    const text=j.text||((j.verses||[]).map(v=>v.text).join(" "));
    const result={ref:j.reference||ref,text};
    localStorage.setItem(key,JSON.stringify(result));
    return result;
  }catch(e){
    return {ref,text:"Buksan muli habang may internet upang ma-load ang eksaktong KJV text. Ang reference na ito ay: "+ref};
  }
}
function prayer(ref){
 return `Panginoon, salamat sa araw na ito. Tulungan Mo akong isabuhay ang mensahe ng Iyong Salita sa trabaho, sa tahanan, sa pakikitungo sa kapwa, at sa mga desisyong kailangan kong gawin. Bigyan Mo ako ng karunungan, pagtitiis, at pusong marunong magpasalamat. Ingatan Mo ang aking pamilya at gabayan Mo kami sa bawat hakbang. Sa pangalan ni Jesus, Amen.`;
}
function horoscope(i){
 const zi=content.zodiacs.findIndex(x=>x.name===selectedZodiac), seed=(i+Math.max(0,zi))%365;
 const zz=z();
 $("#horoscope").innerHTML=`<div class="horo-title">${zz.symbol} ${zz.name}</div>
 <div class="horo-grid">
 <div class="horo-item"><b>💼 Work</b>${work[seed%work.length]}</div>
 <div class="horo-item"><b>💰 Money</b>${money[(seed*3+zi)%money.length]}</div>
 <div class="horo-item"><b>❤️ Love</b>${love[(seed*5+zi)%love.length]}</div>
 <div class="horo-item"><b>👨‍👩‍👧 Family</b>${family[(seed*7+zi)%family.length]}</div>
 </div><div class="horo-personal"><b>🧠 Personal guidance</b><br>${personal[(seed*11+zi)%personal.length]}</div>
 <div class="notice">Zodiac dates: ${zz.dates}. Horoscope is for reflection and entertainment, not a guaranteed prediction.</div>`;
}
async function render(){
 const i=idx(), d=content.days[i], v=await verse(d.reference), zz=z();
 $("#bg").style.backgroundImage=`url("${d.background}")`;
 $("#dateText").textContent=fmt(selectedDate);
 $("#greeting").textContent=greeting();
 $("#natureText").textContent=d.natureTitle+" • "+d.day+"/365";
 $("#verseRef").textContent=v.ref;
 $("#verseText").textContent=`“${v.text}”`;
 $("#reflection").textContent=d.reflection;
 $("#prayer").textContent=prayer(d.reference);
 $("#source").textContent="King James Version • Public Domain";
 $("#dayCount").textContent=`Day ${d.day} of 365`;
 renderPicker(); horoscope(i);
 $("#datePicker").value=selectedDate.toISOString().slice(0,10);
}
function renderPicker(){
 const w=$("#zodiacPicker");w.innerHTML=content.zodiacs.map(x=>`<button class="${x.name===selectedZodiac?"active":""}" data-z="${x.name}">${x.symbol}<small>${x.name}</small></button>`).join("");
 w.querySelectorAll("button").forEach(b=>b.onclick=()=>{selectedZodiac=b.dataset.z;localStorage.setItem("zodiac",selectedZodiac);render();});
}
$("#datePicker").onchange=e=>{selectedDate=new Date(e.target.value+"T12:00:00");render()};
$("#todayBtn").onclick=()=>{selectedDate=new Date();render();window.scrollTo({top:0,behavior:"smooth"})};
$("#favBtn").onclick=()=>{const k=selectedDate.toISOString().slice(0,10),f=JSON.parse(localStorage.getItem("favorites")||"[]");if(!f.includes(k))f.push(k);localStorage.setItem("favorites",JSON.stringify(f));$("#favBtn").textContent="♥ Saved"};
$("#darkBtn").onclick=()=>document.body.classList.toggle("lightread");
$("#shareBtn").onclick=async()=>{const text=`Araw-Araw na Gabay\n${$("#verseRef").textContent}\n${$("#verseText").textContent}\n\n${$("#reflection").textContent}`;if(navigator.share)await navigator.share({title:"Araw-Araw na Gabay",text});else await navigator.clipboard.writeText(text)};
document.querySelectorAll(".bottom-nav button").forEach(b=>b.onclick=()=>{const x=b.dataset.scroll;document.querySelector(x==="top"?"main":x==="scripture"?".scripture":x==="horoscope"?".horoscope-card":"#datePicker").scrollIntoView({behavior:"smooth"})});
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstall=e;$("#installBtn").hidden=false});
$("#installBtn").onclick=async()=>{if(deferredInstall){deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;$("#installBtn").hidden=true}};
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js"));
fetch("data/content.json").then(r=>r.json()).then(x=>{content=x;render()}).catch(()=>$("#reflection").textContent="Hindi ma-load ang daily content. Suriin ang internet at subukang muli.");
