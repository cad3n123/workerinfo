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
let workerInfo = document.getElementById("worker-info");

window.onload = updateWorkerSelect;

function updateWorkerSelect() {
    jobList = JSON.parse(localStorage.getItem("jobList"));
    workerSelect.remove();
    workerSelect = document.createElement("div");
    workerSelect.setAttribute("id", "worker-select");
    workerInfo.remove();
    workerInfo = document.createElement("div");
    workerInfo.setAttribute("id", "worker-info");
    mainDiv.appendChild(workerSelect);
    mainDiv.appendChild(workerInfo);

    for (let index = 0; index < workerList.length; index++) {
        let workerName = workerList[index].firstName + " " + workerList[index].lastName;
    
        //Create Worker Checkbox
        let newWorkerInput = document.createElement("input");
        newWorkerInput.setAttribute("type", "checkbox");
        newWorkerInput.setAttribute("id", workerName);
        newWorkerInput.setAttribute("class", "worker-checkbox");
        newWorkerInput.value = workerName;
        
        let newWorkerLabel = document.createElement("label");
        newWorkerLabel.setAttribute("for", workerName);
        newWorkerLabel.innerHTML = workerName;
    
        workerSelect.appendChild(newWorkerInput);
        workerSelect.appendChild(newWorkerLabel);
        workerSelect.appendChild(document.createElement("br"));

        //Create worker info section
        const individualWorkerInfo = document.createElement("div");
        individualWorkerInfo.setAttribute("class", "individual-worker-info-div");
        individualWorkerInfo.style.display = "none";
        const workerNameElement = document.createElement("h3");
        workerNameElement.innerHTML = workerName;
        const workerJobDropdownDiv = document.createElement("div");
        workerJobDropdownDiv.setAttribute("class", "worker-job-dropdown-div");
        const workerJobDropdown = document.createElement("select");
        workerJobDropdown.setAttribute("class", "worker-job-dropdown");

        let workerJobDropdownList = document.getElementsByClassName("worker-job-dropdown-div");


        //Create worker dropdown
        for (let jobIndex = 0; jobIndex < jobList.length; jobIndex++) {
          job = jobList[jobIndex];
          if (job.name == workerList[index].defaultJob) { //Make default job first
            const workerJobDropdownOption = document.createElement("option");
            workerJobDropdownOption.innerHTML = job.name;
            workerJobDropdownOption.setAttribute("class", "worker-job-dropdown-option");
            workerJobDropdown.appendChild(workerJobDropdownOption);
          }
        }

        for (let jobIndex = 0; jobIndex < jobList.length; jobIndex++) {
          job = jobList[jobIndex];
          if (job.name != workerList[index].defaultJob) { //Add jobs not including default job
            const workerJobDropdownOption = document.createElement("option");
            workerJobDropdownOption.innerHTML = job.name;
            workerJobDropdownOption.setAttribute("class", "worker-job-dropdown-option");
            workerJobDropdown.appendChild(workerJobDropdownOption);
          }
        }
        workerJobDropdownDiv.appendChild(workerJobDropdown);

        console.log(newWorkerInput.value);
        individualWorkerInfo.appendChild(workerNameElement);
        individualWorkerInfo.appendChild(workerJobDropdownDiv);
        workerInfo.appendChild(individualWorkerInfo);

        
        //Edit worker job requirements when job is changed
        for (let workerInfoIndex = 0; workerInfoIndex < workerJobDropdownList.length; workerInfoIndex++) {
          workerJobDropdownList[workerInfoIndex].onclick = function() {
            jobList = JSON.parse(localStorage.getItem("jobList"));
            let newIndividualWorkerInfo = document.getElementsByClassName("individual-worker-info-div")[workerInfoIndex];
            let workerJobRequirementsDiv = document.getElementsByClassName("worker-job-requirements-div")[workerInfoIndex];
            let workerJobRequirementsDivChildren = workerJobRequirementsDiv.childNodes;
            let workerJobRequirementsDivChildrenLength = workerJobRequirementsDivChildren.length;
            let newWorkerJobDropdown = document.getElementsByClassName("worker-job-dropdown")[workerInfoIndex];
            console.log("New worker job dropdown:");
            console.log(document.getElementsByClassName("worker-job-dropdown"));
            for (let requirementIndex = 0; requirementIndex < workerJobRequirementsDivChildrenLength; requirementIndex++) {
              workerJobRequirementsDivChildren[0].remove();
            }

            let workerJobRequirements = {};

            for (let jobIndex = 0; jobIndex < jobList.length; jobIndex++) {
              if (jobList[jobIndex].name == newWorkerJobDropdown.value) {
                console.log("This is the worker job drowndown value: " + newWorkerJobDropdown.value);
                console.log("Job Name: " + jobList[jobIndex].name);
                console.log("Job Requirements:");
                console.log(jobList[jobIndex].requirements);
                workerJobRequirements = jobList[jobIndex].requirements;
              }
              
            }

            for (let key in workerJobRequirements) {
              let newWorkerJobRequirementInput = document.createElement("input");
              newWorkerJobRequirementInput.setAttribute("type", "checkbox");
              newWorkerJobRequirementInput.setAttribute("class", "worker-job-requirement-checkbox");
              newWorkerJobRequirementInput.setAttribute("id", key);
              let newWorkerJobRequirementLabel = document.createElement("label");
              newWorkerJobRequirementLabel.setAttribute("id", key);
              newWorkerJobRequirementLabel.innerHTML = key;

              workerJobRequirementsDiv.appendChild(document.createElement("br"))
              workerJobRequirementsDiv.appendChild(newWorkerJobRequirementInput);
              workerJobRequirementsDiv.appendChild(newWorkerJobRequirementLabel);
            }

            newIndividualWorkerInfo.appendChild(workerJobRequirementsDiv);
          }
        }
        
        //Add worker job requirements
        let workerJobRequirementsDiv = document.createElement("div");
        workerJobRequirementsDiv.setAttribute("class", "worker-job-requirements-div")
        let workerJobRequirements = {};

        for (let jobIndex = 0; jobIndex < jobList.length; jobIndex++) {
          if (jobList[jobIndex].name == workerJobDropdown.value) {
            console.log("Job Name: " + jobList[jobIndex].name);
            console.log("Job Requirements:");
            console.log(jobList[jobIndex].requirements);
            workerJobRequirements = jobList[jobIndex].requirements;
          }
          
        }

        for (let key in workerJobRequirements) {
          let newWorkerJobRequirementInput = document.createElement("input");
          newWorkerJobRequirementInput.setAttribute("type", "checkbox");
          newWorkerJobRequirementInput.setAttribute("class", "worker-job-requirement-checkbox");
          newWorkerJobRequirementInput.setAttribute("id", key);
          let newWorkerJobRequirementLabel = document.createElement("label");
          newWorkerJobRequirementLabel.setAttribute("id", key);
          newWorkerJobRequirementLabel.innerHTML = key;

          workerJobRequirementsDiv.appendChild(document.createElement("br"))
          workerJobRequirementsDiv.appendChild(newWorkerJobRequirementInput);
          workerJobRequirementsDiv.appendChild(newWorkerJobRequirementLabel);
        }

        individualWorkerInfo.appendChild(workerJobRequirementsDiv);


        document.getElementById("submit-input-info-button").remove();
        let submitInputInfoButton = document.createElement("button");
        submitInputInfoButton.setAttribute("id", "submit-input-info-button");
        submitInputInfoButton.innerHTML = "Submit";
        submitInputInfoButton.onclick = function () {
          jobList = JSON.parse(localStorage.getItem("jobList"));
          workerList = JSON.parse(localStorage.getItem("workerList"));

          let workerCheckboxes = document.getElementsByClassName("worker-checkbox");
          let individualWorkerInfoDivs = document.getElementsByClassName("individual-worker-info-div");
          let workerJobRequirementsDivs = document.getElementsByClassName("worker-job-requirements-div");
          let workerJobDropdowns = document.getElementsByClassName("worker-job-dropdown");

          for (let workerIndex = 0; workerIndex < workerJobRequirementsDivs.length; workerIndex++) {
            //Only check workers being modified
            if (workerCheckboxes[workerIndex].checked) {
              const workerJobRequirementsDiv = workerJobRequirementsDivs[workerIndex];
              let worker = workerList[workerIndex];
              let workerJobRequirementCheckboxes = sharedArray(workerJobRequirementsDiv.childNodes, document.getElementsByClassName('worker-job-requirement-checkbox'));
              let workerJobRequirementDropdown = document.getElementsByClassName('worker-job-dropdown')[workerIndex];
              let workerJob;
              let workerJobIndex;

              //Find worker job
              for (let jobIndex = 0; jobIndex < worker.jobInfo.length; jobIndex++) {
                if (worker.jobInfo[jobIndex].name == workerJobRequirementDropdown.value) {
                  workerJobIndex = jobIndex;
                  workerJob = worker.jobInfo[jobIndex];
                }
              }
              
              //Change job requirement values
              let checkboxIndex = 0
              for (let key in workerJob.requirements) {
                const workerJobRequirementCheckbox = workerJobRequirementCheckboxes[checkboxIndex];

                console.log("Old requirement value: " + workerJob.requirements[key]);

                if (workerJobRequirementCheckbox.checked) {
                  workerJob.requirements[key]++;
                  console.log("New requirement value: " + workerJob.requirements[key]);
                }

                checkboxIndex++
              }

              //Update new job requirement values
              worker.jobInfo[workerJobIndex] = workerJob;
              workerList[workerIndex] = worker;
              localStorage.setItem("workerList", JSON.stringify(workerList));
            }
            
          }

          for (let workerCheckboxIndex = 0; workerCheckboxIndex < workerCheckboxes.length; workerCheckboxIndex++) {//Uncheck boxes
            const workerCheckbox = workerCheckboxes[workerCheckboxIndex];
            workerCheckbox.checked = false;
          }

          for (let workerInfoDivIndex = 0; workerInfoDivIndex < individualWorkerInfoDivs.length; workerInfoDivIndex++) { //Reset worker inputs
            const individualWorkerInfoDiv = individualWorkerInfoDivs[workerInfoDivIndex];
            if (individualWorkerInfoDiv.style.display == "block") {
              individualWorkerInfoDiv.style.display = "none";
            };
          }
          console.log("Submit button clicked!")

          let data = {
            name: "updateWorkers"
          }

          window.top.postMessage(data, "*");

          data.name = "updateWorkerJobs";

          window.top.postMessage(data, "*");
        }

        mainDiv.appendChild(submitInputInfoButton);

        //Add worker info section when box is clicked
        newWorkerInput.onclick = function() {
          if (individualWorkerInfo.style.display == "block") {
            individualWorkerInfo.style.display = "none";
          } else {
            individualWorkerInfo.style.display = "block";
          }
        }
    }
}

window.onmessage = function(event){
  if (event.data.name == 'updateWorkers') {  //Update Workers when parent frame updates workers
      console.log("I am the input-info iframe updating my workers because my parent said to");
      workerList = JSON.parse(localStorage.getItem("workerList"));;
      updateWorkerSelect();
  } else if (event.data.name == 'updateWorkerJobs') {  //Update Worker Jobs when parent frame updates worker jobs
    console.log("I am the input-info iframe updating my workers because my parent said to");
    workerList = JSON.parse(localStorage.getItem("workerList"));
    jobList = JSON.parse(localStorage.getItem("jobList"));
    updateWorkerSelect();
}
}

//Tell script to close Pop Up
document.body.addEventListener('keyup', function(e) {
    if (e.key == "Escape") {
      let data = {
        name: "closePopUp"
      }
      window.top.postMessage(data, '*');
    }
  });
  

//Creates an array that shares values of two arrays
function sharedArray(listOne, listTwo) {
  let newList = [];
  for (let indexOne = 0; indexOne < listOne.length; indexOne++) {
    for (let indexTwo = 0; indexTwo < listTwo.length; indexTwo++) {
      if (listOne[indexOne] == listTwo[indexTwo]) {
        newList.push(listOne[indexOne]);
      }
    }
  }

  return newList;
}