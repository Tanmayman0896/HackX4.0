// src/components/FluidShaderBackground/FluidShaderBackground.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VERTEX_SHADER_SOURCE = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SOURCE = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uZoom;
  uniform float uColorTransition;
  varying vec2 vUv;

  // Smooth minimum for organic shape merging
  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  // Distance to line segment (capsule)
  float distSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
  }

  // Rotated Figure-8 point generator (optimized with precalculated cos/sin)
  vec2 getFigure8Point(float theta, float cos_p, float sin_p, float A, float B) {
    float x_base = A * sin(theta);
    float y_base = B * sin(2.0 * theta);
    return vec2(
      x_base * cos_p - y_base * sin_p,
      x_base * sin_p + y_base * cos_p
    );
  }

  // Distance to a single Figure-8 stroke using 6 unrolled segments (optimized)
  float distToFigure8Stroke(vec2 p, float phi, float phase, float A, float B, float startThick, float k_blend, float t) {
    float d = 100.0;
    
    float omega = 0.28; // Speed of motion (slow, majestic movement)
    float theta0 = omega * t + phase;
    
    // Precompute rotation factors to avoid redundant trig functions
    float cos_p = cos(phi);
    float sin_p = sin(phi);
    
    vec2 p_prev = getFigure8Point(theta0, cos_p, sin_p, A, B);
    
    // Segment 1 (u = 0.167, L = 1.65, u*L = 0.27555, pow(1.0-0.167, 1.5) = 0.76027)
    vec2 p_curr = getFigure8Point(theta0 - 0.27555, cos_p, sin_p, A, B);
    d = smin(d, distSegment(p, p_prev, p_curr) - startThick * 0.76027, k_blend);
    p_prev = p_curr;
    
    // Segment 2 (u = 0.333, L = 1.65, u*L = 0.54945, pow(1.0-0.333, 1.5) = 0.54474)
    p_curr = getFigure8Point(theta0 - 0.54945, cos_p, sin_p, A, B);
    d = smin(d, distSegment(p, p_prev, p_curr) - startThick * 0.54474, k_blend);
    p_prev = p_curr;
    
    // Segment 3 (u = 0.500, L = 1.65, u*L = 0.825, pow(1.0-0.500, 1.5) = 0.35355)
    p_curr = getFigure8Point(theta0 - 0.825, cos_p, sin_p, A, B);
    d = smin(d, distSegment(p, p_prev, p_curr) - startThick * 0.35355, k_blend);
    p_prev = p_curr;
    
    // Segment 4 (u = 0.667, L = 1.65, u*L = 1.10055, pow(1.0-0.667, 1.5) = 0.19216)
    p_curr = getFigure8Point(theta0 - 1.10055, cos_p, sin_p, A, B);
    d = smin(d, distSegment(p, p_prev, p_curr) - startThick * 0.19216, k_blend);
    p_prev = p_curr;
    
    // Segment 5 (u = 0.833, L = 1.65, u*L = 1.37445, pow(1.0-0.833, 1.5) = 0.06824)
    p_curr = getFigure8Point(theta0 - 1.37445, cos_p, sin_p, A, B);
    d = smin(d, distSegment(p, p_prev, p_curr) - startThick * 0.06824, k_blend);
    p_prev = p_curr;
    
    // Segment 6 (u = 1.000, L = 1.65, u*L = 1.65, pow(1.0-1.000, 1.5) = 0.0)
    p_curr = getFigure8Point(theta0 - 1.65, cos_p, sin_p, A, B);
    d = smin(d, distSegment(p, p_prev, p_curr), k_blend);
    
    return d;
  }

  void main() {
    // 1. Correct coordinates for viewport aspect ratio
    vec2 p = vUv - 0.5;
    float aspect = uResolution.x / uResolution.y;
    p.x *= aspect;
    p *= uZoom; // Zoom controlled dynamically (default: 1.25, zoom in: 0.85)

    // 2. Define breathing cycle biased to keep the strokes extended outside the X longer
    float cycle = 0.88 + 0.12 * sin(uTime * 0.35);

    // 3. Setup thickness parameters (Sweet-spot thickness: not too bulky, not too thin)
    float t1 = 0.029 * cycle;
    float k_blend = 0.030 * cycle;

    // 4. Evaluate 6 desynchronized strokes wiggling along figure-8 loops
    float d = 100.0;

    // Stroke 1: Loop 1 (phi = 0.0 - horizontal), phase = 0.0 (goes further, oval/elongated)
    float d1 = distToFigure8Stroke(p, 0.0, 0.0, 0.58, 0.11, t1, k_blend, uTime);
    d = smin(d, d1, k_blend);

    // Stroke 2: Loop 1 (phi = 0.0 - horizontal), phase = 3.14159 + 0.5 (opposite direction, staggered) (goes further, oval/elongated)
    float d2 = distToFigure8Stroke(p, 0.0, 3.14159 + 0.5, 0.58, 0.11, t1, k_blend, uTime);
    d = smin(d, d2, k_blend);

    // Stroke 3: Loop 2 (phi = 1.0472 - 60 degrees up-right/down-left), phase = 1.0 (oval/elongated)
    float d3 = distToFigure8Stroke(p, 1.0472, 1.0, 0.44, 0.09, t1, k_blend, uTime);
    d = smin(d, d3, k_blend);

    // Stroke 4: Loop 2 (phi = 1.0472 - 60 degrees up-right/down-left), phase = 3.14159 + 1.5 (oval/elongated)
    float d4 = distToFigure8Stroke(p, 1.0472, 3.14159 + 1.5, 0.44, 0.09, t1, k_blend, uTime);
    d = smin(d, d4, k_blend);

    // Stroke 5: Loop 3 (phi = 2.0944 - 120 degrees up-left/down-right), phase = 2.0 (oval/elongated)
    float d5 = distToFigure8Stroke(p, 2.0944, 2.0, 0.44, 0.09, t1, k_blend, uTime);
    d = smin(d, d5, k_blend);

    // Stroke 6: Loop 3 (phi = 2.0944 - 120 degrees up-left/down-right), phase = 3.14159 + 2.5 (oval/elongated)
    float d6 = distToFigure8Stroke(p, 2.0944, 3.14159 + 2.5, 0.44, 0.09, t1, k_blend, uTime);
    d = smin(d, d6, k_blend);

    // 5. Soft Glow Falloff
    float glow = exp(-max(d, 0.0) * 16.0);

    // 6. Colors mapping - Warm White and Warm Grey-White Palette
    vec3 colDeepWhite   = vec3(0.58, 0.54, 0.49); // Soft warm greige glow
    vec3 colGreyWhite   = vec3(0.78, 0.74, 0.69); // Smooth warm silver-grey
    vec3 colBrightWhite = vec3(0.92, 0.88, 0.83); // Soft warm cream white
    vec3 colPureWhite   = vec3(0.98, 0.95, 0.91); // Soft warm ivory core

    // Secondary Warm White & Grey-White palette for SDG / transition state
    vec3 colDeepWhite2  = vec3(0.52, 0.48, 0.43); // Soft warm grey
    vec3 colGreyWhite2  = vec3(0.74, 0.70, 0.64); // Warm platinum grey
    vec3 colBrightWhite2= vec3(0.89, 0.85, 0.79); // Warm alabaster white
    vec3 colPureWhite2  = vec3(0.97, 0.94, 0.89); // Soft warm pearl core

    // Blend palettes based on transition uniform
    vec3 mixedDeep     = mix(colDeepWhite, colDeepWhite2, uColorTransition);
    vec3 mixedPurple   = mix(colGreyWhite, colGreyWhite2, uColorTransition);
    vec3 mixedBright   = mix(colBrightWhite, colBrightWhite2, uColorTransition);
    vec3 mixedCore     = mix(colPureWhite, colPureWhite2, uColorTransition);

    // Dynamic color wave shifting (matching the SVG logo gradient rotation effect)
    float wave = sin(uTime * 0.3) * 0.5 + 0.5;
    vec3 dynamicBright = mix(mixedBright, mixedPurple, wave * 0.2);
    vec3 dynamicCyan = mix(mixedCore, mixedBright, wave * 0.2);

    // Blending weights
    float mDeepBlue = smoothstep(0.01, 0.22, glow);
    float mBlue     = smoothstep(0.15, 0.58, glow);
    float mBright   = smoothstep(0.38, 0.80, glow);
    float mCyan     = smoothstep(0.62, 0.98, glow);

    // Alpha gradient based on fluid glow strength (soft, warm, organic glow)
    float alpha = clamp(glow * 1.25, 0.0, 1.0);

    // Mix colors over transparent base
    vec3 finalColor = vec3(0.0);
    finalColor = mix(finalColor, mixedDeep, mDeepBlue);
    finalColor = mix(finalColor, mixedPurple, mBlue);
    finalColor = mix(finalColor, dynamicBright, mBright);
    finalColor = mix(finalColor, dynamicCyan, mCyan);

    // 7. Add film grain scaled by alpha
    float grain = (fract(sin(dot(vUv + uTime * 0.005, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.026;
    finalColor += vec3(grain) * alpha;

    gl_FragColor = vec4(finalColor * alpha, alpha);
  }
`;

const FRAGMENT_SHADER_SOURCE_MOBILE = `
  precision mediump float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uZoom;
  uniform float uColorTransition;
  varying vec2 vUv;

  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  float distSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
  }

  vec2 getFigure8Point(float theta, float cos_p, float sin_p, float A, float B) {
    float sin_t = sin(theta);
    float cos_t = cos(theta);
    float x_base = A * sin_t;
    float y_base = B * 2.0 * sin_t * cos_t;
    return vec2(
      x_base * cos_p - y_base * sin_p,
      x_base * sin_p + y_base * cos_p
    );
  }

  // Optimized 4-segment figure-8 stroke evaluation for mobile GPUs
  float distToFigure8StrokeMobile(vec2 p, float phi, float phase, float A, float B, float startThick, float k_blend, float t) {
    float d = 100.0;
    
    float omega = 0.28;
    float theta0 = omega * t + phase;
    
    float cos_p = cos(phi);
    float sin_p = sin(phi);
    
    vec2 p_prev = getFigure8Point(theta0, cos_p, sin_p, A, B);
    
    // Segment 1 (u = 0.25)
    vec2 p_curr = getFigure8Point(theta0 - 0.4125, cos_p, sin_p, A, B);
    d = smin(d, distSegment(p, p_prev, p_curr) - startThick * 0.64952, k_blend);
    p_prev = p_curr;
    
    // Segment 2 (u = 0.50)
    p_curr = getFigure8Point(theta0 - 0.825, cos_p, sin_p, A, B);
    d = smin(d, distSegment(p, p_prev, p_curr) - startThick * 0.35355, k_blend);
    p_prev = p_curr;
    
    // Segment 3 (u = 0.75)
    p_curr = getFigure8Point(theta0 - 1.2375, cos_p, sin_p, A, B);
    d = smin(d, distSegment(p, p_prev, p_curr) - startThick * 0.125, k_blend);
    p_prev = p_curr;
    
    // Segment 4 (u = 1.00)
    p_curr = getFigure8Point(theta0 - 1.65, cos_p, sin_p, A, B);
    d = smin(d, distSegment(p, p_prev, p_curr), k_blend);
    
    return d;
  }

  void main() {
    vec2 p = vUv - 0.5;
    float aspect = uResolution.x / uResolution.y;
    p.x *= aspect;
    p *= uZoom;

    float cycle = 0.88 + 0.12 * sin(uTime * 0.35);

    float t1 = 0.029 * cycle;
    float k_blend = 0.030 * cycle;

    // 4 desynchronized strokes on mobile
    float d = 100.0;

    float d1 = distToFigure8StrokeMobile(p, 0.0, 0.0, 0.58, 0.11, t1, k_blend, uTime);
    d = smin(d, d1, k_blend);

    float d2 = distToFigure8StrokeMobile(p, 0.0, 3.14159 + 0.5, 0.58, 0.11, t1, k_blend, uTime);
    d = smin(d, d2, k_blend);

    float d3 = distToFigure8StrokeMobile(p, 1.0472, 1.0, 0.44, 0.09, t1, k_blend, uTime);
    d = smin(d, d3, k_blend);

    float d4 = distToFigure8StrokeMobile(p, 2.0944, 2.0, 0.44, 0.09, t1, k_blend, uTime);
    d = smin(d, d4, k_blend);

    float glow = exp(-max(d, 0.0) * 16.0);

    vec3 colDeepWhite   = vec3(0.58, 0.54, 0.49);
    vec3 colGreyWhite   = vec3(0.78, 0.74, 0.69);
    vec3 colBrightWhite = vec3(0.92, 0.88, 0.83);
    vec3 colPureWhite   = vec3(0.98, 0.95, 0.91);

    vec3 colDeepWhite2  = vec3(0.52, 0.48, 0.43);
    vec3 colGreyWhite2  = vec3(0.74, 0.70, 0.64);
    vec3 colBrightWhite2= vec3(0.89, 0.85, 0.79);
    vec3 colPureWhite2  = vec3(0.97, 0.94, 0.89);

    vec3 mixedDeep     = mix(colDeepWhite, colDeepWhite2, uColorTransition);
    vec3 mixedPurple   = mix(colGreyWhite, colGreyWhite2, uColorTransition);
    vec3 mixedBright   = mix(colBrightWhite, colBrightWhite2, uColorTransition);
    vec3 mixedCore     = mix(colPureWhite, colPureWhite2, uColorTransition);

    float wave = sin(uTime * 0.3) * 0.5 + 0.5;
    vec3 dynamicBright = mix(mixedBright, mixedPurple, wave * 0.2);
    vec3 dynamicCyan = mix(mixedCore, mixedBright, wave * 0.2);

    float mDeepBlue = smoothstep(0.01, 0.22, glow);
    float mBlue     = smoothstep(0.15, 0.58, glow);
    float mBright   = smoothstep(0.38, 0.80, glow);
    float mCyan     = smoothstep(0.62, 0.98, glow);

    float alpha = clamp(glow * 1.25, 0.0, 1.0);

    vec3 finalColor = vec3(0.0);
    finalColor = mix(finalColor, mixedDeep, mDeepBlue);
    finalColor = mix(finalColor, mixedPurple, mBlue);
    finalColor = mix(finalColor, dynamicBright, mBright);
    finalColor = mix(finalColor, dynamicCyan, mCyan);

    gl_FragColor = vec4(finalColor * alpha, alpha);
  }
`;



export default function FluidShaderBackground() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const blurOverlayRef = useRef<HTMLDivElement>(null);
  const grainOverlayRef = useRef<SVGSVGElement>(null);
  const shaderParams = useRef({ zoom: 1.25, colorTransition: 0.0 });
  const [isMobile, setIsMobile] = useState(false);
  const defaultLogoTransform = "scale(1)";

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const checkMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 100);
    };
    setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkMobile);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    if (pathname === "/team" || pathname === "/gallery") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true });
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(VERTEX_SHADER_SOURCE, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(
      isMobile ? FRAGMENT_SHADER_SOURCE_MOBILE : FRAGMENT_SHADER_SOURCE,
      gl.FRAGMENT_SHADER
    );
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const vertices = new Float32Array([
      -1.0, -1.0,
      1.0, -1.0,
      -1.0, 1.0,
      -1.0, 1.0,
      1.0, -1.0,
      1.0, 1.0,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, "uTime");
    const resolutionLoc = gl.getUniformLocation(program, "uResolution");
    const zoomLoc = gl.getUniformLocation(program, "uZoom");
    const colorTransitionLoc = gl.getUniformLocation(program, "uColorTransition");

    let animationFrameId: number | undefined;
    let isLoopRunning = false;
    let isDocumentVisible = document.visibilityState === "visible";
    let isNavigationOpen = document.documentElement.dataset.navOpen === "true";
    let lastRenderTime = 0;
    const startTime = performance.now();

    const shouldRender = () => isDocumentVisible && !isNavigationOpen;

    let lastWidth = 0;
    let lastHeight = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);

      if (isMobile && lastWidth && lastHeight) {
        const widthDiff = Math.abs(width - lastWidth);
        const heightDiff = Math.abs(height - lastHeight);
        if (widthDiff === 0 && heightDiff < 60) {
          return;
        }
      }
      lastWidth = width;
      lastHeight = height;

      // Capped at 1.0 for desktop and 0.5 for mobile.
      // On mobile, rendering at 0.5x DPR under CSS blur saves ~75% GPU fill rate with zero visual loss.
      const maxDpr = isMobile ? 0.5 : 1.0;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const canvasWidth = Math.round(width * dpr);
      const canvasHeight = Math.round(height * dpr);

      if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
      }

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
    };

    window.addEventListener("resize", resize);
    resize();

    const render = (now: number) => {
      if (!shouldRender()) {
        isLoopRunning = false;
        return;
      }

      // Throttle render loop on mobile to ~30 FPS (32ms threshold) to prevent battery drain & thermal throttling
      if (isMobile && lastRenderTime && now - lastRenderTime < 32) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      lastRenderTime = now;

      const elapsedSeconds = (performance.now() - startTime) / 1000;
      gl.uniform1f(timeLoc, elapsedSeconds);
      gl.uniform1f(zoomLoc, shaderParams.current.zoom);
      gl.uniform1f(colorTransitionLoc, shaderParams.current.colorTransition);

      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (!isLoopRunning && shouldRender()) {
        isLoopRunning = true;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const stopLoop = () => {
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = undefined;
      }
      isLoopRunning = false;
    };

    const syncLoop = () => {
      if (shouldRender()) {
        startLoop();
      } else {
        stopLoop();
      }
    };

    const handleVisibilityChange = () => {
      isDocumentVisible = document.visibilityState === "visible";
      syncLoop();
    };

    const navigationObserver = new MutationObserver(() => {
      isNavigationOpen = document.documentElement.dataset.navOpen === "true";
      syncLoop();
    });

    navigationObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-nav-open"],
    });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    startLoop();

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      navigationObserver.disconnect();
      stopLoop();

      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [pathname, isMobile]); // Re-initialize WebGL when pathname or isMobile changes

  /* Scroll zoom for team page - optimized using direct DOM manipulation to bypass React render passes */
  useEffect(() => {
    const container = containerRef.current;
    const logoContainer = logoContainerRef.current;
    const canvas = canvasRef.current;
    if (!container) return;

    if (pathname !== "/team") {
      container.style.opacity = "1";
      if (logoContainer && pathname !== "/" && pathname !== "") {
        logoContainer.style.transform = defaultLogoTransform;
        logoContainer.style.opacity = pathname === "/gallery" ? "0" : "1";
      }
      if (canvas && pathname !== "/" && pathname !== "") {
        canvas.style.opacity = pathname === "/gallery" ? "0" : pathname === "/timeline" ? "0.75" : isMobile ? "0.45" : "0.65";
      }
      return;
    }

    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;

      const progress = window.scrollY / scrollableHeight;
      const scaleProgress = Math.min(Math.max(progress / 0.6, 0), 1);
      const scale = 1 + scaleProgress * 44;

      let logoOpacity = 1;
      if (progress > 0.3) {
        logoOpacity = 1 - Math.min((progress - 0.3) / 0.25, 1);
      }

      let canvasOpacity = 0.65;
      if (progress > 0.3) {
        const fadeProgress = Math.min((progress - 0.3) / 0.20, 1);
        canvasOpacity = 0.65 * (1 - fadeProgress);
      }

      if (logoContainer) {
        logoContainer.style.transform = `scale(${scale})`;
        logoContainer.style.opacity = `${logoOpacity}`;
      }
      if (canvas) {
        canvas.style.opacity = `${canvasOpacity}`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial
    return () => window.removeEventListener("scroll", handleScroll);
  }, [defaultLogoTransform, pathname]);

  /* Scroll transition for Timeline page *//////////////
  useEffect(() => {
    if (pathname !== "/timeline") return;

    let tl: gsap.core.Timeline | null = null;
    let active = true;

    const interpolateHex = (color1: string, color2: string, factor: number) => {
      const r1 = parseInt(color1.substring(1, 3), 16);
      const g1 = parseInt(color1.substring(3, 5), 16);
      const b1 = parseInt(color1.substring(5, 7), 16);
      const r2 = parseInt(color2.substring(1, 3), 16);
      const g2 = parseInt(color2.substring(3, 5), 16);
      const b2 = parseInt(color2.substring(5, 7), 16);
      const r = Math.round(r1 + factor * (r2 - r1));
      const g = Math.round(g1 + factor * (g2 - g1));
      const b = Math.round(b1 + factor * (b2 - b1));
      const clampChannel = (val: number) => Math.min(Math.max(val, 0), 255);
      return `#${clampChannel(r).toString(16).padStart(2, "0")}${clampChannel(g).toString(16).padStart(2, "0")}${clampChannel(b).toString(16).padStart(2, "0")}`;
    };

    const updateShaderState = () => {
      const timelineSection = document.getElementById("timeline-section");
      let currentPos = 0;
      let minPos = 0;

      const isMobileView = window.innerWidth < 768;
      const totalTimelineHeight = timelineSection
        ? timelineSection.getBoundingClientRect().height
        : isMobileView
          ? 1680
          : 5100;

      if (timelineSection) {
        const rect = timelineSection.getBoundingClientRect();
        const vh = window.innerHeight;
        currentPos = (vh / 2) - rect.top;

        // minPos is currentPos when top of document is at window.scrollY = 0
        const containerTop = rect.top + window.scrollY;
        minPos = (vh / 2) - containerTop;
      } else {
        currentPos = (window.scrollY / totalTimelineHeight) * totalTimelineHeight;
        minPos = 0;
      }

      // Smooth horizontal sway calculation
      const maxShiftVw = isMobileView ? 0 : 18;
      let xShiftVw = 0;

      if (isMobileView) {
        xShiftVw = 0;
      } else if (currentPos <= minPos) {
        xShiftVw = 0;
      } else if (currentPos < 500) {
        const startDist = 500 - minPos;
        const startProgress = startDist > 0 ? Math.min((currentPos - minPos) / startDist, 1) : 1;
        xShiftVw = (0.5 - 0.5 * Math.cos(startProgress * Math.PI)) * maxShiftVw;
      } else if (currentPos <= totalTimelineHeight) {
        const timelineDist = totalTimelineHeight - 500;
        const progress = timelineDist > 0 ? (currentPos - 500) / timelineDist : 1;
        xShiftVw = Math.cos(progress * 5 * Math.PI) * maxShiftVw;
      } else {
        const exitProgress = Math.min((currentPos - totalTimelineHeight) / 500, 1);
        xShiftVw = -maxShiftVw * (0.5 + 0.5 * Math.cos(exitProgress * Math.PI));
      }

      // Timeline progress calculation
      let timelineProgress = 0;
      if (currentPos <= minPos) {
        timelineProgress = 0;
      } else if (currentPos <= totalTimelineHeight) {
        const totalTimelineDist = totalTimelineHeight - minPos;
        timelineProgress = totalTimelineDist > 0 ? Math.min(Math.max((currentPos - minPos) / totalTimelineDist, 0), 1) : 0;
      } else {
        const exitProgress = Math.min((currentPos - totalTimelineHeight) / 500, 1);
        timelineProgress = 1 - exitProgress;
      }

      const targetZoom = 1.25 - timelineProgress * 0.35;
      const logoScale = 1.25 / targetZoom;

      let targetColorTransition = 0;
      if (currentPos > minPos && currentPos < totalTimelineHeight + 500) {
        const colorProgress = currentPos <= totalTimelineHeight ? currentPos : totalTimelineHeight - (currentPos - totalTimelineHeight);
        const colorAngle = (colorProgress - 500) * (Math.PI / 1000);
        targetColorTransition = Math.min(Math.max(0.5 - 0.5 * Math.cos(colorAngle), 0), 1);
        if (currentPos <= minPos) targetColorTransition = 0;
        if (currentPos > totalTimelineHeight) {
          const exitProgress = Math.min((currentPos - totalTimelineHeight) / 500, 1);
          targetColorTransition *= (1 - exitProgress);
        }
      }

      shaderParams.current.zoom = targetZoom;
      shaderParams.current.colorTransition = targetColorTransition;

      // 1. Shift WebGL Canvas horizontally and ramp opacity
      const canvas = canvasRef.current;
      if (canvas) {
        if (!isMobileView) {
          canvas.style.transform = `translateX(${xShiftVw}vw)`;
          canvas.style.opacity = `${0.65 + timelineProgress * 0.20}`;
        } else {
          canvas.style.transform = "none";
          canvas.style.opacity = `${0.45 + timelineProgress * 0.15}`;
        }
      }

      // 2. Shift and scale X logo in tandem, plus soft blur dissolve
      const logoContainer = logoContainerRef.current;
      if (logoContainer) {
        const xBlur = timelineProgress * 5;
        logoContainer.style.transform = isMobileView
          ? `scale(${logoScale})`
          : `translate(${xShiftVw}vw, 0px) scale(${logoScale})`;
        logoContainer.style.filter = `blur(${xBlur}px)`;

        const logoStop0 = interpolateHex("#5200c7", "#005035", targetColorTransition);
        const logoStop33 = interpolateHex("#ae73f2", "#30e5c8", targetColorTransition);
        const logoStop66 = interpolateHex("#7801ff", "#00b590", targetColorTransition);
        const logoStop100 = interpolateHex("#5200c7", "#005035", targetColorTransition);
        logoContainer.style.setProperty("--x-color-stop-0", logoStop0);
        logoContainer.style.setProperty("--x-color-stop-33", logoStop33);
        logoContainer.style.setProperty("--x-color-stop-66", logoStop66);
        logoContainer.style.setProperty("--x-color-stop-100", logoStop100);
        const shadow1 = interpolateHex("#ae73f2", "#30e5c8", targetColorTransition);
        const shadow2 = interpolateHex("#5200c7", "#005035", targetColorTransition);
        logoContainer.style.setProperty("--x-shadow-1", shadow1);
        logoContainer.style.setProperty("--x-shadow-2", shadow2);
      }

      // 3. Dynamic Backdrop Blur & Film Grain ramping over timeline scroll
      const blurOverlay = blurOverlayRef.current;
      if (blurOverlay && !isMobileView) {
        const backdropBlur = 10 + timelineProgress * 14;
        const saturate = 1.3 + timelineProgress * 0.3;
        blurOverlay.style.backdropFilter = `blur(${backdropBlur}px) saturate(${saturate}) contrast(1.02)`;
        blurOverlay.style.setProperty("-webkit-backdrop-filter", `blur(${backdropBlur}px) saturate(${saturate}) contrast(1.02)`);
      } else if (blurOverlay && isMobileView) {
        blurOverlay.style.backdropFilter = "none";
        blurOverlay.style.setProperty("-webkit-backdrop-filter", "none");
      }

      const grainOverlay = grainOverlayRef.current;
      if (grainOverlay && !isMobileView) {
        grainOverlay.style.opacity = `${0.09 + timelineProgress * 0.07}`;
      }

      const fromColor = interpolateHex("#180038", "#003320", targetColorTransition);
      const viaColor = interpolateHex("#0d0021", "#001c12", targetColorTransition);
      const toColor = interpolateHex("#05000d", "#000d08", targetColorTransition);
      document.documentElement.style.setProperty("--bg-gradient-from", fromColor);
      document.documentElement.style.setProperty("--bg-gradient-via", viaColor);
      document.documentElement.style.setProperty("--bg-gradient-to", toColor);
      const rotateDeg = targetColorTransition * 140;
      document.documentElement.style.setProperty("--logo-hue-rotate", `${rotateDeg}deg`);
    };

    const initScrollTrigger = () => {
      if (!active) return;
      const timelineSection = document.getElementById("timeline-section");
      if (!timelineSection) {
        setTimeout(initScrollTrigger, 100);
        return;
      }

      shaderParams.current = { zoom: 1.25, colorTransition: 0.0 };

      // Bind updateShaderState to GSAP ScrollTrigger scrubbed animation
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: timelineSection,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
          onUpdate: updateShaderState,
          invalidateOnRefresh: true,
        }
      });

      // Run initial frame alignment
      updateShaderState();
    };

    initScrollTrigger();

    return () => {
      active = false;
      if (tl) {
        tl.kill();
        tl.scrollTrigger?.kill();
      }
      if (canvasRef.current) {
        canvasRef.current.style.transform = "none";
        canvasRef.current.style.opacity = isMobile ? "0.45" : "0.45";
      }
      if (logoContainerRef.current) {
        logoContainerRef.current.style.transform = defaultLogoTransform;
        logoContainerRef.current.style.filter = "blur(0px)";
      }
      if (blurOverlayRef.current) {
        if (isMobile) {
          blurOverlayRef.current.style.backdropFilter = "none";
          blurOverlayRef.current.style.setProperty("-webkit-backdrop-filter", "none");
        } else {
          blurOverlayRef.current.style.backdropFilter = "blur(10px) saturate(1.3) contrast(1.02)";
          blurOverlayRef.current.style.setProperty("-webkit-backdrop-filter", "blur(10px) saturate(1.3) contrast(1.02)");
        }
      }
      if (grainOverlayRef.current) {
        grainOverlayRef.current.style.opacity = "0.09";
      }
      document.documentElement.style.setProperty("--logo-hue-rotate", "0deg");
      document.documentElement.style.setProperty("--bg-gradient-from", "#180038");
      document.documentElement.style.setProperty("--bg-gradient-via", "#0d0021");
      document.documentElement.style.setProperty("--bg-gradient-to", "#05000d");
    };
  }, [defaultLogoTransform, pathname]);

  /* Scroll transition for SDG section on homepage */
  useEffect(() => {
    if (pathname !== "/" && pathname !== "") return;

    let tl: gsap.core.Timeline | null = null;
    let heroTl: gsap.core.Timeline | null = null;
    let active = true;

    const initScrollTrigger = () => {
      if (!active) return;
      const sdgSection = document.getElementById("sdg-section");
      if (!sdgSection) {
        setTimeout(initScrollTrigger, 100);
        return;
      }

      // Reset initial values
      shaderParams.current = { zoom: 1.25, colorTransition: 0.0 };

      document.documentElement.style.setProperty("--logo-hue-rotate", "0deg");
      document.documentElement.style.setProperty("--bg-gradient-from", "#180038");
      document.documentElement.style.setProperty("--bg-gradient-via", "#0d0021");
      document.documentElement.style.setProperty("--bg-gradient-to", "#05000d");

      const logoContainer = logoContainerRef.current;
      const blurOverlay = blurOverlayRef.current;
      const grainOverlay = grainOverlayRef.current;
      const canvas = canvasRef.current;

      const isMobileView = window.innerWidth < 768;

      if (logoContainer) {
        gsap.set(logoContainer, { scale: 1.0, filter: "blur(0px)", y: "75vh", opacity: 0 });
        logoContainer.style.setProperty("--x-color-stop-0", "#5200c7");
        logoContainer.style.setProperty("--x-color-stop-33", "#ae73f2");
        logoContainer.style.setProperty("--x-color-stop-66", "#7801ff");
        logoContainer.style.setProperty("--x-color-stop-100", "#5200c7");
        logoContainer.style.setProperty("--x-shadow-1", "rgba(174, 115, 242, 0.35)");
        logoContainer.style.setProperty("--x-shadow-2", "rgba(82, 0, 199, 0.30)");
      }

      if (blurOverlay) {
        if (isMobileView) {
          gsap.set(blurOverlay, { backdropFilter: "none" });
          blurOverlay.style.setProperty("-webkit-backdrop-filter", "none");
        } else {
          gsap.set(blurOverlay, { backdropFilter: "blur(10px) saturate(1.3) contrast(1.02)" });
          blurOverlay.style.setProperty("-webkit-backdrop-filter", "blur(10px) saturate(1.3) contrast(1.02)");
        }
      }
      if (grainOverlay) {
        gsap.set(grainOverlay, { opacity: isMobileView ? 0 : 0.09 });
      }
      if (canvas) {
        gsap.set(canvas, { y: "0vh", opacity: isMobileView ? 0.45 : 0.65 });
      }

      // Hero scroll trigger: SVG X logo comes up from center bottom and gets placed into position on scroll
      const heroSection = document.getElementById("hero-section") || document.body;

      heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSection,
          start: "top top",
          end: "450px top",
          scrub: 0.5,
          invalidateOnRefresh: true,
        }
      });

      if (logoContainer) {
        heroTl.to(logoContainer, {
          y: "0vh",
          opacity: 1,
          duration: 1,
          ease: "power1.out"
        }, 0);
      }

      // Animatable objects to handle precise color, degree, blur, and grain interpolation natively in GSAP
      const bgColors = {
        from: "#180038",
        via: "#0d0021",
        to: "#05000d"
      };

      const logoColors = {
        stop0: "#5200c7",
        stop33: "#ae73f2",
        stop66: "#7801ff",
        stop100: "#5200c7",
        shadow1: "rgba(174, 115, 242, 0.35)",
        shadow2: "rgba(82, 0, 199, 0.30)"
      };

      const logoHue = { rotate: 0 };
      const blurParams = { blur: 10, sat: 1.3 };

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: sdgSection,
          start: "top bottom",
          end: () => (window.innerWidth < 768 ? "bottom center" : "+=" + (window.innerHeight * 5.6)),
          scrub: 0.5,
          invalidateOnRefresh: true,
          refreshPriority: -10, // Calculate after layout-altering ScrollTriggers (like Stats pin spacing)
        }
      });

      // Transition IN (0.0 to 1.0)
      if (!isMobileView) {
        tl.to(shaderParams.current, {
          zoom: 0.65, // 0.75 of previous zoom delta (1/4th lesser zoom)
          colorTransition: 1.0,
          duration: 1,
          ease: "power1.out"
        }, 0);
      } else {
        tl.to(shaderParams.current, {
          colorTransition: 1.0,
          duration: 1,
          ease: "power1.out"
        }, 0);
      }

      tl.to(logoHue, {
        rotate: 140,
        duration: 1,
        ease: "power1.out",
        onUpdate: () => {
          document.documentElement.style.setProperty("--logo-hue-rotate", `${logoHue.rotate}deg`);
        }
      }, 0);

      tl.to(bgColors, {
        from: "#006640",
        via: "#003824",
        to: "#001a11",
        duration: 1,
        ease: "power1.out",
        onUpdate: () => {
          document.documentElement.style.setProperty("--bg-gradient-from", bgColors.from);
          document.documentElement.style.setProperty("--bg-gradient-via", bgColors.via);
          document.documentElement.style.setProperty("--bg-gradient-to", bgColors.to);
        }
      }, 0);

      let lastBlur = -1;
      let lastSat = -1;
      if (blurOverlay && !isMobileView) {
        tl.to(blurParams, {
          blur: 28,
          sat: 1.6,
          duration: 1,
          ease: "power1.out",
          onUpdate: () => {
            if (Math.abs(blurParams.blur - lastBlur) >= 0.2 || Math.abs(blurParams.sat - lastSat) >= 0.03) {
              lastBlur = blurParams.blur;
              lastSat = blurParams.sat;
              blurOverlay.style.backdropFilter = `blur(${blurParams.blur.toFixed(1)}px) saturate(${blurParams.sat.toFixed(2)}) contrast(1.02)`;
              blurOverlay.style.setProperty("-webkit-backdrop-filter", `blur(${blurParams.blur.toFixed(1)}px) saturate(${blurParams.sat.toFixed(2)}) contrast(1.02)`);
            }
          }
        }, 0);
      }

      if (grainOverlay && !isMobileView) {
        tl.to(grainOverlay, {
          opacity: 0.18,
          duration: 1,
          ease: "power1.out"
        }, 0);
      }

      if (canvas) {
        tl.to(canvas, {
          opacity: isMobileView ? 0.65 : 0.85,
          duration: 1,
          ease: "power1.out"
        }, 0);
      }

      if (logoContainer) {
        tl.to(logoColors, {
          stop0: "#005035",
          stop33: "#30e5c8",
          stop66: "#00b590",
          stop100: "#005035",
          shadow1: "rgba(48, 229, 200, 0.35)",
          shadow2: "rgba(0, 80, 53, 0.30)",
          duration: 1,
          ease: "power1.out",
          onUpdate: () => {
            logoContainer.style.setProperty("--x-color-stop-0", logoColors.stop0);
            logoContainer.style.setProperty("--x-color-stop-33", logoColors.stop33);
            logoContainer.style.setProperty("--x-color-stop-66", logoColors.stop66);
            logoContainer.style.setProperty("--x-color-stop-100", logoColors.stop100);
            logoContainer.style.setProperty("--x-shadow-1", logoColors.shadow1);
            logoContainer.style.setProperty("--x-shadow-2", logoColors.shadow2);
          }
        }, 0);

        tl.to(logoContainer, {
          scale: isMobileView ? 1.35 : 1.9,
          filter: isMobileView ? "blur(0.5px)" : "blur(1px)",
          duration: 1,
          ease: "power1.out"
        }, 0);
      }

      // Transition OUT (4.6 to 5.6)
      if (!isMobileView) {
        tl.to(shaderParams.current, {
          zoom: 1.25,
          colorTransition: 0.0,
          duration: 1,
          ease: "power1.in"
        }, 4.6);
      } else {
        tl.to(shaderParams.current, {
          colorTransition: 0.0,
          duration: 1,
          ease: "power1.in"
        }, 4.6);
      }

      tl.to(logoHue, {
        rotate: 0,
        duration: 1,
        ease: "power1.in",
        onUpdate: () => {
          document.documentElement.style.setProperty("--logo-hue-rotate", `${logoHue.rotate}deg`);
        }
      }, 4.6);

      tl.to(bgColors, {
        from: "#180038",
        via: "#0d0021",
        to: "#05000d",
        duration: 1,
        ease: "power1.in",
        onUpdate: () => {
          document.documentElement.style.setProperty("--bg-gradient-from", bgColors.from);
          document.documentElement.style.setProperty("--bg-gradient-via", bgColors.via);
          document.documentElement.style.setProperty("--bg-gradient-to", bgColors.to);
        }
      }, 4.6);

      if (blurOverlay && !isMobileView) {
        tl.to(blurParams, {
          blur: 10,
          sat: 1.3,
          duration: 1,
          ease: "power1.in",
          onUpdate: () => {
            if (Math.abs(blurParams.blur - lastBlur) >= 0.2 || Math.abs(blurParams.sat - lastSat) >= 0.03) {
              lastBlur = blurParams.blur;
              lastSat = blurParams.sat;
              blurOverlay.style.backdropFilter = `blur(${blurParams.blur.toFixed(1)}px) saturate(${blurParams.sat.toFixed(2)}) contrast(1.02)`;
              blurOverlay.style.setProperty("-webkit-backdrop-filter", `blur(${blurParams.blur.toFixed(1)}px) saturate(${blurParams.sat.toFixed(2)}) contrast(1.02)`);
            }
          }
        }, 4.6);
      }

      if (grainOverlay && !isMobileView) {
        tl.to(grainOverlay, {
          opacity: 0.09,
          duration: 1,
          ease: "power1.in"
        }, 4.6);
      }

      if (canvas) {
        tl.to(canvas, {
          opacity: isMobileView ? 0.45 : 0.65,
          duration: 1,
          ease: "power1.in"
        }, 4.6);
      }

      if (logoContainer) {
        tl.to(logoColors, {
          stop0: "#5200c7",
          stop33: "#ae73f2",
          stop66: "#7801ff",
          stop100: "#5200c7",
          shadow1: "rgba(174, 115, 242, 0.35)",
          shadow2: "rgba(82, 0, 199, 0.30)",
          duration: 1,
          ease: "power1.in",
          onUpdate: () => {
            logoContainer.style.setProperty("--x-color-stop-0", logoColors.stop0);
            logoContainer.style.setProperty("--x-color-stop-33", logoColors.stop33);
            logoContainer.style.setProperty("--x-color-stop-66", logoColors.stop66);
            logoContainer.style.setProperty("--x-color-stop-100", logoColors.stop100);
            logoContainer.style.setProperty("--x-shadow-1", logoColors.shadow1);
            logoContainer.style.setProperty("--x-shadow-2", logoColors.shadow2);
          }
        }, 4.6);

        tl.to(logoContainer, {
          scale: 1.0,
          filter: isMobileView ? "blur(0.5px)" : "blur(0px)",
          duration: 1,
          ease: "power1.in"
        }, 4.6);
      }
    };

    initScrollTrigger();

    return () => {
      active = false;
      if (heroTl) {
        heroTl.revert();
      }
      if (tl) {
        tl.revert();
      }
    };
  }, [pathname]);

  const content = (
    <>
      {/* 1. Deep premium CSS gradient background layer */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-full h-screen-stable"
        style={{
          zIndex: -20,
          height: "100dvh",
          background: "radial-gradient(ellipse at center, var(--bg-gradient-from, #180038) 0%, var(--bg-gradient-via, #0d0021) 60%, var(--bg-gradient-to, #05000d) 100%)",
        }}
      />

      {/* 2. SVG Logo in the middle. Filled with an animated electric gradient stop-set. */}
      <div
        ref={logoContainerRef}
        className="pointer-events-none fixed top-0 left-0 w-full h-screen-stable flex items-center justify-center select-none"
        style={{
          zIndex: -4,
          height: "100dvh",
          transformOrigin: "center center",
          transform: "translateZ(0)",
          willChange: "transform, opacity",
          "--x-color-stop-0": isMobile ? "#6b11e0" : "#5200c7",
          "--x-color-stop-33": isMobile ? "#bd8aff" : "#ae73f2",
          "--x-color-stop-66": isMobile ? "#8f26ff" : "#7801ff",
          "--x-color-stop-100": isMobile ? "#6b11e0" : "#5200c7",
          "--x-shadow-1": isMobile ? "rgba(189, 138, 255, 0.6)" : "rgba(174, 115, 242, 0.35)",
          "--x-shadow-2": isMobile ? "rgba(107, 17, 224, 0.5)" : "rgba(82, 0, 199, 0.30)",
        } as React.CSSProperties}
      >
        <svg
          viewBox="0 0 895 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-opacity duration-700"
          style={{
            height: isMobile ? "min(48vh, 72vw)" : "28vh",
            width: isMobile ? "min(42.96vh, 64.44vw)" : "25.06vh",
            opacity: isMobile ? 0.85 : 0.65,
            transform: "translateZ(0)",
            willChange: "transform",
          filter: isMobile
            ? "drop-shadow(0 0 35px var(--x-shadow-1, rgba(189, 138, 255, 0.6)))"
            : "blur(1.5px) drop-shadow(0 0 20px var(--x-shadow-1, rgba(174, 115, 242, 0.35))) drop-shadow(0 0 40px var(--x-shadow-2, rgba(82, 0, 199, 0.30)))",
        }}
      >
        <defs>
          <linearGradient id="movingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--x-color-stop-0, #5200c7)" />
            <stop offset="33%" stopColor="var(--x-color-stop-33, #ae73f2)" />
            <stop offset="66%" stopColor="var(--x-color-stop-66, #7801ff)" />
            <stop offset="100%" stopColor="var(--x-color-stop-100, #5200c7)" />
            <animateTransform
              attributeName="gradientTransform"
              type="rotate"
              from="0 447.5 500"
              to="360 447.5 500"
              dur="15s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>
        <path
          d="M335.279 0.25L559.355 400.69L894.574 999.75H559.721L335.645 599.31L0.425781 0.25H335.279ZM335.177 999.75H0.535156L335.177 600.119V999.75ZM894.465 0.25L559.823 399.88V0.25H894.465Z"
          fill="url(#movingGradient)"
        />
      </svg>
    </div>

    {/* 3. Transparent WebGL Canvas. Covers the entire viewport to prevent box clipping. */}
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed top-0 left-0 w-full h-screen-stable opacity-65"
      style={{
        zIndex: -15,
        height: "100dvh",
        filter: isMobile ? "blur(10px)" : "blur(16px)",
        display: "block",
      }}
    />

    {/* 4. The canvas is blurred directly above. On desktop, a backdrop-filter provides glassmorphism.
           On mobile, backdrop-filter is disabled ("none") to eliminate heavy GPU fill-rate re-rasterization. */}
    <div
      ref={blurOverlayRef}
      className="pointer-events-none fixed top-0 left-0 w-full h-screen-stable"
      style={{
        zIndex: -5,
        height: "100dvh",
        transform: "translateZ(0)",
        willChange: "transform, opacity",
        backdropFilter: isMobile ? "none" : undefined,
        WebkitBackdropFilter: isMobile ? "none" : undefined,
        background: "linear-gradient(115deg, rgba(24, 0, 56, 0.10), rgba(13, 0, 33, 0.03) 55%, rgba(5, 0, 13, 0.08))",
      }}
    />

    {/* 5. Monochrome Film Grain Overlay. Adds a highly premium, textured grain
           layer over the blurred backdrop on desktop. Hidden on mobile to avoid feTurbulence re-rasterization. */}
    <svg
      ref={grainOverlayRef}
      className="pointer-events-none fixed top-0 left-0 w-full h-screen-stable opacity-[0.10]"
      style={{
        zIndex: -3,
        height: "100dvh",
        display: isMobile ? "none" : "block",
      }}
    >
        <defs>
          <filter id="visionNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="1" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.14 0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#visionNoise)" />
      </svg>
    </>
  );

  if (pathname === "/team" || pathname === "/banner") return null;

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-screen-stable pointer-events-none"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100dvh",
        zIndex: -30,
        transformOrigin: "center center",
        willChange: "transform, opacity",
        pointerEvents: "none",
      }}
    >
      {content}
    </div>
  );
}
