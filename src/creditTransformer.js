import { getCreditDescription, checkShouldSkip } from './transformerHelpers.js';

const getCategory = (amount) => parseFloat(amount) < 0 ? 'Credit' : '';

const getAmountLabel = (amount) => parseFloat(amount) < 0 ? Math.abs(amount) : `-${amount}`;

export const creditTransformer = (record) => {
    const shouldSkip = checkShouldSkip(record.Description);

    if(shouldSkip) {
        return [];
    }
    
    const description = getCreditDescription(record.Description);
    const transactionCategory = getCategory(record.Amount);
    const amountLabel = getAmountLabel(record.Amount);

    return [description, amountLabel, record['Transaction Date'], transactionCategory];
}