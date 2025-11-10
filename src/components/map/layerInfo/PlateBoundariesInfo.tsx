import React from 'react';

const boundaryLegendData = [
    {
        name: 'Yakınlaşan Levha Sınırı',
        description: 'İki tektonik levhanın birbiriyle çarpıştığı sınırlardır. Bu çarpışma, bir levhanın diğerinin altına dalmasına (dalma-batma) veya dağ sıralarının oluşumuna yol açar.',
        color: '#FF0000',
    },
    {
        name: 'Uzaklaşan ve Yanal Sınırlar',
        description: 'Levhaların birbirinden ayrıldığı (uzaklaşan) veya birbirine paralel olarak zıt yönlerde kaydığı (yanal) sınırlardır. Depremler bu sınırlarda yaygındır.',
        color: '#0000FF',
    }
];

const PlateBoundariesInfo: React.FC = () => {
    return (
        <div style={{ padding: '16px', paddingTop: '0px' }}>
            <h3 style={{ marginTop: 0, fontSize: '1.6rem' }}>Levha Sınırları</h3>
            <p style={{ fontSize: '1rem', color: '#b5b0aa', marginTop: '-4px', paddingBottom: '24px' }}>
                Levha sınırlarının rengi, levha hareketinin türünü gösterir.
            </p>
            {boundaryLegendData.map(item => (
                <div
                    key={item.name}
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
                    <div
                        style={{
                            width: '8px',
                            height: '40px',
                            backgroundColor: item.color,
                            borderRadius: '4px',
                            marginRight: '16px',
                            flexShrink: 0
                        }}
                    />
                    <div>
                        <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{item.name}</span>
                        <p style={{ fontSize: '0.9rem', color: '#b5b0aa', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                            {item.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PlateBoundariesInfo;