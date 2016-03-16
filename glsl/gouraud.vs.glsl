varying vec3 interpolatedNormal;

void main() {
    interpolatedNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
