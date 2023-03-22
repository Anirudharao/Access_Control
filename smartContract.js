const NodeCouchDb = require('node-couchdb');
const {
    performance,
    PerformanceObserver
} = require('node:perf_hooks');

var DoctorID = "D002";

var PatientID = "P001";

var insertPatientDB = false;

var updatePatientDB = false;

const couch = new NodeCouchDb({
    auth: {
        user: 'username_here',
        pass: 'password_here'
    }
});

const doctorDB = "doctors";
const viewUrlDoctor = "_design/all_doctors/_view/all";

const patientDB = "patients";
const viewUrlPatient = "_design/all_patients/_view/all";

function functionUpdatePatientDB(){
    couch.update("patients", {
        _id: "58158ebbce9a36f3d05aff754d025d7c",
        _rev: "3-b2629c6c5cbcd94d0e70c3b1b8e5b57a",
        patientID: "P002",
        patientName: "Tanner",
        device_MAC_Address: "2C:54:91:88:C9:E3",
        device: "Apple smartwatch series 7",
        bloodPressure: "102",
        heartrate: "85",
        orthoDetails: "Left leg fracture",
        psychiatryDetails: "Insomnia"
    }).then(({data, headers, status}) => {
        console.log(data);
    }, err => {
        console.log("Some error");
    })
}

function functionInsertPatientDB(){
    couch.uniqid().then(ids => {
        const id = ids[0];
        
        couch.insert("patients", {
            _id: id,
            patientID: "P003",
            patientName: "Mike",
            device_MAC_Address: "2C:44:81:26:C1:E3",
            device: "Samsung Smartwatch series 7",
            bloodPressure: "108",
            heartrate: "78",
            orthoDetails: "Club foot",
            psychiatryDetails: "Anxiety Disorder"
        }).then(({data, headers, status}) => {
            console.log(data);
        }, err => {
            console.log("Some error");
        });
    })
}

function verifyDoctorAndPrint() {
    couch.get(doctorDB, viewUrlDoctor).then(
        function (data, headers, status) {
            let outputArray = data.data.rows;
            outputArray.forEach(element => {
                if (element.value.doctorID === DoctorID && element.value.role == "Orthopedician") {

                    function checkPatientDB() {
                        couch.get(patientDB, viewUrlPatient).then(
                            function (data, headers, status) {
                                let patientArray = data.data.rows;
                                patientArray.forEach(patient => {
                                    if (patient.value.patientID === PatientID) {
                                        console.log("Patient ID: " + patient.value.patientID);
                                        console.log("Patient Name: " + patient.value.patientName);
                                        console.log("Device: " + patient.value.device);
                                        console.log("Device MAC Address: " + patient.value.device_MAC_Address);
                                        console.log("BP: " + patient.value.bloodPressure);
                                        console.log("Heartrate: " + patient.value.heartrate);
                                        console.log("Orthodetails: " + patient.value.orhtoDetails);
                                    }

                                })
                            }
                        )
                    }
                    checkPatientDB();

                } else if (element.value.doctorID === DoctorID && element.value.role == "Psychiatrist") {
                    function checkPatientDB() {

                        couch.get(patientDB, viewUrlPatient).then(
                            function (data, headers, status) {
                                let patientArray = data.data.rows;
                                patientArray.forEach(patient => {
                                    if (patient.value.patientID === PatientID) {
                                        console.log("Patient ID: " + patient.value.patientID);
                                        console.log("Patient Name: " + patient.value.patientName);
                                        console.log("Device: " + patient.value.device);
                                        console.log("Device MAC Address: " + patient.value.device_MAC_Address);
                                        console.log("BP: " + patient.value.bloodPressure);
                                        console.log("Heartrate: " + patient.value.heartrate);
                                        console.log("Psychiatry Details: " + patient.value.psychiatryDetails);
                                    }

                                })
                            }
                        )
                    }
                    checkPatientDB();
                }

            });
        },
        function (err) {
            console.log(err);
        });

}

verifyDoctorAndPrint();

if(insertPatientDB){
    const wrapped = performance.timerify(functionInsertPatientDB);

    const obs = new PerformanceObserver((list) => {
        console.log("Inserting patient into the database");
        console.log(list.getEntries()[0].duration);

        performance.clearMarks();
        performance.clearMeasures();
        obs.disconnect();
    });
    obs.observe({ entryTypes: ['function'] });


    wrapped();
}
