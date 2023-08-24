const fs = require("fs");

function generateRandomData(numEntries) {
    const positions = ["Long", "Short"];
    const csvData = [["Hour", "Position", "Value"]];

    for (let i = 0; i < numEntries; i++) {
        const hour = generateRandomHour();
        const position =
            positions[Math.floor(Math.random() * positions.length)];
        const value = Math.floor(Math.random() * 100) + 1;

        csvData.push([hour, position, value]);
    }

    return csvData;
}

function generateRandomHour() {
    const hours = String(Math.floor(Math.random() * 24)).padStart(2, "0");
    const minutes = String(Math.floor(Math.random() * 60)).padStart(2, "0");
    return `${hours}:${minutes}`;
}

const numEntries = 100;
const csvData = generateRandomData(numEntries);

const csvString = csvData.map((row) => row.join(",")).join("\n");

fs.writeFileSync("output.csv", csvString, "utf-8");
