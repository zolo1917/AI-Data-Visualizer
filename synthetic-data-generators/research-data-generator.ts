import * as fs from "fs";
import * as faker from "faker";

interface ExperimentalRecord {
  experimentId: string;
  variable1: number; // e.g., Temperature
  variable2: string; // e.g., Treatment Type
  outcomeMeasure: number;
  experimentDate: string;
  location: string;
  researcherId: string;
  controlFlag: boolean;
  anomalyFlag: boolean;
}

const generateExperimentalRecords = (
  numRecords: number
): ExperimentalRecord[] => {
  const records: ExperimentalRecord[] = [];

  const treatmentTypes = ["Type A", "Type B", "Type C", "Type D"];
  const locations = ["Lab 1", "Lab 2", "Lab 3", "Lab 4"];

  for (let i = 0; i < numRecords; i++) {
    const treatmentType = faker.random.arrayElement(treatmentTypes);

    // Generate variable values with realistic constraints
    const variable1 = faker.random.number({ min: 0, max: 100 }); // Example: Temperature
    let outcomeMeasure = faker.random.number({ min: 0, max: 200 }); // Example: Reaction time

    const isControl = Math.random() < 0.2; // 20% chance of being a control group
    const isAnomaly = Math.random() < 0.05; // 5% chance of experimental anomaly

    if (isControl) {
      // Control group adjustments can be applied here
      outcomeMeasure *= 0.9; // Example: Less variability in outcome measures
    }

    if (isAnomaly) {
      // Anomalies, such as unexpected data spikes
      outcomeMeasure *= faker.random.number({ min: 1.5, max: 3.0 });
    }

    records.push({
      experimentId: `E${(i + 1).toString().padStart(4, "0")}`,
      variable1,
      variable2: treatmentType,
      outcomeMeasure,
      experimentDate: faker.date.past(2).toISOString().split("T")[0],
      location: faker.random.arrayElement(locations),
      researcherId: `R${faker.random.number({ min: 1000, max: 9999 })}`,
      controlFlag: isControl,
      anomalyFlag: isAnomaly,
    });
  }

  return records;
};

const saveToCSV = (filename: string, data: ExperimentalRecord[]): void => {
  const csvHeaders = Object.keys(data[0]).join(",") + "\n";
  const csvData = data
    .map((record) => Object.values(record).join(","))
    .join("\n");
  fs.writeFileSync(filename, csvHeaders + csvData, "utf-8");
};

const numRecords = 10000;
const filename = "synthetic_experimental_data.csv";
const records = generateExperimentalRecords(numRecords);
saveToCSV(filename, records);
console.log(
  `Generated ${numRecords} experimental records and saved to ${filename}`
);
