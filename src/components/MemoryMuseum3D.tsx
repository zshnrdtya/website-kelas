"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { memoriesData, type MemoryItem } from "../data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import {
  Landmark,
  Compass,
  Play,
  Pause,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  X,
  Maximize2,
  Calendar,
  Folder,
  Sparkles,
  Info,
  Laptop,
  BarChart3,
  Footprints,
} from "lucide-react";

interface MemoryMuseum3DProps {
  onOpenLightbox?: (index: number) => void;
  selectedCategory?: string;
  onCategoryChange?: (cat: string) => void;
  isActive?: boolean;
}

export default function MemoryMuseum3D({
  onOpenLightbox,
  selectedCategory = "All",
  onCategoryChange,
  isActive = true,
}: MemoryMuseum3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isActiveRef = useRef(isActive);

  useEffect(() => {
    isActiveRef.current = isActive;
    if (isActive) {
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  // Active artwork & tour states
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [hoveredMemory, setHoveredMemory] = useState<MemoryItem | null>(null);
  const [isHoveringDashboard, setIsHoveringDashboard] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [activeArtworkIndex, setActiveArtworkIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [viewPreset, setViewPreset] = useState<"hall" | "k10" | "k11" | "center" | "dashboard">("hall");
  const [isMuseumReady, setIsMuseumReady] = useState(false);
  const [isWalkMode, setIsWalkMode] = useState(false);
  const isWalkModeRef = useRef(false);
  const keysPressedRef = useRef<Record<string, boolean>>({});
  const virtualMoveRef = useRef({ forward: false, backward: false, left: false, right: false });
  const walkBobTimeRef = useRef(0);

  // Three.js References
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const artMeshesMapRef = useRef<Map<string, { frame: THREE.Mesh; camPos: THREE.Vector3; lookPos: THREE.Vector3 }>>(
    new Map()
  );

  const animationTargetRef = useRef<{
    camPos: THREE.Vector3;
    targetPos: THREE.Vector3;
    progress: number;
    active: boolean;
  }>({
    camPos: new THREE.Vector3(0, 7, 18),
    targetPos: new THREE.Vector3(0, 2.5, 0),
    progress: 1,
    active: false,
  });

  // Filter artworks by category
  const artworks = useMemo(() => {
    if (!selectedCategory || selectedCategory === "All") {
      return memoriesData;
    }
    return memoriesData.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  // Smooth camera animation helper
  const animateCameraTo = useCallback((camTarget: THREE.Vector3, lookTarget: THREE.Vector3) => {
    if (!cameraRef.current || !controlsRef.current) return;
    animationTargetRef.current = {
      camPos: camTarget,
      targetPos: lookTarget,
      progress: 0,
      active: true,
    };
  }, []);

  // Focus on a specific memory frame
  const focusOnArtwork = useCallback(
    (item: MemoryItem) => {
      setSelectedMemory(item);
      const data = artMeshesMapRef.current.get(item.id.toString());
      if (data) {
        animateCameraTo(data.camPos, data.lookPos);
      }
      const idx = artworks.findIndex((a) => a.id === item.id);
      if (idx !== -1) {
        setActiveArtworkIndex(idx);
      }
    },
    [artworks, animateCameraTo]
  );

  // Toggle First-Person Walk Mode
  const toggleWalkMode = useCallback(() => {
    setIsWalkMode((prev) => {
      const nextState = !prev;
      isWalkModeRef.current = nextState;

      if (nextState) {
        setIsAutoRotating(false);
        setIsTourActive(false);
        if (controlsRef.current) {
          controlsRef.current.autoRotate = false;
          controlsRef.current.minPolarAngle = Math.PI / 4;
          controlsRef.current.maxPolarAngle = Math.PI * 0.72;
          controlsRef.current.minDistance = 0.5;
          controlsRef.current.maxDistance = 2.5;
        }
        animateCameraTo(
          new THREE.Vector3(0, 1.7, 10.5),
          new THREE.Vector3(0, 1.7, 0)
        );
      } else {
        if (controlsRef.current) {
          controlsRef.current.minPolarAngle = 0.08;
          controlsRef.current.maxPolarAngle = Math.PI / 2 + 0.02;
          controlsRef.current.minDistance = 3;
          controlsRef.current.maxDistance = 38;
        }
        animateCameraTo(new THREE.Vector3(0, 9, 20), new THREE.Vector3(0, 2.5, 0));
        setViewPreset("hall");
      }
      return nextState;
    });
  }, [animateCameraTo]);

  // Preset view handlers
  const handlePresetView = (preset: "hall" | "k10" | "k11" | "center" | "dashboard") => {
    if (isWalkModeRef.current) {
      setIsWalkMode(false);
      isWalkModeRef.current = false;
      if (controlsRef.current) {
        controlsRef.current.minPolarAngle = 0.08;
        controlsRef.current.maxPolarAngle = Math.PI / 2 + 0.02;
        controlsRef.current.minDistance = 3;
        controlsRef.current.maxDistance = 38;
      }
    }
    setViewPreset(preset);
    setIsTourActive(false);
    if (isAutoRotating) {
      setIsAutoRotating(false);
      if (controlsRef.current) controlsRef.current.autoRotate = false;
    }

    if (preset === "hall") {
      animateCameraTo(new THREE.Vector3(0, 9, 20), new THREE.Vector3(0, 2.5, 0));
    } else if (preset === "k10") {
      animateCameraTo(new THREE.Vector3(-10.5, 3.8, 8.5), new THREE.Vector3(-10.5, 2.7, -3.0));
    } else if (preset === "k11") {
      animateCameraTo(new THREE.Vector3(7.5, 3.8, 3.0), new THREE.Vector3(13.8, 2.8, 0));
    } else if (preset === "center") {
      animateCameraTo(new THREE.Vector3(0, 3.2, 3.6), new THREE.Vector3(0, 1.45, 0));
    } else if (preset === "dashboard") {
      animateCameraTo(new THREE.Vector3(9.0, 2.4, -8.9), new THREE.Vector3(9.0, 2.4, -13.75));
    }
  };

  // Step through artworks
  const handleNextArtwork = () => {
    if (artworks.length === 0) return;
    const nextIdx = (activeArtworkIndex + 1) % artworks.length;
    focusOnArtwork(artworks[nextIdx]);
  };

  const handlePrevArtwork = () => {
    if (artworks.length === 0) return;
    const prevIdx = (activeArtworkIndex - 1 + artworks.length) % artworks.length;
    focusOnArtwork(artworks[prevIdx]);
  };

  // Automatic Guided Tour interval
  useEffect(() => {
    if (!isTourActive || artworks.length === 0) return;

    const timer = setInterval(() => {
      setActiveArtworkIndex((prev) => {
        const next = (prev + 1) % artworks.length;
        focusOnArtwork(artworks[next]);
        return next;
      });
    }, 6000);

    return () => clearInterval(timer);
  }, [isTourActive, artworks, focusOnArtwork]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.018);
    const texturesToDispose: THREE.Texture[] = [];

    const width = container.clientWidth;
    const height = container.clientHeight || 580;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 150);
    camera.position.set(0, 9, 20);
    cameraRef.current = camera;

    // 2. RENDERER
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 3. ORBIT CONTROLS
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 + 0.02; // Prevent going below floor
    controls.minDistance = 3;
    controls.maxDistance = 38;
    controls.target.set(0, 2.5, 0);
    controlsRef.current = controls;

    // 4. LIGHTING
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    // Warm gallery center overhead chandelier
    const mainLight = new THREE.PointLight(0xfff7ed, 2.2, 50);
    mainLight.position.set(0, 12, 0);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 512;
    mainLight.shadow.mapSize.height = 512;
    scene.add(mainLight);

    // Subtle yellow ambient fill
    const yellowFill = new THREE.DirectionalLight(0xe5de00, 0.7);
    yellowFill.position.set(10, 15, 10);
    scene.add(yellowFill);

    // Gallery wing fill lights
    const leftGalleryLight = new THREE.PointLight(0xfff7ed, 1.4, 25);
    leftGalleryLight.position.set(-10.5, 6.0, 0);
    scene.add(leftGalleryLight);

    const rightGalleryLight = new THREE.PointLight(0xfff7ed, 1.4, 25);
    rightGalleryLight.position.set(10.5, 6.0, 0);
    scene.add(rightGalleryLight);

    // 5. GRAND GALLERY PAVILION GEOMETRY
    const hallGroup = new THREE.Group();

    // Polished Floor with Clean Slate Tiles
    const floorCanvas = document.createElement("canvas");
    floorCanvas.width = 512;
    floorCanvas.height = 512;
    const fctx = floorCanvas.getContext("2d");
    if (fctx) {
      // Deep dark slate background
      fctx.fillStyle = "#0c1220";
      fctx.fillRect(0, 0, 512, 512);

      // Clean Neobrutalism tile borders
      fctx.strokeStyle = "#1e293b";
      fctx.lineWidth = 4;
      fctx.strokeRect(0, 0, 512, 512);

      // Sub-tile dividers (4 tiles per canvas repeat)
      fctx.beginPath();
      fctx.moveTo(256, 0);
      fctx.lineTo(256, 512);
      fctx.moveTo(0, 256);
      fctx.lineTo(512, 256);
      fctx.stroke();

      // Subtle inner border for depth
      fctx.strokeStyle = "#141c2c";
      fctx.lineWidth = 2;
      fctx.strokeRect(6, 6, 244, 244);
      fctx.strokeRect(262, 6, 244, 244);
      fctx.strokeRect(6, 262, 244, 244);
      fctx.strokeRect(262, 262, 244, 244);
    }
    const floorTex = new THREE.CanvasTexture(floorCanvas);
    floorTex.wrapS = THREE.RepeatWrapping;
    floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(6, 6);

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.25,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(36, 36), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    hallGroup.add(floor);

    // Yellow Accent Material (used for perimeter curbs & wall moldings)
    const borderMat = new THREE.MeshStandardMaterial({
      color: 0xe5de00,
      roughness: 0.35,
      metalness: 0.2,
    });

    // Raised Perimeter Curbs along room boundaries (Zero z-fighting, strictly outside floor plane)
    const curbN = new THREE.Mesh(new THREE.BoxGeometry(36, 0.12, 0.3), borderMat);
    curbN.position.set(0, 0.06, -17.85);
    hallGroup.add(curbN);

    const curbS = new THREE.Mesh(new THREE.BoxGeometry(36, 0.12, 0.3), borderMat);
    curbS.position.set(0, 0.06, 17.85);
    hallGroup.add(curbS);

    const curbW = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 36), borderMat);
    curbW.position.set(-17.85, 0.06, 0);
    hallGroup.add(curbW);

    const curbE = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 36), borderMat);
    curbE.position.set(17.85, 0.06, 0);
    hallGroup.add(curbE);

    // Gallery Walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.8,
    });
    const wallBaseboardMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.4,
    });

    const createMuseumWall = (widthW: number, heightW: number, x: number, z: number, rotY: number) => {
      const wg = new THREE.Group();
      wg.position.set(x, 0, z);
      wg.rotation.y = rotY;

      // Main Wall
      const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(widthW, heightW, 0.4), wallMat);
      wallMesh.position.y = heightW / 2;
      wallMesh.receiveShadow = true;
      wg.add(wallMesh);

      // Baseboard
      const baseboard = new THREE.Mesh(new THREE.BoxGeometry(widthW, 0.4, 0.48), wallBaseboardMat);
      baseboard.position.y = 0.2;
      wg.add(baseboard);

      // Top Crown Molding (Neo-yellow strip)
      const crown = new THREE.Mesh(new THREE.BoxGeometry(widthW, 0.25, 0.46), borderMat);
      crown.position.y = heightW - 0.125;
      wg.add(crown);

      return wg;
    };

    // Back Center Wall (z = -14)
    hallGroup.add(createMuseumWall(30, 8, 0, -14, 0));
    // Left Wing Wall (x = -14)
    hallGroup.add(createMuseumWall(28, 8, -14, 0, Math.PI / 2));
    // Right Wing Wall (x = 14)
    hallGroup.add(createMuseumWall(28, 8, 14, 0, -Math.PI / 2));

    // 5A. FRONT ENTRANCE WALL WITH DOUBLE GLASS DOORS (SOUTH WALL AT Z = 14)
    // Uses THREE.FrontSide with inward-pointing normal (rotation.y = Math.PI):
    // - From outside (Z > 14, e.g. default hall view at Z=20 or Orbit): CULLED / 100% INVISIBLE!
    // - From inside (Z < 14 looking back at entrance): VISIBLE with double glass doors & illuminated sign!
    const frontEntranceGroup = new THREE.Group();
    frontEntranceGroup.position.set(0, 0, 14);

    const frontWallMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.8,
      side: THREE.FrontSide, // Invisible when viewed from outside front Z > 14
    });

    // Left Solid Wall Segment (x = -8.5, width 11.0, height 8.0)
    const leftFrontWall = new THREE.Mesh(new THREE.PlaneGeometry(11.0, 8.0), frontWallMat);
    leftFrontWall.position.set(-8.5, 4.0, 0);
    leftFrontWall.rotation.y = Math.PI;
    leftFrontWall.receiveShadow = true;
    frontEntranceGroup.add(leftFrontWall);

    // Right Solid Wall Segment (x = 8.5, width 11.0, height 8.0)
    const rightFrontWall = new THREE.Mesh(new THREE.PlaneGeometry(11.0, 8.0), frontWallMat);
    rightFrontWall.position.set(8.5, 4.0, 0);
    rightFrontWall.rotation.y = Math.PI;
    rightFrontWall.receiveShadow = true;
    frontEntranceGroup.add(rightFrontWall);

    // Lintel Wall above Entrance Portal (x = 0, width 6.0, height 3.2, y = 6.4)
    const lintelWall = new THREE.Mesh(new THREE.PlaneGeometry(6.0, 3.2), frontWallMat);
    lintelWall.position.set(0, 6.4, 0);
    lintelWall.rotation.y = Math.PI;
    frontEntranceGroup.add(lintelWall);

    // Baseboards for Front Wall (Inward facing)
    [-8.5, 8.5].forEach((bx) => {
      const fb = new THREE.Mesh(new THREE.BoxGeometry(11.0, 0.4, 0.2), wallBaseboardMat);
      fb.position.set(bx, 0.2, -0.1);
      frontEntranceGroup.add(fb);

      const fc = new THREE.Mesh(new THREE.BoxGeometry(11.0, 0.25, 0.2), borderMat);
      fc.position.set(bx, 7.875, -0.1);
      frontEntranceGroup.add(fc);
    });

    // Outer Entrance Portal Frame (Kusen Pintu Masuk Utama)
    const portalFrameMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.4,
      metalness: 0.5,
    });
    // Top portal lintel
    const portalTop = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.22, 0.4), portalFrameMat);
    portalTop.position.set(0, 4.9, 0);
    frontEntranceGroup.add(portalTop);

    // Left portal jamb
    const portalLeft = new THREE.Mesh(new THREE.BoxGeometry(0.22, 4.9, 0.4), portalFrameMat);
    portalLeft.position.set(-3.0, 2.45, 0);
    frontEntranceGroup.add(portalLeft);

    // Right portal jamb
    const portalRight = new THREE.Mesh(new THREE.BoxGeometry(0.22, 4.9, 0.4), portalFrameMat);
    portalRight.position.set(3.0, 2.45, 0);
    frontEntranceGroup.add(portalRight);

    // Center mullion divider between double doors
    const portalCenter = new THREE.Mesh(new THREE.BoxGeometry(0.12, 4.8, 0.35), portalFrameMat);
    portalCenter.position.set(0, 2.4, 0);
    frontEntranceGroup.add(portalCenter);

    // Double Glass Sliding Doors (Daun Pintu Kaca Temaram)
    const doorGlassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.85,
      side: THREE.DoubleSide,
    });

    // Left Glass Door Leaf
    const leftDoor = new THREE.Mesh(new THREE.BoxGeometry(2.8, 4.6, 0.08), doorGlassMat);
    leftDoor.position.set(-1.45, 2.35, 0);
    frontEntranceGroup.add(leftDoor);

    // Right Glass Door Leaf
    const rightDoor = new THREE.Mesh(new THREE.BoxGeometry(2.8, 4.6, 0.08), doorGlassMat);
    rightDoor.position.set(1.45, 2.35, 0);
    frontEntranceGroup.add(rightDoor);

    // Frosted Safety Bands on Glass Doors
    [-1.45, 1.45].forEach((dx) => {
      const frostBand = new THREE.Mesh(
        new THREE.BoxGeometry(2.7, 0.25, 0.09),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3, transparent: true, opacity: 0.6 })
      );
      frostBand.position.set(dx, 2.2, 0);
      frontEntranceGroup.add(frostBand);
    });

    // Stainless Steel Vertical Tubular Pull Handles
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.15,
    });
    [-0.2, 0.2].forEach((hx) => {
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.8, 12), handleMat);
      handle.position.set(hx, 2.2, -0.15);
      frontEntranceGroup.add(handle);
    });

    // Grand Illuminated Acrylic Sign above Entrance Doors (Facing Inward)
    const entranceSignCanvas = document.createElement("canvas");
    entranceSignCanvas.width = 1024;
    entranceSignCanvas.height = 256;
    const esCtx = entranceSignCanvas.getContext("2d");
    if (esCtx) {
      esCtx.fillStyle = "#000000";
      esCtx.fillRect(0, 0, 1024, 256);
      esCtx.fillStyle = "#e5de00";
      esCtx.fillRect(10, 10, 1004, 236);
      esCtx.strokeStyle = "#000000";
      esCtx.lineWidth = 8;
      esCtx.strokeRect(10, 10, 1004, 236);

      esCtx.fillStyle = "#000000";
      esCtx.font = "bold 44px sans-serif";
      esCtx.textAlign = "center";
      esCtx.textBaseline = "middle";
      esCtx.fillText("PINTU MASUK UTAMA // LOBBY MUSEUM", 512, 85);

      esCtx.font = "bold 24px monospace";
      esCtx.fillStyle = "#1e293b";
      esCtx.fillText("XII PPLG 1 • WELCOME TO THE MEMORY & SHOWCASE GALLERY", 512, 160);
    }
    const entranceSignTex = new THREE.CanvasTexture(entranceSignCanvas);
    texturesToDispose.push(entranceSignTex);

    const entranceSignMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(6.4, 1.6),
      new THREE.MeshBasicMaterial({ map: entranceSignTex, side: THREE.FrontSide })
    );
    entranceSignMesh.position.set(0, 5.8, -0.22);
    entranceSignMesh.rotation.y = Math.PI; // Face inward into museum
    frontEntranceGroup.add(entranceSignMesh);

    // Emergency Exit Door (Pintu Darurat) on Front Left Wall
    const exitDoorGroup = new THREE.Group();
    exitDoorGroup.position.set(-11.5, 0, 0);

    const exitFrame = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 3.8, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.5 })
    );
    exitFrame.position.y = 1.9;
    exitDoorGroup.add(exitFrame);

    const exitLeaf = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 3.6, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 })
    );
    exitLeaf.position.set(0, 1.9, -0.02);
    exitDoorGroup.add(exitLeaf);

    const panicBar = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.08, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 })
    );
    panicBar.position.set(0, 1.6, -0.1);
    exitDoorGroup.add(panicBar);

    // Illuminated Green Emergency Exit Sign
    const exitSignCanvas = document.createElement("canvas");
    exitSignCanvas.width = 256;
    exitSignCanvas.height = 96;
    const exCtx = exitSignCanvas.getContext("2d");
    if (exCtx) {
      exCtx.fillStyle = "#10b981";
      exCtx.fillRect(0, 0, 256, 96);
      exCtx.strokeStyle = "#000000";
      exCtx.lineWidth = 4;
      exCtx.strokeRect(2, 2, 252, 92);

      exCtx.fillStyle = "#ffffff";
      exCtx.font = "bold 26px sans-serif";
      exCtx.textAlign = "center";
      exCtx.textBaseline = "middle";
      exCtx.fillText("EXIT // DARURAT", 128, 48);
    }
    const exitSignTex = new THREE.CanvasTexture(exitSignCanvas);
    texturesToDispose.push(exitSignTex);

    const exitSignMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, 0.45),
      new THREE.MeshBasicMaterial({ map: exitSignTex, side: THREE.FrontSide })
    );
    exitSignMesh.position.set(0, 4.1, -0.12);
    exitSignMesh.rotation.y = Math.PI;
    exitDoorGroup.add(exitSignMesh);

    frontEntranceGroup.add(exitDoorGroup);
    hallGroup.add(frontEntranceGroup);

    // 5B. MUSEUM FOYER: DIRECTORY STAND & RECEPTION DESK
    const foyerGroup = new THREE.Group();

    // 1. Standing Museum Directory Plaque (Papan Panduan & Denah Museum)
    const dirCanvas = document.createElement("canvas");
    dirCanvas.width = 512;
    dirCanvas.height = 768;
    const dirCtx = dirCanvas.getContext("2d");
    if (dirCtx) {
      dirCtx.fillStyle = "#0f172a";
      dirCtx.fillRect(0, 0, 512, 768);

      dirCtx.lineWidth = 10;
      dirCtx.strokeStyle = "#e5de00";
      dirCtx.strokeRect(5, 5, 502, 758);

      // Header
      dirCtx.fillStyle = "#e5de00";
      dirCtx.fillRect(16, 20, 480, 70);
      dirCtx.fillStyle = "#000000";
      dirCtx.font = "bold 26px sans-serif";
      dirCtx.textAlign = "center";
      dirCtx.fillText("PANDUAN PENGUNJUNG", 256, 62);

      // Section 1: Sayap Kiri
      dirCtx.fillStyle = "#1e293b";
      dirCtx.fillRect(24, 110, 464, 120);
      dirCtx.strokeStyle = "#38bdf8";
      dirCtx.lineWidth = 2;
      dirCtx.strokeRect(24, 110, 464, 120);

      dirCtx.fillStyle = "#38bdf8";
      dirCtx.font = "bold 18px monospace";
      dirCtx.textAlign = "left";
      dirCtx.fillText("⬅️ SAYAP KIRI: KELAS 10", 40, 145);
      dirCtx.fillStyle = "#f8fafc";
      dirCtx.font = "bold 14px sans-serif";
      dirCtx.fillText("Galeri Foto Masa Awal & MPLS", 40, 175);
      dirCtx.fillStyle = "#94a3b8";
      dirCtx.font = "12px monospace";
      dirCtx.fillText("42 Foto Perjalanan Angkatan 2024", 40, 202);

      // Section 2: Sayap Kanan
      dirCtx.fillStyle = "#1e293b";
      dirCtx.fillRect(24, 250, 464, 120);
      dirCtx.strokeStyle = "#e5de00";
      dirCtx.strokeRect(24, 250, 464, 120);

      dirCtx.fillStyle = "#e5de00";
      dirCtx.font = "bold 18px monospace";
      dirCtx.fillText("➡️ SAYAP KANAN: KELAS 11", 40, 285);
      dirCtx.fillStyle = "#f8fafc";
      dirCtx.font = "bold 14px sans-serif";
      dirCtx.fillText("Galeri Foto Praktikum & Karya", 40, 315);
      dirCtx.fillStyle = "#94a3b8";
      dirCtx.font = "12px monospace";
      dirCtx.fillText("15 Foto & Master Tech Stack Dashboard", 40, 342);

      // Section 3: Pusat Galeri
      dirCtx.fillStyle = "#1e293b";
      dirCtx.fillRect(24, 390, 464, 120);
      dirCtx.strokeStyle = "#4ade80";
      dirCtx.strokeRect(24, 390, 464, 120);

      dirCtx.fillStyle = "#4ade80";
      dirCtx.font = "bold 18px monospace";
      dirCtx.fillText("⬆️ PUSAT: MONUMEN KODE", 40, 425);
      dirCtx.fillStyle = "#f8fafc";
      dirCtx.font = "bold 14px sans-serif";
      dirCtx.fillText("Showcase Laptop 3D & Source Code", 40, 455);
      dirCtx.fillStyle = "#94a3b8";
      dirCtx.font = "12px monospace";
      dirCtx.fillText("Website Kelas XII PPLG 1 Live!", 40, 482);

      // Section 4: Aturan & Quotes
      dirCtx.fillStyle = "#090d16";
      dirCtx.fillRect(24, 530, 464, 210);
      dirCtx.strokeStyle = "#334155";
      dirCtx.strokeRect(24, 530, 464, 210);

      dirCtx.fillStyle = "#e2e8f0";
      dirCtx.font = "bold 15px sans-serif";
      dirCtx.fillText("📜 ATURAN MUSEUM:", 40, 565);
      dirCtx.fillStyle = "#94a3b8";
      dirCtx.font = "13px sans-serif";
      dirCtx.fillText("1. Klik pigura untuk melihat detail & cerita", 40, 595);
      dirCtx.fillText("2. Drag mouse / layar untuk putar 360°", 40, 625);
      dirCtx.fillText("3. Dilarang melupakan kenangan indah!", 40, 655);

      dirCtx.fillStyle = "#38bdf8";
      dirCtx.font = "bold 12px monospace";
      dirCtx.fillText("// SMKN 1 DEPOK • ANGKATAN 2024 - 2027", 40, 710);
    }
    const dirTex = new THREE.CanvasTexture(dirCanvas);
    texturesToDispose.push(dirTex);

    // Kiosk Stand
    const kioskStand = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 1.4, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.3, metalness: 0.6 })
    );
    kioskStand.position.set(4.2, 0.7, 11.8);
    foyerGroup.add(kioskStand);

    const kioskBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.5, 0.08, 16),
      new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.4 })
    );
    kioskBase.position.set(4.2, 0.04, 11.8);
    foyerGroup.add(kioskBase);

    // Angled Board Panel
    const kioskPanel = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 1.8, 0.06),
      new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.3 })
    );
    kioskPanel.position.set(4.2, 1.6, 11.8);
    kioskPanel.rotation.x = -0.25;
    kioskPanel.rotation.y = Math.PI;
    foyerGroup.add(kioskPanel);

    const kioskScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.14, 1.72),
      new THREE.MeshBasicMaterial({ map: dirTex })
    );
    kioskScreen.position.set(4.2, 1.6, 11.76);
    kioskScreen.rotation.x = -0.25;
    kioskScreen.rotation.y = Math.PI;
    foyerGroup.add(kioskScreen);

    // 2. Museum Reception / Guestbook Counter Desk
    const deskGroup = new THREE.Group();
    deskGroup.position.set(-4.2, 0, 11.8);
    deskGroup.rotation.y = Math.PI;

    const deskBody = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 1.1, 0.9),
      new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.4 })
    );
    deskBody.position.y = 0.55;
    deskBody.castShadow = true;
    deskGroup.add(deskBody);

    const deskTop = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 0.08, 1.0),
      new THREE.MeshStandardMaterial({ color: 0xe5de00, roughness: 0.2, metalness: 0.3 })
    );
    deskTop.position.y = 1.14;
    deskGroup.add(deskTop);

    const bookMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.04, 0.38),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.6 })
    );
    bookMesh.position.set(0.3, 1.2, 0.05);
    bookMesh.rotation.y = 0.15;
    deskGroup.add(bookMesh);

    const tabletBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.22, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.2 })
    );
    tabletBase.position.set(-0.45, 1.3, 0);
    tabletBase.rotation.x = -0.4;
    deskGroup.add(tabletBase);

    foyerGroup.add(deskGroup);

    // 3. Velvet Rope Stanchions flanking entrance aisle
    const stanchionMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.15 });
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.8 });

    [-1.8, 1.8].forEach((sx) => {
      [13.2, 11.0].forEach((sz) => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.0, 12), stanchionMat);
        post.position.set(sx, 0.5, sz);
        foyerGroup.add(post);

        const postBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.06, 16), stanchionMat);
        postBase.position.set(sx, 0.03, sz);
        foyerGroup.add(postBase);

        const postTop = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), stanchionMat);
        postTop.position.set(sx, 1.04, sz);
        foyerGroup.add(postTop);
      });

      const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.2, 8), ropeMat);
      rope.position.set(sx, 0.78, 12.1);
      rope.rotation.x = Math.PI / 2;
      foyerGroup.add(rope);
    });

    hallGroup.add(foyerGroup);

    // 5C. SUSPENDED GALLERY TRACK LIGHTS (LAMPU TRACK SOROT MUSEUM)
    const trackGroup = new THREE.Group();
    const trackPositionsX = [-11.0, 0, 11.0];

    trackPositionsX.forEach((tx) => {
      const railGeo = new THREE.BoxGeometry(0.12, 0.08, 24.0);
      const railMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.4, metalness: 0.7 });
      const rail = new THREE.Mesh(railGeo, railMat);
      rail.position.set(tx, 7.2, 0);
      trackGroup.add(rail);

      [-9, -3, 3, 9].forEach((cz) => {
        const cable = new THREE.Mesh(
          new THREE.CylinderGeometry(0.008, 0.008, 0.85, 6),
          new THREE.MeshBasicMaterial({ color: 0x64748b })
        );
        cable.position.set(tx, 7.625, cz);
        trackGroup.add(cable);
      });

      [-8, -4, 0, 4, 8].forEach((spotZ) => {
        const spotHead = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.12, 0.22, 12),
          new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 })
        );
        spotHead.position.set(tx, 7.08, spotZ);
        spotHead.rotation.x = 0.2;
        trackGroup.add(spotHead);
      });
    });
    hallGroup.add(trackGroup);

    // 5D. ADAPTIVE MUSEUM CEILING (ATAP PLAFON GALERI PINTAR DENGAN SKYLIGHT ATRIUM)
    // Uses THREE.FrontSide with downward normal:
    // - From outside / above (Y > 8.05, e.g. Hall preset Y=9 or Orbit): CULLED / 100% INVISIBLE!
    // - From inside looking up (Y < 8.05): VISIBLE with coffered acoustic panels & central glass skylight!
    const ceilingCanvas = document.createElement("canvas");
    ceilingCanvas.width = 1024;
    ceilingCanvas.height = 1024;
    const cCtx = ceilingCanvas.getContext("2d");
    if (cCtx) {
      cCtx.fillStyle = "#0a0f1d";
      cCtx.fillRect(0, 0, 1024, 1024);

      // Coffered grid lines
      cCtx.strokeStyle = "#040711";
      cCtx.lineWidth = 6;
      for (let x = 0; x <= 1024; x += 128) {
        cCtx.beginPath();
        cCtx.moveTo(x, 0);
        cCtx.lineTo(x, 1024);
        cCtx.stroke();
      }
      for (let y = 0; y <= 1024; y += 128) {
        cCtx.beginPath();
        cCtx.moveTo(0, y);
        cCtx.lineTo(1024, y);
        cCtx.stroke();
      }

      // Recessed panel details & downlights
      for (let x = 0; x < 1024; x += 128) {
        for (let y = 0; y < 1024; y += 128) {
          cCtx.fillStyle = "#111927";
          cCtx.fillRect(x + 5, y + 5, 118, 118);

          // Downlight spot
          cCtx.fillStyle = "#1e293b";
          cCtx.beginPath();
          cCtx.arc(x + 64, y + 64, 14, 0, Math.PI * 2);
          cCtx.fill();

          cCtx.fillStyle = "#fffbeb";
          cCtx.beginPath();
          cCtx.arc(x + 64, y + 64, 6, 0, Math.PI * 2);
          cCtx.fill();
        }
      }

      // Centerpiece Glass Skylight Atrium (Directly above laptop sculpture)
      cCtx.fillStyle = "#0c1e38";
      cCtx.fillRect(256, 256, 512, 512);

      cCtx.strokeStyle = "#e5de00";
      cCtx.lineWidth = 12;
      cCtx.strokeRect(256, 256, 512, 512);

      cCtx.fillStyle = "#0284c7";
      cCtx.fillRect(268, 268, 488, 488);

      cCtx.strokeStyle = "#082f49";
      cCtx.lineWidth = 6;
      for (let sx = 268 + 122; sx < 756; sx += 122) {
        cCtx.beginPath();
        cCtx.moveTo(sx, 268);
        cCtx.lineTo(sx, 756);
        cCtx.stroke();
      }
      for (let sy = 268 + 122; sy < 756; sy += 122) {
        cCtx.beginPath();
        cCtx.moveTo(268, sy);
        cCtx.lineTo(756, sy);
        cCtx.stroke();
      }

      cCtx.fillStyle = "#e5de00";
      cCtx.font = "bold 26px monospace";
      cCtx.textAlign = "center";
      cCtx.textBaseline = "middle";
      cCtx.fillText("SMKN 1 DEPOK // XII PPLG 1", 512, 512);
    }
    const ceilingTex = new THREE.CanvasTexture(ceilingCanvas);
    ceilingTex.wrapS = THREE.RepeatWrapping;
    ceilingTex.wrapT = THREE.RepeatWrapping;
    ceilingTex.repeat.set(1, 1);
    texturesToDispose.push(ceilingTex);

    const ceilingGeo = new THREE.PlaneGeometry(28.5, 28.5);
    const ceilingMat = new THREE.MeshStandardMaterial({
      map: ceilingTex,
      roughness: 0.85,
      metalness: 0.1,
      side: THREE.FrontSide, // Invisible from top/orbit, visible looking up from inside!
    });
    const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceilingMesh.position.set(0, 8.05, 0);
    ceilingMesh.rotation.x = Math.PI / 2; // Normal points straight down (0, -1, 0)
    ceilingMesh.receiveShadow = true;
    hallGroup.add(ceilingMesh);

    // Freestanding Exhibition Partition Wall in Left Wing (x = -7.0, length 18.0, height 5.8)
    const partitionMesh = new THREE.Mesh(new THREE.BoxGeometry(0.4, 5.8, 18.0), wallMat);
    partitionMesh.position.set(-7.0, 2.9, 0);
    partitionMesh.receiveShadow = true;
    hallGroup.add(partitionMesh);

    const partitionBaseboard = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.4, 18.0), wallBaseboardMat);
    partitionBaseboard.position.set(-7.0, 0.2, 0);
    hallGroup.add(partitionBaseboard);

    const partitionCrown = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.25, 18.0), borderMat);
    partitionCrown.position.set(-7.0, 5.675, 0);
    hallGroup.add(partitionCrown);

    // Grand Entrance Arch / Banner on Back Wall
    const bannerCanvas = document.createElement("canvas");
    bannerCanvas.width = 1024;
    bannerCanvas.height = 256;
    const bctx = bannerCanvas.getContext("2d");
    if (bctx) {
      bctx.fillStyle = "#000000";
      bctx.fillRect(0, 0, 1024, 256);
      bctx.fillStyle = "#e5de00";
      bctx.fillRect(12, 12, 1000, 232);
      bctx.fillStyle = "#000000";
      bctx.font = "bold 56px sans-serif";
      bctx.textAlign = "center";
      bctx.textBaseline = "middle";
      bctx.fillText("MUSEUM KENANGAN // XII PPLG 1", 512, 90);
      bctx.font = "bold 28px monospace";
      bctx.fillText("JEJAK PERJALANAN, KARYA & KEBERSAMAAN SMKN 1 DEPOK", 512, 170);
    }
    const bannerTex = new THREE.CanvasTexture(bannerCanvas);
    const bannerMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 3),
      new THREE.MeshBasicMaterial({ map: bannerTex })
    );
    bannerMesh.position.set(0, 6.2, -13.76);
    hallGroup.add(bannerMesh);

    // Centerpiece: Museum Pedestal & Sculpture
    const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.3 });
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.9, 16), pedestalMat);
    pedestal.position.set(0, 0.45, 0);
    pedestal.receiveShadow = true;
    hallGroup.add(pedestal);

    // Centerpiece: Floating Showcase 3D Laptop on Pedestal
    const centerLaptopGroup = new THREE.Group();
    centerLaptopGroup.position.set(0, 1.45, 0);

    // Laptop Chassis Materials
    const laptopBodyMat = new THREE.MeshStandardMaterial({
      color: 0x111827, // Titanium / Graphite body
      metalness: 0.85,
      roughness: 0.25,
    });
    const laptopAccentMat = new THREE.MeshStandardMaterial({
      color: 0xe5de00, // Neo-yellow gold accent edge
      metalness: 0.9,
      roughness: 0.2,
    });
    const keyboardMat = new THREE.MeshStandardMaterial({
      color: 0x030712,
      roughness: 0.7,
    });

    // 1. Laptop Base (Chassis: width: 1.6, thickness: 0.05, depth: 1.1)
    const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 1.1), laptopBodyMat);
    laptopBase.castShadow = true;
    laptopBase.receiveShadow = true;
    centerLaptopGroup.add(laptopBase);

    // Gold Accent Border
    const laptopTrim = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.02, 1.12), laptopAccentMat);
    laptopTrim.position.y = 0;
    centerLaptopGroup.add(laptopTrim);

    // Keyboard well & Keys
    const keywellMesh = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.01, 0.6), keyboardMat);
    keywellMesh.position.set(0, 0.026, -0.15);
    centerLaptopGroup.add(keywellMesh);

    // Trackpad
    const trackpadMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.4 });
    const trackpadMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.005, 0.32), trackpadMat);
    trackpadMesh.position.set(0, 0.026, 0.3);
    centerLaptopGroup.add(trackpadMesh);

    // 2. Laptop Screen Lid (Open at natural 112° viewing angle, ~22° tilted back)
    const screenHinge = new THREE.Group();
    screenHinge.position.set(0, 0.03, -0.52);
    screenHinge.rotation.x = -0.38; // ~22° tilted back (112° open angle)

    // Screen Display Canvas (Showing active code of XII PPLG 1 website!)
    const codeCanvas = document.createElement("canvas");
    codeCanvas.width = 512;
    codeCanvas.height = 320;
    const cctx = codeCanvas.getContext("2d");
    if (cctx) {
      // Dark code editor background
      cctx.fillStyle = "#090d16";
      cctx.fillRect(0, 0, 512, 320);

      // Top Tab Bar
      cctx.fillStyle = "#111827";
      cctx.fillRect(0, 0, 512, 36);
      cctx.fillStyle = "#e5de00";
      cctx.fillRect(16, 8, 160, 28);
      cctx.fillStyle = "#000000";
      cctx.font = "bold 13px monospace";
      cctx.fillText("XII-PPLG-1.tsx", 28, 26);

      // VS Code Window Dots
      cctx.fillStyle = "#ef4444";
      cctx.beginPath();
      cctx.arc(460, 18, 5, 0, Math.PI * 2);
      cctx.fill();
      cctx.fillStyle = "#f59e0b";
      cctx.beginPath();
      cctx.arc(475, 18, 5, 0, Math.PI * 2);
      cctx.fill();
      cctx.fillStyle = "#10b981";
      cctx.beginPath();
      cctx.arc(490, 18, 5, 0, Math.PI * 2);
      cctx.fill();

      // Syntax Highlighted Lines
      const lines = [
        { text: "import { Solid, Passion } from 'XII_PPLG_1';", color: "#c586c0" },
        { text: "// SMKN 1 DEPOK - GENERATION 2025", color: "#6a9955" },
        { text: "const classProfile = {", color: "#4ec9b0" },
        { text: "  name: 'XII PPLG 1',", color: "#9cdcfe" },
        { text: "  role: 'Fullstack Developers',", color: "#ce9178" },
        { text: "  totalMurid: 35,", color: "#b5cea8" },
        { text: "  status: 'READY TO GRADUATE',", color: "#ffd700" },
        { text: "};", color: "#4ec9b0" },
        { text: "console.log('Kenangan Selamanya!');", color: "#dcdcaa" },
      ];
      cctx.font = "bold 14px monospace";
      lines.forEach((l, idx) => {
        cctx.fillStyle = l.color;
        cctx.fillText(l.text, 24, 66 + idx * 24);
      });

      // Bottom blue status bar
      cctx.fillStyle = "#007acc";
      cctx.fillRect(0, 296, 512, 24);
      cctx.fillStyle = "#ffffff";
      cctx.font = "bold 12px monospace";
      cctx.fillText("UTF-8 • TYPESCRIPT • THREE.JS 3D • ONLINE", 16, 312);
    }
    const codeScreenTex = new THREE.CanvasTexture(codeCanvas);
    codeScreenTex.colorSpace = THREE.SRGBColorSpace;

    // Screen Lid Geometry & Multi-material
    const screenLidGeo = new THREE.BoxGeometry(1.6, 1.05, 0.035);
    const screenDisplayMat = new THREE.MeshBasicMaterial({ map: codeScreenTex });
    // Box face materials: [+X, -X, +Y, -Y, +Z (Front screen display), -Z (Back lid)]
    const lidMaterials = [
      laptopBodyMat,
      laptopBodyMat,
      laptopBodyMat,
      laptopBodyMat,
      screenDisplayMat, // Facing front / inside
      laptopBodyMat,    // Back lid
    ];
    const screenMesh = new THREE.Mesh(screenLidGeo, lidMaterials);
    screenMesh.position.set(0, 0.52, 0);
    screenMesh.castShadow = true;
    screenHinge.add(screenMesh);

    // Glowing School Logo on Back of Laptop Lid (-Z face)
    const logoCanvas = document.createElement("canvas");
    logoCanvas.width = 128;
    logoCanvas.height = 128;
    const lctx = logoCanvas.getContext("2d");
    if (lctx) {
      lctx.fillStyle = "#111827";
      lctx.fillRect(0, 0, 128, 128);
      // Glowing neon yellow logo
      lctx.fillStyle = "#e5de00";
      lctx.beginPath();
      lctx.arc(64, 64, 46, 0, Math.PI * 2);
      lctx.fill();
      lctx.fillStyle = "#000000";
      lctx.font = "900 24px sans-serif";
      lctx.textAlign = "center";
      lctx.textBaseline = "middle";
      lctx.fillText("PPLG 1", 64, 64);
    }
    const logoTex = new THREE.CanvasTexture(logoCanvas);
    const backLogoMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.36, 0.36),
      new THREE.MeshBasicMaterial({ map: logoTex })
    );
    backLogoMesh.position.set(0, 0.52, -0.019);
    backLogoMesh.rotation.y = Math.PI; // Face outwards on back lid
    screenHinge.add(backLogoMesh);

    centerLaptopGroup.add(screenHinge);
    hallGroup.add(centerLaptopGroup);

    // Museum Benches in the hall (for sitting & appreciating art)
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const benchLegMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.4 });
    const createBench = (x: number, z: number, rotY = 0) => {
      const bg = new THREE.Group();
      bg.position.set(x, 0, z);
      bg.rotation.y = rotY;

      const seat = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.18, 0.9), benchMat);
      seat.position.y = 0.65;
      seat.castShadow = true;
      bg.add(seat);

      [-1.2, 1.2].forEach((lx) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 0.7), benchLegMat);
        leg.position.set(lx, 0.28, 0);
        leg.castShadow = true;
        bg.add(leg);
      });
      return bg;
    };
    hallGroup.add(createBench(0, 6.5, 0)); // Front central bench
    hallGroup.add(createBench(0, -6.5, Math.PI)); // Rear central bench
    hallGroup.add(createBench(6.5, 0, -Math.PI / 2)); // Right wing bench

    scene.add(hallGroup);

    // 6. 3D PICTURE FRAMES & ARTWORK MOUNTING
    const interactiveMeshes: THREE.Mesh[] = [];
    const artMap = new Map<string, { frame: THREE.Mesh; camPos: THREE.Vector3; lookPos: THREE.Vector3 }>();
    const textureLoader = new THREE.TextureLoader();

    // Reusable Materials for Art Frames
    const frameOuterMat = new THREE.MeshStandardMaterial({
      color: 0x090d16, // Matte black Neobrutalist beveled frame
      roughness: 0.4,
    });
    const frameGoldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xe5de00,
      metalness: 0.8,
      roughness: 0.2,
    });
    const matBoardMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Shared Geometries (massive memory & CPU allocation optimization across all 30 frames)
    const sharedFrameGeo = new THREE.BoxGeometry(2.7, 1.9, 0.12);
    const sharedGoldTrimGeo = new THREE.BoxGeometry(2.74, 1.94, 0.04);
    const sharedMatBoardGeo = new THREE.PlaneGeometry(2.45, 1.65);
    const sharedPhotoGeo = new THREE.PlaneGeometry(2.25, 1.45);
    const sharedPlaqueGeo = new THREE.PlaneGeometry(1.6, 0.4);
    const sharedLampArmGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8);
    const sharedLampHeadGeo = new THREE.BoxGeometry(0.35, 0.12, 0.15);

    // Staggered Progressive Texture Loading Queue
    const textureLoadQueue: (() => void)[] = [];

    // Separate artworks into Left Wing (Kelas 10), Right Wing (Kelas 11), and Center (Others)
    const k10Items = memoriesData.filter((m) => m.category === "Kelas 10");
    const k11Items = memoriesData.filter((m) => m.category === "Kelas 11");
    const otherItems = memoriesData.filter((m) => m.category !== "Kelas 10" && m.category !== "Kelas 11");

    // Layout configuration on the gallery walls:
    // Left Wall (x = -13.78): facing +X (rotY = Math.PI / 2), z ranges from -11 to +11
    // Right Wall (x = 13.78): facing -X (rotY = -Math.PI / 2), z ranges from -11 to +11
    // Center Wall (z = -13.78): facing +Z (rotY = 0), x ranges from -11 to +11

    // Shared lightweight placeholder texture (only 1 canvas allocated for all 57 artworks)
    const sharedPlaceholderCanvas = document.createElement("canvas");
    sharedPlaceholderCanvas.width = 256;
    sharedPlaceholderCanvas.height = 192;
    const spCtx = sharedPlaceholderCanvas.getContext("2d");
    if (spCtx) {
      spCtx.fillStyle = "#0c1322";
      spCtx.fillRect(0, 0, 256, 192);
      spCtx.fillStyle = "#e5de00";
      spCtx.font = "bold 18px sans-serif";
      spCtx.textAlign = "center";
      spCtx.textBaseline = "middle";
      spCtx.fillText("XII PPLG 1", 128, 86);
      spCtx.fillStyle = "#38bdf8";
      spCtx.font = "bold 12px monospace";
      spCtx.fillText("MEMUAT FOTO...", 128, 116);
    }
    const sharedPlaceholderTex = new THREE.CanvasTexture(sharedPlaceholderCanvas);

    // Optimized texture cache & downsampler:
    // Capping max dimension to 512px drops VRAM from 48MB to ~0.8MB per photo!
    // 57 photos = ~45MB total VRAM instead of 2.6GB, completely stopping mobile Chrome OOM crashes!
    const downscaledTexCache = new Map<string, THREE.CanvasTexture>();

    const loadDownscaledTexture = (
      src: string,
      onSuccess: (tex: THREE.CanvasTexture) => void
    ) => {
      if (downscaledTexCache.has(src)) {
        onSuccess(downscaledTexCache.get(src)!);
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.decoding = "async";
      img.onload = () => {
        const maxDim = 512;
        let w = img.naturalWidth || img.width;
        let h = img.naturalHeight || img.height;
        if (w > maxDim || h > maxDim) {
          if (w >= h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const offscreen = document.createElement("canvas");
        offscreen.width = w;
        offscreen.height = h;
        const ctx = offscreen.getContext("2d");
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "medium";
          ctx.drawImage(img, 0, 0, w, h);
        }
        const tex = new THREE.CanvasTexture(offscreen);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.generateMipmaps = false;
        tex.minFilter = THREE.LinearFilter;
        downscaledTexCache.set(src, tex);
        onSuccess(tex);
      };
      img.src = src;
    };

    const placeArtworkOnWall = (
      item: MemoryItem,
      x: number,
      y: number,
      z: number,
      rotY: number,
      wallNormal: THREE.Vector3
    ) => {
      const artGroup = new THREE.Group();
      artGroup.position.set(x, y, z);
      artGroup.rotation.y = rotY;

      // 1. Outer Frame (reusing shared geometry)
      const frameMesh = new THREE.Mesh(sharedFrameGeo, frameOuterMat);
      frameMesh.castShadow = true;
      frameMesh.receiveShadow = true;
      artGroup.add(frameMesh);

      // Gold Accent Edge
      const goldTrim = new THREE.Mesh(sharedGoldTrimGeo, frameGoldTrimMat);
      goldTrim.position.z = -0.04;
      artGroup.add(goldTrim);

      // 2. White Mat Board (Passe-partout)
      const matBoard = new THREE.Mesh(sharedMatBoardGeo, matBoardMat);
      matBoard.position.z = 0.062;
      artGroup.add(matBoard);

      // 3. Artwork Image Canvas Texture
      const photoMat = new THREE.MeshBasicMaterial({ map: sharedPlaceholderTex });
      const photoMesh = new THREE.Mesh(sharedPhotoGeo, photoMat);
      photoMesh.position.z = 0.066;
      photoMesh.userData = { memory: item, isArtwork: true };
      artGroup.add(photoMesh);
      interactiveMeshes.push(photoMesh);

      // Progressive texture loading: push to queue to avoid main-thread and GPU upload freeze
      textureLoadQueue.push(() => {
        loadDownscaledTexture(item.src, (loadedTex) => {
          photoMat.map = loadedTex;
          photoMat.needsUpdate = true;
        });
      });

      // 4. Brass Plaque under Frame (Curator Label) - Compact 384x96 canvas
      const plaqueCanvas = document.createElement("canvas");
      plaqueCanvas.width = 384;
      plaqueCanvas.height = 96;
      const pctx = plaqueCanvas.getContext("2d");
      if (pctx) {
        pctx.fillStyle = "#000000";
        pctx.fillRect(0, 0, 384, 96);
        pctx.fillStyle = "#facc15";
        pctx.fillRect(5, 5, 374, 86);
        pctx.fillStyle = "#000000";
        pctx.font = "bold 22px sans-serif";
        pctx.textAlign = "center";
        pctx.fillText(item.title, 192, 40);
        pctx.font = "bold 14px monospace";
        pctx.fillStyle = "#1e293b";
        pctx.fillText(`${item.category} • ${item.date || "XII PPLG 1"}`, 192, 70);
      }
      const plaqueTex = new THREE.CanvasTexture(plaqueCanvas);
      const plaqueMesh = new THREE.Mesh(
        sharedPlaqueGeo,
        new THREE.MeshBasicMaterial({ map: plaqueTex })
      );
      plaqueMesh.position.set(0, -1.25, 0.06);
      artGroup.add(plaqueMesh);


      // 5. Overhead Spotlight Fixture
      const lampArm = new THREE.Mesh(sharedLampArmGeo, frameOuterMat);
      lampArm.position.set(0, 1.25, 0.3);
      lampArm.rotation.x = Math.PI / 2.8;
      artGroup.add(lampArm);

      const lampHead = new THREE.Mesh(sharedLampHeadGeo, frameGoldTrimMat);
      lampHead.position.set(0, 1.35, 0.45);
      artGroup.add(lampHead);

      scene.add(artGroup);

      // Calculate viewing camera position right in front of this artwork
      const worldPos = new THREE.Vector3(x, y, z);
      const camPos = worldPos.clone().add(wallNormal.clone().multiplyScalar(3.2));
      camPos.y = Math.max(camPos.y, 2.0);

      artMap.set(item.id.toString(), {
        frame: photoMesh,
        camPos,
        lookPos: worldPos.clone(),
      });
    };

    // Position Left Wing Artworks (Kelas 10 - Total 42 Artworks across 4 wall faces):
    // 1. Left Outer Wall (16 frames: 2 rows of 8)
    // 2. Left Back Wall (6 frames: 2 rows of 3)
    // 3. Freestanding Partition Outer Face (10 frames: 2 rows of 5)
    // 4. Freestanding Partition Inner Face (10 frames: 2 rows of 5)
    // Total = 16 + 6 + 10 + 10 = 42 distinct slots!
    k10Items.forEach((item, idx) => {
      if (idx < 16) {
        // Left Outer Wall (x = -13.78)
        const col = idx % 8;
        const row = Math.floor(idx / 8);
        const zPos = -11.2 + col * (22.4 / 7);
        const yPos = row === 0 ? 3.95 : 1.6;
        placeArtworkOnWall(item, -13.78, yPos, zPos, Math.PI / 2, new THREE.Vector3(1, 0, 0));
      } else if (idx < 22) {
        // Back Wall - Left Wing (z = -13.78)
        const subIdx = idx - 16;
        const col = subIdx % 3;
        const row = Math.floor(subIdx / 3);
        const xPos = -12.2 + col * 2.9;
        const yPos = row === 0 ? 3.95 : 1.6;
        placeArtworkOnWall(item, xPos, yPos, -13.78, 0, new THREE.Vector3(0, 0, 1));
      } else if (idx < 32) {
        // Freestanding Partition Wall - Outer Face (x = -7.22, facing left wall)
        const subIdx = idx - 22;
        const col = subIdx % 5;
        const row = Math.floor(subIdx / 5);
        const zPos = -6.4 + col * 3.2;
        const yPos = row === 0 ? 3.85 : 1.55;
        placeArtworkOnWall(item, -7.22, yPos, zPos, -Math.PI / 2, new THREE.Vector3(-1, 0, 0));
      } else {
        // Freestanding Partition Wall - Inner Face (x = -6.78, facing center hall)
        const subIdx = idx - 32;
        const col = subIdx % 5;
        const row = Math.floor(subIdx / 5);
        const zPos = -6.4 + col * 3.2;
        const yPos = row === 0 ? 3.85 : 1.55;
        placeArtworkOnWall(item, -6.78, yPos, zPos, Math.PI / 2, new THREE.Vector3(1, 0, 0));
      }
    });

    // Position Right Wing Artworks (Kelas 11 - Total 15 Artworks):
    // Right Outer Wall (x = 13.78)
    // Upper row: 8 frames, Lower row: 7 frames (centered)
    k11Items.forEach((item, idx) => {
      if (idx < 8) {
        const zPos = -11.2 + idx * (22.4 / 7);
        placeArtworkOnWall(item, 13.78, 3.95, zPos, -Math.PI / 2, new THREE.Vector3(-1, 0, 0));
      } else {
        const subIdx = idx - 8;
        const zPos = -9.6 + subIdx * (19.2 / 6);
        placeArtworkOnWall(item, 13.78, 1.6, zPos, -Math.PI / 2, new THREE.Vector3(-1, 0, 0));
      }
    });

    // Position Any Other Artworks along Center Back Wall (z = -13.78)
    otherItems.forEach((item, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const xPos = 6.4 + col * 2.9;
      const yPos = row === 0 ? 3.95 : 1.6;
      placeArtworkOnWall(item, xPos, yPos, -13.78, 0, new THREE.Vector3(0, 0, 1));
    });

    artMeshesMapRef.current = artMap;

    // 6.5 UNIFIED MASTER COMMAND & STATS WALLBOARD (Right Wing Back Wall: x = 6.4 to 11.6, y = 1.1 to 3.7)
    // Strictly separated from Museum Banner (Banner: x: [-6, 6], y: [4.7, 7.7]).
    // Positioned centered at x = 9.0, y = 2.4, z = -13.75.
    // Zero collision horizontally (x >= 6.4 > 6.0) and vertically (y <= 3.7 < 4.7)!
    // One single seamless high-definition display, zero mesh overlap, zero clipping!

    // High-Resolution 2:1 Master Canvas
    const dashCanvas = document.createElement("canvas");
    dashCanvas.width = 1536;
    dashCanvas.height = 768;
    const dctx = dashCanvas.getContext("2d");
    if (dctx) {
      // 1. Deep Space Tech Slate Background
      dctx.fillStyle = "#080d19";
      dctx.fillRect(0, 0, 1536, 768);

      // Subtle Tech Blueprint Grid
      dctx.strokeStyle = "rgba(30, 41, 59, 0.5)";
      dctx.lineWidth = 1;
      for (let gx = 0; gx < 1536; gx += 48) {
        dctx.beginPath();
        dctx.moveTo(gx, 0);
        dctx.lineTo(gx, 768);
        dctx.stroke();
      }
      for (let gy = 0; gy < 768; gy += 48) {
        dctx.beginPath();
        dctx.moveTo(0, gy);
        dctx.lineTo(1536, gy);
        dctx.stroke();
      }

      // Outer Frame Accent (Bold Neobrutalist Yellow Border)
      dctx.strokeStyle = "#e5de00";
      dctx.lineWidth = 6;
      dctx.strokeRect(8, 8, 1520, 752);

      // 2. Top Header Bar
      dctx.fillStyle = "#0f172a";
      dctx.fillRect(16, 16, 1504, 66);
      dctx.strokeStyle = "#1e293b";
      dctx.lineWidth = 2;
      dctx.strokeRect(16, 16, 1504, 66);

      // Status indicator glowing dot
      dctx.fillStyle = "#22c55e";
      dctx.beginPath();
      dctx.arc(42, 49, 9, 0, Math.PI * 2);
      dctx.fill();

      // Header Text
      dctx.fillStyle = "#ffffff";
      dctx.font = "900 24px sans-serif";
      dctx.textAlign = "left";
      dctx.fillText("XII PPLG 1 // COMMAND & ARCHIVE CENTER", 64, 56);

      dctx.fillStyle = "#94a3b8";
      dctx.font = "bold 14px monospace";
      dctx.fillText("SMKN 1 DEPOK • REKAYASA PERANGKAT LUNAK & GIM", 620, 56);

      dctx.fillStyle = "#e5de00";
      dctx.font = "bold 13px monospace";
      dctx.textAlign = "right";
      dctx.fillText("LIVE STATS • ANGKATAN 2024-2027", 1500, 56);

      // 3. Top Metrics Row (4 Hero Cards)
      const heroMetrics = [
        {
          num: "35",
          label: "TOTAL MURID KELAS",
          sub: "22 Cowo (Laki-laki) • 13 Cewe (Perempuan)",
          color: "#e5de00",
          cardBg: "#0c1424",
          borderColor: "#e5de00",
        },
        {
          num: "2024",
          label: "TAHUN MASUK",
          sub: "Resmi Bergabung di SMKN 1 Depok",
          color: "#38bdf8",
          cardBg: "#09172a",
          borderColor: "#38bdf8",
        },
        {
          num: "2027",
          label: "TAHUN KELULUSAN",
          sub: "Target Kelulusan Angkatan 2024-2027",
          color: "#4ade80",
          cardBg: "#091f1a",
          borderColor: "#4ade80",
        },
        {
          num: "57",
          label: "FOTO MEMORI",
          sub: "42 Kls 10 (Sayap Kiri) • 15 Kls 11 (Sayap Kanan)",
          color: "#f43f5e",
          cardBg: "#1f0f18",
          borderColor: "#f43f5e",
        },
      ];

      heroMetrics.forEach((m, idx) => {
        const mx = 24 + idx * 373;
        const my = 98;
        const mw = 360;
        const mh = 144;

        dctx.fillStyle = m.cardBg;
        dctx.fillRect(mx, my, mw, mh);
        dctx.strokeStyle = m.borderColor;
        dctx.lineWidth = 2.5;
        dctx.strokeRect(mx, my, mw, mh);

        dctx.fillStyle = m.color;
        dctx.font = "900 52px sans-serif";
        dctx.textAlign = "left";
        dctx.fillText(m.num, mx + 20, my + 58);

        dctx.fillStyle = "#ffffff";
        dctx.font = "bold 15px sans-serif";
        dctx.fillText(m.label, mx + 20, my + 92);

        dctx.fillStyle = "#94a3b8";
        dctx.font = "12px monospace";
        dctx.fillText(m.sub, mx + 20, my + 120);
      });

      // 4. Main 3 Feature Columns (y = 258 to 672)
      // Column 1: Tech Stack & Lab (x = 24, width 460)
      const c1x = 24;
      const c1w = 460;
      dctx.fillStyle = "#0a1020";
      dctx.fillRect(c1x, 258, c1w, 414);
      dctx.strokeStyle = "#1e293b";
      dctx.lineWidth = 2;
      dctx.strokeRect(c1x, 258, c1w, 414);

      dctx.fillStyle = "#0f1f38";
      dctx.fillRect(c1x + 8, 266, c1w - 16, 42);
      dctx.fillStyle = "#38bdf8";
      dctx.font = "bold 16px sans-serif";
      dctx.textAlign = "left";
      dctx.fillText("💻 TECH STACK & PRAKTIKUM", c1x + 20, 293);

      // 15 Tech Stacks from public/asset-techstack (Text-only badges, 3 columns x 5 rows)
      const stackItems = [
        "HTML5", "CSS3", "JavaScript",
        "PHP", "Laravel", "MySQL",
        "Java", "Android", "Unity",
        "Blender", "VS Code", "Figma",
        "GitHub", "Laragon", "phpMyAdmin",
      ];
      stackItems.forEach((st, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const bx = c1x + 14 + col * 144;
        const by = 316 + row * 32;
        dctx.fillStyle = "#0f172a";
        dctx.fillRect(bx, by, 134, 25);
        dctx.strokeStyle = "#38bdf8";
        dctx.lineWidth = 1.5;
        dctx.strokeRect(bx, by, 134, 25);

        dctx.fillStyle = "#ffffff";
        dctx.font = "bold 11px monospace";
        dctx.textAlign = "center";
        dctx.fillText(st, bx + 67, by + 17);
      });

      // Praktikum Kejuruan Logs at bottom of col 1
      dctx.fillStyle = "#090d16";
      dctx.fillRect(c1x + 14, 480, c1w - 28, 180);
      dctx.strokeStyle = "#1e293b";
      dctx.lineWidth = 1.5;
      dctx.strokeRect(c1x + 14, 480, c1w - 28, 180);

      dctx.fillStyle = "#e5de00";
      dctx.font = "bold 12px monospace";
      dctx.textAlign = "left";
      dctx.fillText("> PRAKTIKUM KEJURUAN PPLG:", c1x + 26, 503);
      dctx.fillStyle = "#38bdf8";
      dctx.font = "11px sans-serif";
      dctx.fillText("✓ PBO & Logika: Java & VS Code", c1x + 26, 526);
      dctx.fillStyle = "#4ade80";
      dctx.fillText("✓ Web Dinamis: HTML5, CSS3, JavaScript", c1x + 26, 550);
      dctx.fillStyle = "#facc15";
      dctx.fillText("✓ Backend & Server: PHP, Laravel, Laragon", c1x + 26, 574);
      dctx.fillStyle = "#38bdf8";
      dctx.fillText("✓ Basis Data: MySQL & phpMyAdmin", c1x + 26, 598);
      dctx.fillStyle = "#c084fc";
      dctx.fillText("✓ Gim, 3D & UI: Unity, Blender, Figma, GitHub", c1x + 26, 622);
      dctx.fillStyle = "#94a3b8";
      dctx.font = "10px monospace";
      dctx.fillText("> ALL LAB MODULES & TASKS COMPLETE", c1x + 26, 646);


      // Column 2: Activity Heatmap & Class Spirit (x = 500, width 520)
      const c2x = 500;
      const c2w = 520;
      dctx.fillStyle = "#0a1020";
      dctx.fillRect(c2x, 258, c2w, 414);
      dctx.strokeStyle = "#1e293b";
      dctx.lineWidth = 2;
      dctx.strokeRect(c2x, 258, c2w, 414);

      dctx.fillStyle = "#0d261e";
      dctx.fillRect(c2x + 8, 266, c2w - 16, 42);
      dctx.fillStyle = "#4ade80";
      dctx.font = "bold 16px sans-serif";
      dctx.fillText("📊 AKTIVITAS KODING & KARYA", c2x + 20, 293);

      dctx.fillStyle = "#94a3b8";
      dctx.font = "12px sans-serif";
      dctx.fillText("Intensitas praktikum & commit project siswa XII PPLG 1", c2x + 20, 330);

      // Heatmap Grid (6 rows x 16 columns)
      const heatColors = ["#14253d", "#155e75", "#0e7490", "#22c55e", "#4ade80", "#e5de00"];
      const gridPattern = [
        [1, 2, 3, 4, 3, 2, 1, 4, 5, 4, 3, 2, 4, 5, 3, 4],
        [2, 3, 4, 5, 4, 3, 2, 5, 4, 5, 4, 3, 5, 4, 4, 5],
        [1, 1, 2, 3, 2, 1, 0, 3, 4, 3, 2, 1, 3, 4, 2, 3],
        [3, 4, 5, 4, 5, 4, 3, 4, 5, 5, 4, 3, 4, 5, 5, 4],
        [2, 3, 3, 4, 3, 2, 1, 4, 3, 4, 3, 2, 3, 4, 3, 4],
        [1, 2, 4, 5, 4, 3, 2, 3, 5, 4, 5, 4, 2, 4, 5, 5],
      ];
      for (let r = 0; r < 6; r++) {
        for (let cl = 0; cl < 16; cl++) {
          const sx = c2x + 20 + cl * 29.5;
          const sy = 350 + r * 25;
          const val = gridPattern[r][cl];
          dctx.fillStyle = heatColors[val];
          dctx.fillRect(sx, sy, 25, 20);
        }
      }

      // Heatmap legend
      dctx.fillStyle = "#94a3b8";
      dctx.font = "11px monospace";
      dctx.fillText("Kurang Aktif", c2x + 20, 522);
      heatColors.forEach((hc, hi) => {
        dctx.fillStyle = hc;
        dctx.fillRect(c2x + 115 + hi * 22, 510, 16, 14);
      });
      dctx.fillStyle = "#94a3b8";
      dctx.fillText("Sangat Aktif", c2x + 260, 522);

      // Class Spirit Box
      dctx.fillStyle = "#0f172a";
      dctx.fillRect(c2x + 16, 546, c2w - 32, 110);
      dctx.strokeStyle = "#e5de00";
      dctx.lineWidth = 1.5;
      dctx.strokeRect(c2x + 16, 546, c2w - 32, 110);

      dctx.fillStyle = "#e5de00";
      dctx.font = "bold 13px monospace";
      dctx.fillText("KULTUR & SEMANGAT KELAS:", c2x + 30, 574);
      dctx.fillStyle = "#ffffff";
      dctx.font = "italic 13px sans-serif";
      dctx.fillText("“Saling bantu ketika error, belajar bersama saat ujian,", c2x + 30, 600);
      dctx.fillText("dan terus melangkah maju sampai lulus bersama di 2027.”", c2x + 30, 624);

      // Column 3: Roadmap Timeline (x = 1036, width 476)
      const c3x = 1036;
      const c3w = 476;
      dctx.fillStyle = "#0a1020";
      dctx.fillRect(c3x, 258, c3w, 414);
      dctx.strokeStyle = "#1e293b";
      dctx.lineWidth = 2;
      dctx.strokeRect(c3x, 258, c3w, 414);

      dctx.fillStyle = "#251c08";
      dctx.fillRect(c3x + 8, 266, c3w - 16, 42);
      dctx.fillStyle = "#e5de00";
      dctx.font = "bold 16px sans-serif";
      dctx.fillText("🚀 ROADMAP ANGKATAN 2024 - 2027", c3x + 20, 293);

      const roadmapSteps = [
        {
          badge: "2024 - 2025 // FASE 1: KELAS 10 (AWAL MASUK)",
          title: "Resmi Masuk SMKN 1 Depok & Fondasi Logika",
          desc: "MPLS, algoritma pemrograman dasar, dan awal terjalinnya ikatan.",
          color: "#38bdf8",
          boxBg: "#0c1b2f",
        },
        {
          badge: "2025 - 2026 // FASE 2: KELAS 11 (EKSPLORASI)",
          title: "Web Development, Basis Data & Kolaborasi Tim",
          desc: "Penguasaan materi kejuruan mendalam dan berbagai project nyata.",
          color: "#e5de00",
          boxBg: "#211e0a",
        },
        {
          badge: "2026 - 2027 // FASE 3: KELAS 12 (KELULUSAN)",
          title: "Uji Kompetensi (UKK) & Kelulusan Gemilang",
          desc: "Pematangan portofolio, persiapan karir IT & wisuda 2027.",
          color: "#4ade80",
          boxBg: "#0e2319",
        },
      ];

      roadmapSteps.forEach((step, si) => {
        const sy = 320 + si * 114;
        dctx.fillStyle = step.boxBg;
        dctx.fillRect(c3x + 16, sy, c3w - 32, 102);
        dctx.strokeStyle = step.color;
        dctx.lineWidth = 1.5;
        dctx.strokeRect(c3x + 16, sy, c3w - 32, 102);

        dctx.fillStyle = step.color;
        dctx.font = "bold 12px monospace";
        dctx.fillText(step.badge, c3x + 28, sy + 25);

        dctx.fillStyle = "#ffffff";
        dctx.font = "bold 13px sans-serif";
        dctx.fillText(step.title, c3x + 28, sy + 52);

        dctx.fillStyle = "#94a3b8";
        dctx.font = "11px sans-serif";
        dctx.fillText(step.desc, c3x + 28, sy + 78);
      });

      // 5. Bottom Slogan & Footer Bar
      dctx.fillStyle = "#0f172a";
      dctx.fillRect(16, 686, 1504, 66);
      dctx.strokeStyle = "#1e293b";
      dctx.lineWidth = 2;
      dctx.strokeRect(16, 686, 1504, 66);

      dctx.fillStyle = "#e5de00";
      dctx.font = "bold 13px monospace";
      dctx.fillText("SLOGAN ANGKATAN:", 36, 725);
      dctx.fillStyle = "#ffffff";
      dctx.font = "italic 15px sans-serif";
      dctx.fillText("“Logic, Code, and Creativity — Berjuang bersama, maju bersama.”", 185, 725);

      dctx.fillStyle = "#38bdf8";
      dctx.font = "bold 12px monospace";
      dctx.textAlign = "right";
      dctx.fillText("SMKN 1 DEPOK • ALL SYSTEMS NOMINAL", 1500, 725);
    }
    const dashTex = new THREE.CanvasTexture(dashCanvas);
    dashTex.colorSpace = THREE.SRGBColorSpace;
    dashTex.generateMipmaps = false;
    dashTex.minFilter = THREE.LinearFilter;

    // Single Master Display Frame (Width 5.3m, Height 2.7m)
    // Centered at x = 9.0, y = 2.4, z = -13.75
    const dashChassisGeo = new THREE.BoxGeometry(5.3, 2.7, 0.12);
    const dashChassis = new THREE.Mesh(dashChassisGeo, frameOuterMat);
    dashChassis.position.set(9.0, 2.4, -13.78);
    dashChassis.castShadow = true;
    scene.add(dashChassis);

    const dashTrimGeo = new THREE.BoxGeometry(5.34, 2.74, 0.04);
    const dashTrim = new THREE.Mesh(dashTrimGeo, frameGoldTrimMat);
    dashTrim.position.set(9.0, 2.4, -13.73);
    scene.add(dashTrim);

    const dashScreenGeo = new THREE.PlaneGeometry(5.1, 2.5);
    const dashScreenMat = new THREE.MeshBasicMaterial({ map: dashTex });
    const dashScreenMesh = new THREE.Mesh(dashScreenGeo, dashScreenMat);
    dashScreenMesh.position.set(9.0, 2.4, -13.70);
    dashScreenMesh.userData = { isDashboard: true };
    scene.add(dashScreenMesh);
    interactiveMeshes.push(dashScreenMesh);

    // Wall Mount Brackets Behind Frame
    const bracketGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.35, 8);
    const bracketMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.8 });
    [7.5, 10.5].forEach((bx) => {
      const br = new THREE.Mesh(bracketGeo, bracketMat);
      br.rotation.x = Math.PI / 2;
      br.position.set(bx, 2.4, -13.88);
      scene.add(br);
    });

    // Twin Overhead Museum Lamp Fixtures Illuminating Dashboard
    [-1.5, 1.5].forEach((lxOffset) => {
      const lampArm = new THREE.Mesh(sharedLampArmGeo, frameOuterMat);
      lampArm.position.set(9.0 + lxOffset, 3.85, -13.48);
      lampArm.rotation.x = Math.PI / 2.8;
      scene.add(lampArm);

      const lampHead = new THREE.Mesh(sharedLampHeadGeo, frameGoldTrimMat);
      lampHead.position.set(9.0 + lxOffset, 3.95, -13.33);
      scene.add(lampHead);
    });

    // Ambient Screen Point Light
    const videoWallLight = new THREE.PointLight(0x38bdf8, 1.3, 10);
    videoWallLight.position.set(9.0, 2.4, -12.2);
    scene.add(videoWallLight);

    // Floor Decal Platform
    const zoneCanvas = document.createElement("canvas");
    zoneCanvas.width = 512;
    zoneCanvas.height = 128;
    const zctx = zoneCanvas.getContext("2d");
    if (zctx) {
      zctx.fillStyle = "#0c1322";
      zctx.fillRect(0, 0, 512, 128);
      zctx.strokeStyle = "#e5de00";
      zctx.lineWidth = 6;
      zctx.setLineDash([16, 12]);
      zctx.strokeRect(6, 6, 500, 116);
      zctx.setLineDash([]);
      zctx.fillStyle = "#e5de00";
      zctx.font = "bold 22px monospace";
      zctx.textAlign = "center";
      zctx.fillText("// ZONA DASHBOARD & DATA KELAS //", 256, 54);
      zctx.fillStyle = "#94a3b8";
      zctx.font = "bold 14px monospace";
      zctx.fillText("STAND TO VIEW FULL CLASS STATS & ROADMAP", 256, 88);
    }
    const zoneTex = new THREE.CanvasTexture(zoneCanvas);
    const zoneMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(5.4, 1.8),
      new THREE.MeshBasicMaterial({ map: zoneTex })
    );
    zoneMesh.rotation.x = -Math.PI / 2;
    zoneMesh.position.set(9.0, 0.015, -11.2);
    scene.add(zoneMesh);


    // Start progressive texture loading: load 1 image every 25ms to quickly ready all photos in background
    let queueTimer: ReturnType<typeof setTimeout> | null = null;
    let queueIndex = 0;
    const processNextTexture = () => {
      if (queueIndex < textureLoadQueue.length) {
        textureLoadQueue[queueIndex]();
        queueIndex++;
        // Pre-render a frame periodically to prime WebGL buffer in background
        if (queueIndex % 10 === 0 || queueIndex === textureLoadQueue.length) {
          renderer.render(scene, camera);
        }
        queueTimer = setTimeout(processNextTexture, 25);
      }
    };
    setTimeout(processNextTexture, 50);

    // 7. RAYCASTING & POINTER INTERACTION
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let isDragging = false;
    let pointerStartX = 0;
    let pointerStartY = 0;

    const getPointerPos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
      };
    };

    const handleHoverCheck = (e: PointerEvent) => {
      const p = getPointerPos(e);
      pointer.x = p.x;
      pointer.y = p.y;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        if (hit.userData.isArtwork) {
          canvas.style.cursor = "pointer";
          setHoveredMemory(hit.userData.memory as MemoryItem);
          setIsHoveringDashboard(false);
          return;
        }
        if (hit.userData.isDashboard) {
          canvas.style.cursor = "pointer";
          setIsHoveringDashboard(true);
          setHoveredMemory(null);
          return;
        }
      }

      canvas.style.cursor = "grab";
      setHoveredMemory(null);
      setIsHoveringDashboard(false);
    };

    const handleClickCheck = (e: PointerEvent) => {
      const p = getPointerPos(e);
      pointer.x = p.x;
      pointer.y = p.y;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        if (hit.userData.isArtwork) {
          const item = hit.userData.memory as MemoryItem;
          focusOnArtwork(item);
        } else if (hit.userData.isDashboard) {
          handlePresetView("dashboard");
        }
      }
    };


    const onPointerDown = (e: PointerEvent) => {
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      isDragging = false;
      canvas.style.cursor = "grabbing";

      if (animationTargetRef.current.active) {
        animationTargetRef.current.active = false;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY);
      if (dist > 6) {
        isDragging = true;
        canvas.style.cursor = "grabbing";
      } else if (!isDragging) {
        handleHoverCheck(e);
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      canvas.style.cursor = "grab";
      if (!isDragging) {
        handleClickCheck(e);
      }
      setTimeout(() => {
        isDragging = false;
      }, 60);
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);

    // Keyboard listener for First-Person Walk Mode
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isWalkModeRef.current) return;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyA", "KeyS", "KeyD"].includes(e.code)) {
        e.preventDefault();
      }
      keysPressedRef.current[e.key.toLowerCase()] = true;
      keysPressedRef.current[e.code] = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current[e.key.toLowerCase()] = false;
      keysPressedRef.current[e.code] = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // 8. RESIZE LISTENER
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 580;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    // Dynamic container observer for tab switching / display: none -> block
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 580;
      if (newW > 0 && newH > 0) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }
    });
    if (container) resizeObserver.observe(container);

    // 9. INTERSECTION OBSERVER (Pause render when out of view)
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    if (container) observer.observe(container);

    // 10. ANIMATION LOOP
    let animationFrameId: number;
    let hasRenderedFirstFrame = false;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Skip render when not visible and not active
      if (!isVisible && !isActiveRef.current) return;

      // Camera smooth glide
      const anim = animationTargetRef.current;
      if (anim.active) {
        anim.progress += 0.045;
        camera.position.lerp(anim.camPos, 0.08);
        controls.target.lerp(anim.targetPos, 0.08);

        if (anim.progress >= 1) {
          anim.active = false;
        }
      }

      // 10A. FIRST-PERSON WALK MODE LOCOMOTION
      if (isWalkModeRef.current && !anim.active) {
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

        const keys = keysPressedRef.current;
        const vKeys = virtualMoveRef.current;

        let moveZ = 0;
        let moveX = 0;

        if (keys["w"] || keys["arrowup"] || keys["KeyW"] || vKeys.forward) moveZ += 1;
        if (keys["s"] || keys["arrowdown"] || keys["KeyS"] || vKeys.backward) moveZ -= 1;
        if (keys["d"] || keys["arrowright"] || keys["KeyD"] || vKeys.right) moveX += 1;
        if (keys["a"] || keys["arrowleft"] || keys["KeyA"] || vKeys.left) moveX -= 1;

        if (moveX !== 0 || moveZ !== 0) {
          const moveDir = new THREE.Vector3()
            .addScaledVector(forward, moveZ)
            .addScaledVector(right, moveX)
            .normalize();

          const speed = 0.11;
          const deltaX = moveDir.x * speed;
          const deltaZ = moveDir.z * speed;

          let targetX = camera.position.x + deltaX;
          let targetZ = camera.position.z + deltaZ;

          // Museum boundary clamp (room is 28x28m, so [-12.8, 12.8])
          targetX = THREE.MathUtils.clamp(targetX, -12.8, 12.8);
          targetZ = THREE.MathUtils.clamp(targetZ, -12.8, 12.8);

          // Central 3D Laptop pedestal collision (radius 2.3m)
          const distCenter = Math.hypot(targetX, targetZ);
          if (distCenter < 2.3) {
            const factor = 2.3 / (distCenter || 1);
            targetX *= factor;
            targetZ *= factor;
          }

          // Left wing partition wall collision (x = -7.0, z: [-9.2, 9.2], thickness: [-7.6, -6.4])
          if (targetZ >= -9.2 && targetZ <= 9.2) {
            if (targetX > -7.6 && targetX < -6.4) {
              targetX = camera.position.x <= -7.0 ? -7.6 : -6.4;
            }
          }

          const actualDeltaX = targetX - camera.position.x;
          const actualDeltaZ = targetZ - camera.position.z;

          camera.position.x = targetX;
          camera.position.z = targetZ;
          controls.target.x += actualDeltaX;
          controls.target.z += actualDeltaZ;

          // Gentle head-bobbing simulation
          walkBobTimeRef.current += 0.22;
          camera.position.y = 1.7 + Math.sin(walkBobTimeRef.current) * 0.025;
        } else {
          camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.7, 0.1);
        }
      }

      // Showcase Laptop continuous rotation & gentle floating hover
      const timeMs = Date.now() * 0.002;
      centerLaptopGroup.rotation.y += 0.012;
      centerLaptopGroup.position.y = 1.45 + Math.sin(timeMs) * 0.05;

      // Subtle pulse on Video Wall ambient screen glow
      videoWallLight.intensity = 1.2 + Math.sin(Date.now() * 0.003) * 0.25;

      controls.update();
      renderer.render(scene, camera);

      if (!hasRenderedFirstFrame) {
        hasRenderedFirstFrame = true;
        setIsMuseumReady(true);
      }
    };

    animate();

    // 11. CLEANUP
    return () => {
      if (queueTimer) clearTimeout(queueTimer);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      resizeObserver.disconnect();
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", handleResize);
      texturesToDispose.forEach((tex) => tex.dispose());
      sharedPlaceholderTex.dispose();
      downscaledTexCache.forEach((tex) => tex.dispose());
      downscaledTexCache.clear();
      sharedFrameGeo.dispose();
      sharedGoldTrimGeo.dispose();
      sharedMatBoardGeo.dispose();
      sharedPhotoGeo.dispose();
      sharedPlaqueGeo.dispose();
      sharedLampArmGeo.dispose();
      sharedLampHeadGeo.dispose();
      bracketGeo.dispose();
      bracketMat.dispose();
      dashTex.dispose();
      dashChassisGeo.dispose();
      dashTrimGeo.dispose();
      dashScreenGeo.dispose();
      dashScreenMat.dispose();
      zoneTex.dispose();
      renderer.dispose();
      controls.dispose();
    };

  }, [focusOnArtwork]);

  return (
    <div className="w-full relative">
      {/* 3D Museum Canvas Box Container */}
      <div className="relative border-4 border-black bg-[#0a0f1d] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        {/* Loading Overlay while Initializing */}
        {!isMuseumReady && (
          <div className="absolute inset-0 z-30 bg-[#0a0f1d] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-10 h-10 border-4 border-black border-t-neo-yellow rounded-full animate-spin mb-3" />
            <span className="text-neo-white font-black text-sm uppercase tracking-wider">
              Mempersiapkan Museum 3D...
            </span>
          </div>
        )}
        {/* Top Control Bar Over 3D Scene */}
        <div className="relative z-10 bg-neo-yellow border-b-4 border-black p-2.5 sm:p-3.5 flex flex-wrap items-center justify-between gap-3">
          {/* Preset Camera Views */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handlePresetView("hall")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
                viewPreset === "hall" && !isTourActive ? "bg-black text-neo-yellow" : "bg-white text-black hover:bg-neutral-100"
              }`}
              title="Tinjau Seluruh Ruang Galeri"
            >
              <Landmark className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Ruang Utama</span>
            </button>

            <button
              type="button"
              onClick={() => handlePresetView("k10")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
                viewPreset === "k10" ? "bg-black text-neo-yellow" : "bg-white text-black hover:bg-neutral-100"
              }`}
              title="Sayap Pameran Kenangan Kelas 10"
            >
              <Folder className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Sayap Kelas 10 (42)</span>
            </button>

            <button
              type="button"
              onClick={() => handlePresetView("k11")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
                viewPreset === "k11" ? "bg-black text-neo-yellow" : "bg-white text-black hover:bg-neutral-100"
              }`}
              title="Sayap Pameran Kenangan Kelas 11"
            >
              <Folder className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Sayap Kelas 11 (15)</span>
            </button>

            <button
              type="button"
              onClick={() => handlePresetView("center")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
                viewPreset === "center" ? "bg-black text-neo-yellow" : "bg-white text-black hover:bg-neutral-100"
              }`}
              title="Sorot Laptop Monumen Tengah"
            >
              <Laptop className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Laptop 3D</span>
            </button>

            <button
              type="button"
              onClick={() => handlePresetView("dashboard")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
                viewPreset === "dashboard" && !isWalkMode ? "bg-black text-neo-yellow" : "bg-white text-black hover:bg-neutral-100"
              }`}
              title="Sorot Layar Dashboard Statistik Kelas"
            >
              <BarChart3 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Dashboard Kelas</span>
            </button>

            <button
              type="button"
              onClick={toggleWalkMode}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
                isWalkMode ? "bg-black text-neo-yellow ring-2 ring-black scale-105" : "bg-white text-black hover:bg-neutral-100"
              }`}
              title="Mode Jalan Kaki Virtual (WASD / D-Pad)"
            >
              <Footprints className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isWalkMode ? "Keluar Jalan" : "Mode Jalan"}</span>
            </button>
          </div>

          {/* Tour & Auto-Rotate Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const nextState = !isTourActive;
                setIsTourActive(nextState);
                if (nextState) {
                  focusOnArtwork(artworks[0]);
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
                isTourActive ? "bg-black text-neo-yellow animate-pulse" : "bg-white text-black hover:bg-neutral-100"
              }`}
              title="Mulai Tur Otomatis Menyusuri Galeri"
            >
              {isTourActive ? <Pause className="w-3.5 h-3.5 stroke-[2.5]" /> : <Play className="w-3.5 h-3.5 stroke-[2.5]" />}
              <span>{isTourActive ? "Jeda Tur" : "Mulai Tur 3D"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const nextState = !isAutoRotating;
                setIsAutoRotating(nextState);
                if (controlsRef.current) {
                  controlsRef.current.autoRotate = nextState;
                  controlsRef.current.autoRotateSpeed = 1.0;
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
                isAutoRotating ? "bg-neo-yellow text-black ring-2 ring-black" : "bg-white text-black hover:bg-neutral-100"
              }`}
              title="Putar Otomatis 360 Derajat"
            >
              <RotateCw className={`w-3.5 h-3.5 stroke-[2.5] ${isAutoRotating ? "animate-spin" : ""}`} />
              <span>{isAutoRotating ? "Stop Putar" : "Auto Putar"}</span>
            </button>
          </div>
        </div>

        {/* Three.js Canvas */}
        <div ref={containerRef} className="w-full h-[480px] sm:h-[620px] relative touch-none select-none">
          <canvas
            ref={canvasRef}
            className="w-full h-full block touch-none cursor-grab active:cursor-grabbing outline-none"
          />

          {/* First-Person Walk Mode Instruction Banner */}
          {isWalkMode && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-neo-yellow text-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-3.5 py-1.5 flex items-center gap-2.5 font-mono text-[11px] sm:text-xs font-black animate-fade-in max-w-[94%]">
              <Footprints className="w-4 h-4 animate-bounce shrink-0" />
              <span className="hidden sm:inline">Tekan <strong>W A S D</strong> / Panah untuk Jalan • Drag mouse untuk Menoleh</span>
              <span className="sm:hidden">Pakai D-Pad • Drag untuk Menoleh</span>
              <button
                type="button"
                onClick={toggleWalkMode}
                className="ml-1.5 px-2 py-0.5 bg-black text-neo-yellow text-[10px] font-bold uppercase hover:bg-neutral-800 shrink-0 border border-black cursor-pointer"
              >
                ✕ Keluar
              </button>
            </div>
          )}

          {/* Virtual D-Pad for Walk Mode (Mobile & Mouse) */}
          {isWalkMode && (
            <div className="absolute bottom-4 left-4 z-30 flex flex-col items-center gap-1 bg-black/85 p-2 border-3 border-neo-yellow shadow-[4px_4px_0px_0px_rgba(229,222,0,1)] select-none touch-none animate-fade-in">
              <button
                type="button"
                onPointerDown={(e) => { e.preventDefault(); virtualMoveRef.current.forward = true; }}
                onPointerUp={(e) => { e.preventDefault(); virtualMoveRef.current.forward = false; }}
                onPointerLeave={(e) => { e.preventDefault(); virtualMoveRef.current.forward = false; }}
                onPointerCancel={(e) => { e.preventDefault(); virtualMoveRef.current.forward = false; }}
                className="w-9 h-9 bg-neo-yellow text-black font-black text-sm flex items-center justify-center border-2 border-black active:bg-yellow-400 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer touch-none"
                title="Maju (W)"
              >
                ▲
              </button>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onPointerDown={(e) => { e.preventDefault(); virtualMoveRef.current.left = true; }}
                  onPointerUp={(e) => { e.preventDefault(); virtualMoveRef.current.left = false; }}
                  onPointerLeave={(e) => { e.preventDefault(); virtualMoveRef.current.left = false; }}
                  onPointerCancel={(e) => { e.preventDefault(); virtualMoveRef.current.left = false; }}
                  className="w-9 h-9 bg-neo-yellow text-black font-black text-sm flex items-center justify-center border-2 border-black active:bg-yellow-400 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer touch-none"
                  title="Kiri (A)"
                >
                  ◀
                </button>
                <button
                  type="button"
                  onPointerDown={(e) => { e.preventDefault(); virtualMoveRef.current.backward = true; }}
                  onPointerUp={(e) => { e.preventDefault(); virtualMoveRef.current.backward = false; }}
                  onPointerLeave={(e) => { e.preventDefault(); virtualMoveRef.current.backward = false; }}
                  onPointerCancel={(e) => { e.preventDefault(); virtualMoveRef.current.backward = false; }}
                  className="w-9 h-9 bg-neo-yellow text-black font-black text-sm flex items-center justify-center border-2 border-black active:bg-yellow-400 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer touch-none"
                  title="Mundur (S)"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onPointerDown={(e) => { e.preventDefault(); virtualMoveRef.current.right = true; }}
                  onPointerUp={(e) => { e.preventDefault(); virtualMoveRef.current.right = false; }}
                  onPointerLeave={(e) => { e.preventDefault(); virtualMoveRef.current.right = false; }}
                  onPointerCancel={(e) => { e.preventDefault(); virtualMoveRef.current.right = false; }}
                  className="w-9 h-9 bg-neo-yellow text-black font-black text-sm flex items-center justify-center border-2 border-black active:bg-yellow-400 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer touch-none"
                  title="Kanan (D)"
                >
                  ▶
                </button>
              </div>
              <span className="text-[9px] text-neo-yellow font-mono font-bold">KONTROL JALAN</span>
            </div>
          )}

          {/* Hover Tooltip Overlay for Artworks */}
          {hoveredMemory && !selectedMemory && (
            <div className="absolute top-4 left-4 z-20 pointer-events-none bg-neo-yellow text-black px-3.5 py-2 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-fade-in max-w-xs">
              <p className="text-[11px] font-black uppercase text-neutral-800 flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3 stroke-[2.5]" />
                {hoveredMemory.category}
              </p>
              <p className="text-sm font-black uppercase text-black leading-tight mt-0.5">
                {hoveredMemory.title}
              </p>
              <p className="text-[11px] font-bold text-neutral-800 mt-1">Klik pigura untuk zoom karya</p>
            </div>
          )}

          {/* Dashboard Hover Tooltip Overlay */}
          {isHoveringDashboard && !hoveredMemory && !selectedMemory && (
            <div className="absolute top-4 left-4 z-20 pointer-events-none bg-black text-neo-yellow px-4 py-2.5 border-3 border-neo-yellow shadow-[4px_4px_0px_0px_rgba(229,222,0,1)] animate-fade-in max-w-sm">
              <p className="text-[11px] font-black uppercase text-cyan-400 flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3 stroke-[2.5]" />
                Command Center • Live Data
              </p>
              <p className="text-sm font-black uppercase text-white leading-tight mt-0.5">
                Giant Video Wall: Dashboard XII PPLG 1
              </p>
              <p className="text-[11px] font-bold text-neutral-300 mt-1">
                Klik layar untuk zoom tampilan dashboard
              </p>
            </div>
          )}

          {/* Quick Artwork Prev/Next Navigation Controls floating inside canvas */}
          <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevArtwork}
              className="p-2.5 bg-neo-white text-black border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-neo-yellow transition-all cursor-pointer"
              title="Foto Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5 stroke-[3]" />
            </button>
            <span className="px-3 py-2 bg-black text-neo-yellow font-mono text-xs font-black border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              #{activeArtworkIndex + 1} / {artworks.length}
            </span>
            <button
              type="button"
              onClick={handleNextArtwork}
              className="p-2.5 bg-neo-white text-black border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-neo-yellow transition-all cursor-pointer"
              title="Foto Selanjutnya"
            >
              <ChevronRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Bottom Bar: Help Legend & Hint */}
        <div className="bg-black text-white px-3 sm:px-4 py-2 text-xs font-bold flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-neo-yellow">
              <Landmark className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{memoriesData.length} Bingkai Foto Kenangan 3D</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 bg-white border border-black inline-block" /> Sayap Kiri: Kelas 10 (42 Foto)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 bg-neo-yellow border border-black inline-block" /> Sayap Kanan: Kelas 11 (15 Foto)
            </span>
            <span className="inline-flex items-center gap-1.5 text-cyan-400">
              <BarChart3 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Dinding Kanan: Dashboard Statistik</span>
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-neo-yellow text-[11px] uppercase font-black">
            <Info className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Klik Pigura: Zoom Karya • Drag: Putar 360°</span>
          </div>
        </div>
      </div>

      {/* Selected Artwork Detail Modal / Floating Curator Card */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            onClick={() => setSelectedMemory(null)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="bg-neo-white text-black border-4 border-black p-5 sm:p-7 max-w-lg w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedMemory(null)}
                className="absolute top-3.5 right-3.5 w-8 h-8 sm:w-9 sm:h-9 bg-neo-yellow border-2 sm:border-3 border-black font-black flex items-center justify-center text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>

              {/* Badges */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="px-3 py-1 bg-black text-neo-yellow text-xs sm:text-sm font-black uppercase tracking-wider border border-black inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                  {selectedMemory.category}
                </span>
                {selectedMemory.date && (
                  <span className="px-2.5 py-1 bg-neutral-200 text-black text-[11px] sm:text-xs font-black uppercase border border-black inline-flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 stroke-[2.5]" />
                    <span>{selectedMemory.date}</span>
                  </span>
                )}
              </div>

              {/* Artwork Title */}
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mb-3">
                {selectedMemory.title}
              </h3>

              {/* Preview Image in Curator Card */}
              <div className="border-3 border-black bg-neutral-100 overflow-hidden mb-4 max-h-56">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedMemory.src}
                  alt={selectedMemory.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Description Story */}
              {selectedMemory.description && (
                <div className="bg-neutral-100 border-3 border-black p-3.5 mb-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-sm sm:text-base font-bold text-neutral-900 leading-relaxed">
                    {selectedMemory.description}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {onOpenLightbox && (
                  <button
                    type="button"
                    onClick={() => {
                      const origIndex = memoriesData.findIndex((m) => m.id === selectedMemory.id);
                      if (origIndex !== -1) {
                        onOpenLightbox(origIndex);
                        setSelectedMemory(null);
                      }
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-black text-neo-yellow font-black uppercase text-xs sm:text-sm border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4 stroke-[2.5]" />
                    <span>Buka Resolusi Penuh</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedMemory(null)}
                  className="px-4 py-2.5 bg-white text-black font-black uppercase text-xs sm:text-sm border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-100 transition-all cursor-pointer"
                >
                  Kembali Ke Galeri
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
