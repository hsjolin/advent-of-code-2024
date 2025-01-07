import { Utils } from "../utils/utils";

let answer = 0;

Utils.lineReader<number[]>(
    "src/02/input.txt",
    /((?:\d+\s?)+)/,
    match => {
        const numbers = match[1]
            .split(" ")
            .map(s => parseInt(s));

        return numbers;
    },
    result => {
        answer = 0;
        for (let i = 0; i < result.length; i++) {
            const report = result[i];
            analyzeReport(report);
        }

        console.log(`The answer is: ${answer}`);
    }
);

function analyzeReport(report: number[]) {
    if (report[0] == report[1]) {
        return;
    }

    const direction = report[0] < report[1]
        ? "asc"
        : "desc";

    for (let i = 1; i < report.length; i++) {
        const num1 = report[i - 1];
        const num2 = report[i];

        if (!num2) {
            break;
        }

        let diff = direction == "asc"
            ? num2 - num1
            : num1 - num2;


        if (diff < 1 || diff > 3) {
            return;
        }
    }

    answer++;
}

