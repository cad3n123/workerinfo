let workerList = JSON.parse(localStorage.getItem("workerList"));
if (workerList == null || workerList == "") {
    workerList = [];
    localStorage.setItem("workerList", JSON.stringify(workerList));
}
let jobList = JSON.parse(localStorage.getItem("jobList"))
if (jobList == null || jobList == "") {
  jobList = [];
  localStorage.setItem("jobList", JSON.stringify(jobList));
}

let jobs2Frame = document.getElementById("jobs2");
let jobsFrame = document.getElementById("jobs");
let workersFrame = document.getElementById("workers");
let inputInfoFrame = document.getElementById("input-info");
let workerInfoFrame = document.getElementById("worker-info");

let main = document.getElementById("main");

let workerPopUp = document.getElementById("worker-pop-up");
let workerPopUpTitle = document.getElementById("worker-pop-up-title");
let workerPopUpWorker;
let workerPopUpWorkerIndex;
let firstNameInput = document.getElementById('first-name');
let lastNameInput = document.getElementById('last-name');
let defaultJob = document.getElementById("default-job");
let defaultJobLocation = document.getElementById("default-job-location");

let jobPopUp = document.getElementById("job-pop-up");
let jobPopUpTitle = document.getElementById("job-pop-up-title");
let nameInput = document.getElementById('name');
let jobPopUpJob;
let jobPopUpJobIndex;

let jobRequirementPopUp = document.getElementById("add-job-requirement-pop-up");
let jobRequirementPopUpJob;
let jobRequirementPopUpJobIndex;
let jobRequirementPopUpJobRequirements;
let jobRequirementInput = document.getElementById("add-job-requirement");

let editJobRequirementPopUp = document.getElementById("edit-job-requirement-pop-up");
let editJobRequirementPopUpJob;
let editJobRequirementPopUpJobIndex;
let editJobRequirementPopUpJobRequirement;
let editJobRequirementInput = document.getElementById("edit-job-requirement");

jobRequirementPopUp.style.display = "none";
workerPopUp.style.display = "none";
jobPopUp.style.display = "none";
editJobRequirementPopUp.style.display = "none";

window.onmessage = function(event){
    if (event.data.name == 'openWorkerPopUp') { //Open Edit Pop Up when workers.js says to and get index from localStorage
        console.log("iframe told me to open edit pop up");
        workerList = JSON.parse(localStorage.getItem("workerList"));
        workerPopUp.style.display = "block";
        updateJobs();//Update worker edit job list

        workerPopUpWorkerIndex = event.data.editWorkerIndex;
        workerPopUpWorker = workerList[workerPopUpWorkerIndex];
        console.log("Worker pop up index: " + workerPopUpWorkerIndex);
        console.log("Worker pop up object: " + workerPopUpWorker);
        workerPopUpTitle.innerHTML = "Edit" + " " + workerPopUpWorker.firstName + " " + workerPopUpWorker.lastName;
        firstNameInput = document.getElementById('first-name');
        lastNameInput = document.getElementById('last-name');
        firstNameInput.value = workerPopUpWorker.firstName;
        lastNameInput.value = workerPopUpWorker.lastName;
        console.log("Worker pop up default job: " + workerPopUpWorker.defaultJob);
    } else if (event.data.name == 'closePopUp') { //Close Edit Pop Up when workers.js says to <---- Need to have job.js do this too!!!!!****
        console.log("iframe told me to close pop up");
        cancelPopUp();
    } else if (event.data.name == 'updateWorkerJobs') { //Tell workers.js, worker-input.js, and input-info.js to update jobs when jobs.html or input-info.js says to
        console.log("I am the parent frame carrying a message from jobs.js to workers.js");
        console.log("The message is: " + event.data);
        workersFrame.contentWindow.postMessage(event.data, "*");
        inputInfoFrame.contentWindow.postMessage(event.data, "*");
        workerInfoFrame.contentWindow.postMessage(event.data, "*");
    } else if (event.data.name == 'updateWorkers') { //Tell input-info.js, worker-input.js, and jobs.js to update workers when workers.js or input-info.js says to
        console.log("I am the parent frame carrying a message from workers.js to input-info.js");
        console.log("The message is: " + event.data);
        inputInfoFrame.contentWindow.postMessage(event.data, "*");
        jobsFrame.contentWindow.postMessage(event.data, "*");
        workerInfoFrame.contentWindow.postMessage(event.data, "*");
    } else if (event.data.name == 'openJobPopUp') { //Open Edit Pop Up when jobs.js says to and get index from localStorage
        console.log("iframe told me to open job pop up");
        jobList = JSON.parse(localStorage.getItem("jobList"));
        jobPopUp.style.display = "block";
        updateJobs();

        jobPopUpJobIndex = event.data.editJobIndex;
        jobPopUpJob = jobList[jobPopUpJobIndex];
        console.log("Job pop up index: " + jobPopUpJobIndex);
        console.log("Job pop up object: " + jobPopUpJob);
        jobPopUpTitle.innerHTML = "Edit" + " " + jobPopUpJob.name;
        nameInput = document.getElementById('name');
        nameInput.value = jobPopUpJob.name;
    } else if (event.data.name == "openJobRequirementPopUp") { //Open Job Requirement Pop Up when jobs.js says to and get index from localStorage
        console.log("iframe told me to open job requirement pop up");
        jobList = JSON.parse(localStorage.getItem("jobList"));
        jobRequirementPopUp.style.display = "block";

        jobRequirementPopUpJobIndex = event.data.addJobRequirementIndex;
        jobRequirementPopUpJob = jobList[jobRequirementPopUpJobIndex];
        jobRequirementPopUpJobRequirements = jobRequirementPopUpJob.requirements;
        console.log("Job Requirement pop up index: " + jobRequirementPopUpJobIndex);
        console.log("Job requirement pop up object name:  " + jobRequirementPopUpJob.name);
        console.log("Job requirement pop up object requirements:  ");
        for (let key in jobRequirementPopUpJobRequirements) {
            console.log(key);
        }
        jobRequirementInput = document.getElementById("add-job-requirement");
        jobRequirementInput.value = "";
    } else if (event.data.name == "openEditJobRequirementPopUp") { //Open Edit Job Requirement Pop Up when jobs.js says to and get index and requirement from localStorage
        console.log("iframe told me to open edit job requirement pop up");
        jobList = JSON.parse(localStorage.getItem("jobList"));
        editJobRequirementPopUp.style.display = "block";

        editJobRequirementPopUpJobIndex = event.data.editJobRequirementJobIndex;
        console.log("Edit job requirement job index from script.js: " + editJobRequirementPopUpJobIndex);
        editJobRequirementPopUpJob = jobList[editJobRequirementPopUpJobIndex];
        editJobRequirementPopUpJobRequirement = event.data.editJobRequirementRequirement;
        
        editJobRequirementInput = document.getElementById('edit-job-requirement');
        editJobRequirementInput.value = editJobRequirementPopUpJobRequirement;
    } else {
        console.log("Data that didn't find a home in script.js: " + event.data);
    }
};

function updateJobs() {
    jobList = JSON.parse(localStorage.getItem("jobList"));

    defaultJob = document.getElementById("default-job");
    if (defaultJob != null) {
      defaultJob.remove();
      }
    defaultJob = document.createElement("select")
    defaultJob.setAttribute("name", "defaultJob");
    defaultJob.setAttribute("id", "default-job");
    let defaultJobEmptyValue = document.createElement("option")
    defaultJobEmptyValue.setAttribute("selected", "selected");
    defaultJobEmptyValue.innerHTML = "Select job to change";
    defaultJob.appendChild(defaultJobEmptyValue);
  
    for (let index = 0; index < jobList.length; index++) {
      const newJob = document.createElement("option");
      const newJobName = jobList[index].name;
      newJob.value = newJobName;
      newJob.innerHTML = newJobName;
    
      defaultJob.appendChild(newJob);
    }
    defaultJobLocation.appendChild(defaultJob);
  }

//Close Pop Ups with escape key
document.body.addEventListener('keyup', function(e) {
    if (e.key == "Escape") {
        cancelPopUp();
    }
});

function cancelPopUp() {
    workerPopUp.style.display = "none";
    jobPopUp.style.display = "none";
    jobRequirementPopUp.style.display = "none";
    editJobRequirementPopUp.style.display = "none";
}

function saveWorkerPopUp() {
    workerPopUpWorker.firstName = firstNameInput.value;
    workerPopUpWorker.lastName = lastNameInput.value;
    jobList = JSON.parse(localStorage.getItem("jobList"));
    
    for (let jobIndex = 0; jobIndex < jobList.length; jobIndex++) {
        if (jobList[jobIndex].name == defaultJob.value ){
            workerPopUpWorker.defaultJob = jobList[jobIndex].name;
        }
    }

    console.log("New worker pop up default job: " + workerPopUpWorker.defaultJob);

    workerList[workerPopUpWorkerIndex] = workerPopUpWorker;
    localStorage.setItem("workerList", JSON.stringify(workerList))

    const data = {
        name: "updateWorkers",
    }

    workersFrame.contentWindow.postMessage(data, "*")

    workerPopUp.style.display = "none";
}

function saveJobPopUp() {
    jobList = JSON.parse(localStorage.getItem("jobList"));
    workerList = JSON.parse(localStorage.getItem("workerList"));

    //Change default job name if applicable in each worker
    for (let workerIndex = 0; workerIndex < workerList.length; workerIndex++) {
        if (workerList[workerIndex].defaultJob == jobPopUpJob.name) {
            workerList[workerIndex].defaultJob = nameInput.value;
        }
    }

    jobPopUpJob.name = nameInput.value;
    console.log("New job name: " + jobPopUpJob.name);

    //Save new job name in each work job info
    for (let workerIndex = 0; workerIndex < workerList.length; workerIndex++) {
        workerList[workerIndex].jobInfo[jobPopUpJobIndex].name = jobPopUpJob.name;
    }

    //Save new job name in job list
    jobList[jobPopUpJobIndex] = jobPopUpJob;

    localStorage.setItem("jobList", JSON.stringify(jobList));
    localStorage.setItem("workerList", JSON.stringify(workerList));

    setTimeout(() => {
        let dataOne = {
            name: "updateJobs",
        }
        let dataTwo = {
            name: "updateWorkerJobs",
        }
        jobsFrame.contentWindow.postMessage(dataOne, "*");
        jobs2Frame.contentWindow.postMessage(dataOne, "*");
        inputInfoFrame.contentWindow.postMessage(dataTwo, "*");
    }, 10);

    jobPopUp.style.display = "none";
}

function saveJobRequirementPopUp() {
    jobList = JSON.parse(localStorage.getItem("jobList"));
    workerList = JSON.parse(localStorage.getItem("workerList"));

    console.log("Saving new job requirement");
    let dontAddNewKey = false;
    for (let key in jobRequirementPopUpJobRequirements) {

        console.log(key);
        if (jobRequirementInput.value == key) {
            console.log(jobRequirementInput.value + " is " + key)
            dontAddNewKey = true;
        } else {
            console.log(jobRequirementInput.value + " isn't " + key)
        }
    }

    if (dontAddNewKey == false) {

        //Add new job requirement to job in worker info
        for (let workerIndex = 0; workerIndex < workerList.length; workerIndex++) {
            let worker = workerList[workerIndex];
            let workerJobInfo = worker.jobInfo;
            for (let jobIndex = 0; jobIndex < workerJobInfo.length; jobIndex++) {
                let workerJob = workerJobInfo[jobIndex];
                if (jobIndex == jobRequirementPopUpJobIndex) {
                    workerJob.requirements[jobRequirementInput.value] = 0;
                    workerJobInfo[jobIndex] = workerJob;
                }
            }
            worker.jobInfo = workerJobInfo;
            workerList[workerIndex]= worker;
        }

        //Add new job requirement to job in job list
        console.log("Adding " + jobRequirementInput.value + " to " + jobRequirementPopUpJob.name);
        jobRequirementPopUpJobRequirements[jobRequirementInput.value] = 0;
        console.log("New job requirement pop up requirements: " + jobRequirementPopUpJobRequirements);
        jobRequirementPopUpJob.requirements = jobRequirementPopUpJobRequirements;
        jobList[jobRequirementPopUpJobIndex] = jobRequirementPopUpJob;
        console.log("New job requirements");
            let job = jobList[0];
    
            for (key in job.requirements) {
                console.log(key);
            }
        
    }
    localStorage.setItem("jobList", JSON.stringify(jobList));
    localStorage.setItem("workerList", JSON.stringify(workerList));

    setTimeout(() => {
        const dataOne = {
            name: "updateJobs",
        }
        const dataTwo = {
            name: "updateWorkerJobs",
        }
        jobsFrame.contentWindow.postMessage(dataOne, "*");
        jobs2Frame.contentWindow.postMessage(dataOne, "*");
        inputInfoFrame.contentWindow.postMessage(dataTwo, "*");
    }, 10);

    jobRequirementPopUp.style.display = "none";
}


function saveEditJobRequirementPopUp() {
    jobList = JSON.parse(localStorage.getItem("jobList"))
    workerList = JSON.parse(localStorage.getItem("workerList"))

    //Edit job requirement name for job in each work's job info
    let newWorkerJobInfoRequirements = {};

    for (let workerIndex = 0; workerIndex < workerList.length; workerIndex++) {
        for (let key in workerList[workerIndex].jobInfo[editJobRequirementPopUpJobIndex].requirements) {
            if (key = editJobRequirementPopUpJobRequirement) {
                newWorkerJobInfoRequirements[editJobRequirementInput.value] = 0;
            } else {
                newWorkerJobInfoRequirements[key] = workerList[workerIndex].jobInfo[editJobRequirementPopUpJobIndex].requirements[key];
            }
        }
        workerList[workerIndex].jobInfo[editJobRequirementPopUpJobIndex].requirements = newWorkerJobInfoRequirements;
    }

    //Edit job requirement name for job in job list
    let editJobRequirementPopUpJobRequirements = editJobRequirementPopUpJob.requirements;
    let newEditJobRequirementPopUpJobRequirements = {};

    for (let key in editJobRequirementPopUpJobRequirements) {
        if (key == editJobRequirementPopUpJobRequirement) {
            newEditJobRequirementPopUpJobRequirements[editJobRequirementInput.value] = 0;
        } else {
            newEditJobRequirementPopUpJobRequirements[key] = 0;
        }
    }

    editJobRequirementPopUpJob.requirements = newEditJobRequirementPopUpJobRequirements;
    jobList[editJobRequirementPopUpJobIndex] = editJobRequirementPopUpJob;

    localStorage.setItem("jobList", JSON.stringify(jobList));
    localStorage.setItem("workerList", JSON.stringify(workerList));

    setTimeout(() => {
        const dataOne = {
            name: "updateJobs",
        }
        const dataTwo = {
            name: "updateWorkerJobs",
        }
        jobsFrame.contentWindow.postMessage(dataOne, "*");
        jobs2Frame.contentWindow.postMessage(dataOne, "*");
        inputInfoFrame.contentWindow.postMessage(dataTwo, "*");
    }, 10);
    
    editJobRequirementPopUp.style.display = "none";
}

function hideFrames() {
    workersFrame.setAttribute("hidden", "hidden");
    jobs2Frame.setAttribute("hidden", "hidden");
    jobsFrame.setAttribute("hidden", "hidden");
    inputInfoFrame.setAttribute("hidden", "hidden");
    workerInfoFrame.setAttribute("hidden", "hidden");
}

function activateWorkers() {
    hideFrames();
    workersFrame.removeAttribute("hidden");
}

function activateJobs() {
    hideFrames();
    jobsFrame.removeAttribute("hidden");
}

function activateJobs2() {
    hideFrames();
    jobs2Frame.removeAttribute("hidden");
}

function activateInputInfo() {
    hideFrames();
    inputInfoFrame.removeAttribute("hidden");
}

function activateWorkerInfo() {
    hideFrames();
    workerInfoFrame.removeAttribute("hidden");
}

let dict = {
    "Clean the floors": 0,
    "Wipe counters": 1
};