uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 lightPosition;

uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;
uniform float shininess;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;

varying vec3 interpolatedNormal;
varying vec3 ipos;

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

vec3 l2p(vec3 vec) {
    return vec3(projectionMatrix * modelViewMatrix * vec4(vec, 0.0));
}

void main() {
    vec3 N = normalize(l2v(interpolatedNormal));
    vec3 P = l2v(ipos);

    vec3 L = normalize(l2w(lightPosition) - P);
    vec3 V = normalize(l2p(-ipos));

    vec3 halfway = (V + L) / 2.0;
    // Is = Ks * Il * (VR)^n
    vec3 ambientLight = kAmbient * ambientColor;
    vec3 specularLight = kSpecular * lightColor * pow(max(dot(halfway, N), 0.0), shininess);
    vec3 diffuseLight = kDiffuse * lightColor * max(dot(N, L), 0.0);

    vec3 color = ambientLight + specularLight + diffuseLight;
    gl_FragColor = vec4(color, 1.0);
}
