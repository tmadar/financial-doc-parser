import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { parse } from 'csv-parse';
import sortByDate from './helpers.js';
import { creditTransformer } from './creditTransformer.js';
import { bankTransformer } from './bankTransformer.js';

const currentFilePath = fileURLToPath(import.meta.url);
const inputCreditCsvPath = `../doc/input/credit.CSV`;
const inputBankCsvPath = `../doc/input/bank.CSV`;
const outputCsvPath = resolve(`./doc/output/CombinedParsed.CSV`);

const currentDir = dirname(currentFilePath);
const resolvedCreditInputCsvPath = resolve(currentDir, inputCreditCsvPath);
const resolvedBankInputCsvPath = resolve(currentDir, inputBankCsvPath);
const resolvedOutputCsvPath = resolve(currentDir, outputCsvPath);

// Check if the input file exists
if (!existsSync(resolvedCreditInputCsvPath)) {
  console.error(`Error: File not found at ${resolvedCreditInputCsvPath}`);
  process.exit(1); // Terminate the script
}

if (!existsSync(resolvedBankInputCsvPath)) {
    console.error(`Error: File not found at ${resolvedBankInputCsvPath}`);
    process.exit(1); // Terminate the script
  }

// Check the output directory exists, create it if it doesn't
const outputDir = dirname(resolvedOutputCsvPath);
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

const csvCreditReadStream = createReadStream(resolvedCreditInputCsvPath);
const csvBankReadStream = createReadStream(resolvedBankInputCsvPath);
const csvWriteStream = createWriteStream(resolvedOutputCsvPath, { flags: 'w' });
const creditParser = parse({ delimiter: ',', columns: true });
const bankParser = parse({ delimiter: ',', columns: true });

// Array to accumulate transformed data
const transformedData = [];

csvCreditReadStream
  .pipe(creditParser)
  .on('data', (row) => {
    if (creditParser.options.columns && creditParser.count === 1) {
      // Skip the header row
      return;
    }

    const transformedOutput = creditTransformer(row);

    transformedData.push(transformedOutput);
  })
  .on('end', () => {
    csvBankReadStream
        .pipe(bankParser)
        .on('data', (row) => {
            if (bankParser.options.columns && bankParser.count === 1) {
            // Skip the header row
            return;
            }

            const transformedOutput = bankTransformer(row);

            transformedData.push(transformedOutput);
        })
        .on('end', () => {
            const combinedCsvString = transformedData
                .filter(subArray => subArray.length > 0)
                .sort(sortByDate)
                .map(row => row.join(',')).join('\n');

            csvWriteStream.write(combinedCsvString);
            csvWriteStream.end();

            csvWriteStream.on('finish', () => {
                console.log('CSV file successfully parsed and written to:', resolvedOutputCsvPath);
            });
        });
  });
