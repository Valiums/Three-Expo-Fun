// @flow

import Expo from 'expo';
import React from 'react';
import ExpoTHREE, { THREE } from 'expo-three';

const FRAGMENTSHADER = `
varying vec2 vUv;
uniform float time;
void main()	{
    vec2 p = - 1.0 + 2.0 * vUv;
    float a = time * 40.0;
    float d, e, f, g = 1.0 / 40.0 ,h ,i ,r ,q;
    e = 400.0 * ( p.x * 0.5 + 0.5 );
    f = 400.0 * ( p.y * 0.5 + 0.5 );
    i = 200.0 + sin( e * g + a / 150.0 ) * 20.0;
    d = 200.0 + cos( f * g / 2.0 ) * 18.0 + cos( e * g ) * 7.0;
    r = sqrt( pow( abs( i - e ), 2.0 ) + pow( abs( d - f ), 2.0 ) );
    q = f / r;
    e = ( r * cos( q ) ) - a / 2.0;
    f = ( r * sin( q ) ) - a / 2.0;
    d = sin( e * g ) * 176.0 + sin( e * g ) * 164.0 + r;
    h = ( ( f + d ) + a / 2.0 ) * g;
    i = cos( h + r * p.x / 1.3 ) * ( e + e + a ) + cos( q * g * 6.0 ) * ( r + h / 3.0 );
    h = sin( f * g ) * 144.0 - sin( e * g ) * 212.0 * p.x;
    h = ( h + ( f - e ) * q + sin( r - ( a + h ) / 7.0 ) * 10.0 + i / 4.0 ) * g;
    i += cos( h * 2.3 * sin( a / 350.0 - q ) ) * 184.0 * sin( q - ( r * 4.3 + a / 12.0 ) * g ) + tan( r * g + h ) * 184.0 * cos( r * g + h );
    i = mod( i / 5.6, 256.0 ) / 64.0;
    if ( i < 0.0 ) i += 4.0;
    if ( i >= 2.0 ) i = 4.0 - i;
    d = r / 350.0;
    d += sin( d * d * 8.0 ) * 0.52;
    f = ( sin( a * g ) + 1.0 ) / 2.0;
    gl_FragColor = vec4( vec3( f * i / 1.6, i / 2.0 + d / 13.0, i ) * d * p.x + vec3( i / 1.3 + d / 8.0, i / 2.0 + d / 18.0, i ) * d * ( 1.0 - p.x ), 1.0 );
}
`;

const VERTEXSHADER = `
varying vec2 vUv;
void main()	{
    vUv = uv;
    gl_Position = vec4( position, 1.0 );
}
`;

export default class App extends React.Component {
  _animate = gl => {
    // console.warn('animated');
    // Update Shader
    this.uniforms.time.value += 0.1;
    this._render(gl);
  };

  _render = gl => {
    // Render Scene!
    this.renderer.render(this.scene, this.camera);
    gl.endFrameEXP();
  };

  render() {
    // Create an `Expo.GLView` covering the whole screen, tell it to call our
    // `_onGLContextCreate` function once it's initialized.
    return (
      <Expo.GLView
        style={{ flex: 1 }}
        onContextCreate={this._onGLContextCreate}
        // onRender={this._animate}
      />
    );
  }

  // This is called by the `Expo.GLView` once it's initialized
  _onGLContextCreate = async gl => {
    // Based on https://threejs.org/docs/#manual/introduction/Creating-a-scene
    // In this case we instead use a texture for the material (because textures
    // are cool!). All differences from the normal THREE.js example are
    // indicated with a `NOTE:` comment.

    console.warn('ici1');

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // NOTE: How to create an `Expo.GLView`-compatible THREE renderer
    this.renderer = ExpoTHREE.createRenderer({ gl });
    this.renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    this.geometry = new THREE.PlaneBufferGeometry(2, 2);
    this.uniforms = {
      time: { value: 1.0 },
    };
    //  NOTE: How to create an Expo-compatible THREE texture
    // const texture = await ExpoTHREE.loadAsync(require('./assets/test.jpeg'));

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: VERTEXSHADER,
      fragmentShader: FRAGMENTSHADER,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    const render = () => {
      requestAnimationFrame(render);

      renderer.render(scene, camera);

      // NOTE: At the end of each frame, notify `Expo.GLView` with the below
      gl.endFrameEXP();
    };

    const animate = timestamp => {
      requestAnimationFrame(animate);
      this._animate(gl);
    };

    animate();
  };
}
