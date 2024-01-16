const sortByDate = (a, b) => {
    const dateA = new Date(a[2]);
    const dateB = new Date(b[2]);
    return dateA - dateB;
  };

export default sortByDate;