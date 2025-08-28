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
    const designPromptInput = document.getElementById('design-prompt') as HTMLTextAreaElement;
    const generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
    const dreamBtn = document.getElementById('dream-btn') as HTMLButtonElement;
    const smartDetailsBtn = document.getElementById('smart-details-btn') as HTMLButtonElement;
    const galleryContent = document.getElementById('gallery-content') as HTMLDivElement;
    const loadingOverlay = document.getElementById('loading-overlay') as HTMLDivElement;
    const loadingText = document.getElementById('loading-text') as HTMLParagraphElement;
    const fileNameSpan = document.getElementById('file-name') as HTMLSpanElement;
    const imagePreviewContainer = document.getElementById('image-preview-container') as HTMLDivElement;
    const imagePreview = document.getElementById('image-preview') as HTMLImageElement;
    const removeImageBtn = document.getElementById('remove-image-btn') as HTMLButtonElement;
    const resultsGallery = document.getElementById('results-gallery') as HTMLElement;
    const notificationContainer = document.getElementById('notification-container') as HTMLDivElement;

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

    // --- Functions ---
    
    /**
     * Shows a toast notification.
     * @param message The message to display.
     * @param type The type of notification ('error', 'success').
     */
    function showNotification(message: string, type: 'error' | 'success' = 'error') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        notificationContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '1';
        }, 10);


        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 5000);
    }

    /**
     * Updates the state of the generate button based on input.
     */
    function updateGenerateButtonState() {
        generateBtn.disabled = !uploadedFile || !designPromptInput.value.trim();
    }

    /**
     * Handles file selection, converting the image to base64 and showing a preview.
     * @param file The file selected by the user.
     */
    function handleFile(file: File) {
        if (!file.type.startsWith('image/')) {
            showNotification('Please select an image file.');
            return;
        }

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
            smartDetailsBtn.disabled = false;
            updateGenerateButtonState();
        };
        reader.readAsDataURL(file);
    }

    /**
     * Resets the file input and preview.
     */
    function resetFileInput() {
        uploadedFile = null;
        fileUpload.value = '';
        imagePreviewContainer.style.display = 'none';
        imagePreview.src = '#';
        fileNameSpan.textContent = 'Upload Gemstone Photo';
        dreamBtn.disabled = true;
        smartDetailsBtn.disabled = true;
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
     * Asks the AI to analyze the gemstone image and return details.
     */
    async function getSmartDetails() {
        if (!uploadedFile) {
            showNotification("Please upload a gemstone image first.");
            return;
        }

        const originalButtonText = smartDetailsBtn.innerHTML;
        smartDetailsBtn.disabled = true;
        smartDetailsBtn.innerHTML = 'Analyzing...';

        try {
            const imagePart = {
                inlineData: {
                    mimeType: uploadedFile.mimeType,
                    data: uploadedFile.base64,
                },
            };
            const prompt = `Analyze the provided image of a gemstone. Identify its key visual characteristics (like primary color and shape/cut) and estimate its carat weight.`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: { parts: [imagePart, { text: prompt }] },
                 config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            gemstoneDetails: { 
                                type: Type.STRING,
                                description: "A description of the gem's type, color, and cut. e.g. 'Vibrant red ruby, oval cut'."
                            },
                            caratWeight: { 
                                type: Type.STRING,
                                description: "An estimated weight in carats. e.g. 'approximately 2 carats'."
                            }
                        }
                    }
                }
            });
            
            const result = JSON.parse(response.text.trim());
            gemTypeInput.value = result.gemstoneDetails || '';
            gemWeightInput.value = result.caratWeight || '';

        } catch (error) {
            console.error("Error getting smart details:", error);
            showNotification("The AI couldn't analyze the gem. Please try again or enter details manually.");
        } finally {
            smartDetailsBtn.disabled = false;
            smartDetailsBtn.innerHTML = originalButtonText;
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
        if (generateBtn.disabled || !uploadedFile) return;

        toggleLoading(true);
        
        // Clear previous non-example results
        document.querySelectorAll('.design-card:not(.example)').forEach(card => card.remove());

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

        } catch (error) {
            console.error("Error generating designs:", error);
            showNotification("An error occurred. Please try a different prompt or image.");
        } finally {
            toggleLoading(false);
             // Scroll after loading is confirmed to be off
            setTimeout(() => {
                resultsGallery.scrollIntoView({ behavior: 'smooth' });
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
    smartDetailsBtn.addEventListener('click', getSmartDetails);


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
                    handleFile(file);
                }
            }, 'image/jpeg');
        }
        stopCamera();
    });

    // Gallery Listeners (using event delegation for zoom and 3D toggle)
    galleryContent.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;

        // Handle 3D View Toggle
        if (target.classList.contains('view-toggle-btn')) {
            const card = target.closest('.design-card') as HTMLElement;
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
            return; // Stop further processing
        }
        
        // Handle Image Zoom
        if (target.tagName === 'IMG' && target.closest('.design-card')) {
            openImageZoom((target as HTMLImageElement).src);
        }
    });

    zoomCloseBtn.addEventListener('click', closeImageZoom);
    imageZoomModal.addEventListener('click', (e) => {
        // Close if the click is on the modal background, not the content wrapper
        if (e.target === imageZoomModal) {
            closeImageZoom();
        }
    });
    analyzeGemBtn.addEventListener('click', analyzeZoomedImage);


    // --- Initial State ---
    dreamBtn.disabled = true;
    smartDetailsBtn.disabled = true;
    updateGenerateButtonState();
});