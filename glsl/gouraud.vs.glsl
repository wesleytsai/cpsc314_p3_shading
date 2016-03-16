uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 lightPosition;

uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;
uniform float shininess;

varying vec3 interpolatedNormal;
varying vec3 color;

vec3 getReflection(vec3 N, vec3 L) {
    // R = 2(N(NL)) - L
    float NL = dot(N, L);
    vec3 NNL = NL * N;
    return normalize((2.0 * NNL) - L);
}

vec3 l2v(vec3 vec) {
    return vec3(modelViewMatrix * vec4(vec, 0.0));
}

vec3 l2w(vec3 vec) {
    return vec3(modelMatrix * vec4(vec, 0.0));
}

void main() {
    interpolatedNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    vec3 N = l2w(normal);
    vec3 P = l2w(position);

    vec3 L = normalize(P - l2w(lightPosition));
    vec3 V = normalize(l2v(-position));

    vec3 R = getReflection(N, L);


    // Is = Ks * Il * (VR)^n
    vec3 ambientLight = kAmbient * ambientColor;
    vec3 specularLight = kSpecular * lightColor * pow(max(dot(V, R), 0.0), shininess);
    vec3 diffuseLight = kDiffuse * lightColor * max(dot(N, L), 0.0);
    color = ambientLight + specularLight + diffuseLight;
}

