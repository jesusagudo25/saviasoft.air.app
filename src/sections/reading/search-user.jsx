import axios from 'axios';
import propTypes from 'prop-types';
import React, { useRef, useState } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function SearchUser({ userFilter, setUserFilter }) {

    const previousController = useRef();

    const [options, setOptions] = useState([]);

    const getDataAutocomplete = (searchTerm) => {
        if (previousController.current) {
            previousController.current.abort();
        }

        const controller = new AbortController();
        const { signal } = controller;
        previousController.current = controller;

        axios.get(`${import.meta.env.VITE_CLOUD_GATEWAY}${import.meta.env.VITE_MICRO_SECURTY}/users?name${searchTerm}`, { signal })
            .then((res) => {
                const data = res.data.map((item) => ({label: `${item.firstName} ${item.lastName}`, value: item.id}));
                setOptions(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Autocomplete
            id="user-search"
            value={userFilter.userName}
            disablePortal={false}
            options={options}
            onChange={(event, newValue) => {
                console.log(newValue, 'newValue');
                const userFilterCopy = {...userFilter};
                if(newValue !== null){
                    /* handleOnChangeUser({
                        id: newValue.value,
                    }); */
                    userFilterCopy.userId = newValue.value;
                    userFilterCopy.userName = newValue.label;
                }
                else {
/*                     handleOnChangeUser({
                        id: '',
                    });
                    setUserFilter({
                        ...userFilter,
                        userName: '',
                    }); */
                    userFilterCopy.userId = '';
                    userFilterCopy.userName = '';
                }
                setUserFilter(userFilterCopy);

            }}
            renderInput={(params) => <TextField {...params}size='small' InputLabelProps={{ shrink: true }} placeholder='Buscar' />}
            onInputChange={(event, newInputValue) => {
                const userFilterCopy = {...userFilter};
                if(newInputValue !== '') userFilterCopy.userName = newInputValue;
                if (event?.target) {
                    userFilterCopy.userId = '';
                    if (event?.target?.value?.length > 1) {
                        getDataAutocomplete(event.target.value);
                    }
                    else {
                        setOptions([]);
                        userFilterCopy.userName = '';
                    }
                    setUserFilter(userFilterCopy);
                }
            }}
            noOptionsText="No hay opciones"
            loadingText="Cargando..."
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            clearOnEscape
            blurOnSelect
            freeSolo
            loading
        />
    )
}

SearchUser.propTypes = {
    userFilter: propTypes.object,
    setUserFilter: propTypes.func,
}