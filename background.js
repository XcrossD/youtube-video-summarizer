async function decryptData(encryptedData) {
  const decoder = new TextDecoder();
  const iv = new Uint8Array(encryptedData.iv);
  const encrypted = new Uint8Array(encryptedData.encrypted);

  const keyMaterial = await chrome.storage.local.get(["encryptionKey"]);
  if (!keyMaterial.encryptionKey) {
    throw new Error("Encryption key is missing. Ensure it is generated and stored securely.");
  }

  const importedKey = await globalThis.crypto.subtle.importKey(
    "raw",
    new Uint8Array(keyMaterial.encryptionKey),
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  const decrypted = await globalThis.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    importedKey,
    encrypted
  );

  return decoder.decode(decrypted);
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("YouTube Video Summarizer Extension Installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "summarizeVideo") {
    chrome.storage.sync.get(["geminiKey"], async (keys) => {
      let apiKey = "";
      try {
        apiKey = await decryptData(keys.geminiKey);      
        if (!apiKey) {
          sendResponse({ summary: "API key not set for Gemini" });
          return;
        }
      } catch (err) {
        console.error("Error decrypting data", err);
        return;
      }

      const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
      fetch(apiUrl, {
        method: "POST",
        headers: {
          "x-goog-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: "Please summarize the video in 3 sentences." },
                {
                  file_data: {
                    file_uri: request.videoUrl
                  }
                }
              ]
            }
          ]
        })
      })
        .then(response => response.json())
        .then(data => {
          const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary available.";
          sendResponse({ summary });
        })
        .catch(error => {
          console.error("Error fetching summary:", error);
          sendResponse({ summary: "Error fetching summary." });
        });
    });
    return true; // Keep the message channel open for async response
  }
});