/* Sharia Halaal Trader – script.js
   <head> me load hota hai (bina defer), taaki Meta Pixel jaldi shuru ho.
   Page ka logic DOMContentLoaded ke baad chalta hai. */

var TELEGRAM_LINK    = "https://t.me/+8dmExi9qqfgyNzBl";

var TEST_MODE = /[?&]test=1/.test(location.search);  // testing: link ke end me ?test=1

/* ---- Meta Pixel ---- */
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
// Meta ke automatic events band (SubscribedButtonClick, Microdata) - Subscribe sirf hamare code se
fbq('set', 'autoConfig', false, '2004017566955331');
fbq('init', '2004017566955331');
fbq('track', 'PageView');

/* ---- Page logic ---- */
document.addEventListener("DOMContentLoaded",function(){
  var CLICK_DELAY = 0.3; // button turant dikhta hai, click itne second baad hoga
  var SUB_DELAY   = 1100;  // Subscribe event click ke kitne ms baad jaaye
  var tgTimer=null;

  var cta=document.getElementById("cta");
  cta.href=TELEGRAM_LINK;
  setTimeout(function(){cta.classList.remove("wait");cta.classList.add("ready");},CLICK_DELAY*1000);

  // ---- Duplicate rokne ke liye: localStorage + cookie ----
  function getCookie(n){var m=document.cookie.match(new RegExp("(?:^|; )"+n+"=([^;]*)"));return m?decodeURIComponent(m[1]):null;}
  function alreadySubscribed(){
    var ls=null; try{ ls=localStorage.getItem("sht2_sub"); }catch(e){}
    return ls==="1" || getCookie("sht2_sub")==="1";
  }
  function markSubscribed(){
    try{ localStorage.setItem("sht2_sub","1"); }catch(e){}
    document.cookie="sht2_sub=1; max-age="+(60*60*24*90)+"; path=/; SameSite=Lax"; // 90 din
  }

  // ---- Asli user check ----
  var touched=false, fired=false, loadedAt=Date.now();
  ["pointerdown","touchstart","mousedown"].forEach(function(ev){
    cta.addEventListener(ev,function(e){ if(e.isTrusted) touched=true; },{passive:true});
  });

  // ---- Telegram link kholna ----
  function openTelegram(){ window.location.href=TELEGRAM_LINK; }

  // ---- Join hint popup ----
  var jh=document.getElementById("joinHint");
  function showJoinHint(){ if(jh) jh.hidden=false; }
  function hideJoinHint(){ if(jh) jh.hidden=true; clearTimeout(tgTimer); fired=false; }   // band karne par CTA dobara dab sakta hai
  if(jh){
    document.getElementById("jhClose").addEventListener("click",hideJoinHint);
  }
  window.addEventListener("pageshow",function(e){ if(e.persisted) hideJoinHint(); });
  document.addEventListener("visibilitychange",function(){ if(!document.hidden && jh && !jh.hidden) hideJoinHint(); });

  cta.addEventListener("click",function(e){
    e.preventDefault();
    if(fired) return;
    var realUser = e.isTrusted && touched && (Date.now()-loadedAt) >= CLICK_DELAY*1000 && !navigator.webdriver;
    fired=true;
    showJoinHint();
    if(TEST_MODE) testMsg(realUser ? "⏳ Subscribe 1.1 sec me jaayega…" : "🤖 Bot/fake click – event nahi gaya");
    if(realUser && (TEST_MODE || !alreadySubscribed())){
      setTimeout(function(){                         // Subscribe 1.1 sec baad
        if(document.hidden || (jh && jh.hidden)) return; // user chala gaya / popup band kiya -> event nahi
        var eventId = "sub_" + Date.now() + "_" + Math.random().toString(36).slice(2,10);
        if(window.fbq) fbq('track','Subscribe',{},{eventID:eventId});   // sirf pehli baar
        if(TEST_MODE) testMsg("✅ Subscribe event bheja gaya");
        if(!TEST_MODE) markSubscribed();   // test mode me yaad nahi rakhta, baar-baar test kar sako
      }, SUB_DELAY);
    }
    tgTimer=setTimeout(openTelegram, 1500);   // 1.5 sec: user popup padh le
  });

  // Back button se wapas aaye to button phir kaam kare
  window.addEventListener("pageshow",function(e){ if(e.persisted) fired=false; });

  // ---- Test mode badge ----
  function testMsg(t){ var b=document.getElementById("tbadge"); if(b) b.textContent="TEST MODE · "+t; }
  if(TEST_MODE){
    var tb=document.createElement("div"); tb.id="tbadge";
    tb.style.cssText="position:fixed;top:0;left:0;right:0;z-index:99;background:#ffcc00;color:#111;font:700 12.5px system-ui,sans-serif;text-align:center;padding:8px";
    document.body.appendChild(tb);
    testMsg("PageView bheja gaya · ab button dabao");
  }

  // Privacy popup
  var pp=document.getElementById("privacy");
  function openPP(e){ if(e) e.preventDefault(); pp.hidden=false; document.body.style.overflow="hidden"; }
  function closePP(){ pp.hidden=true; document.body.style.overflow=""; }
  document.getElementById("openPrivacy").addEventListener("click",openPP);
  document.getElementById("closePrivacy").addEventListener("click",closePP);
  pp.addEventListener("click",function(e){ if(e.target===pp) closePP(); });
  document.addEventListener("keydown",function(e){ if(e.key==="Escape" && !pp.hidden) closePP(); });
});
