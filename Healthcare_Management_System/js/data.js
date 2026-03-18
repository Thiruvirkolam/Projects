let doctors = JSON.parse(localStorage.getItem("doctors")) || []
let patients = JSON.parse(localStorage.getItem("patients")) || []
let appointments = JSON.parse(localStorage.getItem("appointments")) || []

function saveData()
{
    localStorage.setItem("doctors", JSON.stringify(doctors))
    localStorage.setItem("patients", JSON.stringify(patients))
    localStorage.setItem("appointments", JSON.stringify(appointments))
}

function generateSequentialId(type)
{
    let key = type + "Count"
    let count = localStorage.getItem(key)

    if (!count)
    {
        count = 1
    }
    else
    {
        count = parseInt(count) + 1
    }

    localStorage.setItem(key, count)
    return type + count
}