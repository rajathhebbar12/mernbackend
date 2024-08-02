document.addEventListener('DOMContentLoaded',(async()=> {
    const response = await fetch("/Users");
    console.log(response);
    if(response.ok) {   
        const bund = document.getElementById("bund");
        const allUsers = await response.json();
        console.log(allUsers)

        const Users = allUsers.map((user, index) => {
           return `<tr>
                <td>${index + 1}</td>
                <td>${user.firstname +" "+ user.lastname}</td>
                <td>${user.age}</td>
                <td>${user.dob}</td>
                <td>${user.gender}</td>
                <td>${user.email}</td>
            </tr>`
        }).join("");
        bund.innerHTML = Users;
    }
    else console.log("HIIIIIIII");
})()
)