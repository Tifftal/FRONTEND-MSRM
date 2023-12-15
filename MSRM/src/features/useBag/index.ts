import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reduxToolkit/store";
import { saveDraftMissionID } from "../../reduxToolkit/toolkitSlice";
import { useNavigate } from "react-router-dom";

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


export const useBag = () => {
    const [data, setData] = useState<Sample[] | []>([]);
    const [count, setCount] = useState<number>(0);
    const [showAlert, setShowAlert] = useState(false);

    const draftID = useSelector((state: RootState) => state.toolkit.draftID);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const UpdateData = () => {
        axios.get(
            `/api/api/mission/${draftID}`,
            {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                },
            }
        )
            .then(response => {
                const samples = response.data.samples
                setData(samples);
                console.log(response);
                setCount(samples.length);
            })
            .catch(error => {
                console.log(error)
            })
    }

    const RemoveSample = (seletedSampleID: number) => {
        axios.delete(
            `/api/api/mission/delete_from_last/${seletedSampleID}`,
            {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                },
            }
        )
            .then(response => {
                console.log(response);
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                }, 1500);
                UpdateData();
            })
            .catch(error => {
                console.log(error)
            })
    }

    const ChangeStatus = (status: string) => {
        axios.put(
            `/api/api/mission/status_by_user/${draftID}`,
            {
                "Mission_status": status,
            },
            {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                },
            }
        )
            .then(response => {
                console.log(response);
                dispatch(saveDraftMissionID(0))
                navigate("/MSRM/samples")
            })
            .catch(error => {
                console.log(error)
            })
    }

    return {
        UpdateData,
        RemoveSample,
        data,
        setData,
        count,
        setCount,
        showAlert,
        setShowAlert,
        ChangeStatus
    }
}
