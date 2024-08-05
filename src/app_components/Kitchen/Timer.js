import React, { useEffect, useState } from 'react'


export default function Timer({ time }) {
    const [value, setValue] = useState(false)
    const _ = (nr, length = 2, padding = 0) =>
        String(nr).padStart(length, padding);
    useEffect(() => {
        var x = setInterval(function () {
            var timer = Number(Date.now()) + Number(time);
            const h = Math.floor(timer / 3600000);
            const m = Math.floor(timer / 60000) % 60;
            const s = Math.floor(timer / 1000) % 60;
            let timeString = _(h) + ':' + _(m) + ':' + _(s)
            setValue(timeString)
            if (false) {
                clearInterval(x);
            }
        }, 1000)
    }, [time])
    return (
        <>{value}</>
    )
}