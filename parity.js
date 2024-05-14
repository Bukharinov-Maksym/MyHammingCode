const fs = require("fs");
const myFile = "myFile.txt";
const corruptedFile = "corruptedFile.txt";
const decodedFile = "decodedFile.txt";
/* Read initial message from 'myFile.txt' */
var data = readTextFile(myFile);
var binary = stringToBinary(data);
console.log("[INF] Initial data: ", binary)
var segment = 3
console.log("[INF] Segment length: ", segment)

var encoded = encode(binary, segment)
console.log("[INF] Encoded data: ", encoded)
var encodedCorrupt = encoded
/* Simulate errors in every 3rd segment */
encodedCorrupt = introduceErrors(encoded, segment)
console.log("[INF] Corrupted data: ", encodedCorrupt)

writeStringToFile(binaryToString(encodedCorrupt), corruptedFile)
var decoded = decode(encodedCorrupt, segment)
console.log("[INF] Decoded data: ", decoded)
writeStringToFile(binaryToString(clear(decoded)), decodedFile)



function encode(inputBits, segmentLength) {
    let encodedString = '';

    // Segmented input
    for (let i = 0; i < inputBits.length; i += segmentLength) {
        let segment = inputBits.substr(i, segmentLength);

        // Count 1's in segment
        let onesCount = 0;
        for (let j = 0; j < segment.length; j++) {
            if (segment[j] === '1') {
                onesCount++;
            }
        }

        // Generate parity bit for current segment
        let parityBit = (onesCount % 2 === 0) ? '0' : '1';

        // Add segment & parity bit to output
        encodedString += segment + parityBit;
    }

    return encodedString;
}
function decode(encodedString, segmentLength) {
    let decodedString = '';
    
    // Loop through encoded string by segments
    for (let i = 0; i < encodedString.length; i += segmentLength + 1) {
        let segmentWithParity = encodedString.substr(i, segmentLength + 1);
        let segment = segmentWithParity.slice(0, -1); // Extract segment excluding parity bit
        let parityBit = segmentWithParity.slice(-1); // Extract parity bit
        
        // Count 1's in segment
        let onesCount = 0;
        for (let j = 0; j < segment.length; j++) {
            if (segment[j] === '1') {
                onesCount++;
            }
        }

        // Compare calculated parity bit with received parity bit
        if ((onesCount % 2 === 0 && parityBit === '0') || (onesCount % 2 !== 0 && parityBit === '1')) {
            // Parity check passed, add segment to decoded string
            decodedString += segment;
        } else {
            // Parity check failed, mark segment as erroneous
            decodedString += "[" + segment + "]";
            console.log("[ERR] Corrupted segment marked with [ ] ")
        }
    }

    return decodedString;
}

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
  function writeStringToFile(stringData, filePath) {
    fs.writeFile(filePath, stringData, (err) => {
        if (err) {
            console.error("Error writing to file:", err);
        } else {
            console.log("[INF] String has been written to file successfully");
        }
    });
}
function clear(str) {
    // Delete all chars except 0 and 1
    const cleanStr = str.replace(/[^01]/g, '');
    return cleanStr;
}
function introduceErrors(encodedString, segmentLength) {
    let segments = [];
    let errorEncodedString = '';

    // Segment encoded string
    for (let i = 0; i < encodedString.length; i += segmentLength + 1) {
        segments.push(encodedString.substr(i, segmentLength + 1));
    }

    // Make an error in every 3rd segment
    for (let i = 0; i < segments.length; i++) {
        if ((i + 1) % 3 === 0) {
            let segment = segments[i];
            let randomIndex = Math.floor(Math.random() * segmentLength); // Случайный индекс бита в сегменте
            let newBit = segment[randomIndex] === '0' ? '1' : '0'; // Меняем бит на противоположный
            let newSegment = segment.substr(0, randomIndex) + newBit + segment.substr(randomIndex + 1);
            segments[i] = newSegment;
        }
    }

    // Add segments to final string with errors
    errorEncodedString = segments.join('');

    return errorEncodedString;
}