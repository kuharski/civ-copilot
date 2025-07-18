import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { CivPreview } from '../utils/types';

type SearchBarProps = {
  civs: CivPreview[];
  selectedCiv: CivPreview | null;
  setSelectedCiv: (leader: CivPreview | null) => void;
};

export default function SearchBarTechs({ civs, selectedCiv, setSelectedCiv }: SearchBarProps) {

    const [typed, typedState] = useState("");

    return(
        <Autocomplete
            disableClearable={false}
            popupIcon={null}
            clearOnEscape
            options={civs}
            value={selectedCiv}
            noOptionsText="No Civilizations Found"
            slotProps={{
                paper: {
                sx: {
                    backgroundColor: '#1f1f25',
                    color: '#FFFFFF',
                    fontFamily: 'Georgia, serif',
                    '& .MuiAutocomplete-noOptions': {
                        fontStyle: 'italic',
                        color: '#CCCCCC',
                        fontSize: 14
                    },
                },
                },
                clearIndicator: {
                sx: {
                    color: '#CCCCCC',
                    '&:hover': {
                    color: '#FFFFFF',
                    },
                },
                },
            }}
            getOptionLabel={(option) => option.civ.name}
            isOptionEqualToValue={(option, value) => option.civ.slug === value?.civ.slug}
            inputValue={typed}
            onChange={(e, chosen) => {
                setSelectedCiv(chosen);
                if (chosen) typedState(chosen.civ.name);
            }}
            onInputChange={(e, val, reason) => {
                if (reason !== 'reset') typedState(val);
            }}
            sx={{
                width: 180,
                '& .MuiAutocomplete-noOptions' : {
                    fontFamily: 'Georgia'
                },
            }}
            renderOption={(props, option) => (
                <Box component="li" {...props} className="flex items-center space-x-2 hover:cursor-pointer py-1" sx={{fontFamily: 'Georgia'}}>
                <Avatar src={option.civ.icon} alt={option.civ.slug} sx={{ width: 24, height: 24 }} />
                <span>{option.civ.name}</span>
                </Box>
            )}
            renderInput={(params) => (
                <TextField 
                    {...params} 
                    label="Search Civilizations" 
                    variant="standard"
                    sx={{
                        '& .MuiInputBase-root': {
                        color: '#FFFFFF',
                        caretColor: '#FFFFFF',
                        },
                        '& input::placeholder': {
                        color: '#CCCCCC',
                        opacity: 1,
                        fontFamily: 'Georgia',
                        },
                        '& input': {
                            fontFamily: 'Georgia',
                        },
                        '& label': {
                            fontFamily: 'Georgia',
                            color: '#CCCCCC',
                        },
                        '& .MuiInput-root': {
                            '&:before': {
                            borderBottomColor: '#444444',
                            },
                            '&:hover:not(.Mui-disabled, .Mui-error):before': {
                            borderBottomColor: '#888888',
                            },
                            '&:after': {
                            borderBottomColor: '#888888',
                            },
                        },
                        '& label.Mui-focused': {
                            color: '#FFFFFF',
                        },
                    }}
                />
            )
            }
        />
    );
}