import { DonutChart } from '@mantine/charts';
import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { SimpleGrid, Center } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import './Statistiken.css';

const Statistiken = ({ ligaName, fahrerlistenObjekt, teamsArray }) => {
    const [poleData, setPoleData] = useState([]);
    const [fastestLapData, setFastestLapData] = useState([]);
    const [driverOfTheDayData, setDriverOfTheDayData] = useState([]);
    const [teamData, setTeamData] = useState([]);
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
    const matches = useMediaQuery('(max-width: 768px)');


    useEffect(() => {
        // Stellen Sie sicher, dass fahrerlistenObjekt nicht null oder undefined ist
        const safeFahrerlistenObjekt = fahrerlistenObjekt || {};
        const poleData = [];
        const fastestLapData = [];
        const driverOfTheDayData = [];

        Object.entries(safeFahrerlistenObjekt).forEach(([name, details], index) => {
            const poleCount = Object.values(details.Pole || {}).filter(isPole => isPole).length;
            const SchnellsteRunde = Object.values(details.SchnellsteRunde || {}).filter(SchnellsteRunde => SchnellsteRunde).length;
            const FahrerDesTages = Object.values(details.FahrerDesTages || {}).filter(FahrerDesTages => FahrerDesTages).length;
            const team = details.team;
            const color = teamColors[team] || `hsl(${index * 360 / Object.keys(safeFahrerlistenObjekt).length}, 70%, 50%)`;

            if (poleCount > 0) {
                poleData.push({ name, value: poleCount, color });
            }
            if (SchnellsteRunde > 0) {
                fastestLapData.push({ name, value: SchnellsteRunde, color });
            }
            if (FahrerDesTages > 0) {
                driverOfTheDayData.push({ name, value: FahrerDesTages, color });
            }
        });

        setPoleData(poleData);
        setFastestLapData(fastestLapData);
        setDriverOfTheDayData(driverOfTheDayData);
    }, [ligaName, fahrerlistenObjekt]);

    useEffect(() => {
        if (!teamsArray) return;
        const chartData = teamsArray.map(team => {
            return {
                name: team.teamName,
                value: team.gesamtWertung,
                color: teamColors[team.teamName] || 'gray'
            };
        });
        setTeamData(chartData);
    }, [teamsArray]);

    return (
        <>
            <SimpleGrid cols={matches ? 2 : 4}>
                <div>
                    <Center style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <DonutChart
                            withLabelsLine
                            withLabels
                            chartLabel="Poles"
                            data={poleData}
                            strokeWidth={2}
                            size={matches ? 130 : 150} thickness={matches ? 12: 15}
                        />
                        <Table striped bordered hover size="sm" className='StatisticTable'>
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
                    </Center>
                </div>
                <div>
                    <DonutChart
                        withLabelsLine
                        withLabels
                        chartLabel="Fastest Lap"
                        data={fastestLapData}
                        strokeWidth={2}
                        size={matches ? 130 : 150} thickness={matches ? 12: 15}
                    />
                    <Table striped bordered hover size="sm" className='StatisticTable'>
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
                        chartLabel="Fahrer des Tages"
                        data={driverOfTheDayData}
                        strokeWidth={2}
                        size={matches ? 130 : 150} thickness={matches ? 12: 15}
                    />
                    <Table striped bordered hover size="sm" className='StatisticTable'>
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
                <div>
                    <DonutChart
                        withLabelsLine
                        withLabels
                        data={teamData}
                        chartLabel="Team Punkte"
                        strokeWidth={2}
                        size={matches ? 130 : 150} thickness={matches ? 12: 15}
                    />
                    <Table striped bordered hover size="sm" className='StatisticTable'>
                        <thead>
                            <tr>
                                <th>Fahrer</th>
                                <th>Punkte</th>
                                <th>Farbe</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teamData.map(({ name, value, color }) => (
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