import { Stepper } from '@mantine/core';
import { Text } from '@mantine/core';


const Home = () => {

    return (
        <>
            <div>
                <Text size="lg">Das sind die Schritte zum F1 Ligabot</Text>
                <Stepper orientation="vertical">
                    <Stepper.Step label="Step 1" description="Registrieren" />
                    <Stepper.Step label="Step 2" description="Anmelden" />
                    <Stepper.Step label="Step 3" description="Liga erstellen Button drücken" />
                    <Stepper.Step label="Step 4" description="Fahrer hinzufügen" />
                </Stepper>
            </div>
        </>
    );
}
export default Home;