import { faker } from "@faker-js/faker";
import * as fs from "fs";
interface CustomerRecord {
  customerId: string;
  age: number;
  gender: string;
  incomeLevel: bigint;
  productCategory: string;
  purchaseAmount: bigint;
  purchaseDate: string;
  geographicRegion: string;
  customerLoyaltyScore: number;
  marketingChannel: string;
}

const generateCustomerRecords = (numRecords: number): CustomerRecord[] => {
  const records: CustomerRecord[] = [];

  const productCategories = ["Smartphone", "Laptop", "Tablet", "Accessories"];
  const regions = ["North America", "Europe", "Asia", "South America"];
  const marketingChannels = [
    "Online Ads",
    "TV",
    "Social Media",
    "In-Store Promotion",
  ];

  for (let i = 0; i < numRecords; i++) {
    const productCategory = faker.helpers.arrayElement(productCategories);
    let purchaseAmount;

    // Assign purchase amount based on category
    switch (productCategory) {
      case "Smartphone":
        purchaseAmount = faker.number.bigInt({ min: 500, max: 1200 });
        break;
      case "Laptop":
        purchaseAmount = faker.number.bigInt({ min: 800, max: 2000 });
        break;
      case "Tablet":
        purchaseAmount = faker.number.bigInt({ min: 200, max: 600 });
        break;
      default: // Accessories
        purchaseAmount = faker.number.bigInt({ min: 10, max: 100 });
    }

    // Intentional outliers: 1% chance
    if (Math.random() < 0.01) {
      purchaseAmount *= faker.number.bigInt({ min: 2, max: 3 });
    }

    const record: CustomerRecord = {
      customerId: `C${(i + 1).toString()}`,
      age: faker.number.int({ min: 18, max: 65 }),
      gender: faker.helpers.arrayElement(["Male", "Female"]),
      incomeLevel: faker.number.bigInt({ min: 20000, max: 150000 }),
      productCategory,
      purchaseAmount,
      purchaseDate: faker.date.past().toISOString().split("T")[0],
      geographicRegion: faker.helpers.arrayElement(regions),
      customerLoyaltyScore: faker.number.int({ min: 1, max: 10 }),
      marketingChannel: faker.helpers.arrayElement(marketingChannels),
    };

    records.push(record);
  }

  return records;
};

const saveToCSV = (filename: string, data: CustomerRecord[]): void => {
  const csvHeaders = Object.keys(data[0]).join(",") + "\n";
  console.log(data);
  const csvData = data
    .map((record) => Object.values(record).map(String).join(","))
    .join("\n");
  fs.writeFileSync(filename, csvHeaders + csvData, "utf-8");
};

const numRecords = 10000;
const filename = "synthetic_market_analysis_dataset.csv";
const records = generateCustomerRecords(numRecords);
saveToCSV(filename, records);
console.log(`Generated ${numRecords} records and saved to ${filename}`);
