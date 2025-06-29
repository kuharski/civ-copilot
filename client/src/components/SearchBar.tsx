import { useState } from 'react';
import { Navigation, useNavigate } from 'react-router';
import { CivPreview, PreviewProps } from '../types/utils';
import { fetchCiv, fetchCivPreview } from '../api/hallofleaders';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

export default function SearchBar({civs}: PreviewProps) {

    const [typed, typedState] = useState("");
    const navigate = useNavigate();
    return(
        <Autocomplete
            disableClearable
            popupIcon={null}
            options={civs}
            noOptionsText="No Civilizations Found"
            slotProps={{
                paper: {
                sx: {
                    '& .MuiAutocomplete-noOptions': {
                    fontFamily: 'Georgia, serif',
                    fontStyle: 'italic',
                    fontSize: 14
                    },
                },
                },
            }}
            getOptionLabel={(option) => option.civ.name}
            inputValue={typed}
            onInputChange={(e, val) => {
                typedState(val);
            }}
            onChange={(e, chosen) => {
                if (chosen) {
                    navigate(`/leader/overview/${chosen.civ.slug}`);
                }
            }}
            open={typed.length > 0}
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
                        borderBottomColor: '#c87f4f',
                        },
                        '& label.Mui-focused': {
                            color: '#c87f4f',
                        },
                    }}
                />
            )
            }
        />
    );
}