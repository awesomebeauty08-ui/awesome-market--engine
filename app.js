// @ts-nocheck
// AME-7742 Skeleton Engine - FINAL NO PROBLEMS
const AME_CODE = "AME-7742";
console.log("AME Running:", AME_CODE);

function ameLockCustomer(phone){
  if(!phone){
    alert("Enter phone");
    return;
  }
  let customers = JSON.parse(localStorage.getItem("ame_customers") || "[]");
  if(customers.includes(phone)){
    alert("Already locked");
    return;
  }
  customers.push(phone);
  localStorage.setItem("ame_customers", JSON.stringify(customers));
  alert("Locked: " + phone);
  return customers;
}

function ameAutoBuilder(businessInfo){
  let cleanName = businessInfo.name.replace(/\s/g,'').toLowerCase();
  let siteUrl = "www." + cleanName + ".ame7742.com";
  let seoTitle = "Cheapest wholesale " + businessInfo.product + " in Lagos - " + businessInfo.name;
  console.log("Building:", siteUrl, "| SEO:", seoTitle);
  localStorage.setItem("ame_last_built", siteUrl);
  localStorage.setItem("ame_last_seo", seoTitle);
  return { siteUrl, seoTitle };
}

// Make functions visible so Acode no complain
window.ameLockCustomer = ameLockCustomer;
window.ameAutoBuilder = ameAutoBuilder;
window.AME_CODE = AME_CODE;

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault();
  deferredPrompt = e;
});

let installBtn = document.getElementById('installBtn');
if(installBtn){
  installBtn.addEventListener('click', async()=>{
    if(deferredPrompt){
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(outcome);
      deferredPrompt = null;
    }
  });
}