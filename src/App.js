import "./App.css";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import * as BABYLON from "babylonjs";

mapboxgl.accessToken =
  "pk.eyJ1IjoieGFuZGVyaGVyZSIsImEiOiJjbGZiODBleTIxM2ZxM3Rtd2V3NHZ6b3d0In0.newLwwrbABCNIUnBXgdUBg";

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [src, setSrc] = useState("");

  //title
  useEffect(() => {
    document.title = "React Task";
  }, []);

  //map
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [77.582, 12.9815],
      zoom: 9,
    });
  });

  //canvas
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!src) return;
    const canvas = canvasRef.current; // Get the canvas element
    const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
    const createScene = function () {
      // Creates a basic Babylon Scene object
      const scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color3.FromHexString("#141414");
      // Creates and positions a free camera
      const camera = new BABYLON.ArcRotateCamera(
        "Camera",
        0,
        0,
        10,
        new BABYLON.Vector3(0, 0, 0),
        scene
      );

      // Positions the camera overwriting alpha, beta, radius
      camera.setPosition(new BABYLON.Vector3(0, 0, 20));

      // This attaches the camera to the canvas
      camera.attachControl(canvas);
      camera.panningSensibility = 0;
      // Creates a light, aiming 0,1,0 - to the sky
      const light = new BABYLON.PointLight(
        "pointLight",
        new BABYLON.Vector3(0, 10, 0),
        scene
      );
      light.parent = camera;
      // Dim the light a small amount - 0 to 1
      light.intensity = 0.7;

      const box = BABYLON.MeshBuilder.CreateBox(
        "box",
        {
          width: 16,
          height: 9,
          depth: 5,
          wrap: true,
        },
        scene
      );

      var mat = new BABYLON.StandardMaterial("mat", scene);
      var texture = new BABYLON.Texture(src, scene);
      mat.diffuseTexture = texture;

      box.material = mat;

      return scene;
    };
    const scene = createScene(); //Call the createScene function
    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function () {
      scene.render();
    });
    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
      engine.resize();
    });
  }, [src]);

  return (
    <div className="App">
      <h1>Please choose a location</h1>
      <div ref={mapContainer} className="map-container" />
      <button
        onClick={() => {
          setSrc(
            `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${
              map.current.getCenter().lng
            },${map.current.getCenter().lat},${map.current.getZoom()}/${
              mapContainer.current.clientWidth
            }x${mapContainer.current.clientHeight}?access_token=${
              mapboxgl.accessToken
            }`
          );
        }}
      >
        Get Image
      </button>
      {src && <canvas id="renderCanvas" ref={canvasRef}></canvas>}
    </div>
  );
}

export default App;
