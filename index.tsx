/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenAI, Type, Chat } from "@google/genai";
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- Stripe Type Declaration ---
declare var Stripe: any;

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selectors ---
    const fileUpload = document.getElementById('file-upload') as HTMLInputElement;
    const cameraButton = document.getElementById('camera-button') as HTMLButtonElement;
    const gemTypeInput = document.getElementById('gem-type') as HTMLInputElement;
    const gemWeightInput = document.getElementById('gem-weight') as HTMLInputElement;
    const gemLengthInput = document.getElementById('gem-length') as HTMLInputElement;
    const gemBreadthInput = document.getElementById('gem-breadth') as HTMLInputElement;
    const gemDepthInput = document.getElementById('gem-depth') as HTMLInputElement;
    const designPromptInput = document.getElementById('design-prompt') as HTMLTextAreaElement;
    const generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
    const dreamBtn = document.getElementById('dream-btn') as HTMLButtonElement;
    const analyzeGemstoneBtn = document.getElementById('analyze-gemstone-btn') as HTMLButtonElement;
    const galleryContent = document.getElementById('gallery-content') as HTMLDivElement;
    const showcaseGrid = document.getElementById('showcase-grid') as HTMLDivElement;
    const loadingOverlay = document.getElementById('loading-overlay') as HTMLDivElement;
    const loadingText = document.getElementById('loading-text') as HTMLParagraphElement;
    const fileNameSpan = document.getElementById('file-name') as HTMLSpanElement;
    const imagePreviewContainer = document.getElementById('image-preview-container') as HTMLDivElement;
    const imagePreview = document.getElementById('image-preview') as HTMLImageElement;
    const removeImageBtn = document.getElementById('remove-image-btn') as HTMLButtonElement;
    const yourCreationsSection = document.getElementById('your-creations-section') as HTMLElement;
    const notificationContainer = document.getElementById('notification-container') as HTMLDivElement;
    const generatorGate = document.getElementById('generator-gate') as HTMLDivElement;
    const gateSignupBtn = document.getElementById('gate-signup-btn') as HTMLButtonElement;
    const attemptsCounter = document.getElementById('attempts-counter') as HTMLParagraphElement;
    const navActionBtn = document.getElementById('nav-action-btn') as HTMLAnchorElement;
    const navUserProfile = document.getElementById('nav-user-profile') as HTMLDivElement;
    const navProfilePicture = document.getElementById('nav-profile-picture') as HTMLImageElement;
    const analysisResultsContainer = document.getElementById('analysis-results-container') as HTMLDivElement;
    const analysisContent = document.getElementById('analysis-content') as HTMLDivElement;
    const analysisSources = document.getElementById('analysis-sources') as HTMLDivElement;

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

    // Task Modal Elements
    const taskModal = document.getElementById('task-modal') as HTMLDivElement;
    const taskModalTitle = document.getElementById('task-modal-title') as HTMLHeadingElement;
    const taskCloseBtn = document.getElementById('task-close-btn') as HTMLButtonElement;
    const taskForm = document.getElementById('task-form') as HTMLFormElement;
    const taskTitleInput = document.getElementById('task-title') as HTMLInputElement;
    const taskDescriptionInput = document.getElementById('task-description') as HTMLTextAreaElement;
    const taskDueDateInput = document.getElementById('task-due-date') as HTMLInputElement;
    const taskStatusSelect = document.getElementById('task-status') as HTMLSelectElement;

    // Link Design Modal Elements
    const linkDesignModal = document.getElementById('link-design-modal') as HTMLDivElement;
    const linkDesignCloseBtn = document.getElementById('link-design-close-btn') as HTMLButtonElement;
    const linkDesignPreviewImage = document.getElementById('link-design-preview-image') as HTMLImageElement;
    const linkTaskSelect = document.getElementById('link-task-select') as HTMLSelectElement;
    const confirmLinkBtn = document.getElementById('confirm-link-btn') as HTMLButtonElement;
    const createTaskForDesignBtn = document.getElementById('create-task-for-design-btn') as HTMLButtonElement;
    const saveWithoutLinkBtn = document.getElementById('save-without-link-btn') as HTMLButtonElement;


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

    // Crypto Payment Modal Elements
    const cryptoPaymentModal = document.getElementById('crypto-payment-modal') as HTMLDivElement;
    const cryptoPaymentCloseBtn = document.getElementById('crypto-payment-close-btn') as HTMLButtonElement;
    const cryptoPaymentTitle = document.getElementById('crypto-payment-title') as HTMLHeadingElement;
    const cryptoTabs = document.querySelector('.crypto-tabs') as HTMLDivElement;
    const cryptoAmountValue = document.getElementById('crypto-amount-value') as HTMLSpanElement;
    const cryptoWalletAddress = document.getElementById('crypto-wallet-address') as HTMLInputElement;
    const copyAddressBtn = document.getElementById('copy-address-btn') as HTMLButtonElement;
    const confirmCryptoPaymentBtn = document.getElementById('confirm-crypto-payment-btn') as HTMLButtonElement;

    // Share Modal Elements
    const shareModal = document.getElementById('share-modal') as HTMLDivElement;
    const shareCloseBtn = document.getElementById('share-close-btn') as HTMLButtonElement;
    const sharePreviewImage = document.getElementById('share-preview-image') as HTMLImageElement;
    const shareTabsContainer = shareModal.querySelector('.share-tabs') as HTMLDivElement;
    const shareCaptionInput = document.getElementById('share-caption') as HTMLTextAreaElement;
    const regenerateCaptionBtn = document.getElementById('regenerate-caption-btn') as HTMLButtonElement;
    const shareReelControls = document.getElementById('share-reel-controls') as HTMLDivElement;
    const createReelBtn = document.getElementById('create-reel-btn') as HTMLButtonElement;
    const postToSocialBtn = document.getElementById('post-to-social-btn') as HTMLButtonElement;
    const shareVideoContainer = document.getElementById('share-video-container') as HTMLDivElement;
    const shareVideoLoader = document.getElementById('share-video-loader') as HTMLDivElement;
    const shareVideoLoadingText = document.getElementById('share-video-loading-text') as HTMLParagraphElement;
    const shareVideoPreview = document.getElementById('share-video-preview') as HTMLVideoElement;
    const shareVideoDownloadBtn = document.getElementById('share-video-download-btn') as HTMLAnchorElement;

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
    let stream: MediaStream | null = null;
    const loadingMessages = [
        "Weaving your designs...",
        "Consulting the muses...",
        "Polishing the pixels...",
        "Crafting digital jewelry...",
        "Almost there..."
    ];
    let loadingInterval: number;
    
    // Auth State
    type UserPlan = 'free' | 'pro' | 'elite' | 'admin';
    type SocialPlatform = 'x' | 'facebook' | 'instagram' | 'linkedin';

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

    // Share State
    let currentShareDesign: Design | null = null;
    let currentShareImageUrl: string | null = null;
    let currentSharePlatform: SocialPlatform = 'x';
    let generatedReelUrl: string | null = null;
    
    // AI Helper State
    let aiHelperChat: Chat | null = null;

    // Task Management State
    let editingTaskId: string | null = null;
    let designToSave: { design: Design, imageUrl: string } | null = null;


    // --- Gemini API Initialization ---
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // --- Type Definitions ---
    interface Design {
        name: string;
        description: string;
        metals: string[];
        blueprint: string;
        imagePrompt: string;
    }
    
    interface ShowcaseItem {
        id: string;
        gemstoneImage: string;
        designImage: string;
        name: string;
        description: string;
        metals?: string[];
        blueprint?: string;
        imagePrompt?: string;
    }

    interface SocialPost {
        id: string;
        platform: string;
        caption: string;
        designImage: string;
        videoUrl?: string;
        timestamp: number;
        designName: string;
    }
    
    type TaskStatus = 'in-progress' | 'completed' | 'on-hold';

    interface Task {
        id: string;
        title: string;
        description: string;
        dueDate: string; // ISO date string: YYYY-MM-DD
        status: TaskStatus;
        linkedDesignIds: string[];
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
     * Updates the state of the generate button based on input.
     */
    function updateGenerateButtonState() {
        if (currentUser) {
            // Free users have attempt limits, others don't
            const outOfAttempts = currentUser.plan === 'free' && currentUser.attemptsLeft <= 0;
            const missingInputs = !uploadedFile || !designPromptInput.value.trim();

            generateBtn.disabled = outOfAttempts || missingInputs;

            // Update tooltip based on the reason it's disabled or enabled
            if (outOfAttempts) {
                generateBtn.dataset.tooltip = "You've used all your free attempts. Please upgrade your plan to continue generating.";
            } else if (missingInputs) {
                generateBtn.dataset.tooltip = "Please upload a gemstone and describe your design idea.";
            } else {
                generateBtn.dataset.tooltip = "Generate unique jewelry designs based on your gemstone and prompt.";
            }
        } else {
            // Always disabled if not logged in
            generateBtn.disabled = true;
            generateBtn.dataset.tooltip = "Please log in or register to start designing.";
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
    function handleImageFile(file: File) {
        resetFileInput();
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            uploadedFile = {
                base64: base64String,
                mimeType: file.type
            };

            imagePreview.src = `data:${file.type};base64,${base64String}`;
            imagePreviewContainer.style.display = 'block';
            fileNameSpan.textContent = file.name;
            dreamBtn.disabled = false;
            analyzeGemstoneBtn.disabled = false;
            updateGenerateButtonState();
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
        analysisResultsContainer.style.display = 'none';
        analysisContent.innerHTML = '';
        analysisSources.innerHTML = '';


        fileNameSpan.textContent = 'Upload Photo or Video';
        dreamBtn.disabled = true;
        analyzeGemstoneBtn.disabled = true;
        updateGenerateButtonState();
    }

    /**
     * Toggles the loading overlay and updates its text.
     * @param isLoading Whether to show or hide the overlay.
     */
    function toggleLoading(isLoading: boolean) {
        if (isLoading) {
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
     * Initializes a 3D viewer in a given container.
     * @param container The container element for the 3D canvas.
     * @param imageUrl The URL of the texture image.
     * @param design The design data, used to infer geometry.
     */
    function init3DViewer(container: HTMLDivElement, imageUrl: string, design: Design) {
        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);

        // Camera
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 3;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 1;
        controls.maxDistance = 10;
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Texture
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(imageUrl);
        texture.colorSpace = THREE.SRGBColorSpace;
        
        // Material
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            metalness: 0.3,
            roughness: 0.2
        });

        // Geometry (inferred from design name)
        let geometry: THREE.BufferGeometry;
        const nameLower = design.name.toLowerCase();
        if (nameLower.includes('ring')) {
            geometry = new THREE.TorusGeometry(1, 0.15, 24, 100);
            material.side = THREE.DoubleSide; // Show texture inside the ring
        } else { // Default for pendants, earrings etc.
            geometry = new THREE.PlaneGeometry(2, 2);
        }

        const mesh = new THREE.Mesh(geometry, material);
        if (nameLower.includes('ring')) {
            mesh.rotation.x = Math.PI / 2; // Rotate ring to be upright
        }
        scene.add(mesh);
        
        let animationFrameId: number;

        // Animation Loop
        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            controls.update(); // only required if controls.enableDamping = true
            renderer.render(scene, camera);
        }
        animate();
        
        // Store a cleanup function on the container
        (container as any).cleanup = () => {
            cancelAnimationFrame(animationFrameId);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            texture.dispose();
            container.innerHTML = '';
        };
    }

    /**
     * Creates an HTML card for a generated design and appends it to the gallery.
     * @param design The design data.
     * @param imageUrl The URL of the generated image for the design.
     */
    function createDesignCard(design: Design, imageUrl: string) {
        const card = document.createElement('article');
        card.className = 'design-card newly-generated';
        // Store data on the element for later use (e.g., 3D viewer)
        card.dataset.design = JSON.stringify(design);
        card.dataset.imageUrl = imageUrl;
        
        card.innerHTML = `
            <div class="media-container">
                <img src="${imageUrl}" alt="${design.name}" loading="lazy" data-analysis-type="jewelry">
                <div class="viewer-container"></div>
                <button class="view-toggle-btn" data-view="2d">View in 3D</button>
            </div>
            <div class="card-content">
                <h3>${design.name}</h3>
                <p>${design.description}</p>
                <h4>Blueprint:</h4>
                <ul>
                    <li><strong>Metal:</strong> ${design.metals.join(', ')}</li>
                    <li><strong>Details:</strong> ${design.blueprint}</li>
                </ul>
                 <div class="card-actions">
                    <button class="save-design-btn">Save</button>
                    <button class="share-design-btn">Share</button>
                </div>
            </div>
        `;
        galleryContent.prepend(card);
        // Remove the highlight class after the animation finishes to reset its state
        setTimeout(() => card.classList.remove('newly-generated'), 2000);
    }

    /**
     * Starts the camera stream.
     */
    async function startCamera() {
        try {
            // Request the rear-facing camera
            const constraints = {
                video: {
                    facingMode: 'environment' 
                },
                audio: false
            };
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            cameraStream.srcObject = stream;
            cameraModal.style.display = 'flex';
        } catch (err) {
            console.error("Error accessing camera: ", err);
            showNotification("Could not access camera. Please grant permission and ensure you have a rear camera.", "error");
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
     * Asks the AI to perform a comprehensive analysis of the gemstone.
     */
    async function analyzeGemstone() {
        if (!uploadedFile) {
            showNotification("Please upload a gemstone image first.");
            return;
        }

        const originalButtonText = analyzeGemstoneBtn.innerHTML;
        analyzeGemstoneBtn.disabled = true;
        analyzeGemstoneBtn.innerHTML = 'Analyzing...';
        analysisResultsContainer.style.display = 'none';

        try {
            const imagePart = {
                inlineData: {
                    mimeType: uploadedFile.mimeType,
                    data: uploadedFile.base64,
                },
            };
            
            const gemType = gemTypeInput.value;
            const gemWeight = gemWeightInput.value;
            const length = gemLengthInput.value;
            const breadth = gemBreadthInput.value;
            const depth = gemDepthInput.value;

            const dimensionsProvided = length && breadth && depth;
            const typeProvided = gemType.trim() !== '';
            const weightProvided = gemWeight.trim() !== '';

            const prompt = `
                You are a professional gemologist AI. Your task is to provide a detailed analysis of a gemstone based on an image and user-provided information. Prioritize user-provided information as factual.

                **User Input (Consider these as facts):**
                - Gemstone Type & Features: ${typeProvided ? gemType : 'Not provided. Please identify from image.'}
                - Estimated Carat Weight: ${weightProvided ? gemWeight : 'Not provided. Please estimate from image and dimensions.'}
                - Dimensions (L x B x D in mm): ${dimensionsProvided ? `${length} x ${breadth} x ${depth}`: 'Not provided. Analysis will be based on the image only.'}

                **Your Task:**

                1.  **Identification Line:** Provide a single line at the very top summarizing the gemstone.
                    - If user provided "Gemstone Type" and "Carat Weight", use their input directly. Format: \`Identification: [User's Gemstone Type], [User's Carat Weight]\`.
                    - If the user provided only one, use it and estimate the other.
                    - If the user provided neither, identify the gem and estimate the weight from the image. Format: \`Identification: [Identified Gemstone Type and Cut], approximately [Estimated Carat Weight]\`.
                    - **This line is for display and should be consistent with the user's input if provided.**

                2.  **Cut Quality Analysis:** Based *only* on the image, analyze the cut quality. Disregard user input for this section. Comment on:
                    - **Symmetry and Proportions:** How well-balanced does the cut appear visually?
                    - **Windows and Extinction:** Are there visible "windows" (transparent, washed-out areas) or significant "extinction" (dark areas from light leakage)?

                3.  **Proportion Assessment:**
                    - ${dimensionsProvided ?
                    `Based on the provided dimensions (${length} x ${breadth} x ${depth} mm), analyze the proportions. Calculate the depth-to-width (depth/breadth) percentage. Provide an opinion on whether it's well-proportioned for the identified/provided gemstone type. A good range for many cuts is 60-80% of the width. State if the stone seems too shallow (risk of windowing) or too deep (loses sparkle).`
                    : 'Dimensions were not provided. To get a proportion assessment, please provide the length, breadth, and depth.'
                    }

                4.  **Price Estimation:**
                    - Use your web search capabilities to find the current market price for a gemstone matching the **final identification** (user-provided or AI-identified).
                    - Provide an estimated price range (e.g., $500 - $700 per carat).
                    - Emphasize that this is an estimate and prices vary based on many factors not visible in a photo (clarity, origin, treatment, etc.).

                **Output Format:**
                Provide the response as clear, readable text. Use markdown-style bold headings for each section: **Cut Quality Analysis**, **Proportion Assessment**, and **Price Estimation**. The \`Identification:\` line must be the very first thing in your response.`;


            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: { parts: [imagePart, { text: prompt }] },
                config: {
                    tools: [{ googleSearch: {} }],
                },
            });

            const fullText = response.text;
            const lines = fullText.split('\n');
            const identificationLine = lines.find(line => line.startsWith('Identification:'));
            
            // This part is now smarter. If the user provided info, the AI was told to use it,
            // so the Identification line will contain it, and this code will just re-populate the fields,
            // which is good for consistency. If the AI generated it, it populates the fields for the first time.
            if (identificationLine) {
                const parts = identificationLine.replace('Identification:', '').trim().split(',');
                if (parts.length >= 2) {
                    gemTypeInput.value = parts.slice(0, parts.length - 1).join(',').trim();
                    gemWeightInput.value = parts[parts.length - 1].trim();
                } else {
                    gemTypeInput.value = parts[0].trim();
                }
            }
            
            // Format the rest of the text for display
            const analysisReport = lines.filter(line => !line.startsWith('Identification:')).join('\n')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');

            analysisContent.innerHTML = analysisReport;
            
            // Display sources
            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (groundingChunks && groundingChunks.length > 0) {
                 const sourcesHtml = groundingChunks.map(chunk => 
                    `<li><a href="${chunk.web.uri}" target="_blank" rel="noopener noreferrer">${chunk.web.title}</a></li>`
                ).join('');
                analysisSources.innerHTML = `<h5>Sources for Price Estimation:</h5><ul>${sourcesHtml}</ul>`;
            } else {
                analysisSources.innerHTML = '';
            }

            analysisResultsContainer.style.display = 'block';

        } catch (error) {
            console.error("Error analyzing gemstone:", error);
            showNotification("The AI couldn't analyze the gem. Please try again.", "error");
            analysisResultsContainer.style.display = 'none';
        } finally {
            analyzeGemstoneBtn.disabled = false;
            analyzeGemstoneBtn.innerHTML = originalButtonText;
        }
    }
    
    /**
     * Asks the AI to generate a creative design prompt based on the uploaded image.
     */
    async function dreamUpPrompt() {
        if (!uploadedFile) {
            showNotification("Please upload an image of your gemstone first.");
            return;
        }

        const originalButtonText = dreamBtn.innerHTML;
        dreamBtn.disabled = true;
        dreamBtn.innerHTML = 'Dreaming...';

        try {
            const imagePart = {
                inlineData: {
                    mimeType: uploadedFile.mimeType,
                    data: uploadedFile.base64,
                },
            };
            const prompt = `Based on the provided image of a gemstone, generate a single, creative, and inspiring design prompt for a piece of jewelry. The prompt should be something a user could write themselves. Be imaginative and descriptive. For example: 'A vintage-style engagement ring with floral accents in rose gold' or 'a futuristic pendant with sharp, geometric lines in platinum'.`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: { parts: [imagePart, {text: prompt}] }
            });

            const dreamedPrompt = response.text.trim();
            designPromptInput.value = dreamedPrompt;
            // Manually trigger input event to update the main generate button's state
            designPromptInput.dispatchEvent(new Event('input', { bubbles: true }));


        } catch (error) {
            console.error("Error dreaming up prompt:", error);
            showNotification("The AI couldn't dream up a prompt. Please try again.");
        } finally {
            dreamBtn.disabled = false;
            dreamBtn.innerHTML = originalButtonText;
        }
    }

    /**
     * Main function to handle the design generation process.
     */
    async function generateDesigns() {
        if (!currentUser) {
            showNotification("Please log in to generate designs.", "error");
            openAuthModal('login');
            return;
        }
        
        if (currentUser.plan === 'free' && currentUser.attemptsLeft <= 0) {
            showNotification("You have no attempts left. Please upgrade your plan.", "error");
            return;
        }

        if (generateBtn.disabled || !uploadedFile) return;

        toggleLoading(true);
        
        // Clear previous non-example results
        galleryContent.innerHTML = '';

        try {
            const imagePart = {
                inlineData: {
                    mimeType: uploadedFile.mimeType,
                    data: uploadedFile.base64,
                },
            };
            
            const prompt = `
                Based on the uploaded image of a gemstone and the user's preferences, generate 3 distinct jewelry design concepts.
                User preferences:
                - Gemstone: ${gemTypeInput.value || 'Not specified'}
                - Weight: ${gemWeightInput.value || 'Not specified'}
                - Desired design: ${designPromptInput.value}
                
                For each concept, provide a creative name, a captivating description, the metals used, a brief design blueprint, and a detailed, artistic prompt for an image generation model to create a photorealistic image of the final product.
            `;

            // Step 1: Generate structured design data from Gemini
            const designResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: { parts: [imagePart, { text: prompt }] },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            designs: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        description: { type: Type.STRING },
                                        metals: { type: Type.ARRAY, items: { type: Type.STRING } },
                                        blueprint: { type: Type.STRING },
                                        imagePrompt: { type: Type.STRING },
                                    }
                                }
                            }
                        }
                    }
                }
            });
            
            const result = JSON.parse(designResponse.text.trim());
            const designs: Design[] = result.designs;

            if (!designs || designs.length === 0) {
                throw new Error("The AI could not generate designs. Please try a different prompt.");
            }
            
            // Make the creations section visible
            yourCreationsSection.style.display = 'block';

            // Step 2: Generate images for each design
            for (let i = 0; i < designs.length; i++) {
                const design = designs[i];
                
                const imageResponse = await ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: `${design.imagePrompt}, high jewelry photography, dramatic lighting, macro details`,
                    config: {
                        numberOfImages: 1,
                        outputMimeType: 'image/jpeg',
                        aspectRatio: '1:1',
                    },
                });

                const base64Image = imageResponse.generatedImages[0].image.imageBytes;
                const imageUrl = `data:image/jpeg;base64,${base64Image}`;

                createDesignCard(design, imageUrl);
            }
            
            // Decrement and save attempts if user is on free plan
            if (currentUser.plan === 'free') {
                currentUser.attemptsLeft--;
                saveCurrentUserState();
                updateAuthStateUI();
            }


        } catch (error) {
            console.error("Error generating designs:", error);
            showNotification("An error occurred. Please try a different prompt or image.");
        } finally {
            toggleLoading(false);
             // Scroll after loading is confirmed to be off
            setTimeout(() => {
                yourCreationsSection.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
    
    /**
     * Opens the image zoom modal with the specified image and context.
     * @param src The source URL of the image to display.
     * @param analysisType The type of analysis to perform ('gemstone' or 'jewelry').
     */
    function openImageZoom(src: string, analysisType: 'gemstone' | 'jewelry' = 'jewelry') {
        zoomedImage.src = src;
        
        // Store the analysis type for later use
        analyzeGemBtn.dataset.analysisType = analysisType;
        
        // Reset analysis content with context-aware text
        if (analysisType === 'gemstone') {
             zoomAnalysisResult.textContent = "Click 'Analyze Gem' to get a detailed gemological report.";
        } else {
             zoomAnalysisResult.textContent = "Click 'Analyze Gem' to get an expert review of this jewelry design.";
        }
       
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
            
            const analysisType = analyzeGemBtn.dataset.analysisType;
            let prompt = '';

            if (analysisType === 'gemstone') {
                prompt = `You are an expert gemologist. Analyze the loose gemstone in this image. Provide a detailed analysis, including its likely type, cut quality (commenting on symmetry, faceting, and potential light leakage), color (hue, saturation, and tone), and clarity (any visible inclusions or blemishes). Format the response as a single, detailed paragraph.`;
            } else { // Default to 'jewelry' analysis
                prompt = `You are a jewelry design expert. Analyze the complete piece of jewelry in this image. Describe the overall design style (e.g., Art Deco, minimalist, vintage-inspired). Comment on the craftsmanship, the setting type (e.g., prong, bezel), the choice of metal, and how the central gemstone is mounted and accentuated by the overall design. Evaluate the harmony and balance of the piece. Format the response as a single, detailed paragraph.`;
            }

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

    /**
     * Resizes an image from a base64 string for storage efficiency.
     * @param base64Str The base64 string of the image.
     * @param maxWidth The maximum width of the resized image.
     * @param maxHeight The maximum height of the resized image.
     * @returns A promise that resolves to the resized image as a base64 string.
     */
    function resizeImage(base64Str: string, maxWidth = 400, maxHeight = 400): Promise<string> {
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
                // Use JPEG for better compression, crucial for localStorage
                resolve(canvas.toDataURL('image/jpeg', 0.9)); 
            };
            img.onerror = () => {
                reject(new Error('Image could not be loaded for resizing.'));
            };
        });
    }

    /**
     * Opens a modal to link a design to a task before saving.
     * @param button The save button element that was clicked.
     */
    function openLinkDesignModal(button: HTMLElement) {
        if (!currentUser) {
            showNotification("Please log in to save your creations.", "error");
            openAuthModal('login');
            return;
        }

        const card = button.closest('.design-card') as HTMLElement;
        if (!card) return;

        const design: Design = JSON.parse(card.dataset.design || '{}');
        const imageUrl = card.dataset.imageUrl || '';

        designToSave = { design, imageUrl };
        linkDesignPreviewImage.src = imageUrl;

        // Populate tasks dropdown
        const userTasksKey = `gemvision_tasks_${currentUser.email}`;
        const tasks: Task[] = JSON.parse(localStorage.getItem(userTasksKey) || '[]');
        linkTaskSelect.innerHTML = '<option value="">Select a task...</option>';
        tasks.forEach(task => {
            const option = document.createElement('option');
            option.value = task.id;
            option.textContent = task.title;
            linkTaskSelect.appendChild(option);
        });
        confirmLinkBtn.disabled = tasks.length === 0;

        linkDesignModal.style.display = 'flex';
    }

    function closeLinkDesignModal() {
        linkDesignModal.style.display = 'none';
        designToSave = null;
    }

    /**
     * The final step that saves a design to storage and optionally links it to a task.
     * @param taskId The optional ID of the task to link to.
     */
    async function saveAndLinkDesign(taskId?: string) {
        if (!currentUser || !designToSave) {
            showNotification("An error occurred. Could not save design.", "error");
            return;
        }

        const { design, imageUrl } = designToSave;
        
        try {
            if (!uploadedFile || !imageUrl) {
                throw new Error("Missing image data. Could not save design.");
            }

            const resizedGemstoneImage = await resizeImage(`data:${uploadedFile.mimeType};base64,${uploadedFile.base64}`);
            const resizedDesignImage = await resizeImage(imageUrl);

            const newItem: ShowcaseItem = {
                id: `item-${Date.now()}-${Math.random()}`,
                gemstoneImage: resizedGemstoneImage,
                designImage: resizedDesignImage,
                name: design.name,
                description: design.description,
                metals: design.metals,
                blueprint: design.blueprint,
                imagePrompt: design.imagePrompt,
            };

            // Save the creation to the user's gallery
            const userCreationsKey = `gemvision_creations_${currentUser.email}`;
            let myCreations: ShowcaseItem[] = JSON.parse(localStorage.getItem(userCreationsKey) || '[]');
            myCreations.unshift(newItem);
            localStorage.setItem(userCreationsKey, JSON.stringify(myCreations));
            
            // If a taskId is provided, update the task
            if (taskId) {
                const userTasksKey = `gemvision_tasks_${currentUser.email}`;
                let tasks: Task[] = JSON.parse(localStorage.getItem(userTasksKey) || '[]');
                const taskIndex = tasks.findIndex(t => t.id === taskId);
                if (taskIndex > -1) {
                    tasks[taskIndex].linkedDesignIds.push(newItem.id);
                    localStorage.setItem(userTasksKey, JSON.stringify(tasks));
                }
            }
            
            showNotification("Design saved to My Creations!", "success");
            renderMyCreationsGallery();
            renderMyTasks(); // Re-render tasks to show new linked design

        } catch (error: any) {
            console.error("Error saving design:", error);
            if (error.name === 'QuotaExceededError' || (error.message && error.message.includes('exceeded the quota'))) {
                showNotification("Could not save. Your design storage is full.", "error");
            } else {
                showNotification(`An error occurred while saving: ${error.message}`, "error");
            }
        } finally {
            closeLinkDesignModal();
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
        // Reset forms for next time
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

        // Populate profile data
        profileEmail.textContent = currentUser.email;
        profilePlan.textContent = currentUser.plan;
        profileAttempts.textContent = currentUser.plan === 'free' ? currentUser.attemptsLeft.toString() : 'Unlimited';
        profileEditEmailInput.value = currentUser.email;
        
        // Reset to view mode
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
                 attemptsCounter.textContent = `You have ${currentUser.attemptsLeft} free attempts remaining.`;
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
        updateGenerateButtonState();
    }
    
    function saveCurrentUserState() {
        if (currentUser) {
            localStorage.setItem('gemvision_currentUser', JSON.stringify(currentUser));
             // Also update the master user list
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
        } else {
            localStorage.removeItem('gemvision_currentUser');
        }
    }
    
    async function resizeProfilePicture(base64Str: string, maxWidth = 256, maxHeight = 256): Promise<string> {
        return resizeImage(base64Str, maxWidth, maxHeight);
    }

    async function handleProfilePictureUpload(file: File) {
        if (!currentUser) return;
    
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const originalBase64 = reader.result as string;
                const resizedBase64 = await resizeProfilePicture(originalBase64);
    
                // Update UI immediately
                profileEditPreview.src = resizedBase64;
                profilePictureDisplay.src = resizedBase64;
                navProfilePicture.src = resizedBase64;
    
                // Update state and save
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
        // Clear and hide all user-specific sections
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

    /**
     * Renders the logged-in user's personal creations gallery.
     */
    function renderMyCreationsGallery() {
        if (!currentUser) {
            myCreationsSection.style.display = 'none';
            return;
        }

        myCreationsSection.style.display = 'block'; // Always show section for logged-in users

        const userCreationsKey = `gemvision_creations_${currentUser.email}`;
        const creations: ShowcaseItem[] = JSON.parse(localStorage.getItem(userCreationsKey) || '[]');
        
        myCreationsGrid.innerHTML = ''; // Clear existing content

        if (creations.length === 0) {
            myCreationsGrid.innerHTML = `<p class="empty-gallery-message">You haven't saved any creations yet. Generate designs and click 'Save' to start your collection!</p>`;
            return;
        }

        creations.forEach(item => {
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
            myCreationsGrid.appendChild(card);
        });
    }
    
    async function handleAddToShowcase(file: File) {
        if (!file.type.startsWith('image/')) {
            showNotification('Please select an image file.', 'error');
            return;
        }

        const addToGalleryBtn = document.getElementById('add-to-gallery-btn') as HTMLButtonElement;
        addToGalleryBtn.disabled = true;
        adminStatus.textContent = 'Analyzing gemstone and generating designs... (This may take a minute)';

        try {
            const reader = new FileReader();
            const base64String = await new Promise<string>((resolve, reject) => {
                reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            const gemstoneImagePart = {
                inlineData: { mimeType: file.type, data: base64String },
            };
            const gemstoneImageUrl = `data:${file.type};base64,${base64String}`;

            const prompt = `
                Based on the uploaded image of a gemstone, generate TWO distinct and creative jewelry design concepts.
                For each concept, provide:
                1. A creative name for the jewelry piece.
                2. A captivating one-sentence description.
                3. A detailed, artistic prompt for an image generation model to create a photorealistic image of the final product.
            `;
            
            // Step 1: Generate the two design concepts
            const designResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: { parts: [gemstoneImagePart, { text: prompt }] },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            designs: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        description: { type: Type.STRING },
                                        imagePrompt: { type: Type.STRING },
                                    }
                                }
                            }
                        }
                    }
                }
            });
            const designData = JSON.parse(designResponse.text.trim());

            if (!designData.designs || designData.designs.length === 0) {
                throw new Error("AI failed to generate design concepts.");
            }

            // Step 2: Generate an image for each design concept and save
            let galleryItems: ShowcaseItem[] = JSON.parse(localStorage.getItem('gemvision_gallery') || '[]');

            for (const design of designData.designs) {
                adminStatus.textContent = `Generating image for "${design.name}"...`;
                const imageResponse = await ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: `${design.imagePrompt}, high jewelry photography, dramatic lighting, macro details`,
                    config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '1:1' },
                });
                
                const designImageBase64 = imageResponse.generatedImages[0].image.imageBytes;
                const designImageUrl = `data:image/jpeg;base64,${designImageBase64}`;

                const newItem: ShowcaseItem = {
                    id: `item-${Date.now()}-${Math.random()}`,
                    gemstoneImage: gemstoneImageUrl,
                    designImage: designImageUrl,
                    name: design.name,
                    description: design.description,
                };
                galleryItems.unshift(newItem); // Add to the beginning of the array
            }

            localStorage.setItem('gemvision_gallery', JSON.stringify(galleryItems));
            renderShowcaseGallery();
            showNotification('New designs added to the showcase gallery!', 'success');
            adminUploadForm.reset();

        } catch (error) {
            console.error("Error adding to showcase:", error);
            showNotification('An error occurred while adding to the gallery.', 'error');
        } finally {
            addToGalleryBtn.disabled = false;
            adminStatus.textContent = '';
        }
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
    
    /**
     * Reads, validates, and stores plan info to begin the payment process.
     */
    function openPaymentMethodModal(button: HTMLButtonElement) {
        const plan = button.getAttribute('data-plan') as UserPlan;
        const planName = button.getAttribute('data-plan-name');
        const priceIdUsd = button.getAttribute('data-price-id-usd');
        const priceIdInr = button.getAttribute('data-price-id-inr');

        // Stricter initial validation
        if (!plan || !planName || !priceIdUsd || !priceIdInr) {
            console.error("Missing plan data on button:", { plan, planName, priceIdUsd, priceIdInr });
            showNotification("Cannot initiate payment: critical plan information is missing from the button.", "error");
            return;
        }

        selectedPlanForPayment = { plan, planName, priceIdUsd, priceIdInr };
        paymentMethodTitle.textContent = `Upgrade to ${planName}`;
        paymentMethodModal.style.display = 'flex';
    }
    
    function closePaymentMethodModal() {
        paymentMethodModal.style.display = 'none';
        selectedPlanForPayment = null;
    }

    function openCryptoModal() {
        if (!selectedPlanForPayment) return;

        cryptoPaymentTitle.textContent = `Pay for ${selectedPlanForPayment.planName}`;
        // In a real app, you would fetch conversion rates. Here we simulate.
        // Reset to default tab
        const defaultTab = cryptoTabs.querySelector('.crypto-tab[data-coin="BTC"]') as HTMLButtonElement;
        switchCryptoTab(defaultTab);
        
        closePaymentMethodModal();
        cryptoPaymentModal.style.display = 'flex';
    }

    function closeCryptoModal() {
        cryptoPaymentModal.style.display = 'none';
    }

    function switchCryptoTab(tab: HTMLButtonElement) {
         cryptoTabs.querySelector('.active')?.classList.remove('active');
         tab.classList.add('active');

        // This is a simulation. In a real app, you'd fetch this data.
        const coin = tab.dataset.coin;
        if (coin === 'BTC') {
            cryptoAmountValue.textContent = '0.000105 BTC';
            cryptoWalletAddress.value = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
        } else if (coin === 'ETH') {
            cryptoAmountValue.textContent = '0.0021 ETH';
            cryptoWalletAddress.value = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B';
        }
    }

    /**
     * Redirects to Stripe checkout using a pre-defined Price ID.
     */
    async function redirectToCheckout() {
        if (!stripe || !currentUser || !selectedPlanForPayment) {
            showNotification('Payment system is not available. Please try again later.');
            return;
        }

        const { priceIdUsd, priceIdInr } = selectedPlanForPayment;

        // Step 1: Validate currency
        if (currentCurrency !== 'usd' && currentCurrency !== 'inr') {
            console.error('Invalid currency detected:', currentCurrency);
            showNotification('An unexpected currency error occurred. Please try again.', 'error');
            return;
        }

        // Step 2: Select the correct price ID based on the validated currency
        const priceId = currentCurrency === 'usd' ? priceIdUsd : priceIdInr;

        // Step 3: Final validation of all data being sent to Stripe
        if (!priceId || typeof priceId !== 'string' || priceId.trim() === '' || priceId.includes('YOUR_')) {
            console.error('Invalid or placeholder Price ID for Stripe:', priceId);
            showNotification('This payment plan is not configured correctly. Please contact support.', 'error');
            return;
        }
        if (!currentUser.email) {
            console.error('Missing customer email for Stripe');
            showNotification('Your email is missing. Please log in again.', 'error');
            return;
        }

        toggleLoading(true);

        try {
            const checkoutObject = {
                lineItems: [{
                    price: priceId, // Use the Price ID here
                    quantity: 1,
                }],
                mode: 'subscription',
                successUrl: `${window.location.origin}${window.location.pathname}?checkout_status=success&plan=${selectedPlanForPayment.plan}`,
                cancelUrl: `${window.location.origin}${window.location.pathname}?checkout_status=cancel`,
                customerEmail: currentUser.email,
            };
            
            console.log("Redirecting to Stripe with:", JSON.stringify(checkoutObject, null, 2));

            await stripe.redirectToCheckout(checkoutObject);

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
            // Clean the URL
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
        // Pro plan has a monthly generation limit, Elite is unlimited for this demo
        currentUser.attemptsLeft = plan === 'pro' ? 50 : 9999;
        saveCurrentUserState();
        updateAuthStateUI();
        showNotification(`Successfully upgraded to the ${plan} plan!`, 'success');
    }

    // --- Social Sharing Functions ---

    /**
     * Opens the share modal and populates it with design data.
     * @param button The share button that was clicked.
     */
    function openShareModal(button: HTMLElement) {
        const card = button.closest('.design-card') as HTMLElement;
        if (!card || !card.dataset.design || !card.dataset.imageUrl) {
            showNotification("Could not open share modal. Design data missing.", "error");
            return;
        }

        currentShareDesign = JSON.parse(card.dataset.design);
        currentShareImageUrl = card.dataset.imageUrl;

        // Reset modal state
        sharePreviewImage.src = currentShareImageUrl;
        shareVideoContainer.style.display = 'none';
        shareVideoLoader.style.display = 'none';
        shareVideoLoader.classList.remove('error');
        shareVideoPreview.style.display = 'none';
        shareVideoPreview.src = '';
        shareVideoDownloadBtn.style.display = 'none';
        shareVideoDownloadBtn.href = '';
        generatedReelUrl = null;

        // Set initial tab and generate caption
        switchShareTab(shareTabsContainer.querySelector('.share-tab[data-platform="x"]') as HTMLButtonElement);
        
        shareModal.style.display = 'flex';
    }

    function closeShareModal() {
        shareModal.style.display = 'none';
        currentShareDesign = null;
        currentShareImageUrl = null;
    }

    /**
     * Handles switching between social media tabs in the share modal.
     * @param tab The tab button that was clicked.
     */
    function switchShareTab(tab: HTMLButtonElement) {
        const platform = tab.dataset.platform as SocialPlatform;
        if (!platform) return;
        
        currentSharePlatform = platform;

        // Update active tab style
        shareTabsContainer.querySelector('.active')?.classList.remove('active');
        tab.classList.add('active');

        // Show/hide reel controls based on platform
        shareReelControls.style.display = (platform === 'instagram' || platform === 'facebook') ? 'block' : 'none';
        
        // Update post button state and text
        if (currentUser) {
            postToSocialBtn.disabled = false; // Always enabled if user is logged in
            postToSocialBtn.textContent = 'Save to My Posts';
            postToSocialBtn.dataset.tooltip = `Save this post draft to your 'My Social Posts' gallery.`;
        } else {
             postToSocialBtn.disabled = true;
             postToSocialBtn.textContent = 'Save to My Posts';
             postToSocialBtn.dataset.tooltip = 'Please log in to save your posts.';
        }
        
        // Generate a new caption for the selected platform
        generateSocialCaption();
    }
    
    /**
     * Generates a detailed, platform-specific prompt for the AI.
     * @param platform The target social media platform.
     * @param design The design object.
     * @returns A string containing the full prompt for the AI.
     */
    function getPlatformSpecificPrompt(platform: string, design: Design): string {
        let platformInstructions = '';
        switch(platform) {
            case 'x':
                platformInstructions = 'Keep it concise and punchy (under 280 characters). Use emojis sparingly. End with a question to drive engagement.';
                break;
            case 'facebook':
                platformInstructions = 'Write a slightly longer, more descriptive post. Tell a short story about the inspiration behind the design. Use a friendly and inviting tone.';
                break;
            case 'instagram':
                platformInstructions = 'Focus heavily on the visual appeal. Use descriptive adjectives and relevant emojis. The caption can be longer and more story-driven. Place the hashtags at the very end.';
                break;
            case 'linkedin':
                platformInstructions = 'Adopt a professional and sophisticated tone. Focus on the craftsmanship, the quality of the materials, and the value proposition. Frame it as a piece of art or a valuable investment.';
                break;
            default:
                platformInstructions = 'Write a captivating post.';
        }

        return `You are a social media marketing expert for a luxury jewelry brand. 
        Write a post for ${platform} about the following jewelry design:
        - Name: ${design.name}
        - Description: ${design.description}
        - Metals: ${design.metals.join(', ')}
        
        **Platform-specific Instructions:** ${platformInstructions}
        
        Include 3-5 relevant and popular hashtags.`;
    }

    /**
     * Generates a social media caption tailored to the current platform and design.
     */
    async function generateSocialCaption() {
        if (!currentShareDesign) return;

        shareCaptionInput.value = '';
        shareCaptionInput.placeholder = `Generating a great caption for ${currentSharePlatform}...`;
        regenerateCaptionBtn.disabled = true;

        try {
            const prompt = getPlatformSpecificPrompt(currentSharePlatform, currentShareDesign);
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });

            shareCaptionInput.value = response.text.trim();

        } catch (error) {
            console.error("Error generating social caption:", error);
            shareCaptionInput.value = "Couldn't generate a caption. Please write your own or try again.";
        } finally {
            shareCaptionInput.placeholder = "Describe your post...";
            regenerateCaptionBtn.disabled = false;
        }
    }

    /**
     * Handles the creation of a cinematic reel for the design.
     */
    async function handleReelGeneration() {
        if (!currentShareDesign || !uploadedFile) return;

        const videoLoadingMessages = [
            "Animating your masterpiece...",
            "Rendering the sparkle...",
            "Adding cinematic flair...",
            "Finalizing the high-definition cut...",
            "This can take a few minutes..."
        ];
        let messageIndex = 0;

        // Reset UI and show loader
        shareVideoContainer.style.display = 'flex';
        shareVideoLoader.style.display = 'flex';
        shareVideoLoader.classList.remove('error');
        shareVideoPreview.style.display = 'none';
        shareVideoDownloadBtn.style.display = 'none';
        createReelBtn.disabled = true;
        
        const updateLoadingText = () => {
            shareVideoLoadingText.textContent = videoLoadingMessages[messageIndex];
            messageIndex = (messageIndex + 1) % videoLoadingMessages.length;
        };
        updateLoadingText();
        const videoLoadingInterval = setInterval(updateLoadingText, 3000);

        try {
            const prompt = `A cinematic, slow-motion 5-second video of this piece of jewelry: ${currentShareDesign.imagePrompt}. The lighting should be dramatic, highlighting the sparkle of the gemstone and the texture of the metal. Show it rotating slowly against a dark, elegant background.`;
            
            let operation = await ai.models.generateVideos({
                model: 'veo-2.0-generate-001',
                prompt: prompt,
                image: {
                    imageBytes: uploadedFile.base64,
                    mimeType: uploadedFile.mimeType,
                },
                config: { numberOfVideos: 1 }
            });

            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }
            
            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (!downloadLink) throw new Error("Video generation succeeded but no download link was returned.");
            
            const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
            if (!videoResponse.ok) {
                 const errorBody = await videoResponse.text();
                 throw new Error(`Failed to fetch video (status: ${videoResponse.status}): ${errorBody}`);
            }

            const videoBlob = await videoResponse.blob();
            generatedReelUrl = URL.createObjectURL(videoBlob);
            
            shareVideoPreview.src = generatedReelUrl;
            shareVideoDownloadBtn.href = generatedReelUrl;

            // Show video, hide loader
            shareVideoLoader.style.display = 'none';
            shareVideoPreview.style.display = 'block';
            shareVideoDownloadBtn.style.display = 'block';

        } catch (error: any) {
            console.error("Error generating reel:", error);
            shareVideoLoader.classList.add('error');
            
            const errorMessage = error.toString();
            if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('resource_exhausted') || errorMessage.toLowerCase().includes('quota')) {
                shareVideoLoadingText.textContent = "Video Generation Limit Reached. Please check your plan and billing details.";
            } else {
                shareVideoLoadingText.textContent = "Video Generation Failed. Please try again.";
            }
        } finally {
            clearInterval(videoLoadingInterval);
            createReelBtn.disabled = false;
        }
    }

    /**
     * Saves the created social post to local storage or simulates posting.
     */
    function handlePostAction() {
        if (!currentUser || !currentShareDesign || !currentShareImageUrl) return;

        const caption = shareCaptionInput.value.trim();
        if (!caption) {
            showNotification("Please generate or write a caption before saving.", "error");
            return;
        }

        const newPost: SocialPost = {
            id: `post-${Date.now()}`,
            platform: currentSharePlatform,
            caption: caption,
            designImage: currentShareImageUrl,
            videoUrl: generatedReelUrl || undefined,
            timestamp: Date.now(),
            designName: currentShareDesign.name,
        };
        
        const userPostsKey = `gemvision_posts_${currentUser.email}`;
        let myPosts: SocialPost[] = JSON.parse(localStorage.getItem(userPostsKey) || '[]');
        myPosts.unshift(newPost);
        localStorage.setItem(userPostsKey, JSON.stringify(myPosts));

        showNotification(`Post for ${currentSharePlatform} saved to 'My Social Posts'!`, "success");
        renderMySocialPosts();
        closeShareModal();
    }
    
    /**
     * Gets an SVG icon string for a given social media platform.
     * @param platform The social media platform.
     * @returns An SVG string or a fallback span with the platform name.
     */
    function getPlatformIcon(platform: string): string {
        switch (platform) {
            case 'x':
                return `<svg class="platform-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;
            case 'facebook':
                return `<svg class="platform-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.87v-2.782h2.87V9.64c0-2.858 1.708-4.44 4.316-4.44 1.235 0 2.502.224 2.502.224v2.485h-1.313c-1.428 0-1.884.89-1.884 1.815v2.109h3.28l-.523 2.782h-2.757v7.008C18.343 21.128 22 16.991 22 12z"/></svg>`;
            case 'instagram':
                return `<svg class="platform-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-2.717 0-3.056.01-4.122.06-1.065.05-1.79.217-2.428.465a4.902 4.902 0 0 0-1.772 1.153 4.902 4.902 0 0 0-1.153 1.772c-.248.638-.415 1.363-.465 2.428C2.01 8.944 2 9.283 2 12s.01 3.056.06 4.122c.05 1.065.217 1.79.465 2.428a4.902 4.902 0 0 0 1.153 1.772 4.902 4.902 0 0 0 1.772 1.153c.638.248 1.363.415 2.428.465C8.944 21.99 9.283 22 12 22s3.056-.01 4.122-.06c1.065-.05 1.79-.217 2.428-.465a4.902 4.902 0 0 0 1.772-1.153 4.902 4.902 0 0 0 1.153-1.772c.248-.638-.415-1.363-.465-2.428C21.99 15.056 22 14.717 22 12s-.01-3.056-.06-4.122c-.05-1.065-.217-1.79-.465-2.428a4.902 4.902 0 0 0-1.153-1.772 4.902 4.902 0 0 0-1.772-1.153c-.638-.248-1.363-.415-2.428-.465C15.056 2.01 14.717 2 12 2zm0 1.802c2.67 0 2.987.01 4.042.059.975.044 1.504.207 1.857.344.467.182.86.399 1.25.789.39.39.607.783.789 1.25.137.353.3.882.344 1.857.049 1.055.059 1.372.059 4.042s-.01 2.987-.059 4.042c-.044.975-.207 1.504-.344 1.857a3.097 3.097 0 0 1-.789 1.25 3.097 3.097 0 0 1-1.25.789c-.353.137-.882.3-1.857.344-1.055.049-1.372.059-4.042.059s-2.987-.01-4.042-.059c-.975-.044-1.504-.207-1.857-.344a3.097 3.097 0 0 1-1.25-.789 3.097 3.097 0 0 1-.789-1.25c-.137-.353-.3-.882-.344-1.857C3.81 15.056 3.802 14.717 3.802 12s.01-2.987.059-4.042c.044-.975.207-1.504.344-1.857.182-.467.399-.86.789-1.25.39-.39.783-.607 1.25-.789.353-.137.882-.3 1.857-.344C9.013 3.81 9.33 3.802 12 3.802zM12 7.25a4.75 4.75 0 1 0 0 9.5 4.75 4.75 0 0 0 0-9.5zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm6.5-7.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5z"/></svg>`;
            case 'linkedin':
                return `<svg class="platform-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`;
            default:
                return `<span class="platform-text">${platform}</span>`; // Fallback to text
        }
    }

    /**
     * Renders the user's saved social posts.
     */
    function renderMySocialPosts() {
        if (!currentUser) {
            myPostsSection.style.display = 'none';
            return;
        }

        myPostsSection.style.display = 'block';

        const userPostsKey = `gemvision_posts_${currentUser.email}`;
        const posts: SocialPost[] = JSON.parse(localStorage.getItem(userPostsKey) || '[]');
        
        myPostsGrid.innerHTML = '';

        if (posts.length === 0) {
            myPostsGrid.innerHTML = `<p class="empty-gallery-message">You haven't posted anything yet. Share a design to get started!</p>`;
            return;
        }

        posts.forEach(post => {
            const card = document.createElement('article');
            card.className = 'social-post-card';
             // Store data directly on the card for the download handler
            card.dataset.caption = post.caption;
            card.dataset.imageUrl = post.designImage;
            if (post.videoUrl) {
                card.dataset.videoUrl = post.videoUrl;
            }
            card.dataset.designName = post.designName;

            const mediaElement = post.videoUrl 
                ? `<video src="${post.videoUrl}" muted loop playsinline></video>` 
                : `<img src="${post.designImage}" alt="${post.designName}" loading="lazy">`;

            card.innerHTML = `
                <div class="media-preview">${mediaElement}</div>
                <div class="social-post-content">
                    <div class="social-post-header">
                        <div class="platform-icon-container">${getPlatformIcon(post.platform)}</div>
                        <span class="timestamp">${new Date(post.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p class="social-post-caption">${post.caption}</p>
                </div>
                <div class="social-post-actions">
                    <button class="download-post-btn">Download</button>
                    <div class="download-links"></div>
                </div>
            `;
            myPostsGrid.appendChild(card);
        });
    }

    /**
     * Handles showing download links for a saved social post.
     * @param button The download button that was clicked.
     */
    function handleDownloadPost(button: HTMLButtonElement) {
        const card = button.closest('.social-post-card') as HTMLElement;
        const linksContainer = card.querySelector('.download-links');
        if (!card || !linksContainer) return;
    
        // Toggle visibility
        if (linksContainer.classList.contains('active')) {
            linksContainer.classList.remove('active');
            linksContainer.innerHTML = ''; // Clear links when closing
            button.textContent = 'Download';
            return;
        }

        button.textContent = 'Close';
        linksContainer.innerHTML = ''; // Clear previous before showing
        linksContainer.classList.add('active');

        const { caption, imageUrl, videoUrl, designName } = card.dataset;
        const sanitizedName = designName?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'design';

        // 1. Download Caption Link
        if (caption) {
            const blob = new Blob([caption], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.textContent = 'Download Caption (.txt)';
            a.download = `${sanitizedName}_caption.txt`;
            linksContainer.appendChild(a);
        }

        // 2. Download Image Link
        if (imageUrl) {
            const a = document.createElement('a');
            a.href = imageUrl;
            a.textContent = 'Download Image';
            a.download = `${sanitizedName}_image.jpg`; // Assume jpeg, can be improved
            linksContainer.appendChild(a);
        }

        // 3. Download Video Link
        if (videoUrl) {
            const a = document.createElement('a');
            a.href = videoUrl;
            a.textContent = 'Download Reel (.mp4)';
            a.download = `${sanitizedName}_reel.mp4`;
            linksContainer.appendChild(a);
        }
    }

    // --- My Tasks Functions ---

    /**
     * Renders the user's tasks from local storage.
     */
    function renderMyTasks() {
        if (!currentUser) {
            myTasksSection.style.display = 'none';
            return;
        }

        myTasksSection.style.display = 'block';
        const userTasksKey = `gemvision_tasks_${currentUser.email}`;
        const tasks: Task[] = JSON.parse(localStorage.getItem(userTasksKey) || '[]');
        const userCreationsKey = `gemvision_creations_${currentUser.email}`;
        const creations: ShowcaseItem[] = JSON.parse(localStorage.getItem(userCreationsKey) || '[]');
        
        myTasksGrid.innerHTML = '';
        if (tasks.length === 0) {
            myTasksGrid.innerHTML = `<p class="empty-gallery-message">You have no tasks. Click 'Create New Task' to get started!</p>`;
            return;
        }

        tasks.forEach(task => {
            const card = document.createElement('article');
            card.className = 'task-card';
            card.dataset.taskId = task.id;
            card.dataset.status = task.status;
            
            const linkedDesignsHtml = task.linkedDesignIds.map(designId => {
                const design = creations.find(c => c.id === designId);
                return design ? `<img src="${design.designImage}" alt="${design.name}" class="linked-design-item" data-design-id="${designId}">` : '';
            }).join('');

            card.innerHTML = `
                <div class="task-header">
                    <h3>${task.title}</h3>
                    <select class="task-status-select" data-status="${task.status}">
                        <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                        <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="on-hold" ${task.status === 'on-hold' ? 'selected' : ''}>On Hold</option>
                    </select>
                </div>
                ${task.dueDate ? `<p class="due-date">Due: ${new Date(task.dueDate).toLocaleDateString()}</p>` : ''}
                <p class="description">${task.description || 'No description.'}</p>
                <div class="linked-designs">
                    <h4>Linked Designs</h4>
                    <div class="linked-designs-list">
                        ${linkedDesignsHtml || '<p class="empty-gallery-message" style="font-size: 0.8rem; padding: 0.5rem;">No designs linked yet.</p>'}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-action-btn edit">Edit</button>
                    <button class="task-action-btn delete">Delete</button>
                </div>
            `;
            myTasksGrid.appendChild(card);
        });
    }

    /**
     * Opens the task creation/editing modal.
     * @param task Optional task object to populate the form for editing.
     */
    function openTaskModal(task?: Task) {
        if (task) {
            editingTaskId = task.id;
            taskModalTitle.textContent = 'Edit Task';
            taskTitleInput.value = task.title;
            taskDescriptionInput.value = task.description;
            taskDueDateInput.value = task.dueDate;
            taskStatusSelect.value = task.status;
        } else {
            editingTaskId = null;
            taskModalTitle.textContent = 'Create New Task';
            taskForm.reset();
        }
        taskModal.style.display = 'flex';
    }

    function closeTaskModal() {
        taskModal.style.display = 'none';
        editingTaskId = null;
    }

    /**
     * Handles the submission of the task form for creating or updating a task.
     * @param event The form submission event.
     */
    function handleSaveTask(event: Event) {
        event.preventDefault();
        if (!currentUser) return;

        const userTasksKey = `gemvision_tasks_${currentUser.email}`;
        let tasks: Task[] = JSON.parse(localStorage.getItem(userTasksKey) || '[]');

        const taskData = {
            title: taskTitleInput.value,
            description: taskDescriptionInput.value,
            dueDate: taskDueDateInput.value,
            status: taskStatusSelect.value as TaskStatus,
        };

        if (editingTaskId) { // Updating existing task
            const taskIndex = tasks.findIndex(t => t.id === editingTaskId);
            if (taskIndex > -1) {
                tasks[taskIndex] = { ...tasks[taskIndex], ...taskData };
            }
        } else { // Creating new task
            const newTask: Task = {
                id: `task-${Date.now()}`,
                ...taskData,
                linkedDesignIds: [],
            };
            tasks.unshift(newTask);
        }

        localStorage.setItem(userTasksKey, JSON.stringify(tasks));
        renderMyTasks();
        closeTaskModal();
    }
    
    /**
     * Deletes a task from storage.
     * @param taskId The ID of the task to delete.
     */
    function handleDeleteTask(taskId: string) {
        if (!currentUser || !confirm('Are you sure you want to delete this task?')) return;

        const userTasksKey = `gemvision_tasks_${currentUser.email}`;
        let tasks: Task[] = JSON.parse(localStorage.getItem(userTasksKey) || '[]');
        tasks = tasks.filter(t => t.id !== taskId);
        localStorage.setItem(userTasksKey, JSON.stringify(tasks));
        renderMyTasks();
        showNotification("Task deleted.", "success");
    }
    
    /**
     * Updates the status of a task directly from its card.
     * @param taskId The ID of the task.
     * @param newStatus The new status.
     */
    function handleTaskStatusChange(taskId: string, newStatus: TaskStatus) {
        if (!currentUser) return;
        const userTasksKey = `gemvision_tasks_${currentUser.email}`;
        let tasks: Task[] = JSON.parse(localStorage.getItem(userTasksKey) || '[]');
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex > -1) {
            tasks[taskIndex].status = newStatus;
            localStorage.setItem(userTasksKey, JSON.stringify(tasks));
            renderMyTasks(); // Re-render to update the card's style
        }
    }


    // --- AI Helper Chat Functions ---

    /**
     * Appends a message to the chat UI.
     * @param text The message text.
     * @param sender 'user', 'ai', or 'error'.
     */
    function appendChatMessage(text: string, sender: 'user' | 'ai' | 'error') {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}`;
        messageElement.textContent = text;
        chatMessagesContainer.appendChild(messageElement);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    /**
     * Displays a typing indicator in the chat.
     */
    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'chat-message loading';
        indicator.innerHTML = `
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        `;
        chatMessagesContainer.appendChild(indicator);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    /**
     * Removes the typing indicator from the chat.
     */
    function hideTypingIndicator() {
        const indicator = chatMessagesContainer.querySelector('.loading');
        if (indicator) {
            indicator.remove();
        }
    }

    /**
     * Handles sending a message from the chat input.
     * @param event The form submission event.
     */
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
    
    /**
     * Initializes the AI helper chat session.
     */
    function initializeAiHelper() {
        aiHelperChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are a friendly, knowledgeable, and helpful customer support agent for a web application called GemVision AI.
                Your goal is to provide comprehensive answers to user questions about how to use the application, troubleshoot common issues, and explain its features in detail.
                Your knowledge base is strictly limited to the information provided below. Do not invent features. If you don't know the answer, say you need to check with the team.

                **Core Application Workflow:**
                1.  **Upload:** The user starts by uploading a file. They can upload **both photos AND videos** of their gemstone.
                2.  **Frame Capture (for videos):** If a video is uploaded, a player appears. The user can play the video and click "Capture Frame for Analysis" to select the perfect shot of their gemstone.
                3.  **Provide Details:** The user can manually input details like gemstone type, weight, and dimensions.
                4.  **AI Analysis:** The user can click the "Analyze Gemstone" button. This powerful feature uses AI to analyze the uploaded image, identify the gem type and cut, estimate its carat weight, analyze its proportions, and provide a current market price estimate with links to web sources. This analysis automatically fills in the Gemstone Type and Carat Weight fields.
                5.  **Create a Prompt:** The user describes the jewelry design they want in the "Weave Your Dream Design" text box. For inspiration, they can click the "Let AI Dream" button, and the AI will generate a creative prompt based on their gemstone image.
                6.  **Generate:** The user clicks "Generate Designs". The AI then creates three unique jewelry designs based on the gemstone and the prompt.
                7.  **View Results:** The results appear in the "Your Creations" section. Each design is presented on a card with a photorealistic image, a name, a description, and a technical blueprint.

                **Key Features & How to Use Them:**

                *   **File Uploads:** Supports all common image formats (JPG, PNG) and video formats (MP4).
                *   **Camera Input:** Users can click the camera icon to use their device's camera to take a photo of their gem directly.
                *   **3D Viewer:** On each generated design card, there is a "View in 3D" button. Clicking this transforms the image into an interactive 3D model that the user can rotate and zoom to inspect from all angles.
                *   **Saving Designs & Task Management:**
                    *   Logged-in users can click the "Save" button on any design card. This opens a modal.
                    *   From the modal, they can save the design to their "My Saved Creations" gallery.
                    *   Crucially, they can also link this saved design to a specific project or task. They can select an existing task from a dropdown or create a new one right from the save modal.
                    *   The "My Tasks" section allows users to manage these projects, view linked designs, update statuses, and set due dates.
                *   **Sharing & Social Media:**
                    *   Clicking the "Share" button opens a special modal.
                    *   Inside the modal, the AI can generate tailored captions for different social media platforms (X, Facebook, Instagram, LinkedIn).
                    *   For Instagram and Facebook, users have the option to click "Create Reel" to generate a short, cinematic video of their jewelry design. This process can take a few minutes.
                    *   Users can save the complete post (image, caption, and optional video) to their "My Social Posts" gallery.
                *   **Downloading Posts:** In the "My Social Posts" section, each saved post has a "Download" button. This allows the user to download all the assets for that post: the caption as a text file, the design image, and the video file (if one was created). This makes it easy to manually upload to social media.
                *   **User Accounts & Plans:**
                    *   **Free Plan:** New users get 3 free design generations.
                    *   **Pro & Elite Plans:** Paid plans offer more generations per month (Pro) or unlimited generations (Elite), plus higher quality images and other features.
                    *   **Upgrading:** Users can upgrade their plan on the "Pricing" section of the page. Payment is supported via Credit Card (Stripe) and Cryptocurrency.
                    *   **Profile Management:** Logged-in users can click "My Profile" to view their plan details, change their profile picture, and log out.

                **Your Persona:**
                *   Be enthusiastic and encouraging.
                *   Use clear, step-by-step instructions when explaining how to do something.
                *   Always be polite. If asked an unrelated question, politely state: "I can only assist with questions about the GemVision AI application. How can I help you with your jewelry designs today?"`
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
    designPromptInput.addEventListener('input', updateGenerateButtonState);
    generateBtn.addEventListener('click', generateDesigns);
    dreamBtn.addEventListener('click', dreamUpPrompt);
    analyzeGemstoneBtn.addEventListener('click', analyzeGemstone);

    imagePreviewContainer.addEventListener('click', () => {
        if (uploadedFile && imagePreview.src && imagePreview.src !== '#') {
            openImageZoom(imagePreview.src, 'gemstone');
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

        // Update UI to show the captured frame
        imagePreview.src = dataUrl;
        imagePreviewContainer.style.display = 'block';
        videoPreviewContainer.style.display = 'none';
        
        // Enable buttons
        dreamBtn.disabled = false;
        analyzeGemstoneBtn.disabled = false;
        updateGenerateButtonState();

        showNotification("Frame captured! You can now generate designs.", "success");
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
                    handleImageFile(file); // Use handleImageFile directly
                }
            }, 'image/jpeg');
        }
        stopCamera();
    });

    // Gallery Listeners (using event delegation for zoom and 3D toggle)
    document.body.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;

        const designCard = target.closest('.design-card, .showcase-card');
        if (designCard) {
            // Handle Save Design
            if (target.classList.contains('save-design-btn') && designCard.classList.contains('design-card')) {
                openLinkDesignModal(target);
                return;
            }
             // Handle Share Design
            if (target.classList.contains('share-design-btn') && designCard.classList.contains('design-card')) {
                openShareModal(target);
                return;
            }
        
             // Handle Image Zoom on any image inside the cards
            if (target.tagName === 'IMG') {
                const analysisType = (target.dataset.analysisType as 'gemstone' | 'jewelry') || 'jewelry';
                openImageZoom((target as HTMLImageElement).src, analysisType);
                return; // Prioritize zoom
            }
            
            // Handle 3D View Toggle (only for user-generated cards)
            if (target.classList.contains('view-toggle-btn') && designCard.classList.contains('design-card')) {
                const card = designCard as HTMLElement;
                const viewerContainer = card.querySelector('.viewer-container') as HTMLDivElement;
                const is3D = target.dataset.view === '3d';

                if (is3D) {
                    // Switch back to 2D
                    if ((viewerContainer as any).cleanup) {
                        (viewerContainer as any).cleanup();
                    }
                    card.classList.remove('view-3d');
                    target.dataset.view = '2d';
                    target.textContent = 'View in 3D';
                } else {
                    // Switch to 3D
                    const design: Design = JSON.parse(card.dataset.design || '{}');
                    const imageUrl = card.dataset.imageUrl || '';
                    // Initialize viewer only if it doesn't have a canvas yet
                    if (viewerContainer && !viewerContainer.querySelector('canvas')) {
                        init3DViewer(viewerContainer, imageUrl, design);
                    }
                    card.classList.add('view-3d');
                    target.dataset.view = '3d';
                    target.textContent = 'View in 2D';
                }
            }
        }

        const socialPostCard = target.closest('.social-post-card');
        if (socialPostCard && target.classList.contains('download-post-btn')) {
            handleDownloadPost(target as HTMLButtonElement);
            return;
        }
    });

    zoomCloseBtn.addEventListener('click', closeImageZoom);
    imageZoomModal.addEventListener('click', (e) => {
        if (e.target === imageZoomModal) {
            closeImageZoom();
        }
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
        if (currentUser) {
            openProfileModal();
        }
    });
    
    gateSignupBtn.addEventListener('click', () => openAuthModal('register'));
    document.querySelectorAll('.pricing-button[data-plan="free"]').forEach(btn => {
        btn.addEventListener('click', () => openAuthModal('register'));
    });

    authCloseBtn.addEventListener('click', closeAuthModal);
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            closeAuthModal();
        }
    });
    showRegisterViewLink.addEventListener('click', (e) => {
        e.preventDefault();
        openAuthModal('register');
    });
    showLoginViewLink.addEventListener('click', (e) => {
        e.preventDefault();
        openAuthModal('register');
    });
    
    // Registration Step 1: Email submission
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

    // Registration Step 2: "Verify" button click
    verifyEmailBtn.addEventListener('click', () => {
        verifyEmailView.style.display = 'none';
        setPasswordView.style.display = 'block';
    });
    
    // Registration Step 3: Password submission and account creation
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
        users[registrationEmail] = { 
            password: hashedPassword, 
            attemptsLeft: 3, 
            plan: 'free'
        };
        localStorage.setItem('gemvision_users', JSON.stringify(users));

        currentUser = { 
            email: registrationEmail, 
            attemptsLeft: 3, 
            plan: 'free'
        };
        saveCurrentUserState();
        updateAuthStateUI();
        renderMyCreationsGallery();
        renderMySocialPosts();
        renderMyTasks();
        closeAuthModal();
        showNotification("Account created successfully! You can now start designing.", "success");
    });
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        // Special Admin Login
        if (email === ADMIN_EMAIL && password === 'admin123') {
            currentUser = { 
                email: ADMIN_EMAIL, 
                attemptsLeft: 999, 
                plan: 'admin'
             };
            saveCurrentUserState();
            updateAuthStateUI();
            closeAuthModal();
            showNotification('Welcome, Administrator!', 'success');
            renderMyCreationsGallery();
            renderMySocialPosts();
            renderMyTasks();
            return;
        }
        
        // Special Tester Login
        if (email === 'tester@gemvision.ai' && password === 'tester123') {
            currentUser = {
                email: 'tester@gemvision.ai',
                attemptsLeft: 9999, // Unlimited attempts for testing
                plan: 'free', // Keep on free plan to test related UI, but with no limits
            };
            saveCurrentUserState();
            updateAuthStateUI();
            closeAuthModal();
            showNotification('Welcome, Tester! You have unlimited attempts.', 'success');
            renderMyCreationsGallery();
            renderMySocialPosts();
            renderMyTasks();
            return;
        }

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
             saveCurrentUserState();
             updateAuthStateUI();
             renderMyCreationsGallery();
             renderMySocialPosts();
             renderMyTasks();
             closeAuthModal();
             showNotification(`Welcome back, ${email}!`, 'success');
        } else {
             showNotification("Invalid email or password.", "error");
        }
    });

    // Profile Modal Listeners
    profileCloseBtn.addEventListener('click', closeProfileModal);
    profileModal.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target === profileModal) {
            closeProfileModal();
        }
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
        // The profile picture is saved on-change, so this button just saves other data
        // and switches the view back.
        // For now, we just acknowledge the save as email (key) can't be changed.
        showNotification("Profile updated successfully!", "success");
        profileView.style.display = 'block';
        profileEditView.style.display = 'none';
    });
    
    // Admin Panel Listener
    adminUploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (adminFileUpload.files && adminFileUpload.files[0]) {
            handleAddToShowcase(adminFileUpload.files[0]);
        } else {
            showNotification('Please select a file to upload.', 'error');
        }
    });
    
    // Payment Listeners
    currencySwitcher.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        if (target.tagName === 'BUTTON' && target.dataset.currency) {
            currentCurrency = target.dataset.currency as 'usd' | 'inr';
            // Update button styles
            currencySwitcher.querySelector('.active')?.classList.remove('active');
            target.classList.add('active');
            // Update prices on the page
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

    paymentMethodCloseBtn.addEventListener('click', closePaymentMethodModal);
    payWithCardBtn.addEventListener('click', redirectToCheckout);
    payWithCryptoBtn.addEventListener('click', openCryptoModal);
    cryptoPaymentCloseBtn.addEventListener('click', closeCryptoModal);
    
    cryptoTabs.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        if (target.classList.contains('crypto-tab')) {
            switchCryptoTab(target);
        }
    });

    copyAddressBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(cryptoWalletAddress.value).then(() => {
            showNotification("Wallet address copied to clipboard!", "success");
        }, (err) => {
            showNotification("Failed to copy address.", "error");
            console.error('Clipboard copy failed:', err);
        });
    });
    
    confirmCryptoPaymentBtn.addEventListener('click', () => {
        if (selectedPlanForPayment) {
            upgradeUserPlan(selectedPlanForPayment.plan);
            closeCryptoModal();
        }
    });

    // Share Modal Listeners
    shareCloseBtn.addEventListener('click', closeShareModal);
    shareModal.addEventListener('click', (e) => {
        if (e.target === shareModal) closeShareModal();
    });
    shareTabsContainer.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('share-tab')) {
            switchShareTab(target as HTMLButtonElement);
        }
    });
    regenerateCaptionBtn.addEventListener('click', generateSocialCaption);
    createReelBtn.addEventListener('click', handleReelGeneration);
    postToSocialBtn.addEventListener('click', handlePostAction);

    // AI Helper Chat Listeners
    aiHelperFab.addEventListener('click', () => {
        const isOpening = !aiHelperWidget.classList.contains('open');
        aiHelperWidget.classList.toggle('open');
        
        // Add initial greeting if opening for the first time
        if (isOpening && chatMessagesContainer.children.length === 0) {
            appendChatMessage("Hello! How can I help you with GemVision AI today?", 'ai');
        }
    });
    chatCloseBtn.addEventListener('click', () => {
        aiHelperWidget.classList.remove('open');
    });
    chatForm.addEventListener('submit', handleSendMessage);

    // Task Listeners
    createNewTaskBtn.addEventListener('click', () => openTaskModal());
    taskCloseBtn.addEventListener('click', closeTaskModal);
    taskModal.addEventListener('click', (e) => {
        if (e.target === taskModal) closeTaskModal();
    });
    taskForm.addEventListener('submit', handleSaveTask);

    myTasksGrid.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const card = target.closest('.task-card') as HTMLElement;
        if (!card) return;

        const taskId = card.dataset.taskId;
        if (!taskId) return;

        if (target.classList.contains('edit')) {
            const userTasksKey = `gemvision_tasks_${currentUser!.email}`;
            const tasks: Task[] = JSON.parse(localStorage.getItem(userTasksKey) || '[]');
            const taskToEdit = tasks.find(t => t.id === taskId);
            if (taskToEdit) openTaskModal(taskToEdit);
        } else if (target.classList.contains('delete')) {
            handleDeleteTask(taskId);
        }
    });
    
    myTasksGrid.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        if (target.classList.contains('task-status-select')) {
            const card = target.closest('.task-card') as HTMLElement;
            const taskId = card?.dataset.taskId;
            if (taskId) {
                handleTaskStatusChange(taskId, target.value as TaskStatus);
            }
        }
    });
    
    // Link Design Modal Listeners
    linkDesignCloseBtn.addEventListener('click', closeLinkDesignModal);
    linkDesignModal.addEventListener('click', (e) => {
        if (e.target === linkDesignModal) closeLinkDesignModal();
    });
    saveWithoutLinkBtn.addEventListener('click', () => saveAndLinkDesign());
    confirmLinkBtn.addEventListener('click', () => {
        const selectedTaskId = linkTaskSelect.value;
        if (selectedTaskId) {
            saveAndLinkDesign(selectedTaskId);
        } else {
            showNotification("Please select a task to link.", "error");
        }
    });
    createTaskForDesignBtn.addEventListener('click', () => {
        closeLinkDesignModal();
        openTaskModal(); 
        // A more advanced implementation could re-open the link modal after task creation.
        // For now, the user can save the design again to link it.
        showNotification("Create your new task, then you can save and link your design to it.", "success", 6000);
    });



    // --- Initial State ---
    function initializeApp() {
        if (!isLocalStorageAvailable()) {
            showNotification(
                "Account features are disabled. Your browser is blocking local storage, which is required to save your session.",
                'error',
                0
            );
            // Visually disable all auth-related UI
            navActionBtn.style.display = 'none';
            generatorGate.innerHTML = '<h3>Account features are disabled by your browser settings.</h3><p>Please enable cookies/site data to log in or register.</p>';
            gateSignupBtn.disabled = true;
            document.querySelectorAll('.pricing-button').forEach(btn => {
                (btn as HTMLButtonElement).disabled = true;
            });
            return; // Stop initialization of user/payment state
        }
        
        // Initialize Stripe with a public test key from Stripe's documentation.
        stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx003d2a70s0');
    
        const storedUser = localStorage.getItem('gemvision_currentUser');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
        } else {
            currentUser = null;
        }

        handleStripeRedirect(); // Check for payment success/cancel before updating UI
        updateAuthStateUI();
        updateDisplayedPrices(); // Set initial prices based on default currency
        renderShowcaseGallery();
        renderMyCreationsGallery();
        renderMySocialPosts();
        renderMyTasks();
        initializeAiHelper(); // Set up the AI chat agent
        dreamBtn.disabled = true;
        analyzeGemstoneBtn.disabled = true;
    }
    
    initializeApp();
});