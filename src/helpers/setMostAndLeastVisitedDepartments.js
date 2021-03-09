export default (departmentsArray) => {
  let mostVisitedDepartment = null;
  let leastVisitedDepartment = null;
  if (departmentsArray.length > 0 && !(departmentsArray.every((department)=> department.total == 0))) {
    const sortedDepartments = [...departmentsArray].sort((a, b) => (b.total - a.total));
    mostVisitedDepartment = sortedDepartments[0];
    leastVisitedDepartment = sortedDepartments[sortedDepartments.length - 1];
  }
  return {
    mostVisitedDepartment, 
    leastVisitedDepartment
  }
}