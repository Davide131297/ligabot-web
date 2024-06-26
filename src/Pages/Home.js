import { Stepper } from '@mantine/core';

const Home = () => {

    return (
        <>
            <Stepper orientation="vertical">
                <Stepper.Step label="Step 1" description="Registrieren" />
                <Stepper.Step label="Step 2" description="Anmelden" />
                <Stepper.Step label="Step 3" description="Liga erstellen Button drücken" />
                <Stepper.Step label="Step 4" description="Fahrer hinzufügen" />
            </Stepper>
        </>
    );
}
export default Home;