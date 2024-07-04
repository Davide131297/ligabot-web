import React, { useEffect } from 'react';
import { Center } from '@mantine/core';
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
import { doc, getDoc } from "firebase/firestore";
import { db } from './../../utils/firebase';

import { Link } from '@mantine/tiptap';
import { EditorContent, useEditor,  } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import Placeholder from '@tiptap/extension-placeholder';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Image } from '@tiptap/extension-image';
import { Youtube } from '@tiptap/extension-youtube';

const LigaSeite = () => {
    const location = useLocation();
    const path = location.pathname.split("/");
    const ligaName = path[1];
    const matches = useMediaQuery('(max-width: 768px)');
    const [data, setData] = React.useState({});

    const editor = useEditor({
        extensions: [
          StarterKit,
          Underline,
          Link,
          Superscript,
          SubScript,
          Highlight,
          TextStyle,
          Color, 
          Image.configure({
            inline: true,
            HTMLAttributes: {
                alt: 'Ligastartseite',
                style: 'width: 100px; height: auto;',
            },
          }),
          Youtube.configure({
            inline: true,
            nocookie: true,
            autoplay: true,
            interfaceLanguage: 'de',
          }),
          TextAlign.configure({ types: ['heading', 'paragraph'] }),
          Placeholder.configure({ placeholder: 'Hier kannst du die Ligastartseite anpassen.' })
        ],
        content: data.content ? data.content : '',
        editable: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            if (ligaName) {
                console.log("Liganame: ", ligaName);
                const docRef = doc(db, ligaName, "Ligastartseite");
                try {
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setData(data);
                        console.log("Daten für die Startseite: ", data);
                        if (editor && editor.commands && typeof editor.commands.setContent === 'function') {
                            editor.commands.setContent(data.content ? data.content : '');
                        } else {
                            console.log("editor.setContent ist keine Funktion. Überprüfen Sie die Initialisierung von 'useEditor'.");
                        }
                    } else {
                        console.log("Kein Dokument gefunden für: ", ligaName);
                    }
                } catch (error) {
                    console.error("Fehler beim Abrufen des Dokuments: ", error);
                }
            }
        };

        fetchData();
    }, [ligaName, editor]);

    return (
        <>
            {data && editor && (
            <Center>
                <EditorContent editor={editor} />
            </Center>
            )}
        </>
    );
}
export default LigaSeite;