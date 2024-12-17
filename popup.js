document.addEventListener("DOMContentLoaded", async () => {
  chrome.storage.sync.get("fieldMappings", (data) => {
    const mappings = data.fieldMappings || [];
    mappings.forEach(({ id, text }) => addMappingInput(id, text));
    updateTableVisibility();
  });

  document.getElementById("addMapping").addEventListener("click", () => {
    addMappingInput();
  });

  document.getElementById("fillFields").addEventListener("click", async () => {
    saveMappings();
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab.url?.startsWith("chrome://")) {
      return;
    }
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["contentScript.js"],
    });
  });
});

window.addEventListener("visibilitychange", () => {
  saveMappings();
});

document.getElementById("help").addEventListener("click", () => {
  chrome.tabs.create({ url: "help.html" });
});

function addMappingInput(id = "", text = "") {
  const mappingRow = document.createElement("tr");
  mappingRow.className = "mapping";
  mappingRow.innerHTML = `
    <td> <button class="moveUp">&uarr;</button> </td>
    <td> <button class="moveDown">&darr;</button> </td>
    <td> <input type="text" class="field-id" placeholder="Key to search for in form" value="${id}"> </td>
    <td> <input type="text" class="field-text" placeholder="Text to fill" value="${text}"> </td>
    <td> <button class="removeMapping">Remove</button> </td>
  `;

  mappingRow.querySelector(".moveUp").addEventListener("click", () => {
    const prevSibling = mappingRow.previousElementSibling;
    if (prevSibling) {
      mappingRow.parentNode.insertBefore(mappingRow, prevSibling);
      saveMappings();
    }
  });

  mappingRow.querySelector(".moveDown").addEventListener("click", () => {
    const nextSibling = mappingRow.nextElementSibling;
    if (nextSibling) {
      mappingRow.parentNode.insertBefore(nextSibling, mappingRow);
      saveMappings();
    }
  });

  mappingRow.querySelector(".removeMapping").addEventListener("click", () => {
    mappingRow.remove();
    saveMappings();
    updateTableVisibility();
  });

  document.getElementById("mappings").appendChild(mappingRow);
  updateTableVisibility();
}

function saveMappings() {
  const mappingsDiv = document.getElementById("mappings");
  const mappings = Array.from(mappingsDiv.querySelectorAll(".mapping")).map(
    (mapping) => {
      return {
        id: mapping.querySelector(".field-id").value,
        text: mapping.querySelector(".field-text").value,
      };
    }
  );
  chrome.storage.sync.set({ fieldMappings: mappings }, () => {});
}

function updateTableVisibility() {
  const mappingsTable = document.querySelector("table");
  const noMappingsMessage = document.getElementById("noMappingsMessage");
  const hasMappings = document.querySelectorAll(".mapping").length > 0;

  if (hasMappings) {
    mappingsTable.style.display = "table";
    noMappingsMessage.style.display = "none";
  } else {
    mappingsTable.style.display = "none";
    noMappingsMessage.style.display = "block";
  }
}
