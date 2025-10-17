import { useEffect, useState } from 'react';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';

import { fetchCustomerData } from '../services/listData';

const InputSelect = () => {
    const [customerData, setCustomerData] = useState([])
    const [currSearchKey, setCurrSearchKey] = useState('');
    const [filterKeys, setFilterKeys] = useState([])
    const [filterData, setFilterData] = useState([]);
    const [openToast, setOpenToast] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const fetchCustData = async () => {
            const custData = await fetchCustomerData();
            setCustomerData(custData)
        }
        fetchCustData()
    }, [])

    useEffect(() => {
        if (currSearchKey.trim()) {
            const suggestionArr = customerData.map(eachCustData => eachCustData.firstName);

            const filtered = suggestionArr.filter(suggestion =>
                suggestion.toLowerCase().includes(currSearchKey.toLowerCase())
            );
            setSuggestions(filtered)
        }
    }, [currSearchKey,customerData])

    const handleSearch = (e) => {
        setCurrSearchKey(e.target.value.trim())
    }

    const handleRemoveFilter = (filterKey) => {
        const updateFilter = filterData.filter(eachKey => eachKey.firstName !== filterKey.firstName);
        setFilterData(updateFilter)
        if (updateFilter.length === 0) {
            setFilterKeys([])
        }
    }

    const handleSelect = (suggestions = []) => {
        const filter = [...filterKeys, currSearchKey, ...suggestions].filter(str => str !== "").map(eachStr => eachStr.toLowerCase())
        setFilterKeys(filter);
        const addKey = customerData.filter((eachKey) => filter.includes(eachKey.firstName.toLowerCase()));
        setFilterData(addKey)
        setCurrSearchKey("");
        if (addKey.length === 0) {
            setOpenToast(true)
        }
    }

    const handleSuggestionClick = (suggestion) => {
        handleSelect([...suggestion, ...suggestions])
        setSuggestions([]); // Clear suggestions after selection
    };

    const handleKeyDown = (e) => {
        switch (e.key) {
            case 'Enter':
                handleSelect()
                break;
            case 'Escape':
                break;
            default:
                break;
        }
    }

    return (
        <Grid container direction="column" sx={{ padding: "20px" }} >
            <Snackbar
                open={openToast}
                autoHideDuration={2000}
                onClose={() => setOpenToast(false)}
                message="No results"
            />
            <Grid container spacing={2} direction="row" >
                <Grid > <TextField
                    id="input-search"
                    data-testId="input-search"
                    label="Search"
                    variant="standard"
                    value={currSearchKey}
                    onChange={(e) => handleSearch(e)}
                    onKeyDown={(e) => handleKeyDown(e)}
                    sx={{ maxWidth: '100%' }}
                />
               {/* Show Suggestions */}
                  {currSearchKey && suggestions.length > 0 && (
                      <Paper sx={{ width: 320, maxWidth: '100%', maxHeight: 200, overflowY: 'auto' }}>
                          <MenuList>
                              {suggestions.map((suggestion, index) => (
                                  <MenuItem key={index} onClick={() => handleSuggestionClick([suggestion])}>
                                      {suggestion}
                                  </MenuItem>
                              ))}
                          </MenuList>
                      </Paper>
                  )}
                </Grid>
                <Grid >{currSearchKey && <IconButton sx={{ padding: '18px' }} onClick={() => setCurrSearchKey('')}> <CloseIcon /></IconButton>} </Grid>

            </Grid>
            <Divider sx={{ paddingBottom: "10px" }} />
            {/* Show Filter */}
            {filterData.length > 0 && (
                <>
                    <Stack direction="row" spacing={2}>{filterData.map((eachKey) => {
                        return (
                            <Button key={eachKey.id} onClick={() => handleRemoveFilter(eachKey)} variant="contained" endIcon={<CloseIcon />}>{eachKey.firstName}</Button>
                        )
                    })}</Stack>
                    <Divider sx={{ paddingBottom: "10px", }} />
                </>)}
            {/* Show results data */}
            <Grid >
                {filterData.length > 0 && (<Stack spacing={2}>
                    {filterData.map(option => {
                        return (
                            <MenuItem sx={{ backgroundColor: '#fff', border: "1px #D3D3D3 solid" }} key={option.id} value={option.id}>{option.firstName} {option.lastName} {option.age} {option.address?.city}</MenuItem>
                        )
                    })}
                </Stack>)}

            </Grid>
        </Grid>
    )
}
export default InputSelect