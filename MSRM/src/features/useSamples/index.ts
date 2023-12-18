import { SetStateAction, useEffect, useState } from 'react';
import sampleData from '../../mock/sampleMock';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reduxToolkit/store';
import { saveDraftMissionID, saveFilterType, saveSearch } from '../../reduxToolkit/toolkitSlice';

interface Sample {
    Id_sample: number;
    Name: string;
    Type: string;
    Date_Sealed: string;
    Sol_Sealed: number;
    Rock_Type: string;
    Height: string;
    Current_Location: string;
    Image: string;
    Video: string;
    Sample_status: string;
}

export const useSamples = () => {
    const dispatch = useDispatch();

    const [samples, setSamples] = useState<Sample[] | undefined>();
    const [types, setTypes] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedRockType, setSelectedRockType] = useState<string>('');
    const [showAlert, setShowAlert] = useState(false);


    const addToBag = (selectedSampleID: any) => {
        axios.put(`/api/api/sample/to_mission/${selectedSampleID}`, {}, {
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem("token")}`,
            },
        })
            .then(response => {
                console.log(response)
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                }, 1500);
                UpdateData();
            })
            .catch(error => {
                console.log(error);
            })
    }

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRockType(event.target.value);
        dispatch(saveFilterType(event.target.value));
    };

    const UpdateData = () => {
        axios.get(`/api/api/sample/?name=&rockType=`,
            {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                },
            }
        )
            .then(response => {
                console.log(response.data)
                dispatch(saveDraftMissionID(response.data.draftMission_id))
                const samplesData = response.data.samples;
                setSamples(samplesData);

                const uniqueTypes: any[] = []
                samplesData.map((sample: { Rock_Type: any; }) => {
                    uniqueTypes.push(sample.Rock_Type)
                })

                const uniqueTypesSet = new Set(uniqueTypes);
                const uniqueTypesArray = Array.from(uniqueTypesSet);

                setTypes(uniqueTypesArray);
            })
            .catch(error => {
                console.log('Не удалось подключиться к БД:', error);
                setSamples(sampleData);
                const uniqueTypes: any[] = []
                sampleData.map((sample: { Rock_Type: any; }) => {
                    uniqueTypes.push(sample.Rock_Type)
                })

                const uniqueTypesSet = new Set(uniqueTypes);
                const uniqueTypesArray = Array.from(uniqueTypesSet);

                setTypes(uniqueTypesArray);
            })
    }

    const searchSaving = (e: any) => {
        setSearchQuery(e.target.value);
        dispatch(saveSearch(e.target.value));
    }

    return {
        UpdateData,
        handleRadioChange,
        searchSaving,
        addToBag,
        setSelectedRockType,
        showAlert
    }
}