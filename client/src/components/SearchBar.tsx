import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PreviewProps } from '../utils/types';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

export default function SearchBar({civs}: PreviewProps) {

    const [typed, typedState] = useState("");
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    return(
        <Autocomplete
            disableClearable
            popupIcon={null}
            options={civs}
            noOptionsText="No Civilizations Found"
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
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
            }}
            getOptionLabel={(option) => option.civ.name}
            inputValue={typed}
            onInputChange={(e, val) => {
                typedState(val);
                setOpen(val.length > 0);
            }}
            onChange={(e, chosen) => {
                if (chosen) {
                    setOpen(false);
                    navigate(`/leader/overview/${chosen.civ.slug}`);
                }
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