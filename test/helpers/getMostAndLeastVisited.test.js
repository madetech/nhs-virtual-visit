import {
getMostAndLeastVisited,
getMostAndLeastVisitedList,
  } from "../../src/helpers/getMostAndLeastVisited";

describe("getMostAndLeastVisited",()=>{
    it("returns null when receives a null list", ()=>{
        expect(getMostAndLeastVisited([])).toEqual({mostVisited: null, leastVisited: null});
    })
    it("returns mostVisited and leastVisited to be null when receives total in all objects are 0", ()=>{
        const inputArray = [
            { name: "Ward 1", total: 0 },
            { name: "Ward 2", total: 0 },
            { name: "Ward 2", total: 0 },
        ]
        const expectedResult = { 
            mostVisited: null, 
            leastVisited: null
        };
        expect(getMostAndLeastVisited(inputArray)).toEqual(expectedResult);
    })
    it("returns mostVisited and leastVisited to be the same department/facility when receives only one obj in array", ()=>{
        const inputArray = [
            { name: "Ward 1", total: 2 },
        ]
        const expectedResult = { 
            mostVisited: { name: "Ward 1", total: 2 }, 
            leastVisited: { name: "Ward 1", total: 2 }
        };
        expect(getMostAndLeastVisited(inputArray)).toEqual(expectedResult);
    })
    it("returns correct array of obj when receives a non-null list", ()=>{
        const inputArray = [
            { name: "Ward 1", total: 5 },
            { name: "Ward 2", total: 0 },
            { name: "Ward 3", total: 10 },
        ]
        const expectedResult = { 
            mostVisited: { name: "Ward 3", total: 10 }, 
            leastVisited: { name: "Ward 2", total: 0 }
        };
        expect(getMostAndLeastVisited(inputArray)).toEqual(expectedResult);
    })
});

describe("getMostAndLeastVisitedList", ()=>{
    it("returns mostVisited and leastVisited with empty arrays when there list given is empty", () => {
        expect(getMostAndLeastVisitedList([])).toEqual({ mostVisitedList: [], leastVisitedList: [] })
    })
    it("returns the correct arrays when given an array of size 1", ()=>{
        const inputArray = [
            { name: "Hospital 1", total: 5 },
        ];
        const expectedResult = {
            mostVisitedList: [{ name: "Hospital 1", total: 5 }],
            leastVisitedList: [{ name: "Hospital 1", total: 5 }]
        };
        expect(getMostAndLeastVisitedList(inputArray,3)).toEqual(expectedResult);
    })
    it("returns the correct arrays when given an array of size 2", ()=>{
        const inputArray = [
            { name: "Hospital 1", total: 5 },
            { name: "Hospital 2", total: 0 },
        ];
        const expectedResult = {
            mostVisitedList: [{ name: "Hospital 1", total: 5 }, { name: "Hospital 2", total: 0 }],
            leastVisitedList: [{ name: "Hospital 2", total: 0 }, { name: "Hospital 1", total: 5 }]
        };
        expect(getMostAndLeastVisitedList(inputArray,3)).toEqual(expectedResult);
    })
    it("returns the correct arrays when given an array of size 3", ()=>{
        const inputArray = [
            { name: "Hospital 1", total: 5 },
            { name: "Hospital 2", total: 0 },
            { name: "Hospital 3", total: 10 },
        ];
        const expectedResult = {
            mostVisitedList: [{ name: "Hospital 3", total: 10 }, { name: "Hospital 1", total: 5 }, { name: "Hospital 2", total: 0 }],
            leastVisitedList: [{ name: "Hospital 2", total: 0 }, { name: "Hospital 1", total: 5 }, { name: "Hospital 3", total: 10 }]
        };
        expect(getMostAndLeastVisitedList(inputArray,3)).toEqual(expectedResult);
    })
    it("returns the correct arrays when given an array of more than second argument", ()=>{
        const inputArray = [
            { name: "Hospital 1", total: 5 },
            { name: "Hospital 2", total: 0 },
            { name: "Hospital 3", total: 10 },
            { name: "Hospital 4", total: 20 },
        ];
        const expectedResult = {
            mostVisitedList: [{ name: "Hospital 4", total: 20 }, { name: "Hospital 3", total: 10 }, { name: "Hospital 1", total: 5 }],
            leastVisitedList: [{ name: "Hospital 2", total: 0 }, { name: "Hospital 1", total: 5 }, { name: "Hospital 3", total: 10 }]
        };
        expect(getMostAndLeastVisitedList(inputArray,3)).toEqual(expectedResult);
    })
})