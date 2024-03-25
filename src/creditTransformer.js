import { getCreditDescription, checkShouldSkip } from './transformerHelpers.js';

const getCategory = (amount) => amount < 0 ? 'Credit' : '';

const getAmountLabel = (amount) => amount < 0 ? Math.abs(amount).toFixed(2) : `-${amount}`;

export const creditTransformer = (record) => {
    const shouldSkip = checkShouldSkip(record.Description);

    if(shouldSkip) {
        return [];
    }

    
    let formatNumber = parseFloat(record.Amount).toFixed(2);
        
    if (!formatNumber.includes('.')) {
        formatNumber += ".00";
    }

    const description = getCreditDescription(record.Description);
    const transactionCategory = getCategory(formatNumber);
    const amountLabel = getAmountLabel(formatNumber);

    return [description, amountLabel, record['Transaction Date'], transactionCategory];
}