// Function to toggle the visibility of door options based on the selection and validate porch height
function toggleDoorOptions() {
    const door = document.getElementById('door').value;
    const doorPositionContainer = document.getElementById('doorPositionContainer');
    const stormDoorTypeContainer = document.getElementById('stormDoorTypeContainer');
    const doorWidthContainer = document.getElementById('doorWidthContainer');
    const doorHeightContainer = document.getElementById('doorHeightContainer');
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
            stormDoorTypeContainer.style.display = 'none'; // Hide storm door type selection
            doorWidthContainer.style.display = 'none';
            doorHeightContainer.style.display = 'none';
            return;
        }
        // Show the door options if the height is valid
        doorPositionContainer.style.display = 'block';
        stormDoorTypeContainer.style.display = 'block'; // Show the storm door type selection

        // Show the transom width question if the height is greater than 80 inches
        if (height > 80) {
            transomWidthContainer.style.display = 'block';
        }
    } else {
        doorPositionContainer.style.display = 'none';
        stormDoorTypeContainer.style.display = 'none'; // Hide storm door type selection
        doorWidthContainer.style.display = 'none';
        doorHeightContainer.style.display = 'none';
    }

    // Trigger visualization whenever door options are toggled
    visualize();
}

// Function to display door dimensions (width and height) dropdowns after storm door type is selected
function showDoorDimensions() {
    const doorWidthContainer = document.getElementById('doorWidthContainer');
    const doorHeightContainer = document.getElementById('doorHeightContainer');

    // Show the door width and height selection containers
    doorWidthContainer.style.display = 'block';
    doorHeightContainer.style.display = 'block';

    // Populate door width options (30 to 36 inches in 1/2 inch increments)
    const doorWidthSelect = document.getElementById('doorWidth');
    doorWidthSelect.innerHTML = ''; // Clear existing options
    for (let width = 30; width <= 36; width += 0.5) {
        const option = document.createElement('option');
        option.value = width.toFixed(1);
        option.text = `${width.toFixed(1)} inches`;
        doorWidthSelect.appendChild(option);
    }
    doorWidthSelect.selectedIndex = 0; // Select the first option by default

    // Populate door height options (66 to 88 inches in 1/2 inch increments)
    const doorHeightSelect = document.getElementById('doorHeight');
    doorHeightSelect.innerHTML = ''; // Clear existing options
    for (let height = 66; height <= 88; height += 0.5) {
        const option = document.createElement('option');
        option.value = height.toFixed(1);
        option.text = `${height.toFixed(1)} inches`;
        doorHeightSelect.appendChild(option);
    }
    doorHeightSelect.selectedIndex = 0; // Select the first option by default
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
    const selectedDoorWidth = parseFloat(document.getElementById('doorWidth').value) || 0;
    const selectedDoorHeight = parseFloat(document.getElementById('doorHeight').value) || 0;
    const transomWidth = document.getElementById('transomWidth') ? document.getElementById('transomWidth').value : 'no';

    if (!width || !height) {
        // Do not draw if width or height is not valid
        return;
    }

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

    // Draw the porch outline
    ctx.strokeStyle = 'black';
    ctx.strokeRect(50, 50, width * scaleFactor, height * scaleFactor);

    // Draw porch dimensions
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.fillText(`${width} in`, 50 + (width * scaleFactor) / 2 - 30, 40);
    ctx.save();
    ctx.translate(30, 50 + (height * scaleFactor) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${height} in`, -30, 0);
    ctx.restore();

    let doorX = 0;
    let doorWidth = 0;
    let doorHeight = 0;

    // Draw the door if selected and at the specified position
    if (door === 'yes') {
        doorWidth = selectedDoorWidth * scaleFactor;
        doorHeight = selectedDoorHeight * scaleFactor;
        doorX = 50 + doorPosition * scaleFactor; // Door position from the left

        // Draw the door
        ctx.fillStyle = 'brown';
        ctx.fillRect(doorX, 50 + height * scaleFactor - doorHeight, doorWidth, doorHeight);

        // Draw door dimensions
        ctx.fillStyle = 'black';
        ctx.fillText(`${selectedDoorWidth} in`, doorX + doorWidth / 2 - 15, 50 + height * scaleFactor + 20);
        ctx.save();
        ctx.translate(doorX - 10, 50 + (height * scaleFactor) - doorHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`${selectedDoorHeight} in`, -30, 0);
        ctx.restore();

        // Draw the horizontal line at the top of the door
        ctx.strokeStyle = 'green';
        ctx.beginPath();
        ctx.moveTo(50, 50 + height * scaleFactor - doorHeight);
        ctx.lineTo(50 + width * scaleFactor, 50 + height * scaleFactor - doorHeight);
        ctx.stroke();
    }

    // Logic to draw blue lines (window sections) for the entire porch initially
    if (door === 'no') {
        const sectionCount = Math.ceil(width / 48); // Divide the porch into sections of max 48 inches
        const sectionWidth = width / sectionCount;

        for (let i = 0; i < sectionCount; i++) {
            const x = 50 + (i * sectionWidth * scaleFactor);
            ctx.strokeStyle = 'blue';
            ctx.beginPath();
            ctx.moveTo(x, 50 + height * scaleFactor); // Start from the bottom of the porch
            ctx.lineTo(x, 50); // Draw to the top of the porch
            ctx.stroke();

            // Display section dimensions
            ctx.save();
            ctx.translate(x + (sectionWidth * scaleFactor) / 2, 50 + (height * scaleFactor) + 20);
            ctx.fillText(`${sectionWidth.toFixed(2)} in`, -20, 0);
            ctx.restore();
        }
    } else {
        // Logic to draw blue lines (window sections) on the left side of the door
        const leftAreaWidth = doorPosition;
        const leftSectionCount = Math.ceil(leftAreaWidth / 48); // Divide left area into sections of max 48 inches
        const leftSectionWidth = leftAreaWidth / leftSectionCount;

        for (let i = 0; i < leftSectionCount; i++) {
            const x = 50 + (i * leftSectionWidth * scaleFactor);
            ctx.strokeStyle = 'blue';
            ctx.beginPath();
            ctx.moveTo(x, 50 + height * scaleFactor); // Start from the bottom of the porch
            ctx.lineTo(x, 50); // Draw to the top of the porch
            ctx.stroke();

            // Display section dimensions
            ctx.save();
            ctx.translate(x + (leftSectionWidth * scaleFactor) / 2, 50 + (height * scaleFactor) + 20);
            ctx.fillText(`${leftSectionWidth.toFixed(2)} in`, -20, 0);
            ctx.restore();
        }

        // Logic to draw blue lines (window sections) on the right side of the door
        const rightAreaStart = doorX + doorWidth;
        const rightAreaWidth = width - (doorPosition + selectedDoorWidth);
        const rightSectionCount = Math.ceil(rightAreaWidth / 48); // Divide right area into sections of max 48 inches
        const rightSectionWidth = rightAreaWidth / rightSectionCount;

        for (let i = 0; i < rightSectionCount; i++) {
            const x = rightAreaStart + (i * rightSectionWidth * scaleFactor);
            ctx.strokeStyle = 'blue';
            ctx.beginPath();
            ctx.moveTo(x, 50 + height * scaleFactor); // Start from the bottom of the porch
            ctx.lineTo(x, 50); // Draw to the top of the porch
            ctx.stroke();

            // Display section dimensions
            ctx.save();
            ctx.translate(x + (rightSectionWidth * scaleFactor) / 2, 50 + (height * scaleFactor) + 20);
            ctx.fillText(`${rightSectionWidth.toFixed(2)} in`, -20, 0);
            ctx.restore();
        }
    }

    // Handle the transom logic
    if (transomWidth === 'yes' && width >= 100 && door === 'yes') {
        // Ensure blue lines do not extend above the green line
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(doorX, 50);
        ctx.lineTo(doorX, 50 + height * scaleFactor - doorHeight);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(doorX + doorWidth, 50);
        ctx.lineTo(doorX + doorWidth, 50 + height * scaleFactor - doorHeight);
        ctx.stroke();
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
document.getElementById('doorWidth').addEventListener('change', visualize);
document.getElementById('doorHeight').addEventListener('change', visualize);
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


 