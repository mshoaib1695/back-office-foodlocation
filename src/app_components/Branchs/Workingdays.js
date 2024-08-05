import React, { useEffect, useState } from 'react'
import { create, getList, deleteFn } from '../../API_Helpers/api'
import { useSelector } from "react-redux"
import './style.css'
import TimePicker from 'react-time-picker';
import { Button } from 'reactstrap';

function WorkingDays(props) {
    const user = useSelector(state => state.auth.login.user)
    const [workingDays, setWorkingDays] = useState([])
    const [remainingDays, setRemainingDays] = useState([])
    const [branchDays, setBranchDays] = useState([])
    const [showSave, setShowsave] = useState(false)

    useEffect(() => {
        if (props.branchId) {
            getBranchTimings(props.branchId)
        }
    }, [props])

    useEffect(() => {
        workingDaysFetch()
    }, [])

    useEffect(() => {
        const filteredArray = workingDays.filter(value => {
            for (let obj of branchDays) {
                if (obj.day == value) {
                    return false;
                }
            }
            return true;
        });
        setRemainingDays(filteredArray)
    }, [branchDays, workingDays])

    const getBranchTimings = (id) => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "branch/timing/working-days-list",
            data: {
                branchId: id,
            },
        }
        getList(payload)
            .then(res => {
                setBranchDays(res.data.object)
            })
    }

    const workingDaysFetch = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "branch/timing/working-days",
        }
        getList(payload)
            .then(res => {
                setWorkingDays(res.data.object)
            })
    }

    const postBranchTimings = (id) => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "branch/timing/save-working-days?lang=EN",
            data: branchDays,
        }

        create(payload)
            .then(res => {
                console.log(res.data)
            })
    }
    const handler = (e, type, index) => {
        let tmp = [...branchDays]
        tmp[index] = { ...tmp[index], [type]: e.target.value }
        setBranchDays(tmp)
    }
    const deleteHandler = (item) => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: `branch/timing/delete-working-day?lang=EN&id=${item.id}`
        }

        deleteFn(payload)
            .then(res => {
                getBranchTimings(props.branchId)
            })
    }

    const addHandler = (day) => {
        let tmp = [...branchDays]
        let tmpObj = {
            "branchId": props.branchId,
            "day": day,
            "endTime": "00:00",
            "id": null,
            "startTime": "00:00"
        }
        tmp.push(tmpObj)
        setBranchDays(tmp)
    }
    return (
        <>
            <p>Click to select working day</p>
            <div className='workingdaydiv'>
                {
                    remainingDays.map(item => (
                        <p onClick={() => addHandler(item)} className='workingday'>{item}</p>
                    ))
                }
            </div>
            <table id='timings'>
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        branchDays?.map((item, index) => (
                            <tr key={index}
                            >
                                <td>
                                    <p>{item.day}</p>
                                </td>
                                <td>
                                    <input type="time" onChange={(e) => handler(e, 'startTime', index)} value={item.startTime} />
                                </td>
                                <td>
                                    <input type="time" onChange={(e) => handler(e, 'endTime', index)} value={item.endTime} />
                                </td>
                                <td>
                                    <Button color='danger' onClick={() => deleteHandler(item)}>Delete</Button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <Button color='primary' onClick={postBranchTimings}>Save</Button>
        </>
    )
}

export default WorkingDays;