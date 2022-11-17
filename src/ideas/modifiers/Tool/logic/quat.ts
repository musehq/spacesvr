import { Quaternion } from "three";

const dummy = new Quaternion();

// taken from https://gist.github.com/sketchpunk/3568150a04b973430dfe8fd29bf470c8
export class QuaterionSpring {
  velocity: Float32Array;
  stiffness: number;
  damping: number;

  constructor(damping = 5, stiffness = 30) {
    this.velocity = new Float32Array(4);
    this.stiffness = stiffness;
    this.damping = damping;
  }

  _velLenSqr() {
    return (
      this.velocity[0] ** 2 +
      this.velocity[1] ** 2 +
      this.velocity[2] ** 2 +
      this.velocity[3] ** 2
    );
  }

  // Harmonic oscillation
  // https://stackoverflow.com/questions/44688112/spring-physics-applied-to-quaternions-using-python
  oscillationStep(cq: Quaternion, target: Quaternion, dt: number) {
    // Check when the spring is done.
    const dot = cq.dot(target);
    if (dot >= 0.9999 && this._velLenSqr() < 0.000001) {
      cq.copy(target);
      return;
    }

    const tq = dummy;
    if (dot < 0) {
      // Use the closest rotation
      tq.x = -target.x;
      tq.y = -target.y;
      tq.z = -target.z;
      tq.w = -target.w;
    } else {
      tq.copy(target);
    }

    this.velocity[0] +=
      (-this.stiffness * (cq.x - tq.x) - this.damping * this.velocity[0]) * dt;
    this.velocity[1] +=
      (-this.stiffness * (cq.y - tq.y) - this.damping * this.velocity[1]) * dt;
    this.velocity[2] +=
      (-this.stiffness * (cq.z - tq.z) - this.damping * this.velocity[2]) * dt;
    this.velocity[3] +=
      (-this.stiffness * (cq.w - tq.w) - this.damping * this.velocity[3]) * dt;

    cq.x += this.velocity[0] * dt;
    cq.y += this.velocity[1] * dt;
    cq.z += this.velocity[2] * dt;
    cq.w += this.velocity[3] * dt;
    cq.normalize();
  }

  // Critically Damped Spring
  criticallyStep(cq: Quaternion, target: Quaternion, dt: number) {
    // Check when the spring is done.
    const dot = cq.dot(target);
    if (dot >= 0.9999 && this._velLenSqr() < 0.000001) {
      cq.copy(target);
      return;
    }

    const tq = dummy;
    if (dot < 0) {
      // Use the closest rotation
      tq.x = -target.x;
      tq.y = -target.y;
      tq.z = -target.z;
      tq.w = -target.w;
    } else {
      tq.copy(target);
    }

    const dSqrDt = this.damping * this.damping * dt,
      n2 = 1 + this.damping * dt,
      n2Sqr = n2 * n2;

    this.velocity[0] = (this.velocity[0] - (cq.x - tq.x) * dSqrDt) / n2Sqr;
    this.velocity[1] = (this.velocity[1] - (cq.y - tq.y) * dSqrDt) / n2Sqr;
    this.velocity[2] = (this.velocity[2] - (cq.z - tq.z) * dSqrDt) / n2Sqr;
    this.velocity[3] = (this.velocity[3] - (cq.w - tq.w) * dSqrDt) / n2Sqr;

    cq.x += this.velocity[0] * dt;
    cq.y += this.velocity[1] * dt;
    cq.z += this.velocity[2] * dt;
    cq.w += this.velocity[3] * dt;
    cq.normalize();

    return cq;
  }
}
