let PASSWORD = localStorage.getItem("adminPass") || "12345";
let products = JSON.parse(localStorage.getItem("products")) || [];
let currentCategory = "All";

function save(){
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("adminPass", PASSWORD);
}

// ---------------- LOAD PRODUCTS ----------------
function loadProducts(isAdmin){
  const list = document.getElementById("productList");
  if(!list) return;
  list.innerHTML = "";

  products.forEach((p,i)=>{
    if(currentCategory!="All" && p.category != currentCategory) return;
    list.innerHTML += `
      <div class="card" data-aos="fade-up">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p>Price: PKR ${p.price}</p>
        <p>Category: ${p.category}</p>
        ${isAdmin ? `<button onclick="remove(${i})">Remove</button>` : ""}
        ${isAdmin ? `<button onclick="edit(${i})">Edit</button>` : ""}
        ${!isAdmin ? `<button onclick="order('${p.name}','${p.price}')">Order</button>` : ""}
      </div>
    `;
  });
}

// ---------------- CATEGORY FILTER ----------------
function filterCategory(cat){
  currentCategory = cat;
  loadProducts(false);
}

// ---------------- ORDER WHATSAPP ----------------
function order(name, price){
  const msg = `I want to order ${name} priced at PKR ${price}`;
  const link = "https://wa.me/923350625296?text="+encodeURIComponent(msg);
  window.open(link,'_blank');
}

// ---------------- ADMIN LOGIN ----------------
function login(){
  const pass = document.getElementById("adminPass").value;
  if(pass===PASSWORD){
    document.getElementById("loginBox").style.display="none";
    document.getElementById("adminPanel").style.display="block";
    loadProducts(true);
  } else alert("Wrong Password");
}

// ---------------- CHANGE PASSWORD ----------------
function changePassword(){
  const np = document.getElementById("newPass").value;
  if(np.length>=4){
    PASSWORD = np;
    save();
    alert("Password changed!");
  } else alert("Password too short!");
}

// ---------------- ADMIN CRUD ----------------
function addProduct(){
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const category = document.getElementById("category").value || "General";
  const fileInput = document.getElementById("image");
  const file = fileInput.files[0];

  if(!name || !price || !file){
    alert("Fill all fields & select image");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e){
    const imgData = e.target.result;
    products.push({name,price,category,image:imgData});
    save();
    loadProducts(true);
  }
  reader.readAsDataURL(file);
}

// ---------------- REMOVE PRODUCT ----------------
function remove(i){
  if(confirm("Remove this product?")){
    products.splice(i,1);
    save();
    loadProducts(true);
  }
}

// ---------------- EDIT PRODUCT ----------------
function edit(i){
  const p = products[i];
  const name = prompt("Product Name", p.name);
  const price = prompt("Price", p.price);
  const category = prompt("Category", p.category);
  if(name && price && category){
    products[i].name = name;
    products[i].price = price;
    products[i].category = category;
    save();
    loadProducts(true);
  }
}

// ---------------- INITIAL LOAD ----------------
if(document.getElementById("productList")) loadProducts(false);
