import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { parse } from 'csv-parse';
import sortByDate from './helpers.js';
import { creditTransformer } from './creditTransformer.js';
import { bankTransformer } from './bankTransformer.js';

const docType = process.argv[2];

const currentFilePath = fileURLToPath(import.meta.url);
const inputCsvPath = `../doc/input/${docType}.CSV`;
const outputCsvPath = resolve(`./doc/output/${docType}Parsed.CSV`);

const currentDir = dirname(currentFilePath);
const resolvedInputCsvPath = resolve(currentDir, inputCsvPath);
const resolvedOutputCsvPath = resolve(currentDir, outputCsvPath);

// Check if the input file exists
if (!existsSync(resolvedInputCsvPath)) {
  console.error(`Error: File not found at ${resolvedInputCsvPath}`);
  process.exit(1); // Terminate the script
}

// Check the output directory exists, create it if it doesn't
const outputDir = dirname(resolvedOutputCsvPath);
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

const csvReadStream = createReadStream(resolvedInputCsvPath);
const csvWriteStream = createWriteStream(resolvedOutputCsvPath, { flags: 'w' });
const parser = parse({ delimiter: ',', columns: true });

// Array to accumulate transformed data
const transformedData = [];

csvReadStream
  .pipe(parser)
  .on('data', (row) => {
    if (parser.options.columns && parser.count === 1) {
      // Skip the header row
      return;
    }

    let transformedOutput;

    if(docType === 'bank') {
      transformedOutput = bankTransformer(row);
    } else {
      transformedOutput = creditTransformer(row);
    }

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
