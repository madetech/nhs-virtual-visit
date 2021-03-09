const compareTotal = (a, b) => (b.total - a.total);

export const getMostAndLeastVisitedList = (facilitiesOrDepartmentsArray, listItemCount) => {
    const sortedArray = [...facilitiesOrDepartmentsArray].sort(compareTotal);
    const mostVisitedList = sortedArray.slice(0, listItemCount);
    const leastVisitedList = sortedArray.slice(-listItemCount).reverse();
    return {
        mostVisitedList,
        leastVisitedList
    }
}

export const getMostAndLeastVisited = (facilityOrDepartmentArray) => {
    let mostVisited = null;
    let leastVisited = null;
    if (facilityOrDepartmentArray.length > 0 && !(facilityOrDepartmentArray.every((elem)=> elem.total == 0))) {
      const sortedArray = [...facilityOrDepartmentArray].sort(compareTotal);
      mostVisited = sortedArray[0];
      leastVisited = sortedArray[sortedArray.length - 1];
    }
    return {
      mostVisited, 
      leastVisited
    }
}