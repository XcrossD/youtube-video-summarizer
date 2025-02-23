document.getElementById("saveKeys").addEventListener("click", function() {
  const geminiKey = document.getElementById("geminiKey").value;
  
  chrome.storage.sync.set({ geminiKey }, () => {
    alert("Settings saved successfully.");
  });
});

document.getElementById("summarizeButton").addEventListener("click", function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const videoUrl = tabs[0].url;
    chrome.runtime.sendMessage({ action: "summarizeVideo", videoUrl }, response => {
      if (response && response.summary) {
        document.getElementById("summaryResult").innerText = "Summary: " + response.summary;
      } else {
        document.getElementById("summaryResult").innerText = "Failed to fetch summary.";
      }
    });
  });
});