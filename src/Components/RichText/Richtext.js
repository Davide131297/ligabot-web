import React, { useCallback } from 'react'
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import Placeholder from '@tiptap/extension-placeholder';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Image } from '@tiptap/extension-image';
import { CiImageOn } from "react-icons/ci";
import Youtube from '@tiptap/extension-youtube'
import { RiMovieLine } from "react-icons/ri";
import { db } from './../../utils/firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { notifications } from '@mantine/notifications';
import { Button, Space, Group } from '@mantine/core';
import { RiUploadLine } from "react-icons/ri";

export default function RichText({ligaName, setEditPage}) {

    const [height, setHeight] = React.useState(480)
    const [width, setWidth] = React.useState(640)

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
    });

    React.useEffect(() => {
        const fetchData = async () => {
            if (ligaName) {
                console.log("Liganame: ", ligaName);
                const docRef = doc(db, ligaName, "Ligastartseite");
                try {
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        console.log("Daten: ", data);
                        if (editor && editor.commands && typeof editor.commands.setContent === 'function') {
                            editor.commands.setContent(data);
                        } else {
                            console.error("Editor ist nicht korrekt initialisiert oder `setContent` ist keine Funktion.");
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

    const addImage = useCallback(() => {
    // Erstellen eines 'input' Elements für Dateiauswahl
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*'); // Nur Bilder akzeptieren
        input.click(); // Öffnet den Dateiauswahldialog

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const src = e.target.result;
                    editor.isFocused = true;
                    editor.chain().focus().setImage({ src }).run();
                };
                reader.readAsDataURL(file);
            }
        };
    }, [editor]);

    async function showEditor() {
        console.log(editor.getJSON());
        const docRef = doc(db, ligaName, "Ligastartseite");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            // Dokument aktualisieren, wenn es existiert
            await setDoc(docRef, editor.getJSON(), { merge: true });
            console.log("Dokument aktualisiert");
        } else {
            // Dokument erstellen, wenn es nicht existiert
            await setDoc(docRef, editor.getJSON());
            console.log("Dokument erstellt");
        }
        setEditPage(false);
        notifications.show({
            title: 'Startseite aktualisiert',
            message: 'Startseite wurde erfolgreich aktualisiert. ✅',
            color: 'green',
        })
    }

    const addYoutubeVideo = () => {
        const url = prompt('YouTube URL')
    
        if (url) {
          editor.commands.setYoutubeVideo({
            src: url,
            width: Math.max(320, parseInt(width, 10)) || 640,
            height: Math.max(180, parseInt(height, 10)) || 480,
          })
        }
    }

    return (
        <>
            <RichTextEditor editor={editor}>
                <RichTextEditor.Toolbar sticky stickyOffset={60}>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Undo />
                        <RichTextEditor.Redo />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <RichTextEditor.Underline />
                        <RichTextEditor.ColorPicker
                            colors={[
                                '#25262b',
                                '#868e96',
                                '#fa5252',
                                '#e64980',
                                '#be4bdb',
                                '#7950f2',
                                '#4c6ef5',
                                '#228be6',
                                '#15aabf',
                                '#12b886',
                                '#40c057',
                                '#82c91e',
                                '#fab005',
                                '#fd7e14',
                            ]}
                        />
                        <RichTextEditor.Strikethrough />
                        <RichTextEditor.ClearFormatting />
                        <RichTextEditor.Highlight />
                        <RichTextEditor.Code />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.H1 />
                        <RichTextEditor.H2 />
                        <RichTextEditor.H3 />
                        <RichTextEditor.H4 />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Blockquote />
                        <RichTextEditor.Hr />
                        <RichTextEditor.BulletList />
                        <RichTextEditor.OrderedList />
                        <RichTextEditor.Subscript />
                        <RichTextEditor.Superscript />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Link />
                        <RichTextEditor.Unlink />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.AlignLeft />
                        <RichTextEditor.AlignCenter />
                        <RichTextEditor.AlignJustify />
                        <RichTextEditor.AlignRight />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Control
                        onClick={() => addImage()}
                    >
                        <CiImageOn />
                    </RichTextEditor.Control>
                    <RichTextEditor.Control
                        onClick={() => addYoutubeVideo()}
                    >
                        <RiMovieLine />
                    </RichTextEditor.Control>
                    </RichTextEditor.ControlsGroup>

                </RichTextEditor.Toolbar>

                <RichTextEditor.Content h={300} style={{ overflowY: 'scroll' }}/>
            </RichTextEditor>

            <Space h="md" />
            <Group justify="flex-end">
                <Button onClick={() => showEditor()} rightSection={<RiUploadLine size={14} />}>Speichern</Button>
            </Group>
        </>
    );
}