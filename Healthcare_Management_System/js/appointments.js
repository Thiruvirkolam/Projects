$(document).ready(function ()
{
    loadPatients()
    loadDoctors()
    renderAppointments()
    setMinDate()

    $("#bookAppointment").click(function ()
    {
        bookAppointment()
    })

    $("#filterDate, #filterStatus").change(function ()
    {
        filterAppointments()
    })

    $("#doctor").change(function ()
    {
        generateTimeSlots()
    })
})

function setMinDate()
{
    let today = new Date().toISOString().split("T")[0]
    $("#date").attr("min", today)
}

function loadPatients()
{
    let patients = JSON.parse(localStorage.getItem("patients")) || []
    let dropdown = $("#patient")
    dropdown.empty()
    dropdown.append(`<option value="">Select Patient</option>`)

    patients.forEach(function (p)
    {
        dropdown.append(`<option value="${p.id}">${p.name}</option>`)
    })
}

function loadDoctors()
{
    let doctors = JSON.parse(localStorage.getItem("doctors")) || []
    let dropdown = $("#doctor")
    dropdown.empty()
    dropdown.append(`<option value="">Select Doctor</option>`)

    doctors.forEach(function (d)
    {
        dropdown.append(`<option value="${d.id}">${d.name}</option>`)
    })
}

function generateId(prefix)
{
    return prefix + Math.floor(Math.random() * 100000)
}

function generateTimeSlots()
{
    let doctorName = $("#doctor").val()
    let doctors = JSON.parse(localStorage.getItem("doctors")) || []
    let doctor = doctors.find(function (d)
    {
        return d.id === doctorName
    })

    let dropdown = $("#time")
    dropdown.empty()
    dropdown.append(`<option value="">Select Time Slot</option>`)

    if (!doctor)
    {
        return
    }

    let slot = doctor.slot.split("-")
    let start = slot[0].trim()
    let end = slot[1].trim()
    let current = convertToMinutes(start)
    let endTime = convertToMinutes(end)

    while (current + 30 <= endTime)
    {
        let next = current + 30

        let timeSlot =
            formatTime(current) + " - " + formatTime(next)

        dropdown.append(`<option>${timeSlot}</option>`)

        current = next
    }
}

function convertToMinutes(time)
{
    let parts = time.split(":")
    let hours = parseInt(parts[0])
    let minutes = parseInt(parts[1])

    if (hours < 9) 
    {
        hours += 12
    }

    return hours * 60 + minutes
}

function formatTime(minutes)
{
    let h = Math.floor(minutes / 60)
    let m = minutes % 60
    let displayH = h

    if (h > 12) displayH = h - 12

    let hh = displayH.toString().padStart(2, '0')
    let mm = m.toString().padStart(2, '0')

    return hh + ":" + mm
}

function bookAppointment()
{
    let patient = $("#patient").val()
    let doctor = $("#doctor").val()
    let date = $("#date").val()
    let time = $("#time").val()
    let status = "Booked"

    if (!patient || !doctor || !date || !time)
    {
        alert("Please fill all fields")
        return
    }

    let conflict = appointments.some(function (a)
    {
        return a.doctor === doctor && a.date === date && a.time === time
    })

    if (conflict)
    {
        alert("Doctor already booked for this time slot")
        return
    }

    let patientName = getPatientName(patient)
    let doctorName = getDoctorName(doctor)
    let appointment =
    {
        id: generateSequentialId("A"),
        patient: patientName,
        doctor: doctorName,
        date: date,
        time: time,
        status: status
    }

    appointments.push(appointment)

    saveData()
    renderAppointments()
    let modal = bootstrap.Modal.getInstance(document.getElementById("appointmentModal"))
    modal.hide()
}

function renderAppointments(list = appointments)
{
    let tbody = $("#appointmentTable tbody")
    tbody.empty()

    list.forEach(function (a)
    {
        let actionButtons = ""

        if (a.status === "Booked")
        {
            actionButtons = `
                <button class="btn btn-success btn-sm me-1"
                    onclick="completeAppointment('${a.id}')">
                    Complete
                </button>

                <button class="btn btn-danger btn-sm"
                    onclick="cancelAppointment('${a.id}')">
                    Cancel
                </button>
            `
        }
        else
        {
            actionButtons = `<span class="text-muted">No Actions</span>`
        }

        tbody.append(`
            <tr>
                <td>${a.id}</td>
                <td>${a.patient}</td>
                <td>${a.doctor}</td>
                <td>${a.date}</td>
                <td>${a.time}</td>
                <td>${getStatusBadge(a.status)}</td>
                <td>${actionButtons}</td>
            </tr>
        `)
    })
}

function getStatusBadge(status)
{
    if (status === "Booked")
    {
        return `<span class="badge bg-primary">Booked</span>`
    }

    if (status === "Completed")
    {
        return `<span class="badge bg-success">Completed</span>`
    }

    if (status === "Cancelled")
    {
        return `<span class="badge bg-danger">Cancelled</span>`
    }
}

function completeAppointment(id)
{
    let appointment = appointments.find(function (a)
    {
        return a.id === id
    })

    appointment.status = "Completed"

    saveData()
    renderAppointments()
}

function cancelAppointment(id)
{
    let appointment = appointments.find(function (a)
    {
        return a.id === id
    })

    appointment.status = "Cancelled"

    saveData()
    renderAppointments()
}

function filterAppointments()
{
    let date = $("#filterDate").val()
    let status = $("#filterStatus").val()
    let filtered = appointments.filter(function (a)
    {
        return (
            (date === "" || a.date === date) &&
            (status === "" || a.status === status)
        )
    })

    renderAppointments(filtered)
}
