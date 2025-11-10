import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonButton,
  useIonToast,
} from '@ionic/react';
import {
  layersOutline,
  globeOutline,
  contractOutline,
  analyticsOutline,
  alertCircleOutline
} from 'ionicons/icons';
import './MapTab.css';
import MapComponent from '../components/map/MapComponent';
import MapLayerButton from '../components/map/MapLayerButton';


import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import SwiperCore from 'swiper';

import 'swiper/css';
import 'swiper/css/pagination';
import FaultLinesInfo from '../components/map/layerInfo/FaultLinesInfo';
import PlateBoundariesInfo from '../components/map/layerInfo/PlateBoundariesInfo';
import TectonicPlatesInfo from '../components/map/layerInfo/TectonicPatesInfo';

const MapTab: React.FC = () => {

  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [layerVisibility, setLayerVisibility] = useState({
    faultLines: false,
    plates: false,
    boundaries: false
  });
  const [isFaultsLoading, setIsFaultsLoading] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState<SwiperCore | null>(null);

  const modalRef = useRef<HTMLIonModalElement>(null);
  const [presentToast] = useIonToast();

  // Show warning toast when all layers are active
  useEffect(() => {
    const { faultLines, plates, boundaries } = layerVisibility;
    if (faultLines && plates && boundaries) {
      presentToast({
        message: 'Tüm katmanlarını aynı anda aktive etmek harita performansını yavaşlatabilir',
        duration: 3500,
        position: 'top',
        color: 'warning',
        icon: alertCircleOutline
      });
    }
  }, [layerVisibility, presentToast]);

  const handleLayerToggle = (layer: keyof typeof layerVisibility, index: number) => {
    const isTurningLayerOn = !layerVisibility[layer];

    if (swiperInstance && isTurningLayerOn) {
      swiperInstance.slideTo(index);
    }

    if (layer === 'faultLines' && isTurningLayerOn) {
      setIsFaultsLoading(true);
    }

    setLayerVisibility(prev => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  const handleLoadingChange = useCallback((isLoading: boolean) => {
    if (!isLoading) {
      setIsFaultsLoading(false);
    }
  }, []);

  const showLayerDetails = () => {
    if (modalRef.current) {
      modalRef.current.setCurrentBreakpoint(1);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Deprem Haritası</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <MapComponent
          layerVisibility={layerVisibility}
          onLoadingChange={handleLoadingChange}
        />
        {/*  Citation for Fault Lines Layer */}
        {layerVisibility.faultLines && (
          <div style={{
            position: 'absolute',
            top: '8%',
            left: '10%',
            right: '10%',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '2px 8px',
            borderRadius: '5px',
            fontSize: '12px',
            zIndex: 10,
            textAlign: 'center',
            maxWidth: '90%'
          }}>
            <a
              href="https://doi.org/10.5194/essd-14-4489-2022"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#0083ca', textDecoration: 'none', fontSize: '0.6rem' }}
            >
              Zelenin, E., Bachmanov, D., Garipova, S., Trifonov, V., and Kozhurin, A.: The Active Faults of Eurasia Database (AFEAD): the ontology and design behind the continental-scale dataset, Earth Syst. Sci. Data.
            </a>
          </div>
        )}


        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => setIsLegendOpen(true)} color="light">
            <IonIcon icon={layersOutline} />
          </IonFabButton>
        </IonFab>

        <IonModal
          ref={modalRef}
          isOpen={isLegendOpen}
          onDidDismiss={() => setIsLegendOpen(false)}
          initialBreakpoint={0.26}
          breakpoints={[0, 0.26, 1]}
          handleBehavior="cycle"
          color='#050404'
        >

          <IonContent className="ion-padding">
            {/* Layer Toggles */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              gap: '12px',        // Consistent spacing between buttons
              paddingTop: '8px',  // Reduced top padding
              paddingBottom: '4px', // Minimal bottom padding
              width: '100%'
            }}>
              <MapLayerButton
                icon={analyticsOutline}
                title="Fay Hatları"
                isActive={layerVisibility.faultLines}
                onClick={() => handleLayerToggle('faultLines', 0)}
                isLoading={isFaultsLoading}
              />

              <MapLayerButton
                icon={contractOutline}
                title="Levha Sınırları"
                isActive={layerVisibility.boundaries}
                onClick={() => handleLayerToggle('boundaries', 1)}
              />

              <MapLayerButton
                icon={globeOutline}
                title="Tektonik Levhalar"
                isActive={layerVisibility.plates}
                onClick={() => handleLayerToggle('plates', 2)}
              />
            </div>

            {/* Button to expand modal to show info section */}
            <div style={{ padding: '12px 8px' }}>
              <IonButton

                expand="block"
                color='dark'
                fill='outline'
                onClick={showLayerDetails}
              >
                Katman Bilgileri
              </IonButton>
            </div>

            {/* Informational Swiper */}
            <Swiper
              onSwiper={setSwiperInstance}
              modules={[Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={20}
              slidesPerView={1}
            >
              <SwiperSlide>
                <FaultLinesInfo />
              </SwiperSlide>

              <SwiperSlide>
                <PlateBoundariesInfo />
              </SwiperSlide>

              <SwiperSlide>
                <TectonicPlatesInfo />
              </SwiperSlide>
            </Swiper>
          </IonContent>
        </IonModal>
      </IonContent >
    </IonPage >
  );
};

export default MapTab;