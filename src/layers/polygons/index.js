import {
  DoubleSide,
  Mesh,
  MeshLambertMaterial
} from 'three';

const THREE = window.THREE
  ? window.THREE // Prefer consumption from global THREE, if exists
  : {
  DoubleSide,
  Mesh,
  MeshLambertMaterial
};

import { ConicPolygonBufferGeometry } from './ConicPolygonGeometry';

import Kapsule from 'kapsule';
import accessorFn from 'accessor-fn';
import TWEEN from '@tweenjs/tween.js';

import { colorStr2Hex, colorAlpha } from '../../color-utils';
import { emptyObject } from '../../gc';
import { threeDigest } from '../../digest';
import { GLOBE_RADIUS } from '../../constants';

//

export default Kapsule({
  props: {
    polygonsData: { default: [] },
    polygonGeoJsonGeometry: {},
    polygonColor: { default: () => '#ffffaa' },
    polygonAltitude: { default: 0.1 }, // in units of globe radius
    polygonsTransitionDuration: { default: 1000, triggerUpdate: false } // ms
  },

  init(threeObj, state) {
    // Clear the scene
    emptyObject(threeObj);

    // Main three object to manipulate
    state.scene = threeObj;
  },

  update(state) {
    // Data accessors
    const geoJsonAccessor = accessorFn(state.polygonGeoJsonGeometry);
    const altitudeAccessor = accessorFn(state.polygonAltitude);
    const colorAccessor = accessorFn(state.polygonColor);

    const singlePolygons = [];
    state.polygonsData.forEach(polygon => {
      const geoJson = geoJsonAccessor(polygon);
      const geoId = polygon.__id || `${Math.round(Math.random() * 1e9)}`; // generate and stamp polygon ids to keep track in digest
      polygon.__id = geoId;

      if (geoJson.type === 'Polygon') {
        singlePolygons.push({
          coords: geoJson.coordinates,
          data: polygon,
          id: `${geoId}_0`
        });
      } else if (geoJson.type === 'MultiPolygon') {
        singlePolygons.push(...geoJson.coordinates.map((coords, idx) => ({
          coords,
          data: polygon,
          id: `${geoId}_${idx}`
        })));
      } else {
        console.warn(`Unsupported GeoJson geometry type: ${geoJson.type}. Skipping geometry...`);
      }
    });

    threeDigest(singlePolygons, state.scene, {
      idAccessor: 'id',
      exitObj: emptyObject,
      createObj: ({ coords, data }) => {
        const color = colorAccessor(data);
        const opacity = colorAlpha(color);

        const obj = new THREE.Mesh(
          new ConicPolygonBufferGeometry(coords, GLOBE_RADIUS, GLOBE_RADIUS * (1 + altitudeAccessor(data)), false),
          new THREE.MeshLambertMaterial({
            color: colorStr2Hex(color),
            transparent: opacity < 1,
            opacity: opacity,
            side: THREE.DoubleSide
          })
        );

        obj.__globeObjType = 'polygon'; // Add object type

        return obj;
      },
      updateObj: (obj, { coords, data }) => {
        const color = colorAccessor(data);
        const opacity = colorAlpha(color);

        obj.material.color.set(colorStr2Hex(color));
        obj.material.transparent = opacity < 1;
        obj.material.opacity = opacity;

        const applyUpdate = ({ alt }) => {
          obj.geometry = new ConicPolygonBufferGeometry(coords, GLOBE_RADIUS, GLOBE_RADIUS * (1 + alt), false);
        };

        const targetD = {
          alt: altitudeAccessor(data)
        };

        const currentTargetD = data.__currentTargetD;
        data.__currentTargetD = targetD;

        if (!state.polygonsTransitionDuration || state.polygonsTransitionDuration < 0) {
          // set final position
          applyUpdate(targetD);
        } else {
          // animate
          new TWEEN.Tween(currentTargetD || targetD)
            .to(targetD, state.polygonsTransitionDuration)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(applyUpdate)
            .start();
        }
      }
    });
  }
});