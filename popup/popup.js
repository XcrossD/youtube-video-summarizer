document.getElementById("saveKeys").addEventListener("click", function() {
  const chatgptKey = document.getElementById("chatgptKey").value;
  const geminiKey = document.getElementById("geminiKey").value;
  const selectedAI = document.getElementById("aiService").value;
  
  chrome.storage.sync.set({ chatgptKey, geminiKey, selectedAI }, () => {
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