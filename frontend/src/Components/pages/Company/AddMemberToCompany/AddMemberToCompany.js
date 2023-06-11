import React, { useState } from 'react'
import axios from 'axios';
import styles from './AddMemberToCompany.module.css'

import { useRef, useEffect } from 'react';
const AddMemberToCompany = (props) => {
    const [mail, setMail] = useState("")
    const inputRef = useRef(null);
    const [err, setErr] = useState("")
    const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    useEffect(() => {
        if (!EMAIL_REGEX.test(mail)) {
            
        }
        
    }, [mail]);
    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const handleSendInvitation = async () => {
        try {
            if (EMAIL_REGEX.test(mail)) {
               const res= await axios.post(
                    "http://localhost:4000/api/company/sendInvitation",
                    {
                        company: props.company.companyname,
                        mail: mail,
                        companyKey: props.company.companyKey
                    }
                );
                
                props.addMemberButtonClickHandler();
                console.log(props.company.companyname)
                console.log(res);

            } else if (mail =="") {
                setErr("Mail cannot be empty.");
            } else {
                setErr("Enter valid email address..");

            }
        } catch (err) {
            console.error(err);
        }
    };
    const handleCancel = () => {
        props.addMemberButtonClickHandler();
    };
    const emailHandler = (event) => {
        setMail(event.target.value); 
        setErr(""); 
    }
    return (
        <div className={styles.modal}>
            <div onClick={handleCancel} className={styles.overlay}></div>
            <div className={styles.modalContent}>
                <div style={{ marginBottom: '10px' }}>
                    <label className={styles.label}>Enter email to send invitation.</label>
                    <input type="text" value={mail} onChange={emailHandler} ref={inputRef}
                        className={styles.input} />
                    <div className={styles.buttonsContainer}>
                        <button onClick={handleSendInvitation} className={styles.button} style={{ backgroundColor: '#007bff', marginRight: '10px' }}>Send invitation</button>
                        <button onClick={handleCancel} className={styles.button} style={{ backgroundColor: '#dc3545' }}>Cancel</button>
                    </div >
                    {err!="" && (
                        <div className={styles.empty} >
                            <p className={styles.errMsg}>{err}</p>
                        </div>)}
                </div>
            </div>
        </div>
    )
}

export default (AddMemberToCompany);