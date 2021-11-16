drawBoardData();

async function drawBoardData() {

  chrome.runtime.sendMessage({popUpOpen: true},
    async function (data) {
      console.log('Popup data ', data);
      var boardData = document.getElementById("boardData");
      var loadSpinner = document.getElementById("loadSpinner");
      var sortedData = data.Value.sort(sortByEnvironment);
      var releaseList;

      var myReleaseNames = await getMyReleaseNames();

      sortedData.forEach(item => {
        var cleanedEnvName = cleanEnvName(item.EnvironmentName);
      
        if(sectionHeaderText !== cleanedEnvName) {
          sectionHeaderText = cleanedEnvName;
          releaseList = addReleaseListSection(sectionHeaderText, boardData);          
        }
        addReleaseItem(item, releaseList, myReleaseNames);  
      });
      loadSpinner.classList.add('lds-hourglass-hide');
    });

  var sectionHeaderText = "";
}

function sortByEnvironment( a, b ) {
  if ( a.EnvironmentName < b.EnvironmentName ){
    return -1;
  }
  if ( a.EnvironmentName > b.EnvironmentName ){
    return 1;
  }
  return 0;
}

function cleanEnvName(envText) {
  console.log(envText);
  const regex = /[\d-]|[\s]/i;
  var output = envText.replace(regex, '').trim();
  return output.toUpperCase();
}

function addReleaseListSection(sectionHeaderText, parentElement) {
  var section = document.createElement('section');
  addHeading(sectionHeaderText, section);
  var releaseList = document.createElement('ul');
  releaseList.setAttribute('class','boardItems');
  section.appendChild(releaseList);
  parentElement.appendChild(section);

  return releaseList;
}

function addHeading(sectionHeaderText, parentElement) {
  var heading = document.createElement('header');
  heading.appendChild(document.createTextNode(sectionHeaderText));
  parentElement.appendChild(heading);
}

async function addReleaseItem(element, parentElement, myReleaseNames) {
  var myMatch = '';
  if (myReleaseNames) {
    myMatch = myReleaseNames
    .trim()
    .split(',')
    .some(r => element.ReleaseDefinitionName.toLowerCase().includes(r.toLowerCase()));
  }
  var li = document.createElement('li');
  li.setAttribute('class','boardItem hasDetail');
  li.innerHTML = `<a href='${element.ReleaseUrl}' target='_blank' class='${myMatch ? 'myMatch hasDetail' : 'hasDetail'}'>${element.ReleaseDefinitionName}
  <div class='detailText'>
  <p>Team Name: ${element.TeamName}</p>
  <p>Assigned Owner: ${element.AssignedOwner}</p>
  <p>Modified On: ${new Date(element.ModfifiedOn).toLocaleDateString("en-GB")}</p>
  <p>Modified By: ${element.ModifiedByDisplayName}</p>
  <p>Re-Run Status: ${element.ReRunStatus}</p>
  
  </div>
  </a>`;
  parentElement.appendChild(li); 
}

async function getMyReleaseNames() {
  var myReleaseNameData = await getLocalStorageValue("myReleaseNames");
  if (myReleaseNameData.myReleaseNames) {
    return myReleaseNameData.myReleaseNames;
  }
  else {
    return null;
  }
}

async function getLocalStorageValue(key) {
  return new Promise((resolve, reject) => {
      try {
          chrome.storage.sync.get(key, function (value) {
              resolve(value);
          })
      }
      catch (ex) {
          reject(ex);
      }
  });
}