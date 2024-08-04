import React, { useEffect, useState } from 'react';
import F1Logo from './F1Logo.png';
import BackgroundBlack from './BackgroundBlack.png';

import AbuDhabi from '../Länderflaggen/abudhabi.png';
import Aserbaidschan from '../Länderflaggen/aserbaidschan.png';
import Australien from '../Länderflaggen/australien.png';
import Bahrain from '../Länderflaggen/bahrain.png';
import Belgien from '../Länderflaggen/belgien.png';
import Brasilien from '../Länderflaggen/brasilien.png';
import China from '../Länderflaggen/china.png';
import Großbritannien from '../Länderflaggen/großbritannien.png';
import Italien from '../Länderflaggen/italien.png';
import Japan from '../Länderflaggen/japan.png';
import Kanada from '../Länderflaggen/kanada.png';
import Katar from '../Länderflaggen/katar.png';
import Mexiko from '../Länderflaggen/mexiko.png';
import Monaco from '../Länderflaggen/monaco.png';
import Niederlande from '../Länderflaggen/niederlande.png';
import Österreich from '../Länderflaggen/österreich.png';
import SaudiArabien from '../Länderflaggen/saudiarabien.png';
import Singapur from '../Länderflaggen/singapur.png';
import Spanien from '../Länderflaggen/spanien.png';
import Ungarn from '../Länderflaggen/ungarn.png';
import USA from '../Länderflaggen/usa.png';

const RenderCalendar = ({calendarData}) => {

    const [f1Calendar, setF1Calendar] = useState([]);

    useEffect(() => {
        if (calendarData) {
            const f1Calendar = calendarData.filter((item) => item.Visible === true);
            console.log("F1 Calendar: ", f1Calendar);
            setF1Calendar(f1Calendar);
        }
    }, [calendarData]);

    const flaggen = {   
        AbuDhabi,
        Aserbaidschan,
        Australien,
        Bahrain,
        Belgien,
        Brasilien,
        China,
        Großbritannien,
        Italien,
        Japan,
        Kanada,
        Katar,
        Mexiko,
        Monaco,
        Niederlande,
        Österreich,
        SaudiArabien,
        Singapur,
        Spanien,
        Ungarn,
        USA
    };

    function getFlagByCountryName(countryName) {
        if (countryName === "Imola" || countryName === "Monza") {
            countryName = "Italien";
        }
        if (countryName === "Miami" || countryName === "LasVegas" || countryName === "Austin") {
            countryName = "USA";
        }
        return flaggen[countryName] || null;
    }

    function itemNameFontSize(itemName) {
        if (itemName.length <= 10) {
            return '625px';
        } else if (itemName.length > 10 && itemName.length <= 12) {
            return '550px';
        } else if (itemName.length > 12 && itemName.length <= 15) {
            return '500px';
        }
    }

    function roundNumberFontSize(roundNumber) {
        console.log("Round Number: ", roundNumber);
        const length = roundNumber.toString().length;
        if (length === 1) {
            return '833.333px';
        } else if (length === 2) {
            return '725px';
        }
        return '500px'; // Fallback für andere Längen
    }

    function roundNumberPosition(roundNumber) {
        if (roundNumberFontSize(roundNumber) === '833.333px') {
            return "15469.5px";
        } else {
            return "15269.5px";
        }
    }

    return (
        <div>
            {f1Calendar && f1Calendar.length > 0 ? (
                <svg 
                    width="100%" 
                    height="100%" 
                    viewBox="0 0 33668 18750" // Erhöht, um Platz für beide Reihen zu schaffen
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                        fillRule: 'evenodd',
                        clipRule: 'evenodd',
                        strokeLinejoin: 'round',
                        strokeMiterlimit: 2
                    }}
                >
                    {/* Hintergrundrechteck */}
                    <rect id="Hintergrund" x="0" y="0" width="66667" height="18750"/>
    
                    {f1Calendar.length > 12 && (
                        <>
                            {/* Kalender-Einträge 0 bis 11 */}
                            {f1Calendar.slice(0, 12).map((item, index) => (
                                <g 
                                    id={`Feld${index + 1}`} 
                                    key={index} 
                                    transform={`translate(0, ${index * 1450})`}
                                >
                                    <path 
                                        id={`StreckeHintergrund${index + 1}`} 
                                        d="M17119.4,820.189c31.691,-1.375 63.383,-3.959 95.075,-3.963c2116.75,-0.192 4233.5,-0.179 6350.25,-0.179l102.779,-0c-0,175.037 0.004,341.854 -0,508.671c-0.004,150.321 -0.638,300.646 0.108,450.962c1.304,263.029 -134.366,400.879 -399.571,400.913c-2119.64,0.275 -4239.29,0.033 -6365.54,-6.367c56.646,-56.279 134.45,-86.242 174.783,-167.012c21.296,-42.65 69.888,-71.675 106.154,-106.85c5.979,4.841 11.959,9.683 17.934,14.525c-26.284,-4.271 -52.571,-8.542 -78.209,-12.705c-2.754,-13.45 -5.929,-21.741 -5.937,-30.037c-0.221,-245.038 -2.271,-490.121 2.804,-735.058c0.592,-28.65 40.779,-56.48 53.067,-72.359c-47.071,9.463 -62.467,-30.237 -56.659,-93.804c4.438,-48.596 2.204,-97.8 2.938,-146.737m6495.21,282.445c1.175,-1.045 2.35,-2.091 0,0m-37.233,-43.395c-1.384,2.05 -2.767,4.1 -4.154,6.15c2.479,-0.817 4.966,-1.634 4.154,-6.15m36.958,-37.263c1.692,-2.004 3.388,-4.008 5.079,-6.012c-1.721,0.408 -3.441,0.816 -5.079,6.012Z" 
                                        style={{ fill: '#ebeaea', fillRule: 'nonzero' }}
                                    />
                                    <g 
                                        id={`DatumStrecke${index + 1}`} 
                                        transform="matrix(1,0,0,0.802566,3.63798e-12,255.719)"
                                    >
                                        <text 
                                            x="20254.1px" 
                                            y="1295.21px" 
                                            style={{ fontFamily: "'Avenir-BlackOblique', 'Avenir', sans-serif", fontWeight: 800, fontStyle: 'italic', fontSize: '605.696px', fill: '#818181', fillOpacity: 0.55 }}
                                        >
                                            {item.datum}
                                        </text>
                                    </g>
                                    <use 
                                        id={`FlaggePlaceholder${index + 1}`} 
                                        href={`#_Flag${index + 1}`} 
                                        x="0" 
                                        y="0" 
                                        width="275px" 
                                        height="183px" 
                                        transform="matrix(5.68182,0,0,5.12295,17329.6,1007.95)"
                                    />
                                    <text 
                                        id={`Track${index + 1}`} 
                                        x="19400px" 
                                        y="1943.74px" 
                                        style={{ fontFamily: "'Arial-Black', 'Arial Black', sans-serif", fontWeight: 900, fontSize: itemNameFontSize(item.name), fill: '#ff0100' }}
                                    >
                                        {item.name}
                                    </text>
                                    <path 
                                        d="M16723.6,2176.66c204.571,-60.55 294.029,-173.342 295.404,-394.071c1.984,-317.6 0.046,-635.225 -1.175,-960.621c32.546,-7.883 66.05,-7.983 107.3,-5.4c7.009,51.617 9.246,100.825 4.809,149.421c-5.813,63.566 9.583,103.266 56.654,93.804c-12.288,15.875 -52.475,43.708 -53.067,72.358c-5.071,244.934 -3.025,490.021 -2.804,735.059c0.008,8.291 3.183,16.583 5.937,30.037c25.638,4.163 51.925,8.433 78.209,12.7c-5.975,-4.842 -11.954,-9.683 -17.934,-14.525c-36.266,35.179 -84.858,64.2 -106.154,106.854c-40.333,80.771 -118.137,110.734 -182.704,166.138c-59.75,6.491 -118.179,7.537 -184.475,8.246Z" 
                                        style={{ fill: '#a7a6a6', fillRule: 'nonzero' }}
                                    />
                                    <path 
                                        d="M16752,2180.39c-572.27,-0.2 -1144.54,-0.38 -1716.8,-0.892c-8.154,-0.008 -16.308,-4.271 -30.812,-8.321l-0,-1355.13c677.691,-0 1355.73,-0 2042.21,8.883c8.721,326.5 10.659,644.125 8.675,961.725c-1.375,220.729 -90.833,333.521 -303.271,393.734" 
                                        style={{ fill: '#dc0903', fillRule: 'nonzero' }}
                                    />
                                    <g 
                                        id={`R${index + 1}`} 
                                        transform="matrix(0.999929,0,0,1,1.09833,2.27374e-13)"
                                    >
                                        <g 
                                            transform="matrix(833.333,0,0,833.333,16673.5,1801.56)"
                                        >
                                        </g>
                                        <text 
                                            x={roundNumberPosition(index + 1)} 
                                            y="1801.56px" 
                                            style={{ fontFamily: "'Arial-Black', 'Arial Black', sans-serif", fontWeight: 900, fontSize: roundNumberFontSize(index + 1), fill: '#fff' }}
                                        >
                                            R{index + 1}
                                        </text>
                                    </g>
                                </g>
                            ))}
            
                            {/* Kalender-Einträge 12 bis 23, leicht nach rechts verschoben */}
                            {f1Calendar.slice(12, 24).map((item, index) => (
                                <g 
                                    id={`Feld${index + 13}`} 
                                    key={index + 12} 
                                    transform={`translate(9000, ${index * 1450})`} // Horizontaler Versatz für die zweite Reihe
                                >
                                    <path 
                                        id={`StreckeHintergrund${index + 13}`} 
                                        d="M17119.4,820.189c31.691,-1.375 63.383,-3.959 95.075,-3.963c2116.75,-0.192 4233.5,-0.179 6350.25,-0.179l102.779,-0c-0,175.037 0.004,341.854 -0,508.671c-0.004,150.321 -0.638,300.646 0.108,450.962c1.304,263.029 -134.366,400.879 -399.571,400.913c-2119.64,0.275 -4239.29,0.033 -6365.54,-6.367c56.646,-56.279 134.45,-86.242 174.783,-167.012c21.296,-42.65 69.888,-71.675 106.154,-106.85c5.979,4.841 11.959,9.683 17.934,14.525c-26.284,-4.271 -52.571,-8.542 -78.209,-12.705c-2.754,-13.45 -5.929,-21.741 -5.937,-30.037c-0.221,-245.038 -2.271,-490.121 2.804,-735.058c0.592,-28.65 40.779,-56.48 53.067,-72.359c-47.071,9.463 -62.467,-30.237 -56.659,-93.804c4.438,-48.596 2.204,-97.8 2.938,-146.737m6495.21,282.445c1.175,-1.045 2.35,-2.091 0,0m-37.233,-43.395c-1.384,2.05 -2.767,4.1 -4.154,6.15c2.479,-0.817 4.966,-1.634 4.154,-6.15m36.958,-37.263c1.692,-2.004 3.388,-4.008 5.079,-6.012c-1.721,0.408 -3.441,0.816 -5.079,6.012Z" 
                                        style={{ fill: '#ebeaea', fillRule: 'nonzero' }}
                                    />
                                    <g 
                                        id={`DatumStrecke${index + 13}`} 
                                        transform="matrix(1,0,0,0.802566,3.63798e-12,255.719)"
                                    >
                                        <text 
                                            x="20254.1px" 
                                            y="1295.21px" 
                                            style={{ fontFamily: "'Avenir-BlackOblique', 'Avenir', sans-serif", fontWeight: 800, fontStyle: 'italic', fontSize: '605.696px', fill: '#818181', fillOpacity: 0.55 }}
                                        >
                                            {item.datum}
                                        </text>
                                    </g>
                                    <use 
                                        id={`FlaggePlaceholder${index + 13}`} 
                                        href={`#_Flag${index + 13}`} 
                                        x="0" 
                                        y="0" 
                                        width="275px" 
                                        height="183px" 
                                        transform="matrix(5.68182,0,0,5.12295,17329.6,1007.95)"
                                    />
                                    <text 
                                        id={`Track${index + 13}`} 
                                        x="19400px" 
                                        y="1943.74px" 
                                        style={{ fontFamily: "'Arial-Black', 'Arial Black', sans-serif", fontWeight: 900, fontSize: itemNameFontSize(item.name), fill: '#ff0100' }}
                                    >
                                        {item.name}
                                    </text>
                                    <path 
                                        d="M16723.6,2176.66c204.571,-60.55 294.029,-173.342 295.404,-394.071c1.984,-317.6 0.046,-635.225 -1.175,-960.621c32.546,-7.883 66.05,-7.983 107.3,-5.4c7.009,51.617 9.246,100.825 4.809,149.421c-5.813,63.566 9.583,103.266 56.654,93.804c-12.288,15.875 -52.475,43.708 -53.067,72.358c-5.071,244.934 -3.025,490.021 -2.804,735.059c0.008,8.291 3.183,16.583 5.937,30.037c25.638,4.163 51.925,8.433 78.209,12.7c-5.975,-4.842 -11.954,-9.683 -17.934,-14.525c-36.266,35.179 -84.858,64.2 -106.154,106.854c-40.333,80.771 -118.137,110.734 -182.704,166.138c-59.75,6.491 -118.179,7.537 -184.475,8.246Z" 
                                        style={{ fill: '#a7a6a6', fillRule: 'nonzero' }}
                                    />
                                    <path 
                                        d="M16752,2180.39c-572.27,-0.2 -1144.54,-0.38 -1716.8,-0.892c-8.154,-0.008 -16.308,-4.271 -30.812,-8.321l-0,-1355.13c677.691,-0 1355.73,-0 2042.21,8.883c8.721,326.5 10.659,644.125 8.675,961.725c-1.375,220.729 -90.833,333.521 -303.271,393.734" 
                                        style={{ fill: '#dc0903', fillRule: 'nonzero' }}
                                    />
                                    <g 
                                        id={`R${index + 13}`} 
                                        transform="matrix(0.999929,0,0,1,1.09833,2.27374e-13)"
                                    >
                                        <g 
                                            transform="matrix(833.333,0,0,833.333,16673.5,1801.56)"
                                        >
                                        </g>
                                        <text 
                                            x={roundNumberPosition(index + 13)}
                                            y="1801.56px" 
                                            style={{ fontFamily: "'Arial-Black', 'Arial Black', sans-serif", fontWeight: 900, fontSize: roundNumberFontSize(index + 13), fill: '#fff' }}
                                        >
                                            R{index + 13}
                                        </text>
                                    </g>
                                </g>
                            ))}
                        </>
                    )}

                    {f1Calendar.length <= 12 && (
                        <>
                            {f1Calendar.slice(0, 12).map((item, index) => (
                                <g 
                                    id={`Feld${index + 1}`} 
                                    key={index} 
                                    transform={`translate(${(index % 2) * 9000}, ${Math.floor(index / 2) * 1450 + 4500})`} // Spalten anpassen
                                >
                                    <path 
                                        id={`StreckeHintergrund${index + 1}`} 
                                        d="M17119.4,820.189c31.691,-1.375 63.383,-3.959 95.075,-3.963c2116.75,-0.192 4233.5,-0.179 6350.25,-0.179l102.779,-0c-0,175.037 0.004,341.854 -0,508.671c-0.004,150.321 -0.638,300.646 0.108,450.962c1.304,263.029 -134.366,400.879 -399.571,400.913c-2119.64,0.275 -4239.29,0.033 -6365.54,-6.367c56.646,-56.279 134.45,-86.242 174.783,-167.012c21.296,-42.65 69.888,-71.675 106.154,-106.85c5.979,4.841 11.959,9.683 17.934,14.525c-26.284,-4.271 -52.571,-8.542 -78.209,-12.705c-2.754,-13.45 -5.929,-21.741 -5.937,-30.037c-0.221,-245.038 -2.271,-490.121 2.804,-735.058c0.592,-28.65 40.779,-56.48 53.067,-72.359c-47.071,9.463 -62.467,-30.237 -56.659,-93.804c4.438,-48.596 2.204,-97.8 2.938,-146.737m6495.21,282.445c1.175,-1.045 2.35,-2.091 0,0m-37.233,-43.395c-1.384,2.05 -2.767,4.1 -4.154,6.15c2.479,-0.817 4.966,-1.634 4.154,-6.15m36.958,-37.263c1.692,-2.004 3.388,-4.008 5.079,-6.012c-1.721,0.408 -3.441,0.816 -5.079,6.012Z" 
                                        style={{ fill: '#ebeaea', fillRule: 'nonzero' }}
                                    />
                                    <g 
                                        id={`DatumStrecke${index + 1}`} 
                                        transform="matrix(1,0,0,0.802566,3.63798e-12,255.719)"
                                    >
                                        <text 
                                            x="20254.1px" 
                                            y="1295.21px" 
                                            style={{ fontFamily: "'Avenir-BlackOblique', 'Avenir', sans-serif", fontWeight: 800, fontStyle: 'italic', fontSize: '605.696px', fill: '#818181', fillOpacity: 0.55 }}
                                        >
                                            {item.datum}
                                        </text>
                                    </g>
                                    <use 
                                        id={`FlaggePlaceholder${index + 1}`} 
                                        href={`#_Flag${index + 1}`} 
                                        x="0" 
                                        y="0" 
                                        width="275px" 
                                        height="183px" 
                                        transform="matrix(5.68182,0,0,5.12295,17329.6,1007.95)"
                                    />
                                    <text 
                                        id={`Track${index + 1}`} 
                                        x="19400px" 
                                        y="1943.74px" 
                                        style={{ fontFamily: "'Arial-Black', 'Arial Black', sans-serif", fontWeight: 900, fontSize: itemNameFontSize(item.name), fill: '#ff0100' }}
                                    >
                                        {item.name}
                                    </text>
                                    <path 
                                        d="M16723.6,2176.66c204.571,-60.55 294.029,-173.342 295.404,-394.071c1.984,-317.6 0.046,-635.225 -1.175,-960.621c32.546,-7.883 66.05,-7.983 107.3,-5.4c7.009,51.617 9.246,100.825 4.809,149.421c-5.813,63.566 9.583,103.266 56.654,93.804c-12.288,15.875 -52.475,43.708 -53.067,72.358c-5.071,244.934 -3.025,490.021 -2.804,735.059c0.008,8.291 3.183,16.583 5.937,30.037c25.638,4.163 51.925,8.433 78.209,12.7c-5.975,-4.842 -11.954,-9.683 -17.934,-14.525c-36.266,35.179 -84.858,64.2 -106.154,106.854c-40.333,80.771 -118.137,110.734 -182.704,166.138c-59.75,6.491 -118.179,7.537 -184.475,8.246Z" 
                                        style={{ fill: '#a7a6a6', fillRule: 'nonzero' }}
                                    />
                                    <path 
                                        d="M16752,2180.39c-572.27,-0.2 -1144.54,-0.38 -1716.8,-0.892c-8.154,-0.008 -16.308,-4.271 -30.812,-8.321l-0,-1355.13c677.691,-0 1355.73,-0 2042.21,8.883c8.721,326.5 10.659,644.125 8.675,961.725c-1.375,220.729 -90.833,333.521 -303.271,393.734" 
                                        style={{ fill: '#dc0903', fillRule: 'nonzero' }}
                                    />
                                    <g 
                                        id={`R${index + 1}`} 
                                        transform="matrix(0.999929,0,0,1,1.09833,2.27374e-13)"
                                    >
                                        <g 
                                            transform="matrix(833.333,0,0,833.333,16673.5,1801.56)"
                                        >
                                        </g>
                                        <text 
                                            x={roundNumberPosition(index + 1)} 
                                            y="1801.56px" 
                                            style={{ fontFamily: "'Arial-Black', 'Arial Black', sans-serif", fontWeight: 900, fontSize: roundNumberFontSize(index + 1), fill: '#fff' }}
                                        >
                                            R{index + 1}
                                        </text>
                                    </g>
                                </g>
                            ))}
                        </>
                    )}
    
                    {/* Andere SVG-Elemente wie Text für Kalenderjahr, Logo etc. */}
                    <text 
                        x="656.458px" 
                        y="14046.3px" 
                        style={{ fontFamily: "'Arial-Black', 'Arial Black', sans-serif", fontWeight: 900, fontSize: '2546.93px', fill: '#fff' }}
                    >
                        Kalender
                    </text>
    
                    <g id="Jahr">
                        <g transform="matrix(1,0,0,0.952306,1.13687e-13,564.048)">
                            <text 
                                x="719.125px" 
                                y="11826.4px" 
                                style={{ fontFamily: "'Arial-Black', 'Arial Black', sans-serif", fontWeight: 900, fontSize: '4792.33px', fill: '#fff' }}
                            >
                                2025
                            </text>
                        </g>
                    </g>
    
                    <use 
                        id="F1Logo" 
                        href="#_Image2" 
                        x="0" 
                        y="0" 
                        width="1024px" 
                        height="256px" 
                        transform="matrix(12.1799,0,0,12.0917,845.488,5121.54)"
                    />
    
                    <defs>
                        {f1Calendar.map((item, index) => (
                            <image 
                                key={index}
                                id={`_Flag${index + 1}`} 
                                width="275px" 
                                height="183px" 
                                href={getFlagByCountryName(item.name)}
                            />
                        ))}
                        <image 
                            id="_Image2" 
                            width="1024px" 
                            height="256px" 
                            href={F1Logo}
                        />
                    </defs>
                </svg>
            ) : (
                <p>Keine Daten vorhanden</p>
            )}
        </div>
    );    
}
export default RenderCalendar;