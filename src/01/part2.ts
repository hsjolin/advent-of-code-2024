import { Utils } from "../utils/utils";

let answer = 0;
let arr1:number[] = [];
let arr2:number[] = [];
const similarityDict = {};

Utils.lineReader<string>(
  "src/01/input.txt",
  /^([0-9]+)\s+([0-9]+)$/,
  (match) => {
    const num1 = parseInt(match[1]); 
    const num2 = parseInt(match[2]); 

    arr1.push(num1);
    arr2.push(num2);

    return "";
  },
  (_) => {
    for (var i = 0; i < arr1.length; i++) {
        const num2 = arr2[i];

        const similarityCount = similarityDict[num2]
            ? similarityDict[num2]
            : 0;
    
        similarityDict[num2] = similarityCount + 1;
    }

    for(var i =0; i < arr1.length; i++) {
        const num1 = arr1[i];

        const similarityCount = similarityDict[num1]
            ? similarityDict[num1]
            : 0;

        answer += similarityCount * num1; 
    }

    console.log(`The answer is: ${answer}`);
  });