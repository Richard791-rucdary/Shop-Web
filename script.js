let users = ""
let pes = "";
let myname = "";
let pers = "";
let resd = [];
let rese;
let msgArr = [];
let id = ""
let reader = [];


function view(content) {
    document.querySelectorAll('.hide').forEach(el => el.style.display = "none");
    if(!document.getElementById(content)) return view("homes")
    document.getElementById(content).style.display = "block";
}
   const get = localStorage.getItem('SHDB-name');
  
window.onload = () => {
     const params = new URLSearchParams(window.location.search).get("login")
        if (params === "yes") return toLogin();
      if(params === "no") return toSignup()
           return toLogin()
}

function toLogin() {
    document.querySelectorAll('#login input').forEach(el => el.value = "");
view('login');
  if(get) {
    document.getElementById("username").value = get;
    document.getElementById("log-pass").focus();
  }
}
function toSignup() {
    view('signup');
    document.querySelectorAll('#signup input').forEach(el => el.value = "");
}

document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
})
async function signUp() {
    const userInp = document.getElementById("user-inp")
    const nameInp = document.getElementById("name-inp")
    const passInp = document.getElementById("pass-inp")
    if(userInp.value.length !== 7) return msgBox("Input a valid username", "fail")
    if(!nameInp.value) return msgBox("Input a name", "fail")
    if(!passInp.value) return msgBox("Input a password", "fail")
   on()
try {
   const fish = await fetch("https://shopdb-rb5i.onrender.com/signup", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
        "user": userInp.value,
        "name": nameInp.value,
        "password": passInp.value,
    })
   })
   const res = await fish.json()
   if(!res.message) {
   off()
    return msgBox(res.err, "fail")
   }
    off()
    users = userInp.value
     localStorage.setItem("SHDB-name", users)
   toLogin()
    document.getElementById("username").value = users;
} catch(err) {
   if(err.toString().toLowerCase().includes("failed to fetch")) {
 msgBox("We can't connect to our servers. Please check your internet connection.", "fail")
    } else {
msgBox("An error occured. Please try again.", "fail")
    }
       off()
    
}
}

async function logIn() {
   const user = document.getElementById("username")
   const pass = document.getElementById("log-pass")
   if (!user.value || user.value.length !== 7) return msgBox("Invalid User name!", "fail")
    if (!pass.value) return msgBox("Enter a password", "fail")
    on()
try {
      const fish = await fetch("https://shopdb-rb5i.onrender.com/login", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
        "user":user.value,
        "password": pass.value,
    })
   })
   const res = await fish.json()
   if(!res.token) {
   off()
    return msgBox(res.err, "fail")
   } 
    sessionStorage.setItem("token", res.token)
     localStorage.setItem("SHDB-name", user.value);
     localStorage.setItem("pesinName", res.realName);
    users = user.value
    myname = res.name
    off()
     loadBack()
}catch(err) {
    if(err.toString().toLowerCase().includes("failed to fetch")) {
 msgBox("We can't connect to our servers. Please check your internet connection.", "fail")
    } else {
msgBox("An error occured. Please try again.", "fail")
    }
  off()
   }
}

function loadBack() {
   ert = loadData();
   document.getElementById("search-inp").value = ""
   pes = ""
return view("home")
}

function calc(typee) {
   let text = typee === "a" ? "text-inpt" : "edit-text";
   let num = typee === "a" ? "num-inp" : "edit-tot"
    const inp = document.getElementById(text);
    const dis = document.getElementById(num);
    const val = inp.value;
    let plus = val.match(/\#\d+/g)
    let minus = val.match(/\$\d+/g)
    let multiply = val.match(/\d+&\d+/g)
    let vake = 0

     if (multiply && multiply.length > 0) {
        multiply.map(ins => {
            let one = parseInt(ins.split("&")[0])
            let two = parseInt(ins.split("&")[1])
            vake += one * two;
        })
    }
    if (plus && plus.length > 0) {
for (const ins of plus) {
    if(!/\d+#\d+/.test(ins)) {
    vake += parseInt(ins.replace("#", ""))
}
}
    }
     if (minus && minus.length > 0) {
   minus.map(ins => vake -= parseInt(ins.replace("$", "")));
    }


    dis.value = vake
}

function createNew() {
    view("reg-page")
    document.getElementById("inp-cus").focus()
    document.querySelectorAll("input,textarea").forEach(dis => {
 dis.value = "";
    })
}

async function loadData() {
    const ge = sessionStorage.getItem("token");
    let disp = "";
    

loading("debtors", "80%", "30px", "var(--norm)")
 try {
      const fish = await fetch(`https://shopdb-rb5i.onrender.com/load`, {
        method: "POST",
        headers : {
            "Content-Type": "application/json",
            "Authorization": ge,
        },
        body: JSON.stringify({
            "name": users,
        })
      })
   let rest = await fish.json() 
   if(rest.err) {
     document.getElementById("debtors").innerHTML = `<b id="error-b">!</b><p><b>${rest.err}</b><br><br><button onclick='loadData()'>Retry</button></p>`
     return false
   }
   rese = rest;
    document.getElementById("name-dis").innerHTML = `Hello ${myname}`;
   if(rese.message === null) {
   return document.getElementById("debtors").innerHTML = `<h1 style="color:grey;">No Records</h1>`
   }
   resd.length = 0;
   rese.message.sort((a,b) => {
    if(parseInt(a.time) > parseInt(b.time)) return -1
     if(parseInt(b.time) > parseInt(a.time)) return 1
     return 1
   })
   rese.message.forEach(dis => {
    let art = false
    for (const dip of resd) {
  if (dip[0] === dis.name) {
    art = true;
  }
    }
    if(art === false) resd.push([dis.name, parseInt(dis.time)] )
   })
   resd.sort((a,b) => {
    if (a[1] > b[1]) return -1
    if (b[1] > a[1]) return 1
    return -1
   })
   rese.message.sort((a,b) => {
    if(parseInt(a.time) > parseInt(b.time)) return 1
     if(parseInt(b.time) > parseInt(a.time)) return -1
     return -1
   })
    resd.forEach(val => {
        let total = 0;
        rese.message.forEach(dis => {
            if(val[0] === dis.name) {
          total += parseInt(dis.owed);
            }
        })
    disp+= dispWars(val[0], total)
  })
  document.getElementById("debtors").innerHTML = disp
  return true
} catch(err){
     if(err.toString().toLowerCase().includes("failed to fetch")) {
        if(resd.length > 0) {
            off()
            msgBox("Failed to update records. Please check your internet", "fail")
              resd.forEach(val => {
        let total = 0;
        rese.message.forEach(dis => {
            if(val[0] === dis.name) {
          total += parseInt(dis.owed);
            }
        })
    disp+= dispWars(val[0], total) 
})
  document.getElementById("debtors").innerHTML = disp
  off()
 return
        }
  document.getElementById("debtors").innerHTML="<img src=\"Wifi-down.png\" alt=\"wifi\" id=\"har\"><br><b>We can't connect to our servers. try connecting to a stronger Wifi network</b><br><br><button onclick='loadData()'>Retry</button><br><br>"
  off()
  } else {
 document.getElementById("debtors").innerHTML = "<b id=\"error-b\">!</b><br>There was an error while carrying out your request! Please try again.<br><br><button onclick='loadData()'>Retry</button><br><br>"
 off( ) 
}
   return false
}
}

async function add() {
     const get = sessionStorage.getItem("token");
    const cust = document.getElementById("inp-cus")
    const text = document.getElementById("text-inpt")
    const num = document.getElementById("num-inp")
 const options = {weekday: "long", month:"long", year:"numeric", day:"numeric", timeZone:"Africa/Lagos"};
 const date = new Date();
 const time = `${date.getHours().toString().padStart(2,0)}:${date.getMinutes().toString().padStart(2,0)}`
 const curr = new Intl.DateTimeFormat("en-NG", options).format(new Date());
    if(cust.value.trim()) {
        if(text.value.trim()) {
            if (num.value.trim()) {
               on()
     try {
          const fish = await fetch(`https://shopdb-rb5i.onrender.com/save`, {
        method: "POST",
        headers : {
            "Content-Type": "application/json",
            "Authorization": get
        },
        body: JSON.stringify({
            "useName": users,
            "name": cust.value.trim(),
            "date": curr,
            "actDate": time,
            "record": text.value.trim(),
            "owed": parseFloat(num.value.trim()),
            "time": Date.now().toString(),
        })
      })
   let rest = await fish.json() 
   if(rest.err) {
   off()
     return msgBox(rest.err, "fail")
   }
   msgBox(rest.message, "success");
  off()
      if (rest.message) {
        document.querySelectorAll("#reg-page input,#reg-page textarea").forEach(disp => {
        disp.value = "";
      });
    }
      if (pes === "") return
      await loadData()
        viewRecords(pes)
     } catch(err) {
       if(err.toString().toLowerCase().includes("failed to fetch")) {
 msgBox("We can't connect to our servers. Please check your connection.", "fail")
    } else {
msgBox("An error occured. Please try again.", "fail")
    }
         off()
     }
            } else {
                msgBox("Input a total amount!", "fail")
                num.focus()
            }
        } else {
            msgBox("Input a record of the transaction", "fail")
            text.focus()
        }
    } else {
        msgBox("Input name of the customer!", "fail")
        cust.focus()
    }
}

function msgBox(value, col) {
    const msg = document.getElementById("message-box");
    if(msg.style.display === "block") {
        msgArr.push({value, col})
        return
    }
    msg.style.display = "block";
     msg.classList.add("show")
    setTimeout(() => {
     msg.innerHTML = value;
     if(col === "success") {
                msg.style.color = "green";
            } else if(col === "fail") {
                msg.style.color = "var(--bright)";
            } else {
msg.style.color = "black";
            }
         setTimeout(() => {
            msg.innerText = "";
        msg.classList.remove("show")
        msg.classList.add("close")
        setTimeout(() => {
 msg.style.display = "none";
  msg.classList.remove("close")
  if(msgArr.length > 0) {
    msgBox(msgArr[0].value, msgArr[0].col)
    msgArr.shift();
  }
        }, 1000)
    }, 2000)
    }, 1000)
}

function viewRecords(val) {
    let read = [];
    let dise = "";
    let dates = ""
    pes = val;
    if (!rese.message || rese.message.length === 0) return 0
    rese.message.forEach(dis => {
        if(dis.name === val) {
            read.push({rec: dis.record, bal: dis.owed, date: dis.date, id: dis.id, time: dis.actDate})
        }
    })
    if(read.length === 0) return loadBack();
    view("dis-page")
    document.getElementById("head").innerText = val;

    read.forEach(dis => {
  if(dis.date !== dates) {
    dates = dis.date;
    dise += `<div class="date-dis">${dates}</div><br>`
  }
 
  ert = dis.rec.replace(/#+/g,"₦").replace(/\$+/g,"₦");
  vat = ert.match(/\d+\&\d+/g)
  if(vat) {
vat.forEach(dis => {
    ert = ert.replace(dis, "₦"+eval(dis.replace("&", "*")).toLocaleString())
})
  }
  classe = parseInt(dis.bal) >= 0 ? "recs" : "ids";
dise += `<div class="${classe}" oncontextmenu="showOpt('${dis.id}')" tabindex="0" id="${dis.id}">${ert}<br><br><b>Total</b>: ₦${dis.bal.toLocaleString().replace("-", "")}<br><br><div class="time-dispe">${dis.time}</div></div><br><br>`
    })
    document.getElementById("rec-dis").innerHTML = dise;
    document.getElementById(read[read.length - 1].id).focus()
}

let thing = false
async function del(val) {
   const get = sessionStorage.getItem("token")
    let con = confirm("are u sure u want to delete this record?")
    if(con) {
        try {
        const fish = await fetch(`https://shopdb-rb5i.onrender.com/del`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": get,
            },
            body: JSON.stringify({
                "id": val,
                "name": users,
            })
        })
        const reste = await fish.json();
        if(reste.err) return msgBox(reste.err, "fail")
           let ert = await loadData()
            if(rese.message === null) loadBack()
        viewRecords(pes)
       return msgBox(reste.message, "success")
    } catch(err) {
    if(err.toString().toLowerCase().includes("failed to fetch")) {
        msgBox("We can't connect to our servers. Please check your internet connection.", "fail")
    }else {
msgBox("An error occured. Please try again.", "fail")
    } 
    }
}
}

function addToUser() {
    createNew()
    document.getElementById("inp-cus").value = pes;
    document.getElementById("text-inpt").focus()
}

    function check() {
        closers("cancel")
        const val = document.getElementById("search-inp").value;
        let arr = []
        let disp = "";
        if(val === "") return loadData();
        resd.forEach(dibs => {
            if (dibs[0].toLowerCase().startsWith(val.toLowerCase())) {
                arr.push(dibs[0])
            }
        })
        arr.forEach(ins => {
             let total = 0;
        rese.message.forEach(dis => {
            if(ins === dis.name) {
          total += parseInt(dis.owed);
            }
        })
 disp+= `<div onclick="viewRecords('${ins}')" oncontextmenu="showOs('${ins}')" id="${ins.replace(" ", "-")}"><span><b><b style="color: var(--bright); font-size: 20px;">${val}</b>${ins.toLowerCase().replace(val.toLowerCase(), "")}</b></span><span><small style="color: ${total > 0 ? "green" : total < 0 ? "red" : "black"}; background:  rgb(253, 246, 167); border-radius: 10px; border: none; height: 30px; width: 40px; font-weight: bold;">₦${total.toLocaleString().replace("-", "")}</small></span></div>`
        })
        disp = disp === "" ? "<h1 style=\"color:grey;\">No Match</h1>": disp;
        document.getElementById("debtors").innerHTML = disp;
    }

    function off() {
        document.getElementById("loaders").style.display = "none"
    }

    function on() {
        document.getElementById("loaders").style.display = "block"
    }
     function types(val) {
    const valp = document.getElementById(`input-${val}`).value
    document.getElementById(`input-${val}`).length = 1;
    if(valp !== "" && val !== "5") {
    if(parseInt(val) <= 4) {
          document.getElementById(`input-${parseInt(val)+1}`).focus();
    }
    }
    if(val === "5") {
        goCode()
    }
    }

    function formOTP(val) {
        view("OTP")
        let inp = ""
        document.getElementById("mes-dis").innerHTML= `We sent an OTP from badgcheets@gmail.com to <b style="color: red;">${val}</b> Input the OTP in the input below and don't forget to check the spam folder`
        for(let i = 0; i < 6; i++) {
            inp += `<input type="number" class="OTP" id="input-${i}" oninput="types('${i}')" maxlength="1">`
        }
         document.getElementById("otp-dis").innerHTML= inp
           document.querySelectorAll("#otp-dis input").forEach((val, id) => {
        val.addEventListener("keydown", (e) => runsAm(e, id))
    })
    }

    function runsAm(e, id) {
        const val = document.getElementById(`input-${id}`).value
        if(e.key.toString().toLowerCase() === "backspace" && val === "" && id !== 0) {
       document.getElementById(`input-${id-1}`).focus();
        }
        if(val !== "" && e.key.toString().toLowerCase() !== "backspace") {
            document.getElementById(`input-${id}`).value = ""
        }
    }

  async  function goCode() {
        let val = "";
        document.querySelectorAll("#otp-dis input").forEach(dis => {
            val += dis.value 
        })
      if(val.length !== 6) return 
      try{
        on()
      const fish = await fetch("https://shopdb-rb5i.onrender.com/conf", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "email": users,
            "otp": val,
        })
      })
      
   const res = await fish.json()
   if(!res.message) {
   off()
   if(res.err.toLowerCase === "invalid otp") {
      document.querySelectorAll("#otp-dis input").forEach(dis => {
            dis.value = "";
        })
   }
    return msgBox(res.err, "fail")
   } 
 msgBox(res.message, "success")
 localStorage.setItem("SHDB-name", users)
 document.getElementById("username").value = users;
  off()
   return toLogin()
}catch(err) {
    if(err.toString().toLowerCase().includes("failed to fetch")) {
        msgBox("We can't connect to our servers. Please check your internet connection.", "fail")
    } else {
msgBox("An error occured. Please try again.", "fail")
    }
  off()
   }
    }

    function doMsg(vals) {
        view("edit-rec")
          const id = document.getElementById("rec-id")
          const text = document.getElementById("edit-text")
            const tot = document.getElementById("edit-tot")
            id.value = vals;
            rese.message.forEach(val => {
    if(val.id === id.value) {
          text.value = val.record
          tot.value = val.owed
          text.focus();
          return
    } 
            })
          
    }
   async function updateMsg() {
    const getse = sessionStorage.getItem("token")
        const id = document.getElementById("rec-id").value
          const text = document.getElementById("edit-text").value
            const tot = document.getElementById("edit-tot").value
           try {
            on()
        const fish = await fetch(`https://shopdb-rb5i.onrender.com/upd`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": getse,
            },
            body: JSON.stringify({
                "pes": users,
                "id": id,
                "text": text,
                "total": parseInt(tot),
            })
        })
        const reste = await fish.json();
        if(reste.err) {
            off()
            return msgBox(reste.err, "fail")
        }
        await loadData()
        viewRecords(pes)
         document.querySelectorAll("#edit-rec input, #edit-rec textarea").forEach(disp => {
        disp.value = "";
      });
      off()
       return msgBox(reste.message, "success")
    } catch(err) {
    if(err.toString().toLowerCase().includes("failed to fetch")) {
        msgBox("We can't connect to our servers. Please check your internet connection.", "fail")
    } else if(err.toString().toLowerCase().includes("undefined")) {
        msgBox("Success", "success")
        loadBack()
    }else {
msgBox("An error occured. Please try again.", "fail")
    } 
    off()
    }
}

function showOpt(ide) {
    document.getElementById("vevs").style.display = "flex"
     document.getElementById("backe").style.display = "none"
     id = ide
    doStuff(ide)
    }

function closer(value) {
  if(value === "cancel") {
      document.getElementById("vevs").style.display = "none"
     document.getElementById("backe").style.display = "block"
     id = ""
   } else if(value === "pen") {
       document.getElementById("vevs").style.display = "none"
     document.getElementById("backe").style.display = "block"
    doMsg(id)
      id = ""
   } else if(value === "trash") {
       document.getElementById("vevs").style.display = "none"
     document.getElementById("backe").style.display = "block"
     del(id)
       id = ""
   }
   doStuff("")
}

function doStuff(msg) {
     document.querySelectorAll(".recs").forEach(dis => {
        dis.style.background = "var(--bright)";
     })
      document.querySelectorAll(".ids").forEach(dis => {
        dis.style.background = "var(--norm)";
     })
     if(msg === "") return
     const val = document.getElementById(msg).className
     const vars = val === "recs" ? "var(--dull)" : "var(--duller)"
     document.getElementById(msg).style.background = vars
}


function doStuffe(msg) {
     document.querySelectorAll("#debtors div").forEach(dis => {
        dis.style.background = "var(--norm)";
     })
     if(msg === "yes") return
     document.getElementById(msg.replace(" ", "-")).style.background = "var(--duller)"
}


async function delWhole(val) {
    let con = confirm(`Are you sure you want to delete ${val}'s records?`)
      const ge = sessionStorage.getItem("token");
    if(con) {
        try {
           const fish = await fetch("https://shopdb-rb5i.onrender.com/masDel", {
           method: "POST",
           headers: {
            "Content-Type": "application/json",
            "Authorization": ge,
           },
           body: JSON.stringify({
            user: get,
            name: val
           })
           })
           const resd = await fish.json()
           if(resd.err) return msgBox(resd.err, "fail")
            loadData()
        msgBox("Success", "success")
        } catch(err) {
  if(err.toString().toLowerCase().includes("failed to fetch")) {
        msgBox("We can't connect to our servers. Please check your internet connection.", "fail")
    }else {
msgBox("An error occured. Please try again.", "fail")
    } 
        }
    }
}

function showOs(ide) {
       document.getElementById("vevse").style.display = "flex"
     document.getElementById("create-new").style.display = "none"
     pers = ide
    doStuffe(ide)
    }
    
function closers(value) {
  if(value === "cancel") {
      document.getElementById("vevse").style.display = "none"
     document.getElementById("create-new").style.display = "block"
     pers = ""
   } else if(value === "pen") {
       document.getElementById("vevse").style.display = "none"
     document.getElementById("create-new").style.display = "block"
     dudu()
   } else if(value === "trash") {
       document.getElementById("vevse").style.display = "none"
     document.getElementById("create-new").style.display = "block"
     delWhole(pers)
     pers = ""
   }
   doStuffe("yes")
}

function dispWars(names, tot) {
 return `<div onclick="viewRecords('${names}')" oncontextmenu="showOs('${names}')" id="${names.replace(" ", "-")}"><span><b>${names.substr(0,20)}${names.length > 21 ? "...":""}</b></span><span><small style="color: ${tot > 0 ? "green" : tot < 0 ? "red" : "black"}; background:  rgb(253, 246, 167); border-radius: 10px; border: none; height: 30px; width: 40px; font-weight: bold;">₦${tot.toLocaleString().replace("-", "")}</small></span></div>`
}

function loading(background, width, height, color) {
    let disp = ""
    for(let i = 0; i < 2; i++) {
     disp += `<div style="width: ${width}; height: ${height}; background: ${color}"><span class="big-one"><span></span></span><span class="small-one"><span></span></span></div>`
    }
    document.getElementById(background).innerHTML = disp;
}

function dudu() {
    view("edit-nam")
    document.getElementById("cus-ed-text").value = pers;
}

async function updatePes() {
   const getse = sessionStorage.getItem("token")
            const tot = document.getElementById("cus-ed-text").value
           try {
            on()
        const fish = await fetch(`https://shopdb-rb5i.onrender.com/updNam`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": getse,
            },
            body: JSON.stringify({
                "user": users,
                "name": tot,
                "former": pers,
            })
        })
        const reste = await fish.json();
        if(reste.err){
            off()
            return msgBox(reste.err, "fail")
        } 
        await loadData()
    loadBack()
    off()
       return msgBox(reste.message, "success")
    } catch(err) {
    if(err.toString().toLowerCase().includes("failed to fetch")) {
        msgBox("We can't connect to our servers. Please check your internet connection.", "fail")
    } else if(err.toString().toLowerCase().includes("undefined")) {
        msgBox("Success", "success")
        loadBack()
    }else {
msgBox("An error occured. Please try again.", "fail")
    } 
     off()
    }   
}
