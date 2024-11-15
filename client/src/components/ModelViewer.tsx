import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

interface ModelViewerProps {
  modelUrl: string;
}

function ModelViewer({ modelUrl }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    let mounted = true;
    const container = containerRef.current;

    // Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Use colorSpace instead of outputEncoding
    renderer.colorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 10;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 2, 3);
    scene.add(directionalLight);

    // Add placeholder geometry while loading
    const placeholderGeometry = new THREE.BoxGeometry(1, 1, 1);
    const placeholderMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xcccccc,
      wireframe: true
    });
    const placeholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial);
    scene.add(placeholder);

    // Setup DRACO loader for compressed models
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    dracoLoader.preload();

    // Load model
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      modelUrl,
      (gltf) => {
        if (!mounted) return;
        
        scene.remove(placeholder);
        scene.add(gltf.scene);
        
        // Center and scale model
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        gltf.scene.position.sub(center);
        const maxDimension = Math.max(...size.toArray());
        const scale = 2 / maxDimension;
        gltf.scene.scale.multiplyScalar(scale);
        
        camera.position.z = 3;
        controls.reset();
      },
      (progress) => {
        if (!mounted) return;
        const percentage = (progress.loaded / (progress.total || 1)) * 100;
        setLoadingProgress(Math.round(percentage));
      },
      (error) => {
        if (!mounted) return;
        console.error('Error loading model:', error);
        setError('Failed to load 3D model');
      }
    );

    // Handle window resize
    function handleResize() {
      if (!container) return;
      
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }

    window.addEventListener('resize', handleResize);

    // Animation loop
    function animate() {
      if (!mounted) return;
      
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);

      // Rotate placeholder while loading
      if (placeholder) {
        placeholder.rotation.y += 0.01;
      }
    }
    animate();

    // Cleanup
    return () => {
      mounted = false;
      window.removeEventListener('resize', handleResize);
      scene.clear();
      renderer.dispose();
      dracoLoader.dispose();
      controls.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [modelUrl]);

  return (
    <div className="relative w-full aspect-square">
      <div 
        ref={containerRef} 
        className="w-full h-full" 
        role="region" 
        aria-label="3D model viewer"
      />
      
      {/* Loading overlay */}
      {loadingProgress < 100 && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-muted-foreground" role="status">
              Loading model... {loadingProgress}%
            </p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center text-destructive" role="alert">
            <p className="font-semibold">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Please try refreshing the page
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModelViewer;
