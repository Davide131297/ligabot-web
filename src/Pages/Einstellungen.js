import { db } from './../utils/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const Einsteöllungen = () => {  

    const [DiscordServer, setDiscordServer] = useState([]);
    const [Liga, setLiga] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [nutzerDaten, setNutzerDaten] = useState([]);

    useEffect(() => {
        const discordServerRef = collection(db, 'discordServers');
        const ligaKeysRef = collection(db, 'ligaKeys');
        const unsubscribeDiscord = onSnapshot(discordServerRef, (snapshot) => {
            let discordServerList = [];
            snapshot.forEach((doc) => {
                discordServerList.push(doc.data());
            });
            setDiscordServer(discordServerList);
        });

        const unsubscribeLiga = onSnapshot(ligaKeysRef, (snapshot) => {
            let ligaList = [];
            snapshot.forEach((doc) => {
                ligaList.push(doc.data());
            });
            setLiga(ligaList);
        });

        const localUser = JSON.parse(localStorage.getItem('user'));
        if (localUser) {
            setUser(localUser.displayName);
        }

        return () => {
            unsubscribeDiscord();
            unsubscribeLiga();
        };
    }, []);

    useEffect(() => {
        if (DiscordServer && Liga && user) {
            handlepairing();
        }
    }, [DiscordServer, Liga, user]);

    useEffect(() => {
        if (nutzerDaten) {
            console.log(nutzerDaten);
        }
    }, [nutzerDaten]);

    function handlepairing() {
        const NutzerDaten = {
            LigaZugehörigkeit: Liga.find(Liga => Liga.adminUser === user),
            DiscordServerZugehörigkeit: DiscordServer.find(DiscordServer => DiscordServer.ligaKey === Liga.find(Liga => Liga.key).key)
        };
        setNutzerDaten(NutzerDaten);
    }

    return (
        <div>
        <h1>Einstellungen</h1>
        </div>
    );
}
export default Einsteöllungen;