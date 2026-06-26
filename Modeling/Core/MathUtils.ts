import { Vector3 } from "../../Yuu API/Basic Types/Vector3";
import { Quaternion } from "../../Yuu API/Basic Types/Quaternion";

// ─── Grid snapping ────────────────────────────────────────────────────────────

export function snap(value: number, step: number): number {
  if (step <= 0) return value;
  return Math.round(value / step) * step;
}

export function snapVector(vec: Vector3, step: number): Vector3 {
  return new Vector3(
    snap(vec.x, step),
    snap(vec.y, step),
    snap(vec.z, step)
  );
}

// ─── Quaternion math ─────────────────────────────────────────────────────────

export function conjugate(q: Quaternion): Quaternion {
  return new Quaternion(-q.x, -q.y, -q.z, q.w);
}

export function rotateVector(v: Vector3, q: Quaternion): Vector3 {
  const qx = q.x, qy = q.y, qz = q.z, qw = q.w;
  const vx = v.x, vy = v.y, vz = v.z;

  const ix =  qw * vx + qy * vz - qz * vy;
  const iy =  qw * vy - qx * vz + qz * vx;
  const iz =  qw * vz + qx * vy - qy * vx;
  const iw = -qx * vx - qy * vy - qz * vz;

  return new Vector3(
    iw * -qx + ix * qw + iy * -qz - iz * -qy,
    iw * -qy - ix * -qz + iy * qw + iz * -qx,
    iw * -qz + ix * -qy - iy * -qx + iz * qw
  );
}

/** Converts a unit quaternion to Euler angles in degrees (XYZ order). */
export function quatToEulerDegrees(q: Quaternion): Vector3 {
  const sinr_cosp = 2 * (q.w * q.x + q.y * q.z);
  const cosr_cosp = 1 - 2 * (q.x * q.x + q.y * q.y);
  const x = Math.atan2(sinr_cosp, cosr_cosp);

  const sinp = 2 * (q.w * q.y - q.z * q.x);
  let y = 0;
  if (Math.abs(sinp) >= 1)
    y = (Math.PI / 2) * Math.sign(sinp);
  else
    y = Math.asin(sinp);

  const siny_cosp = 2 * (q.w * q.z + q.x * q.y);
  const cosy_cosp = 1 - 2 * (q.y * q.y + q.z * q.z);
  const z = Math.atan2(siny_cosp, cosy_cosp);

  const radToDeg = 180 / Math.PI;
  return new Vector3(x * radToDeg, y * radToDeg, z * radToDeg);
}
