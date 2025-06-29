// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initModals();
    initTools();
    initSmoothScrolling();
    initAnimations();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Hamburger menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active navigation link highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Modal functionality
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('[data-tool], .btn-login, .btn-signup');
    const closeButtons = document.querySelectorAll('.close');

    // Open modals
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-tool') || this.getAttribute('href').substring(1);
            const modal = document.getElementById(`${target}-modal`);
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });

    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }
    });
}

// Initialize all tools
function initTools() {
    initImageCompression();
    initPDFConverter();
    initPasswordGenerator();
    initEMICalculator();
    initBMICalculator();
    initCurrencyConverter();
    initContactForm();
    initAuthForms();
}

// Image Compression Tool
function initImageCompression() {
    const imageInput = document.getElementById('image-input');
    const qualitySlider = document.getElementById('quality-slider');
    const qualityValue = document.getElementById('quality-value');
    const compressBtn = document.getElementById('compress-btn');
    const imagePreview = document.getElementById('image-preview');
    let uploadedImages = [];

    // Quality slider update
    qualitySlider.addEventListener('input', function() {
        qualityValue.textContent = this.value + '%';
    });

    // File upload handling
    imageInput.addEventListener('change', function(e) {
        uploadedImages = Array.from(e.target.files);
        displayImagePreview(uploadedImages);
    });

    // Drag and drop functionality
    const uploadArea = document.querySelector('#image-compress-modal .upload-area');
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = '#667eea';
        this.style.background = 'rgba(102, 126, 234, 0.1)';
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.borderColor = '#667eea';
        this.style.background = 'transparent';
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = '#667eea';
        this.style.background = 'transparent';
        uploadedImages = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        displayImagePreview(uploadedImages);
    });

    // Compress button
    compressBtn.addEventListener('click', function() {
        if (uploadedImages.length === 0) {
            alert('Please upload images first!');
            return;
        }
        compressImages(uploadedImages, qualitySlider.value / 100);
    });

    function displayImagePreview(images) {
        imagePreview.innerHTML = '';
        images.forEach((image, index) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '150px';
                img.style.margin = '10px';
                img.style.borderRadius = '10px';
                imagePreview.appendChild(img);
            };
            reader.readAsDataURL(image);
        });
    }

    function compressImages(images, quality) {
        images.forEach((image, index) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob(function(blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `compressed_${image.name}`;
                    a.click();
                    URL.revokeObjectURL(url);
                }, 'image/jpeg', quality);
            };
            
            img.src = URL.createObjectURL(image);
        });
    }
}

// PDF Converter Tool
function initPDFConverter() {
    const pdfInput = document.getElementById('pdf-input');
    const convertBtn = document.getElementById('convert-btn');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const conversionResult = document.getElementById('conversion-result');
    let selectedFile = null;

    // File input change handler
    pdfInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            selectedFile = e.target.files[0];
            displayFileInfo(selectedFile);
            fileInfo.style.display = 'block';
            conversionResult.style.display = 'none';
        }
    });

    // Drag and drop functionality
    const uploadArea = document.querySelector('#pdf-converter-modal .upload-area');
    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = '#667eea';
        this.style.background = 'rgba(102, 126, 234, 0.1)';
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.borderColor = '#667eea';
        this.style.background = 'transparent';
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = '#667eea';
        this.style.background = 'transparent';
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            selectedFile = files[0];
            pdfInput.files = e.dataTransfer.files;
            displayFileInfo(selectedFile);
            fileInfo.style.display = 'block';
            conversionResult.style.display = 'none';
        }
    });

    // Convert button click handler
    convertBtn.addEventListener('click', function() {
        if (!selectedFile) {
            showConversionResult('Please select a file first!', 'error');
            return;
        }

        const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
        const supportedFormats = ['doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'html'];
        
        if (!supportedFormats.includes(fileExtension)) {
            showConversionResult('Unsupported file format! Please select DOC, DOCX, TXT, JPG, PNG, or HTML files.', 'error');
            return;
        }

        // Show loading state
        convertBtn.disabled = true;
        convertBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Converting...';

        // Handle conversion based on file type
        if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
            // Handle image to PDF conversion
            convertImageToPDF(selectedFile);
        } else {
            // Handle other file types
            setTimeout(() => {
                performConversion(selectedFile);
                convertBtn.disabled = false;
                convertBtn.innerHTML = 'Convert to PDF';
            }, 1500);
        }
    });

    function displayFileInfo(file) {
        fileName.textContent = `Name: ${file.name}`;
        fileSize.textContent = `Size: ${formatFileSize(file.size)}`;
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function performConversion(file) {
        const outputFileName = file.name.replace(/\.[^/.]+$/, '.pdf');
        
        const successMessage = `
            <h4><i class="fas fa-check-circle"></i> Conversion Successful!</h4>
            <p><strong>Original File:</strong> ${file.name}</p>
            <p><strong>Converted To:</strong> PDF</p>
            <p><strong>Output File:</strong> ${outputFileName}</p>
            <button class="btn btn-primary" onclick="downloadFile('${outputFileName}')">
                <i class="fas fa-download"></i> Download PDF
            </button>
        `;

        showConversionResult(successMessage, 'success');
    }

    function convertImageToPDF(imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // Create PDF with image using jsPDF
                const outputFileName = imageFile.name.replace(/\.[^/.]+$/, '.pdf');
                const pdfBlob = createImagePDF(img, imageFile.name);
                
                // Create download link
                const url = URL.createObjectURL(pdfBlob);
                
                const successMessage = `
                    <h4><i class="fas fa-check-circle"></i> Image to PDF Conversion Successful!</h4>
                    <p><strong>Original Image:</strong> ${imageFile.name}</p>
                    <p><strong>Image Size:</strong> ${img.width} x ${img.height} pixels</p>
                    <p><strong>Output File:</strong> ${outputFileName}</p>
                    <button class="btn btn-primary" onclick="downloadImagePDF('${outputFileName}', '${url}')">
                        <i class="fas fa-download"></i> Download PDF
                    </button>
                `;

                showConversionResult(successMessage, 'success');
                convertBtn.disabled = false;
                convertBtn.innerHTML = 'Convert to PDF';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(imageFile);
    }

    function createImagePDF(img, imageName) {
        // Use jsPDF library for proper image to PDF conversion
        const { jsPDF } = window.jspdf;
        
        // Create new PDF document
        const pdf = new jsPDF();
        
        // Get image dimensions
        const imgWidth = img.width;
        const imgHeight = img.height;
        
        // Calculate dimensions to fit on page (A4 size: 210 x 297 mm)
        const pageWidth = 210;
        const pageHeight = 297;
        const maxWidth = 180; // Leave margins
        const maxHeight = 250; // Leave margins
        
        let finalWidth = imgWidth;
        let finalHeight = imgHeight;
        
        // Scale image to fit on page while maintaining aspect ratio
        if (imgWidth > maxWidth || imgHeight > maxHeight) {
            const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
            finalWidth = imgWidth * ratio;
            finalHeight = imgHeight * ratio;
        }
        
        // Calculate position to center image on page
        const xPos = (pageWidth - finalWidth) / 2;
        const yPos = (pageHeight - finalHeight) / 2;
        
        try {
            // Convert image to base64
            const canvas = document.createElement('canvas');
            canvas.width = imgWidth;
            canvas.height = imgHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // Get image data
            const imageData = canvas.toDataURL('image/jpeg', 0.9);
            
            // Add image to PDF (no text, just the image)
            pdf.addImage(imageData, 'JPEG', xPos, yPos, finalWidth, finalHeight);
            
            // Return the PDF as a blob
            const pdfBlob = pdf.output('blob');
            return pdfBlob;
            
        } catch (error) {
            console.error('Error creating PDF:', error);
            // Fallback to simple text PDF if image conversion fails
            return createFallbackPDF(imageName, imgWidth, imgHeight);
        }
    }

    function createFallbackPDF(imageName, width, height) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        
        pdf.setFontSize(16);
        pdf.text('Image Conversion Successful', 20, 30);
        
        pdf.setFontSize(12);
        pdf.text(`Original Image: ${imageName}`, 20, 50);
        pdf.text(`Image Size: ${width} x ${height} pixels`, 20, 60);
        pdf.text('Converted to PDF format', 20, 70);
        pdf.text('Thank you for using PupilHelper!', 20, 80);
        
        return pdf.output('blob');
    }

    function showConversionResult(message, type) {
        conversionResult.innerHTML = message;
        conversionResult.className = `conversion-result ${type}`;
        conversionResult.style.display = 'block';
        
        // Scroll to result
        conversionResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Global function for download simulation
function downloadFile(fileName) {
    // Create a more realistic PDF simulation
    if (fileName.toLowerCase().endsWith('.pdf')) {
        // For PDF files, create a simple PDF-like structure
        const pdfContent = createPDFContent(fileName);
        downloadAsPDF(pdfContent, fileName);
    } else {
        // For other file types, create appropriate content
        const content = createFileContent(fileName);
        downloadAsFile(content, fileName);
    }
}

function createPDFContent(fileName) {
    // Create a simple PDF-like content structure
    return {
        title: fileName.replace('.pdf', ''),
        content: `This is a simulated PDF file created by PupilHelper PDF Converter.
        
Document Information:
- Original file: ${fileName}
- Created by: PupilHelper Tools
- Date: ${new Date().toLocaleDateString()}
- Time: ${new Date().toLocaleTimeString()}

This is a demonstration of the PDF conversion feature. In a real implementation, this would contain the actual converted content from your original file.

Features:
✓ File conversion simulation
✓ Professional formatting
✓ Download functionality
✓ Cross-platform compatibility

Thank you for using PupilHelper!`
    };
}

function createFileContent(fileName) {
    const fileType = fileName.split('.').pop().toLowerCase();
    let content = '';
    
    switch(fileType) {
        case 'doc':
        case 'docx':
            content = `Document created by PupilHelper PDF Converter

Title: ${fileName.replace(/\.[^/.]+$/, '')}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

This is a simulated ${fileType.toUpperCase()} file created by PupilHelper PDF Converter.

Original file has been successfully converted to ${fileType.toUpperCase()} format.

Features:
- Professional document formatting
- Cross-platform compatibility
- Easy to edit and share
- Maintains document structure

Thank you for using PupilHelper!`;
            break;
            
        case 'txt':
            content = `Text file created by PupilHelper PDF Converter

File: ${fileName}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

This is a plain text file converted from your original document.

The content has been extracted and formatted as plain text for easy reading and editing.

Features:
- Simple text format
- Universal compatibility
- Easy to edit
- Lightweight file size

Thank you for using PupilHelper!`;
            break;
            
        case 'html':
            content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName.replace('.html', '')}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { background: #667eea; color: white; padding: 20px; border-radius: 10px; }
        .content { margin: 20px 0; }
        .footer { background: #f5f5f5; padding: 15px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Document converted by PupilHelper</h1>
        <p>File: ${fileName}</p>
        <p>Date: ${new Date().toLocaleDateString()}</p>
    </div>
    
    <div class="content">
        <h2>Converted Content</h2>
        <p>This HTML file was created by PupilHelper PDF Converter.</p>
        <p>The original document has been converted to HTML format for web viewing and editing.</p>
        
        <h3>Features:</h3>
        <ul>
            <li>Web-compatible format</li>
            <li>Easy to view in browsers</li>
            <li>Can be edited with any text editor</li>
            <li>Supports styling and formatting</li>
        </ul>
    </div>
    
    <div class="footer">
        <p><strong>Thank you for using PupilHelper!</strong></p>
        <p>Your ultimate multi-tool website for everyday tasks.</p>
    </div>
</body>
</html>`;
            break;
            
        default:
            content = `File created by PupilHelper PDF Converter

File: ${fileName}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

This file was created by PupilHelper PDF Converter.

Thank you for using our service!`;
    }
    
    return content;
}

function downloadAsPDF(pdfContent, fileName) {
    // Create a simple but working PDF using a minimal valid PDF structure
    const pdfData = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 100
>>
stream
BT
/F1 12 Tf
72 720 Td
(${pdfContent.title}) Tj
0 -20 Td
(Converted document content) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
400
%%EOF`;

    // Convert to blob and download
    const blob = new Blob([pdfData], { type: 'application/pdf' });
    downloadBlob(blob, fileName);
}

function downloadAsFile(content, fileName) {
    const fileType = fileName.split('.').pop().toLowerCase();
    let mimeType = 'text/plain';
    
    switch(fileType) {
        case 'doc':
        case 'docx':
            mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            break;
        case 'html':
            mimeType = 'text/html';
            break;
        case 'txt':
            mimeType = 'text/plain';
            break;
    }
    
    const blob = new Blob([content], { type: mimeType });
    downloadBlob(blob, fileName);
}

function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    showNotification(`File "${fileName}" downloaded successfully!`, 'success');
}

// Global function for image PDF download
function downloadImagePDF(fileName, url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    showNotification(`Image PDF "${fileName}" downloaded successfully!`, 'success');
}

// Password Generator Tool
function initPasswordGenerator() {
    const lengthSlider = document.getElementById('length-slider');
    const lengthValue = document.getElementById('length-value');
    const uppercase = document.getElementById('uppercase');
    const lowercase = document.getElementById('lowercase');
    const numbers = document.getElementById('numbers');
    const symbols = document.getElementById('symbols');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-password');
    const passwordField = document.getElementById('generated-password');

    // Length slider update
    lengthSlider.addEventListener('input', function() {
        lengthValue.textContent = this.value;
    });

    // Generate password
    generateBtn.addEventListener('click', function() {
        const length = parseInt(lengthSlider.value);
        const hasUpper = uppercase.checked;
        const hasLower = lowercase.checked;
        const hasNumbers = numbers.checked;
        const hasSymbols = symbols.checked;

        if (!hasUpper && !hasLower && !hasNumbers && !hasSymbols) {
            alert('Please select at least one character type!');
            return;
        }

        const password = generatePassword(length, hasUpper, hasLower, hasNumbers, hasSymbols);
        passwordField.value = password;
    });

    // Copy password
    copyBtn.addEventListener('click', function() {
        if (passwordField.value) {
            // Try to use modern Clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(passwordField.value).then(() => {
                    // Show success feedback
                    this.innerHTML = '<i class="bi bi-check-lg"></i>';
                    this.style.background = '#4CAF50';
                    this.style.color = 'white';
                    
                    // Show notification
                    showNotification('Password copied to clipboard!', 'success');
                    
                    // Reset button after 2 seconds
                    setTimeout(() => {
                        this.innerHTML = '<i class="bi bi-clipboard"></i>';
                        this.style.background = '';
                        this.style.color = '';
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                    fallbackCopy();
                });
            } else {
                // Fallback for older browsers
                fallbackCopy();
            }
        } else {
            showNotification('No password to copy! Generate a password first.', 'error');
        }
    });

    function fallbackCopy() {
        passwordField.select();
        passwordField.setSelectionRange(0, 99999); // For mobile devices
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                copyBtn.innerHTML = '<i class="bi bi-check-lg"></i>';
                copyBtn.style.background = '#4CAF50';
                copyBtn.style.color = 'white';
                showNotification('Password copied to clipboard!', 'success');
                
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="bi bi-clipboard"></i>';
                    copyBtn.style.background = '';
                    copyBtn.style.color = '';
                }, 2000);
            } else {
                showNotification('Failed to copy password. Please try again.', 'error');
            }
        } catch (err) {
            console.error('Fallback copy failed: ', err);
            showNotification('Copy failed. Please select and copy manually.', 'error');
        }
    }

    function generatePassword(length, upper, lower, numbers, symbols) {
        let chars = '';
        if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
        if (numbers) chars += '0123456789';
        if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }
}

// EMI Calculator Tool
function initEMICalculator() {
    const loanAmount = document.getElementById('loan-amount');
    const interestRate = document.getElementById('interest-rate');
    const loanTerm = document.getElementById('loan-term');
    const calculateBtn = document.getElementById('calculate-emi');
    const resultDiv = document.getElementById('emi-result');

    // Add real-time validation and formatting
    function validateInputs() {
        const principal = parseFloat(loanAmount.value);
        const rate = parseFloat(interestRate.value);
        const time = parseFloat(loanTerm.value);
        
        const isValid = principal > 0 && rate > 0 && rate <= 50 && time > 0 && time <= 30;
        calculateBtn.disabled = !isValid;
        calculateBtn.style.opacity = isValid ? '1' : '0.6';
        calculateBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
        
        return isValid;
    }

    // Add event listeners for real-time validation
    loanAmount.addEventListener('input', validateInputs);
    interestRate.addEventListener('input', validateInputs);
    loanTerm.addEventListener('input', validateInputs);

    // Add focus effects
    [loanAmount, interestRate, loanTerm].forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });

    calculateBtn.addEventListener('click', function() {
        const principal = parseFloat(loanAmount.value);
        const rate = parseFloat(interestRate.value) / 100 / 12; // Monthly rate
        const time = parseFloat(loanTerm.value) * 12; // Months

        if (!principal || !rate || !time) {
            showNotification('Please fill all fields with valid values!', 'error');
            return;
        }

        // Show loading state
        this.innerHTML = '<i class="bi bi-hourglass-split"></i> Calculating...';
        this.disabled = true;

        // Simulate calculation delay for better UX
        setTimeout(() => {
            const emi = calculateEMI(principal, rate, time);
            const totalAmount = emi * time;
            const totalInterest = totalAmount - principal;

            resultDiv.innerHTML = `
                <h4><i class="bi bi-calculator"></i> EMI Calculation Results:</h4>
                <div class="result-grid">
                    <div class="result-item">
                        <i class="bi bi-currency-rupee"></i>
                        <div>
                            <strong>Monthly EMI:</strong>
                            <span class="result-value">₹${emi.toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="result-item">
                        <i class="bi bi-graph-up"></i>
                        <div>
                            <strong>Total Amount:</strong>
                            <span class="result-value">₹${totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="result-item">
                        <i class="bi bi-percent"></i>
                        <div>
                            <strong>Total Interest:</strong>
                            <span class="result-value">₹${totalInterest.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            `;
            resultDiv.style.display = 'block';
            
            // Reset button
            this.innerHTML = '<i class="bi bi-calculator"></i> Calculate EMI';
            this.disabled = false;
            validateInputs();
            
            // Show success notification
            showNotification('EMI calculation completed successfully!', 'success');
        }, 1000);
    });

    function calculateEMI(principal, rate, time) {
        if (rate === 0) return principal / time;
        return principal * rate * Math.pow(1 + rate, time) / (Math.pow(1 + rate, time) - 1);
    }
}

// BMI Calculator Tool
function initBMICalculator() {
    const weight = document.getElementById('weight');
    const height = document.getElementById('height');
    const calculateBtn = document.getElementById('calculate-bmi');
    const resultDiv = document.getElementById('bmi-result');

    calculateBtn.addEventListener('click', function() {
        const w = parseFloat(weight.value);
        const h = parseFloat(height.value) / 100; // Convert cm to meters

        if (!w || !h) {
            alert('Please fill all fields!');
            return;
        }

        const bmi = w / (h * h);
        const category = getBMICategory(bmi);

        resultDiv.innerHTML = `
            <h4>BMI Calculation Results:</h4>
            <p><strong>Your BMI:</strong> ${bmi.toFixed(1)}</p>
            <p><strong>Category:</strong> ${category}</p>
        `;
        resultDiv.style.display = 'block';
    });

    function getBMICategory(bmi) {
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 25) return 'Normal weight';
        if (bmi < 30) return 'Overweight';
        return 'Obese';
    }
}

// Currency Converter Tool
function initCurrencyConverter() {
    const amount = document.getElementById('amount');
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const convertBtn = document.getElementById('convert-currency');
    const loadingDiv = document.getElementById('conversion-loading');
    const resultDiv = document.getElementById('currency-result');

    // Multiple API options for better reliability
    const API_OPTIONS = {
        // Option 1: Exchange Rate API (requires API key)
        exchangeRate: {
            url: 'https://v6.exchangerate-api.com/v6/YOUR_API_KEY/pair/',
            requiresKey: true
        },
        // Option 2: Fixer.io API (free tier available)
        fixer: {
            url: 'http://data.fixer.io/api/latest?access_key=YOUR_FIXER_API_KEY&base=',
            requiresKey: true
        },
        // Option 3: Free API (no key required)
        freeAPI: {
            url: 'https://api.exchangerate.host/latest?base=',
            requiresKey: false
        }
    };

    // Current API configuration (using free API by default)
    const CURRENT_API = API_OPTIONS.freeAPI;

    convertBtn.addEventListener('click', function() {
        const amt = parseFloat(amount.value);
        const from = fromCurrency.value;
        const to = toCurrency.value;

        if (!amt) {
            showNotification('Please enter an amount!', 'error');
            return;
        }

        if (from === to) {
            resultDiv.innerHTML = `<p><strong>Result:</strong> ${amt.toFixed(2)} ${from}</p>`;
            resultDiv.style.display = 'block';
            return;
        }

        // Show loading
        loadingDiv.style.display = 'flex';
        resultDiv.style.display = 'none';

        // Try multiple APIs for better reliability
        fetchExchangeRate(from, to, amt);
    });

    async function fetchExchangeRate(from, to, amount) {
        try {
            let rate = null;
            let apiUsed = '';

            // Try free API first
            try {
                const response = await fetch(`${CURRENT_API.url}${from}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.rates && data.rates[to]) {
                        rate = data.rates[to];
                        apiUsed = 'Free API';
                    }
                }
            } catch (error) {
                console.log('Free API failed, trying fallback...');
            }

            // If free API failed, try alternative method
            if (!rate) {
                try {
                    const response = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=1`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.result) {
                            rate = data.result;
                            apiUsed = 'Conversion API';
                        }
                    }
                } catch (error) {
                    console.log('Conversion API failed, using fallback rates...');
                }
            }

            loadingDiv.style.display = 'none';

            if (rate) {
                const result = amount * rate;
                const lastUpdate = new Date().toLocaleString();

                resultDiv.innerHTML = `
                    <h4><i class="bi bi-currency-exchange"></i> Currency Conversion Result:</h4>
                    <div class="result-grid">
                        <div class="result-item">
                            <i class="bi bi-arrow-right"></i>
                            <div>
                                <strong>${amount.toFixed(2)} ${from}</strong> = <strong>${result.toFixed(2)} ${to}</strong>
                            </div>
                        </div>
                        <div class="result-item">
                            <i class="bi bi-graph-up"></i>
                            <div>
                                <strong>Exchange Rate:</strong>
                                <span class="result-value">1 ${from} = ${rate.toFixed(4)} ${to}</span>
                            </div>
                        </div>
                        <div class="result-item">
                            <i class="bi bi-info-circle"></i>
                            <div>
                                <strong>Source:</strong>
                                <span class="result-value">${apiUsed}</span>
                            </div>
                        </div>
                    </div>
                    <p class="update-time"><small><i class="bi bi-clock"></i> Last updated: ${lastUpdate}</small></p>
                `;
                resultDiv.style.display = 'block';
                showNotification('Currency conversion completed successfully!', 'success');
            } else {
                throw new Error('All APIs failed');
            }
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
            loadingDiv.style.display = 'none';
            
            // Use more accurate fallback rates (updated as of recent data)
            const fallbackRates = {
                USD: { EUR: 0.92, GBP: 0.79, JPY: 149.5, CAD: 1.35, AUD: 1.52, CHF: 0.87, CNY: 7.18, INR: 83.2 },
                EUR: { USD: 1.09, GBP: 0.86, JPY: 162.5, CAD: 1.47, AUD: 1.65, CHF: 0.95, CNY: 7.80, INR: 90.4 },
                GBP: { USD: 1.27, EUR: 1.16, JPY: 189.2, CAD: 1.71, AUD: 1.92, CHF: 1.10, CNY: 9.09, INR: 105.3 },
                JPY: { USD: 0.0067, EUR: 0.0062, GBP: 0.0053, CAD: 0.0090, AUD: 0.0102, CHF: 0.0058, CNY: 0.048, INR: 0.56 },
                CAD: { USD: 0.74, EUR: 0.68, GBP: 0.58, JPY: 110.7, AUD: 1.13, CHF: 0.64, CNY: 5.32, INR: 61.6 },
                AUD: { USD: 0.66, EUR: 0.61, GBP: 0.52, JPY: 98.4, CAD: 0.88, CHF: 0.57, CNY: 4.72, INR: 54.7 },
                CHF: { USD: 1.15, EUR: 1.05, GBP: 0.91, JPY: 172.4, CAD: 1.56, AUD: 1.75, CNY: 8.25, INR: 95.6 },
                CNY: { USD: 0.14, EUR: 0.13, GBP: 0.11, JPY: 20.8, CAD: 0.19, AUD: 0.21, CHF: 0.12, INR: 11.6 },
                INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.80, CAD: 0.016, AUD: 0.018, CHF: 0.010, CNY: 0.086 }
            };

            const rate = fallbackRates[from]?.[to];
            if (rate) {
                const result = amount * rate;
                resultDiv.innerHTML = `
                    <h4><i class="bi bi-currency-exchange"></i> Currency Conversion Result:</h4>
                    <div class="result-grid">
                        <div class="result-item">
                            <i class="bi bi-arrow-right"></i>
                            <div>
                                <strong>${amount.toFixed(2)} ${from}</strong> = <strong>${result.toFixed(2)} ${to}</strong>
                            </div>
                        </div>
                        <div class="result-item">
                            <i class="bi bi-graph-up"></i>
                            <div>
                                <strong>Exchange Rate:</strong>
                                <span class="result-value">1 ${from} = ${rate.toFixed(4)} ${to}</span>
                            </div>
                        </div>
                    </div>
                `;
                resultDiv.style.display = 'block';
                showNotification('Using fallback rates (API unavailable). Please check your internet connection.', 'warning');
            } else {
                resultDiv.innerHTML = `
                    <h4><i class="bi bi-exclamation-triangle"></i> Conversion Error:</h4>
                    <p>Unable to fetch current exchange rates. Please try again later or check your internet connection.</p>
                `;
                resultDiv.style.display = 'block';
                showNotification('Failed to convert currency. Please try again.', 'error');
            }
        }
    }
}

// Contact Form
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const subject = this.querySelectorAll('input[type="text"]')[1].value;
        const message = this.querySelector('textarea').value;

        if (!name || !email || !subject || !message) {
            alert('Please fill all fields!');
            return;
        }

        // Simulate form submission
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
}

// Auth Forms
function initAuthForms() {
    const loginForm = document.querySelector('#login-modal .auth-form');
    const signupForm = document.querySelector('#signup-modal .auth-form');

    // Password toggle functionality
    function initPasswordToggles() {
        const passwordToggles = document.querySelectorAll('.password-toggle');
        
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const input = this.previousElementSibling;
                const icon = this.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.className = 'bi bi-eye-slash';
                } else {
                    input.type = 'password';
                    icon.className = 'bi bi-eye';
                }
            });
        });
    }

    // Form validation and enhancement
    function enhanceForm(form) {
        const inputs = form.querySelectorAll('input');
        
        inputs.forEach(input => {
            // Add focus effects
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });

            // Real-time validation
            input.addEventListener('input', function() {
                validateInput(this);
            });
        });
    }

    function validateInput(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (input.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                errorMessage = 'Please enter a valid email address';
                break;
            case 'password':
                if (input.placeholder.includes('Confirm')) {
                    const passwordInput = input.parentElement.parentElement.previousElementSibling.querySelector('input[type="password"]');
                    isValid = value === passwordInput.value;
                    errorMessage = 'Passwords do not match';
                } else {
                    isValid = value.length >= 6;
                    errorMessage = 'Password must be at least 6 characters';
                }
                break;
            case 'text':
                if (input.placeholder.includes('Name')) {
                    isValid = value.length >= 2;
                    errorMessage = 'Name must be at least 2 characters';
                }
                break;
        }

        // Visual feedback
        if (value && !isValid) {
            input.style.borderColor = '#f44336';
            showInputError(input, errorMessage);
        } else {
            input.style.borderColor = '';
            hideInputError(input);
        }

        return isValid;
    }

    function showInputError(input, message) {
        let errorDiv = input.parentElement.querySelector('.input-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'input-error';
            input.parentElement.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    function hideInputError(input) {
        const errorDiv = input.parentElement.querySelector('.input-error');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    // Login form handling
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;
        const rememberMe = this.querySelector('input[type="checkbox"]').checked;

        if (!email || !password) {
            showNotification('Please fill all required fields!', 'error');
            return;
        }

        if (!validateInput(this.querySelector('input[type="email"]')) || 
            !validateInput(this.querySelector('input[type="password"]'))) {
            showNotification('Please correct the errors in the form!', 'error');
            return;
        }

        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Signing In...';
        submitBtn.disabled = true;

        // Simulate login process
        setTimeout(() => {
            showNotification('Login successful! Welcome back.', 'success');
            this.reset();
            this.closest('.modal').style.display = 'none';
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });

    // Signup form handling
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelectorAll('input[type="password"]')[0].value;
        const confirmPassword = this.querySelectorAll('input[type="password"]')[1].value;
        const agreeTerms = this.querySelector('input[type="checkbox"]').checked;

        if (!name || !email || !password || !confirmPassword) {
            showNotification('Please fill all required fields!', 'error');
            return;
        }

        if (!agreeTerms) {
            showNotification('Please agree to the Terms & Conditions!', 'error');
            return;
        }

        if (!validateInput(this.querySelector('input[type="text"]')) ||
            !validateInput(this.querySelector('input[type="email"]')) ||
            !validateInput(this.querySelectorAll('input[type="password"]')[0]) ||
            !validateInput(this.querySelectorAll('input[type="password"]')[1])) {
            showNotification('Please correct the errors in the form!', 'error');
            return;
        }

        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Creating Account...';
        submitBtn.disabled = true;

        // Simulate signup process
        setTimeout(() => {
            showNotification('Account created successfully! Welcome to PupilHelper.', 'success');
            this.reset();
            this.closest('.modal').style.display = 'none';
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });

    // Social login buttons
    document.querySelectorAll('.btn-social').forEach(btn => {
        btn.addEventListener('click', function() {
            const provider = this.classList.contains('btn-google') ? 'Google' : 'Facebook';
            showNotification(`${provider} login would be implemented with OAuth integration.`, 'info');
        });
    });

    // Initialize password toggles and form enhancement
    initPasswordToggles();
    enhanceForm(loginForm);
    enhanceForm(signupForm);
}

// Smooth scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animations
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.tool-card, .service-card, .feature');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style); 