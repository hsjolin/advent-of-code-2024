import { start } from "repl";
import { peek } from "../utils/stringUtil";
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
            const correctedReport = correctReport(report);
            if (correctedReport) {
                analyzeReport(correctedReport);
            }
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

function checkDiff(num1: number, num2: number, trend: string): boolean {
    const diff = trend == "asc"
        ? num2 - num1
        : num1 - num2;

    return diff >= 1 && diff <= 3;
}

function getReportTrend(report: number[]): string {
    let trend = 0;

    for (let i = 1; i < report.length; i++) {
        const num1 = report[i - 1];
        const num2 = report[i];
        trend += num2 - num1;
    }

    return trend < 0
        ? "desc"
        : "asc";
}

function correctReport(report: number[]): number[] {
    const trend = getReportTrend(report);
    let corrected = false;
    while (true) {
        for (let index = 0; index < report.length - 1; index++) {
            if (checkDiff(report[index], report[index + 1], trend)) {
                if (index == report.length - 2) {
                    return report;
                }

                continue;
            }
            if (corrected) {
                return null;
            }
            report.splice(index, 1);
            corrected = true;
            break;
        }
    }
}

