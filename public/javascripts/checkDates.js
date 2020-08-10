console.log("Check dates");

var interviewDate = null;
var computerDate = null;
var currentComputerDate = null;
var api_id = null;

api_id = document.querySelector("#api_id").value;
const iDate = document.querySelector("#interview_date");
const aDate = document.querySelector("#application_date");
const fDate = document.querySelector("#follow_date");
const contact_person = document.querySelector("#contact_person");
const remarks = document.querySelector("#remark");
const gj_submit_button = document.querySelector("#gj-submit-button");
const error = document.querySelector(".error");

const dateValidation = {
    intDate: {
        valid: true,
        msg: "This is true",
    },
};

// GJ: Not doing any validation. We are simply obtaining the value fro teh input field from edit.ejs and passing it as PARAM to axios futher down below.
// const contactPersonValidation = {
//     contactPerson: {
//         valid: false,
//         msg: "No Contact person listed. Put N/a instead",
//     },
// };

// const validateContactPerson = value => {

//     console.log(`Contact Person is: ${value}`);
//     return {valid: true, msg = ""}

// }

const validateDate = (value) => {
    console.log(`The value is: ${value}`);
    interviewDate = Number(value.split("-").join(""));
    console.log(typeof interviewDate, interviewDate);

    // now obtain the current date from computer
    var computerDate = new Date();
    var currentComputerDate = Number(
        computerDate.toISOString().slice(0, 10).split("-").join("")
    );
    console.log(typeof currentComputerDate, currentComputerDate);
    debugger;
    if (interviewDate < currentComputerDate) {
        console.log("Date not allowed");
        return {
            valid: false,
            msg: "Interview Date must be be today or greater",
        };
    } else {
        console.log("date is allowed");
        return { valid: true, msg: "" };
    }
};

// const handleContactPersonChange = e => {

//     error.textContent = "";
//     contact_person.textContent = e.target.value;
//     contactPersonValidation.contactPerson = validateDate(e.target.value);
//     console.log(e.target.value)

// }

const handleDateChange = (e) => {
    error.textContent = "";
    iDate.textContent = e.target.value;
    dateValidation.intDate = validateDate(e.target.value);
    console.log(`In change: ${e.target.value}`);
};

const handleSubmit = (e) => {
    error.textContent = "";

    console.log("WEA RE IN TEH HANDLE SUBMIT FUNCTION");


    dateValidation.intDate = validateDate(document.querySelector("#interview_date").value);
    let { intDate } = dateValidation;
    if (!intDate.valid) {
        console.log(intDate.msg);
        error.textContent = intDate.msg;
        e.preventDefault();
    } else {
        let params = {
            intDate: iDate.value,
            // api_id: api_id,
            contactPerson: contact_person.value,
            remarks: remarks.value,
            applicationDate: aDate.value,
            followUpDate: fDate.value,
        };
        console.log("validation passed = ", params);
        var url = "/appliedJobs/" + api_id;
        console.log(url);
        // axios.post(url, params).then((res) => {
        //     console.log(res);
        //     document.body.innerHTML = res.data;
        // });

    }
};

// contact_person.addEventListener("change", handleContactPersonChange)
iDate.addEventListener("change", handleDateChange);
gj_submit_button.addEventListener("click", handleSubmit);
