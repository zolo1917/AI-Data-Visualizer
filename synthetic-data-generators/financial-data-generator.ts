import * as fs from "fs";
import { faker } from "@faker-js/faker";

interface TransactionRecord {
  transactionId: string;
  dateOfTransaction: string;
  accountId: string;
  transactionAmount: bigint;
  transactionType: string;
  location: string;
  accountBalanceAfter: bigint;
  customerSegment: string;
  fraudFlag: boolean;
}

const generateTransactionRecords = (
  numRecords: number
): TransactionRecord[] => {
  const records: TransactionRecord[] = [];

  const transactionTypes = ["Deposit", "Withdrawal", "Transfer"];
  const customerSegments = ["Retail", "Corporate", "SME"];
  const locations = ["New York", "London", "Tokyo", "Sydney"];

  for (let i = 0; i < numRecords; i++) {
    const transactionType = faker.helpers.arrayElement(transactionTypes);

    // Assign a random initial balance and simulate transactions
    let accountBalanceBefore = faker.number.bigInt({ min: 1000, max: 100000 });
    let transactionAmount = faker.number.bigInt({ min: 10, max: 5000 });

    if (
      transactionType === "Withdrawal" &&
      transactionAmount > accountBalanceBefore
    ) {
      transactionAmount = faker.number.bigInt({
        min: 10,
        max: accountBalanceBefore,
      });
    }

    const isFraud = Math.random() < 0.02; // 2% transactions flagged as fraud

    if (isFraud) {
      // Fraudulent transactions may be significantly larger or as bizarre patterns
      transactionAmount *= faker.number.bigInt({ min: 2, max: 10 });
    }

    const accountBalanceAfter =
      transactionType === "Deposit"
        ? accountBalanceBefore + transactionAmount
        : accountBalanceBefore - transactionAmount;

    records.push({
      transactionId: `T${(i + 1).toString().padStart(4, "0")}`,
      dateOfTransaction: faker.date.past().toISOString().split("T")[0],
      accountId: `A${faker.number.bigInt({ min: 1000, max: 9999 })}`,
      transactionAmount,
      transactionType,
      location: faker.helpers.arrayElement(locations),
      accountBalanceAfter,
      customerSegment: faker.helpers.arrayElement(customerSegments),
      fraudFlag: isFraud,
    });
  }

  return records;
};

const saveToCSV = (filename: string, data: TransactionRecord[]): void => {
  const csvHeaders = Object.keys(data[0]).join(",") + "\n";
  const csvData = data
    .map((record) => Object.values(record).join(","))
    .join("\n");
  fs.writeFileSync(filename, csvHeaders + csvData, "utf-8");
};

const numRecords = 10000;
const filename = "synthetic_financial_transactions.csv";
const records = generateTransactionRecords(numRecords);
saveToCSV(filename, records);
console.log(
  `Generated ${numRecords} financial records and saved to ${filename}`
);
