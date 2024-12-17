chrome.storage.sync.get("fieldMappings", (data) => {
  const mappings = data.fieldMappings || [];
  const allowedTypes = ["email", "password", "text"];
  const inputFields = document.getElementsByTagName("input");
  mappings.forEach(({ id, text }) => {
    for (let oneInput of inputFields) {
      if (!allowedTypes.includes(oneInput.type) || oneInput.value != "") {
        continue;
      }
      if (
        new RegExp(id, "i").test(oneInput.id) ||
        new RegExp(id, "i").test(oneInput.labels[0]?.textContent) ||
        new RegExp(id, "i").test(oneInput.ariaLabel)
      ) {
        oneInput.value = text;
      }
    }
  });
});
