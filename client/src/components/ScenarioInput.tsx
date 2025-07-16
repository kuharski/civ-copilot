import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


type ScenarioProps = {
    scenario: string;
    setScenario: (newScenario: string) => void;

};

export default function ScenarioInput({scenario, setScenario}: ScenarioProps) {

    return (
        <div className="max-w-[350px] w-full mx-6 lg:mx-0">
            <Box
                component="form"
                className="w-full"
                sx={{ '& .MuiTextField-root': { width: '100%' } }}
                noValidate
                autoComplete="off"
            >
            <TextField
                id="scenario-input"
                label="Describe Your Scenario"
                placeholder="Share your strategy, goals, or challenges..."
                multiline
                rows={12}
                variant="outlined"
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                sx={{
                    '& .MuiInputBase-root': {
                    fontFamily: 'Georgia',
                    },
                    '& .MuiInputBase-input::placeholder': {
                        fontFamily: 'Georgia',
                        opacity: 1,
                        color: '#1f1f25',
                    },
                    '& input': {
                        fontFamily: 'Georgia',
                    },
                    '& label': {
                        fontFamily: 'Georgia',
                    },
                    '& .MuiInput-underline:before': {
                        borderBottomColor: '#1f1f25',
                    },
                    '& .MuiInput-underline:after': {
                        borderBottomColor: '#5b9bd5',
                    },
                    '& label.Mui-focused': {
                        color: '#FFFFFF',
                    },
                }}
            />
            </Box>
        </div>
    );
}