import { getBankDescription, checkShouldSkip } from './transformerHelpers.js';

const getCategory = (amount) => parseFloat(amount) < 0 ? 'Debit' : '';

const getAmountLabel = (amount) => parseFloat(amount) < 0 ? Math.abs(amount) : `-${amount}`;

export const bankTransformer = (record) => {
    const shouldSkip = checkShouldSkip(record.Description);

    if(shouldSkip) {
        return [];
    }

    const description = getBankDescription(record.Description);
    const transactionCategory = getCategory(record.Amount);
    const amountLabel = getAmountLabel(record.Amount);
    console.log(parseFloat(record.Amount));

    return [description, amountLabel, record['Posting Date'], transactionCategory];
}