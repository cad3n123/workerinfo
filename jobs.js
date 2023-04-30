let jobs = JSON.parse(localStorage.getItem("jobs"));
let jobList = JSON.parse(localStorage.getItem("jobList"));
if (jobList == null) {
  jobList = [];
}
let workerList = JSON.parse(localStorage.getItem("workerList"));
if (workerList == null) {
  workerList = [];
}

class Job {
  constructor(name) {
    this.name = name;
    this.requirements = {};
  }
}

function updateJobs() {
    jobList = JSON.parse(localStorage.getItem("jobList"));

    const oldList = document.getElementById('job-list');
    if (oldList != null) {
    oldList.remove();
    }
  
    const jobsEnd = document.getElementById("jobs-end");
    const newList = document.createElement("ul");
    newList.setAttribute('id', 'job-list');
  
    for (let index = 0; index < jobList.length; index++) {
      const job = jobList[index]; //Job in question

      //Create new job as list
      const newJob = document.createElement("ul");
      newJob.setAttribute('class', 'individual-job');

      //Create name of job as list item
      const newJobName = document.createElement("li");
      const newJobNameElement = document.createElement("h2");
      const newContent = document.createTextNode(job.name);
      newJobNameElement.appendChild(newContent);
      newJobName.appendChild(newJobNameElement);

      //Create a button list as list item
      const newButtonList = document.createElement("ul");

      //Create add requirements button as a list item
      const newAddButtonItem = document.createElement("li");
      const newAddButton = document.createElement("button");
      newAddButton.innerHTML = "Add Requirements";
      newAddButton.setAttribute("class", "add-button");

      //Create edit button as list item
      const newEditButtonItem = document.createElement("li");
      const newEditButton = document.createElement("button");
      newEditButton.innerHTML = "Edit";
      newEditButton.setAttribute("class", "edit-button");

      //Create delete button as list item
      const newDeleteButtonItem = document.createElement("li");
      const newDeleteButton = document.createElement("button");
      newDeleteButton.innerHTML = "Delete";
      newDeleteButton.setAttribute("class", "delete-button");

      //Add list items to job
      newAddButtonItem.appendChild(newAddButton);
      newEditButtonItem.appendChild(newEditButton);
      newDeleteButtonItem.appendChild(newDeleteButton);

      newButtonList.appendChild(newAddButtonItem);
      newButtonList.appendChild(newEditButtonItem);
      newButtonList.appendChild(newDeleteButtonItem);

      newJob.appendChild(newJobName);
      newJob.appendChild(newButtonList);

      //Add job to job list
      newList.appendChild(newJob);

      //Create job requirement list as list item
      const newJobRequirementListItem = document.createElement("li");

      //Creat job requirement list
      const newJobRequirementList = document.createElement("ul");
      newJobRequirementList.setAttribute("class", "job-requirement-list");

      //Add job requirements to job requirement list
      for (let key in job.requirements) {
        //Create job requirement button list
        const newJobRequirementButtonList = document.createElement("ul");
        newJobRequirementButtonList.setAttribute("class", "job-requirement-button-list");

        //Create job requirement edit button as list item
        const newJobRequirementEditButtonItem = document.createElement("li");
        const newJobRequirementEditButton = document.createElement("button");
        newJobRequirementEditButton.innerHTML = "Edit";
        newJobRequirementEditButton.setAttribute("class", "job-requirement-edit-button edit-job-name-" + job.name);
        newJobRequirementEditButton.toggleAttribute

        //Create job requirement delete button as list item
        const newJobRequirementDeleteButtonItem = document.createElement("li");
        const newJobRequirementDeleteButton = document.createElement("button");
        newJobRequirementDeleteButton.innerHTML = "Delete";
        newJobRequirementDeleteButton.setAttribute("class", "job-requirement-delete-button delete-job-name-" + job.name);

        //Add job requirement buttons to job requirement button list
        newJobRequirementEditButtonItem.appendChild(newJobRequirementEditButton);
        newJobRequirementDeleteButtonItem.appendChild(newJobRequirementDeleteButton);

        newJobRequirementButtonList.appendChild(newJobRequirementEditButtonItem);
        newJobRequirementButtonList.appendChild(newJobRequirementDeleteButtonItem);

        //Create job requirements
        let newJobRequirementItem = document.createElement("li");
        let newJobRequirementListItemElement = document.createElement('p');
        newJobRequirementListItemElement.setAttribute("class", "job-requirement-list-item-element");
        newJobRequirementListItemElement.innerHTML = key;
        //console.log("Adding " + key + " below " + job.name + " text element");

        newJobRequirementItem.appendChild(newJobRequirementListItemElement);
        newJobRequirementItem.appendChild(newJobRequirementButtonList);
        newJobRequirementList.appendChild(newJobRequirementItem);
      }
      newJobRequirementListItem.appendChild(newJobRequirementList);

      //Add job requirement elements to job list
      newList.appendChild(newJobRequirementListItem);
    }
  
    document.body.insertBefore(newList, jobsEnd);

    addJobRequirement();
    editJobRequirement();
    editJob();
    deleteJob();
    deleteJobRequirement();
}

function editJob() {
  let buttonList = document.getElementsByClassName("edit-button");
  jobList = JSON.parse(localStorage.getItem("jobList"));

  for (let index = 0; index < buttonList.length; index++) {
    const buttonElement = buttonList[index];
    buttonElement.onclick = function(){
      console.log("I'm with " + jobList[index].name);
      console.log("I'm the iframe telling the parent to open the Edit Pop Up");
      localStorage.setItem("editJobIndex", index);

      const data = {
        name: "openJobPopUp",
        editJobIndex: index,
      }

      window.top.postMessage(data, '*');
      return false;
    };
  }
}

function deleteJob() {
  jobList = JSON.parse(localStorage.getItem("jobList"));
  workerList = JSON.parse(localStorage.getItem("workerList"));
  let buttonList = document.getElementsByClassName("delete-button");

  for (let index = 0; index < buttonList.length; index++) {
    const buttonElement = buttonList[index];
    buttonElement.onclick = function(){

      //Delete job from worker job list
      for (let workerIndex = 0; workerIndex < workerList.length; workerIndex++) {
        let worker = workerList[workerIndex];
        const workerJobInfo = worker.jobInfo;
        let firstHalfWorkerJobInfo = workerJobInfo.slice(0, index);
        let secondHalfWorkerJobInfo = workerJobInfo.slice(index + 1, workerJobInfo.length);

        let newWorkerJobInfo = [];
        for (let jobIndex = 0; jobIndex < firstHalfWorkerJobInfo.length; jobIndex++) {
          newWorkerJobInfo.push(firstHalfWorkerJobInfo[jobIndex]);
        }
        for (let jobIndex = 0; jobIndex < secondHalfWorkerJobInfo.length; jobIndex++) {
          newWorkerJobInfo.push(secondHalfWorkerJobInfo[jobIndex]);
        }

        worker.jobInfo = newWorkerJobInfo;
        
        if (worker.defaultJob == jobList[index].name) {
          if (workerList.lenght > 1) {
            if (index == 0) { //If worker default job is being deleted, set worker default job to the first job that isn't the one being deleted
              worker.defaultJob = jobList[1];
            } else {
              worker.defaultJob = jobList[0];
            }
          } else { //If worker default job is being deleted and there are not other jobs, set default job to nothing
            worker.defaultJob = "";
          }
        }

        console.log(worker.firstName + " just got edited!")
        workerList[workerIndex] = worker;
      }
      localStorage.setItem("workerList", JSON.stringify(workerList));

      //Delete job from job list
      firstHalfJobList = jobList.slice(0, index);
      secondHalfJobList = jobList.slice(index + 1, jobList.length);

      let newJobList = [];
      for (let jobIndex = 0; jobIndex < firstHalfJobList.length; jobIndex++) {
        newJobList.push(firstHalfJobList[jobIndex]);
      }
      for (let jobIndex = 0; jobIndex < secondHalfJobList.length; jobIndex++) {
        newJobList.push(secondHalfJobList[jobIndex]);
      }
  
      jobList = newJobList;
      localStorage.setItem("jobList", JSON.stringify(jobList));

      const data = {
        name: "updateWorkerJobs",
      }

      setTimeout(() => {
        window.top.postMessage(data, '*');
        updateJobs();
      }, 20);
    };
  }
}

function deleteJobRequirement() {
  jobList = JSON.parse(localStorage.getItem("jobList"));
  workerList = JSON.parse(localStorage.getItem("workerList"));

  for (let jobIndex = 0; jobIndex < jobList.length; jobIndex++) {
    let job = jobList[jobIndex];
    let buttonList = document.getElementsByClassName("delete-job-name-" + job.name);
    let newRequirements = {}

    
    for (let buttonIndex = 0; buttonIndex < buttonList.length; buttonIndex++) {
      const buttonElement = buttonList[buttonIndex];
      buttonElement.onclick = function(){

        //Find the key that will be deleted and don't add it in worker job info list
        for (let workerIndex = 0; workerIndex < workerList.length; workerIndex++) {
          let worker = workerList[workerIndex];
          let workerJobInfo = worker.jobInfo;
          for (let jobIndex = 0; jobIndex < workerJobInfo.length; jobIndex++) {
            let workerJob = workerJobInfo[jobIndex];
            let newJobInfoRequirements = {};
            if  (workerJob.name = job.name) {
              let jobInfoRequirementIndex = 0;
              for (let key in workerJob.requirements) {
                if (buttonIndex != jobInfoRequirementIndex) {
                  newJobInfoRequirements[key] = workerJob.requirements[key];
                };
                jobInfoRequirementIndex++;
              }
            }
            workerJob.requirements = newJobInfoRequirements;
            workerJobInfo[jobIndex] = workerJob;
          }
          worker.jobInfo = workerJobInfo;
          workerList[workerIndex] = worker;
        }

        //Find the key that will be deleted and don't add it in job list
        let requirementIndex = 0;
        newRequirements = {};
        for (let key in job.requirements) {
          if (buttonIndex != requirementIndex) {
            newRequirements[key] = 0;
          };
          requirementIndex++;
        }
        job.requirements = newRequirements;
        jobList[jobIndex] = job;

        localStorage.setItem("jobList", JSON.stringify(jobList));
        localStorage.setItem("workerList", JSON.stringify(workerList));

        

        setTimeout(() => {
          const data = {
              name: "updateWorkerJobs",
          }
          window.top.postMessage(data, "*");
          updateJobs();
        }, 10);
      }      
    }
  }
  localStorage.setItem("jobList", JSON.stringify(jobList));
}

function editJobRequirement() {
  jobList = JSON.parse(localStorage.getItem("jobList"));

  for (let jobIndex = 0; jobIndex < jobList.length; jobIndex++) {
    let job = jobList[jobIndex];
    let buttonList = document.getElementsByClassName("edit-job-name-" + job.name);

    for (let buttonIndex = 0; buttonIndex < buttonList.length; buttonIndex++) {
      const buttonElement = buttonList[buttonIndex];
      buttonElement.onclick = function(){
        console.log("I'm with " + job.name + " whos index is " + jobIndex);
        console.log("I'm the iframe telling the parent to open the Edit Job Requirement Pop Up");
        
        //Find the key that will be edited
        let requirementIndex = 0;
        let editJobRequirementRequirement;
        for (let key in job.requirements) {
          if (buttonIndex == requirementIndex) {
            console.log("The edit job requirement requirement is " + key);
            editJobRequirementRequirement = key;
          }
          requirementIndex++;
        }
        
        setTimeout(() => {

          const data = {
            name: "openEditJobRequirementPopUp",
            editJobRequirementJobIndex: jobIndex,
            editJobRequirementRequirement: editJobRequirementRequirement, 
          }

          window.top.postMessage(data, '*');
        }, 10); //Ensures that the window doesn't try anything until local storage is updated
      }      
    }
  }
}

window.onload = updateJobs;
  
function addJob() {
  workerList = JSON.parse(localStorage.getItem("workerList"));

  //Get info from form
  const name = document.getElementById('name').value;
  if (name != "") {
    document.getElementById('name').value = "";
    
    //Save info and update page
    const newJob = new Job(name);
    jobList.push(newJob);
    localStorage.setItem("jobList", JSON.stringify(jobList));

    //Add job to each worker
    for (let workerIndex = 0; workerIndex < workerList.length; workerIndex++) {
      let worker = workerList[workerIndex];
      workerJobInfo = worker.jobInfo;
      workerJobInfo.push(newJob);
      worker.jobInfo = workerJobInfo;
      workerList[workerIndex] = worker;
    }
    localStorage.setItem("workerList", JSON.stringify(workerList));

    const data = {
      name: "updateWorkerJobs",
    }

    setTimeout(() => {
      window.top.postMessage(data, '*');
      updateJobs();
    }, 10);
  }
}

function addJobRequirement() {
  let buttonList = document.getElementsByClassName("add-button");
  jobList = JSON.parse(localStorage.getItem("jobList"));

  for (let index = 0; index < buttonList.length; index++) {
    const buttonElement = buttonList[index];
    buttonElement.onclick = function(){
      console.log("I'm with " + jobList[index].name);
      console.log("I'm the iframe telling the parent to open the Add Requirement Pop Up");
      localStorage.setItem("addJobRequirementIndex", index);

      let data = {
        name: "openJobRequirementPopUp",
        addJobRequirementIndex: index,
      }

      window.top.postMessage(data, '*');

      data = {
        name: "updateWorkerJobs"
      }

      window.top.postMessage(data, '*');
    };   
  }
}

window.onmessage = function(event){
  if (event.data.name == 'updateJobs') {  //Update Jobs when parent frame updates jobs
    console.log("I am the jobs iframe updating my jobs because my parent said to");
    jobList = JSON.parse(localStorage.getItem("jobList"));

    updateJobs();
    setTimeout(() => {
      jobList = JSON.parse(localStorage.getItem("jobList"));
      updateJobs();
    }, 10);
  }
};

//Tell script to close Pop Up
document.body.addEventListener('keyup', function(e) {
  if (e.key == "Escape") {
    console.log("I'm the iframe telling the parent to close the Edit Pop Up");

    const data = {
      name: "closePopUp",
    }

    window.top.postMessage(data, '*');
  }
});
