import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Box } from '@chakra-ui/react';

const BitcoinModel = () => {
  const mountRef = useRef(null);
  const [error, setError] = useState(false);
  const mousePosition = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const isHovered = useRef(false);

  useEffect(() => {
    if (!mountRef.current) return;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
      
      // Set size based on container
      const width = 300;
      const height = 300;
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      
      // Clear any existing canvas
      while (mountRef.current.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
      mountRef.current.appendChild(renderer.domElement);

      // Add environment mapping for reflection
      const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
      const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
      scene.add(cubeCamera);

      // Create Bitcoin texture with ₿ symbol
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const context = canvas.getContext('2d');
      
      context.fillStyle = '#ffeb0d';
      context.fillRect(0, 0, 512, 512);
      
      // Draw Bitcoin symbol without rotation
      context.shadowColor = 'rgba(0, 0, 0, 0.5)';
      context.shadowBlur = 10;
      context.fillStyle = '#B8860B';
      context.font = 'bold 280px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText('₿', 256, 256);

      const texture = new THREE.CanvasTexture(canvas);
      
      // Create materials with enhanced reflection and shine
      const mainMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xFFD700,
        metalness: 0.9,
        roughness: 0.1,
        reflectivity: 1,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        envMap: cubeRenderTarget.texture,
        emissive: 0xFFB347,
        emissiveIntensity: 0.2,
        specular: 0xFFFFFF,
      });

      const symbolMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xFFD700,
        metalness: 0.9,
        roughness: 0.1,
        reflectivity: 1,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        envMap: cubeRenderTarget.texture,
        map: texture,
        specular: 0xFFFFFF,
      });

      // Create materials array for cylinder sides
      const materials = [
        mainMaterial,
        symbolMaterial,
        symbolMaterial,
      ];

      const geometry = new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32);
      const bitcoin = new THREE.Mesh(geometry, materials);
      bitcoin.rotation.x = Math.PI / 2;
      scene.add(bitcoin);

      // Add spot light for center shine
      const spotLight = new THREE.SpotLight(0xFFFFFF, 5);
      spotLight.position.set(0, 5, 5);
      spotLight.angle = Math.PI / 8;
      spotLight.penumbra = 0.1;
      spotLight.decay = 0;
      spotLight.distance = 20;
      scene.add(spotLight);

      // Enhanced lighting
      const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
      mainLight.position.set(2, 2, 2);
      scene.add(mainLight);

      const backLight = new THREE.DirectionalLight(0xffffff, 0.8);
      backLight.position.set(-2, -2, -2);
      scene.add(backLight);

      scene.add(new THREE.AmbientLight(0xffffff, 0.5));

      camera.position.set(0, 0, 4);
      camera.lookAt(0, 0, 0);

      // Add mouse event handlers
      const handleMouseMove = (event) => {
        if (!isHovered.current) return;
        
        const rect = mountRef.current.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        mousePosition.current = { x, y };
        targetRotation.current = {
          x: y * Math.PI / 4,
          y: x * Math.PI / 4
        };
      };

      const handleMouseEnter = () => {
        isHovered.current = true;
      };

      const handleMouseLeave = () => {
        isHovered.current = false;
        targetRotation.current = { x: Math.PI / 2, y: 0 };
      };

      mountRef.current.addEventListener('mousemove', handleMouseMove);
      mountRef.current.addEventListener('mouseenter', handleMouseEnter);
      mountRef.current.addEventListener('mouseleave', handleMouseLeave);

      // Smooth animation
      let lastTime = 0;
      const rotationSpeed = 0.001;

      function animate(currentTime) {
        if (!mountRef.current) return;

        const time = Date.now() * 0.001;
        spotLight.position.x = Math.sin(time) * 3;
        spotLight.position.y = Math.cos(time) * 3;
        spotLight.position.z = 5;

        // Smooth rotation interpolation
        if (isHovered.current) {
          bitcoin.rotation.x += (targetRotation.current.x - bitcoin.rotation.x) * 0.1;
          bitcoin.rotation.y += (targetRotation.current.y - bitcoin.rotation.y) * 0.1;
        } else {
          bitcoin.rotation.x += (Math.PI / 2 - bitcoin.rotation.x) * 0.1;
          bitcoin.rotation.y += (0 - bitcoin.rotation.y) * 0.1;
          bitcoin.rotation.z += 0.01;
        }

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);

      // Handle cleanup
      return () => {
        mountRef.current?.removeEventListener('mousemove', handleMouseMove);
        mountRef.current?.removeEventListener('mouseenter', handleMouseEnter);
        mountRef.current?.removeEventListener('mouseleave', handleMouseLeave);
        renderer.dispose();
        geometry.dispose();
        mainMaterial.dispose();
        symbolMaterial.dispose();
        if (mountRef.current) {
          mountRef.current.removeChild(renderer.domElement);
        }
      };
    } catch (err) {
      console.error('Error creating Bitcoin model:', err);
      setError(true);
    }
  }, []);

  if (error) {
    return null;
  }

  return (
    <Box
      ref={mountRef}
      width="300px"
      height="300px"
      margin="auto"
      position="relative"
      className="bitcoin-model"
      style={{ cursor: 'pointer' }}
    />
  );
}

export default BitcoinModel;
