document.addEventListener('DOMContentLoaded', async () => {
  const mappingsDiv = document.getElementById('mappings');

  // Load saved mappings from storage
  chrome.storage.sync.get("fieldMappings", (data) => {
    const mappings = data.fieldMappings || [];
    mappings.forEach(({ id, text }) => addMappingInput(id, text));
  });

  document.getElementById("addMapping").addEventListener("click", () => {
    addMappingInput();
  });

  document.getElementById("saveMappings").addEventListener("click", () => {
    saveMappings();
  });

  document.getElementById("fillFields").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["contentScript.js"]
    });
  });
});

function addMappingInput(id = '', text = '') {
  const mappingRow = document.createElement("tr");
  mappingRow.className = "mapping";
  mappingRow.innerHTML = `
    <td> <input type="text" class="field-id" placeholder="Field ID" value="${id}"> </td>
    <td> <input type="text" class="field-text" placeholder="Text to Fill" value="${text}"> </td>
    <td> <button class="removeMapping">Remove</button> </td>
  `;
  mappingRow.querySelector(".removeMapping").addEventListener("click", () => {
    mappingRow.remove();
    saveMappings();
  });
  document.getElementById("mappings").appendChild(mappingRow);
}

function saveMappings() {
  const mappingsDiv = document.getElementById('mappings');
  const mappings = Array.from(mappingsDiv.querySelectorAll(".mapping")).map(mapping => {
    return {
      id: mapping.querySelector(".field-id").value,
      text: mapping.querySelector(".field-text").value
    };
  });
  chrome.storage.sync.set({ fieldMappings: mappings }, () => {
    alert("Mappings saved!");
  });
}