const getDescription = (description) => {
    const strToCompare = description.toLowerCase();

    if (strToCompare.includes('amazon') || strToCompare.includes('amzn')) {
        return 'Amazon';
    } else if (strToCompare.includes('city services')) {
        return 'City of Phx';
    } else if (strToCompare.includes('arizona public service')) {
        return 'APS';
    } else {
        return description;
    }
}

const getCategory = (amount) => parseFloat(amount) < 0 ? 'Credit' : '';

const transform = (record) => {
    const description = getDescription(record.Description);
    const transactionCategory = getCategory(record.Amount);

    return [description, record.Amount, record['Transaction Date'], transactionCategory];
}

export default transform;