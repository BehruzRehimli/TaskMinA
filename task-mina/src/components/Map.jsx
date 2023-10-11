import React, { useEffect } from 'react';
import 'ol/ol.css';
import Feature from 'ol/Feature.js';
import { Map, View } from 'ol';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj.js';
import BingMaps from 'ol/source/BingMaps.js';
import { LineString, Point, Polygon } from 'ol/geom.js';
import { OGCMapTile, Vector as VectorSource } from 'ol/source.js';
import {
    Pointer as PointerInteraction,
    defaults as defaultInteractions,
} from 'ol/interaction.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';

const lineStringWKT = 'LINESTRING(50.32489718460863 40.3897112495751,50.32500619720577 40.39007045577375)';
const customCenter = [50.32489718460863, 40.3897112495751];  // Özel merkez noktası
const initialZoom = 15;



var num1=50.33276441736314
var num2=40.3959533022724
var num3=50.33253952273486
var num4=40.395660805362866


const MapComponent = (element) => {


    useEffect(() => {
        if (element.element) {
            var prevMap=document.getElementById("map")
            if (prevMap) {
                prevMap.innerHTML=''
            }
            const coordinates = String(element.element).split(/[ ,\(\)]+/);

            num1 = +coordinates[1]
            num2 = +coordinates[2]
            num3 = +coordinates[3]
            num4 = +coordinates[4]


            const lineFeature = new Feature(
                new LineString([
                    fromLonLat([num1, num2]),
                    fromLonLat([num3, num4]),
                ])
            );


          const  map = new Map({
                target: 'map',
                layers: [
                    new TileLayer({
                        source: new BingMaps({
                            key: "AmifsM5lzqFZPdQW601_tUZwDK_vCZl-TwIphyBlyC_1qOBnji-Rd3M8aQe0SO1j",
                            imagerySet: 'Aerial'
                        })
                    }),
                    new VectorLayer({
                        source: new VectorSource({
                            features: [lineFeature],
                        }),
                        style: {
                            'icon-src': 'data/icon.png',
                            'icon-opacity': 0.95,
                            'icon-anchor': [0.5, 46],
                            'icon-anchor-x-units': 'fraction',
                            'icon-anchor-y-units': 'pixels',
                            'stroke-width': 3,
                            'stroke-color': [255, 0, 0, 1],
                            'fill-color': [0, 0, 255, 0.6],
                        },
                    }),
                ],

                view: new View({
                    center: fromLonLat([(num1 + num3) / 2, (num2 + num4) / 2]),
                    zoom: 18
                })
            });
        }



    }, [element]);

    return (
        <div className='my-map-container' style={{ width: '49vw', height: '97%',position:"relative" }}>
            <div id="map" style={{ width: '100%', height: '100%' }}></div>

        </div>
    );
};

export default MapComponent;
