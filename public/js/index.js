const button = document.getElementById("clickMe");
const formm = document.getElementById("postReq");
// const fname=document.getElementById('fname')
// fname.innerHTML='Manja'
// const Register = require('.../src/models/registers')


formm.addEventListener("click", async(e) => {
    e.preventDefault();
    const email = document.getElementById("email1");
    console.log(email.value)
    const namee = document.getElementById("name1");
    const que = document.getElementById("subject1");

    const requ = {
        email: email.value,
        namee: namee.value,
        que: que.value
    };
    const response = await fetch("/formm", {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
        },
          body: JSON.stringify(requ)
    });
    console.log(response)

});