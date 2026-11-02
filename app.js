let products = JSON.parse(localStorage.getItem('ama_products_taste')||'[]');
let cart=[]; let canSpin=true;
function save(){localStorage.setItem('ama_products_taste',JSON.stringify(products));}
function addProduct(){
 const name=document.getElementById('pName').value.trim();
 const price=parseInt(document.getElementById('pPrice').value);
 const img=document.getElementById('pImg').value.trim()||'https://via.placeholder.com/200';
 if(!name||!price){alert('Put name and price');return;}
 products.push({id:Date.now(),name,price,img}); save();
 document.getElementById('pName').value='';document.getElementById('pPrice').value='';document.getElementById('pImg').value='';
 renderShop();
}
function renderShop(){
 const grid=document.getElementById('shopGrid');
 if(products.length===0){grid.innerHTML='<p style="color:#666">No product yet — Add for top</p>';return;}
 grid.innerHTML=products.map(p=>`
  <div class="card">
   <img src="${p.img}" onerror="this.src='https://via.placeholder.com/200'">
   <div style="margin-top:8px;font-weight:600">${p.name}</div>
   <div style="color:#888">₦${p.price.toLocaleString()}</div>
   <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
  </div>`).join('');
}
function addToCart(id){
 const p=products.find(x=>x.id===id); cart.push(p);
 document.getElementById('cartCount').textContent='Cart '+cart.length;
 document.getElementById('status').textContent=p.name+' added';
}
function spinWheel(){
 if(!canSpin){alert('Wait');return;} canSpin=false;
 const wheel=document.getElementById('wheel'); const result=document.getElementById('wheelResult');
 const prizes=['5% OFF','10% OFF','Free Delivery','Try Again','₦500 Off','20% OFF'];
 const win=prizes[Math.floor(Math.random()*prizes.length)];
 wheel.style.transform='rotate('+(720+Math.random()*720)+'deg)'; result.textContent='Spinning...';
 setTimeout(()=>{result.textContent='You win: '+win; wheel.style.transform='rotate(0deg)'; canSpin=true;},2000);
}
document.addEventListener('DOMContentLoaded',()=>{document.getElementById('status').textContent='Auto Open — '+new Date().toLocaleTimeString(); renderShop();});