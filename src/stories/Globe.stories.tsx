import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import GlobeComponent from "./GlobeComponent";
import * as THREE from "three";
import TrackballControls from "three-trackballcontrols";
import ThreeGlobe from "../three-globe";

import ExampleImage from "./download.jpg";
import countries from "./countrypolygons.json";
import * as solar from "solar-calculator";

export default {
  title: "Globe",
  component: GlobeComponent,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as Meta;

export const Basic = (args) => <GlobeComponent {...args} />;
Basic.args = {
  function: () => {
    // Gen random data
    const N = 300;
    const gData = [...Array(N).keys()].map(() => ({
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      size: Math.random() / 3,
      color: ["red", "white", "blue", "green"][Math.round(Math.random() * 3)],
    }));

    const Globe = new ThreeGlobe().globeImageUrl(ExampleImage);
    // .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
    // .pointsData(gData)
    // .pointAltitude('size')
    // .pointColor('color');

    // setTimeout(() => {
    //   gData.forEach(d => d.size = Math.random());
    //   Globe.pointsData(gData);
    // }, 4000);

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("globeViz").appendChild(renderer.domElement);

    // Setup scene
    const scene = new THREE.Scene();
    scene.add(Globe);
    scene.background = null;
    scene.add(new THREE.AmbientLight(0xffffff));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.6));

    // Setup camera
    const camera = new THREE.PerspectiveCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera.position.z = 500;

    // Add camera controls
    const tbControls = new TrackballControls(camera, renderer.domElement);
    tbControls.minDistance = 101;
    tbControls.rotateSpeed = 5;
    tbControls.zoomSpeed = 0.8;

    // Kick-off renderer
    (function animate() {
      // IIFE
      // Frame cycle
      tbControls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    })();
  },
};

export const CountryPolygons = (args) => <GlobeComponent {...args} />;
CountryPolygons.args = {
  function: () => {
    const Globe = new ThreeGlobe()
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-dark.jpg")
      .polygonsData(
        countries.features.filter((d) => d.properties.ISO_A2 !== "AQ")
      )
      .polygonCapColor(() => "rgba(200, 0, 0, 0.7)")
      .polygonSideColor(() => "rgba(0, 200, 0, 0.1)")
      .polygonStrokeColor(() => "#111");

    setTimeout(() => Globe.polygonAltitude(() => Math.random()), 4000);

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("globeViz").appendChild(renderer.domElement);

    // Setup scene
    const scene = new THREE.Scene();
    scene.add(Globe);
    scene.add(new THREE.AmbientLight(0xbbbbbb));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.6));

    // Setup camera
    const camera = new THREE.PerspectiveCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera.position.z = 500;

    // Add camera controls
    const tbControls = new TrackballControls(camera, renderer.domElement);
    tbControls.minDistance = 101;
    tbControls.rotateSpeed = 5;
    tbControls.zoomSpeed = 0.8;

    // Kick-off renderer
    (function animate() {
      // IIFE
      // Frame cycle
      tbControls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    })();
  },
};

export const Custom = (args) => <GlobeComponent {...args} />;
Custom.args = {
  function: () => {
    // Gen random data
    const N = 300;
    const gData = [...Array(N).keys()].map(() => ({
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      alt: Math.random(),
      radius: Math.random() * 5,
      color: ["red", "white", "blue", "green"][Math.round(Math.random() * 3)],
    }));

    const Globe = new ThreeGlobe()
      .globeImageUrl(
        "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      )
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
      .customLayerData(gData)
      .customThreeObject(
        (d) =>
          new THREE.Mesh(
            new THREE.SphereBufferGeometry(d.radius),
            new THREE.MeshLambertMaterial({ color: d.color })
          )
      )
      .customThreeObjectUpdate((obj, d) => {
        Object.assign(obj.position, Globe.getCoords(d.lat, d.lng, d.alt));
      });

    (function moveSpheres() {
      gData.forEach((d) => (d.lat += 0.2));
      Globe.customLayerData(Globe.customLayerData());
      requestAnimationFrame(moveSpheres);
    })();

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("globeViz").appendChild(renderer.domElement);

    // Setup scene
    const scene = new THREE.Scene();
    scene.add(Globe);
    scene.add(new THREE.AmbientLight(0xbbbbbb));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.6));

    // Setup camera
    const camera = new THREE.PerspectiveCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera.position.z = 500;

    // Add camera controls
    const tbControls = new TrackballControls(camera, renderer.domElement);
    tbControls.minDistance = 101;
    tbControls.rotateSpeed = 5;
    tbControls.zoomSpeed = 0.8;

    // Kick-off renderer
    (function animate() {
      // IIFE
      // Frame cycle
      tbControls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    })();
  },
};

export const CustomMaterial = (args) => <GlobeComponent {...args} />;
CustomMaterial.args = {
  function: () => {
    const Globe = new ThreeGlobe()
      .globeImageUrl(
        "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      )
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png");

    // custom globe material
    const globeMaterial = Globe.globeMaterial();
    globeMaterial.bumpScale = 10;
    new THREE.TextureLoader().load(
      "//unpkg.com/three-globe/example/img/earth-water.png",
      (texture) => {
        globeMaterial.specularMap = texture;
        globeMaterial.specular = new THREE.Color("grey");
        globeMaterial.shininess = 15;
      }
    );

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 1); // change light position to see the specularMap's effect

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("globeViz").appendChild(renderer.domElement);

    // Setup scene
    const scene = new THREE.Scene();
    scene.add(Globe);
    scene.add(new THREE.AmbientLight(0xbbbbbb));
    scene.add(directionalLight);

    // Setup camera
    const camera = new THREE.PerspectiveCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera.position.z = 500;

    // Add camera controls
    const tbControls = new TrackballControls(camera, renderer.domElement);
    tbControls.minDistance = 101;
    tbControls.rotateSpeed = 5;
    tbControls.zoomSpeed = 0.8;

    // Kick-off renderer
    (function animate() {
      // IIFE
      // Frame cycle
      tbControls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    })();
  },
};

export const HexBin = (args) => <GlobeComponent {...args} />;
HexBin.args = {
  function: () => {
    // Gen random data
    const N = 6000;
    const gData = [...Array(N).keys()].map(() => ({
      lat: (Math.random() - 0.5) * 180 * 0.9,
      lng: ((Math.random() - 0.5) * 360) / 1,
    }));

    const Globe = new ThreeGlobe()
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
      .hexBinPointsData(gData)
      .hexBinPointWeight(3)
      .hexBinResolution(2)
      .hexMargin(0.2)
      .hexTopColor(() => "red")
      .hexSideColor(() => "rgba(0,255,0,0.8)")
      .hexBinMerge(true);

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("globeViz").appendChild(renderer.domElement);

    // Setup scene
    const scene = new THREE.Scene();
    scene.add(Globe);
    scene.add(new THREE.AmbientLight(0xbbbbbb));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.6));

    // Setup camera
    const camera = new THREE.PerspectiveCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera.position.z = 500;

    // Add camera controls
    const tbControls = new TrackballControls(camera, renderer.domElement);
    tbControls.minDistance = 101;
    tbControls.rotateSpeed = 5;
    tbControls.zoomSpeed = 0.8;

    // Kick-off renderer
    (function animate() {
      // IIFE
      // Frame cycle
      tbControls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    })();
  },
};

export const HexedPolygon = (args) => <GlobeComponent {...args} />;
HexedPolygon.args = {
  function: () => {
    const Globe = new ThreeGlobe()
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-dark.jpg")
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.3)
      .hexPolygonColor(
        () =>
          `#${Math.round(Math.random() * Math.pow(2, 24))
            .toString(16)
            .padStart(6, "0")}`
      );

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("globeViz").appendChild(renderer.domElement);

    // Setup scene
    const scene = new THREE.Scene();
    scene.add(Globe);
    scene.add(new THREE.AmbientLight(0xbbbbbb));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.6));

    // Setup camera
    const camera = new THREE.PerspectiveCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera.position.z = 500;

    // Add camera controls
    const tbControls = new TrackballControls(camera, renderer.domElement);
    tbControls.minDistance = 101;
    tbControls.rotateSpeed = 5;
    tbControls.zoomSpeed = 0.8;

    // Kick-off renderer
    (function animate() {
      // IIFE
      // Frame cycle
      tbControls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    })();
  },
};

export const Labels = (args) => <GlobeComponent {...args} />;
Labels.args = {
  function: () => {
    // Gen random data
    const N = 50;
    const gData = [...Array(N).keys()].map(() => ({
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      size: Math.random() * 1,
      color: ["red", "white", "blue", "green"][Math.round(Math.random() * 3)],
    }));

    const Globe = new ThreeGlobe()
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-dark.jpg")
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
      .labelsData(gData)
      .labelText(
        (d) =>
          `(${Math.round(d.lat * 1e2) / 1e2}, ${Math.round(d.lng * 1e2) / 1e2})`
      )
      .labelSize("size")
      .labelDotRadius((d) => d.size / 5)
      .labelColor("color");

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("globeViz").appendChild(renderer.domElement);

    // Setup scene
    const scene = new THREE.Scene();
    scene.add(Globe);
    scene.add(new THREE.AmbientLight(0xbbbbbb));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.6));

    // Setup camera
    const camera = new THREE.PerspectiveCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera.position.z = 500;

    // Add camera controls
    const tbControls = new TrackballControls(camera, renderer.domElement);
    tbControls.minDistance = 101;
    tbControls.rotateSpeed = 5;
    tbControls.zoomSpeed = 0.8;

    // Kick-off renderer
    (function animate() {
      // IIFE
      // Frame cycle
      tbControls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    })();
  },
};

export const Links = (args) => <GlobeComponent {...args} />;
Links.args = {
  function: () => {
    // Gen random data
    const N = 20;

    const arcsData = [...Array(N).keys()].map(() => ({
      startLat: (Math.random() - 0.5) * 180,
      startLng: (Math.random() - 0.5) * 360,
      endLat: (Math.random() - 0.5) * 180,
      endLng: (Math.random() - 0.5) * 360,
      color: ["red", "white", "blue", "green"][Math.round(Math.random() * 3)],
    }));

    const Globe = new ThreeGlobe()
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
      .arcsData(arcsData)
      .arcColor("color")
      .arcDashLength(0.4)
      .arcDashGap(4)
      .arcDashInitialGap(() => Math.random() * 5)
      .arcDashAnimateTime(1000);

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("globeViz").appendChild(renderer.domElement);

    // Setup scene
    const scene = new THREE.Scene();
    scene.add(Globe);
    scene.add(new THREE.AmbientLight(0xbbbbbb));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.6));

    // Setup camera
    const camera = new THREE.PerspectiveCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera.position.z = 500;

    // Add camera controls
    const tbControls = new TrackballControls(camera, renderer.domElement);
    tbControls.minDistance = 101;
    tbControls.rotateSpeed = 5;
    tbControls.zoomSpeed = 0.8;

    // Kick-off renderer
    (function animate() {
      // IIFE
      // Frame cycle
      tbControls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    })();
  },
};

export const Paths = (args) => <GlobeComponent {...args} />;
Paths.args = {
  function: () => {
    // Gen random paths
    const N_PATHS = 10;
    const MAX_POINTS_PER_LINE = 10000;
    const MAX_STEP_DEG = 1;
    const MAX_STEP_ALT = 0.015;
    const gData = [...Array(N_PATHS).keys()].map(() => {
      let lat = (Math.random() - 0.5) * 90;
      let lng = (Math.random() - 0.5) * 360;
      let alt = 0;

      return [
        [lat, lng, alt],
        ...[
          ...Array(Math.round(Math.random() * MAX_POINTS_PER_LINE)).keys(),
        ].map(() => {
          lat += (Math.random() * 2 - 1) * MAX_STEP_DEG;
          lng += (Math.random() * 2 - 1) * MAX_STEP_DEG;
          alt += (Math.random() * 2 - 1) * MAX_STEP_ALT;
          alt = Math.max(0, alt);

          return [lat, lng, alt];
        }),
      ];
    });

    const Globe = new ThreeGlobe({ animateIn: false })
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-dark.jpg")
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
      .pathsData(gData)
      .pathColor(() => ["rgba(0,0,255,0.4)", "rgba(255,0,0,0.4)"])
      .pathDashLength(0.01)
      .pathDashGap(0.004)
      .pathDashAnimateTime(100000);

    setTimeout(() => {
      Globe.pathPointAlt((pnt) => pnt[2]) // set altitude accessor
        .pathTransitionDuration(4000);
    }, 6000);

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("globeViz").appendChild(renderer.domElement);

    // Setup scene
    const scene = new THREE.Scene();
    scene.add(Globe);
    scene.add(new THREE.AmbientLight(0xbbbbbb));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.6));

    // Setup camera
    const camera = new THREE.PerspectiveCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera.position.z = 500;

    // Add camera controls
    const tbControls = new TrackballControls(camera, renderer.domElement);
    tbControls.minDistance = 101;
    tbControls.rotateSpeed = 5;
    tbControls.zoomSpeed = 0.8;

    // Kick-off renderer
    (function animate() {
      // IIFE
      // Frame cycle
      tbControls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    })();
  },
};

export const SolarTerminator = (args) => <GlobeComponent {...args} />;
SolarTerminator.args = {
  function: () => {
    const VELOCITY = 9; // minutes per frame

    const sunPosAt = (dt) => {
      const day = new Date(+dt).setUTCHours(0, 0, 0, 0);
      const t = solar.century(dt);
      const longitude = ((day - dt) / 864e5) * 360 - 180;
      return [longitude - solar.equationOfTime(t) / 4, solar.declination(t)];
    };

    let dt = +new Date();
    const solarTile = { pos: sunPosAt(dt) };
    const timeEl = document.getElementById("time");

    const Globe = new ThreeGlobe()
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-dark.jpg")
      .tilesData([solarTile])
      .tileLng((d) => d.pos[0])
      .tileLat((d) => d.pos[1])
      .tileAltitude(0.005)
      .tileWidth(180)
      .tileHeight(180)
      .tileUseGlobeProjection(false)
      .tileMaterial(
        () =>
          new THREE.MeshLambertMaterial({
            color: "#ffff00",
            opacity: 0.3,
            transparent: true,
          })
      )
      .tilesTransitionDuration(0);

    // animate time of day
    requestAnimationFrame(() =>
      (function animate() {
        dt += VELOCITY * 60 * 1000;
        solarTile.pos = sunPosAt(dt);
        Globe.tilesData([solarTile]);
        timeEl.textContent = new Date(dt).toLocaleString();
        requestAnimationFrame(animate);
      })()
    );

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("globeViz").appendChild(renderer.domElement);

    // Setup scene
    const scene = new THREE.Scene();
    scene.add(Globe);
    scene.add(new THREE.AmbientLight(0xbbbbbb));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.6));

    // Setup camera
    const camera = new THREE.PerspectiveCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera.position.z = 500;

    // Add camera controls
    const tbControls = new TrackballControls(camera, renderer.domElement);
    tbControls.minDistance = 101;
    tbControls.rotateSpeed = 5;
    tbControls.zoomSpeed = 0.8;

    // Kick-off renderer
    (function animate() {
      // IIFE
      // Frame cycle
      tbControls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    })();
  },
};

export const Tiles = (args) => <GlobeComponent {...args} />;
Tiles.args = {
  function: () => {
    const TILE_MARGIN = 0.35; // degrees

    // Gen random data
    const GRID_SIZE = [60, 20];
    const COLORS = [
      "red",
      "green",
      "yellow",
      "blue",
      "orange",
      "pink",
      "brown",
      "purple",
      "magenta",
    ];

    const materials = COLORS.map(
      (color) =>
        new THREE.MeshLambertMaterial({
          color,
          opacity: 0.6,
          transparent: true,
        })
    );
    const tileWidth = 360 / GRID_SIZE[0];
    const tileHeight = 180 / GRID_SIZE[1];
    const tilesData = [];
    [...Array(GRID_SIZE[0]).keys()].forEach((lngIdx) =>
      [...Array(GRID_SIZE[1]).keys()].forEach((latIdx) =>
        tilesData.push({
          lng: -180 + lngIdx * tileWidth,
          lat: -90 + (latIdx + 0.5) * tileHeight,
          material: materials[Math.floor(Math.random() * materials.length)],
        })
      )
    );

    const Globe = new ThreeGlobe()
      .tilesData(tilesData)
      .tileWidth(tileWidth - TILE_MARGIN)
      .tileHeight(tileHeight - TILE_MARGIN)
      .tileMaterial("material");

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("globeViz").appendChild(renderer.domElement);

    // Setup scene
    const scene = new THREE.Scene();
    scene.add(Globe);
    scene.add(new THREE.AmbientLight(0xbbbbbb));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.6));

    // Setup camera
    const camera = new THREE.PerspectiveCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera.position.z = 500;

    // Add camera controls
    const tbControls = new TrackballControls(camera, renderer.domElement);
    tbControls.minDistance = 101;
    tbControls.rotateSpeed = 5;
    tbControls.zoomSpeed = 0.8;
    tbControls.noPan = true;
    tbControls.noRotate = false;
    tbControls.dynamicDampingFactor = 0.8;

    // Kick-off renderer
    (function animate() {
      // IIFE
      // Frame cycle
      tbControls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    })();
  },
};
