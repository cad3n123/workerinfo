let workerList = JSON.parse(localStorage.getItem("workerList"));
if (workerList == null) {
    workerList = [];
    localStorage.setItem("workerList", JSON.stringify(workerList));
}
let jobList = JSON.parse(localStorage.getItem("jobList"));
if (jobList == null) {
  jobList = [];
    localStorage.setItem("jobList", JSON.stringify(jobList));
}

const mainDiv = document.getElementById("main");
let workerSelect = document.getElementById("worker-select");
let workerJobDropdownDiv = document.getElementById("worker-job-dropdown-div");
let workerInfo = document.getElementById("worker-info");
let activeWorker;
let activeWorkerJob;
let workerJobDropdown;

window.onload = refreshPage;

function refreshPage() {
    updateWorkerSelect();
    updateWorkerDropdown();
}

function updateWorkerSelect() {
    workerList = JSON.parse(localStorage.getItem("workerList"));

    //Delect everything inside Worker Select
    deleteAllChildren(workerSelect);

    //Add things into worker select
    for (let workerIndex = 0; workerIndex < workerList.length; workerIndex++) {
        let workerName = workerList[workerIndex].firstName + " " + workerList[workerIndex].lastName;
    
        //Create Worker Checkbox
        let newWorkerInput = document.createElement("input");
        newWorkerInput.setAttribute("type", "radio");
        newWorkerInput.setAttribute("id", workerName);
        newWorkerInput.setAttribute("class", "worker-radio");
        newWorkerInput.setAttribute("name", "worker-radio-group");
        newWorkerInput.onclick = function() {
            activeWorker = workerList[workerIndex];
            updateWorkerDropdown();
            updateWorkerInfo();
        }
        newWorkerInput.value = workerName;
        
        let newWorkerLabel = document.createElement("label");
        newWorkerLabel.setAttribute("for", workerName);
        newWorkerLabel.innerHTML = workerName;
    
        workerSelect.appendChild(newWorkerInput);
        workerSelect.appendChild(newWorkerLabel);
        workerSelect.appendChild(document.createElement("br")); 
    }
}

function updateWorkerDropdown() {
    workerList = JSON.parse(localStorage.getItem("workerList"));
    jobList = JSON.parse(localStorage.getItem("jobList"));

    //Delect everything inside Worker Dropdown Div
    deleteAllChildren(workerJobDropdownDiv);

    //Create worker dropdown
    workerJobDropdown = document.createElement("select");
    workerJobDropdown.setAttribute("class", "worker-job-dropdown");
    workerJobDropdown.onclick = function() {
        if (activeWorker != undefined) {
            updateWorkerInfo();
        }
    }

    //If worker is selected
    if (activeWorker != undefined)  {
        //Add default job to dropdown
        for (let jobIndex = 0; jobIndex < jobList.length; jobIndex++) {
            job = jobList[jobIndex];
            if (job.name == activeWorker.defaultJob) {
            const workerJobDropdownOption = document.createElement("option");
            workerJobDropdownOption.innerHTML = job.name;
            workerJobDropdownOption.setAttribute("class", "worker-job-dropdown-option");
            workerJobDropdown.appendChild(workerJobDropdownOption);
            }
        }

        //Add jobs not including default job
        for (let jobIndex = 0; jobIndex < jobList.length; jobIndex++) {
            job = jobList[jobIndex];
            if (job.name != activeWorker.defaultJob) {
            const workerJobDropdownOption = document.createElement("option");
                workerJobDropdownOption.innerHTML = job.name;
                workerJobDropdownOption.setAttribute("class", "worker-job-dropdown-option");
                workerJobDropdown.appendChild(workerJobDropdownOption);
            }
        }
        workerJobDropdownDiv.appendChild(workerJobDropdown);
    } else {
        //If worker isn't selected
        //Add jobs
        for (let jobIndex = 0; jobIndex < jobList.length; jobIndex++) {
            job = jobList[jobIndex];
            const workerJobDropdownOption = document.createElement("option");
            workerJobDropdownOption.innerHTML = job.name;
            workerJobDropdownOption.setAttribute("class", "worker-job-dropdown-option");
            workerJobDropdown.appendChild(workerJobDropdownOption);
        }
        workerJobDropdownDiv.appendChild(workerJobDropdown);
    }
    
}

function updateWorkerInfo() {
    workerList = JSON.parse(localStorage.getItem("workerList"));
    jobList = JSON.parse(localStorage.getItem("jobList"));

    //Delect everything inside Worker Dropdown Div
    deleteAllChildren(workerInfo);

    //Add Worker name
    workerNameTitle = document.createElement("h3");
    workerNameTitle.innerHTML = activeWorker.firstName + " " + activeWorker.lastName;
    workerInfo.appendChild(workerNameTitle);

    //Find worker job and job requirements
    for (let jobIndex = 0; jobIndex < activeWorker.jobInfo.length; jobIndex++) {
        if (activeWorker.jobInfo[jobIndex].name == workerJobDropdown.value) {
            activeWorkerJob = activeWorker.jobInfo[jobIndex];
            activeWorkerJobRequirements = activeWorkerJob.requirements;
        }
    }

    //Add worker job requirements
    console.log(activeWorker.firstName + "'s job requirements are");
    for (let key in activeWorkerJobRequirements) {
        console.log(key)
        let newJobRequirement = document.createElement("p");
        newJobRequirement.innerHTML = key;
        let newJobRequirementValue = document.createElement("p");
        newJobRequirementValue.innerHTML = activeWorkerJobRequirements[key];

        workerInfo.appendChild(newJobRequirement);
        workerInfo.appendChild(newJobRequirementValue);
    }
}

function deleteAllChildren(parentElement) {
    let parentElementChildren = parentElement.childNodes;
    let parentElementChildrenLength = parentElementChildren.length;
    for (let index = 0; index < parentElementChildrenLength; index++) {
        parentElementChildren[0].remove();
    }
}

window.onmessage = function(event){
    if (event.data.name == 'updateWorkers') {  //Update Workers when parent frame updates workers
    workerList = JSON.parse(localStorage.getItem("workerList"));
    refreshPage();
  } else if (event.data.name == 'updateWorkerJobs') {  //Update Worker Jobs when parent frame updates worker jobs
    workerList = JSON.parse(localStorage.getItem("workerList"));
    jobList = JSON.parse(localStorage.getItem("workerList"));
    refreshPage();
}
}