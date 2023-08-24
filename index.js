const csvFileInput = document.getElementById("csvFileInput");

csvFileInput.addEventListener("change", handleFileUpload);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const csvData = e.target.result;
            parseData(csvData);
        };
        reader.readAsText(file);
    }
}
