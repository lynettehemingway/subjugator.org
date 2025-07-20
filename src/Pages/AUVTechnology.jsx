import React, { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  FaCogs,
  FaBolt,
  FaLaptopCode,
  FaInfoCircle,
  FaExpand,
} from "react-icons/fa";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import "../styles/AUVTechnology.css";
import techReport from "../assets/Design_and_Development_of_SubjuGator_9.pdf";

// Hotspot button on the model
const Hotspot = ({ id, title, isActive, onClick }) => (
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

// Specification card below the 3D canvas
const SpecCard = ({ icon, title, description, list }) => (
  <div className="spec-card">
    <div className="spec-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
    {list && (
      <ul className="spec-list">
        {list.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    )}
  </div>
);

export default function AUVTechnology() {
  const location = useLocation();

  // 1) Keep --vh up to date for mobile address-bar hiding
  useEffect(() => {
    const setVh = () =>
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    setVh();
    window.addEventListener("resize", setVh);
    window.addEventListener("orientationchange", setVh);
    return () => {
      window.removeEventListener("resize", setVh);
      window.removeEventListener("orientationchange", setVh);
    };
  }, []);

  // 2) Smooth-scroll to anchors
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.hash]);

  // Three.js refs
  const canvasContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(null);
  const frameRef = useRef(null);

  // UI state
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [viewMode, setViewMode] = useState("complete");
  const [infoVisible, setInfoVisible] = useState(true);

  // Hotspot definitions
  const hotspots = [
    { id: "thrusters", title: "Thrusters" },
    { id: "camera", title: "Vision System" },
    { id: "mainHull", title: "Main Hull" },
    { id: "torpedos", title: "Torpedo System" },
    { id: "gripper", title: "Gripper" },
  ];

  // Technical specifications data
  const technicalSpecs = {
    mechanical: {
      icon: <FaCogs />,
      title: "Mechanical Systems",
      description:
        "SubjuGator features precision-engineered mechanical systems, including servo-actuated mechanisms and a carbon fiber frame.",
      list: [
        "Servo-actuated gripper with serrated jaws",
        "Dual torpedo launchers with rack and pinion actuators",
        "Ball dropper with rotational mechanism",
        "Eight-thruster configuration for robust motion control",
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
        "Custom state estimation using Extended Kalman filter",
        "Trajectory generation and control system",
        "Computer vision with deep neural networks (YOLO)",
        "Asynchronous mission planning infrastructure",
        "Open-source codebase with 60+ ROS packages",
      ],
    },
  };

  // Initialize Three.js scene, lights, camera, controls, loader, animate
  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    sceneRef.current = scene;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 1.8);
    dir.position.set(2, 5, 5);
    scene.add(dir);
    const spot = new THREE.SpotLight(0xffffff, 1.5);
    spot.position.set(0, 0, 10);
    spot.angle = Math.PI / 6;
    scene.add(spot);
    scene.add(new THREE.PointLight(0x4a9fff, 1.8, 15));
    scene.add(new THREE.PointLight(0xfa4616, 1.8, 15));

    // Camera
    const container = canvasContainerRef.current;
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 2);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controlsRef.current = controls;

    // Load model
    const loader = new GLTFLoader();
    loader.load(
      "/models/subjugator.glb",
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        modelRef.current = model;

        // center & scale
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        const size = box.getSize(new THREE.Vector3()).length();
        if (size > 5) model.scale.setScalar(5 / size);

        model.traverse((c) => {
          if (c.isMesh) {
            c.userData.originalPosition = c.position.clone();
            c.material.emissive = new THREE.Color(0x111111);
            c.material.emissiveIntensity = 0.1;
            c.material.metalness = 0.4;
            c.material.roughness = 0.2;
          }
        });

        setIsModelLoaded(true);
        setIsLoading(false);
      },
      undefined,
      (err) => {
        console.error("Model load error:", err);
        setIsLoading(false);
        setIsModelLoaded(true);
      }
    );

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
      // updateHotspots();
    };
    animate();

    // Resize handler
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
    };
  }, []);

  // Exploded / complete toggle
  useEffect(() => {
    if (!modelRef.current) return;
    modelRef.current.traverse((c) => {
      if (!c.isMesh || !c.userData.originalPosition) return;
      if (viewMode === "exploded") {
        const dir = c.position.clone().normalize().multiplyScalar(1.5);
        c.position.copy(c.userData.originalPosition).add(dir);
      } else {
        c.position.copy(c.userData.originalPosition);
      }
    });
  }, [viewMode]);

  // Interaction handlers
  const handleModelInteraction = () => {
    if (controlsRef.current) controlsRef.current.autoRotate = false;
  };

  const updateHotspotPositions = () => {
    if (!modelRef.current || !cameraRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const attach = {
      thrusters: new THREE.Vector3(0, -0.1, -0.3),
      camera: new THREE.Vector3(0, 0.05, 0.2),
      mainHull: new THREE.Vector3(0, 0, 0),
      torpedos: new THREE.Vector3(0.1, -0.01, 0.15),
      gripper: new THREE.Vector3(-0.5, 0.1, -0.35),
    };
    hotspots.forEach((h) => {
      const pt = attach[h.id]?.clone();
      if (!pt) return;
      pt.applyMatrix4(modelRef.current.matrixWorld);
      pt.project(cameraRef.current);
      const x = (pt.x * 0.5 + 0.5) * rect.width;
      const y = (-pt.y * 0.5 + 0.5) * rect.height;
      const vis = pt.z > -1 && pt.z < 1;
      const el = document.querySelector(`.model-hotspot[data-id="${h.id}"]`);
      if (el) {
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.visibility = vis ? "visible" : "hidden";
      }
    });
  };

  useEffect(() => {
    // on each frame draw, also update hotspots
    const id = setInterval(() => {
      if (isModelLoaded) updateHotspotPositions();
    }, 100);
    return () => clearInterval(id);
  }, [isModelLoaded]);

  return (
    <div className="auv-technology-page">
      {/* ===== Hero ===== */}
      <section className="hero-section" id="overview">
        <div className="hero-background" />
        <div className="container hero-content">
          <h1 className="hero-title">
            <span className="text-gradient-blue">AUV</span> Technology
          </h1>
          <p className="hero-subtitle">
            Exploring the innovation behind SubjuGator
          </p>
          <div
            className="model-canvas-container"
            ref={canvasContainerRef}
            onClick={handleModelInteraction}
            onMouseMove={handleModelInteraction}
          >
            {isLoading && (
              <div className="loading-overlay">
                <div className="loading-spinner" />
                <p>Loading 3D Model…</p>
              </div>
            )}
            <canvas ref={canvasRef} className="model-canvas" />
            {isModelLoaded && (
              <>
                <div className="hotspots-container">
                  {hotspots.map((hs) => (
                    <Hotspot
                      key={hs.id}
                      id={hs.id}
                      title={hs.title}
                      isActive={activeHotspot === hs.id}
                      onClick={() =>
                        setActiveHotspot((p) => (p === hs.id ? null : hs.id))
                      }
                    />
                  ))}
                </div>
                <div className="model-controls">
                  <button
                    onClick={() =>
                      setViewMode((v) =>
                        v === "complete" ? "exploded" : "complete"
                      )
                    }
                  >
                    <FaExpand />{" "}
                    <span>
                      {viewMode === "complete"
                        ? "Exploded View"
                        : "Complete View"}
                    </span>
                  </button>
                  <button onClick={() => setInfoVisible((v) => !v)}>
                    <FaInfoCircle />{" "}
                    <span>{infoVisible ? "Hide Info" : "Show Info"}</span>
                  </button>
                </div>
                {activeHotspot && infoVisible && (
                  <div className="component-info-panel">
                    <h3>
                      {hotspots.find((h) => h.id === activeHotspot)?.title}
                    </h3>
                    <p>
                      {/* Add your active-hotspot description here */}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===== Technical Specifications ===== */}
      <section className="tech-specs-section section" id="tech-specs">
        <div className="blueprint-grid-bg" />
        <div className="container">
          <div className="section-header">
            <h2>Technical Specifications</h2>
            <div className="section-divider" />
            <p className="subtitle">
              Cutting-edge systems powering autonomous underwater exploration
            </p>
          </div>
          <div className="specs-grid">
            <SpecCard {...technicalSpecs.mechanical} />
            <SpecCard {...technicalSpecs.electrical} />
            <SpecCard {...technicalSpecs.software} />
          </div>
          <div className="tech-button-container">
            <a
              href={techReport}
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Technical Design Report
            </a>
          </div>
        </div>
      </section>

      {/* ===== Resources ===== */}
      <section className="resources-section section" id="resources">
        <div className="blueprint-grid-bg" />
        <div className="container">
          <div className="section-header">
            <h2>Technical Resources</h2>
            <div className="section-divider" />
            <p className="subtitle">
              In-depth documentation and research materials
            </p>
          </div>
          <div className="resources-grid">
            <a
              href="https://github.com/uf-mil/mil2"
              className="resource-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="resource-icon">
                <FaLaptopCode />
              </div>
              <h3>Software Repository</h3>
              <p>Open-source codebase, ROS packages, and development guides</p>
            </a>
            <a
              href={techReport}
              className="resource-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="resource-icon document-icon">
                <span>PDF</span>
              </div>
              <h3>Technical Paper</h3>
              <p>Comprehensive overview of SubjuGator's design and implementation</p>
            </a>
          </div>
        </div>
      </section>

      {/* ===== Call to Action ===== */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Experience Innovation</h2>
            <p>Want to learn more about SubjuGator or get involved with our team?</p>
            <div className="cta-buttons">
              <Link to="/robosub#top" className="btn btn-primary">
                RoboSub Competition
              </Link>
              <Link to="/ourteam#top-team" className="btn btn-secondary">
                Meet The Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
