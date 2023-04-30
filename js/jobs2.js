let jobList = JSON.parse(localStorage.getItem("jobList"));
let workerList = JSON.parse(localStorage.getItem("workerList"));

class Job {
    constructor(name) {
      this.name = name;
      this.requirements = {};
    }
}

window.onload = refresh();

function refresh() {
    updateJobDisplay();
}

function addJob() {
    newJobName = document.getElementById("name");
    if (newJobName.value != "") {
        jobList = JSON.parse(localStorage.getItem("jobList"));
        workerList = JSON.parse(localStorage.getItem("workerList"));
        jobList.push(new Job(newJobName.value));

        newJobName.value = "";

        //Add job to each worker
        for (let workerIndex = 0; workerIndex < workerList.length; workerIndex++) {
            let worker = workerList[workerIndex];
            workerJobInfo = worker.jobInfo;
            workerJobInfo.push(jobList[-1]);
            worker.jobInfo = workerJobInfo;
            workerList[workerIndex] = worker;
        }

        localStorage.setItem("workerList", JSON.stringify(workerList));
        localStorage.setItem("jobList", JSON.stringify(jobList));

        setTimeout(() => {
            const data = {
                name: "updateWorkerJobs"
            }
            window.top.postMessage(data, "*");
            refresh();
        }, 10);
    }
}

function updateJobDisplay() {
    jobList = JSON.parse(localStorage.getItem("jobList"));

    jobDivs = document.getElementsByClassName("job-div");
    jobDivsLength = jobDivs.length;
    for (let index = 0; index < jobDivsLength; index++) {
        jobDivs[0].remove();
    }

    for (let jobIndex = 0; jobIndex < jobList.length; jobIndex++) {
        const job = jobList[jobIndex];
        
        jobDiv = document.createElement("div");
        jobDiv.setAttribute("class", "job-div");

        jobName = document.createElement("h2");
        jobName.innerHTML = job.name;

        jobDiv.appendChild(jobName)

        //Make a button list with add requirement, edit, and delete
        buttonList = document.createElement("ul");

        addRequirementButtonItem = document.createElement("li");
        addRequirementButton = document.createElement("button");
        addRequirementButton.setAttribute("class", "add-requirement-button");
        addRequirementButton.innerHTML = "Add Requirement";
        addRequirementButtonItem.appendChild(addRequirementButton);
        addRequirementButtonItem.onclick = function() {
            let data = {
                name: "openJobRequirementPopUp",
                addJobRequirementIndex: jobIndex
            }

            window.top.postMessage(data, "*");
        }

        editButtonItem = document.createElement("li");
        editButton = document.createElement("button");
        editButton.setAttribute("class", "edit-button");
        editButton.innerHTML = "Edit";
        editButtonItem.appendChild(editButton);
        editButton.onclick = function() {
            let data = {
                name: "openJobPopUp",
                editJobIndex: jobIndex
            }

            window.top.postMessage(data, "*");
        }

        deleteButtonItem = document.createElement("li");
        deleteButton = document.createElement("button");
        deleteButton.setAttribute("class", "delete-button");
        deleteButton.innerHTML = "Delete";
        deleteButtonItem.appendChild(deleteButton);
        deleteButton.onclick = function() {
            deleteJob(jobIndex);
        }

        buttonList.appendChild(addRequirementButtonItem);
        buttonList.appendChild(editButtonItem);
        buttonList.appendChild(deleteButtonItem);

        jobDiv.appendChild(buttonList);

        //Add Job Requirements
        jobRequirements = job.requirements;
        jobRequirementsGrid = document.createElement("div");
        jobRequirementsGrid.setAttribute("class", "job-requirements-grid");
        let requirementIndex = 0;
        for (let key in jobRequirements) {
            requirementName = document.createElement("p");
            requirementName.innerHTML = key;

            jobRequirementsGrid.appendChild(requirementName)

            //Make a button list with add requirement, edit, and delete
            buttonList = document.createElement("ul");

            editButtonItem = document.createElement("li");
            editButton = document.createElement("button");
            editButton.setAttribute("class", "edit-button");
            editButton.innerHTML = "Edit";
            editButtonItem.appendChild(editButton);
            editButton.onclick = function() { //Doesnt work, uses job index instead of requirement index************

                let data = {
                    name: "openEditJobRequirementPopUp",
                    editJobRequirementJobIndex: jobIndex,
                    editJobRequirementRequirement: key
                }
    
                window.top.postMessage(data, "*");
            }

            deleteButtonItem = document.createElement("li");
            deleteButton = document.createElement("button");
            deleteButton.setAttribute("class", "delete-button");
            deleteButton.innerHTML = "Delete";
            deleteButtonItem.appendChild(deleteButton);
            deleteButtonItem.onclick = function() {
                deleteRequirement(jobIndex, key);
            }

            buttonList.appendChild(editButtonItem);
            buttonList.appendChild(deleteButtonItem);

            jobRequirementsGrid.appendChild(buttonList)

            requirementIndex++;
        }

        jobDiv.appendChild(jobRequirementsGrid);


        document.body.appendChild(jobDiv);

    }


}

function deleteJob(jobIndex) {
    jobList = JSON.parse(localStorage.getItem("jobList"));
    workerList = JSON.parse(localStorage.getItem("workerList"));

    //Delete job in each worker
    for (let workerIndex = 0; workerIndex < workerList.length; workerIndex++) {
        const worker = workerList[workerIndex];
        worker.jobInfo.splice(jobIndex, 1);
        workerList[workerIndex] = worker;
        
    }

    //Delete job from job list
    jobList.splice(jobIndex, 1);
    console.log(jobList);
    localStorage.setItem("jobList", JSON.stringify(jobList));
    localStorage.setItem("workerList", JSON.stringify(workerList));

    setTimeout(() => {
        const data = {
            name: "updateWorkerJobs",
        }
        window.top.postMessage(data, "*");
        refresh();
    }, 10); 
}

function deleteRequirement(jobIndex, inputKey) {
    jobList = JSON.parse(localStorage.getItem("jobList"));
    workerList = JSON.parse(localStorage.getItem("workerList"));
    let job = jobList[jobIndex];
    let newRequirements = {};

    //Delete requirement for job from jobList
    for (let key in job.requirements) {
        if (key != inputKey) {
            newRequirements[key] = job.requirements[key];
        }
    }
    job.requirements = newRequirements;
    jobList[jobIndex] = job;

    //Delete requirement for each worker
    for (let workerIndex = 0; workerIndex < workerList.length; workerIndex++) {
        const worker = workerList[workerIndex];
        let workerJob = worker.jobInfo[jobIndex]
        let newWorkerRequirements = {}

        for (let key in workerJob.requirements) {
            if (key != inputKey) {
                newWorkerRequirements[key] = workerJob.requirements[key];
            }
        }
        workerJob.requirements = newWorkerRequirements
        worker.jobInfo[jobIndex] = workerJob;
        workerList[workerIndex] = worker;
    }

    localStorage.setItem("jobList", JSON.stringify(jobList));
    localStorage.setItem("workerList", JSON.stringify(workerList));

    setTimeout(() => {
        refresh();
    }, 10);
}

window.onmessage = function(event) {
    data = event.data;
    if (data.name == "updateJobs") {
        refresh();
    }
}