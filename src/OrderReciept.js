import React, { useEffect, useState } from 'react'
import './orderinvoice.css'
import { history } from './history'
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas'
import { api_url } from './assets/constants/api_url'
import moment from 'moment';
export default () => {
    const [orderData, setOrderData] = useState({})
    const [orderDataLines, setOrderDataLines] = useState([])
    const [img, setImg] = useState('')
    useEffect(() => {
        let id = new URLSearchParams(history.location.search).get("orderid")
        fetch(api_url + 'receipt?orderId=' + id)
            .then(res => res.json())
            .then(res => {
                fetch(api_url + 'getReceiptLogo?imageId=' + res.imageId)
                    .then(response => response.blob())
                    .then(imageBlob => {
                        // Then create a local URL for that image and print it 
                        const imageObjectURL = URL.createObjectURL(imageBlob);
                        setImg(imageObjectURL);
                    })
                    .catch (e => console.log(e))

        setOrderData(res)
    })
        .catch(e => console.log(e))

    fetch(api_url + 'receiptLiens?orderId=' + id)
        .then(res => res.json())
        .then(res => setOrderDataLines(res))
        .catch(e => console.log(e))

}, [])
const download = () => {
    const input = document.getElementById('divToPrint');
    html2canvas(input)
        .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'JPEG', 0, 0);
            // pdf.output('dataurlnewwindow');
            pdf.save("download.pdf");
        })
        ;
}
return (
    <div style={{ "display": "flex", "flexDirection": "column", "justifyContent": "center", "alignItems": "center" }}>
        {/* <button
            onClick={download}
            style={{ padding: '10px', border: '#7367f0', background: '#7367f0', borderRadius: '5px', color: '#fff', margin: '10px' }}>Download</button> */}
        <div id="divToPrint" className="inv-invoice-body" style={{ maxWidth: '1200px', background: '#fff', padding: '20px' }}>
            <table>
                <tbody>
                    <tr>
                        <td align="center">
                            <div>
                                <img src={img} width="300" height="300" style={{width: '300px', height:'200px'}}/> 
                            </div>
                            {/* <p className="ql-align-center"><span style={{ color: 'rgb(67, 66, 67)' }}>KFC</span>
                                </p> */}
                            <p className="ql-align-center" >{orderData.header}</p>
                            <p className="ql-align-center"><strong><u>Tax No: {orderData.taxNo}</u></strong></p>
                            <p><br /></p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br />
            <div className="inv-main">

                <table cellpadding="1">
                    <tbody>
                        <tr>
                            <td align="left"><strong>Order Type</strong></td>
                            <td align="right"><strong>WALK-IN</strong></td>
                        </tr>
                        <tr>
                            <td align="left"><strong>Staff / الموظف: </strong></td>
                            <td align="right"><strong>{orderData.cashier}</strong></td>
                        </tr>
                        <tr>
                            <td align="left"><strong>{moment(orderData.dateTime, 'YYYY-MM-DD h:mm:ss a').format("MMM Do YY")}</strong></td>
                            <td align="right"><strong>{ moment(orderData.dateTime, 'YYYY-MM-DD h:mm:ss a').format('LTS')}</strong></td>
                        </tr>
                    </tbody>
                </table>
                <table cellpadding="3">
                    <tbody>
                        <tr className="inv-table-title">
                            <td align="left"><strong>Qty / الكمية</strong></td>
                            <td align="left"><strong>Item / السلعة</strong></td>
                            <td align="right"><strong>Amount /السعر</strong></td>
                        </tr>
                        {
                            orderDataLines.length ? orderDataLines.map(item => (
                                <tr>
                                    <td valign="top">{item.qty}</td>
                                    <td valign="top">
                                        <div className="food-title">

                                            {item.productname}
                                            /
                                            {item.productnamear}
                                            &lrm; <span>({item.unitPrice})</span>
                                        </div>
                                        <table>
                                        </table>
                                    </td>
                                    <td valign="top" align="right">{item.qty * item.unitPrice}</td>
                                </tr>
                            )) : <></>
                        }


                        <tr>
                            <td colspan="2">Sub Total / المجموع الفرعي: </td>
                            <td align="right">{orderData.totalWithoutTax ? orderData.totalWithoutTax : 0}</td>
                        </tr>
                        <tr>
                            <td colspan="2">Discount / خصم: </td>
                            <td align="right">{orderData.discountAmt ? orderData.discountAmt : 0}</td>
                        </tr>
                        <tr>
                            <td colspan="2">Tax / الضريبة: </td>
                            <td align="right">{orderData.taxAmt ? orderData.taxAmt : 0}</td>
                        </tr>
                        <tr>
                            <td colspan="2" className="topbottom-border"><strong>Total / مجموع: </strong></td>
                            <td align="right" className="topbottom-border"><strong>SAR {orderData.totalAmt ? orderData.totalAmt : 0}</strong></td>
                        </tr>
                        <tr className="footer-cash">
                            <td colspan="2">

                                Cash
                                /
                                السيولة النقدية

                            </td>
                            <td align="right">{orderData.payCash ? orderData.payCash : 0}</td>
                        </tr>
                        <tr>
                            <td colspan="2" className="topbottom-border">
                                <strong>Total Paid / مجموع المبالغ المدفوعة: </strong>
                            </td>
                            <td align="right" className="topbottom-border"><strong>SAR {orderData.paidAmt ? orderData.paidAmt : 0}</strong></td>
                        </tr>
                        {/* <tr>
                <td colspan="2">Tips: </td>
                <td align="right">0.00</td>
                </tr> */}
                        {/* <tr>
                                <td colspan="2">Change: </td>
                                <td align="right">0.00</td>
                            </tr> */}

                    </tbody>
                </table>
            </div>
            <table>
                <tbody>
                    <tr>
                        <td align="center">
                            <p>{orderData.footer}</p>
                            {/* <p>THANK YOU FOR YOUR ORDER!PLEASE VISIT AGAIN&nbsp; </p> */}
                            {/* <p>شكرا لطلبك!يرجى زيارة الموقع مرة أخرى</p> */}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
)
}