import React from 'react';
import { IonIcon, IonSpinner } from '@ionic/react';

interface MapLayerButtonProps {
    icon: string;
    title: string;
    isActive: boolean;
    onClick: () => void;
    isLoading?: boolean;
}

const MapLayerButton: React.FC<MapLayerButtonProps> = ({ icon, title, isActive, onClick, isLoading = false }) => {

    // --- Style for the main container ---
    const squareStyle: React.CSSProperties = {
        position: 'relative',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        flex: 1,
        aspectRatio: '1 / 1',
        maxWidth: '104px',
        width: '100%',
        minWidth: '80px',
        padding: '4px',
        backgroundColor: '#2c2c2e', borderRadius: '12px',
        cursor: 'pointer', transition: 'all 0.2s ease-in-out', opacity: 0.5, border: '1px solid #444',
    };

    const activeSquareStyle: React.CSSProperties = {
        opacity: 1, backgroundColor: '#3a3a3c', transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    };

    const titleStyle: React.CSSProperties = {

        fontSize: 'clamp(0.6rem, 3vw, 0.72rem)',
        color: '#f2f2f7', fontWeight: 500, textAlign: 'center',
        lineHeight: '1.2',
        width: '100%',
    };

    // A container to hold the icon and spinner in the same spot.
    const iconContainerStyle: React.CSSProperties = {
        position: 'relative',
        // Relative sizes instead of fixed rems
        width: '30%',
        height: '30%',
        marginBottom: '8px', // Slightly reduced spacing
    };

    // Shared styles for both the icon and the spinner
    const sharedIconSpinnerStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
    };

    const iconStyle: React.CSSProperties = {
        ...sharedIconSpinnerStyle,
        opacity: isLoading ? 0 : 1,
        transform: isLoading ? 'scale(0.5)' : 'scale(1)',
        color: isActive ? '#00aaff' : '#c7c7cc',
    };

    const spinnerStyle: React.CSSProperties = {
        ...sharedIconSpinnerStyle,
        opacity: isLoading ? 1 : 0,
        transform: isLoading ? 'scale(1)' : 'scale(0.5)',
        color: '#00aaff',
    };

    const combinedSquareStyle = { ...squareStyle, ...(isActive && activeSquareStyle) };

    return (
        <div style={combinedSquareStyle} onClick={onClick}>
            <div style={iconContainerStyle}>
                <IonIcon icon={icon} style={iconStyle} />
                <IonSpinner name="crescent" style={spinnerStyle} />
            </div>
            <span style={titleStyle}>{title}</span>
        </div>
    );
};

export default MapLayerButton;