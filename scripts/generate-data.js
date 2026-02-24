import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOTAL = 1_000_000;

const merchants = ["TechCorp", "Amazon", "Flipkart", "Walmart", "Target", "Infosys"];
const categories = ["Electronics", "Food", "Clothing", "Travel", "Finance"];
const statuses = ["Completed", "Pending", "Failed"];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomAmount() {
  return parseFloat((Math.random() * 10000).toFixed(2));
}

function randomDate() {
  return new Date(
    Date.now() - Math.floor(Math.random() * 10000000000)
  ).toISOString();
}

const data = [];

for (let i = 0; i < TOTAL; i++) {
  data.push({
    id: i + 1,
    date: randomDate(),
    merchant: randomItem(merchants),
    category: randomItem(categories),
    amount: randomAmount(),
    status: randomItem(statuses),
    description: "Transaction " + (i + 1),
  });
}

const outputPath = path.join(__dirname, "../public/transactions.json");

fs.writeFileSync(outputPath, JSON.stringify(data));

console.log("1,000,000 records generated successfully!");