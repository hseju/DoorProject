// Function to toggle the visibility of door options based on the selection and validate porch height
function toggleDoorOptions() {
    const door = document.getElementById('door').value;
    const doorPositionContainer = document.getElementById('doorPositionContainer');
    const doorSizeContainer = document.getElementById('doorSizeContainer');
    const height = parseFloat(document.getElementById('height').value) || 0;
    const doorHeightError = document.getElementById('doorHeightError');

    // Hide error message initially
    doorHeightError.style.display = 'none';

    if (door === 'yes') {
        // Check if the porch height is less than 80 inches
        if (height < 80) {
            // Show error message near the selection
            doorHeightError.style.display = 'block';

            // Reset the door selection to "No" if the height is insufficient
            document.getElementById('door').value = 'no';
            doorPositionContainer.style.display = 'none';
            doorSizeContainer.style.display = 'none';
            return;
        }
        // Show the door options if the height is valid
        doorPositionContainer.style.display = 'block';
        doorSizeContainer.style.display = 'block';


        // Show the transom width question if the height is greater than 80 inches
        if (height > 80) {
            transomWidthContainer.style.display = 'block';
        }


    } else {
        doorPositionContainer.style.display = 'none';
        doorSizeContainer.style.display = 'none';
    }

    // Trigger visualization whenever door options are toggled
    visualize();
}

// Add event listener to the height input field to revalidate when the height changes
document.getElementById('height').addEventListener('input', () => {
    const door = document.getElementById('door').value;
    if (door === 'yes') {
        toggleDoorOptions();
    }
});



// Function to handle the layout selection
function selectLayout(selectedLayout) {
    // Hide all radio buttons and images except the selected one
    const layoutSelection = document.getElementById('layoutSelection');
    const radios = layoutSelection.querySelectorAll('input[type="radio"]');
    const labels = layoutSelection.querySelectorAll('label');
    const images = layoutSelection.querySelectorAll('img');
    const questions = document.getElementById('questions');
    const contactSection = document.getElementById('contactSection');
    const resetSelectionButton = document.getElementById('resetSelectionButton');
    const selectedLayoutHeading = document.getElementById('selectedLayoutHeading');
    const generateQuoteButton = document.getElementById('generateQuoteButton');

    // Check if the selected layout is "None of the above"
    if (selectedLayout === 'none') {
        // Hide all questions and visualization sections
        questions.style.display = 'none';
        contactSection.style.display = 'block'; // Show contact message and form
        selectedLayoutHeading.style.display = 'none'; // Hide "Layout selected" heading
        resetSelectionButton.style.display = 'none'; // Hide the reset button
        generateQuoteButton.style.display = 'none'; // Hide the Generate Quote button
    } else {
        // Show the input questions if any other layout is selected
        questions.style.display = 'block';
        contactSection.style.display = 'none'; // Hide contact section
        selectedLayoutHeading.style.display = 'block'; // Show "Layout selected" heading
        resetSelectionButton.style.display = 'block'; // Show the reset button
        generateQuoteButton.style.display = 'block'; // Show the Generate Quote button
    }

    radios.forEach(radio => {
        if (radio.value !== selectedLayout) {
            radio.style.display = 'none';
        } else {
            radio.style.display = 'none'; // Hide the radio button of the selected option
        }
    });

    labels.forEach(label => {
        if (!label.htmlFor.includes(selectedLayout)) {
            label.style.display = 'none';
        }
    });

    images.forEach(img => {
        if (!img.alt.includes(selectedLayout.charAt(selectedLayout.length - 1).toUpperCase())) {
            img.style.display = 'none';
        }
    });

    // Show the reset button to change the layout selection
    resetSelectionButton.style.display = 'block';
}





// Function to reset the layout selection and show all options again
function resetSelection() {
    // Show all radio buttons and images again
    const layoutSelection = document.getElementById('layoutSelection');
    const radios = layoutSelection.querySelectorAll('input[type="radio"]');
    const labels = layoutSelection.querySelectorAll('label');
    const images = layoutSelection.querySelectorAll('img');

    radios.forEach(radio => {
        radio.style.display = 'inline';
        radio.checked = false; // Unselect all radio buttons
    });

    labels.forEach(label => {
        label.style.display = 'inline';
    });

    images.forEach(img => {
        img.style.display = 'inline';
    });

    // Hide the reset button and the "Layout selected" heading
    document.getElementById('resetSelectionButton').style.display = 'none';
    document.getElementById('selectedLayoutHeading').style.display = 'none';
}



// Function to handle the visualization
function visualize() {
    const width = parseFloat(document.getElementById('width').value) || 0;
    const height = parseFloat(document.getElementById('height').value) || 0;
    const door = document.getElementById('door').value;
    const doorPosition = parseFloat(document.getElementById('doorPosition').value) || 0;
    const selectedDoorSize = document.querySelector('input[name="doorSize"]:checked');
    const transomWidth = document.getElementById('transomWidth') ? document.getElementById('transomWidth').value : 'no';

    if (!width || !height) {
        // Do not draw if width or height is not valid
        return;
    }

    let doorWidth = 0, doorHeight = 0;

    // Get the canvas and its context
    const canvas = document.getElementById('visualization');
    const ctx = canvas.getContext('2d');

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fixed canvas size (leave some margin)
    const fixedCanvasWidth = canvas.width - 100;
    const fixedCanvasHeight = canvas.height - 100;

    // Calculate the scale factors
    const scaleX = fixedCanvasWidth / width;
    const scaleY = fixedCanvasHeight / height;
    const scaleFactor = Math.min(scaleX, scaleY); // Maintain aspect ratio

    // Draw the porch outline with tags
    ctx.strokeStyle = 'black';
    ctx.strokeRect(50, 50, width * scaleFactor, height * scaleFactor);

    // Add dimensions and tags to the porch outline
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.fillText(`${width} in (U)`, 50 + (width * scaleFactor) / 2 - 30, 40); // Top horizontal line tag
    ctx.fillText(`${width} in (sU)`, 50 + (width * scaleFactor) / 2 - 30, 60 + height * scaleFactor); // Bottom horizontal line tag

    // Vertical dimensions
    ctx.save();
    ctx.translate(30, 50 + (height * scaleFactor) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${height} in (U)`, -30, 0); // Left vertical line tag
    ctx.restore();

    ctx.save();
    ctx.translate(70 + width * scaleFactor, 50 + (height * scaleFactor) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${height} in (sU)`, -30, 0); // Right vertical line tag
    ctx.restore();

    // Maximum width for each section
    const maxSectionWidth = 48; // Maximum width for each section in inches
    const sectionCount = Math.ceil(width / maxSectionWidth); // Number of sections
    const sectionWidth = width / sectionCount; // Width of each section

    // Draw the door if selected and at the specified position
    if (door === 'yes' && selectedDoorSize) {
        const [doorHeightInches, doorWidthInches] = selectedDoorSize.value.split('x').map(Number);
        doorWidth = doorWidthInches * scaleFactor;
        doorHeight = doorHeightInches * scaleFactor;

        // Adjust door positioning from the left edge of the porch
        const doorX = 50 + doorPosition * scaleFactor; // Positioning based on porch left edge

        // Draw the door
        ctx.fillStyle = 'brown';
        ctx.fillRect(doorX, 50 + height * scaleFactor - doorHeight, doorWidth, doorHeight); // Draw door

        // Draw door dimensions
        ctx.fillStyle = 'black';
        ctx.fillText(`${doorWidthInches} in`, doorX + doorWidth / 2 - 15, 50 + height * scaleFactor + 20); // Door width
        ctx.save();
        ctx.translate(doorX - 10, 50 + (height * scaleFactor) - doorHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`${doorHeightInches} in`, -30, 0); // Door height
        ctx.restore();

        // Draw the horizontal line at the top of the door
        ctx.strokeStyle = 'green';
        ctx.beginPath();
        ctx.moveTo(50, 50 + height * scaleFactor - doorHeight); // Start from left side
        ctx.lineTo(50 + width * scaleFactor, 50 + height * scaleFactor - doorHeight); // End at right side
        ctx.stroke();

        // Display the green line's dimension
        ctx.fillText(`${width} in (Green)`, 50 + (width * scaleFactor) / 2 - 40, 50 + height * scaleFactor - doorHeight - 10);

        // Extend the vertical lines of the door to the top porch line (keep red lines)
        if (transomWidth === 'yes') {
            ctx.strokeStyle = 'red';
            ctx.beginPath();
            ctx.moveTo(doorX, 50); // Extend left door line to the top
            ctx.lineTo(doorX, 50 + height * scaleFactor - doorHeight);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(doorX + doorWidth, 50); // Extend right door line to the top
            ctx.lineTo(doorX + doorWidth, 50 + height * scaleFactor - doorHeight);
            ctx.stroke();

            // Display the red lines' dimensions
            ctx.fillText(`${doorHeightInches} in (Red)`, doorX - 20, 45);
            ctx.fillText(`${doorHeightInches} in (Red)`, doorX + doorWidth - 20, 45);
        }

        // Dimension lines from the door to nearest vertical blue line
        ctx.strokeStyle = 'blue';
        let leftNearestLine = doorPosition; // Distance from left door edge
        let rightNearestLine = width - (doorPosition + doorWidthInches); // Distance from right door edge

        ctx.fillText(`${leftNearestLine.toFixed(2)} in`, doorX - leftNearestLine / 2 * scaleFactor, 50 + height * scaleFactor - 10);
        ctx.fillText(`${rightNearestLine.toFixed(2)} in`, doorX + doorWidth + rightNearestLine / 2 * scaleFactor, 50 + height * scaleFactor - 10);
    }

    // Draw vertical lines for sections from the bottom up
    ctx.strokeStyle = 'blue';
    let hCounter = 1; // Counter for H channels
    for (let i = 0; i < sectionCount; i++) {
        const x = 50 + (i * sectionWidth * scaleFactor);
        const isWithinDoorRange = x > (50 + doorPosition * scaleFactor) && x < (50 + doorPosition * scaleFactor + doorWidth);

        // Skip drawing blue lines that pass through the door when transom matches door width
        if (isWithinDoorRange && door === 'yes' && selectedDoorSize && transomWidth === 'yes') {
            continue; // Skip drawing this blue line entirely
        }

        ctx.beginPath();

        // Check if the blue line intersects the door area
        if (isWithinDoorRange && door === 'yes' && selectedDoorSize) {
            // Draw blue line only above the door
            ctx.moveTo(x, 50); // Start drawing from the top of the porch
            ctx.lineTo(x, 50 + height * scaleFactor - doorHeight); // Stop at the top of the door (green line)
        } else if (transomWidth === 'yes' && width >= 100 && door === 'yes' && selectedDoorSize) {
            // If transom condition is met, stop blue lines above the green line
            ctx.moveTo(x, 50 + height * scaleFactor); // Start from bottom
            ctx.lineTo(x, 50 + height * scaleFactor - doorHeight); // Stop at green line
        } else {
            // Draw blue lines normally from bottom to top if no intersection or conditions
            ctx.moveTo(x, 50 + height * scaleFactor); // Start drawing from the bottom of the porch
            ctx.lineTo(x, 50); // Extend blue lines to the top
        }

        ctx.stroke();

        // Assign part tags and IDs to blue lines
        const tag = i === sectionCount - 1 ? 'sH' : 'H';
        const partId = `Part ID: ${tag}-${hCounter++}`;

        // Display window width and part tags vertically
        ctx.save();
        ctx.translate(x + (sectionWidth * scaleFactor) / 2, 50 + (height * scaleFactor) + 20);
        ctx.fillText(`${sectionWidth.toFixed(2)} in (${tag})`, -20, 0);
        ctx.restore();
    }

    canvas.style.display = 'block'; // Ensure the canvas is visible
}


// Add event listeners to input fields for live updates
document.getElementById('width').addEventListener('input', visualize);
document.getElementById('height').addEventListener('input', () => {
    toggleDoorOptions();
    visualize();
});
document.getElementById('door').addEventListener('change', toggleDoorOptions);
document.getElementById('doorPosition').addEventListener('input', visualize);
document.querySelectorAll('input[name="doorSize"]').forEach(radio => {
    radio.addEventListener('change', visualize);
});
document.getElementById('transomWidth').addEventListener('change', visualize);

// Trigger initial visualization when the door selection is changed
toggleDoorOptions();




console.log("Width:", width);
console.log("Height:", height);
console.log("Door Selected:", door);
console.log("Door Position:", doorPosition);
if (selectedDoorSize) {
    console.log("Selected Door Size:", selectedDoorSize.value);
}

async function generateQuote() {
    const width = parseFloat(document.getElementById('width').value) || 0;
    const height = parseFloat(document.getElementById('height').value) || 0;
    const door = document.getElementById('door').value;
    const doorPosition = parseFloat(document.getElementById('doorPosition').value) || 0;
    const selectedDoorSize = document.querySelector('input[name="doorSize"]:checked');

    // Create a new jsPDF instance
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set up colors
    const headerColor = '#4A90E2'; // Blue color for headers
    const textColor = '#333'; // Dark color for main text
    const sectionBackgroundColor = '#F2F4F7'; // Light background for sections

    // Add header with a background color
    doc.setFillColor(headerColor);
    doc.rect(0, 10, 210, 20, 'F'); // Full width header background
    doc.setTextColor('#FFFFFF'); // White text for header
    doc.setFontSize(20);
    doc.text('PRICE QUOTE', 105, 25, { align: 'center' });

    // Reset text color for the rest of the document
    doc.setTextColor(textColor);

    // Company Information Section
    doc.setFillColor(sectionBackgroundColor);
    doc.rect(10, 30, 90, 40, 'F'); // Background for company info section
    doc.setFontSize(12);
    doc.text('Prepared By:', 15, 40);
    doc.text('Company Name', 15, 45);
    doc.text('1234 Address St.', 15, 50);
    doc.text('City, State, ZIP', 15, 55);
    doc.text('Email: contact@company.com', 15, 60);
    doc.text('Phone: (123) 456-7890', 15, 65);

    // Quotation for section
    doc.rect(110, 30, 90, 40, 'F'); // Background for client info section
    doc.text('Quotation for:', 115, 40);
    doc.text('Client Company', 115, 45);
    doc.text('Client Address', 115, 50);
    doc.text('City, State, ZIP', 115, 55);
    doc.text('Email: client@example.com', 115, 60);
    doc.text('Phone: (987) 654-3210', 115, 65);

    // Date and Quote Number
    const quoteDate = new Date().toLocaleDateString();
    const quoteNumber = 'Q-12345';
    doc.setFontSize(12);
    doc.text(`Quote Date: ${quoteDate}`, 15, 75);
    doc.text(`Quote Number: ${quoteNumber}`, 15, 80);

    // Add table headers and details
    const headers = ["Part ID", "Part Name", "Dimensions (inches)", "Quantity", "Price", "Total"];
    const rows = [
        ["U-1", "Top U-Channel", `${width}`, "1", "$10", "$10"],
        ["U-2", "Left U-Channel", `${height}`, "1", "$10", "$10"],
        ["sU-3", "Right sU-Channel", `${height}`, "1", "$10", "$10"],
        ["sU-4", "Bottom sU-Channel", `${width}`, "1", "$10", "$10"],
        // Add entries for other parts like blue lines (H channels), red lines, etc.
    ];

    // Add pricing calculations, subtotal, taxes, etc.
    const subtotal = rows.reduce((acc, row) => acc + parseFloat(row[5].replace('$', '')), 0);
    const tax = subtotal * 0.13; // Assuming 13% HST
    const total = subtotal + tax;

    rows.push(["", "Subtotal", "", "", "", `$${subtotal.toFixed(2)}`]);
    rows.push(["", "HST (13%)", "", "", "", `$${tax.toFixed(2)}`]);
    rows.push(["", "Total", "", "", "", `$${total.toFixed(2)}`]);

    // Create a table in the PDF
    doc.autoTable({
        head: [headers],
        body: rows,
        startY: 90,
        theme: 'grid',
        styles: { fillColor: [242, 244, 247], textColor: textColor },
        headStyles: { fillColor: headerColor, textColor: '#FFFFFF' },
    });

    // Add canvas visualization
    const canvas = document.getElementById('visualization');
    const imgData = await html2canvas(canvas).then(canvas => canvas.toDataURL('image/png'));

    // Determine the size and position to center the image
    const imgWidth = 160; // Increase width slightly for better visibility
    const imgHeight = (canvas.height / canvas.width) * imgWidth; // Keep aspect ratio
    const imgX = (doc.internal.pageSize.width - imgWidth) / 2; // Center horizontally
    const imgY = doc.lastAutoTable.finalY + 10; // Position below the table

    // Add the visualization image to the PDF
    doc.addImage(imgData, 'PNG', imgX, imgY, imgWidth, imgHeight);

    // Save the PDF
    doc.save('porch_quote.pdf');
}


 