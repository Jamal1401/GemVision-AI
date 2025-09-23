/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenAI, Type, Chat } from "@google/genai";
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as XLSX from 'xlsx';

// --- Stripe Type Declaration ---
declare var Stripe: any;

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selectors ---
    const fileUpload = document.getElementById('file-upload') as HTMLInputElement;
    const cameraButton = document.getElementById('camera-button') as HTMLButtonElement;
    
    // New Valuation Form Elements
    const stoneDescriptionInput = document.getElementById('stone-description') as HTMLInputElement;
    const totalCaratWeightInput = document.getElementById('total-carat-weight') as HTMLInputElement;
    const stoneSizeInput = document.getElementById('stone-size') as HTMLSelectElement;
    const stoneModelInput = document.getElementById('stone-model') as HTMLSelectElement;
    const stoneQualityInput = document.getElementById('stone-quality') as HTMLSelectElement;
    const stoneColourInput = document.getElementById('stone-colour') as HTMLSelectElement;
    const valuateBtn = document.getElementById('valuate-btn') as HTMLButtonElement;
    
    // Suggestion Status Elements
    const modelSuggestionStatus = document.getElementById('model-suggestion-status') as HTMLSpanElement;
    const qualitySuggestionStatus = document.getElementById('quality-suggestion-status') as HTMLSpanElement;

    // Price Book Upload Elements
    const priceBookUpload = document.getElementById('price-book-upload') as HTMLInputElement;
    const priceBookFileName = document.getElementById('price-book-file-name') as HTMLSpanElement;
    const removePriceBookBtn = document.getElementById('remove-price-book-btn') as HTMLButtonElement;
    
    const loadingOverlay = document.getElementById('loading-overlay') as HTMLDivElement;
    const loadingText = document.getElementById('loading-text') as HTMLParagraphElement;
    const fileNameSpan = document.getElementById('file-name') as HTMLSpanElement;
    const imagePreviewContainer = document.getElementById('image-preview-container') as HTMLDivElement;
    const imagePreview = document.getElementById('image-preview') as HTMLImageElement;
    const removeImageBtn = document.getElementById('remove-image-btn') as HTMLButtonElement;
    const notificationContainer = document.getElementById('notification-container') as HTMLDivElement;
    const generatorGate = document.getElementById('generator-gate') as HTMLDivElement;
    const gateSignupBtn = document.getElementById('gate-signup-btn') as HTMLButtonElement;
    const attemptsCounter = document.getElementById('attempts-counter') as HTMLParagraphElement;
    const navActionBtn = document.getElementById('nav-action-btn') as HTMLAnchorElement;
    const navUserProfile = document.getElementById('nav-user-profile') as HTMLDivElement;
    const navProfilePicture = document.getElementById('nav-profile-picture') as HTMLImageElement;

    // Analysis & Valuation Result Containers
    const stoneAnalysisContainer = document.getElementById('stone-analysis-container') as HTMLDivElement;
    const stoneCountSpan = document.getElementById('stone-count') as HTMLSpanElement;
    const valuationResultsContainer = document.getElementById('valuation-results-container') as HTMLDivElement;
    const valuationContent = document.getElementById('valuation-content') as HTMLDivElement;


    // Video Preview Elements
    const videoPreviewContainer = document.getElementById('video-preview-container') as HTMLDivElement;
    const videoPreview = document.getElementById('video-preview') as HTMLVideoElement;
    const captureFrameBtn = document.getElementById('capture-frame-btn') as HTMLButtonElement;

    // Camera Modal Elements
    const cameraModal = document.getElementById('camera-modal') as HTMLDivElement;
    const cameraStream = document.getElementById('camera-stream') as HTMLVideoElement;
    const captureBtn = document.getElementById('capture-btn') as HTMLButtonElement;
    const closeModalBtn = document.getElementById('close-modal-btn') as HTMLButtonElement;

    // Image Zoom Modal Elements
    const imageZoomModal = document.getElementById('image-zoom-modal') as HTMLDivElement;
    const zoomedImage = document.getElementById('zoomed-image') as HTMLImageElement;
    const zoomCloseBtn = document.getElementById('zoom-close-btn') as HTMLSpanElement;
    const analyzeGemBtn = document.getElementById('analyze-gem-btn') as HTMLButtonElement;
    const zoomAnalysisResult = document.getElementById('zoom-analysis-result') as HTMLParagraphElement;
    
    // Auth Modal Elements
    const authModal = document.getElementById('auth-modal') as HTMLDivElement;
    const authCloseBtn = document.getElementById('auth-close-btn') as HTMLButtonElement;
    const loginView = document.getElementById('login-view') as HTMLDivElement;
    const showRegisterViewLink = document.getElementById('show-register-view') as HTMLAnchorElement;
    const showLoginViewLink = document.getElementById('show-login-view') as HTMLAnchorElement;
    const loginForm = document.getElementById('login-form') as HTMLFormElement;
    const loginEmailInput = document.getElementById('login-email') as HTMLInputElement;
    const loginPasswordInput = document.getElementById('login-password') as HTMLInputElement;
    
    // New Registration Flow Elements
    const registerView = document.getElementById('register-view') as HTMLDivElement;
    const verifyEmailView = document.getElementById('verify-email-view') as HTMLDivElement;
    const setPasswordView = document.getElementById('set-password-view') as HTMLDivElement;
    const registerForm = document.getElementById('register-form') as HTMLFormElement;
    const registerEmailInput = document.getElementById('register-email') as HTMLInputElement;
    const verifyEmailBtn = document.getElementById('verify-email-btn') as HTMLButtonElement;
    const setPasswordForm = document.getElementById('set-password-form') as HTMLFormElement;
    const registerPasswordInput = document.getElementById('register-password') as HTMLInputElement;
    const registerConfirmPasswordInput = document.getElementById('register-confirm-password') as HTMLInputElement;


    // Profile Modal Elements
    const profileModal = document.getElementById('profile-modal') as HTMLDivElement;
    const profileCloseBtn = document.getElementById('profile-close-btn') as HTMLButtonElement;
    const profileView = document.getElementById('profile-view') as HTMLDivElement;
    const profilePictureDisplay = document.getElementById('profile-picture-display') as HTMLImageElement;
    const profileEditView = document.getElementById('profile-edit-view') as HTMLDivElement;
    const profileEmail = document.getElementById('profile-email') as HTMLParagraphElement;
    const profilePlan = document.getElementById('profile-plan') as HTMLParagraphElement;
    const profileAttempts = document.getElementById('profile-attempts') as HTMLParagraphElement;
    const editProfileBtn = document.getElementById('edit-profile-btn') as HTMLButtonElement;
    const profileEditForm = document.getElementById('profile-edit-form') as HTMLFormElement;
    const profilePictureUpload = document.getElementById('profile-picture-upload') as HTMLInputElement;
    const profileEditPreview = document.getElementById('profile-edit-preview') as HTMLImageElement;
    const profileEditEmailInput = document.getElementById('profile-edit-email') as HTMLInputElement;
    const profileLogoutBtn = document.getElementById('profile-logout-btn') as HTMLButtonElement;

    // Admin Panel Elements
    const adminPanel = document.getElementById('admin-panel') as HTMLElement;
    const adminUploadForm = document.getElementById('admin-upload-form') as HTMLFormElement;
    const adminFileUpload = document.getElementById('admin-file-upload') as HTMLInputElement;
    const adminStatus = document.getElementById('admin-status') as HTMLParagraphElement;

    // My Creations Elements
    const myCreationsSection = document.getElementById('my-creations-section') as HTMLElement;
    const myCreationsGrid = document.getElementById('my-creations-grid') as HTMLDivElement;
    const myPostsSection = document.getElementById('my-posts-section') as HTMLElement;
    const myPostsGrid = document.getElementById('my-posts-grid') as HTMLDivElement;

    // My Tasks Elements
    const myTasksSection = document.getElementById('my-tasks-section') as HTMLElement;
    const myTasksGrid = document.getElementById('my-tasks-grid') as HTMLDivElement;
    const createNewTaskBtn = document.getElementById('create-new-task-btn') as HTMLButtonElement;

    // Pricing & Payment Elements
    const currencySwitcher = document.getElementById('currency-switcher') as HTMLDivElement;
    const priceElements = document.querySelectorAll('.price[data-price-usd]') as NodeListOf<HTMLElement>;
    const paidPlanButtons = document.querySelectorAll('.pricing-button[data-plan="pro"], .pricing-button[data-plan="elite"]');

    // Payment Method Modal Elements
    const paymentMethodModal = document.getElementById('payment-method-modal') as HTMLDivElement;
    const paymentMethodCloseBtn = document.getElementById('payment-method-close-btn') as HTMLButtonElement;
    const paymentMethodTitle = document.getElementById('payment-method-title') as HTMLHeadingElement;
    const payWithCardBtn = document.getElementById('pay-with-card-btn') as HTMLButtonElement;
    const payWithCryptoBtn = document.getElementById('pay-with-crypto-btn') as HTMLButtonElement;

    // AI Helper Chat Elements
    const aiHelperFab = document.getElementById('ai-helper-fab') as HTMLButtonElement;
    const aiHelperWidget = document.getElementById('ai-helper-widget') as HTMLDivElement;
    const chatCloseBtn = document.getElementById('chat-close-btn') as HTMLButtonElement;
    const chatMessagesContainer = document.getElementById('chat-messages') as HTMLDivElement;
    const chatForm = document.getElementById('chat-form') as HTMLFormElement;
    const chatInput = document.getElementById('chat-input') as HTMLInputElement;


    // --- State Management ---
    let uploadedFile: {
        base64: string;
        mimeType: string;
    } | null = null;
    let priceBookData: string | null = null; // Holds the CSV string of the price book
    let stream: MediaStream | null = null;
    const loadingMessages = [
        "Analyzing stone characteristics...",
        "Consulting market data...",
        "Calculating valuation...",
        "Preparing your report...",
        "Almost there..."
    ];
    let loadingInterval: number;
    
    // Auth State
    type UserPlan = 'free' | 'pro' | 'elite' | 'admin';

    let currentUser: { 
        email: string; 
        attemptsLeft: number; 
        plan: UserPlan;
        profilePicture?: string;
    } | null = null;
    let registrationEmail: string | null = null; // Used for multi-step registration
    const ADMIN_EMAIL = 'admin@gemvision.ai';

    // Payment State
    let stripe: any = null;
    let currentCurrency: 'usd' | 'inr' = 'usd';
    let selectedPlanForPayment: {
        plan: UserPlan;
        planName: string;
        priceIdUsd: string;
        priceIdInr: string;
    } | null = null;
    
    // AI Helper State
    let aiHelperChat: Chat | null = null;


    // --- Gemini API Initialization ---
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    interface ShowcaseItem {
        id: string;
        gemstoneImage: string;
        designImage: string;
        name: string;
        description: string;
    }

    
    // --- Functions ---

    /**
     * Shows a toast notification.
     * @param message The message to display.
     * @param type The type of notification ('error', 'success').
     * @param duration The duration in ms. 0 for permanent.
     */
    function showNotification(message: string, type: 'error' | 'success' = 'error', duration: number = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        notificationContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '1';
        }, 10);

        if (duration > 0) {
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 500);
            }, duration);
        }
    }
    
    /**
     * Hashes a password using the browser's SubtleCrypto API.
     * @param password The password string to hash.
     * @returns A promise that resolves to a hex-encoded SHA-256 hash.
     */
    async function hashPassword(password: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Checks if localStorage is available and writable.
     */
    function isLocalStorageAvailable(): boolean {
        try {
            const testKey = '__gemvision_test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Updates the state of the valuate button based on input.
     */
    function updateValuationButtonState() {
        const allInputs = [
            totalCaratWeightInput, stoneSizeInput, stoneModelInput, stoneQualityInput, stoneColourInput
        ];

        if (currentUser) {
            const outOfAttempts = currentUser.plan === 'free' && currentUser.attemptsLeft <= 0;
            const missingInputs = !uploadedFile || allInputs.some(input => !input.value.trim());

            valuateBtn.disabled = outOfAttempts || missingInputs;

            if (outOfAttempts) {
                valuateBtn.dataset.tooltip = "You've used all your free valuations. Please upgrade your plan.";
            } else if (missingInputs) {
                valuateBtn.dataset.tooltip = "Please upload an image and fill in all stone details.";
            } else {
                valuateBtn.dataset.tooltip = "Get an AI-powered valuation for your stone(s).";
            }
        } else {
            valuateBtn.disabled = true;
            valuateBtn.dataset.tooltip = "Please log in or register to get a valuation.";
        }
    }

    /**
     * Handles file selection routing between image and video.
     * @param file The file selected by the user.
     */
    function handleFile(file: File) {
        if (file.type.startsWith('image/')) {
            handleImageFile(file);
        } else if (file.type.startsWith('video/')) {
            handleVideoFile(file);
        } else {
            showNotification('Please select an image or video file.');
        }
    }

    /**
     * Handles image file selection, converting the image to base64 and showing a preview.
     * @param file The image file selected by the user.
     */
    async function handleImageFile(file: File) {
        resetFileInput();
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = (reader.result as string).split(',')[1];
            uploadedFile = {
                base64: base64String,
                mimeType: file.type
            };

            imagePreview.src = `data:${file.type};base64,${base64String}`;
            imagePreviewContainer.style.display = 'block';
            fileNameSpan.textContent = file.name;
            
            // Run analysis functions
            await Promise.all([
                countStones(),
                suggestStoneProperties()
            ]);
            
            updateValuationButtonState();
        };
        reader.readAsDataURL(file);
    }

    /**
     * Handles video file selection, showing a video player for frame capture.
     * @param file The video file selected by the user.
     */
    function handleVideoFile(file: File) {
        resetFileInput();
        videoPreviewContainer.style.display = 'flex';
        const videoUrl = URL.createObjectURL(file);
        videoPreview.src = videoUrl;
        fileNameSpan.textContent = file.name;
    }

    /**
     * Parses an uploaded price book file (CSV or XLSX) into a CSV string.
     * @param file The file to parse.
     */
    async function parsePriceBook(file: File) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                if (!data) throw new Error("File could not be read.");
                let csvData: string;

                if (file.name.endsWith('.csv')) {
                    csvData = data as string;
                } else { // Handle .xlsx
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    csvData = XLSX.utils.sheet_to_csv(worksheet);
                }

                priceBookData = csvData;
                localStorage.setItem('gemvision_priceBook', priceBookData);
                priceBookFileName.textContent = file.name;
                removePriceBookBtn.style.display = 'block';
                showNotification("Price book loaded successfully!", "success");
            } catch (error) {
                console.error("Error parsing price book:", error);
                showNotification("Could not parse the price book. Please ensure it's a valid CSV or XLSX file.", "error");
                removePriceBook();
            }
        };

        reader.onerror = () => {
             showNotification("Error reading the price book file.", "error");
        };

        if (file.name.endsWith('.csv')) {
            reader.readAsText(file);
        } else {
            reader.readAsArrayBuffer(file);
        }
    }

    /**
     * Clears the current price book from state and storage.
     */
    function removePriceBook() {
        priceBookData = null;
        localStorage.removeItem('gemvision_priceBook');
        priceBookFileName.textContent = 'Upload Price Book (Optional)';
        removePriceBookBtn.style.display = 'none';
        priceBookUpload.value = ''; // Reset file input
        showNotification("Price book removed.", "success");
    }

    /**
     * Resets the file input and all previews.
     */
    function resetFileInput() {
        uploadedFile = null;
        fileUpload.value = '';

        // Image preview reset
        imagePreviewContainer.style.display = 'none';
        imagePreview.src = '#';

        // Video preview reset
        if (videoPreview.src && videoPreview.src.startsWith('blob:')) {
            URL.revokeObjectURL(videoPreview.src);
        }
        videoPreview.src = '';
        videoPreviewContainer.style.display = 'none';
        
        // Analysis reset
        stoneAnalysisContainer.style.display = 'none';
        stoneCountSpan.textContent = '...';
        valuationResultsContainer.style.display = 'none';
        valuationContent.innerHTML = '';

        // Suggestion status reset
        modelSuggestionStatus.textContent = '';
        qualitySuggestionStatus.textContent = '';
        stoneModelInput.value = '';
        stoneQualityInput.value = '';


        fileNameSpan.textContent = 'Upload Photo or Video';
        updateValuationButtonState();
    }

    /**
     * Toggles the loading overlay and updates its text.
     * @param isLoading Whether to show or hide the overlay.
     */
    function toggleLoading(isLoading: boolean, text: string = "Analyzing...") {
        if (isLoading) {
            loadingText.textContent = text;
            let messageIndex = 0;
            loadingText.textContent = loadingMessages[messageIndex];
            loadingInterval = window.setInterval(() => {
                messageIndex = (messageIndex + 1) % loadingMessages.length;
                loadingText.textContent = loadingMessages[messageIndex];
            }, 2500);
            loadingOverlay.style.display = 'flex';
        } else {
            clearInterval(loadingInterval);
            loadingOverlay.style.display = 'none';
        }
    }

    /**
     * Starts the camera stream.
     */
    async function startCamera() {
        try {
            const constraints = { video: { facingMode: 'environment' }, audio: false };
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            cameraStream.srcObject = stream;
            cameraModal.style.display = 'flex';
        } catch (err) {
            console.error("Error accessing camera: ", err);
            let message = "Could not access the camera. Please ensure it's not in use by another application.";
            if (err instanceof DOMException) {
                // This error is thrown if the user denies permission or has previously denied it.
                if (err.name === 'NotAllowedError') {
                    message = "Camera access was denied or dismissed. To use this feature, please enable camera permissions for this site in your browser's settings.";
                } else if (err.name === 'NotFoundError') {
                    message = "No camera was found on your device. Please ensure a camera is connected and enabled.";
                } else if (err.name === 'NotReadableError') {
                    message = "The camera is currently in use by another application or a hardware error occurred. Please close other apps and try again.";
                }
            }
            showNotification(message, "error", 8000); // Show for longer to allow user to read.
        }
    }

    /**
     * Stops the camera stream.
     */
    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
        cameraModal.style.display = 'none';
    }
    
    /**
     * If the uploaded image is a parcel, counts the number of stones.
     */
    async function countStones() {
        if (!uploadedFile) return;

        stoneAnalysisContainer.style.display = 'block';
        stoneCountSpan.textContent = 'Analyzing...';
        
        try {
            const imagePart = {
                inlineData: {
                    mimeType: uploadedFile.mimeType,
                    data: uploadedFile.base64,
                },
            };
            const prompt = "Analyze the image. How many distinct stones or diamonds are visible? Respond with ONLY an integer number.";

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: { parts: [imagePart, { text: prompt }] },
            });
            
            const count = parseInt(response.text.trim(), 10);
            if (!isNaN(count)) {
                stoneCountSpan.textContent = count.toString();
            } else {
                stoneCountSpan.textContent = "1 (Could not auto-count)";
            }

        } catch (error) {
            console.error("Error counting stones:", error);
            stoneCountSpan.textContent = "N/A";
            showNotification("AI could not count the stones. Please proceed with valuation.", "error");
        }
    }

     /**
     * Analyzes the image and suggests the Model and Quality.
     */
    async function suggestStoneProperties() {
        if (!uploadedFile) return;

        // Set UI to loading state
        modelSuggestionStatus.textContent = 'AI Suggesting...';
        qualitySuggestionStatus.textContent = 'AI Suggesting...';
        stoneModelInput.disabled = true;
        stoneQualityInput.disabled = true;

        try {
            const imagePart = {
                inlineData: {
                    mimeType: uploadedFile.mimeType,
                    data: uploadedFile.base64,
                },
            };

            const modelOptions = Array.from(stoneModelInput.options).map(opt => opt.value).filter(Boolean).join('", "');
            const qualityOptions = Array.from(stoneQualityInput.options).map(opt => opt.value).filter(Boolean).join('", "');

            const prompt = `You are a master gemologist. Analyze the provided image of a rough diamond. Based on your analysis and the guidelines below, determine the most likely "Model/Shape" and "Quality/Clarity". Pay close attention to the stone's color in the image, as this is a critical factor for determining quality, especially for categories like 'Brown Sawable'.

            **Guidelines:**
            ${DIAMOND_GUIDELINES}
            
            **Task:**
            Respond with a JSON object containing two keys: "model" and "quality".
            - The value for "model" MUST be one of the following exact strings: ["${modelOptions}"].
            - The value for "quality" MUST be one of the following exact strings: ["${qualityOptions}"].
            Choose the single best fit for each.
            `;
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: { parts: [imagePart, { text: prompt }] },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            model: { type: Type.STRING },
                            quality: { type: Type.STRING }
                        },
                        required: ["model", "quality"]
                    }
                }
            });

            const suggestions = JSON.parse(response.text);
            
            if (suggestions.model && Array.from(stoneModelInput.options).some(opt => opt.value === suggestions.model)) {
                stoneModelInput.value = suggestions.model;
            }
             if (suggestions.quality && Array.from(stoneQualityInput.options).some(opt => opt.value === suggestions.quality)) {
                stoneQualityInput.value = suggestions.quality;
            }

        } catch (error) {
            console.error("Error suggesting properties:", error);
            showNotification("AI could not suggest properties for this image.", "error");
        } finally {
            // Reset UI to interactive state
            modelSuggestionStatus.textContent = '';
            qualitySuggestionStatus.textContent = '';
            stoneModelInput.disabled = false;
            stoneQualityInput.disabled = false;
        }
    }
    
    // Knowledge base from provided documents
    const DIAMOND_GUIDELINES = `
# ROUGH DIAMOND PRICING GUIDELINES

## 1. Size Classifications

| Size Classification | Diamond Carat Weight      | Size Classification | Diamond Carat Weight      |
|---------------------|---------------------------|---------------------|---------------------------|
| Specials            | +10.8 carats              | 6 Grainer           | 1.40 to 1.79 carats       |
| +10 Carats          | 9.80 to 10.79 carats      | 5 Grainer           | 1.20 to 1.39 carats       |
| +9 Carats           | 8.80 to 9.79 carats       | 4 Grainer           | 0.90 to 1.19 carats       |
| +8 Carats           | 7.80 to 8.79 carats       | 3 Grainer           | 0.66 to 0.89 carats       |
| +7 Carats           | 6.80 to 7.79 carats       | +11                 | 0.30 to 0.65 carats       |
| +6 Carats           | 5.80 to 6.79 carats       | +9                  | 0.13 to 0.29 carats       |
| +5 Carats           | 4.80 to 5.79 carats       | +7                  | 0.09 to 0.12 carats       |
| +4 Carats           | 3.80 to 4.79 carats       | +5                  | 0.05 to 0.08 carats       |
| +3 Carats           | 2.80 to 3.79 carats       | +3                  | 0.03 to 0.04 carats       |
| 10 Grainer          | 2.50 to 2.79 carats       | +1                  | 0.01 to 0.02 carats       |
| 8 Grainer           | 1.80 to 2.49 carats       | -1                  | < 0.01 carats             |

## 2. Models (10 carats to 8 grainers)

### Crystals High
- High yielding stones producing two polished princess cuts with a yield of around 70%.
- Stones have a sharp appearance with flat, unbroken faces and sharp, unbroken points.
- Stones have a square girdle and all opposing points line up with each other.

### Crystals Low
- High yielding stones producing two polished princess cuts with a yield of around 60%, or 70% for polished rectangular cuts from longer rectangular models.
- Stones have a sharp appearance with flat faces and sharp points. One or two faces and/or points may be broken.
- Lower yielding than Crystal High due to being broken. Longer or rectangular models.

### Sawable High
- Produces two polished round stones after sawing or laser cutting with a yield of around 55%.
- Stones are octahedral or dodecahedral in appearance. The girdles are square or rounded and all opposing points line up with each other.
- The edges and points appear slightly rounded.

### Sawable Low
- Produces two polished stones after sawing or laser cutting with a yield of around 40% to 45%.
- Stones are octahedral or dodecahedral in appearance but are low yielding due to off centre formations or flattened shapes.
- Stones may produce fancy shaped polished stones.

### Makeable High
- Stones are regular in shape and produce one polished stone with a yield of around 40% to 45%.
- Stones can be broken if the yield is not reduced.
- Only high yielding, thick maccles and well-shaped cubes are considered.

### Makeable Low
- Lower yielding, irregular shape stones.
- Broken and flatter stones producing one polished stone with a yield of around 25% to 30%.

### Brown sawable
- Includes all brown Crystals, Sawable High and Sawable Low models.

## 3. Quality (10 carats to 8 grainers)

### General Qualities (for Crystals, Sawable, Makeable)
- **1Q**: Produces clean polished stone(s). Can have a pinpoint inclusion on the manufacturing/sawing plane that will be eliminated and not affect yield.
- **2Q**: Produces a larger/main clean polished stone and a smaller second stone with a very small to small inclusion. The inclusion(s) will not alter the manufacturing decision or the polished yield. For Makeables, a small inclusion may remain in the polished stone, visible only with a 10x loupe.
- **3Q**: Stones have inclusions not located along the manufacturing/sawing plane which can affect the manufacturing decision and polished yield. Typically produces an included main stone and a clean or cleanish second stone. Inclusions may be visible to the naked eye.
- **4Q**: Inclusions throughout the stone, visible to the naked eye. Approximately one third of the stone is clean and inclusion free.

### Spotted Sawable
- **1Q**: Crystals, Sawable High or Low models. Numerous, small inclusions dispersed throughout the stone, visible to the naked eye. Approximately one quarter of the stone is clean and inclusion free.
- **2Q**: Crystals, Sawable High or Low models. Numerous inclusions including fractures and dark inclusions. The points are sharp and clean.

### Clivage
- **1Q**: Makeable models with a single straight heavy fracture, requiring splitting. Or Sawable models too heavily included for Spotted Sawable but with one sharp, inclusion-free point.
- **2Q**: Makeable models with more than one heavy fracture needing multiple splits.
- **3Q**: Makeable models with multiple cracks and dark inclusions needing multiple splits for small polished stones.

### Rejections
- Based on quantity and severity of inclusions, primarily for industrial use. Transparency decreases from 1Q to Common.
- **1Q**: Sawable/Makeable models, irregular shapes. Numerous cracks/inclusions. 50% transparency.
- **2Q**: 40% transparency.
- **3Q**: 30% transparency. Dark Brown stones usually Q3/Q4.
- **4Q**: 20% transparency.
- **Common**: 10% transparency.

### Boart
- **1**: Not good enough for common rejections. Less than 10% transparency but not completely opaque.
- **2**: No light or life. Opaque. Usually black, for industrial purposes.

### Brown Sawable Qualities
- Same as other sawable qualities (Crystals, Sawable High/Low) but with brown color.
- **1Col Brn**: Very lightest tint of brown (equiv. to EFG yellow).
- **2Col Brn**: Slightly more visible brown (equiv. to HI yellow).
- **3Col Brn**: A light brown stone (equiv. to JK yellow).
- **4Col Brn**: A dark brown stone (equiv. to Cape yellow).
`;

    /**
     * Renders a valuation table for a parcel of stones.
     * @param data The array of sorted stone groups from the AI.
     */
    function renderValuationTable(data: any[]) {
        const grandTotalStones = data.reduce((sum, row) => sum + (row.stoneCount || 0), 0);
        const grandTotalCarats = data.reduce((sum, row) => sum + (row.totalCarats || 0), 0);
        const grandTotalValue = data.reduce((sum, row) => sum + (row.totalValue || 0), 0);
        const avgPricePerCarat = grandTotalCarats > 0 ? grandTotalValue / grandTotalCarats : 0;

        const tableRows = data.map(row => `
            <tr>
                <td>${row.model || 'N/A'}</td>
                <td>${row.quality || 'N/A'}</td>
                <td>${row.colour || 'N/A'}</td>
                <td class="text-right">${(row.stoneCount || 0).toLocaleString()}</td>
                <td class="text-right">${(row.totalCarats || 0).toFixed(2)}</td>
                <td class="text-right">$${(row.pricePerCarat || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td class="text-right">$${(row.totalValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
        `).join('');

        const tableHTML = `
            <table class="valuation-table">
                <thead>
                    <tr>
                        <th>Model/Shape</th>
                        <th>Quality/Clarity</th>
                        <th>Colour</th>
                        <th class="text-right">Stone Count</th>
                        <th class="text-right">Total Carats</th>
                        <th class="text-right">Price per Carat (USD)</th>
                        <th class="text-right">Total Value (USD)</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3"><strong>Grand Total / Average</strong></td>
                        <td class="text-right"><strong>${grandTotalStones.toLocaleString()}</strong></td>
                        <td class="text-right"><strong>${grandTotalCarats.toFixed(2)}</strong></td>
                        <td class="text-right"><strong>$${avgPricePerCarat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                        <td class="text-right"><strong>$${grandTotalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                    </tr>
                </tfoot>
            </table>
            <p class="valuation-disclaimer">
                This is an AI-generated estimate for informational purposes and not a substitute for a professional appraisal by a certified gemologist.
            </p>
        `;

        valuationContent.innerHTML = tableHTML;
        valuationResultsContainer.style.display = 'block';
    }


    /**
     * Generates a valuation report for a parcel of stones in a table format.
     */
    async function generateParcelValuation() {
        const imagePart = {
            inlineData: {
                mimeType: uploadedFile!.mimeType,
                data: uploadedFile!.base64,
            },
        };
        
        let prompt = `You are an expert rough diamond appraiser specializing in sorting and valuing parcels.`;
        // Add Price Book or Guidelines context
        if (priceBookData) {
            prompt += ` Your primary task is to sort and value the stones in the image based *first and foremost* on the custom price book data provided below. Use the internal guidelines *only* as a secondary reference. **Prioritize the custom price book.**
            --- CUSTOM PRICE BOOK DATA (CSV) ---
            ${priceBookData}
            --- END OF CUSTOM PRICE BOOK ---
            --- INTERNAL GUIDELINES (Secondary) ---
            ${DIAMOND_GUIDELINES}
            --- END OF GUIDELINES ---`;
        } else {
            prompt += ` Your task is to sort and value the stones in the image based *only* on the internal pricing guidelines provided below. Do not use any external knowledge.
            --- PRICING GUIDELINES ---
            ${DIAMOND_GUIDELINES}
            --- END OF GUIDELINES ---`;
        }

        // Add user data context
        prompt += `
            **User-provided Data:**
            - Description: ${stoneDescriptionInput.value}
            - Total Carat Weight for the ENTIRE parcel: ${totalCaratWeightInput.value} carats
            - Dominant Size Classification in parcel: ${stoneSizeInput.value}
            - Dominant Model/Shape in parcel: ${stoneModelInput.value}
            - Dominant Quality/Clarity in parcel: ${stoneQualityInput.value}
            - Dominant Colour in parcel: ${stoneColourInput.value}

            **Your Task:**
            1.  **Analyze the Image:** Examine the image of the rough diamond parcel.
            2.  **Sort and Group:** Group the stones into distinct categories based on their visible **Model/Shape**, **Quality/Clarity**, and **Colour**.
            3.  **Distribute and Estimate:** For each group you identify:
                -   Estimate the number of stones in that group (\`stoneCount\`).
                -   Estimate the portion of the total carat weight that belongs to this group (\`totalCarats\`).
                -   Determine the price per carat for this specific group based on the provided price book or guidelines (\`pricePerCarat\`). Remember to heavily weigh the **Colour**.
                -   Calculate the total value for the group (\`totalValue\`).
            4.  **Crucial Constraint:** The sum of 'totalCarats' across all groups should be as close as possible to the user-provided Total Carat Weight (${totalCaratWeightInput.value} carats).
            5.  **Output Format:** Respond with ONLY a valid JSON array of objects. Each object represents one group of stones.
        `;
        
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: { parts: [imagePart, { text: prompt }] },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                model: { type: Type.STRING },
                                quality: { type: Type.STRING },
                                colour: { type: Type.STRING },
                                stoneCount: { type: Type.INTEGER },
                                totalCarats: { type: Type.NUMBER },
                                pricePerCarat: { type: Type.NUMBER },
                                totalValue: { type: Type.NUMBER }
                            },
                             required: ["model", "quality", "colour", "stoneCount", "totalCarats", "pricePerCarat", "totalValue"]
                        }
                    }
                }
            });
            
            // The response.text is already a parsed JSON object due to responseSchema
            const parcelData = JSON.parse(response.text);
            if (Array.isArray(parcelData) && parcelData.length > 0) {
                 renderValuationTable(parcelData);
            } else {
                throw new Error("AI returned empty or invalid data for parcel.");
            }
        } catch (error) {
            console.error("Error generating parcel valuation, falling back to text.", error);
            showNotification("AI could not sort the parcel, generating a standard report instead.", "error");
            await generateTextValuation(); // Fallback to the single stone/text valuation
        }
    }
    
    /**
     * Generates a standard text-based valuation report, used for single stones or as a fallback.
     */
    async function generateTextValuation() {
        const imagePart = {
            inlineData: {
                mimeType: uploadedFile!.mimeType,
                data: uploadedFile!.base64,
            },
        };
        
        let prompt = `You are an expert rough diamond appraiser. Your task is to provide a valuation report.`;

        if (priceBookData) {
            prompt += `
            Your primary task is to provide a valuation report based *first and foremost* on the custom price book data provided below. 
            Use the internal guidelines *only* as a secondary reference if the price book does not contain the specific stone. 
            **Prioritize the custom price book.**

            --- START OF CUSTOM PRICE BOOK DATA (CSV Format) ---
            ${priceBookData}
            --- END OF CUSTOM PRICE BOOK DATA ---

            --- START OF INTERNAL PRICING GUIDELINES (Secondary Reference) ---
            ${DIAMOND_GUIDELINES}
            --- END OF INTERNAL PRICING GUIDELINES ---
            `;
        } else {
             prompt += `
            Your task is to provide a valuation report based *only* on the internal pricing guidelines provided below and the data submitted by the user. Do not use any external knowledge.

            --- START OF PRICING GUIDELINES ---
            ${DIAMOND_GUIDELINES}
            --- END OF PRICING GUIDELINES ---
            `;
        }

        prompt += `
            **User-provided Data:**
            - Image Analysis Context: The image shows a single rough stone or a parcel where stones could not be individually sorted. An initial analysis estimated there are ${stoneCountSpan.textContent} stones.
            - Description: ${stoneDescriptionInput.value}
            - Total Carat Weight: ${totalCaratWeightInput.value} carats
            - Size Classification: ${stoneSizeInput.value}
            - Model/Shape: ${stoneModelInput.value}
            - Quality/Clarity: ${stoneQualityInput.value}
            - Colour: ${stoneColourInput.value}

            **Your Task:**
            0.  **Crucial Instruction:** When performing the valuation, give significant weight to the user-provided **Colour**. This is a critical factor and should heavily influence your final price determination, especially when cross-referencing with the 'Brown Sawable Qualities' in your guidelines or the price book.
            1.  Based on the provided data and pricing rules, provide an estimated **Price per Carat** in USD.
            2.  Calculate the **Total Estimated Value** in USD (Price per Carat * Total Carat Weight).
            3.  Write a brief **Market Commentary** (1-3 sentences) explaining the rationale for this price, referencing the specific model, quality, color, and size from the provided guidelines or price book.
            4.  Include a **Disclaimer** stating that this is an AI-generated estimate for informational purposes and not a substitute for a professional appraisal by a certified gemologist.

            **Output Format:**
            Provide the response as clear, readable text. Use markdown-style bold headings for each section: **Estimated Price per Carat**, **Total Estimated Value**, **Market Commentary**, and **Disclaimer**.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, { text: prompt }] },
        });
        
        const reportText = response.text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');

        valuationContent.innerHTML = reportText;
        valuationResultsContainer.style.display = 'block';
    }


    /**
     * Main function to handle the valuation process. Acts as a dispatcher.
     */
    async function getValuation() {
        if (!currentUser) {
            showNotification("Please log in to get a valuation.", "error");
            openAuthModal('login');
            return;
        }
        
        if (currentUser.plan === 'free' && currentUser.attemptsLeft <= 0) {
            showNotification("You have no attempts left. Please upgrade your plan.", "error");
            return;
        }

        if (valuateBtn.disabled || !uploadedFile) return;

        toggleLoading(true);
        valuationResultsContainer.style.display = 'none';

        try {
            const stoneCount = parseInt(stoneCountSpan.textContent || '1', 10);
            
            // If it's a parcel (more than 1 stone), try the table valuation.
            // Otherwise, or if count is not a number, use the text valuation.
            if (!isNaN(stoneCount) && stoneCount > 1) {
                await generateParcelValuation();
            } else {
                await generateTextValuation();
            }

            // Decrement attempts only after a successful valuation
            if (currentUser.plan === 'free') {
                currentUser.attemptsLeft--;
                saveCurrentUserState();
                updateAuthStateUI();
            }

        } catch (error) {
            console.error("Error getting valuation:", error);
            showNotification("An error occurred during valuation. Please try again.");
        } finally {
            toggleLoading(false);
            valuationResultsContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    /**
     * Opens the image zoom modal with the specified image and context.
     * @param src The source URL of the image to display.
     */
    function openImageZoom(src: string) {
        zoomedImage.src = src;
        zoomAnalysisResult.textContent = "Click 'Analyze Gem' to get a detailed report on this stone.";
        analyzeGemBtn.disabled = false;
        analyzeGemBtn.textContent = 'Analyze Gem';
        imageZoomModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Closes the image zoom modal.
     */
    function closeImageZoom() {
        imageZoomModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

     /**
     * Analyzes the currently zoomed-in image using a context-aware AI prompt.
     */
    async function analyzeZoomedImage() {
        const imageSrc = zoomedImage.src;
        if (!imageSrc || imageSrc.startsWith('#')) {
            showNotification("No image to analyze.");
            return;
        }

        analyzeGemBtn.disabled = true;
        analyzeGemBtn.textContent = 'Analyzing...';
        zoomAnalysisResult.textContent = 'The AI is inspecting the image...';

        try {
            const parts = imageSrc.split(',');
            const mimeType = parts[0].match(/:(.*?);/)?.[1];
            const base64Data = parts[1];

            if (!mimeType || !base64Data) {
                throw new Error("Could not parse image data.");
            }

            const imagePart = {
                inlineData: { mimeType, data: base64Data },
            };
            
            const prompt = `You are an expert gemologist. Analyze the rough gemstone in this image. Provide a detailed analysis, including its likely type, shape (e.g., octahedron, dodecahedron, flat), color characteristics, and any visible clarity features (inclusions, surface graining). Format the response as a single, detailed paragraph.`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: { parts: [imagePart, { text: prompt }] },
            });

            zoomAnalysisResult.textContent = response.text.trim();

        } catch (error) {
            console.error("Error analyzing zoomed image:", error);
            zoomAnalysisResult.textContent = "Sorry, the AI analysis failed. Please try again.";
        } finally {
            analyzeGemBtn.disabled = false;
            analyzeGemBtn.textContent = 'Analyze Again';
        }
    }
    
    // --- Auth, Profile & Admin Functions ---

    function openAuthModal(view: 'login' | 'register' = 'login') {
        loginView.style.display = 'none';
        registerView.style.display = 'none';
        verifyEmailView.style.display = 'none';
        setPasswordView.style.display = 'none';

        if (view === 'login') {
            loginView.style.display = 'block';
        } else {
            registerView.style.display = 'block';
        }
        authModal.style.display = 'flex';
    }

    function closeAuthModal() {
        authModal.style.display = 'none';
        loginForm.reset();
        registerForm.reset();
        setPasswordForm.reset();
        registrationEmail = null;
    }

    function openProfileModal() {
        if (!currentUser) return;
        
        const avatarSrc = currentUser.profilePicture || `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><use href='%23default-avatar'></use></svg>`;
        profilePictureDisplay.src = avatarSrc;
        profileEditPreview.src = avatarSrc;

        profileEmail.textContent = currentUser.email;
        profilePlan.textContent = currentUser.plan;
        profileAttempts.textContent = currentUser.plan === 'free' ? currentUser.attemptsLeft.toString() : 'Unlimited';
        profileEditEmailInput.value = currentUser.email;
        
        profileView.style.display = 'block';
        profileEditView.style.display = 'none';

        profileModal.style.display = 'flex';
    }

    function closeProfileModal() {
        profileModal.style.display = 'none';
    }


    function updateAuthStateUI() {
        const isAdmin = currentUser && currentUser.email === ADMIN_EMAIL;
        const defaultAvatar = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><use href='%23default-avatar'></use></svg>`;

        if (currentUser) {
            navActionBtn.textContent = 'My Profile';
            navUserProfile.style.display = 'block';
            navProfilePicture.src = currentUser.profilePicture || defaultAvatar;

            generatorGate.classList.add('hidden');
            if (currentUser.plan === 'free') {
                 attemptsCounter.textContent = `You have ${currentUser.attemptsLeft} free valuations remaining.`;
                 attemptsCounter.style.display = 'block';
            } else {
                 attemptsCounter.style.display = 'none';
            }
            adminPanel.style.display = isAdmin ? 'block' : 'none';
        } else {
            navActionBtn.textContent = 'Login / Register';
            navUserProfile.style.display = 'none';
            generatorGate.classList.remove('hidden');
            attemptsCounter.style.display = 'none';
            adminPanel.style.display = 'none';
        }
        updateValuationButtonState();
    }
    
    function saveCurrentUserState() {
        if (currentUser && currentUser.plan !== 'admin' && currentUser.email !== 'tester@gemvision.ai') {
            localStorage.setItem('gemvision_currentUser', JSON.stringify(currentUser));
            const users = JSON.parse(localStorage.getItem('gemvision_users') || '{}');
            const userData = users[currentUser.email];
            if (userData) {
                users[currentUser.email] = {
                    ...userData, 
                    attemptsLeft: currentUser.attemptsLeft, 
                    plan: currentUser.plan,
                    profilePicture: currentUser.profilePicture,
                };
                localStorage.setItem('gemvision_users', JSON.stringify(users));
            }
        } else if (currentUser) {
            // For special users, save to session storage instead to persist the session
            // but not permanently alter local storage DB.
            sessionStorage.setItem('gemvision_currentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('gemvision_currentUser');
            sessionStorage.removeItem('gemvision_currentUser');
        }
    }
    
    async function resizeImage(base64Str: string, maxWidth = 256, maxHeight = 256): Promise<string> {
         return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = base64Str;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;
    
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round(height * (maxWidth / width));
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round(width * (maxHeight / height));
                        height = maxHeight;
                    }
                }
    
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return reject(new Error('Could not get canvas context'));
                }
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.9)); 
            };
            img.onerror = () => {
                reject(new Error('Image could not be loaded for resizing.'));
            };
        });
    }

    async function handleProfilePictureUpload(file: File) {
        if (!currentUser) return;
    
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const originalBase64 = reader.result as string;
                const resizedBase64 = await resizeImage(originalBase64);
    
                profileEditPreview.src = resizedBase64;
                profilePictureDisplay.src = resizedBase64;
                navProfilePicture.src = resizedBase64;
    
                currentUser.profilePicture = resizedBase64;
                saveCurrentUserState();
                showNotification("Profile picture updated!", "success");
            } catch (error) {
                console.error("Error resizing image:", error);
                showNotification("Could not process the image. Please try another one.", "error");
            }
        };
        reader.readAsDataURL(file);
    }
    
    function handleLogout() {
        currentUser = null;
        saveCurrentUserState();
        updateAuthStateUI();
        closeProfileModal();
        myCreationsGrid.innerHTML = '';
        myCreationsSection.style.display = 'none';
        myPostsGrid.innerHTML = '';
        myPostsSection.style.display = 'none';
        myTasksGrid.innerHTML = '';
        myTasksSection.style.display = 'none';
        showNotification("You have been logged out.", "success");
    }
    
    /**
     * Renders the public showcase gallery from localStorage.
     */
    function renderShowcaseGallery() {
        const galleryItems: ShowcaseItem[] = JSON.parse(localStorage.getItem('gemvision_gallery') || '[]');
        const showcaseGrid = document.getElementById('showcase-grid') as HTMLDivElement;
        showcaseGrid.innerHTML = '';
        if (galleryItems.length === 0) {
            showcaseGrid.innerHTML = `<p class="empty-gallery-message">The Showcase Gallery is currently empty. The administrator can add new items.</p>`;
            return;
        }

        galleryItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'showcase-card';
            card.innerHTML = `
                <div class="showcase-card-images">
                    <img src="${item.gemstoneImage}" alt="Loose Gemstone" loading="lazy" data-analysis-type="gemstone">
                    <img src="${item.designImage}" alt="${item.name}" loading="lazy" data-analysis-type="jewelry">
                </div>
                <div class="showcase-card-content">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                </div>
            `;
            showcaseGrid.appendChild(card);
        });
    }
    
    // --- Payment Functions ---
    
    function updateDisplayedPrices() {
        const currencySymbol = currentCurrency === 'usd' ? '$' : '₹';
        priceElements.forEach(el => {
            const price = currentCurrency === 'usd' ? el.getAttribute('data-price-usd') : el.getAttribute('data-price-inr');
            if (price) {
                el.innerHTML = `${currencySymbol}${price}<span>/month</span>`;
            }
        });
    }
    
    function openPaymentMethodModal(button: HTMLButtonElement) {
        const plan = button.getAttribute('data-plan') as UserPlan;
        const planName = button.getAttribute('data-plan-name');
        const priceIdUsd = button.getAttribute('data-price-id-usd');
        const priceIdInr = button.getAttribute('data-price-id-inr');

        if (!plan || !planName || !priceIdUsd || !priceIdInr) {
            showNotification("Cannot initiate payment: plan information is missing.", "error");
            return;
        }

        selectedPlanForPayment = { plan, planName, priceIdUsd, priceIdInr };
        paymentMethodTitle.textContent = `Upgrade to ${planName}`;
        paymentMethodModal.style.display = 'flex';
    }
    
    /**
     * Redirects to Stripe checkout using a pre-defined Price ID.
     */
    async function redirectToCheckout() {
        if (!stripe || !currentUser || !selectedPlanForPayment) {
            showNotification('Payment system is not available. Please try again later.');
            return;
        }
        const priceId = currentCurrency === 'usd' ? selectedPlanForPayment.priceIdUsd : selectedPlanForPayment.priceIdInr;
        toggleLoading(true, "Redirecting to payment...");
        try {
            await stripe.redirectToCheckout({
                lineItems: [{ price: priceId, quantity: 1 }],
                mode: 'subscription',
                successUrl: `${window.location.origin}${window.location.pathname}?checkout_status=success&plan=${selectedPlanForPayment.plan}`,
                cancelUrl: `${window.location.origin}${window.location.pathname}?checkout_status=cancel`,
                customerEmail: currentUser.email,
            });
        } catch (error) {
            console.error("Stripe checkout error:", error);
            showNotification("Could not redirect to payment page. Please try again.", "error");
            toggleLoading(false);
        }
    }

    function handleStripeRedirect() {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('checkout_status');
        const plan = urlParams.get('plan') as UserPlan;

        if (status) {
            window.history.replaceState({}, document.title, window.location.pathname);
            if (status === 'success' && currentUser && (plan === 'pro' || plan === 'elite')) {
                upgradeUserPlan(plan);
            } else if (status === 'cancel') {
                showNotification('Your payment was cancelled. You have not been charged.', 'error');
            }
        }
    }
    
    function upgradeUserPlan(plan: UserPlan) {
        if (!currentUser || (plan !== 'pro' && plan !== 'elite')) return;
        
        currentUser.plan = plan;
        currentUser.attemptsLeft = plan === 'pro' ? 50 : 9999;
        saveCurrentUserState();
        updateAuthStateUI();
        showNotification(`Successfully upgraded to the ${plan} plan!`, 'success');
    }

    // --- AI Helper Chat Functions ---

    function appendChatMessage(text: string, sender: 'user' | 'ai' | 'error') {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}`;
        messageElement.textContent = text;
        chatMessagesContainer.appendChild(messageElement);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'chat-message loading';
        indicator.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
        chatMessagesContainer.appendChild(indicator);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    function hideTypingIndicator() {
        chatMessagesContainer.querySelector('.loading')?.remove();
    }

    async function handleSendMessage(event: Event) {
        event.preventDefault();
        const userMessage = chatInput.value.trim();
        if (!userMessage || !aiHelperChat) return;

        appendChatMessage(userMessage, 'user');
        chatInput.value = '';
        showTypingIndicator();

        try {
            const response = await aiHelperChat.sendMessage({ message: userMessage });
            hideTypingIndicator();
            appendChatMessage(response.text, 'ai');
        } catch (error) {
            console.error("AI Helper Error:", error);
            hideTypingIndicator();
            appendChatMessage("Sorry, I encountered an error. Please try again.", 'error');
        }
    }
    
    function initializeAiHelper() {
        aiHelperChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are a friendly, knowledgeable AI assistant for a web application called GemVision AI, which specializes in valuing rough diamonds and gemstones.
                Your goal is to help users understand how to use the app. Your knowledge is strictly limited to the features described below.

                **Core Application Workflow:**
                1.  **Upload:** The user uploads a photo or video of their rough stone or a parcel of stones. They can also use their device's camera.
                2.  **AI Stone Counting:** If the image contains multiple stones (a parcel), the AI automatically counts them and displays the number.
                3.  **Enter Details:** The user must fill in all the required fields: Total Carat Weight, Size, Model/Shape, Quality/Clarity, and Colour.
                4.  **Price Book (Optional):** Users can upload their own price book in CSV or Excel format for more accurate, personalized valuations.
                5.  **Get Valuation:** The user clicks "Get Valuation". The AI then analyzes the image and all the provided data (including the price book if uploaded) to generate a detailed valuation report.
                6.  **View Report:** The report appears on the screen, showing an estimated Price per Carat, Total Estimated Value, and a brief market commentary.

                **Key Features & How to Use Them:**
                *   **File Uploads:** Supports common image (JPG, PNG) and video (MP4) formats.
                *   **Valuation Inputs:** Users must provide details about their stones for an accurate valuation. This includes weight, size, shape, quality, and color.
                *   **User Accounts & Plans:**
                    *   **Free Plan:** New users get 3 free valuations.
                    *   **Pro & Elite Plans:** Paid plans offer more valuations per month and access to more advanced analysis models.
                    *   **Upgrading:** Users can upgrade their plan in the "Pricing" section.
                *   **Disclaimer:** Always remind users that the valuation is an AI-powered estimate for informational purposes and is not a formal appraisal.

                **Your Persona:**
                *   Be enthusiastic and helpful. Use clear, step-by-step instructions.
                *   If asked an unrelated question, politely state: "I can only assist with questions about the GemVision AI valuation tool. How can I help you with your rough stones today?"`
            },
        });
    }


    // --- Event Listeners ---
    fileUpload.addEventListener('change', () => {
        if (fileUpload.files && fileUpload.files[0]) {
            handleFile(fileUpload.files[0]);
        }
    });
    removeImageBtn.addEventListener('click', resetFileInput);
    
    // Price Book Listeners
    priceBookUpload.addEventListener('change', () => {
        if (priceBookUpload.files && priceBookUpload.files[0]) {
            parsePriceBook(priceBookUpload.files[0]);
        }
    });
    removePriceBookBtn.addEventListener('click', removePriceBook);
    
    // Add listeners to all valuation inputs
    [stoneDescriptionInput, totalCaratWeightInput, stoneSizeInput, stoneModelInput, stoneQualityInput, stoneColourInput].forEach(input => {
        input.addEventListener('input', updateValuationButtonState);
    });

    valuateBtn.addEventListener('click', getValuation);
    
    imagePreviewContainer.addEventListener('click', () => {
        if (uploadedFile && imagePreview.src && imagePreview.src !== '#') {
            openImageZoom(imagePreview.src);
        }
    });

    captureFrameBtn.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoPreview.videoWidth;
        canvas.height = videoPreview.videoHeight;
        const context = canvas.getContext('2d');
        if (!context) return;
        
        context.drawImage(videoPreview, 0, 0, canvas.width, canvas.height);
        
        const mimeType = 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, 0.9);
        const base64String = dataUrl.split(',')[1];
        
        uploadedFile = {
            base64: base64String,
            mimeType: mimeType
        };

        imagePreview.src = dataUrl;
        imagePreviewContainer.style.display = 'block';
        videoPreviewContainer.style.display = 'none';
        
        // Run analysis functions in parallel after frame capture
        Promise.all([
            countStones(),
            suggestStoneProperties()
        ]);
        
        updateValuationButtonState();
        showNotification("Frame captured! You can now get a valuation.", "success");
    });


    // Camera Modal Listeners
    cameraButton.addEventListener('click', startCamera);
    closeModalBtn.addEventListener('click', stopCamera);
    captureBtn.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = cameraStream.videoWidth;
        canvas.height = cameraStream.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(cameraStream, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
                    handleImageFile(file);
                }
            }, 'image/jpeg');
        }
        stopCamera();
    });

    // Zoom Modal Listeners
    zoomCloseBtn.addEventListener('click', closeImageZoom);
    imageZoomModal.addEventListener('click', (e) => {
        if (e.target === imageZoomModal) closeImageZoom();
    });
    analyzeGemBtn.addEventListener('click', analyzeZoomedImage);
    
    // Auth, Profile & Admin Listeners
    navActionBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentUser) {
            openProfileModal();
        } else {
            openAuthModal('login');
        }
    });
    navUserProfile.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentUser) openProfileModal();
    });
    
    gateSignupBtn.addEventListener('click', () => openAuthModal('register'));
    document.querySelectorAll('.pricing-button[data-plan="free"]').forEach(btn => {
        btn.addEventListener('click', () => openAuthModal('register'));
    });

    authCloseBtn.addEventListener('click', closeAuthModal);
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) closeAuthModal();
    });
    showRegisterViewLink.addEventListener('click', (e) => {
        e.preventDefault();
        openAuthModal('register');
    });
    showLoginViewLink.addEventListener('click', (e) => {
        e.preventDefault();
        openAuthModal('login');
    });
    
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = registerEmailInput.value.trim();
        if (!email) return;

        const users = JSON.parse(localStorage.getItem('gemvision_users') || '{}');
        if (users[email] || email === ADMIN_EMAIL) {
            showNotification("An account with this email already exists.", "error");
            return;
        }

        registrationEmail = email;
        registerView.style.display = 'none';
        verifyEmailView.style.display = 'block';
    });

    verifyEmailBtn.addEventListener('click', () => {
        verifyEmailView.style.display = 'none';
        setPasswordView.style.display = 'block';
    });
    
    setPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!registrationEmail) {
            showNotification('An error occurred. Please start over.', 'error');
            openAuthModal('register');
            return;
        }
        const password = registerPasswordInput.value;
        const confirmPassword = registerConfirmPasswordInput.value;
        if (password !== confirmPassword) {
            showNotification("Passwords do not match.", "error");
            return;
        }

        const users = JSON.parse(localStorage.getItem('gemvision_users') || '{}');
        const hashedPassword = await hashPassword(password);
        users[registrationEmail] = { password: hashedPassword, attemptsLeft: 3, plan: 'free' };
        localStorage.setItem('gemvision_users', JSON.stringify(users));
        currentUser = { email: registrationEmail, attemptsLeft: 3, plan: 'free' };
        saveCurrentUserState();
        updateAuthStateUI();
        closeAuthModal();
        showNotification("Account created successfully! You can now start valuing.", "success");
    });
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        // Admin User
        if (email === ADMIN_EMAIL && password === 'admin123') {
            currentUser = { email: ADMIN_EMAIL, attemptsLeft: 9999, plan: 'admin' };
        } 
        // Tester User
        else if (email === 'tester@gemvision.ai' && password === 'tester123') {
            currentUser = { email: 'tester@gemvision.ai', attemptsLeft: 50, plan: 'pro' };
        }
        // Regular Users from Local Storage
        else {
            const users = JSON.parse(localStorage.getItem('gemvision_users') || '{}');
            const userData = users[email];
            const enteredPasswordHash = await hashPassword(password);
            if (userData && userData.password === enteredPasswordHash) {
                 currentUser = { 
                    email: email, 
                    attemptsLeft: userData.attemptsLeft, 
                    plan: userData.plan || 'free',
                    profilePicture: userData.profilePicture
                };
            }
        }
        
        if (currentUser) {
             saveCurrentUserState();
             updateAuthStateUI();
             closeAuthModal();
             showNotification(`Welcome back, ${currentUser.email}!`, 'success');
        } else {
             showNotification("Invalid email or password.", "error");
        }
    });

    // Profile Modal Listeners
    profileCloseBtn.addEventListener('click', closeProfileModal);
    profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) closeProfileModal();
    });
    profileLogoutBtn.addEventListener('click', handleLogout);

    editProfileBtn.addEventListener('click', () => {
        profileView.style.display = 'none';
        profileEditView.style.display = 'block';
    });
    
    profilePictureUpload.addEventListener('change', () => {
        if (profilePictureUpload.files && profilePictureUpload.files[0]) {
            handleProfilePictureUpload(profilePictureUpload.files[0]);
        }
    });
    
    profileEditForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification("Profile updated successfully!", "success");
        profileView.style.display = 'block';
        profileEditView.style.display = 'none';
    });
    
    // Admin Panel Listener (functionality can be repurposed later)
    adminUploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Admin functionality to be defined.', 'success');
    });
    
    // Payment Listeners
    currencySwitcher.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        if (target.tagName === 'BUTTON' && target.dataset.currency) {
            currentCurrency = target.dataset.currency as 'usd' | 'inr';
            currencySwitcher.querySelector('.active')?.classList.remove('active');
            target.classList.add('active');
            updateDisplayedPrices();
        }
    });

    paidPlanButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if (!currentUser) {
                showNotification("Please log in or create an account to upgrade.", "error");
                openAuthModal('login');
                return;
            }
            openPaymentMethodModal(button as HTMLButtonElement);
        });
    });

    paymentMethodCloseBtn.addEventListener('click', () => paymentMethodModal.style.display = 'none');
    payWithCardBtn.addEventListener('click', redirectToCheckout);
    payWithCryptoBtn.addEventListener('click', () => showNotification("Crypto payments are coming soon!", "success"));

    // AI Helper Chat Listeners
    aiHelperFab.addEventListener('click', () => {
        const isOpening = !aiHelperWidget.classList.contains('open');
        aiHelperWidget.classList.toggle('open');
        if (isOpening && chatMessagesContainer.children.length === 0) {
            appendChatMessage("Hello! How can I help you with the GemVision AI valuation tool today?", 'ai');
        }
    });
    chatCloseBtn.addEventListener('click', () => aiHelperWidget.classList.remove('open'));
    chatForm.addEventListener('submit', handleSendMessage);
    
    // --- Initial State ---
    function initializeApp() {
        if (!isLocalStorageAvailable()) {
            showNotification(
                "Account features are disabled. Your browser is blocking local storage.", 'error', 0
            );
            navActionBtn.style.display = 'none';
            generatorGate.innerHTML = '<h3>Account features are disabled by your browser settings.</h3>';
            gateSignupBtn.disabled = true;
            document.querySelectorAll('.pricing-button').forEach(btn => {
                (btn as HTMLButtonElement).disabled = true;
            });
            return;
        }
        
        stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx003d2a70s0');
    
        const storedUser = sessionStorage.getItem('gemvision_currentUser') || localStorage.getItem('gemvision_currentUser');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
        } else {
            currentUser = null;
        }

        const storedPriceBook = localStorage.getItem('gemvision_priceBook');
        if (storedPriceBook) {
            priceBookData = storedPriceBook;
            priceBookFileName.textContent = "Using saved price book";
            removePriceBookBtn.style.display = 'block';
        }

        handleStripeRedirect();
        updateAuthStateUI();
        updateDisplayedPrices();
        renderShowcaseGallery();
        initializeAiHelper();
    }
    
    initializeApp();
});