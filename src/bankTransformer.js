import { getBankDescription, checkShouldSkip } from './transformerHelpers.js';

const getCategory = (amount) => amount < 0 ? 'Debit' : '';

const getAmountLabel = (amount) => amount < 0 ? Math.abs(amount).toFixed(2) : `-${amount}`;

export const bankTransformer = (record) => {
    const shouldSkip = checkShouldSkip(record.Description);

    if(shouldSkip) {
        return [];
    }

    let formatNumber = parseFloat(record.Amount).toFixed(2);
    
    if (!formatNumber.includes('.')) {
        formatNumber += ".00";
    }

    const description = getBankDescription(record.Description);
    const transactionCategory = getCategory(formatNumber);
    const amountLabel = getAmountLabel(formatNumber);

    return [description, amountLabel, record['Posting Date'], transactionCategory];
}