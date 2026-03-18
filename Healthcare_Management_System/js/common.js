function getPatientName(id)
{
    let p =
        patients.find(function (x)
        {
            return x.id === id
        })

    return p ? p.name : ""
}

function getDoctorName(id)
{
    let d =
        doctors.find(function (x)
        {
            return x.id === id
        })

    return d ? d.name : ""
}