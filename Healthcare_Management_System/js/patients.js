let editPatientId = null

$(document).ready(function ()
{
    renderPatients()

    $("#savePatient").click(function ()
    {
        savePatient()
    })

    $("#searchPatient").keyup(function ()
    {
        searchPatient()
    })
})

function renderPatients() {
    let table = $("#patientTable");
    table.empty();

    patients.forEach(function (p) {
        let row = `
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.age}</td>
            <td>${p.gender}</td>
            <td>${p.phone}</td>
            <td>${p.email}</td>
            <td>${p.notes}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editPatient('${p.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deletePatient('${p.id}')">Delete</button>
            </td>
        </tr>
        `;
        table.append(row);
    });
}

function savePatient()
{
    let name = $("#name").val()
    let age = $("#age").val()
    let gender = $("#gender").val()
    let phone = $("#phone").val()
    let email = $("#email").val()
    let notes = $("#notes").val()

    if (name === "")
    {
        alert("Name is required")
        return
    }

    if (gender === "")
    {
    alert("Please select gender")
    return
    }

    if (phone.length !== 10)
    {
        alert("Phone must be 10 digits")
        return
    }

    if (!email.includes("@"))
    {
        alert("Invalid email")
        return
    }

    if (editPatientId === null)
    {
        let patient =
        {
            id: generateSequentialId("P"),
            name: name,
            age: age,
            gender: gender,
            phone: phone,
            email: email,
            notes: notes
        }

        patients.push(patient)
    }
    
    else
    {
        let patient = patients.find(function (p)
        {
            return p.id === editPatientId
        })

        patient.name = name
        patient.age = age
        patient.gender = gender
        patient.phone = phone
        patient.email = email
        patient.notes = notes

        editPatientId = null
    }

    saveData()
    renderPatients()
    clearForm()
    let modal = bootstrap.Modal.getInstance(document.getElementById("patientModal"))
    modal.hide()
    alert("Patient saved successfully")
}

function editPatient(id)
{
    let patient = patients.find(function (p)
    {
        return p.id === id
    })

    $("#name").val(patient.name)
    $("#age").val(patient.age)
    $("#gender").val(patient.gender)
    $("#phone").val(patient.phone)
    $("#email").val(patient.email)
    $("#notes").val(patient.notes)

    editPatientId = id
    let modal = new bootstrap.Modal(document.getElementById("patientModal"))
    modal.show()
}

function deletePatient(id)
{
    if (!confirm("Are you sure you want to delete this patient?"))
    {
        return
    }

    patients = patients.filter(function (p)
    {
        return p.id !== id
    })

    saveData()
    renderPatients()
}

function searchPatient() {
    let text = $("#searchPatient").val().toLowerCase();
    let filtered = patients.filter(function (p) {
        return p.name.toLowerCase().includes(text) || p.phone.includes(text);
    });

    let table = $("#patientTable");
    table.empty();

    filtered.forEach(function (p) {
        let row = `
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.age}</td>
            <td>${p.gender}</td>
            <td>${p.phone}</td>
            <td>${p.email}</td>
            <td>${p.notes}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editPatient('${p.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deletePatient('${p.id}')">Delete</button>
            </td>
        </tr>
        `;
        table.append(row);
    });
}

function clearForm()
{
    $("#name").val("")
    $("#age").val("")
    $("#gender").val("")
    $("#phone").val("")
    $("#email").val("")
    $("#notes").val("")
}