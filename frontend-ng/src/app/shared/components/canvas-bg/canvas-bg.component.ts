import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-canvas-bg',
  standalone: true,
  template: `
    <canvas #canvas
      style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:.55"></canvas>
  `,
})
export class CanvasBgComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer: any;
  private scene: any;
  private camera: any;
  private animId = 0;
  private clock: any;
  private particles: any[] = [];
  private THREE: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.THREE = await import('three');
    this.init();
  }

  private init() {
    const T = this.THREE;
    const canvas = this.canvasRef.nativeElement;
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Renderer
    this.renderer = new T.WebGLRenderer({ canvas, antialias: false, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setSize(w, h);
    this.renderer.setClearColor(0x000000, 0);

    // Scene
    this.scene = new T.Scene();

    // Camera
    this.camera = new T.PerspectiveCamera(60, w / h, 0.1, 100);
    this.camera.position.z = 30;

    // Clock
    this.clock = new T.Clock();

    // ── Particules flottantes ──────────────────────────────────────────────
    const geo = new T.BufferGeometry();
    const count = 280;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 80;
    }
    geo.setAttribute('position', new T.BufferAttribute(pos, 3));

    const mat = new T.PointsMaterial({
      color: 0xc2c85b,
      size: 0.08,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
      blending: T.AdditiveBlending,
      depthWrite: false,
    });
    const points = new T.Points(geo, mat);
    this.scene.add(points);
    this.particles.push(points);

    // ── Sphères volumineuses floues (blobs) ────────────────────────────────
    const blobData = [
      { x: -15, y: 10, z: -5, r: 8, color: 0x1a1a0a },
      { x: 18, y: -8, z: -10, r: 12, color: 0x0f0f08 },
      { x: 0, y: -15, z: -8, r: 10, color: 0x161608 },
    ];
    blobData.forEach(d => {
      const g = new T.SphereGeometry(d.r, 24, 24);
      const m = new T.MeshBasicMaterial({
        color: d.color,
        transparent: true,
        opacity: 0.25,
        blending: T.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new T.Mesh(g, m);
      mesh.position.set(d.x, d.y, d.z);
      this.scene.add(mesh);
      this.particles.push(mesh);
    });

    // ── Lignes abstraites ─────────────────────────────────────────────────
    for (let i = 0; i < 12; i++) {
      const pts = [];
      let x = (Math.random() - 0.5) * 60;
      let y = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 20 - 5;
      for (let j = 0; j < 8; j++) {
        pts.push(new T.Vector3(x, y, z));
        x += (Math.random() - 0.5) * 12;
        y += (Math.random() - 0.5) * 8;
      }
      const lineGeo = new T.BufferGeometry().setFromPoints(pts);
      const lineMat = new T.LineBasicMaterial({
        color: 0xc2c85b,
        transparent: true,
        opacity: 0.04 + Math.random() * 0.06,
        blending: T.AdditiveBlending,
        depthWrite: false,
      });
      const line = new T.Line(lineGeo, lineMat);
      this.scene.add(line);
      this.particles.push(line);
    }

    // Resize
    window.addEventListener('resize', this.onResize);

    // Animate
    this.animate();
  }

  private animate = () => {
    this.animId = requestAnimationFrame(this.animate);
    const t = this.clock.getElapsedTime();

    // Rotation lente des particules
    if (this.particles[0]) {
      this.particles[0].rotation.y = t * 0.015;
      this.particles[0].rotation.x = t * 0.008;
    }

    // Blobs qui pulsent
    this.particles.slice(1, 4).forEach((blob, i) => {
      const scale = 1 + Math.sin(t * 0.3 + i * 1.2) * 0.05;
      blob.scale.setScalar(scale);
    });

    this.renderer.render(this.scene, this.camera);
  };

  private onResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  ngOnDestroy() {
    cancelAnimationFrame(this.animId);
    window.removeEventListener('resize', this.onResize);
    this.renderer?.dispose();
  }
}
