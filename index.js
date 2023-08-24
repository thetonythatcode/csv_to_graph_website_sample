const csvFileInput = document.getElementById("csvFileInput");

csvFileInput.addEventListener("change", handleFileUpload);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const csvData = e.target.result;
            parseData(csvData);
            createGoogleChart(csvData);
        };
        reader.readAsText(file);
    }
}

function parseData(csvData) {
    Papa.parse(csvData, {
        header: true, // Treat the first row as headers
        skipEmptyLines: true,
        complete: function (results) {
            // 'results.data' contains the parsed data as an array of objects
            console.log(results.data);

            // You can access individual rows and columns like this:
            for (const row of results.data) {
                console.log("Stock ID:", row["Stock ID"]);
                console.log("Date:", row["Date"]);
                console.log("Hour:", row["Hour"]);
                console.log("Transaction:", row["Transaction"]);
                console.log("Price:", row["Price"]);
            }
        },
    });
}

function createGoogleChart(parsedData) {
    // Load the Visualization API and the corechart package.
    google.charts.load("current", { packages: ["corechart"] });

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart() {
        // Create the data table.
        var data = google.visualization.arrayToDataTable([
            [
                "Genre",
                "Fantasy & Sci Fi",
                "Romance",
                "Mystery/Crime",
                "General",
                "Western",
                "Literature",
                { role: "annotation" },
            ],
            ["2010", 10, 24, 20, 32, 18, 5, ""],
            ["2020", 16, 22, 23, 30, 16, 9, ""],
            ["2030", 28, 19, 29, 30, 12, 13, ""],
        ]);

        // Set chart options
        var options = {
            width: 600,
            height: 400,
            legend: { position: "top", maxLines: 3 },
            bar: { groupWidth: "75%" },
            isStacked: true,
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.ColumnChart(
            document.getElementById("chart_div")
        );
        chart.draw(data, options);
    }
}
