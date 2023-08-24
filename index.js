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
        complete: function (results) {
            // 'results.data' contains the parsed data as an array of objects
            console.log(results.data);

            // You can access individual rows and columns like this:
            for (const row of results.data) {
                console.log("Hour:", row["Hour"]);
            }
        },
    });
}

function categorizeData(parsedData) {
    console.log(parsedData);
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
        var options = {
            height: 400,
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
        var chart = new google.visualization.ColumnChart(
            document.getElementById("chart_div")
        );
        chart.draw(data, options);
    }
}
