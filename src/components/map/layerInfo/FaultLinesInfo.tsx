import React from 'react';

// --- Helper function to darken colors ---
const adjustColor = (hex: string, percent: number): string => {
    const f = parseInt(hex.slice(1), 16);
    const t = percent < 0 ? 0 : 255;
    const p = percent < 0 ? percent * -1 : percent;
    const R = f >> 16;
    const G = (f >> 8) & 0x00FF;
    const B = f & 0x0000FF;
    const newR = Math.round((t - R) * p) + R;
    const newG = Math.round((t - G) * p) + G;
    const newB = Math.round((t - B) * p) + B;
    return `#${(0x1000000 + (newR << 16) + (newG << 8) + newB).toString(16).slice(1).toUpperCase()}`;
};

const legendData = [
    { text: 'Normal Fay', baseColor: '#00B0FF' },
    { text: 'Ters Fay (Reverse)', baseColor: '#F50057' },
    { text: 'Bindirme Fayı (Thrust)', baseColor: '#D500F9' },
    { text: 'Genişlemeli Kırık (Extensional)', baseColor: '#00E676' },
    { text: 'Sağ Yanal (Dextral)', baseColor: '#FF9100' },
    { text: 'Sol Yanal (Sinistral)', baseColor: '#009688' }
];

const FaultLinesInfo: React.FC = () => {
    return (
        <div style={{ padding: '16px', paddingTop: '0px' }}>
            <h3 style={{ marginTop: 0, fontSize: '1.6rem' }}>Fay Hatları</h3>
            <p style={{ fontSize: '1rem', color: '#b5b0aa', marginTop: '-4px', paddingBottom: '24px' }}>
                Çizginin <strong>rengi</strong> fayın türünü, <strong>parlaklığı</strong> ise aktivite hızını (Yüksek, Orta, Düşük) gösterir.
            </p>

            {legendData.map(item => (
                <div
                    key={item.text}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '20px',
                        backgroundColor: '#171514',
                        borderRadius: '6px',
                        padding: '12px',
                        boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.2), 0px 4px 4px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <div style={{ flex: 1, minWidth: 0, paddingRight: '10px' }}>
                        <span style={{ fontSize: '1rem' }}>{item.text}</span>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div
                            title="Yüksek Aktivite"
                            style={{
                                width: '30px',
                                height: '10px',
                                backgroundColor: item.baseColor,
                                borderTopLeftRadius: '4px',
                                borderBottomLeftRadius: '4px'
                            }}
                        />
                        <div
                            title="Orta Aktivite"
                            style={{
                                width: '30px',
                                height: '10px',
                                backgroundColor: adjustColor(item.baseColor, -0.3)
                            }}
                        />
                        <div
                            title="Düşük Aktivite"
                            style={{
                                width: '30px',
                                height: '10px',
                                backgroundColor: adjustColor(item.baseColor, -0.5),
                                borderTopRightRadius: '4px',
                                borderBottomRightRadius: '4px'
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FaultLinesInfo;