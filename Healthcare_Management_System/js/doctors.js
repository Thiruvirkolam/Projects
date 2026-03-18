const specializations = [
    "Cardiologist",
    "Dentist",
    "Pediatrician",
    "Orthopedic",
    "Dermatologist",
    "Neurologist",
    "Psychiatrist",
    "General Physician"
]

let editDoctorId = null

$(document).ready(function () {
    loadSpecializations()
    renderDoctors()

    $("#saveDoctor").click(function () {
        saveDoctor()
    })
})

function renderDoctors() {
    let table = $("#doctorTable")
    table.empty()

    doctors.forEach(function (d) {
        let row = `
        <tr>
            <td>${d.id}</td>
            <td>${d.name}</td>
            <td>${d.specialization}</td>
            <td>${d.slot}</td>
            <td>
                <button class="btn btn-warning btn-sm"
                        onclick="editDoctor('${d.id}')">
                    Edit
                </button>

                <button class="btn btn-danger btn-sm"
                        onclick="deleteDoctor('${d.id}')">
                    Delete
                </button>
            </td>
        </tr>
        `
        table.append(row)
    })
}

function saveDoctor() {
    let name = $("#docName").val().trim()
    let specialization = $("#specialization").val()
    let slot = $("#slot").val()

    if (name === "") {
        alert("Doctor name required")
        return
    }

    if (specialization === "") {
        alert("Please select specialization")
        return
    }

    if (slot === "") {
        alert("Please select available time")
        return
    }

    if (editDoctorId === null) {
        let doctor = {
            id: generateSequentialId("D"),
            name: name,
            specialization: specialization,
            slot: slot
        }

        doctors.push(doctor)

    } else {
        let doctor = doctors.find(function (d) {
            return d.id === editDoctorId
        })

        doctor.name = name
        doctor.specialization = specialization
        doctor.slot = slot

        editDoctorId = null
    }

    saveData()
    renderDoctors()
    clearDoctorForm()
    let modal = bootstrap.Modal.getInstance(document.getElementById("doctorModal"))
    modal.hide()
    alert("Doctor saved successfully")
}

function editDoctor(id) {
    let doctor = doctors.find(function (d) {
        return d.id === id
    })

    $("#docName").val(doctor.name)
    $("#specialization").val(doctor.specialization)
    $("#slot").val(doctor.slot)
    editDoctorId = id
    let modal = new bootstrap.Modal(document.getElementById("doctorModal"))
    modal.show()
}

function deleteDoctor(id) {
    if (!confirm("Are you sure you want to delete this doctor?")) {
        return
    }

    doctors = doctors.filter(function (d) {
        return d.id !== id
    })

    saveData()
    renderDoctors()
}

function clearDoctorForm() {
    $("#docName").val("")
    $("#specialization").val("")
    $("#slot").val("")
}

function loadSpecializations() {
    let dropdown = $("#specialization")
    dropdown.empty()
    dropdown.append(`<option value="">Select Specialization</option>`)
    specializations.forEach(function (s) {
        dropdown.append(`<option value="${s}">${s}</option>`)
    })
}