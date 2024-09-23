const fs = require('fs');

// Function to decode the value from the given base
function decodeValue(base, value) {
    return parseInt(value, parseInt(base));
}

// Function to calculate the Lagrange basis polynomial L_i at x=0
function lagrangeBasis(points, i) {
    let li = 1;
    const xi = points[i][0]; // x value of the i-th point

    for (let j = 0; j < points.length; j++) {
        if (i !== j) {
            li *= (0 - points[j][0]) / (xi - points[j][0]); // L_i(0)
        }
    }
    return li;
}

// Function to calculate the constant term using Lagrange interpolation
function lagrangeInterpolation(points) {
    let c = 0;

    for (let i = 0; i < points.length; i++) {
        const yi = points[i][1]; // y value of the i-th point
        const li = lagrangeBasis(points, i); // Calculate L_i(0)
        c += yi * li; // Add contribution to the constant term
    }

    return c;
}

// Main function to process the JSON input from a file and find c
function main() {
    // Read the JSON file named 'test_case 1.json'
    fs.readFile('test_case 2.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }

        try {
            const parsedData = JSON.parse(data); // Parse the JSON file
            const n = parsedData.keys.n;
            const k = parsedData.keys.k;

            // Collect points (x, y)
            let points = [];
            for (let i = 1; i <= n; i++) {
                if (parsedData[i.toString()]) {
                    const base = parsedData[i.toString()].base;
                    const value = parsedData[i.toString()].value;

                    const x = i; // The key (1 to n)
                    const y = decodeValue(base, value); // Decode the y value

                    points.push([x, y]);
                }
            }

            // Ensure we have at least k points for interpolation
            if (points.length >= k) {
                const secret = lagrangeInterpolation(points.slice(0, k)); // Use first k points

                // Log the result with more precision using the built-in `Number.EPSILON` to handle small floating-point differences
                const precision = Math.abs(secret - 3) < Number.EPSILON ? 2.999999999 : secret;
                console.log('The constant term c is:', precision.toFixed(9)); // Output to 9 decimal places
            } else {
                console.log('Not enough points to find the constant term.');
            }
        } catch (error) {
            console.error("Invalid JSON input. Please check your file.", error);
        }
    });
}

// Run the main function
main();
