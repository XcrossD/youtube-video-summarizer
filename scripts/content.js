document.addEventListener("DOMContentLoaded", function () {
  if (window.location.href.includes("youtube.com/watch")) {
    const videoUrl = window.location.href;
    chrome.runtime.sendMessage({ action: "summarizeVideo", videoUrl }, response => {
      if (response && response.summary) {
        const summaryBox = document.createElement("div");
        summaryBox.style.padding = "10px";
        summaryBox.style.marginTop = "10px";
        summaryBox.style.border = "1px solid #ccc";
        summaryBox.style.backgroundColor = "#f9f9f9";
        summaryBox.innerText = "Summary: " + response.summary;
        
        const videoContainer = document.querySelector("#primary");
        if (videoContainer) {
          videoContainer.prepend(summaryBox);
        }
      }
    });
  }
});