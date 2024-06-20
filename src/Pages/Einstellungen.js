import { db } from './../utils/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const Einsteöllungen = () => {  

    const [DiscordServer, setDiscordServer] = useState([]);
    const [Liga, setLiga] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));


    useEffect(() => {
        const discordServerRef = collection(db, 'discordServers');
        const unsubscribe = onSnapshot(discordServerRef, (snapshot) => {
            let discordServerList = [];
            snapshot.forEach((doc) => {
                discordServerList.push(doc.data());
            });
            setDiscordServer(discordServerList);
        });
    }, []);

    useEffect(() => {
    const ligaKeysRef = collection(db, 'ligaKeys');
        const unsubscribe = onSnapshot(ligaKeysRef, (snapshot) => {
            let ligaList = [];
            snapshot.forEach((doc) => {
                ligaList.push(doc.data());
            });
            setLiga(ligaList);
        });
    }, []);

    useEffect(() => {
        const localUser = JSON.parse(localStorage.getItem('user'));
        if (localUser) {
            setUser(localUser.displayName);
        }
    }, []);

    useEffect(() => {
        if (DiscordServer && Liga && user) {
        console.log("Discordserver", DiscordServer);
        console.log("Liga", Liga);
        console.log("User", user);
        }
    }, [DiscordServer, Liga, user]);

    return (
        <div>
        <h1>Einstellungen</h1>
        </div>
    );
}
export default Einsteöllungen;