chrome.runtime.onInstalled.addListener(() => {
  console.log("YouTube Video Summarizer Extension Installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "summarizeVideo") {
    fetch("https://api.example.com/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: request.videoUrl })
    })
      .then(response => response.json())
      .then(data => sendResponse({ summary: data.summary }))
      .catch(error => {
        console.error("Error fetching summary:", error);
        sendResponse({ summary: "Error fetching summary." });
      });
    
    return true; // Keep the message channel open for async response
  }
});