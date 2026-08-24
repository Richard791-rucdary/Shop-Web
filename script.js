let users = ""
let pes = "";
let resd = [];

function view(content) {
    document.querySelectorAll('.hide').forEach(el => el.style.display = "none");
    if(!document.getElementById(content)) return view("homes")
    document.getElementById(content).style.display = "block";
}
   const get = localStorage.getItem('SHDB-name');
  
window.onload = () => {
     const params = new URLSearchParams(window.location.search).get("login")
      if(!get) return toSignup()
        if (params === "yes") return toLogin();
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
    if(!userInp.value || userInp.value.length !== 7) return msgBox("Input a seven digit username", "fail")
    if(!nameInp.value) return msgBox("Input a name", "fail")
    if(!passInp.value) return msgBox("Input a password", "fail")
    document.getElementById("btn1").innerHTML = "<span class='spin'>⌛</span>"
document.getElementById("btn1").disabled = true;
try {
   const fish = await fetch("https://shopdb-rb5i.onrender.com/signup", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
        "user":userInp.value,
        "name": nameInp.value,
        "password": passInp.value,
    })
   })
   const res = await fish.json()
   if(!res.message) {
     document.getElementById("btn1").innerHTML = "Sign up"
document.getElementById("btn1").disabled = false;
    return msgBox(res.err, "fail")
   }
   view("login")
    localStorage.setItem("SHDB-name", userInp.value);
     document.getElementById("btn1").innerHTML = "Sign up"
document.getElementById("btn1").disabled = false;
} catch(err) {
   if(err.toString().toLowerCase().includes("failed to fetch")) {
 msgBox("We can't connect to our servers. try connecting to a stronger Wifi network", "fail")
    } else {
msgBox("An error occured. Please try again.", "fail")
    }
       document.getElementById("btn1").innerHTML = "Sign up"
document.getElementById("btn1").disabled = false;
    
}
}

async function logIn() {
   const user = document.getElementById("username")
   const pass = document.getElementById("log-pass")
   if (!user.value) return msgBox("Invalid User name!", "fail")
    if (!pass.value) return msgBox("Enter a password", "fail")
        document.getElementById("btn2").innerHTML = '<span class="spin">⌛</span>'
document.getElementById("btn2").disabled = true;
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
     document.getElementById("btn2").innerHTML = "Log in"
document.getElementById("btn2").disabled = false;
    return msgBox(res.err, "fail")
   } 
    sessionStorage.setItem("token", res.token)
     localStorage.setItem("SHDB-name", user.value);
     localStorage.setItem("pesinName", res.realName);
    users = user.value
     loadBack()
}catch(err) {
    if(err.toString().toLowerCase().includes("failed to fetch")) {
 msgBox("We can't connect to our servers. try connecting to a stronger Wifi network", "fail")
    } else {
msgBox("An error occured. Please try again.", "fail")
    }
   document.getElementById("btn2").innerHTML = "Log in"
document.getElementById("btn2").disabled = false;
   }
}

function loadBack() {
   ert = loadData();
return view("home")
}

function calc() {
    const inp = document.getElementById("text-inpt");
    const dis = document.getElementById("num-inp");
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
    const get = sessionStorage.getItem("token");
    let disp = "";
    
document.getElementById("debtors").innerHTML = `<h1 class="spin">⌛</h1>`
 try {
      const fish = await fetch(`https://shopdb-rb5i.onrender.com/load`, {
        method: "POST",
        headers : {"Content-Type": "application/json"},
        body: JSON.stringify({
            "name": users,
            "token": get,
        })
      })
   let rest = await fish.json() 
   if(rest.err) {
     return msgBox(rest.err, "fail")
     return false
   }
   res = rest;
   localStorage.setItem("test", res);
   if(res.message === null) {
   return document.getElementById("debtors").innerHTML = `<h1 style="color:grey;">No Records</h1>`
   }
   resd.length = 0;
   res.message.forEach(dis => {
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
    resd.forEach(val => {
    disp+= `<div onclick="viewRecords('${val[0]}')"><span><b>${val[0]}</b></span></div>`
  })
  document.getElementById("debtors").innerHTML = disp
  document.getElementById("name-dis").innerHTML = `Hello ${users}`;
  return true
} catch(err){
     if(err.toString().toLowerCase().includes("failed to fetch")) {
  document.getElementById("debtors").innerHTML="<br><b><h2>Poor internet connection!</h2>We can't connect to our servers. try connecting to a stronger Wifi network</b><br><br><button onclick='loadData()'>Retry</button><br><br>"
  } else {
 document.getElementById("debtors").innerHTML = "There was an error while carrying out your request! Please try again.<br><br><button onclick='loadData()'>Retry</button><br><br>"
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
                document.getElementById("btn3").innerHTML = '<span class="spin">⌛</span>'
                 document.getElementById("btn3").disabled = true
     try {
          const fish = await fetch(`https://shopdb-rb5i.onrender.com/save?token=${get}`, {
        method: "POST",
        headers : {"Content-Type": "application/json"},
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
    document.getElementById("btn3").innerHTML = 'Add'
      document.getElementById("btn3").disabled = false
     return msgBox(rest.err, "fail")
   }
   msgBox(rest.message, "success");
    document.getElementById("btn3").innerHTML = 'Add'
      document.getElementById("btn3").disabled = false
      if (rest.message) {
        document.querySelectorAll("#reg-page input,#reg-page textarea").forEach(disp => {
        disp.value = "";
      });
    }
     } catch(err) {
       if(err.toString().toLowerCase().includes("failed to fetch")) {
 msgBox("We can't connect to our servers. try connecting to a stronger Wifi network", "fail")
    } else {
msgBox("An error occured. Please try again.", "fail")
    }
          document.getElementById("btn3").innerHTML = 'Add'
            document.getElementById("btn3").disabled = false
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
        }, 1000)
    }, 2000)
    }, 1000)
}

function viewRecords(val) {
    let read = [];
    let dise = "";
    let dates = ""
    pes = val;
    if (!res.message || res.message.length === 0) return 0
    res.message.forEach(dis => {
        if(dis.name === val) {
            read.push({rec: dis.record, bal: dis.owed, date: dis.date, id: dis.id, time: dis.actDate})
        }
    })
    view("dis-page")
    document.getElementById("head").innerText = val;
    read.forEach(dis => {
  if(dis.date !== dates) {
    dates = dis.date;
    dise += `<div class="date-dis">${dates}</div><br>`
  }
  if(read.length === 0) {
    return loadBack();
  }
  ert = dis.rec.replace(/#+/g,"NGN").replace(/\$+/g,"NGN");
  vat = ert.match(/\d+\&\d+/g)
  if(vat) {
vat.forEach(dis => {
    ert = ert.replace(dis, "NGN"+eval(dis.replace("&", "*")))
})
  }
dise += `<div class="recs" oncontextmenu="des('${dis.id}', true)" tabindex="0" id="${dis.id}">${ert}<br><br><b>Total</b>: NGN${dis.bal}<br><br><div class="time-dispe">${dis.time}</div></div><br><br>`
    })
    document.getElementById("rec-dis").innerHTML = dise;
    document.getElementById(read[read.length - 1].id).focus()
}

let thing = false
async function del(val) {
   const get = sessionStorage.getItem("token")
   if (thing === false) return
    let con = confirm("are u sure u want to delete this record?")
    if(con) {
        try {
        const fish = await fetch(`https://shopdb-rb5i.onrender.com/del`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "id": val,
                "token": get,
                "name": users,
            })
        })
        const reste = await fish.json();
        if(reste.err) return msgBox(reste.err, "fail")
           let ert = await loadData()
            if(res.message === null) loadBack()
        viewRecords(pes)
       return msgBox(reste.message, "success")
       thing = false;
    } catch(err) {
        thing = false;
    if(err.toString().toLowerCase().includes("failed to fetch")) {
 msgBox("We can't connect to our servers. try connecting to a stronger Wifi network", "fail")
    } else if(err.toString().toLowerCase().includes("undefined")) {
        msgBox("Success", "success")
        loadBack()
    }else {
msgBox("An error occured. Please try again.", "fail")
    } 
    } finally {
        thing = false
    }

}
        thing = false
}

function addToUser() {
    createNew()
    document.getElementById("inp-cus").value = pes;
    document.getElementById("text-inpt").focus()
}

function des(dis, bool) {
    setTimeout(() => {
    thing = bool
    del(dis);
    }, 700)
    }
    function check() {
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
 disp+= `<div onclick="viewRecords('${ins}')"><span><b><b style="color: var(--bright); font-size: 20px;">${val}</b>${ins.toLowerCase().replace(val.toLowerCase(), "")}</b></span></div>`

        })
        disp = disp === "" ? "<h1 style=\"color:grey;\">No Match</h1>": disp;
        document.getElementById("debtors").innerHTML = disp;
    }
