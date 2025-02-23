chrome.runtime.onInstalled.addListener(() => {
  console.log("YouTube Video Summarizer Extension Installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "summarizeVideo") {
    chrome.storage.sync.get(["geminiKey"], (keys) => {
      const apiKey = keys.geminiKey;      
      if (!apiKey) {
        sendResponse({ summary: "API key not set for Gemini" });
        return;
      }

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `Summarize the following youtube video ${request.videoUrl}` }
              ]
            }
          ]
        })
      })
        .then(response => response.json())
        .then(data => sendResponse({ summary: data.summary }))
        .catch(error => {
          console.error("Error fetching summary:", error);
          sendResponse({ summary: "Error fetching summary." });
        });
    });
    return true; // Keep the message channel open for async response
  }
});