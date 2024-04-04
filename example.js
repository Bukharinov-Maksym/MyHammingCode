/* Declare func&paths */
var hammingCode = require("./index.js");
const fs = require("fs");
const myFile = "myFile.txt";
const corruptedFile = "corruptedFile.txt";
const decodedFile = "decodedFile.txt";

/* Read initial message from 'myFile.txt' */
var data = readTextFile(myFile);
var binary = stringToBinary(data);

/* Encode initial data using hammingCode.encode() */
encodedData = hammingCode.encode(binary);
console.log("[INFO] Encoded", binary, "\n into \n", encodedData);

/* Simulate 1-bit errors every 16-th bit */
for (let i = 0; i < encodedData.length; i += 16) {
  if (encodedData[i] != 0) encodedData = "0" + encodedData.substring(1);
  else encodedData = "1" + encodedData.substring(1);
}
/* Write encoded binary with simulated errors into file 'corruptedFile.txt' */
fs.writeFile(corruptedFile, binaryToString(encodedData), "utf-8", (err) => {
  if (err) throw err;
});
/* Read corrupted data from 'corruptedFile.txt' and decode it using hammingCode.decode() */
corruptedData = stringToBinary(readTextFile(corruptedFile));
decodedData = hammingCode.decode(corruptedData);
/* Write decoded binary into file 'decodedFile.txt' */
const writeStream = fs.createWriteStream(decodedFile);
writeStream.write(data, "utf8");
writeStream.on("error", (err) => {
  console.error("Error writing file:", err);
});
writeStream.end();

/* Helper functions */
function readTextFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    return fileContent;
  } catch (err) {
    console.error("Error reading file:", err);
    return null;
  }
}
function stringToBinary(str) {
  let binaryString = "";
  for (let i = 0; i < str.length; i++) {
    const asciiCode = str.charCodeAt(i);
    binaryString += asciiCode.toString(2).padStart(8, "0");
  }
  return binaryString;
}
function binaryToString(binaryString) {
  let asciiString = "";
  for (let i = 0; i < binaryString.length; i += 8) {
    const byte = binaryString.substr(i, 8);
    asciiString += String.fromCharCode(parseInt(byte, 2));
  }
  return asciiString;
}