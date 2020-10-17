import React, { useEffect, useState } from 'react';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import Leaflet, { LatLng } from 'leaflet';

import mapMargerImg from '../images/map-marker.svg'
import '../styles/pages/orphanages-map.css';
import api from '../services/api';
import divinopolisCoords from '../utils/divinopolisCoords';

const mapIcon = Leaflet.icon({
    iconUrl: mapMargerImg,
    iconSize: [58,68],
    iconAnchor: [29, 68],
    popupAnchor: [170, 2]
});

interface Orphanage {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
}

function OrphanagesMap() {
    const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
    const [centerPos, setCenterPos] = useState({latitude: divinopolisCoords.latitude,longitude: divinopolisCoords.longitude})

    useEffect(() => {
        api.get('orphanages').then(response => {
            const responseData = response.data as Orphanage[];
            setOrphanages(responseData);

            const coords = responseData.map(res => {
                return new LatLng(
                    res.latitude,
                    res.longitude
                );
            });

            const bounds = Leaflet.latLngBounds(coords);
            const center = bounds.getCenter();
            
            setCenterPos({
                latitude: center.lat,
                longitude: center.lng
            });
        })
    }, []);

    return (
        <div id="page-map">
            <aside>
                <header>
                    <img src={mapMargerImg} alt="Happy"/>

                    <h2>Escolha um orfanato no mapa</h2>

                    <p>Muitas crianças estão esperando a sua visita :)</p>
                </header>

                <footer>
                    <strong>Divinópolis</strong>
                    <span>Minas Gerais</span>
                </footer>
            </aside>

            <Map center={[centerPos.latitude, centerPos.longitude]} zoom={13}
                style={{ width: '100%', height: '100%' }}>
                <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} />

                { orphanages.map(orphanage => {
                    return (
                      <Marker  key={orphanage.id} icon={mapIcon} position={[orphanage.latitude, orphanage.longitude]}>
                        <Popup key={orphanage.id} closeButton={false} minWidth={248} maxWidth={240} className="map-popup">
                            {orphanage.name}
                          <Link to={`/orphanages/${orphanage.id}`}>
                              <FiArrowRight size={20} color="#FFF" />
                          </Link>
                        </Popup>
                      </Marker>
                    );
                }) }
            </Map>

            <Link to="/orphanages/create" className="create-orphanage">
                <FiPlus size={32} color="#FFF" />
            </Link>
        </div>
    );
}

export default OrphanagesMap;