// Canvas Trail Effect - TypeScript Version

interface OscillatorOptions {
  phase?: number;
  offset?: number;
  frequency?: number;
  amplitude?: number;
}

interface LineOptions {
  spring: number;
}

interface ConfigOptions {
  debug?: boolean;
  friction?: number;
  trails?: number;
  size?: number;
  dampening?: number;
  tension?: number;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

// Oscillator class
class Oscillator {
  phase: number;
  offset: number;
  frequency: number;
  amplitude: number;
  private _value: number = 0;

  constructor(options: OscillatorOptions = {}) {
    this.phase = options.phase ?? 0;
    this.offset = options.offset ?? 0;
    this.frequency = options.frequency ?? 0.001;
    this.amplitude = options.amplitude ?? 1;
  }

  update(): number {
    this.phase += this.frequency;
    this._value = this.offset + Math.sin(this.phase) * this.amplitude;
    return this._value;
  }

  value(): number {
    return this._value;
  }
}

// Line class
class Line {
  spring: number;
  friction: number;
  nodes: Node[] = [];

  constructor(options: LineOptions, config: ConfigOptions) {
    this.spring = options.spring + 0.1 * Math.random() - 0.05;
    this.friction = (config.friction ?? 0.5) + 0.01 * Math.random() - 0.005;

    for (let i = 0; i < (config.size ?? 50); i++) {
      this.nodes.push({ x: 0, y: 0, vx: 0, vy: 0 });
    }
  }

  update(pos: { x: number; y: number }, config: ConfigOptions): void {
    let spring = this.spring;
    let t = this.nodes[0];

    t.vx += (pos.x - t.x) * spring;
    t.vy += (pos.y - t.y) * spring;

    for (let i = 0; i < this.nodes.length; i++) {
      t = this.nodes[i];

      if (i > 0) {
        const n = this.nodes[i - 1];
        t.vx += (n.x - t.x) * spring;
        t.vy += (n.y - t.y) * spring;
        t.vx += n.vx * (config.dampening ?? 0.025);
        t.vy += n.vy * (config.dampening ?? 0.025);
      }

      t.vx *= this.friction;
      t.vy *= this.friction;
      t.x += t.vx;
      t.y += t.vy;
      spring *= config.tension ?? 0.99;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.nodes.length < 2) return;

    let x = this.nodes[0].x;
    let y = this.nodes[0].y;

    ctx.beginPath();
    ctx.moveTo(x, y);

    for (let i = 1; i < this.nodes.length - 1; i++) {
      const e = this.nodes[i];
      const t = this.nodes[i + 1];
      x = 0.5 * (e.x + t.x);
      y = 0.5 * (e.y + t.y);
      ctx.quadraticCurveTo(e.x, e.y, x, y);
    }

    const e = this.nodes[this.nodes.length - 2];
    const t = this.nodes[this.nodes.length - 1];
    ctx.quadraticCurveTo(e.x, e.y, t.x, t.y);

    ctx.stroke();
    ctx.closePath();
  }
}

// Canvas Trail Manager
class CanvasTrailManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: Required<ConfigOptions>;
  private oscillator: Oscillator;
  private lines: Line[] = [];
  private pos: { x: number; y: number } = { x: 0, y: 0 };
  private running: boolean = false;
  private animationFrameId: number | null = null;

  constructor(canvasId: string, config: ConfigOptions = {}) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvas) {
      throw new Error(`Canvas element with id "${canvasId}" not found`);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context from canvas');
    }

    this.canvas = canvas;
    this.ctx = ctx;

    this.config = {
      debug: config.debug ?? false,
      friction: config.friction ?? 0.5,
      trails: config.trails ?? 80,
      size: config.size ?? 50,
      dampening: config.dampening ?? 0.025,
      tension: config.tension ?? 0.99,
    };

    this.oscillator = new Oscillator({
      phase: Math.random() * 2 * Math.PI,
      amplitude: 85,
      frequency: 0.0015,
      offset: 285,
    });

    this.setupCanvas();
    this.attachEventListeners();
  }

  private setupCanvas(): void {
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.resizeCanvas();
  }

  private resizeCanvas = (): void => {
    this.canvas.width = window.innerWidth - 20;
    this.canvas.height = window.innerHeight;
  };

  private initLines(): void {
    this.lines = [];
    for (let i = 0; i < this.config.trails; i++) {
      this.lines.push(
        new Line(
          { spring: 0.45 + (i / this.config.trails) * 0.025 },
          this.config
        )
      );
    }
  }

  private updateMousePos = (e: MouseEvent | TouchEvent): void => {
    e.preventDefault();

    if ('touches' in e && e.touches.length > 0) {
      this.pos.x = e.touches[0].pageX;
      this.pos.y = e.touches[0].pageY;
    } else if ('clientX' in e) {
      this.pos.x = (e as MouseEvent).clientX;
      this.pos.y = (e as MouseEvent).clientY;
    }

    if (this.lines.length === 0) {
      this.initLines();
      this.start();
    }
  };

  private handleTouchStart = (e: TouchEvent): void => {
    if (e.touches.length === 1) {
      this.pos.x = e.touches[0].pageX;
      this.pos.y = e.touches[0].pageY;
    }
  };

  private handleWindowFocus = (): void => {
    if (!this.running) {
      this.start();
    }
  };

  private handleWindowBlur = (): void => {
    this.stop();
  };

  private render = (): void => {
    if (!this.running) return;

    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.globalCompositeOperation = 'lighter';
    this.ctx.strokeStyle = `hsla(${Math.round(
      this.oscillator.update()
    )}, 100%, 60%, 0.015)`;
    this.ctx.lineWidth = 3;

    for (const line of this.lines) {
      line.update(this.pos, this.config);
      line.draw(this.ctx);
    }

    this.animationFrameId = window.requestAnimationFrame(this.render);
  };

  private attachEventListeners(): void {
    document.addEventListener('mousemove', this.updateMousePos, false);
    document.addEventListener('touchmove', this.updateMousePos, {
      passive: false,
    });
    document.addEventListener('touchstart', this.handleTouchStart, {
      passive: false,
    });
    window.addEventListener('resize', this.resizeCanvas);
    window.addEventListener('orientationchange', this.resizeCanvas);
    window.addEventListener('focus', this.handleWindowFocus);
    window.addEventListener('blur', this.handleWindowBlur);
  }

  start(): void {
    this.running = true;
    this.render();
  }

  stop(): void {
    this.running = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  destroy(): void {
    this.stop();
    document.removeEventListener('mousemove', this.updateMousePos);
    document.removeEventListener('touchmove', this.updateMousePos);
    document.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('resize', this.resizeCanvas);
    window.removeEventListener('orientationchange', this.resizeCanvas);
    window.removeEventListener('focus', this.handleWindowFocus);
    window.removeEventListener('blur', this.handleWindowBlur);
  }
}

// Export function to initialize
export function initializeCanvasTrail(
  canvasId: string = 'canvas',
  config?: ConfigOptions
): CanvasTrailManager {
  return new CanvasTrailManager(canvasId, config);
}

// Default export
export default CanvasTrailManager;