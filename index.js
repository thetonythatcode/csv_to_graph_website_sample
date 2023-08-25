const csvFileInput = document.getElementById("csvFileInput");

csvFileInput.addEventListener("change", handleFileUpload);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const csvData = e.target.result;
            const parsedData = parseData(csvData);
            const categorizedData = categorizeData(parsedData);
            createGoogleChart(categorizedData);
        };
        reader.readAsText(file);
    }
}

function parseData(csvData) {
    return Papa.parse(csvData, {
        header: true, // Treat the first row as headers
        skipEmptyLines: true,
    });
}

function categorizeData(parsedData) {
    const dataTable = [];
    const index = {};
    dataTable.push(["Hour", "Long", "Short"]);
    for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, "0") + ":00";
        index[hour] = i + 1;
        dataTable.push([hour, 0, 0]);
    }

    for (const row of parsedData.data) {
        const hour = row["Hour"].slice(0, -2) + "00";
        const idx = index[hour];
        const position = row["Position"] === "Long" ? 1 : 2;
        const value = parseInt(row["Value"]);

        dataTable[idx][position] += value;
    }

    return dataTable;
}

function createGoogleChart(categorizedData) {
    // Load the Visualization API and the corechart package.
    google.charts.load("current", { packages: ["corechart"] });

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    // Callback that creates and populates a data table,
    // draws it.

    function drawChart() {
        // Create the data table.
        const data = google.visualization.arrayToDataTable(categorizedData);

        // Set chart options
        const options = {
            height: 500,
            colors: ["green", "red"],
            legend: { position: "top" },
            bar: { groupWidth: "75%" },
            isStacked: true,
            hAxis: {
                title: "Hours", // X-axis title
            },
            vAxis: {
                title: "Total Value (USD)", // Y-axis title
            },
        };

        // Instantiate and draw our chart, passing in some options.
        const chart = new google.visualization.ColumnChart(
            document.getElementById("chart_div")
        );
        chart.draw(data, options);

        // Create and add the "Download PDF" button
        const downloadButton = document.createElement("button");
        downloadButton.textContent = "Download PDF";
        downloadButton.addEventListener("click", () => generatePDF(chart));

        // Add the button to the page
        document.body.appendChild(downloadButton);
    }
}

async function generatePDF(chart) {
    const pdf = new jsPDF();

    const chartContainer = chart.getContainer();

    const canvas = await html2canvas(chartContainer);

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    pdf.addImage(imgData, "JPEG", 10, 10, 200, 100); // You might need to adjust the positioning and dimensions
    pdf.save("chart.pdf");
}
