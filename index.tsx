/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenAI, Type } from "@google/genai";
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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
    const registerView = document.getElementById('register-view') as HTMLDivElement;
    const showRegisterViewLink = document.getElementById('show-register-view') as HTMLAnchorElement;
    const showLoginViewLink = document.getElementById('show-login-view') as HTMLAnchorElement;
    const loginForm = document.getElementById('login-form') as HTMLFormElement;
    const registerForm = document.getElementById('register-form') as HTMLFormElement;
    const loginEmailInput = document.getElementById('login-email') as HTMLInputElement;
    const loginPasswordInput = document.getElementById('login-password') as HTMLInputElement;
    const registerEmailInput = document.getElementById('register-email') as HTMLInputElement;
    const registerPasswordInput = document.getElementById('register-password') as HTMLInputElement;
    const registerConfirmPasswordInput = document.getElementById('register-confirm-password') as HTMLInputElement;

    // Profile Modal Elements
    const profileModal = document.getElementById('profile-modal') as HTMLDivElement;
    const profileCloseBtn = document.getElementById('profile-close-btn') as HTMLButtonElement;
    const profileView = document.getElementById('profile-view') as HTMLDivElement;
    const profileEditView = document.getElementById('profile-edit-view') as HTMLDivElement;
    const profileEmail = document.getElementById('profile-email') as HTMLParagraphElement;
    const profileAttempts = document.getElementById('profile-attempts') as HTMLParagraphElement;
    const editProfileBtn = document.getElementById('edit-profile-btn') as HTMLButtonElement;
    const profileEditForm = document.getElementById('profile-edit-form') as HTMLFormElement;
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
    let currentUser: { email: string; attemptsLeft: number; plan: 'free' | 'pro' | 'elite' | 'admin' } | null = null;
    const ADMIN_EMAIL = 'admin@gemvision.ai';


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
            // Conditions for the button to be DISABLED
            const outOfAttempts = currentUser.attemptsLeft <= 0;
            const missingInputs = !uploadedFile || !designPromptInput.value.trim();

            generateBtn.disabled = outOfAttempts || missingInputs;

            // Update tooltip based on the reason it's disabled or enabled
            if (outOfAttempts) {
                generateBtn.dataset.tooltip = "You've used all your free attempts. Please upgrade to a Pro plan to continue generating.";
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
                <img src="${imageUrl}" alt="${design.name}">
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
                    <button class="save-design-btn">Save to My Creations</button>
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
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            cameraStream.srcObject = stream;
            cameraModal.style.display = 'flex';
        } catch (err) {
            console.error("Error accessing camera: ", err);
            showNotification("Could not access camera. Please grant permission.");
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

            const length = gemLengthInput.value;
            const breadth = gemBreadthInput.value;
            const depth = gemDepthInput.value;
            const dimensionsProvided = length && breadth && depth;

            const prompt = `
                You are a professional gemologist AI. Analyze the provided gemstone image and user-provided information.

                **User Input:**
                - Dimensions (L x B x D in mm): ${dimensionsProvided ? `${length} x ${breadth} x ${depth}`: 'Not provided. Analysis is based on the image only.'}

                **Your Task:**
                1.  **Identification:** Provide a single line at the very top with the identified gemstone and its estimated carat weight. Format it EXACTLY like this: \`Identification: [Gemstone Type and Cut], [Estimated Carat Weight]\`. For example: \`Identification: Vibrant red ruby, oval cut, approximately 2 carats\`.
                2.  **Cut Quality Analysis:** Based on the image, analyze the cut quality. Specifically comment on:
                    - **Symmetry and Proportions:** How well-balanced is the cut from what you can see?
                    - **Windows and Extinction:** Are there visible "windows" (transparent, washed-out areas) or significant "extinction" (dark areas from light leakage)?
                3.  **Proportion Assessment ${dimensionsProvided ? '(Based on provided dimensions)' : '(Dimensions not provided)'}:**
                    ${dimensionsProvided ?
                    `- Analyze the provided dimensions. Calculate the depth-to-width (depth/breadth) percentage. Provide an opinion on whether it's well-proportioned. A good range for many cuts is 60-80% of the width. State if the stone seems too shallow (risk of windowing) or too deep (loses sparkle).`
                    : '- To get a proportion assessment, please provide the length, breadth, and depth dimensions.'
                    }
                4.  **Price Estimation:**
                    - Use your web search capabilities to find the current market price for a similar polished gemstone.
                    - Provide an estimated price range (e.g., $500 - $700 per carat).
                    - State that this is an estimate and prices vary based on many factors not visible in a photo.

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
        
        if (currentUser.attemptsLeft <= 0) {
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
            
            // Decrement and save attempts
            currentUser.attemptsLeft--;
            saveCurrentUserState();
            updateAuthStateUI();


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
     * Opens the image zoom modal with the specified image source.
     * @param src The source URL of the image to display.
     */
    function openImageZoom(src: string) {
        zoomedImage.src = src;
        // Reset analysis content
        zoomAnalysisResult.textContent = "Click 'Analyze Gem' to learn more about this stone.";
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
     * Analyzes the currently zoomed-in image using AI.
     */
    async function analyzeZoomedImage() {
        const imageSrc = zoomedImage.src;
        if (!imageSrc || imageSrc.startsWith('#')) {
            showNotification("No image to analyze.");
            return;
        }

        analyzeGemBtn.disabled = true;
        analyzeGemBtn.textContent = 'Analyzing...';
        zoomAnalysisResult.textContent = 'The AI is inspecting the gemstone...';

        try {
            // Convert data URL to the format needed by the API
            const parts = imageSrc.split(',');
            const mimeType = parts[0].match(/:(.*?);/)?.[1];
            const base64Data = parts[1];

            if (!mimeType || !base64Data) {
                throw new Error("Could not parse image data.");
            }

            const imagePart = {
                inlineData: { mimeType, data: base64Data },
            };
            const prompt = `Identify the gemstone in this image. Provide a detailed analysis, including its likely type, cut, color, clarity, and any other visible characteristics like inclusions or unique features. Format the response as a paragraph.`;

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
     * Handles saving a generated design to the user's personal gallery.
     * @param button The save button element that was clicked.
     */
    function handleSaveDesign(button: HTMLElement) {
        if (!currentUser) {
            showNotification("Please log in to save your creations.", "error");
            openAuthModal('login');
            return;
        }

        const card = button.closest('.design-card') as HTMLElement;
        if (!card) return;

        const design: Design = JSON.parse(card.dataset.design || '{}');
        const designImageUrl = card.dataset.imageUrl || '';

        if (!uploadedFile || !designImageUrl) {
            showNotification("Could not save design. Missing image data.", "error");
            return;
        }

        const gemstoneImageUrl = `data:${uploadedFile.mimeType};base64,${uploadedFile.base64}`;

        const newItem: ShowcaseItem = {
            id: `item-${Date.now()}-${Math.random()}`,
            gemstoneImage: gemstoneImageUrl,
            designImage: designImageUrl,
            name: design.name,
            description: design.description,
            metals: design.metals,
            blueprint: design.blueprint,
            imagePrompt: design.imagePrompt,
        };

        try {
            const userCreationsKey = `gemvision_creations_${currentUser.email}`;
            let myCreations: ShowcaseItem[] = JSON.parse(localStorage.getItem(userCreationsKey) || '[]');
            myCreations.unshift(newItem); // Add to the beginning
            localStorage.setItem(userCreationsKey, JSON.stringify(myCreations));

            showNotification("Design saved to My Creations!", "success");
            renderMyCreationsGallery();

            // Disable button to prevent duplicates
            button.textContent = 'Saved!';
            (button as HTMLButtonElement).disabled = true;

        } catch (error) {
            console.error("Error saving design:", error);
            showNotification("An error occurred while saving the design.", "error");
        }
    }


    // --- Auth, Profile & Admin Functions ---

    function openAuthModal(view: 'login' | 'register' = 'login') {
        if (view === 'login') {
            loginView.style.display = 'block';
            registerView.style.display = 'none';
        } else {
            loginView.style.display = 'none';
            registerView.style.display = 'block';
        }
        authModal.style.display = 'flex';
    }

    function closeAuthModal() {
        authModal.style.display = 'none';
    }

    function openProfileModal() {
        if (!currentUser) return;
        // Populate profile data
        profileEmail.textContent = currentUser.email;
        profileAttempts.textContent = currentUser.attemptsLeft.toString();
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
        if (currentUser) {
            navActionBtn.textContent = 'My Profile';
            generatorGate.classList.add('hidden');
            attemptsCounter.textContent = `You have ${currentUser.attemptsLeft} free attempts remaining.`;
            attemptsCounter.style.display = 'block';
            adminPanel.style.display = isAdmin ? 'block' : 'none';
        } else {
            navActionBtn.textContent = 'Login / Register';
            generatorGate.classList.remove('hidden');
            attemptsCounter.style.display = 'none';
            adminPanel.style.display = 'none';
        }
        updateGenerateButtonState();
    }
    
    function saveCurrentUserState() {
        if (currentUser) {
            localStorage.setItem('gemvision_currentUser', JSON.stringify(currentUser));
             // Also update the master user list in case attempts changed
            const users = JSON.parse(localStorage.getItem('gemvision_users') || '{}');
            const userData = users[currentUser.email];
            if (userData) {
                users[currentUser.email] = {...userData, attemptsLeft: currentUser.attemptsLeft};
                localStorage.setItem('gemvision_users', JSON.stringify(users));
            }
        } else {
            localStorage.removeItem('gemvision_currentUser');
        }
    }
    
    function handleLogout() {
        currentUser = null;
        saveCurrentUserState();
        updateAuthStateUI();
        closeProfileModal();
        // Clear and hide the user's creations gallery
        myCreationsGrid.innerHTML = '';
        myCreationsSection.style.display = 'none';
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
                    <img src="${item.gemstoneImage}" alt="Loose Gemstone">
                    <img src="${item.designImage}" alt="${item.name}">
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
            myCreationsGrid.innerHTML = `<p class="empty-gallery-message">You haven't saved any creations yet. Generate designs and click 'Save to My Creations' to start your collection!</p>`;
            return;
        }

        creations.forEach(item => {
            const card = document.createElement('div');
            card.className = 'showcase-card';
            card.innerHTML = `
                <div class="showcase-card-images">
                    <img src="${item.gemstoneImage}" alt="Loose Gemstone">
                    <img src="${item.designImage}" alt="${item.name}">
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
                handleSaveDesign(target);
                return; // Prioritize save action
            }
        
             // Handle Image Zoom on any image inside the cards
            if (target.tagName === 'IMG') {
                openImageZoom((target as HTMLImageElement).src);
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
        openAuthModal('login');
    });
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = registerEmailInput.value;
        const password = registerPasswordInput.value;
        const confirmPassword = registerConfirmPasswordInput.value;
        
        if (password !== confirmPassword) {
            showNotification("Passwords do not match.", "error");
            return;
        }

        const users = JSON.parse(localStorage.getItem('gemvision_users') || '{}');
        if (users[email] || email === ADMIN_EMAIL) {
            showNotification("An account with this email already exists.", "error");
            return;
        }

        const hashedPassword = await hashPassword(password);
        users[email] = { password: hashedPassword, attemptsLeft: 3, plan: 'free' };
        localStorage.setItem('gemvision_users', JSON.stringify(users));

        currentUser = { email: email, attemptsLeft: 3, plan: 'free' };
        saveCurrentUserState();
        updateAuthStateUI();
        renderMyCreationsGallery(); // Render empty gallery on new account
        closeAuthModal();
        showNotification("Account created successfully! You can now start designing.", "success");
    });
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        // Special Admin Login
        if (email === ADMIN_EMAIL && password === 'admin123') {
            currentUser = { email: ADMIN_EMAIL, attemptsLeft: 999, plan: 'admin' }; // Admin has many attempts
            saveCurrentUserState();
            updateAuthStateUI();
            closeAuthModal();
            showNotification('Welcome, Administrator!', 'success');
            renderMyCreationsGallery(); // Also render for admin
            return;
        }

        const users = JSON.parse(localStorage.getItem('gemvision_users') || '{}');
        const userData = users[email];
        const enteredPasswordHash = await hashPassword(password);

        if (userData && userData.password === enteredPasswordHash) {
             currentUser = { email: email, attemptsLeft: userData.attemptsLeft, plan: userData.plan || 'free' };
             saveCurrentUserState();
             updateAuthStateUI();
             renderMyCreationsGallery();
             closeAuthModal();
             showNotification(`Welcome back, ${email}!`, 'success');
        } else {
             showNotification("Invalid email or password.", "error");
        }
    });

    // Profile Modal Listeners
    profileCloseBtn.addEventListener('click', closeProfileModal);
    profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) {
            closeProfileModal();
        }
    });
    profileLogoutBtn.addEventListener('click', handleLogout);

    editProfileBtn.addEventListener('click', () => {
        profileView.style.display = 'none';
        profileEditView.style.display = 'block';
    });
    
    profileEditForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // In a real app, you would handle password changes, etc.
        // For now, we just acknowledge the save.
        // The email (the key) cannot be changed in this simple simulation.
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
            document.querySelectorAll('.pricing-button[data-plan="free"]').forEach(btn => {
                (btn as HTMLButtonElement).disabled = true;
            });
            return; // Stop initialization of user state
        }
    
        const storedUser = localStorage.getItem('gemvision_currentUser');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
        } else {
            currentUser = null;
        }
        updateAuthStateUI();
        renderShowcaseGallery();
        renderMyCreationsGallery();
        dreamBtn.disabled = true;
        analyzeGemstoneBtn.disabled = true;
    }
    
    initializeApp();
});