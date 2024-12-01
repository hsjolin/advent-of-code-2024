import { Utils } from "../utils/utils";

let answer = 0;
let arr1:number[] = [];
let arr2:number[] = [];

Utils.lineReader<string>(
  "src/01/input.txt",
  /^([0-9]+)\s+([0-9]+)$/,
  (match) => {
    arr1.push(parseInt(match[1]));
    arr2.push(parseInt(match[2]));
    return "";
  },
  (_) => {
    arr1.sort();
    arr2.sort();

    for (var i = 0; i < arr1.length; i++) {
        answer += Math.abs(arr1[i] - arr2[i]);
    }
    console.log(`The answer is: ${answer}`);
  });