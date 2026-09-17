"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { classroomSeatingData, type ClassroomStudent } from "../data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Search,
  Compass,
  LayoutGrid,
  GraduationCap,
  Eye,
  Snowflake,
  Users,
  Code2,
  Info,
  User,
  Quote,
  Focus,
  X,
  RotateCw,
} from "lucide-react";

export default function Classroom3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Selected student & teacher states
  const [selectedStudent, setSelectedStudent] = useState<ClassroomStudent | null>(null);
  const [hoveredStudent, setHoveredStudent] = useState<ClassroomStudent | null>(null);
  const [isTeacherSelected, setIsTeacherSelected] = useState(false);
  const [isTeacherHovered, setIsTeacherHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"orbit" | "top" | "teacher" | "back">("orbit");
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isSceneReady, setIsSceneReady] = useState(false);

  // References for animation and control handling
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const teacherFigureRef = useRef<THREE.Group | null>(null);
  const deskMeshesRef = useRef<Map<number, { topMesh: THREE.Mesh; defaultColor: number }>>(new Map());
  const animationTargetRef = useRef<{
    camPos: THREE.Vector3;
    targetPos: THREE.Vector3;
    progress: number;
    active: boolean;
  }>({
    camPos: new THREE.Vector3(0, 16, 22),
    targetPos: new THREE.Vector3(0, 1, 4),
    progress: 1,
    active: false,
  });

  // Filter students for search input
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return classroomSeatingData.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.absen.toString() === searchQuery.trim()
    );
  }, [searchQuery]);

  // Function to smoothly animate camera to a target
  const animateCameraTo = (camTarget: THREE.Vector3, lookTarget: THREE.Vector3) => {
    if (!cameraRef.current || !controlsRef.current) return;
    animationTargetRef.current = {
      camPos: camTarget,
      targetPos: lookTarget,
      progress: 0,
      active: true,
    };
  };

  // Helper to trigger focus on a student desk
  const focusOnStudent = (student: ClassroomStudent) => {
    setSelectedStudent(student);
    setIsTeacherSelected(false);
    const entry = deskMeshesRef.current.get(student.absen);
    if (entry && cameraRef.current) {
      const worldPos = new THREE.Vector3();
      entry.topMesh.getWorldPosition(worldPos);

      const targetCam = new THREE.Vector3(
        worldPos.x + (student.wing === "Kiri" ? 2.5 : -2.5),
        worldPos.y + 3.5,
        worldPos.z + 4.5
      );
      animateCameraTo(targetCam, worldPos);
    }
  };

  // Preset camera handlers
  const handlePresetView = (mode: "orbit" | "top" | "teacher" | "back") => {
    setViewMode(mode);
    if (isAutoRotating) {
      setIsAutoRotating(false);
      if (controlsRef.current) {
        controlsRef.current.autoRotate = false;
      }
    }
    if (mode === "orbit") {
      animateCameraTo(new THREE.Vector3(0, 16, 22), new THREE.Vector3(0, 1, 4));
    } else if (mode === "top") {
      // Slightly offset Z so polar angle doesn't lock at pole
      animateCameraTo(new THREE.Vector3(0, 26, 4.5), new THREE.Vector3(0, 0, 4));
    } else if (mode === "teacher") {
      animateCameraTo(new THREE.Vector3(0, 3.8, -8.5), new THREE.Vector3(0, 1.5, 6));
    } else if (mode === "back") {
      animateCameraTo(new THREE.Vector3(0, 4.5, 18), new THREE.Vector3(0, 2, -7));
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d); // Deep futuristic slate
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.015);

    const width = container.clientWidth;
    const height = container.clientHeight || 580;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 120);
    camera.position.set(0, 16, 22);
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

    // 3. CONTROLS (Full 360° Horizontal & Vertical Freedom)
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableRotate = true;
    controls.rotateSpeed = 0.85;
    controls.enableZoom = true;
    controls.zoomSpeed = 1.0;
    controls.enablePan = true;
    controls.panSpeed = 0.8;
    controls.minDistance = 4;
    controls.maxDistance = 50;
    // Allow complete 360 degree azimuthal horizontal rotation
    controls.minAzimuthAngle = -Infinity;
    controls.maxAzimuthAngle = Infinity;
    // Keep angle strictly above ground, prevent gimbal lock at top pole
    controls.minPolarAngle = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controls.target.set(0, 1, 4);
    controls.autoRotate = false;
    controls.autoRotateSpeed = 1.2;

    // Interrupt scripted lerp immediately on manual user drag
    controls.addEventListener("start", () => {
      animationTargetRef.current.active = false;
    });

    controlsRef.current = controls;

    // 4. LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff8db, 2.2);
    dirLight.position.set(12, 22, 14);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 60;
    dirLight.shadow.camera.left = -18;
    dirLight.shadow.camera.right = 18;
    dirLight.shadow.camera.top = 18;
    dirLight.shadow.camera.bottom = -18;
    scene.add(dirLight);

    // Subtle blueish fill light from back
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    fillLight.position.set(-14, 15, -12);
    scene.add(fillLight);

    // 5. ROOM & FLOOR
    // Base dark floor
    const floorGeo = new THREE.PlaneGeometry(32, 36);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.8,
      metalness: 0.1,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Neobrutalism Cyan/Yellow Grid Floor Overlay
    const gridHelper = new THREE.GridHelper(32, 32, 0xe5de00, 0x1f2937);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Front Wall (Behind Whiteboard)
    const wallGeo = new THREE.PlaneGeometry(32, 10);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x182234,
      roughness: 0.85,
    });
    const frontWall = new THREE.Mesh(wallGeo, wallMat);
    frontWall.position.set(0, 5, -12);
    frontWall.receiveShadow = true;
    scene.add(frontWall);

    // Left & Right Architectural Walls (Facing Inward)
    const sideWallGeo = new THREE.PlaneGeometry(36, 10);
    const sideWallMat = new THREE.MeshStandardMaterial({
      color: 0x151d2c,
      roughness: 0.9,
      side: THREE.FrontSide, // Invisible when viewed from outside
    });

    const leftWall = new THREE.Mesh(sideWallGeo, sideWallMat);
    leftWall.position.set(-15.5, 5, 5);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallGeo, sideWallMat);
    rightWall.position.set(15.5, 5, 5);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    // 6. WHITEBOARD (Dynamic Canvas Texture)
    const boardCanvas = document.createElement("canvas");
    boardCanvas.width = 1024;
    boardCanvas.height = 512;
    const ctx = boardCanvas.getContext("2d");
    if (ctx) {
      // Board background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 1024, 512);

      // Border
      ctx.lineWidth = 24;
      ctx.strokeStyle = "#000000";
      ctx.strokeRect(12, 12, 1000, 488);

      // Top banner
      ctx.fillStyle = "#e5de00";
      ctx.fillRect(24, 24, 976, 100);
      ctx.fillStyle = "#000000";
      ctx.font = "bold 44px monospace";
      ctx.textAlign = "center";
      ctx.fillText("RUANG KELAS & CODING LAB // XII PPLG 1", 512, 90);

      // Code text on board
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 34px monospace";
      ctx.textAlign = "left";
      ctx.fillText("const classGoal = 'SMK BISA, PPLG 1 HEBAT!';", 70, 200);
      ctx.fillText("function buildFuture() {", 70, 260);
      ctx.fillText("  learn(Code);  master(Logic);  cherish(Friends);", 110, 320);
      ctx.fillText("}", 70, 380);

      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 30px monospace";
      ctx.fillText("// SMKN 1 DEPOK - ANGKATAN 2024 - 2027", 70, 450);
    }
    const boardTexture = new THREE.CanvasTexture(boardCanvas);
    const boardGeo = new THREE.PlaneGeometry(14, 6);
    const boardMat = new THREE.MeshBasicMaterial({ map: boardTexture });
    const whiteboard = new THREE.Mesh(boardGeo, boardMat);
    whiteboard.position.set(0, 5, -11.9);
    scene.add(whiteboard);

    // 6B. AC UNITS (AIR CONDITIONER SPLIT - 16°C DINGIN POL)
    const breezeMeshes: THREE.Mesh[] = [];

    const createACUnit = (x: number, y: number, z: number, rotationY = 0) => {
      const acGroup = new THREE.Group();
      acGroup.position.set(x, y, z);
      acGroup.rotation.y = rotationY;

      // AC Main White Body
      const bodyGeo = new THREE.BoxGeometry(2.6, 0.72, 0.55);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.25,
        metalness: 0.1,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.castShadow = true;
      body.receiveShadow = true;
      acGroup.add(body);

      // Sleek Center Black Accent Strip
      const stripGeo = new THREE.BoxGeometry(2.62, 0.04, 0.56);
      const stripMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
      const strip = new THREE.Mesh(stripGeo, stripMat);
      strip.position.y = -0.06;
      acGroup.add(strip);

      // Bottom Air Vent Louver (Angled downwards)
      const louverGeo = new THREE.BoxGeometry(2.4, 0.05, 0.2);
      const louverMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0 });
      const louver = new THREE.Mesh(louverGeo, louverMat);
      louver.position.set(0, -0.32, 0.16);
      louver.rotation.x = 0.45;
      acGroup.add(louver);

      // Digital 16°C LED Canvas Texture
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = 128;
      tempCanvas.height = 64;
      const tctx = tempCanvas.getContext("2d");
      if (tctx) {
        tctx.fillStyle = "#020617";
        tctx.fillRect(0, 0, 128, 64);
        tctx.fillStyle = "#38bdf8"; // Glowing cyan LED
        tctx.font = "bold 38px monospace";
        tctx.textAlign = "center";
        tctx.textBaseline = "middle";
        tctx.fillText("16°C", 64, 32);
      }
      const tempTex = new THREE.CanvasTexture(tempCanvas);
      const tempGeo = new THREE.PlaneGeometry(0.55, 0.26);
      const tempMat = new THREE.MeshBasicMaterial({ map: tempTex });
      const tempMesh = new THREE.Mesh(tempGeo, tempMat);
      tempMesh.position.set(0.72, 0.08, 0.28);
      acGroup.add(tempMesh);

      // Power Green LED Indicator
      const ledGeo = new THREE.SphereGeometry(0.03, 8, 8);
      const ledMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(1.15, -0.15, 0.28);
      acGroup.add(led);

      // PPLG AIR Brand Badge
      const brandCanvas = document.createElement("canvas");
      brandCanvas.width = 128;
      brandCanvas.height = 32;
      const bctx = brandCanvas.getContext("2d");
      if (bctx) {
        bctx.fillStyle = "#ffffff";
        bctx.fillRect(0, 0, 128, 32);
        bctx.fillStyle = "#0f172a";
        bctx.font = "bold 20px sans-serif";
        bctx.textAlign = "center";
        bctx.textBaseline = "middle";
        bctx.fillText("PPLG AIR", 64, 16);
      }
      const brandTex = new THREE.CanvasTexture(brandCanvas);
      const brandGeo = new THREE.PlaneGeometry(0.5, 0.13);
      const brandMat = new THREE.MeshBasicMaterial({ map: brandTex });
      const brandMesh = new THREE.Mesh(brandGeo, brandMat);
      brandMesh.position.set(-0.75, 0.08, 0.28);
      acGroup.add(brandMesh);

      // Translucent Cold Air Breeze Sheet (Hembusan Angin Dingin)
      const breezeGeo = new THREE.PlaneGeometry(2.3, 1.6);
      const breezeMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const breeze = new THREE.Mesh(breezeGeo, breezeMat);
      breeze.position.set(0, -1.1, 0.7);
      breeze.rotation.x = 0.55;
      acGroup.add(breeze);
      breezeMeshes.push(breeze);

      // Subtle cyan glow point light underneath
      const coldLight = new THREE.PointLight(0x38bdf8, 1.4, 5);
      coldLight.position.set(0, -0.6, 0.4);
      acGroup.add(coldLight);

      return acGroup;
    };

    // Mount 4 AC Units around the Lab:
    // AC 1 & 2: Front Wall (Left & Right of Whiteboard)
    scene.add(createACUnit(-11.2, 6.8, -11.6, 0));
    scene.add(createACUnit(11.2, 6.8, -11.6, 0));
    // AC 3 & 4: Left & Right Walls (Center of room)
    scene.add(createACUnit(-15.1, 6.5, 4.5, Math.PI / 2));
    scene.add(createACUnit(15.1, 6.5, 4.5, -Math.PI / 2));

    // Interactive Raycaster Mesh Collection
    const interactiveMeshes: THREE.Mesh[] = [];

    // 7. TEACHER DESK & CHAIR (Front Center)
    const teacherDeskGroup = new THREE.Group();
    // Teacher Desk Top
    const tDeskTopGeo = new THREE.BoxGeometry(4.2, 0.15, 2.0);
    const tDeskTopMat = new THREE.MeshStandardMaterial({
      color: 0xe5de00, // Neo yellow
      roughness: 0.3,
    });
    const tDeskTop = new THREE.Mesh(tDeskTopGeo, tDeskTopMat);
    tDeskTop.position.set(0, 1.2, -8.0);
    tDeskTop.castShadow = true;
    tDeskTop.receiveShadow = true;
    tDeskTop.userData = { isTeacher: true };
    teacherDeskGroup.add(tDeskTop);
    interactiveMeshes.push(tDeskTop);

    // Teacher Desk Body / Legs
    const tDeskBaseGeo = new THREE.BoxGeometry(4.0, 1.15, 1.8);
    const tDeskBaseMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.7,
    });
    const tDeskBase = new THREE.Mesh(tDeskBaseGeo, tDeskBaseMat);
    tDeskBase.position.set(0, 0.575, -8.0);
    tDeskBase.castShadow = true;
    tDeskBase.userData = { isTeacher: true };
    teacherDeskGroup.add(tDeskBase);

    // 7A. TEACHER LAPTOP (Facing Bu Hilda, Back Lid Facing Students)
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(0, 1.285, -8.12);

    // 1. Laptop Base / Chassis
    const laptopBaseMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.8,
    });
    const laptopBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.024, 0.58),
      laptopBaseMat
    );
    laptopBase.position.set(0, 0.012, 0);
    laptopBase.castShadow = true;
    laptopBase.receiveShadow = true;
    laptopGroup.add(laptopBase);

    // 2. Keyboard & Trackpad on Base (Facing Bu Hilda)
    const teacherKbMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.8 });
    const kbMesh = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.006, 0.26), teacherKbMat);
    kbMesh.position.set(0, 0.025, -0.02);
    laptopGroup.add(kbMesh);

    const trackpadMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });
    const trackpadMesh = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.004, 0.15), trackpadMat);
    trackpadMesh.position.set(0, 0.025, -0.20);
    laptopGroup.add(trackpadMesh);

    // 3. Laptop Screen Lid & Display (Hinged at the far edge, open toward Bu Hilda)
    const screenHinge = new THREE.Group();
    screenHinge.position.set(0, 0.024, 0.28);
    screenHinge.rotation.x = 0.22; // Tilts top toward students, opening display towards Bu Hilda

    // Teacher Laptop Screen Texture (VS Code Teacher Dashboard)
    const tScreenCanvas = document.createElement("canvas");
    tScreenCanvas.width = 512;
    tScreenCanvas.height = 320;
    const tctx = tScreenCanvas.getContext("2d");
    if (tctx) {
      tctx.fillStyle = "#1e1e1e";
      tctx.fillRect(0, 0, 512, 320);
      tctx.fillStyle = "#252526";
      tctx.fillRect(0, 0, 512, 40);
      tctx.fillStyle = "#e5de00";
      tctx.font = "bold 16px monospace";
      tctx.fillText("⭐ WaliKelas.tsx", 20, 27);
      tctx.fillStyle = "#252526";
      tctx.fillRect(0, 40, 48, 256);
      tctx.fillStyle = "#64748b";
      tctx.font = "15px monospace";
      for (let i = 1; i <= 9; i++) tctx.fillText(`${i}`, 18, 66 + (i - 1) * 26);
      const lines = [
        { text: "// SMKN 1 DEPOK - XII PPLG 1", color: "#6a9955" },
        { text: "const waliKelas = 'Hilda Rahmawati, S.Kom';", color: "#569cd6" },
        { text: "const totalSiswa = 35;", color: "#b5cea8" },
        { text: "const status = 'READY TO GRADUATE';", color: "#ce9178" },
        { text: "if (students.allPass) {", color: "#c586c0" },
        { text: "  celebrate('KELAS TERBAIK XII PPLG 1!');", color: "#4ec9b0" },
        { text: "}", color: "#ffd700" },
        { text: "console.log('Class of Champions 2025');", color: "#dcdcaa" },
        { text: "// Solid, Cerdas, dan Kreatif!", color: "#6a9955" },
      ];
      tctx.font = "15px monospace";
      lines.forEach((l, idx) => {
        tctx.fillStyle = l.color;
        tctx.fillText(l.text, 60, 66 + idx * 26);
      });
      tctx.fillStyle = "#007acc";
      tctx.fillRect(0, 296, 512, 24);
      tctx.fillStyle = "#ffffff";
      tctx.font = "bold 13px monospace";
      tctx.fillText("ADMIN • SMKN 1 DEPOK • STATUS: 100% LULUS", 16, 313);
    }
    const tScreenTex = new THREE.CanvasTexture(tScreenCanvas);
    tScreenTex.colorSpace = THREE.SRGBColorSpace;

    // Screen Box:
    // [0: +X, 1: -X, 2: +Y, 3: -Y, 4: +Z (Front/Facing Students), 5: -Z (Back/Facing Bu Hilda)]
    const teacherScreenGeo = new THREE.BoxGeometry(0.85, 0.56, 0.022);
    const screenDisplayMat = new THREE.MeshBasicMaterial({ map: tScreenTex });
    const screenMaterials = [
      laptopBaseMat, // +X
      laptopBaseMat, // -X
      laptopBaseMat, // +Y
      laptopBaseMat, // -Y
      laptopBaseMat, // +Z facing students (Back lid)
      screenDisplayMat, // -Z facing Bu Hilda (Active VS Code display!)
    ];
    const laptopScreenMesh = new THREE.Mesh(teacherScreenGeo, screenMaterials);
    laptopScreenMesh.position.set(0, 0.28, 0);
    laptopScreenMesh.castShadow = true;
    laptopScreenMesh.userData = { isTeacher: true };
    screenHinge.add(laptopScreenMesh);
    interactiveMeshes.push(laptopScreenMesh);

    // Glowing School Logo Badge on the Back Lid (+Z face, facing students)
    const logoCanvas = document.createElement("canvas");
    logoCanvas.width = 128;
    logoCanvas.height = 128;
    const lctx = logoCanvas.getContext("2d");
    if (lctx) {
      lctx.fillStyle = "#1e293b";
      lctx.fillRect(0, 0, 128, 128);
      lctx.fillStyle = "#38bdf8";
      lctx.font = "bold 26px sans-serif";
      lctx.textAlign = "center";
      lctx.textBaseline = "middle";
      lctx.fillText("PPLG 1", 64, 50);
      lctx.font = "bold 15px sans-serif";
      lctx.fillStyle = "#cbd5e1";
      lctx.fillText("TEACHER", 64, 82);
    }
    const logoTex = new THREE.CanvasTexture(logoCanvas);
    const logoMat = new THREE.MeshBasicMaterial({ map: logoTex });
    const logoMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.24), logoMat);
    logoMesh.position.set(0, 0.28, 0.012);
    screenHinge.add(logoMesh);

    laptopGroup.add(screenHinge);
    teacherDeskGroup.add(laptopGroup);

    // Teacher Ergonomic Office Chair
    const tChairGroup = new THREE.Group();
    tChairGroup.position.set(0, 0, -9.4);

    const chairCushionMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const chairBaseMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.4 });

    // Chair Seat Cushion
    const seatMesh = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.12, 0.9), chairCushionMat);
    seatMesh.position.y = 0.72;
    seatMesh.castShadow = true;
    tChairGroup.add(seatMesh);

    // Chair High Backrest
    const backMesh = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.95, 0.1), chairCushionMat);
    backMesh.position.set(0, 1.25, -0.42);
    backMesh.castShadow = true;
    tChairGroup.add(backMesh);

    // Chair Post & Star Base
    const postMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.65, 8), chairBaseMat);
    postMesh.position.y = 0.35;
    tChairGroup.add(postMesh);

    const baseMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.06, 8), chairBaseMat);
    baseMesh.position.y = 0.05;
    tChairGroup.add(baseMesh);

    teacherDeskGroup.add(tChairGroup);

    // --- 7B. 3D FEMALE TEACHER ASSET: BU HILDA RAHMAWATI, S.KOM (WALI KELAS) ---
    const teacherFigure = new THREE.Group();
    teacherFigure.position.set(0, 0, -9.2);
    teacherFigure.userData = { isTeacher: true };

    const tSkinMat = new THREE.MeshStandardMaterial({
      color: 0xf6c8a4, // Healthy Indonesian skin tone
      roughness: 0.6,
    });
    const tBlazerMat = new THREE.MeshStandardMaterial({
      color: 0x047857, // Dignified Emerald Green formal teacher blazer
      roughness: 0.5,
    });
    const tSkirtMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b, // Matching deep formal skirt
      roughness: 0.6,
    });
    const tHijabMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7, // Elegant soft cream/ivory hijab
      roughness: 0.35,
    });
    const tGoldMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.8,
      roughness: 0.2,
    });

    // 1. Torso & Teacher Blazer
    const tTorsoGeo = new THREE.BoxGeometry(0.56, 0.62, 0.30);
    const tTorso = new THREE.Mesh(tTorsoGeo, tBlazerMat);
    tTorso.position.set(0, 1.08, 0);
    tTorso.castShadow = true;
    tTorso.userData = { isTeacher: true };
    teacherFigure.add(tTorso);
    interactiveMeshes.push(tTorso);

    // Inner White Shirt Collar
    const tShirtGeo = new THREE.BoxGeometry(0.18, 0.20, 0.02);
    const tShirtMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const tShirt = new THREE.Mesh(tShirtGeo, tShirtMat);
    tShirt.position.set(0, 1.26, 0.155);
    teacherFigure.add(tShirt);

    // Gold Teacher Name Badge on Chest
    const tBadgeGeo = new THREE.BoxGeometry(0.14, 0.05, 0.02);
    const tBadge = new THREE.Mesh(tBadgeGeo, tGoldMat);
    tBadge.position.set(0.16, 1.22, 0.16);
    teacherFigure.add(tBadge);

    // 2. Head, Hijab & Glasses
    const tNeckGeo = new THREE.CylinderGeometry(0.07, 0.08, 0.12, 8);
    const tNeck = new THREE.Mesh(tNeckGeo, tSkinMat);
    tNeck.position.set(0, 1.42, 0);
    teacherFigure.add(tNeck);

    const tHeadGeo = new THREE.BoxGeometry(0.30, 0.30, 0.28);
    const tHead = new THREE.Mesh(tHeadGeo, tSkinMat);
    tHead.position.set(0, 1.60, 0.01);
    tHead.castShadow = true;
    tHead.userData = { isTeacher: true };
    teacherFigure.add(tHead);
    interactiveMeshes.push(tHead);

    // Elegant Teacher Hijab Wrap (Crown / Head)
    const tHijabWrapGeo = new THREE.BoxGeometry(0.38, 0.40, 0.36);
    const tHijabWrap = new THREE.Mesh(tHijabWrapGeo, tHijabMat);
    tHijabWrap.position.set(0, 1.62, 0.01);
    tHijabWrap.castShadow = true;
    tHijabWrap.userData = { isTeacher: true };
    teacherFigure.add(tHijabWrap);
    interactiveMeshes.push(tHijabWrap);

    // Hijab Drape over Shoulders & Neck
    const tHijabDrapeGeo = new THREE.BoxGeometry(0.54, 0.32, 0.34);
    const tHijabDrape = new THREE.Mesh(tHijabDrapeGeo, tHijabMat);
    tHijabDrape.position.set(0, 1.30, 0.02);
    tHijabDrape.castShadow = true;
    teacherFigure.add(tHijabDrape);

    // Eyes (Friendly gaze looking forward towards class)
    const tEyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const tEyeGeo = new THREE.BoxGeometry(0.045, 0.045, 0.02);
    const tLeftEye = new THREE.Mesh(tEyeGeo, tEyeMat);
    tLeftEye.position.set(-0.08, 1.60, 0.175);
    teacherFigure.add(tLeftEye);

    const tRightEye = new THREE.Mesh(tEyeGeo, tEyeMat);
    tRightEye.position.set(0.08, 1.60, 0.175);
    teacherFigure.add(tRightEye);

    // Smart Teacher Glasses Frame
    const tGlassesMat = new THREE.MeshBasicMaterial({ color: 0x020617 });
    const glassRimGeo = new THREE.BoxGeometry(0.09, 0.07, 0.015);
    const glassRimLeft = new THREE.Mesh(glassRimGeo, tGlassesMat);
    glassRimLeft.position.set(-0.08, 1.60, 0.185);
    teacherFigure.add(glassRimLeft);

    const glassRimRight = new THREE.Mesh(glassRimGeo, tGlassesMat);
    glassRimRight.position.set(0.08, 1.60, 0.185);
    teacherFigure.add(glassRimRight);

    const glassBridgeGeo = new THREE.BoxGeometry(0.06, 0.015, 0.015);
    const glassBridge = new THREE.Mesh(glassBridgeGeo, tGlassesMat);
    glassBridge.position.set(0, 1.60, 0.185);
    teacherFigure.add(glassBridge);

    // 3. Arms & Hands (Active typing at Teacher Laptop)
    const tArmGeo = new THREE.BoxGeometry(0.10, 0.35, 0.11);
    const tLeftArm = new THREE.Mesh(tArmGeo, tBlazerMat);
    tLeftArm.position.set(-0.30, 1.18, 0.16);
    tLeftArm.rotation.x = -0.72;
    tLeftArm.castShadow = true;
    teacherFigure.add(tLeftArm);

    const tLeftForearmGeo = new THREE.BoxGeometry(0.09, 0.09, 0.38);
    const tLeftForearm = new THREE.Mesh(tLeftForearmGeo, tBlazerMat);
    tLeftForearm.position.set(-0.24, 1.25, 0.50);
    tLeftForearm.rotation.x = 0.10;
    teacherFigure.add(tLeftForearm);

    const tHandGeo = new THREE.BoxGeometry(0.08, 0.04, 0.08);
    const tLeftHand = new THREE.Mesh(tHandGeo, tSkinMat);
    tLeftHand.position.set(-0.18, 1.30, 0.72);
    teacherFigure.add(tLeftHand);

    const tRightArm = new THREE.Mesh(tArmGeo, tBlazerMat);
    tRightArm.position.set(0.30, 1.18, 0.16);
    tRightArm.rotation.x = -0.72;
    tRightArm.castShadow = true;
    teacherFigure.add(tRightArm);

    const tRightForearmGeo = new THREE.BoxGeometry(0.09, 0.09, 0.38);
    const tRightForearm = new THREE.Mesh(tRightForearmGeo, tBlazerMat);
    tRightForearm.position.set(0.24, 1.25, 0.50);
    tRightForearm.rotation.x = 0.10;
    teacherFigure.add(tRightForearm);

    const tRightHand = new THREE.Mesh(tHandGeo, tSkinMat);
    tRightHand.position.set(0.18, 1.30, 0.72);
    teacherFigure.add(tRightHand);

    teacherFigure.userData = { leftHand: tLeftHand, rightHand: tRightHand, isTeacher: true };

    // 4. Lower Body (Sitting Gracefully)
    const tPelvisGeo = new THREE.BoxGeometry(0.50, 0.20, 0.32);
    const tPelvis = new THREE.Mesh(tPelvisGeo, tSkirtMat);
    tPelvis.position.set(0, 0.76, 0.02);
    tPelvis.castShadow = true;
    teacherFigure.add(tPelvis);

    const tSkirtGeo = new THREE.BoxGeometry(0.54, 0.64, 0.54);
    const tSkirt = new THREE.Mesh(tSkirtGeo, tSkirtMat);
    tSkirt.position.set(0, 0.45, 0.18);
    tSkirt.castShadow = true;
    teacherFigure.add(tSkirt);

    const tShoeGeo = new THREE.BoxGeometry(0.14, 0.08, 0.20);
    const tLeftShoe = new THREE.Mesh(tShoeGeo, chairBaseMat);
    tLeftShoe.position.set(-0.14, 0.05, 0.42);
    teacherFigure.add(tLeftShoe);

    const tRightShoe = new THREE.Mesh(tShoeGeo, chairBaseMat);
    tRightShoe.position.set(0.14, 0.05, 0.42);
    teacherFigure.add(tRightShoe);

    // 5. Teacher Desk Accessories: Mug & Agenda
    const mugGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.28, 16);
    const mugMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const mug = new THREE.Mesh(mugGeo, mugMat);
    mug.position.set(1.4, 1.35, 1.05);
    mug.castShadow = true;
    teacherFigure.add(mug);

    const bookGeo = new THREE.BoxGeometry(0.65, 0.06, 0.85);
    const bookMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 });
    const book = new THREE.Mesh(bookGeo, bookMat);
    book.position.set(-1.4, 1.25, 1.05);
    book.rotation.y = 0.15;
    book.castShadow = true;
    teacherFigure.add(book);

    teacherDeskGroup.add(teacherFigure);
    teacherFigureRef.current = teacherFigure;

    scene.add(teacherDeskGroup);

    // 8. 35 STUDENT DESKS & PC SETUPS
    const deskMap = new Map<number, { topMesh: THREE.Mesh; defaultColor: number }>();
    const studentFigures: THREE.Group[] = [];

    // Common Geometries & Materials for reuse
    const deskTopGeo = new THREE.BoxGeometry(1.9, 0.12, 1.25);
    const deskLegGeo = new THREE.BoxGeometry(0.08, 1.05, 0.08);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.5 });

    // Monitor
    const monitorBezelGeo = new THREE.BoxGeometry(0.95, 0.62, 0.04);
    const monitorBezelMat = new THREE.MeshStandardMaterial({ color: 0x090d16 });

    const screenGeo = new THREE.PlaneGeometry(0.88, 0.55);
    // Colorful glowing terminal screens (blue, green, yellow, purple)
    const screenColors = [0x38bdf8, 0x4ade80, 0xfacc15, 0xc084fc, 0x22d3ee];

    const standBaseGeo = new THREE.BoxGeometry(0.35, 0.03, 0.28);
    const standNeckGeo = new THREE.BoxGeometry(0.08, 0.25, 0.06);

    // Keyboard & Mouse
    const kbGeo = new THREE.BoxGeometry(0.65, 0.025, 0.24);
    const kbMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const mouseGeo = new THREE.BoxGeometry(0.09, 0.025, 0.14);
    const mouseMat = new THREE.MeshStandardMaterial({ color: 0x000000 });

    // Chair
    const chairSeatGeo = new THREE.BoxGeometry(0.85, 0.08, 0.75);
    const chairBackGeo = new THREE.BoxGeometry(0.85, 0.75, 0.07);
    const chairPostGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 8);

    // Layout configuration coordinates:
    // Rows Z positions (from front row 1 to back row 6)
    const rowZ = [-4.0, -0.6, 2.8, 6.2, 9.6, 13.0];

    // Columns X positions
    // Left Wing (Cols 1, 2, 3) | Aisle | Right Wing (Cols 4, 5, 6)
    const colXLeft = [-7.4, -4.8, -2.2];
    const colXRight = [2.2, 4.8, 7.4];

    // Helper to generate a mini badge texture with student number
    const makeBadgeTexture = (num: number) => {
      const c = document.createElement("canvas");
      c.width = 128;
      c.height = 128;
      const ctx2 = c.getContext("2d");
      if (ctx2) {
        ctx2.fillStyle = "#000000";
        ctx2.fillRect(0, 0, 128, 128);
        ctx2.fillStyle = "#e5de00";
        ctx2.fillRect(8, 8, 112, 112);
        ctx2.fillStyle = "#000000";
        ctx2.font = "bold 64px sans-serif";
        ctx2.textAlign = "center";
        ctx2.textBaseline = "middle";
        ctx2.fillText(num < 10 ? `0${num}` : `${num}`, 64, 64);
      }
      return new THREE.CanvasTexture(c);
    };

    // Helper to generate a crisp, personalized VS Code coding screen texture
    const makeCodeScreenTexture = (student: ClassroomStudent) => {
      const c = document.createElement("canvas");
      c.width = 512;
      c.height = 320;
      const ctx = c.getContext("2d");
      if (!ctx) return null;

      // 1. VS Code Dark Background
      ctx.fillStyle = "#1e1e1e";
      ctx.fillRect(0, 0, 512, 320);

      // 2. Tab Bar Header
      ctx.fillStyle = "#252526";
      ctx.fillRect(0, 0, 512, 40);

      // Active File Tab
      ctx.fillStyle = "#1e1e1e";
      ctx.fillRect(16, 4, 180, 36);

      // TS Icon & File Name
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 16px monospace";
      ctx.fillText("TS", 28, 27);

      ctx.fillStyle = "#f1f5f9";
      ctx.font = "bold 16px monospace";
      ctx.fillText(`${student.name}.tsx`, 58, 27);

      // Close Icon
      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px monospace";
      ctx.fillText("×", 178, 27);

      // 3. Line Numbers Gutter
      ctx.fillStyle = "#252526";
      ctx.fillRect(0, 40, 48, 256);

      ctx.fillStyle = "#64748b";
      ctx.font = "15px monospace";
      for (let i = 1; i <= 9; i++) {
        ctx.fillText(`${i}`, 18, 66 + (i - 1) * 26);
      }

      // 4. Syntax Highlighted Code Lines
      const shortRole = student.role.split(" • ")[0] || "Developer";
      const codeLines = [
        { text: `// Developer: ${student.name} • XII PPLG 1`, color: "#6a9955" }, // comment
        { text: `import { PPLG1 } from "@smkn1depok/solid";`, color: "#c586c0" }, // purple keyword
        { text: `const dev = "${student.name}";`, color: "#4ec9b0" }, // teal variable
        { text: `const role = "${shortRole}";`, color: "#ce9178" }, // orange string
        { text: `export function ${student.name}Work() {`, color: "#569cd6" }, // blue keyword
        { text: `  return <Coding solid={true} rank="#${student.absen}" />;`, color: "#4fc1ff" }, // cyan JSX
        { text: `}`, color: "#ffd700" }, // yellow bracket
        { text: `console.log("SMK BISA, PPLG 1 HEBAT!");`, color: "#dcdcaa" }, // light yellow
        { text: `// "${student.quote.slice(0, 28)}..."`, color: "#6a9955" }, // comment quote
      ];

      ctx.font = "15px monospace";
      codeLines.forEach((line, idx) => {
        ctx.fillStyle = line.color;
        ctx.fillText(line.text, 60, 66 + idx * 26);
      });

      // 5. VS Code Bottom Status Bar
      ctx.fillStyle = "#007acc";
      ctx.fillRect(0, 296, 512, 24);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px monospace";
      ctx.fillText(`main* • UTF-8 • TypeScript JSX • Meja #${student.absen}`, 16, 313);
      ctx.fillText("Prettier: ✔", 410, 313);

      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    classroomSeatingData.forEach((student) => {
      const deskGroup = new THREE.Group();

      // Calculate Position
      const zPos = rowZ[student.row - 1];
      const xPos =
        student.wing === "Kiri"
          ? colXLeft[student.col - 1]
          : colXRight[student.col - 4];

      deskGroup.position.set(xPos, 0, zPos);

      // Desk Top Mesh (Interactive target for raycaster)
      const isSpecialRole = student.absen === 19 || student.absen === 17; // Ketua / Wakil
      const baseDeskColor = isSpecialRole ? 0xfff04d : 0xffffff;

      const deskTopMat = new THREE.MeshStandardMaterial({
        color: baseDeskColor,
        roughness: 0.35,
        metalness: 0.1,
      });

      const deskTop = new THREE.Mesh(deskTopGeo, deskTopMat);
      deskTop.position.set(0, 1.05, 0);
      deskTop.castShadow = true;
      deskTop.receiveShadow = true;
      // Tag student data for raycasting
      deskTop.userData = { student, isDesk: true };
      deskGroup.add(deskTop);
      interactiveMeshes.push(deskTop);
      deskMap.set(student.absen, { topMesh: deskTop, defaultColor: baseDeskColor });

      // Desk Legs (4 posts)
      const legOffsets = [
        [-0.85, -0.52],
        [0.85, -0.52],
        [-0.85, 0.52],
        [0.85, 0.52],
      ];
      legOffsets.forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(deskLegGeo, legMat);
        leg.position.set(lx, 0.525, lz);
        leg.castShadow = true;
        deskGroup.add(leg);
      });

      // Monitor Setup (Facing positive Z, towards the student)
      const monitorGroup = new THREE.Group();
      monitorGroup.position.set(0, 1.12, -0.28);

      const standBase = new THREE.Mesh(standBaseGeo, monitorBezelMat);
      standBase.position.y = 0.015;
      monitorGroup.add(standBase);

      const standNeck = new THREE.Mesh(standNeckGeo, monitorBezelMat);
      standNeck.position.set(0, 0.14, -0.04);
      monitorGroup.add(standNeck);

      const monitorBezel = new THREE.Mesh(monitorBezelGeo, monitorBezelMat);
      monitorBezel.position.set(0, 0.55, 0);
      monitorBezel.castShadow = true;
      monitorGroup.add(monitorBezel);

      // Coding Screen (VS Code Editor Theme Personalized for Student)
      const codeTex = makeCodeScreenTexture(student);
      const screenMat = new THREE.MeshBasicMaterial({ map: codeTex });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.set(0, 0.55, 0.022);
      monitorGroup.add(screen);

      // Mini Desk Badge / Absen Tag behind monitor
      const badgeTex = makeBadgeTexture(student.absen);
      const badgeMat = new THREE.MeshBasicMaterial({ map: badgeTex });
      const badgeGeo = new THREE.PlaneGeometry(0.32, 0.32);
      const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
      badgeMesh.position.set(0, 0.55, -0.022);
      badgeMesh.rotation.y = Math.PI;
      monitorGroup.add(badgeMesh);

      deskGroup.add(monitorGroup);

      // Keyboard & Mouse
      const keyboard = new THREE.Mesh(kbGeo, kbMat);
      keyboard.position.set(-0.15, 1.12, 0.22);
      deskGroup.add(keyboard);

      const mouse = new THREE.Mesh(mouseGeo, mouseMat);
      mouse.position.set(0.45, 1.12, 0.24);
      deskGroup.add(mouse);

      // Student Chair (Placed behind desk, facing monitor)
      const chairGroup = new THREE.Group();
      chairGroup.position.set(0, 0, 0.95);

      const chairMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b, // Dark navy
        roughness: 0.6,
      });

      const chairSeat = new THREE.Mesh(chairSeatGeo, chairMat);
      chairSeat.position.y = 0.65;
      chairSeat.castShadow = true;
      chairGroup.add(chairSeat);

      const chairBack = new THREE.Mesh(chairBackGeo, chairMat);
      chairBack.position.set(0, 1.1, 0.36);
      chairBack.castShadow = true;
      chairGroup.add(chairBack);

      const chairPost = new THREE.Mesh(chairPostGeo, legMat);
      chairPost.position.y = 0.3;
      chairGroup.add(chairPost);

      deskGroup.add(chairGroup);

      // --- 3D SITTING STUDENT FIGURE (COWO / CEWE) ---
      const figureGroup = new THREE.Group();
      figureGroup.position.set(0, 0, 0.85);

      const isGirl = student.gender === "cewe";

      // Common Materials
      const skinMat = new THREE.MeshStandardMaterial({
        color: 0xf6c8a4, // Healthy Indonesian skin tone
        roughness: 0.6,
      });
      const uniformShirtMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc, // Clean white SMK uniform shirt
        roughness: 0.5,
      });
      const uniformBottomMat = new THREE.MeshStandardMaterial({
        color: 0x334155, // Dark grey/navy SMK uniform pants/skirt
        roughness: 0.6,
      });
      const shoesMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a, // Black school shoes
        roughness: 0.4,
      });

      // 1. Torso (Badan & Seragam Putih SMK)
      const torsoGeo = new THREE.BoxGeometry(0.50, 0.56, 0.28);
      const torso = new THREE.Mesh(torsoGeo, uniformShirtMat);
      torso.position.set(0, 0.98, 0);
      torso.castShadow = true;
      torso.userData = { student, isDesk: true };
      figureGroup.add(torso);
      interactiveMeshes.push(torso);

      // Tie for boys
      if (!isGirl) {
        const tieGeo = new THREE.BoxGeometry(0.08, 0.28, 0.02);
        const tieMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a });
        const tie = new THREE.Mesh(tieGeo, tieMat);
        tie.position.set(0, 1.05, -0.15);
        figureGroup.add(tie);
      }

      // 2. Head & Neck
      const neckGeo = new THREE.CylinderGeometry(0.07, 0.08, 0.1, 8);
      const neck = new THREE.Mesh(neckGeo, skinMat);
      neck.position.set(0, 1.30, 0);
      figureGroup.add(neck);

      const headGeo = new THREE.BoxGeometry(0.30, 0.30, 0.28);
      const head = new THREE.Mesh(headGeo, skinMat);
      head.position.set(0, 1.48, -0.01);
      head.castShadow = true;
      head.userData = { student, isDesk: true };
      figureGroup.add(head);
      interactiveMeshes.push(head);

      // Eyes facing negative Z (towards monitor)
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
      const eyeGeo = new THREE.BoxGeometry(0.04, 0.04, 0.02);
      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.position.set(-0.07, 1.48, -0.155);
      figureGroup.add(leftEye);

      const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
      rightEye.position.set(0.07, 1.48, -0.155);
      figureGroup.add(rightEye);

      // 3. Gender-Specific Hair / Hijab Styling
      if (!isGirl) {
        // --- COWO (BOY): Short stylish haircut ---
        const hairMat = new THREE.MeshStandardMaterial({
          color: 0x171717, // Jet black hair
          roughness: 0.8,
        });
        const topHairGeo = new THREE.BoxGeometry(0.33, 0.11, 0.31);
        const topHair = new THREE.Mesh(topHairGeo, hairMat);
        topHair.position.set(0, 1.62, -0.01);
        topHair.castShadow = true;
        figureGroup.add(topHair);

        const backHairGeo = new THREE.BoxGeometry(0.33, 0.22, 0.08);
        const backHair = new THREE.Mesh(backHairGeo, hairMat);
        backHair.position.set(0, 1.48, 0.13);
        figureGroup.add(backHair);

        const fringeGeo = new THREE.BoxGeometry(0.28, 0.06, 0.06);
        const fringe = new THREE.Mesh(fringeGeo, hairMat);
        fringe.position.set(0, 1.58, -0.14);
        figureGroup.add(fringe);
      } else {
        // --- CEWE (GIRL): Elegant Hijab Putih SMK ---
        const hijabMat = new THREE.MeshStandardMaterial({
          color: 0xf1f5f9, // Pristine white SMK hijab
          roughness: 0.4,
        });
        const hijabWrapGeo = new THREE.BoxGeometry(0.35, 0.36, 0.33);
        const hijabWrap = new THREE.Mesh(hijabWrapGeo, hijabMat);
        hijabWrap.position.set(0, 1.49, 0.015);
        hijabWrap.castShadow = true;
        figureGroup.add(hijabWrap);

        const drapeGeo = new THREE.BoxGeometry(0.46, 0.26, 0.30);
        const drape = new THREE.Mesh(drapeGeo, hijabMat);
        drape.position.set(0, 1.20, -0.01);
        drape.castShadow = true;
        figureGroup.add(drape);
      }

      // 4. Arms & Hands (Active Typing on Desk)
      const armGeo = new THREE.BoxGeometry(0.09, 0.32, 0.10);

      const leftArm = new THREE.Mesh(armGeo, uniformShirtMat);
      leftArm.position.set(-0.28, 1.12, -0.16);
      leftArm.rotation.x = 0.85;
      leftArm.castShadow = true;
      figureGroup.add(leftArm);

      const leftForearmGeo = new THREE.BoxGeometry(0.08, 0.08, 0.34);
      const leftForearm = new THREE.Mesh(leftForearmGeo, uniformShirtMat);
      leftForearm.position.set(-0.22, 0.98, -0.42);
      figureGroup.add(leftForearm);

      const handGeo = new THREE.BoxGeometry(0.08, 0.05, 0.08);
      const leftHand = new THREE.Mesh(handGeo, skinMat);
      leftHand.position.set(-0.16, 1.02, -0.58);
      figureGroup.add(leftHand);

      const rightArm = new THREE.Mesh(armGeo, uniformShirtMat);
      rightArm.position.set(0.28, 1.12, -0.16);
      rightArm.rotation.x = 0.85;
      rightArm.castShadow = true;
      figureGroup.add(rightArm);

      const rightForearmGeo = new THREE.BoxGeometry(0.08, 0.08, 0.34);
      const rightForearm = new THREE.Mesh(rightForearmGeo, uniformShirtMat);
      rightForearm.position.set(0.32, 0.98, -0.40);
      figureGroup.add(rightForearm);

      const rightHand = new THREE.Mesh(handGeo, skinMat);
      rightHand.position.set(0.42, 1.02, -0.56);
      figureGroup.add(rightHand);

      figureGroup.userData = { leftHand, rightHand };

      // 5. Lower Body (Sitting: Pelvis, Legs, Shoes)
      const pelvisGeo = new THREE.BoxGeometry(0.46, 0.18, 0.30);
      const pelvis = new THREE.Mesh(pelvisGeo, uniformBottomMat);
      pelvis.position.set(0, 0.68, 0.02);
      pelvis.castShadow = true;
      figureGroup.add(pelvis);

      if (!isGirl) {
        // --- COWO: Celana Abu/Navy & Sepatu ---
        const thighGeo = new THREE.BoxGeometry(0.18, 0.16, 0.38);
        const leftThigh = new THREE.Mesh(thighGeo, uniformBottomMat);
        leftThigh.position.set(-0.13, 0.66, -0.21);
        leftThigh.castShadow = true;
        figureGroup.add(leftThigh);

        const rightThigh = new THREE.Mesh(thighGeo, uniformBottomMat);
        rightThigh.position.set(0.13, 0.66, -0.21);
        rightThigh.castShadow = true;
        figureGroup.add(rightThigh);

        const shinGeo = new THREE.BoxGeometry(0.14, 0.44, 0.14);
        const leftShin = new THREE.Mesh(shinGeo, uniformBottomMat);
        leftShin.position.set(-0.13, 0.36, -0.38);
        leftShin.castShadow = true;
        figureGroup.add(leftShin);

        const rightShin = new THREE.Mesh(shinGeo, uniformBottomMat);
        rightShin.position.set(0.13, 0.36, -0.38);
        rightShin.castShadow = true;
        figureGroup.add(rightShin);

        const shoeGeo = new THREE.BoxGeometry(0.14, 0.09, 0.22);
        const leftShoe = new THREE.Mesh(shoeGeo, shoesMat);
        leftShoe.position.set(-0.13, 0.06, -0.42);
        figureGroup.add(leftShoe);

        const rightShoe = new THREE.Mesh(shoeGeo, shoesMat);
        rightShoe.position.set(0.13, 0.06, -0.42);
        figureGroup.add(rightShoe);
      } else {
        // --- CEWE: Rok Panjang SMK & Sepatu ---
        const skirtGeo = new THREE.BoxGeometry(0.48, 0.58, 0.48);
        const skirt = new THREE.Mesh(skirtGeo, uniformBottomMat);
        skirt.position.set(0, 0.42, -0.16);
        skirt.castShadow = true;
        figureGroup.add(skirt);

        const shoeGeo = new THREE.BoxGeometry(0.13, 0.08, 0.18);
        const leftShoe = new THREE.Mesh(shoeGeo, shoesMat);
        leftShoe.position.set(-0.12, 0.05, -0.36);
        figureGroup.add(leftShoe);

        const rightShoe = new THREE.Mesh(shoeGeo, shoesMat);
        rightShoe.position.set(0.12, 0.05, -0.36);
        figureGroup.add(rightShoe);
      }

      studentFigures.push(figureGroup);
      deskGroup.add(figureGroup);

      scene.add(deskGroup);
    });

    deskMeshesRef.current = deskMap;
    setIsSceneReady(true);

    // 9. RAYCASTING & INTERACTIVE POINTER DRAG HANDLING
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let currentHoveredAbsen: number | null = null;
    let isDragging = false;
    let pointerStartX = 0;
    let pointerStartY = 0;

    const getPointerPos = (e: MouseEvent | TouchEvent | PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const clientY = "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
      return {
        x: ((clientX - rect.left) / rect.width) * 2 - 1,
        y: -((clientY - rect.top) / rect.height) * 2 + 1,
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
        canvas.style.cursor = "pointer";

        if (hit.userData.isTeacher) {
          setIsTeacherHovered(true);
          setHoveredStudent(null);
          if (currentHoveredAbsen !== null) {
            const prev = deskMap.get(currentHoveredAbsen);
            if (prev) {
              (prev.topMesh.material as THREE.MeshStandardMaterial).color.setHex(prev.defaultColor);
            }
            currentHoveredAbsen = null;
          }
          return;
        }

        setIsTeacherHovered(false);

        if (hit.userData.student) {
          const student = hit.userData.student as ClassroomStudent;
          if (currentHoveredAbsen !== student.absen) {
            if (currentHoveredAbsen !== null) {
              const prev = deskMap.get(currentHoveredAbsen);
              if (prev) {
                (prev.topMesh.material as THREE.MeshStandardMaterial).color.setHex(prev.defaultColor);
              }
            }
            currentHoveredAbsen = student.absen;
            (hit.material as THREE.MeshStandardMaterial).color.setHex(0xe5de00);
            setHoveredStudent(student);
          }
        }
      } else {
        canvas.style.cursor = "grab";
        setIsTeacherHovered(false);
        if (currentHoveredAbsen !== null) {
          const prev = deskMap.get(currentHoveredAbsen);
          if (prev) {
            (prev.topMesh.material as THREE.MeshStandardMaterial).color.setHex(prev.defaultColor);
          }
          currentHoveredAbsen = null;
          setHoveredStudent(null);
        }
      }
    };

    const handleClickCheck = (e: PointerEvent) => {
      const p = getPointerPos(e);
      pointer.x = p.x;
      pointer.y = p.y;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        if (hit.userData.isTeacher) {
          setIsTeacherSelected(true);
          setSelectedStudent(null);
        } else if (hit.userData.student) {
          setSelectedStudent(hit.userData.student as ClassroomStudent);
          setIsTeacherSelected(false);
        }
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      isDragging = false;
      canvas.style.cursor = "grabbing";

      // Stop any scripted camera lerp immediately on manual input
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
      // ONLY trigger desk selection if mouse did NOT drag (click threshold < 6px)
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

    // 10. RESIZE LISTENER
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 580;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    // 11. INTERSECTION OBSERVER (Zero GPU/CPU cost when scrolled out of view)
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

    // 12. ANIMATION LOOP
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Skip all calculations and rendering when element is off-screen!
      if (!isVisible) return;

      // Handle smooth camera interpolation when preset or student is clicked
      const anim = animationTargetRef.current;
      if (anim.active) {
        anim.progress += 0.045;
        camera.position.lerp(anim.camPos, 0.08);
        controls.target.lerp(anim.targetPos, 0.08);

        if (anim.progress >= 1) {
          anim.active = false;
        }
      }

      // Cold air breeze gentle oscillation
      const t = Date.now() * 0.003;
      breezeMeshes.forEach((mesh, idx) => {
        mesh.scale.y = 0.9 + Math.sin(t + idx * 1.5) * 0.15;
        (mesh.material as THREE.MeshBasicMaterial).opacity = 0.14 + Math.sin(t * 1.2 + idx) * 0.06;
      });

      // Subtle student breathing & typing animation
      const timeSec = Date.now() * 0.002;
      studentFigures.forEach((fig, idx) => {
        fig.position.y = Math.sin(timeSec * 1.8 + idx * 0.5) * 0.008;
        if (fig.userData.leftHand) {
          fig.userData.leftHand.position.y = 1.02 + Math.sin(timeSec * 6 + idx * 2) * 0.004;
        }
        if (fig.userData.rightHand) {
          fig.userData.rightHand.position.y = 1.02 + Math.cos(timeSec * 5 + idx * 3) * 0.004;
        }
      });

      // Subtle Bu Hilda breathing, monitoring & typing animation
      if (teacherFigureRef.current) {
        teacherFigureRef.current.position.y = Math.sin(timeSec * 1.5) * 0.006;
        if (teacherFigureRef.current.userData.leftHand) {
          teacherFigureRef.current.userData.leftHand.position.y = 1.30 + Math.sin(timeSec * 6) * 0.003;
        }
        if (teacherFigureRef.current.userData.rightHand) {
          teacherFigureRef.current.userData.rightHand.position.y = 1.30 + Math.cos(timeSec * 5.5) * 0.003;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 13. CLEANUP
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  return (
    <section id="denah" className="py-14 sm:py-20 bg-neo-white text-black border-b-4 border-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 bg-neo-yellow border-3 border-black font-black uppercase text-xs sm:text-sm tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Monitor className="w-4 h-4 stroke-[2.5]" />
            <span>3D Interactive Classroom</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-black">
            RUANG KELAS XII PPLG 1
          </h2>
          <p className="mt-3 text-sm sm:text-base md:text-lg font-bold text-neutral-700">
            Jelajahi ruang kelas 3D virtual 35 murid XII PPLG 1. Drag untuk putar 360°, scroll untuk zoom, dan klik meja temanmu!
          </p>
        </div>

        {/* 3D Canvas Box Container */}
        <div className="relative border-4 border-black bg-[#0a0f1d] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          {/* Top Control Bar Over 3D Scene */}
          <div className="relative z-10 bg-neo-yellow border-b-4 border-black p-2.5 sm:p-3.5 flex flex-wrap items-center justify-between gap-3">
            {/* Search Student Quick Bar */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-black absolute left-3 pointer-events-none stroke-[2.5]" />
                <input
                  type="text"
                  placeholder="Cari nama siswa (misal: Jonni)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-black text-xs sm:text-sm font-bold pl-9 pr-3 py-1.5 sm:py-2 border-2 sm:border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none placeholder:text-neutral-500"
                />
              </div>

              {/* Autocomplete Dropdown */}
              {filteredStudents.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-48 overflow-y-auto z-50">
                  {filteredStudents.map((student) => (
                    <button
                      key={student.absen}
                      type="button"
                      onClick={() => {
                        focusOnStudent(student);
                        setSearchQuery("");
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold border-b border-neutral-200 hover:bg-neo-yellow flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span>
                        #{student.absen < 10 ? `0${student.absen}` : student.absen} {student.name}
                      </span>
                      <span className="text-[10px] text-neutral-600 uppercase">{student.role}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Camera View Angle & Auto Rotate Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => {
                  const nextState = !isAutoRotating;
                  setIsAutoRotating(nextState);
                  if (controlsRef.current) {
                    controlsRef.current.autoRotate = nextState;
                    controlsRef.current.autoRotateSpeed = 1.2;
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 border-2 border-black font-black text-[11px] sm:text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
                  isAutoRotating ? "bg-neo-yellow text-black ring-2 ring-black" : "bg-white text-black hover:bg-neutral-100"
                }`}
                title="Putar Otomatis 360 Derajat"
              >
                <RotateCw className={`w-3.5 h-3.5 stroke-[2.5] ${isAutoRotating ? "animate-spin" : ""}`} />
                <span>{isAutoRotating ? "Stop Putar" : "Auto Putar 360°"}</span>
              </button>

              <button
                type="button"
                onClick={() => handlePresetView("orbit")}
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 border-2 border-black font-black text-[11px] sm:text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
                  viewMode === "orbit" && !isAutoRotating ? "bg-black text-neo-yellow" : "bg-white text-black hover:bg-neutral-100"
                }`}
                title="Tampilan Perspektif Bebas 3D"
              >
                <Compass className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>3D Bebas</span>
              </button>

              <button
                type="button"
                onClick={() => handlePresetView("top")}
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 border-2 border-black font-black text-[11px] sm:text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
                  viewMode === "top" ? "bg-black text-neo-yellow" : "bg-white text-black hover:bg-neutral-100"
                }`}
                title="Tampak Atas / Blueprint 2D"
              >
                <LayoutGrid className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Tampak Atas</span>
              </button>

              <button
                type="button"
                onClick={() => handlePresetView("teacher")}
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 border-2 border-black font-black text-[11px] sm:text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
                  viewMode === "teacher" ? "bg-black text-neo-yellow" : "bg-white text-black hover:bg-neutral-100"
                }`}
                title="Tampak dari Meja Guru ke Belakang"
              >
                <GraduationCap className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Meja Guru</span>
              </button>

              <button
                type="button"
                onClick={() => handlePresetView("back")}
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 border-2 border-black font-black text-[11px] sm:text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
                  viewMode === "back" ? "bg-black text-neo-yellow" : "bg-white text-black hover:bg-neutral-100"
                }`}
                title="Tampak dari Belakang ke Whiteboard"
              >
                <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Dari Belakang</span>
              </button>
            </div>
          </div>

          {/* Three.js Canvas */}
          <div ref={containerRef} className="w-full h-[450px] sm:h-[580px] relative touch-none select-none">
            <canvas
              ref={canvasRef}
              className="w-full h-full block touch-none cursor-grab active:cursor-grabbing outline-none"
            />

            {/* Hover Tooltip Overlay */}
            {hoveredStudent && !selectedStudent && !isTeacherSelected && (
              <div className="absolute top-4 left-4 z-20 pointer-events-none bg-white text-black px-3.5 py-2 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-fade-in">
                <p className="text-xs font-black uppercase text-neutral-500">
                  Meja #{hoveredStudent.absen < 10 ? `0${hoveredStudent.absen}` : hoveredStudent.absen} • Baris {hoveredStudent.row}
                </p>
                <p className="text-base font-black uppercase text-black leading-tight">
                  {hoveredStudent.name}
                </p>
                <p className="text-[11px] font-bold text-neutral-700">{hoveredStudent.role}</p>
              </div>
            )}

            {isTeacherHovered && !selectedStudent && !isTeacherSelected && (
              <div className="absolute top-4 left-4 z-20 pointer-events-none bg-neo-yellow text-black px-3.5 py-2 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-fade-in">
                <p className="text-xs font-black uppercase text-neutral-900 flex items-center gap-1 font-mono">
                  WALI KELAS • XII PPLG 1
                </p>
                <p className="text-base font-black uppercase text-black leading-tight">
                  Bu Hilda Rahmawati, S.Kom
                </p>
                <p className="text-[11px] font-bold text-neutral-800">Guru Produktif & Wali Kelas (Klik untuk info)</p>
              </div>
            )}
          </div>

          {/* Bottom Bar: Help Legend & Hint */}
          <div className="bg-black text-white px-3 sm:px-4 py-2 text-xs font-bold flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-neo-yellow">
                <GraduationCap className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Wali Kelas: Bu Hilda</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 bg-white border border-black inline-block" /> 35 Meja Murid
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 bg-neo-yellow border border-black inline-block" /> Meja Guru & Whiteboard
              </span>
              <span className="inline-flex items-center gap-1.5 text-cyan-300">
                <Snowflake className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>4 Unit AC (16°C)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-amber-300">
                <Users className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>22 Siswa • 13 Siswi</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <Code2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>35 Layar VS Code Aktif</span>
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-neo-yellow text-[11px] uppercase font-black">
              <Info className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Drag: Putar 360° • Scroll: Zoom In/Out</span>
            </div>
          </div>
        </div>

        {/* Selected Student Modal / Floating Card */}
        <AnimatePresence>
          {selectedStudent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
              onClick={() => setSelectedStudent(null)}
            >
              <motion.div
                initial={{ scale: 0.85, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.85, y: 20 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-neo-white text-black border-4 border-black p-5 sm:p-7 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="absolute top-3.5 right-3.5 w-8 h-8 sm:w-9 sm:h-9 bg-neo-yellow border-2 sm:border-3 border-black font-black flex items-center justify-center text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4 stroke-[3]" />
                </button>

                {/* Desk Badge */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="px-3 py-1 bg-black text-neo-yellow text-xs sm:text-sm font-black uppercase tracking-wider border border-black">
                    MEJA #{selectedStudent.absen < 10 ? `0${selectedStudent.absen}` : selectedStudent.absen}
                  </span>
                  <span className="px-2.5 py-1 bg-neutral-200 text-black text-[11px] sm:text-xs font-black uppercase border border-black">
                    BARIS {selectedStudent.row} • SAYAP {selectedStudent.wing.toUpperCase()}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neo-yellow text-black text-[11px] sm:text-xs font-black uppercase border border-black">
                    <User className="w-3 h-3 stroke-[2.5]" />
                    <span>{selectedStudent.gender === "cewe" ? "Siswi (Berhijab)" : "Siswa"}</span>
                  </span>
                </div>

                {/* Student Name */}
                <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black mb-1">
                  {selectedStudent.name}
                </h3>

                {/* Student Role */}
                <p className="text-sm sm:text-base font-black text-neutral-800 uppercase mb-4 inline-block bg-neo-yellow px-2 py-0.5 border border-black">
                  {selectedStudent.role}
                </p>

                {/* Quote Box */}
                <div className="bg-neutral-100 border-3 border-black p-3.5 mb-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-neutral-500 mb-1">
                    <Quote className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Quote Siswa:</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold italic text-neutral-900">
                    &ldquo;{selectedStudent.quote}&rdquo;
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => focusOnStudent(selectedStudent)}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-black text-neo-yellow font-black uppercase text-xs sm:text-sm border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                  >
                    <Focus className="w-4 h-4 stroke-[2.5]" />
                    <span>Zoom Ke Meja Ini</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                    className="px-4 py-2.5 bg-white text-black font-black uppercase text-xs sm:text-sm border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-100 transition-all cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {isTeacherSelected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
              onClick={() => setIsTeacherSelected(false)}
            >
              <motion.div
                initial={{ scale: 0.85, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.85, y: 20 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-neo-white text-black border-4 border-black p-5 sm:p-7 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsTeacherSelected(false)}
                  className="absolute top-3.5 right-3.5 w-8 h-8 sm:w-9 sm:h-9 bg-neo-yellow border-2 sm:border-3 border-black font-black flex items-center justify-center text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4 stroke-[3]" />
                </button>

                {/* Teacher Badge */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="px-3 py-1 bg-black text-neo-yellow text-xs sm:text-sm font-black uppercase tracking-wider border border-black inline-flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 stroke-[2.5]" />
                    MEJA GURU
                  </span>
                  <span className="px-2.5 py-1 bg-neo-yellow text-black text-[11px] sm:text-xs font-black uppercase border border-black">
                    WALI KELAS XII PPLG 1
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-200 text-black text-[11px] sm:text-xs font-black uppercase border border-black">
                    <User className="w-3 h-3 stroke-[2.5]" />
                    <span>Guru Produktif</span>
                  </span>
                </div>

                {/* Teacher Name */}
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mb-1">
                  Hilda Rahmawati, S.Kom
                </h3>

                {/* Teacher Role */}
                <p className="text-sm sm:text-base font-black text-neutral-800 uppercase mb-4 inline-block bg-neo-yellow px-2 py-0.5 border border-black">
                  Guru Produktif & Wali Kelas XII PPLG 1
                </p>

                {/* Quote Box */}
                <div className="bg-neutral-100 border-3 border-black p-3.5 mb-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-neutral-500 mb-1">
                    <Quote className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Pesan & Motivasi Wali Kelas:</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold italic text-neutral-900">
                    &ldquo;Kodingan yang rapi mencerminkan logika yang tertata. Tetap semangat mengasah skill, jaga kedisiplinan, dan saling dukung satu sama lain menuju gerbang kelulusan.&rdquo;
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      animateCameraTo(new THREE.Vector3(0, 3.2, -4.5), new THREE.Vector3(0, 2.0, -8.8));
                      setIsTeacherSelected(false);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-black text-neo-yellow font-black uppercase text-xs sm:text-sm border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                  >
                    <Focus className="w-4 h-4 stroke-[2.5]" />
                    <span>Zoom Meja Bu Hilda</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTeacherSelected(false)}
                    className="px-4 py-2.5 bg-white text-black font-black uppercase text-xs sm:text-sm border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-100 transition-all cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
