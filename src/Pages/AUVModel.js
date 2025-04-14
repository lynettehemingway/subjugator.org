import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

// Main Three.js class to handle the AUV 3D model and interactions
export class AUVModel {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    this.options = {
      modelPath: options.modelPath || '/models/subjugator.glb',
      backgroundColor: options.backgroundColor || 0x050505,
      enablePostProcessing: options.enablePostProcessing !== undefined ? options.enablePostProcessing : true,
      enableBloom: options.enableBloom !== undefined ? options.enableBloom : true,
      enableAutoRotate: options.enableAutoRotate !== undefined ? options.enableAutoRotate : true,
      cameraPosition: options.cameraPosition || { x: 0, y: 0, z: 5 },
      ambientLightIntensity: options.ambientLightIntensity || 0.5,
      directionalLightIntensity: options.directionalLightIntensity || 1.5,
      highlightColor: options.highlightColor || 0xFA4616, // Brand orange color
      accentColor: options.accentColor || 0x4A9FFF, // Brand blue color
    };
    
    // Internal properties
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.model = null;
    this.composer = null;
    this.outlinePass = null;
    this.mixers = [];
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hotspots = [];
    this.hoveredObject = null;
    this.selectedObject = null;
    this.explodedView = false;
    this.originalPositions = new Map();
    this.animationFrameId = null;
    this.onSelectedCallback = null;
    this.loadingManager = new THREE.LoadingManager();
    this.isModelLoaded = false;
    
    // Initialize the 3D scene
    this.init();
  }
  
  // Initialize the scene, camera, renderer, and lighting
  init() {
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initLights();
    this.initControls();
    this.initPostProcessing();
    this.initEventListeners();
    this.loadModel();
    this.animate();
  }
  
  // Initialize the scene
  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.options.backgroundColor);
    
    // Optional: Add a subtle underwater fog effect
    this.scene.fog = new THREE.FogExp2(0x000b14, 0.05);
  }
  
  // Initialize the camera
  initCamera() {
    const container = this.canvas.parentElement;
    const aspectRatio = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
    this.camera.position.set(
      this.options.cameraPosition.x,
      this.options.cameraPosition.y,
      this.options.cameraPosition.z
    );
  }
  
  // Initialize the WebGL renderer
  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    
    const container = this.canvas.parentElement;
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }
  
  // Initialize scene lighting
  initLights() {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0x404040, this.options.ambientLightIntensity);
    this.scene.add(ambientLight);
    
    // Main directional light
    const mainLight = new THREE.DirectionalLight(0xffffff, this.options.directionalLightIntensity);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    this.scene.add(mainLight);
    
    // Blue accent light (matches the accent color)
    const blueLight = new THREE.PointLight(this.options.accentColor, 1.5, 10);
    blueLight.position.set(-3, 2, 3);
    this.scene.add(blueLight);
    
    // Orange accent light (matches the highlight color)
    const orangeLight = new THREE.PointLight(this.options.highlightColor, 1.5, 10);
    orangeLight.position.set(3, -2, -3);
    this.scene.add(orangeLight);
    
    // Subtle underwater caustics effect (simulated with a spot light)
    const causticLight = new THREE.SpotLight(0x4a9fff, 0.5);
    causticLight.position.set(0, 5, 0);
    causticLight.angle = Math.PI / 4;
    causticLight.penumbra = 0.8;
    this.scene.add(causticLight);
  }
  
  // Initialize orbit controls for user interaction
  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.enablePan = true;
    this.controls.autoRotate = this.options.enableAutoRotate;
    this.controls.autoRotateSpeed = 0.5;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 15;
  }
  
  // Initialize post-processing effects
  initPostProcessing() {
    if (!this.options.enablePostProcessing) return;
    
    const container = this.canvas.parentElement;
    this.composer = new EffectComposer(this.renderer);
    
    // Standard render pass
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    
    // Outline pass for highlighting selected components
    this.outlinePass = new OutlinePass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      this.scene,
      this.camera
    );
    this.outlinePass.edgeStrength = 3;
    this.outlinePass.edgeGlow = 1;
    this.outlinePass.edgeThickness = 1;
    this.outlinePass.pulsePeriod = 0;
    this.outlinePass.visibleEdgeColor.set(this.options.highlightColor);
    this.outlinePass.hiddenEdgeColor.set(0x190a05);
    this.composer.addPass(this.outlinePass);
    
    // Bloom pass for glow effects
    if (this.options.enableBloom) {
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(container.clientWidth, container.clientHeight),
        0.5, // Strength
        0.4, // Radius
        0.85 // Threshold
      );
      this.composer.addPass(bloomPass);
    }
  }
  
  // Initialize event listeners for user interaction
  initEventListeners() {
    // Mouse move for hover effects
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    
    // Click for selection
    this.canvas.addEventListener('click', this.onClick.bind(this));
    
    // Window resize for responsive design
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }
  
  // Handle mouse move events for hover effects
  onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Perform raycasting to find intersected objects
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Only check for intersections once the model is loaded
    if (this.model) {
      const intersects = this.raycaster.intersectObject(this.model, true);
      
      // Handle hover effects
      if (intersects.length > 0) {
        // Get the top-level parent of the intersected object
        const selectedObject = this.findTopLevelParent(intersects[0].object);
        
        if (selectedObject !== this.hoveredObject) {
          // Remove highlight from previously hovered object
          if (this.hoveredObject && this.hoveredObject !== this.selectedObject) {
            this.highlightObject(this.hoveredObject, false);
          }
          
          // Add highlight to newly hovered object (if not already selected)
          if (selectedObject && selectedObject !== this.selectedObject) {
            this.highlightObject(selectedObject, true);
            this.canvas.style.cursor = 'pointer';
          } else {
            this.canvas.style.cursor = 'default';
          }
          
          this.hoveredObject = selectedObject;
        }
      } else {
        // Remove highlight when not hovering any object
        if (this.hoveredObject && this.hoveredObject !== this.selectedObject) {
          this.highlightObject(this.hoveredObject, false);
        }
        
        this.hoveredObject = null;
        this.canvas.style.cursor = 'default';
      }
    }
  }
  
  // Handle click events for selection
  onClick(event) {
    // Disable auto-rotation when user interacts with the model
    if (this.controls.autoRotate) {
      this.controls.autoRotate = false;
      
      // Resume auto-rotation after a period of inactivity
      clearTimeout(this.rotationTimeout);
      this.rotationTimeout = setTimeout(() => {
        this.controls.autoRotate = this.options.enableAutoRotate;
      }, 5000);
    }
    
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Perform raycasting to find intersected objects
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Only check for intersections once the model is loaded
    if (this.model) {
      const intersects = this.raycaster.intersectObject(this.model, true);
      
      if (intersects.length > 0) {
        // Get the top-level parent of the intersected object
        const selectedObject = this.findTopLevelParent(intersects[0].object);
        
        // If clicking the already selected object, deselect it
        if (this.selectedObject === selectedObject) {
          this.selectObject(null);
        } else {
          // Otherwise, select the new object
          this.selectObject(selectedObject);
        }
      } else {
        // Clicking empty space deselects the currently selected object
        this.selectObject(null);
      }
    }
  }
  
  // Handle window resize events
  onWindowResize() {
    const container = this.canvas.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
    
    if (this.composer) {
      this.composer.setSize(width, height);
    }
  }
  
  // Load the 3D model
  loadModel() {
    // Setup loading manager callbacks
    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = (itemsLoaded / itemsTotal) * 100;
      if (this.onProgressCallback) {
        this.onProgressCallback(progress);
      }
    };
    
    this.loadingManager.onLoad = () => {
      this.isModelLoaded = true;
      if (this.onLoadedCallback) {
        this.onLoadedCallback();
      }
    };
    
    this.loadingManager.onError = (url) => {
      console.error('Error loading model:', url);
      if (this.onErrorCallback) {
        this.onErrorCallback(`Failed to load model from ${url}`);
      }
    };
    
    // Create GLTFLoader with the loading manager
    const loader = new GLTFLoader(this.loadingManager);
    
    // Load the model
    loader.load(
      this.options.modelPath,
      (gltf) => {
        this.model = gltf.scene;
        this.scene.add(this.model);
        
        // Prepare model (center, scale, animations)
        this.prepareModel();
        
        // Setup animations if available
        if (gltf.animations && gltf.animations.length) {
          const mixer = new THREE.AnimationMixer(this.model);
          this.mixers.push(mixer);
          
          gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
          });
        }
        
        // Store original positions for exploded view
        this.storeOriginalPositions();
      },
      // Progress callback
      (xhr) => {
        const progress = (xhr.loaded / xhr.total) * 100;
        if (this.onProgressCallback) {
          this.onProgressCallback(progress);
        }
      },
      // Error callback
      (error) => {
        console.error('Error loading model:', error);
        if (this.onErrorCallback) {
          this.onErrorCallback(error.message);
        }
      }
    );
  }
  
  // Prepare the model after loading (center, scale, materials, etc.)
  prepareModel() {
    if (!this.model) return;
    
    // Center the model
    const box = new THREE.Box3().setFromObject(this.model);
    const center = box.getCenter(new THREE.Vector3());
    this.model.position.x = -center.x;
    this.model.position.y = -center.y;
    this.model.position.z = -center.z;
    
    // Scale the model if needed
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 5) {
      const scale = 5 / maxDim;
      this.model.scale.set(scale, scale, scale);
    }
    
    // Adjust materials and setup component groups
    this.model.traverse((child) => {
      if (child.isMesh) {
        // Enable shadows
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Enhance materials
        if (child.material) {
          // Make sure materials are properly displayed
          child.material.needsUpdate = true;
          
          // Apply environment maps or enhance existing materials
          if (child.material.name.includes('metal') || child.material.metalness > 0.5) {
            child.material.envMapIntensity = 1.5;
          }
        }
      }
    });
    
    // Define hotspots based on the model structure
    this.defineHotspots();
  }
  
  // Store original positions of model components for exploded view
  storeOriginalPositions() {
    if (!this.model) return;
    
    this.model.traverse((child) => {
      if (child.isMesh || child.isGroup) {
        // Store the original world position
        const worldPosition = new THREE.Vector3();
        child.getWorldPosition(worldPosition);
        this.originalPositions.set(child.uuid, {
          position: worldPosition.clone(),
          localPosition: child.position.clone()
        });
      }
    });
  }
  
  // Define interactive hotspots on the model
  defineHotspots() {
    // This method would typically identify key components of the model
    // based on their names or structure, and set them up for interaction
    
    // Example: Find components by name pattern
    if (!this.model) return;
    
    const components = [];
    
    this.model.traverse((child) => {
      // Check for naming patterns that might indicate key components
      if (child.name.includes('thruster') || child.name.includes('Thruster')) {
        components.push({
          object: child,
          id: 'thrusters',
          name: 'Thruster System',
          description: 'Eight-thruster configuration provides redundant six degrees of freedom control.',
          category: 'mechanical'
        });
      } else if (child.name.includes('camera') || child.name.includes('Camera') || child.name.includes('vision')) {
        components.push({
          object: child,
          id: 'camera',
          name: 'Vision System',
          description: 'Computer vision system using advanced neural networks for object detection.',
          category: 'software'
        });
      } else if (child.name.includes('hull') || child.name.includes('Hull') || child.name.includes('body')) {
        components.push({
          object: child,
          id: 'hull',
          name: 'Main Hull',
          description: 'Houses the main computer, power distribution, and electronic systems.',
          category: 'mechanical'
        });
      } else if (child.name.includes('torpedo') || child.name.includes('Torpedo')) {
        components.push({
          object: child,
          id: 'torpedos',
          name: 'Torpedo System',
          description: 'Dual servo-actuated torpedo launchers with rack and pinion mechanisms.',
          category: 'mechanical'
        });
      } else if (child.name.includes('gripper') || child.name.includes('Gripper')) {
        components.push({
          object: child,
          id: 'gripper',
          name: 'Gripper',
          description: 'Servo-actuated gripper with serrated aluminum jaws for manipulating objects.',
          category: 'mechanical'
        });
      } else if (child.name.includes('hydrophone') || child.name.includes('Hydrophone')) {
        components.push({
          object: child,
          id: 'hydrophones',
          name: 'Hydrophone Array',
          description: 'Passive sonar system for acoustic localization and tracking.',
          category: 'electrical'
        });
      } else if (child.name.includes('battery') || child.name.includes('Battery')) {
        components.push({
          object: child,
          id: 'battery',
          name: 'Battery System',
          description: 'Power supply with battery monitoring for optimal performance.',
          category: 'electrical'
        });
      } else if (child.name.includes('computer') || child.name.includes('Computer') || child.name.includes('CPU')) {
        components.push({
          object: child,
          id: 'computer',
          name: 'Main Computer',
          description: 'Central processing unit running ROS-based software architecture.',
          category: 'electrical'
        });
      }
    });
    
    // Filter out duplicate components (by ID)
    const uniqueComponents = [];
    const ids = new Set();
    
    components.forEach(component => {
      if (!ids.has(component.id)) {
        ids.add(component.id);
        uniqueComponents.push(component);
      }
    });
    
    this.hotspots = uniqueComponents;
  }
  
  // Toggle between normal and exploded view
  toggleExplodedView() {
    this.explodedView = !this.explodedView;
    
    if (!this.model) return;
    
    if (this.explodedView) {
      // Create exploded view by moving components outward from center
      this.model.traverse((child) => {
        if ((child.isMesh || child.isGroup) && child !== this.model) {
          const originalData = this.originalPositions.get(child.uuid);
          
          if (originalData) {
            const direction = originalData.position.clone().sub(new THREE.Vector3(0, 0, 0)).normalize();
            
            // Store the current position before exploding
            child.userData.preExplodedPosition = child.position.clone();
            
            // Move the object outward along the direction from center
            const explodeDistance = 1.5; // Adjust as needed
            child.position.add(direction.multiplyScalar(explodeDistance));
          }
        }
      });
    } else {
      // Restore original positions
      this.model.traverse((child) => {
        if ((child.isMesh || child.isGroup) && child !== this.model) {
          if (child.userData.preExplodedPosition) {
            child.position.copy(child.userData.preExplodedPosition);
          } else {
            const originalData = this.originalPositions.get(child.uuid);
            if (originalData) {
              child.position.copy(originalData.localPosition);
            }
          }
        }
      });
    }
  }
  
  // Highlight or unhighlight an object
  highlightObject(object, highlight) {
    if (!object) return;
    
    // If using the outline pass
    if (this.outlinePass) {
      if (highlight) {
        this.outlinePass.selectedObjects = [object];
      } else if (this.outlinePass.selectedObjects.includes(object)) {
        this.outlinePass.selectedObjects = 
          this.outlinePass.selectedObjects.filter(obj => obj !== object);
      }
    } else {
      // Alternative: Modify the material directly
      object.traverse((child) => {
        if (child.isMesh && child.material) {
          if (highlight) {
            if (!child.userData.originalEmissive) {
              child.userData.originalEmissive = child.material.emissive.clone();
            }
            child.material.emissive.set(0x333333);
          } else if (child.userData.originalEmissive) {
            child.material.emissive.copy(child.userData.originalEmissive);
          }
        }
      });
    }
  }
  
  // Select an object and trigger callback
  selectObject(object) {
    // Remove highlight from previously selected object
    if (this.selectedObject) {
      this.highlightObject(this.selectedObject, false);
    }
    
    this.selectedObject = object;
    
    // Add highlight to newly selected object
    if (object) {
      this.highlightObject(object, true);
      
      // Find hotspot data for the selected object
      const hotspot = this.findHotspotForObject(object);
      
      // Call the selection callback
      if (this.onSelectedCallback && hotspot) {
        this.onSelectedCallback(hotspot);
      }
      
      // Move camera to focus on the selected component
      this.focusOnObject(object);
    } else {
      // Call the selection callback with null
      if (this.onSelectedCallback) {
        this.onSelectedCallback(null);
      }
      
      // Reset camera position
      this.resetCameraPosition();
    }
  }
  
  // Find the top-level parent of an object
  findTopLevelParent(object) {
    // Find the relevant parent object based on the hierarchy
    let current = object;
    
    // Check if the object or any parent is a hotspot
    while (current && current !== this.model) {
      // Check if this object is part of a defined hotspot
      const hotspot = this.findHotspotForObject(current);
      if (hotspot) {
        return hotspot.object;
      }
      
      // Move up to the parent
      if (current.parent) {
        current = current.parent;
      } else {
        break;
      }
    }
    
    // If no suitable parent found, return the original object
    return object;
  }
  
  // Find hotspot data for a given object
  findHotspotForObject(object) {
    // Check if the object is a hotspot or part of a hotspot
    for (const hotspot of this.hotspots) {
      if (hotspot.object === object || object.isDescendantOf(hotspot.object)) {
        return hotspot;
      }
    }
    return null;
  }
  
  // Focus camera on a specific object
  focusOnObject(object) {
    if (!object || !this.controls) return;
    
    // Get the object's world position
    const worldPosition = new THREE.Vector3();
    object.getWorldPosition(worldPosition);
    
    // Calculate a suitable position for the camera
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const distance = Math.max(size.x, size.y, size.z) * 3;
    
    // Animate camera movement
    const startPosition = this.camera.position.clone();
    const endPosition = worldPosition.clone().add(new THREE.Vector3(distance, distance, distance));
    const startTarget = this.controls.target.clone();
    const endTarget = worldPosition.clone();
    
    // Simple animation loop
    const duration = 1000; // ms
    const startTime = Date.now();
    
    const animateCamera = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease function: ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      
      // Interpolate camera position and target
      this.camera.position.lerpVectors(startPosition, endPosition, ease);
      this.controls.target.lerpVectors(startTarget, endTarget, ease);
      this.controls.update();
      
      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      }
    };
    
    animateCamera();
  }
  
  // Reset camera to default position
  resetCameraPosition() {
    if (!this.controls) return;
    
    // Animate back to the original position
    const startPosition = this.camera.position.clone();
    const endPosition = new THREE.Vector3(
      this.options.cameraPosition.x,
      this.options.cameraPosition.y,
      this.options.cameraPosition.z
    );
    const startTarget = this.controls.target.clone();
    const endTarget = new THREE.Vector3(0, 0, 0);
    
    // Simple animation loop
    const duration = 1000; // ms
    const startTime = Date.now();
    
    const animateCamera = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease function: ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      
      // Interpolate camera position and target
      this.camera.position.lerpVectors(startPosition, endPosition, ease);
      this.controls.target.lerpVectors(startTarget, endTarget, ease);
      this.controls.update();
      
      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      } else {
        // Enable auto-rotation after camera reset if that option is enabled
        this.controls.autoRotate = this.options.enableAutoRotate;
      }
    };
    
    animateCamera();
  }
  
  // Animation loop
  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    
    const delta = this.clock.getDelta();
    
    // Update animations
    this.mixers.forEach((mixer) => {
      mixer.update(delta);
    });
    
    // Update controls
    if (this.controls) {
      this.controls.update();
    }
    
    // Render the scene
    if (this.composer && this.options.enablePostProcessing) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }
  
  // Register callback for model selection
  onSelected(callback) {
    this.onSelectedCallback = callback;
  }
  
  // Register callback for model loading progress
  onProgress(callback) {
    this.onProgressCallback = callback;
  }
  
  // Register callback for model loading completion
  onLoaded(callback) {
    this.onLoadedCallback = callback;
    
    // If model is already loaded, call the callback immediately
    if (this.isModelLoaded) {
      callback();
    }
  }
  
  // Register callback for errors
  onError(callback) {
    this.onErrorCallback = callback;
  }
  
  // Clean up resources
  dispose() {
    // Stop animation loop
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    // Remove event listeners
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('click', this.onClick);
    window.removeEventListener('resize', this.onWindowResize);
    
    // Dispose of Three.js resources
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    if (this.composer) {
      this.composer.dispose();
    }
    
    if (this.controls) {
      this.controls.dispose();
    }
    
    // Clear references
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.model = null;
    this.composer = null;
    this.outlinePass = null;
    this.mixers = [];
    this.hotspots = [];
    this.originalPositions.clear();
  }
}

// Helper method for checking if object is descendant of another
THREE.Object3D.prototype.isDescendantOf = function(ancestor) {
  let parent = this.parent;
  while (parent) {
    if (parent === ancestor) return true;
    parent = parent.parent;
  }
  return false;
};