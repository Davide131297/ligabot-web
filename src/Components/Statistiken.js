import { DonutChart } from '@mantine/charts';
import React, { useState, useEffect } from 'react';
import { db } from './../utils/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Table } from 'react-bootstrap';
import { SimpleGrid } from '@mantine/core';

const Statistiken = ({ ligaName, fahrerlistenObjekt }) => {
    const [poleData, setPoleData] = useState([]);
    const [fastestLapData, setFastestLapData] = useState([]);
    const [driverOfTheDayData, setDriverOfTheDayData] = useState([]);
    const teamColors = {
        'Ferrari': '#FF0000',
        'Mercedes': '#788086',
        'McLaren': '#fc8404',
        'RedBull': 'darkblue',
        'Alpine': '#ff82ab',
        'VisaRB': '#040505',
        'AstonMartin': '#008B00',
        'KickSauber': '#006b00',
        'Haas': 'red',
        'Williams': '#049cdc'
    };

    useEffect(() => {
        // Stellen Sie sicher, dass fahrerlistenObjekt nicht null oder undefined ist
        const safeFahrerlistenObjekt = fahrerlistenObjekt || {};
        const transformedData = Object.entries(safeFahrerlistenObjekt).map(([name, details], index) => {
            const poleCount = Object.values(details.Pole || {}).filter(isPole => isPole).length;
            const team = details.team;
            const color = teamColors[team] || `hsl(${index * 360 / Object.keys(safeFahrerlistenObjekt).length}, 70%, 50%)`;
            return {
                name: name,
                value: poleCount,
                color: color
            };
        }).filter(data => data.value > 0);
        setPoleData(transformedData);
    }, [ligaName, fahrerlistenObjekt, teamColors]);

    useEffect(() => {
        // Stellen Sie sicher, dass fahrerlistenObjekt nicht null oder undefined ist
        const safeFahrerlistenObjekt = fahrerlistenObjekt || {};
        const transformedData = Object.entries(safeFahrerlistenObjekt).map(([name, details], index) => {
            const SchnellsteRunde = Object.values(details.SchnellsteRunde || {}).filter(SchnellsteRunde => SchnellsteRunde).length;
            const team = details.team;
            const color = teamColors[team] || `hsl(${index * 360 / Object.keys(safeFahrerlistenObjekt).length}, 70%, 50%)`;
            return {
                name: name,
                value: SchnellsteRunde,
                color: color
            };
        }).filter(data => data.value > 0);
        setFastestLapData(transformedData);
    }, [ligaName, fahrerlistenObjekt, teamColors]);

    useEffect(() => {
        // Stellen Sie sicher, dass fahrerlistenObjekt nicht null oder undefined ist
        const safeFahrerlistenObjekt = fahrerlistenObjekt || {};
        const transformedData = Object.entries(safeFahrerlistenObjekt).map(([name, details], index) => {
            const FahrerDesTages = Object.values(details.FahrerDesTages || {}).filter(FahrerDesTages => FahrerDesTages).length;
            const team = details.team;
            const color = teamColors[team] || `hsl(${index * 360 / Object.keys(safeFahrerlistenObjekt).length}, 70%, 50%)`;
            return {
                name: name,
                value: FahrerDesTages,
                color: color
            };
        }).filter(data => data.value > 0);
        setDriverOfTheDayData(transformedData);
    }, [ligaName, fahrerlistenObjekt, teamColors]);



    return (
        <>
            <SimpleGrid cols={3}>
                <div>
                    <DonutChart
                        withLabelsLine
                        withLabels
                        radius={60}
                        data={poleData}
                        style={{ width: '100%', maxWidth: '200px' }}
                    />
                    <Table striped bordered hover size="sm" style={{ width: '100%', maxWidth: '200px' }}>
                        <thead>
                            <tr>
                                <th>Fahrer</th>
                                <th>Pole</th>
                                <th>Farbe</th>
                            </tr>
                        </thead>
                        <tbody>
                            {poleData.map(({ name, value, color }) => (
                                <tr key={name}>
                                    <td>{name}</td>
                                    <td>{value}</td>
                                    <td>
                                        <div style={{ backgroundColor: color, width: '20px', height: '20px', borderRadius: '50%' }}></div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
                <div>
                    <DonutChart
                        withLabelsLine
                        withLabels
                        radius={60}
                        data={fastestLapData}
                        style={{ width: '100%', maxWidth: '200px' }}
                    />
                    <Table striped bordered hover size="sm" style={{ width: '100%', maxWidth: '200px' }}>
                        <thead>
                            <tr>
                                <th>Fahrer</th>
                                <th>Pole</th>
                                <th>Farbe</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fastestLapData.map(({ name, value, color }) => (
                                <tr key={name}>
                                    <td>{name}</td>
                                    <td>{value}</td>
                                    <td>
                                        <div style={{ backgroundColor: color, width: '20px', height: '20px', borderRadius: '50%' }}></div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
                <div>
                    <DonutChart
                        withLabelsLine
                        withLabels
                        radius={60}
                        data={driverOfTheDayData}
                        style={{ width: '100%', maxWidth: '200px' }}
                    />
                    <Table striped bordered hover size="sm" style={{ width: '100%', maxWidth: '200px' }}>
                        <thead>
                            <tr>
                                <th>Fahrer</th>
                                <th>Pole</th>
                                <th>Farbe</th>
                            </tr>
                        </thead>
                        <tbody>
                            {driverOfTheDayData.map(({ name, value, color }) => (
                                <tr key={name}>
                                    <td>{name}</td>
                                    <td>{value}</td>
                                    <td>
                                        <div style={{ backgroundColor: color, width: '20px', height: '20px', borderRadius: '50%' }}></div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </SimpleGrid>
        </>
    );
}
export default Statistiken;