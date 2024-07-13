import { Center, Space } from "@mantine/core";

export default function Impressum() {
    return (
        <div>
            <Center>
            <h1>Impressum</h1>
            </Center>
            <Space h="lg" />
            <Center>
            <p>E-Mail: 
                <a href="mailto:info@rlgbot.de">info@rlgbot.de</a>
            </p>
            </Center>
        </div>
    )
}