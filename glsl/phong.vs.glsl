uniform vec3 lightPosition;

varying vec3 interpolatedNormal;
varying vec3 ipos;

void main() {
    interpolatedNormal = normal;
    ipos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

