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
let defaultJob = document.getElementById("default-job");
let defaultJobLocation = document.getElementById("default-job-location");


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

function updateWorkers() {
  const oldList = document.getElementById('worker-list');
  if (oldList != null) {
  oldList.remove();
  }

  const workersEnd = document.getElementById("workers-end");
  const newList = document.createElement("ul");
  newList.setAttribute('id', 'worker-list');
  
  for (let index = 0; index < workerList.length; index++) {
    //Create New Worker as a list
    const newWorker = document.createElement("ul");
    newWorker.setAttribute('class', 'individual-worker');

    //Create name of worker as list item
    const newWorkerName = document.createElement("li");
    newWorkerName.setAttribute('class', index);
    const newWorkerContent = document.createTextNode(workerList[index].firstName + " " + workerList[index].lastName);
    newWorkerName.appendChild(newWorkerContent)

    //Create list of buttons as a list item
    const newButtonList = document.createElement("ul");

    //Create Edit Button as a list of buttons item
    const newWorkerEditButtonItem = document.createElement("li");
    const newWorkerEditButton = document.createElement("button");
    newWorkerEditButton.setAttribute('class', index);
    newWorkerEditButton.setAttribute('class', "edit-button");
    newWorkerEditButton.innerHTML = "Edit";
    newWorkerEditButtonItem.appendChild(newWorkerEditButton);
    newButtonList.appendChild(newWorkerEditButtonItem);
    
    //Create Delete Button as a list of buttons item
    const newWorkerDeleteButtonItem = document.createElement("li");
    const newWorkerDeleteButton = document.createElement("button");
    newWorkerDeleteButton.setAttribute('class', index);
    newWorkerDeleteButton.setAttribute('class', "delete-button");
    newWorkerDeleteButton.innerHTML = "Delete";
    newWorkerDeleteButtonItem.appendChild(newWorkerDeleteButton);
    newButtonList.appendChild(newWorkerDeleteButtonItem);
    
    //Add items to new worker list
    newWorker.appendChild(newWorkerName);
    newWorker.appendChild(newButtonList);

    //Add worker list to list of workers
    newList.appendChild(newWorker);
  }

  document.body.insertBefore(newList, workersEnd);

  editWorker();
  deleteWorker();
}

function editWorker() {
  let buttonList = document.getElementsByClassName("edit-button");


  for (let index = 0; index < buttonList.length; index++) {
    const buttonElement = buttonList[index];
    buttonElement.onclick = function(){
      workerList = JSON.parse(localStorage.getItem("workerList")); //DELETE THIS ****
      
      console.log("I'm with " + workerList[index].firstName + " " + workerList[index].lastName);
      console.log("I'm the iframe telling the parent to open the Edit Pop Up");


      //DELETE THIS ****
      const worker = workerList[index];
      const workerJobs = worker.jobInfo;
      console.log(worker.firstName + " has these jobs:")
      for (let jobIndex = 0; jobIndex < workerJobs.length; jobIndex++) {
        const job = workerJobs[jobIndex];
        const jobRequirements = job.requirements;
        console.log(job.name + " has these requirements:")
        for (key in jobRequirements) {
          console.log(key);
        }
      }
      // ****

      const data = {
        name: "openWorkerPopUp",
        editWorkerIndex: index,
      }

      window.top.postMessage(data, '*');
      return false;
    };
  }
}

function deleteWorker() {
  let buttonList = document.getElementsByClassName("delete-button");

  for (let index = 0; index < buttonList.length; index++) {
    const buttonElement = buttonList[index];
    buttonElement.onclick = function(){
      firstHalfWorkerList = workerList.slice(0, index);
      secondHalfWorkerList = workerList.slice(index + 1, workerList.length);

      let newWorkerList = [];
      for (let index = 0; index < firstHalfWorkerList.length; index++) {
        newWorkerList.push(firstHalfWorkerList[index]);
      }
      for (let index = 0; index < secondHalfWorkerList.length; index++) {
        newWorkerList.push(secondHalfWorkerList[index]);
      }

      workerList = newWorkerList;
      localStorage.setItem("workerList", JSON.stringify(workerList));
      updateWorkers();
    };
  }

  const data = {
    name: "updateWorkers",
  }

  window.top.postMessage(data, '*'); //Tell parent function to update workers
}

function updateJobs() {
  jobList = JSON.parse(localStorage.getItem("jobList"));
  workerList = JSON.parse(localStorage.getItem("workerList"));
  defaultJob = document.getElementById("default-job");
  if (defaultJob != null) {
    defaultJob.remove();
    }
  defaultJob = document.createElement("select")
  defaultJob.setAttribute("name", "defaultJob");
  defaultJob.setAttribute("id", "default-job");
  let defaultJobEmptyValue = document.createElement("option")
  defaultJobEmptyValue.setAttribute("selected", "selected");
  defaultJobEmptyValue.innerHTML = "Select a default job";
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

window.onload = setTimeout(() => {
  workerList = JSON.parse(localStorage.getItem("workerList"));
  jobList = JSON.parse(localStorage.getItem("jobList"));
  updateWorkers();
  updateJobs();
}, 10);

class Worker {
  constructor(firstName, lastName, defaultJob) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.defaultJob = defaultJob;
    this.jobInfo = [];
  }
  initiateJobList() {
    jobList = JSON.parse(localStorage.getItem("jobList"));
    for (let jobIndex = 0; jobIndex < jobList.length; jobIndex++) {
      let newJob = jobList[jobIndex];
      this.jobInfo.push(newJob);
    }
  }
}


function addWorker() {
  workerList = JSON.parse(localStorage.getItem("workerList"));

  //Get info from form
  const firstName = document.getElementById('first-name').value;
  const lastName = document.getElementById('last-name').value;
  const defaultJob = document.getElementById('default-job').value;

  if (firstName != "" && lastName != "") {
    document.getElementById('first-name').value = "";
    document.getElementById('last-name').value = "";

    //Save info and update page
    const newWorker = new Worker(firstName, lastName, defaultJob);
    newWorker.initiateJobList(); //Add jobs to Worker

    workerList.push(newWorker);
    localStorage.setItem("workerList", JSON.stringify(workerList));
    
    const data = {
      name: "updateWorkers",
    }

    window.top.postMessage(data, '*'); //Tell parent function to update workers
    updateWorkers();
    updateJobs();
  }
}

window.onmessage = function(event){
  if (event.data.name == 'updateWorkers') {  //Update Workers when parent frame updates workers
    console.log("I am the workers iframe updating my workers because my parent said to");
    workerList = JSON.parse(localStorage.getItem("workerList"));
    updateWorkers();
    updateJobs();
    setTimeout(() => {
      workerList = JSON.parse(localStorage.getItem("workerList"));
      updateWorkers();
      updateJobs();
    }, 10);
  } else if (event.data.name == "updateWorkerJobs")  {
    console.log("I'm the worker.js updating the job drop down because jobs.js told me to");
    workerList = JSON.parse(localStorage.getItem("workerList"));
    updateJobs();
  }
};