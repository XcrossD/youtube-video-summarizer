document.addEventListener("DOMContentLoaded", function () {
  if (window.location.href.includes("youtube.com/watch")) {
    const videoUrl = window.location.href;
    fetch("https://api.example.com/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: videoUrl })
    })
      .then(response => response.json())
      .then(data => {
        const summaryBox = document.createElement("div");
        summaryBox.style.padding = "10px";
        summaryBox.style.marginTop = "10px";
        summaryBox.style.border = "1px solid #ccc";
        summaryBox.style.backgroundColor = "#f9f9f9";
        summaryBox.innerText = "Summary: " + data.summary;
        
        const videoContainer = document.querySelector("#primary");
        if (videoContainer) {
          videoContainer.prepend(summaryBox);
        }
      })
      .catch(error => console.error("Error fetching summary:", error));
  }
});