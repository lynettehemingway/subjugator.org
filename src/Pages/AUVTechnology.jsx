import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCogs,
  FaBolt,
  FaLaptopCode,
  FaInfoCircle,
  FaArrowsAlt,
  FaExpand,
} from "react-icons/fa";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import "../styles/AUVTechnology.css";

// Helper component for hotspots that appear on the 3D model
const Hotspot = ({ id, title, isActive, onClick }) => {
  return (
    <div
      className={`model-hotspot ${isActive ? "active" : ""}`}
      data-id={id}
      onClick={onClick}
    >
      <div className="hotspot-icon">
        <FaInfoCircle />
      </div>
      <div className="hotspot-label">{title}</div>
    </div>
  );
};

// Helper component for technical specifications
const SpecCard = ({ icon, title, description, list }) => {
  return (
    <div className="spec-card">
      <div className="spec-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {list && (
        <ul className="spec-list">
          {list.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

function AUVTechnology() {
  // Refs for DOM elements and Three.js objects
  const canvasContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(null);
  const animationFrameRef = useRef(null);

  // State for UI and interactions
  const [activeSection, setActiveSection] = useState("overview");
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("complete"); // complete or exploded
  const [infoVisible, setInfoVisible] = useState(true);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // Define hotspots to display on the model
  const hotspots = [
    {
      id: "thrusters",
      title: "Thrusters",
      position: { x: 0.3, y: 0.1, z: 0.2 },
    },
    {
      id: "camera",
      title: "Vision System",
      position: { x: -0.2, y: 0.15, z: 0.3 },
    },
    { id: "mainHull", title: "Main Hull", position: { x: 0, y: 0, z: 0 } },
    {
      id: "torpedos",
      title: "Torpedo System",
      position: { x: 0.4, y: 0, z: -0.2 },
    },
    {
      id: "gripper",
      title: "Gripper",
      position: { x: -0.35, y: -0.1, z: 0.15 },
    },
  ];

  // Function to update hotspot positions - now inside the component
  const updateHotspotPositions = () => {
    if (
      !modelRef.current ||
      !cameraRef.current ||
      !sceneRef.current ||
      !canvasRef.current
    )
      return;

    // Get the canvas dimensions for calculations
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // - Thrusters are now positioned at the rear (underside)
    // - Camera (vision system) is raised on the front
    // - Main Hull remains centered
    // - Torpedo system is placed on the front right
    // - Gripper is placed on the front left
    const attachmentPoints = {
      thrusters: new THREE.Vector3(0, -0.1, -0.3),
      camera: new THREE.Vector3(0, 0.05, 0.2),
      mainHull: new THREE.Vector3(0, 0, 0),
      torpedos: new THREE.Vector3(0.1, -0.01, 0.15),
      gripper: new THREE.Vector3(-0.5, 0.1, -0.35),
    };

    hotspots.forEach((hotspot) => {
      if (!attachmentPoints[hotspot.id]) return;
      const point = attachmentPoints[hotspot.id].clone();

      // Convert model space to world space
      if (modelRef.current) {
        const worldMatrix = modelRef.current.matrixWorld.clone();
        point.applyMatrix4(worldMatrix);
      }

      // Project 3D point to 2D screen coordinates
      point.project(cameraRef.current);

      // Convert to CSS coordinates
      const x = (point.x * 0.5 + 0.5) * rect.width;
      const y = (-point.y * 0.5 + 0.5) * rect.height;

      // Check if point is in front of the camera (z between -1 and 1 after projection)
      const visible = point.z > -1 && point.z < 1;

      // Update hotspot DOM element position
      const hotspotElement = document.querySelector(
        `.model-hotspot[data-id="${hotspot.id}"]`
      );
      if (hotspotElement) {
        hotspotElement.style.left = `${x}px`;
        hotspotElement.style.top = `${y}px`;
        hotspotElement.style.visibility = visible ? "visible" : "hidden";
      }
    });
  };

  // Technical specifications for each system
  const technicalSpecs = {
    mechanical: {
      icon: <FaCogs />,
      title: "Mechanical Systems",
      description:
        "SubjuGator features precision-engineered mechanical systems, including servo-actuated mechanisms and a carbon fiber frame.",
      list: [
        "Servo-actuated gripper with serrated aluminum jaws",
        "Dual torpedo launchers with rack and pinion actuators",
        "Marker dropper with rotational mechanism",
        "Eight-thruster configuration for redundant motion control",
        "Carbon fiber and aluminum space-frame chassis",
      ],
    },
    electrical: {
      icon: <FaBolt />,
      title: "Electrical Systems",
      description:
        "Custom-designed electrical infrastructure provides reliable power, communications, and sensor integration.",
      list: [
        "Battery monitoring system with voltage and current tracking",
        "CAN bus for internal communications",
        "Water-cooling system for optimal thermal management",
        "Custom thruster/kill board for safety and control",
        "Multi-level power regulation for various subsystems",
      ],
    },
    software: {
      icon: <FaLaptopCode />,
      title: "Software Architecture",
      description:
        "Built on ROS (Robot Operating System), SubjuGator's software enables advanced autonomy and perception.",
      list: [
        "Custom state estimation using unscented Kalman filter",
        "Trajectory generation and control system",
        "Computer vision with deep neural networks (YOLO)",
        "Asynchronous mission planning infrastructure",
        "Open-source codebase with 60+ ROS packages",
      ],
    },
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    // Create scene, camera, renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x050505);

    // Adjusted lighting setup for better visibility without making the model pure white
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // Reduced from 2.5
    scene.add(ambientLight);

    // Make the directional light a bit more subtle
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.8); // Reduced from 3
    mainLight.position.set(2, 5, 5);
    scene.add(mainLight);

    // Add a spotlight to highlight the front of the model
    const spotlight = new THREE.SpotLight(0xffffff, 1.5); // Reduced from 3
    spotlight.position.set(0, 0, 10);
    spotlight.angle = Math.PI / 6;
    spotlight.penumbra = 0.5;
    spotlight.distance = 20;
    spotlight.decay = 0.5;
    scene.add(spotlight);

    // Make the colored accent lights more subtle
    const blueLight = new THREE.PointLight(0x4a9fff, 1.8, 15); // Reduced from 3
    blueLight.position.set(-3, 2, 3);
    scene.add(blueLight);

    const orangeLight = new THREE.PointLight(0xfa4616, 1.8, 15); // Reduced from 3
    orangeLight.position.set(3, -2, -3);
    scene.add(orangeLight);
    // Create and position camera
    const container = canvasContainerRef.current;
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.set(0, 0, 2);

    // Create WebGL renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Add orbit controls for user interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        updateHotspotPositions(); // Now properly defined within component scope
      }
    };

    // Start animation loop
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Load 3D model using GLTFLoader
    const loader = new GLTFLoader();

    // Try loading the actual GLTF model
    loader.load(
      "/models/subjugator.glb", // Path to model in public folder
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;
        scene.add(model);

        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.x = -center.x;
        model.position.y = -center.y;
        model.position.z = -center.z;

        // Scale the model if needed
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 5) {
          const scale = 5 / maxDim;
          model.scale.set(scale, scale, scale);
        }

        // Store original positions for exploded view
        model.traverse((child) => {
          if (child.isMesh) {
            if (child.material) {
              child.material.needsUpdate = true;
              child.material.emissive = new THREE.Color(0x111111);
              child.material.emissiveIntensity = 0.1;
              child.material.metalness = 0.4;
              child.material.roughness = 0.2;
            }
            child.userData.originalPosition = child.position.clone();
          }
        });

        setIsModelLoaded(true);
        setIsLoading(false);
      },
      // Progress callback
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // Error callback - fallback to temporary model if loading fails
      (error) => {
        console.error("Error loading model:", error);
        // Create a temporary model as fallback
        const model = createTemporaryModel();
        modelRef.current = model;
        scene.add(model);

        // Simulate loading time
        setTimeout(() => {
          setIsLoading(false);
          setIsModelLoaded(true);
        }, 1000);
      }
    );

    // Fallback model creation function
    const createTemporaryModel = () => {
      // Create a temporary submarine-like shape
      const group = new THREE.Group();

      // Main hull - cylinder
      const hullGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
      const hullMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.6,
        roughness: 0.4,
        emissive: 0x111111,
        emissiveIntensity: 0.1,
      });
      const hull = new THREE.Mesh(hullGeometry, hullMaterial);
      hull.rotation.x = Math.PI / 2;
      hull.userData.originalPosition = hull.position.clone();
      hull.userData.id = "mainHull";
      group.add(hull);

      // Nose cone
      const noseGeometry = new THREE.ConeGeometry(0.5, 0.8, 32);
      const noseMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.8,
        roughness: 0.2,
      });
      const nose = new THREE.Mesh(noseGeometry, noseMaterial);
      nose.rotation.x = -Math.PI / 2;
      nose.position.z = 1.4;
      nose.userData.originalPosition = nose.position.clone();
      group.add(nose);

      // Thrusters
      const thrusterGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 16);
      const thrusterMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.9,
        roughness: 0.1,
      });

      // Create 8 thrusters positioned around the hull
      const thrusterPositions = [
        { x: 0.6, y: 0.6, z: -0.5 },
        { x: -0.6, y: 0.6, z: -0.5 },
        { x: 0.6, y: -0.6, z: -0.5 },
        { x: -0.6, y: -0.6, z: -0.5 },
        { x: 0.6, y: 0.6, z: 0.5 },
        { x: -0.6, y: 0.6, z: 0.5 },
        { x: 0.6, y: -0.6, z: 0.5 },
        { x: -0.6, y: -0.6, z: 0.5 },
      ];

      thrusterPositions.forEach((pos, index) => {
        const thruster = new THREE.Mesh(thrusterGeometry, thrusterMaterial);
        thruster.position.set(pos.x, pos.y, pos.z);
        thruster.rotation.x = Math.PI / 2;
        thruster.userData.originalPosition = thruster.position.clone();
        thruster.userData.id = "thrusters";
        group.add(thruster);
      });

      // Camera dome
      const cameraGeometry = new THREE.SphereGeometry(
        0.2,
        32,
        32,
        0,
        Math.PI * 2,
        0,
        Math.PI / 2
      );
      const cameraMaterial = new THREE.MeshStandardMaterial({
        color: 0x3366ff,
        transparent: true,
        opacity: 0.7,
      });
      const camera = new THREE.Mesh(cameraGeometry, cameraMaterial);
      camera.position.set(0, -0.5, 1);
      camera.rotation.x = Math.PI;
      camera.userData.originalPosition = camera.position.clone();
      camera.userData.id = "camera";
      group.add(camera);

      // Add orange accent
      const accentGeometry = new THREE.BoxGeometry(0.1, 0.1, 2.5);
      const accentMaterial = new THREE.MeshStandardMaterial({
        color: 0xfa4616,
      });
      const accent = new THREE.Mesh(accentGeometry, accentMaterial);
      accent.position.set(0, 0.53, 0);
      accent.userData.originalPosition = accent.position.clone();
      group.add(accent);

      return group;
    };

    // Clean up on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      if (sceneRef.current) {
        // Clean up Three.js objects
        while (sceneRef.current.children.length > 0) {
          const object = sceneRef.current.children[0];
          sceneRef.current.remove(object);
        }
      }
    };
  }, []);

  // Handle exploded view toggle
  useEffect(() => {
    if (!modelRef.current) return;

    if (viewMode === "exploded") {
      // Move parts apart to create an exploded view
      modelRef.current.traverse((child) => {
        if (child.isMesh && child.userData.originalPosition) {
          // Calculate direction from center
          const direction = new THREE.Vector3();
          direction
            .subVectors(child.position, new THREE.Vector3(0, 0, 0))
            .normalize();

          // Store current position before exploding
          child.userData.preExplodedPosition = child.position.clone();

          // Move outward
          const explosionDistance = 1.5;
          child.position.add(direction.multiplyScalar(explosionDistance));
        }
      });
    } else {
      // Reset to original positions
      modelRef.current.traverse((child) => {
        if (child.isMesh) {
          if (child.userData.preExplodedPosition) {
            child.position.copy(child.userData.preExplodedPosition);
          } else if (child.userData.originalPosition) {
            child.position.copy(child.userData.originalPosition);
          }
        }
      });
    }
  }, [viewMode]);

  // Handle scroll effect to show different sections
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Determine active section based on scroll position
      const sections = document.querySelectorAll(".section");
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionId = section.id;

        if (rect.top < windowHeight / 2 && rect.bottom > windowHeight / 2) {
          setActiveSection(sectionId);
        }
      });

      // Parallax effect for certain elements
      const parallaxElements = document.querySelectorAll(".parallax");
      parallaxElements.forEach((element) => {
        if (element.dataset && element.dataset.speed) {
          const speed = parseFloat(element.dataset.speed) || 0.2;
          element.style.transform = `translateY(${scrollY * speed}px)`;
        }
      });

      // Optional: Adjust camera or model position based on scroll
      if (modelRef.current && controlsRef.current) {
        // Example: Rotate model slightly based on scroll
        modelRef.current.rotation.y = scrollY * 0.001;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Control auto-rotation based on user interaction
  const handleModelInteraction = () => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = false;

      // Resume auto-rotation after a period of inactivity
      clearTimeout(controlsRef.current.userData.rotationTimeout);
      controlsRef.current.userData.rotationTimeout = setTimeout(() => {
        if (controlsRef.current) {
          controlsRef.current.autoRotate = true;
        }
      }, 5000);
    }
  };

  // Handle hotspot clicks
  const handleHotspotClick = (hotspotId) => {
    // Toggle logic - if clicking the already active hotspot, deselect it
    if (activeHotspot === hotspotId) {
      setActiveHotspot(null); // Deselect the hotspot
      
      // Optional: Reset camera to default rotation if you want
      if (controlsRef.current) {
        controlsRef.current.autoRotate = true; // Resume auto-rotation
      }
      
      return; // Exit the function early
    }
    
    // If it's a different hotspot, select it (existing functionality)
    setActiveHotspot(hotspotId);
  
    // Move camera to focus on the selected component
    if (modelRef.current && cameraRef.current && controlsRef.current) {
      // Find the component in the model
      const targetComponent = modelRef.current.children.find(
        (child) => child.userData.id === hotspotId
      );
  
      if (targetComponent) {
        // Disable auto-rotation when focusing on a component
        controlsRef.current.autoRotate = false;
  
        // Set camera target directly
        controlsRef.current.target.copy(targetComponent.position);
      }
    }
  };

  // Toggle between complete and exploded views
  const toggleViewMode = () => {
    setViewMode((prevMode) =>
      prevMode === "complete" ? "exploded" : "complete"
    );
  };

  // Toggle information overlay visibility
  const toggleInfoVisibility = () => {
    setInfoVisible((prev) => !prev);
  };

  return (
    <div className="auv-technology-page">
      {/* Hero Section with 3D Model */}
      <section className="hero-section" id="overview">
        <div className="hero-background"></div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="text-gradient-blue">AUV</span> Technology
            </h1>
            <p className="hero-subtitle">
              Exploring the innovation behind SubjuGator
            </p>

            {/* 3D Model Canvas Container */}
            <div
              className="model-canvas-container"
              ref={canvasContainerRef}
              onClick={handleModelInteraction}
              onMouseMove={handleModelInteraction}
            >
              {isLoading && (
                <div className="loading-overlay">
                  <div className="loading-spinner"></div>
                  <p>Loading 3D Model...</p>
                </div>
              )}

              <canvas ref={canvasRef} className="model-canvas" />

              {isModelLoaded && (
                <>
                  {/* Interactive Hotspots */}
                  <div className="hotspots-container">
                    {hotspots.map((hotspot) => (
                      <Hotspot
                        key={hotspot.id}
                        id={hotspot.id}
                        title={hotspot.title}
                        isActive={activeHotspot === hotspot.id}
                        onClick={() => handleHotspotClick(hotspot.id)}
                      />
                    ))}
                  </div>

                  {/* Model Controls */}
                  <div className="model-controls">
                    <button
                      className="control-button"
                      onClick={toggleViewMode}
                      title={
                        viewMode === "complete"
                          ? "Show Exploded View"
                          : "Show Complete View"
                      }
                    >
                      <FaExpand />
                      <span>
                        {viewMode === "complete"
                          ? "Exploded View"
                          : "Complete View"}
                      </span>
                    </button>

                    <button
                      className="control-button"
                      onClick={toggleInfoVisibility}
                      title={infoVisible ? "Hide Info" : "Show Info"}
                    >
                      <FaInfoCircle />
                      <span>{infoVisible ? "Hide Info" : "Show Info"}</span>
                    </button>
                  </div>
                </>
              )}

              {/* Component Information Panel */}
              {activeHotspot && infoVisible && (
                <div className="component-info-panel">
                  <h3>{hotspots.find((h) => h.id === activeHotspot)?.title}</h3>
                  <p>
                    {activeHotspot === "thrusters" &&
                      "Eight-thruster configuration provides redundant six degrees of freedom control, maintaining full functionality even if one thruster fails."}
                    {activeHotspot === "camera" &&
                      "Computer vision system using advanced neural networks for object detection and classification underwater."}
                    {activeHotspot === "mainHull" &&
                      "Houses the main computer, power distribution, and electronic systems in a waterproof enclosure."}
                    {activeHotspot === "torpedos" &&
                      "Dual servo-actuated torpedo launchers with rack and pinion mechanisms for competition tasks."}
                    {activeHotspot === "gripper" &&
                      "Servo-actuated gripper with serrated aluminum jaws for manipulating underwater objects."}
                  </p>
                </div>
              )}
            </div>

            <div className="model-instructions">
              <p>
                Click and drag to rotate • Scroll to zoom • Click on hotspots to
                explore
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications Section */}
      <section className="tech-specs-section section" id="tech-specs">
        <div className="blueprint-grid-bg"></div>
        <div className="container">
          <div className="section-header">
            <h2>Technical Specifications</h2>
            <div className="section-divider"></div>
            <p className="subtitle">
              Cutting-edge systems powering autonomous underwater exploration
            </p>
          </div>

          <div className="specs-grid">
            <SpecCard
              icon={technicalSpecs.mechanical.icon}
              title={technicalSpecs.mechanical.title}
              description={technicalSpecs.mechanical.description}
              list={technicalSpecs.mechanical.list}
            />

            <SpecCard
              icon={technicalSpecs.electrical.icon}
              title={technicalSpecs.electrical.title}
              description={technicalSpecs.electrical.description}
              list={technicalSpecs.electrical.list}
            />

            <SpecCard
              icon={technicalSpecs.software.icon}
              title={technicalSpecs.software.title}
              description={technicalSpecs.software.description}
              list={technicalSpecs.software.list}
            />
          </div>
        </div>
      </section>

      {/* Feature Highlight Section */}
      <section className="feature-highlight-section section" id="features">
        <div className="container">
          <div className="section-header">
            <h2>Key Innovations</h2>
            <div className="section-divider"></div>
            <p className="subtitle">
              Pioneering advancements that set SubjuGator apart
            </p>
          </div>

          <div className="feature-highlight">
            <div className="feature-image">
              {/* Background image will be set in CSS */}
            </div>
            <div className="feature-content">
              <h3>
                Adaptive{" "}
                <span className="text-gradient-blue">Control System</span>
              </h3>
              <p>
                Our state-of-the-art control system uses an unscented Kalman
                filter operating on manifolds to efficiently handle attitude
                singularities. The trajectory generator produces 3rd-order
                continuous trajectories while accounting for vehicle
                constraints.
              </p>
              <Link to="/publications" className="btn btn-secondary">
                Read Research Paper
              </Link>
            </div>
          </div>

          <div className="feature-highlight reversed">
            <div className="feature-image second">
              {/* Background image will be set in CSS */}
            </div>
            <div className="feature-content">
              <h3>
                <span className="text-gradient-orange">Deep Learning</span>{" "}
                Vision
              </h3>
              <p>
                SubjuGator combines traditional computer vision techniques with
                advanced deep neural networks (YOLO architecture) to identify
                competition elements and navigate dynamic underwater
                environments.
              </p>
              <Link to="/software" className="btn btn-secondary">
                Explore Vision System
              </Link>
            </div>
          </div>

          <div className="feature-highlight">
            <div className="feature-image third">
              {/* Background image will be set in CSS */}
            </div>
            <div className="feature-content">
              <h3>
                Advanced{" "}
                <span className="text-gradient-blue">Electro-Mechanical</span>{" "}
                Design
              </h3>
              <p>
                Our innovative electro-mechanical systems include custom PCB
                designs, CAN bus communications, servo-actuated mechanisms, and
                aluminum components manufactured using precision CNC and
                water-jet cutting techniques.
              </p>
              <Link to="/mechanical" className="btn btn-secondary">
                See Design Details
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Next Generation Section */}
      <section className="next-gen-section section" id="next-gen">
        <div className="container">
          <div className="section-header">
            <h2>SubjuGator 9</h2>
            <div className="section-divider"></div>
            <p className="subtitle">
              The next generation of autonomous underwater excellence
            </p>
          </div>

          <div className="next-gen-content">
            <div className="next-gen-image">
              {/* This will be a background image set in CSS */}
            </div>
            <div className="next-gen-info">
              <h3>Evolution of Innovation</h3>
              <p>
                Currently in development, SubjuGator 9 represents the
                culmination of years of research and competition experience.
                With a completely redesigned aluminum chassis and electronics
                hull, this next-generation AUV will push the boundaries of
                what's possible in autonomous underwater robotics.
              </p>
              <div className="next-gen-features">
                <div className="next-gen-feature">
                  <h4>Enhanced Chassis</h4>
                  <p>
                    Fully CNC-machined from 6061-T6 aluminum for optimal
                    strength and weight
                  </p>
                </div>
                <div className="next-gen-feature">
                  <h4>Advanced Electronics</h4>
                  <p>
                    Redesigned electronics hull with improved thermal management
                    and expanded sensor capacity
                  </p>
                </div>
                <div className="next-gen-feature">
                  <h4>Next-Gen Software</h4>
                  <p>
                    Enhanced autonomy algorithms and improved mission planning
                    capabilities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="resources-section section" id="resources">
        <div className="blueprint-grid-bg"></div>
        <div className="container">
          <div className="section-header">
            <h2>Technical Resources</h2>
            <div className="section-divider"></div>
            <p className="subtitle">
              In-depth documentation and research materials
            </p>
          </div>

          <div className="resources-grid">
            <Link to="/technical-documentation" className="resource-card">
              <div className="resource-icon">
                <FaCogs />
              </div>
              <h3>Mechanical Documentation</h3>
              <p>Detailed specifications, CAD files, and assembly guides</p>
            </Link>

            <Link to="/electrical-systems" className="resource-card">
              <div className="resource-icon">
                <FaBolt />
              </div>
              <h3>Electrical Schematics</h3>
              <p>PCB designs, wiring diagrams, and component datasheets</p>
            </Link>

            <Link to="/software-repository" className="resource-card">
              <div className="resource-icon">
                <FaLaptopCode />
              </div>
              <h3>Software Repository</h3>
              <p>Open-source codebase, ROS packages, and development guides</p>
            </Link>

            <a
              href="/assets/SubjuGator_Technical_Paper.pdf"
              className="resource-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="resource-icon document-icon">
                <span>PDF</span>
              </div>
              <h3>Technical Paper</h3>
              <p>
                Comprehensive overview of SubjuGator's design and implementation
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Experience Innovation</h2>
            <p>
              Want to learn more about SubjuGator or get involved with our team?
            </p>
            <div className="cta-buttons">
              <Link to="/robosub" className="btn btn-primary">
                RoboSub Competition
              </Link>
              <Link to="/ourteam" className="btn btn-secondary">
                Meet The Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AUVTechnology;
