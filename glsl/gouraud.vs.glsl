uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 lightPosition;

uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;
uniform float shininess;

varying vec3 interpolatedNormal;
varying vec3 color;

vec3 getReflection() {
    // R = 2(N(NL)) - L
    vec3 N = normal;
    vec3 L = normalize(position - lightPosition);
    float NL = dot(N, L);
    vec3 NNL = NL * N;
    return (2.0 * NNL) - L;
}

void main() {
    interpolatedNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    vec3 specularLight = kSpecular * lightColor * pow(dot(normal, getReflection()), shininess);
    color = specularLight;
}

// Is = Ks Il (VR)^n
