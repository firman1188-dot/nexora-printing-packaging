/* Latar "Samudra" — port dari AI Business (app/_home/WaveSky.tsx): samudra partikel biru→cyan + debu cahaya,
   beriak mengikuti kursor. Three.js 0.160.0 dimuat dari unpkg; bila WebGL/CDN gagal halaman tetap tampil normal. */
const THREE_URL = 'https://unpkg.com/three@0.160.0/build/three.module.js';
const VERT = `
uniform float uTime,uScale,uSize; uniform vec2 uMouse; varying vec3 vColor; varying float vAlpha;
void main(){ vec3 p=position; float t=uTime;
 float h=sin(p.x*.33+t*.55)*.55+sin(p.z*.42-t*.4)*.5+sin((p.x+p.z)*.2+t*.28)*.85+sin(p.x*1.25-p.z*.85+t*1.05)*.12;
 float d=distance(p.xz,uMouse); h+=sin(d*1.9-t*3.2)*exp(-d*.22)*.6; p.y=h;
 vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv; float dist=-mv.z; float k=smoothstep(-1.4,1.6,h);
 gl_PointSize=uSize*(.7+k*.9)*uScale/dist;
 vColor=mix(vec3(.18,.48,1.),vec3(.21,.88,1.),k)+vec3(1.)*pow(k,6.)*.6;
 vAlpha=(.24+.76*k)*smoothstep(74.,14.,dist)*smoothstep(2.,8.,dist); }`;
const FRAG = `varying vec3 vColor; varying float vAlpha; void main(){ float d=length(gl_PointCoord-.5); float a=smoothstep(.5,0.,d); gl_FragColor=vec4(vColor,a*a*vAlpha);}`;

(async () => {
  const host = document.querySelector('[data-sky]');
  if (!host) return;
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity 1.2s';
  const veil = document.createElement('div');
  veil.style.cssText = 'position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,#03050c 0%,rgba(3,5,12,.78) 34%,transparent 62%,transparent 84%,rgba(3,5,12,.9))';
  host.append(canvas, veil);
  try {
    const THREE = await import(THREE_URL);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    const small = innerWidth < 760;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    renderer.setPixelRatio(small ? 1 : Math.min(devicePixelRatio || 1, 1.5));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, .1, 100);
    camera.position.set(0, 2.6, 9);
    const cols = small ? 84 : 250, rows = small ? 72 : 170, width = 100, zFar = -72, zNear = 6;
    const pos = new Float32Array(cols * rows * 3);
    let k = 0;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      pos[k++] = (i / (cols - 1) - .5) * width + (Math.random() - .5) * .18;
      pos[k++] = 0;
      pos[k++] = zFar + (j / (rows - 1)) * (zNear - zFar) + (Math.random() - .5) * .18;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const u = { uTime: { value: 0 }, uScale: { value: 500 }, uSize: { value: .082 }, uMouse: { value: new THREE.Vector2(0, -8) } };
    const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: u, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending });
    const field = new THREE.Points(geo, mat); field.frustumCulled = false; scene.add(field);

    const sc = small ? 110 : 340, sp = new Float32Array(sc * 3);
    for (let i = 0; i < sc; i++) { sp[i * 3] = (Math.random() - .5) * 70; sp[i * 3 + 1] = (Math.random() - .5) * 16; sp[i * 3 + 2] = (Math.random() - .5) * 30 - 1.5; }
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    const dot = document.createElement('canvas'); dot.width = dot.height = 64;
    const dx = dot.getContext('2d'), gr = dx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.25, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    dx.fillStyle = gr; dx.fillRect(0, 0, 64, 64);
    const stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xbfe4ff, size: .09, map: new THREE.CanvasTexture(dot), transparent: true, opacity: .75, depthWrite: false, blending: THREE.AdditiveBlending }));
    stars.position.set(0, 11, -30); scene.add(stars);

    const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
    addEventListener('pointermove', (e) => { ptr.tx = e.clientX / innerWidth * 2 - 1; ptr.ty = e.clientY / innerHeight * 2 - 1; }, { passive: true });
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), hit = new THREE.Vector3();
    const resize = () => {
      const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      u.uScale.value = renderer.domElement.height * .5 / Math.tan(camera.fov * Math.PI / 360);
    };
    addEventListener('resize', resize); resize();
    let t = 0, last = performance.now();
    let lastDraw = 0;
    const frame = (now) => {
      requestAnimationFrame(frame);
      if (document.hidden) { last = now; return; }
      if (small && now - lastDraw < 33) return; // ponsel: 30 fps agar ringan
      lastDraw = now;
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      t += dt * (reduced ? .25 : 1);
      ptr.x += (ptr.tx - ptr.x) * .05; ptr.y += (ptr.ty - ptr.y) * .05;
      u.uTime.value = t;
      ndc.set(ptr.x, -ptr.y); ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(plane, hit) && hit.z < 8 && hit.z > -60) {
        u.uMouse.value.x += (hit.x - u.uMouse.value.x) * .12; u.uMouse.value.y += (hit.z - u.uMouse.value.y) * .12;
      }
      camera.position.set(ptr.x * .9, 2.6 - ptr.y * .25, 9); camera.lookAt(0, 2.3, -14);
      renderer.render(scene, camera);
    };
    requestAnimationFrame(frame);
    canvas.style.opacity = 1;
  } catch (e) { console.warn('Latar samudra tidak aktif:', e && e.message || e); }
})();
