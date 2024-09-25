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

    // Show the reset button
    document.getElementById('resetSelectionButton').style.display = 'block';

    // Show the "Layout selected" heading
    document.getElementById('selectedLayoutHeading').style.display = 'block';
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
    const width = parseFloat(document.getElementById('width').value);
    const height = parseFloat(document.getElementById('height').value);
    const door = document.getElementById('door').value;
    const doorPosition = parseFloat(document.getElementById('doorPosition').value) || 0;
    const selectedDoorSize = document.querySelector('input[name="doorSize"]:checked');

    // Check if width and height are valid before drawing
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

    // Draw the porch outline
    ctx.strokeStyle = 'black';
    ctx.strokeRect(50, 50, width * scaleFactor, height * scaleFactor);

    // Draw porch dimensions
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.fillText(`Width: ${width} in`, 50 + (width * scaleFactor) / 2 - 30, 45);

    // Vertical dimension
    ctx.save();
    ctx.translate(45, 50 + (height * scaleFactor) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`Height: ${height} in`, -30, 0);
    ctx.restore();

    // Maximum width for each section
    const maxSectionWidth = 48; // Maximum width for each section in inches
    const sectionCount = Math.ceil(width / maxSectionWidth); // Number of sections
    const sectionWidth = width / sectionCount; // Width of each section

    // Draw vertical lines for sections and display window width
    ctx.strokeStyle = 'blue';
    for (let i = 0; i < sectionCount; i++) {
        const x = 50 + (i * sectionWidth * scaleFactor);
        ctx.beginPath();
        ctx.moveTo(x, 50);
        ctx.lineTo(x, 50 + height * scaleFactor);
        ctx.stroke();

        // Display window width vertically
        ctx.save();
        ctx.translate(x + (sectionWidth * scaleFactor) / 2, 50 + (height * scaleFactor) + 20);
        ctx.fillText(`${sectionWidth.toFixed(2)} in`, -20, 0);
        ctx.restore();
    }

    // Draw the door if selected and at the specified position
    if (door === 'yes' && selectedDoorSize) {
        const [doorHeightInches, doorWidthInches] = selectedDoorSize.value.split('x').map(Number);
        doorWidth = doorWidthInches * scaleFactor;
        doorHeight = doorHeightInches * scaleFactor;

        // Adjust door positioning from the left edge of the porch
        const doorX = 50 + doorPosition * scaleFactor; // Positioning based on porch left edge

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

        // Draw horizontal line at top of door
        ctx.strokeStyle = 'green';
        ctx.beginPath();
        ctx.moveTo(50, 50 + height * scaleFactor - doorHeight); // Start from left side
        ctx.lineTo(50 + width * scaleFactor, 50 + height * scaleFactor - doorHeight); // End at right side
        ctx.stroke();
    }

    canvas.style.display = 'block'; // Ensure the canvas is visible
}


// Add event listeners to input fields for live updates
document.getElementById('width').addEventListener('input', visualize);
document.getElementById('height').addEventListener('input', visualize);
document.getElementById('door').addEventListener('change', toggleDoorOptions);
document.getElementById('doorPosition').addEventListener('input', visualize);
document.querySelectorAll('input[name="doorSize"]').forEach(radio => {
    radio.addEventListener('change', visualize);
});

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
    const { jsPDF } = window.jspdf;

    const width = parseFloat(document.getElementById('width').value) || 0;
    const height = parseFloat(document.getElementById('height').value) || 0;
    const door = document.getElementById('door').value;
    const doorPosition = parseFloat(document.getElementById('doorPosition').value) || 0;
    const selectedDoorSize = document.querySelector('input[name="doorSize"]:checked');

    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Date and Quote Number
    const quoteDate = new Date().toLocaleDateString();
    const quoteNumber = Math.floor(Math.random() * 1000000); // Random quote number for demonstration

    // Header Section
    doc.setFontSize(20);
    doc.text('PRICE QUOTE', 105, 20, { align: 'center' });

    // Company Information Section
    doc.setFontSize(12);
    doc.text('Prepared By:', 20, 35);
    doc.text('Company Name', 20, 40);
    doc.text('1234 Address St.', 20, 45);
    doc.text('City, State, ZIP', 20, 50);
    doc.text('Email: contact@company.com', 20, 55);
    doc.text('Phone: (123) 456-7890', 20, 60);

    // Quotation for section
    doc.text('Quotation for:', 120, 35);
    doc.text('Client Company', 120, 40);
    doc.text('Client Address', 120, 45);
    doc.text('City, State, ZIP', 120, 50);
    doc.text('Email: client@example.com', 120, 55);
    doc.text('Phone: (987) 654-3210', 120, 60);

    // Date and Quote Number
    doc.text(`Quote Date: ${quoteDate}`, 20, 70);
    doc.text(`Quote Number: ${quoteNumber}`, 20, 75);

    // Table headers
    const headers = [["Part ID", "Part Name", "Length (in)", "Qty", "Price per Unit", "Total Price"]];
    const rows = [];

    // Initialize part ID counter
    let partID = 1;

    // Horizontal U-Channel
    const horizontalChannelLength = 2 * width; // Top and bottom channels
    const horizontalChannelPricePerUnit = 5; // Example price per unit length
    const horizontalChannelTotalPrice = horizontalChannelLength * horizontalChannelPricePerUnit;
    rows.push([`P${partID++}`, "Horizontal U-Channel", `${horizontalChannelLength}`, "1", `$${horizontalChannelPricePerUnit.toFixed(2)}`, `$${horizontalChannelTotalPrice.toFixed(2)}`]);

    // Vertical U-Channel
    const verticalChannelLength = 2 * height; // Left and right channels
    const verticalChannelPricePerUnit = 5; // Example price per unit length
    const verticalChannelTotalPrice = verticalChannelLength * verticalChannelPricePerUnit;
    rows.push([`P${partID++}`, "Vertical U-Channel", `${verticalChannelLength}`, "1", `$${verticalChannelPricePerUnit.toFixed(2)}`, `$${verticalChannelTotalPrice.toFixed(2)}`]);

    // Horizontal H-Channel
    const horizontalHChannelLength = 2 * (width - 4); // Inner top and bottom channels
    const horizontalHChannelPricePerUnit = 4; // Example price per unit length
    const horizontalHChannelTotalPrice = horizontalHChannelLength * horizontalHChannelPricePerUnit;
    rows.push([`P${partID++}`, "Horizontal H-Channel", `${horizontalHChannelLength}`, "1", `$${horizontalHChannelPricePerUnit.toFixed(2)}`, `$${horizontalHChannelTotalPrice.toFixed(2)}`]);

    // Vertical H-Channel
    const verticalHChannelLength = 2 * (height - 4); // Inner left and right channels
    const verticalHChannelPricePerUnit = 4; // Example price per unit length
    const verticalHChannelTotalPrice = verticalHChannelLength * verticalHChannelPricePerUnit;
    rows.push([`P${partID++}`, "Vertical H-Channel", `${verticalHChannelLength}`, "1", `$${verticalHChannelPricePerUnit.toFixed(2)}`, `$${verticalHChannelTotalPrice.toFixed(2)}`]);

    // Door Information
    if (door === 'yes' && selectedDoorSize) {
        const [doorHeightInches, doorWidthInches] = selectedDoorSize.value.split('x').map(Number);
        const doorPricePerUnit = 100; // Example price for the door
        const doorTotalPrice = doorPricePerUnit * 1; // Assuming quantity 1
        rows.push([`P${partID++}`, "Door", `${doorWidthInches} x ${doorHeightInches}`, "1", `$${doorPricePerUnit.toFixed(2)}`, `$${doorTotalPrice.toFixed(2)}`]);
    }

    // Calculate the subtotal
    const subtotal = rows.reduce((acc, row) => acc + parseFloat(row[5].replace('$', '')), 0);
    const taxRate = 0.13; // 13% HST
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    // Add subtotal, tax, and total rows
    rows.push(["", "", "", "", "Subtotal", `$${subtotal.toFixed(2)}`]);
    rows.push(["", "", "", "", "HST (13%)", `$${taxAmount.toFixed(2)}`]);
    rows.push(["", "", "", "", "Total", `$${total.toFixed(2)}`]);

    // Create a table in the PDF
    doc.autoTable({
        head: headers,
        body: rows,
        startY: 90,
        theme: 'grid',
        styles: {
            fontSize: 10,
            halign: 'center',
        },
        columnStyles: {
            0: { halign: 'left' },
            1: { halign: 'left' },
        },
    });

    // Terms and Conditions
    doc.setFontSize(10);
    doc.text('This Quote is Subject to The Following Terms And Conditions: Delivery Will Be Made [DESCRIBE DELIVERY]', 20, doc.lastAutoTable.finalY + 10);
    doc.text('General Terms And Conditions Governing This Quotation/Contract Are Provided At [DESCRIBE GENERAL TERMS AND CONDITIONS]', 20, doc.lastAutoTable.finalY + 15);
    doc.text('This Quotation Has Been Approved By [COMPANY] As Evidenced By The Signature Of Its Authorized Representative Below.', 20, doc.lastAutoTable.finalY + 20);

    // Add scaled visualization at the bottom
    const canvas = document.getElementById('visualization');
    const imgData = await html2canvas(canvas).then(canvas => canvas.toDataURL('image/png'));
    const imgWidth = 80;
    const imgHeight = (canvas.height / canvas.width) * imgWidth;
    doc.addImage(imgData, 'PNG', 20, doc.internal.pageSize.height - imgHeight - 30, imgWidth, imgHeight);

    // Save the PDF
    doc.save('porch_quote.pdf');
}

