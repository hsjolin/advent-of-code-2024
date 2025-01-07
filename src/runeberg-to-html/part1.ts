import { start } from "repl";
import StringReader from "../utils/stringReader";
import * as fs from "fs";

const input = fs.readFileSync("src/LaTex-convert/input.txt", {
    encoding: "utf-8"
});

const foundTags = {};

const document = `<html><body>${input}</body></html>`;
const output = parse({ name: "html", args: {} }, new StringReader(document));
fs.writeFileSync("output.html", output);
for (let i = 0; i < Object.keys(foundTags).length; i++) {
    console.log(Object.keys(foundTags)[i]);
}

function parse(tag: tag1, reader: StringReader): string {
    if (reader.isEOL()) {
        console.log(`Reached EOF (expected end tag of ${tag})`);
    }

    let result = "";
    while (!reader.isEOL()) {
        const char = reader.read(1);
        switch (char) {
            case "<":
                if (reader.peek() === "/") {
                    // End tag reached
                    const replacedTag = replaceTag(tag);

                    reader.read(1);
                    const endTag = createTagFromString(reader.readUntil(s => s === ">"));
                    if (tag.name !== endTag.name) {
                        throw Error(`Endtag mismatch. Expected ${tag.name} was ${endTag.name}`);
                    }
                    reader.read(1);
                    return renderTag(replacedTag, result);
                } else {
                    const startTag = createTagFromString(reader.readUntil(s => s === ">"));
                    reader.read(1);

                    if (isSelfClosingTag(startTag)) {
                        result += renderTag(replaceTag(startTag), "");
                    } else {
                        result += parse(startTag, reader);
                    }

                    foundTags[startTag.name] = 1;
                }

                break;
            case "\n":
                if (reader.peek() == "\n") {
                    result += "<br /><br />";
                }
            default:
                result += char;
        }
    }

    return result;
}

interface tag1 {
    name: string;
    args: {};
}

function renderTag(tag: tag1, content: string): string {
    if (tag == null) {
        return content;
    }

    return !isSelfClosingTag(tag)
        ? `<${tag.name}>${content}</${tag.name}>`
        : `<${tag.name} />${content}`;
}

function isSelfClosingTag(tag: tag1): boolean {
    const selfClosingTags = [
        "br",
        "tab"
    ];

    return selfClosingTags.includes(tag.name);
}

function createTagFromString(tag: string): tag1 {
    const tagArr = tag.split(" ")
        .filter(s => s.length > 0);

    const args = {};
    for (let i = 1; i < tagArr.length; i++) {
        const arrNameAndValue = tagArr[i].split("=");
        args[arrNameAndValue[0]] = arrNameAndValue[1].replace(/\"/g, "");
    }

    return {
        name: tagArr[0],
        args
    }
}

function replaceTag(tag: tag1): tag1 {
    switch (tag.name) {
        case "img":
            return { name: "p", args: {} };
        case "sc":
            return { name: "i", args: {} };
        case "chapter":
            return { name: "div", args: tag.args };
        case "tab":
            return { name: "", args: {} };
        case "poem":
            return { name: "blockquote", args: {} };
        case "footnote":
            return { name: "q", args: {} };
        default:
            return tag;
    }
}

