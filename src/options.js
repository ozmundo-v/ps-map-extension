
getMyReleaseNames();

function getMyReleaseNames() {
    chrome.storage.sync.get("myReleaseNames", ({ myReleaseNames }) => {
        document.getElementById("updateReleaseListKeywords").addEventListener("click", setMyReleaseNames);
        document.getElementById("releaseListKeywords").value = myReleaseNames;
    });
}

function setMyReleaseNames(event) {
    var releaseListKeywords = document.getElementById("releaseListKeywords").value;
    chrome.storage.sync.set({"myReleaseNames": releaseListKeywords.trim()}, function() {
        console.log('My release list is set to ' + releaseListKeywords);
      });
      
      getMyReleaseNames();
}