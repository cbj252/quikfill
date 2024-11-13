chrome.storage.sync.get("fieldMappings", (data) => {
  const mappings = data.fieldMappings || [];
  mappings.forEach(({ id, text }) => {
    const inputField = document.getElementById(id);
    if (inputField) {
      inputField.value = text;
    }
  });
});
