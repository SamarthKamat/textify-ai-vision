# Tesseract OCR Installation Guide

The application requires Tesseract OCR to be installed and properly configured. Follow these steps to set it up:

## Windows Installation Steps

1. Download Tesseract installer:
   - Visit [Tesseract at UB Mannheim](https://github.com/UB-Mannheim/tesseract/wiki)
   - Download the latest installer (e.g., `tesseract-ocr-w64-setup-5.3.3.20231005.exe`)

2. Run the installer:
   - Double-click the downloaded installer
   - Choose your installation directory (e.g., `C:\Program Files\Tesseract-OCR`)
   - Select additional language data if needed
   - Complete the installation

3. Add to System PATH:
   - Open System Properties (Win + Pause/Break)
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System Variables", find and select "Path"
   - Click "Edit"
   - Click "New"
   - Add the Tesseract installation directory (e.g., `C:\Program Files\Tesseract-OCR`)
   - Click "OK" to close all windows

4. Verify Installation:
   - Open a new Command Prompt or PowerShell window
   - Run `tesseract --version`
   - If successful, you'll see the Tesseract version information

## Troubleshooting

- If `tesseract` command is not recognized:
  - Verify the installation directory exists
  - Double-check the PATH environment variable
  - Restart your terminal/IDE after making changes

- If you get DLL errors:
  - Install Visual C++ Redistributable if needed
  - Try reinstalling Tesseract

After completing these steps, restart your development environment and the application should work correctly.