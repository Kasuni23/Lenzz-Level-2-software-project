import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import { Provider } from "react-redux";
import store from "../../../store";
import SideBar from "../Sidebar";
import { useLocation } from "react-router-dom";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import axios from "axios";



const DashboardProvider = () => {
    const history = useNavigate();

    const location = useLocation();
    const roomName = location.state ? location.state.projectId : null;
    const [localProject, SetLocalProject] = useState({});
    const [projectDetails, SetProjectDetails] = useState({})



    useEffect(() => {
        const getLocalStorageProject = async () => {
            const localPro = await JSON.parse(localStorage.getItem("last access project"));
            console.log("localPro", localPro)
            if (localPro == null) {
                redirectCompanyAlert()
                setTimeout(() => {
                    history('/');
                }, 2000);
            } else {
                SetLocalProject(localPro)
                console.log('a');
            }
        }

        getLocalStorageProject();
    }, []);

    const redirectCompanyAlert = () => {
        Swal.fire({
            position: 'center',
            icon: 'question',
            text: 'Please select a Project',
            showConfirmButton: false,
            timer: 1800,
            width: '300px'
        })
    };
    useEffect(() => {
        const getProject = async () => {
            const data = {
                id: localProject.projectId
            }
            await axios.post('http://localhost:4000/api/project/getProject', data)
                .then(res => {
                    console.log("ssssss",res.data.project)
                    SetProjectDetails(res.data.project);
                }).catch(err => {
                    console.log(err)
                })
        }
        if (localProject.projectId) {
            getProject();
        }

    }, [projectDetails._id, localProject.projectId])

    return (
        <SideBar display={"Project : "+projectDetails.projectname}>{console.log('cc',roomName)}
            <div style={{
                marginTop: "60px",
                marginLeft: "60px",
            }}>
                <Provider store={store}>
                    <div><Dashboard  /></div>
                </Provider>
            </div>
        </SideBar>
    )
}
export default DashboardProvider
