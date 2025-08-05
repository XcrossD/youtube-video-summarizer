async function encryptData(data) {
  const encoder = new TextEncoder();
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));

  // Generate a persistent key for encryption if not already stored
  let keyMaterial = await chrome.storage.local.get(["encryptionKey"]);
  if (!keyMaterial.encryptionKey) {
    const generatedKey = await globalThis.crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
    const exportedKey = await globalThis.crypto.subtle.exportKey("raw", generatedKey);
    await chrome.storage.local.set({ encryptionKey: Array.from(new Uint8Array(exportedKey)) });
    keyMaterial = { encryptionKey: Array.from(new Uint8Array(exportedKey)) };
  }

  const importedKey = await globalThis.crypto.subtle.importKey(
    "raw",
    new Uint8Array(keyMaterial.encryptionKey),
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  const encrypted = await globalThis.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    importedKey,
    encoder.encode(data)
  );

  return { iv: Array.from(iv), encrypted: Array.from(new Uint8Array(encrypted)) };
}

document.getElementById("saveKey").addEventListener("click", async function() {
  const geminiKey = document.getElementById("geminiKey").value;

  try {
    const encryptedKey = await encryptData(geminiKey);
    
    chrome.storage.sync.set({ geminiKey: encryptedKey }, () => {
      alert("Settings saved successfully.");
    });
  } catch (err) {
    alert("Error occurred when saving settings");
  }
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