import React from 'react';

const visualsData = [
    {
        title: 'Yerkabuğu Bir Yapbozdur',
        description: 'Litosfer (yerkabuğu), bir bütün değildir. Sürekli hareket eden ve birbirini etkileyen tektonik levhalardan oluşur.',
        visual: (
            <svg width="120" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <clipPath id="circleClip">
                        <circle cx="50" cy="50" r="48" />
                    </clipPath>
                </defs>
                <circle cx="50" cy="50" r="48" fill="#333" stroke="#888" strokeWidth="2" />
                <g clipPath="url(#circleClip)">
                    <path d="M 50 0 C 30 30, 70 70, 50 100" fill="none" stroke="#f7f1eb" strokeWidth="2.5" />
                    <path d="M 20 10 C 10 50, 20 90, 80 90 C 90 50, 80 10, 20 10" fill="none" stroke="#f7f1eb" strokeWidth="2.5" strokeDasharray="5 3" />
                    <path d="M 0 40 C 30 30, 70 50, 100 60" fill="none" stroke="#f7f1eb" strokeWidth="2.5" />
                </g>
            </svg>
        )
    },
    {
        title: 'Levhaları Hareket Ettiren Güç',
        description: 'Manto\'daki sıcak magma akımları (konveksiyon), üzerlerindeki plakaları yavaşça sürükleyerek depremlerin ana nedenini oluşturur.',
        visual: (
            <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <marker id="arrowV2" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#f7f1eb" />
                    </marker>
                </defs>
                <text x="60" y="73" fill="#b5b0aa" textAnchor="middle" fontSize="10">Manto</text>
                <path d="M 60 30 C 80 30, 80 55, 60 55" fill="none" stroke="#FF9100" strokeWidth="2" markerEnd="url(#arrowV2)" />
                <path d="M 60 55 C 40 55, 40 30, 60 30" fill="none" stroke="#FF9100" strokeWidth="2" markerEnd="url(#arrowV2)" />
            </svg>
        )
    }
];

const TectonicPlatesInfo: React.FC = () => {
    const visualsRowStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: '10px'
    };

    const visualContainerStyle: React.CSSProperties = {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent: 'flex-start',
        backgroundColor: '#171514',
        borderRadius: '8px',
        padding: '12px',
        textAlign: 'left',
        minHeight: '220px'
    };

    return (
        <div style={{ padding: '16px', paddingTop: '0px' }}>
            <h3 style={{ marginTop: 0, fontSize: '1.6rem' }}>Tektonik Levhalar</h3>
            <div style={visualsRowStyle}>
                {visualsData.map((visual, index) => (
                    <div key={index} style={visualContainerStyle}>
                        {visual.visual}
                        <h4 style={{ fontSize: '1rem', color: '#f7f1eb', marginTop: '18px', marginBottom: '4px' }}>
                            {visual.title}
                        </h4>
                        <p style={{ fontSize: '0.9rem', color: '#b5b0aa', marginTop: '18px', marginBottom: '4px', lineHeight: 1.4 }}>
                            {visual.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TectonicPlatesInfo;