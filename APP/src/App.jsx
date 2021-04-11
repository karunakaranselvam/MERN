import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as common from './common';
import { Formik } from "formik";
import * as yup from "yup";
import {
    Form,
    FormGroup,
    FormControl,
    FormLabel,
    Modal,
    Button
} from 'react-bootstrap';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from "react-notifications";
import swal from "sweetalert2";

const App = () => {
    const [employee, setEmployee] = useState([])
    const [files, setFiles] = useState([])

    const [empData, setEmpData] = useState({
        _id: '',
        emplyeename: '',
        designation: '',
        qualification: '',
        from_date: '',
        end_date: '',
        photo: '',
        status: 1,
    })

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    useEffect(() => {
        getEmps()
    }, [])

    const getEmps = () => {
        axios
            .get('http://localhost:5000/employee').then(res => {
                var data = common.decryptJWT(res.data.token, true)
                setEmployee(data.employee);
            })
            .catch((e) => {
                console.log(e.message);
            });
    }

    const empEdit = (id) => {
        axios
            .get("http://localhost:5000/employee/" + id)
            .then((res) => {
                setShow(true)
                var data = common.decryptJWT(res.data.token, true)
                setEmpData(data.employee);
            })
            .catch((err) => {
                console.log(err);
            })
    }


    const handleFileSelect = event => {
        let files = event.target.files;
        let list = [];

        for (const iterator of files) {
            list.push({
                file: iterator,
                uploading: false,
                error: false,
                progress: 0
            });
        }
        setFiles([...list]);
    };

    const handleSubmit = (values, { setSubmitting }) => {
        console.log(values);
        const fd = new FormData();
        if (files.length !== 0) {
            fd.append('photo', files[0].file);
        }
        fd.append('emplyeename', values.emplyeename);
        fd.append('designation', values.designation);
        fd.append('qualification', values.qualification);
        fd.append('from_date', values.from_date);
        fd.append('end_date', values.end_date);
        fd.append('status', values.status);

        if (values._id) {
            fd.append('_id', values._id);
            axios
                .put("http://localhost:5000/employee/" + values._id, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(res => {
                    setSubmitting(true)
                    NotificationManager.success(
                        res.data.message
                    );
                    getEmps()
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else {
            axios
                .post("http://localhost:5000/employee", fd, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(res => {
                    setSubmitting(true)
                    NotificationManager.success(
                        res.data.message
                    );
                })
                .catch((err) => {
                    console.log(err);
                })
        }

        setShow(false)
        getEmps()
    }

    return (
        <>

            <section className="container mt-5">
                <div className="card">
                    <h3 className="card-header">Employee Details<div className="float-right"><button className="btn btn-outline btn-primary" onClick={() => {
                        setEmpData([])
                        handleShow()
                    }}>Add Employee</button></div></h3>
                    <div className="card-body">
                        <table className="table table-bordered">
                            <thead>
                                <th className="text-center">S.NO</th>
                                <th className="text-center">Action</th>
                                <th className="text-center">EMP ID</th>
                                <th className="text-center">EMP Name</th>
                                <th className="text-center">Designation</th>
                                <th className="text-center">Qualification</th>
                                <th className="text-center">From Date</th>
                                <th className="text-center">End Date</th>
                                <th className="text-center">Photo</th>
                            </thead>
                            <tbody>
                                {
                                    employee.map((data, i) =>
                                        <tr key={i}>
                                            <td className="text-center">{i + 1}</td>
                                            <td>
                                                <button onClick={() => empEdit(data._id)} className="m-1 btn btn-outline-primary">Edit</button>
                                                <button onClick={() => {
                                                    swal
                                                        .fire({
                                                            title: "Are you sure?",
                                                            text: "You won't be able to revert this!",
                                                            icon: "warning",
                                                            type: "question",
                                                            showCancelButton: true,
                                                            confirmButtonColor: "#3085d6",
                                                            cancelButtonColor: "#d33",
                                                            confirmButtonText: "Yes, delete it!",
                                                            cancelButtonText: "No"
                                                        })
                                                        .then(result => {
                                                            if (result.value) {
                                                                axios
                                                                    .delete('http://localhost:5000/employee/' + data._id)
                                                                    .then((res) => {
                                                                        NotificationManager.success(
                                                                            res.data.message
                                                                        );
                                                                        getEmps()
                                                                    })
                                                                    .catch((err) => {
                                                                        NotificationManager.success(
                                                                            err.message
                                                                        );
                                                                    })
                                                            }
                                                        })
                                                }} className="m-1 btn btn-outline-danger">Delete</button>
                                            </td>
                                            <td>{data.employee_id}</td>
                                            <td>{data.emplyeename}</td>
                                            <td>{data.designation}</td>
                                            <td>{data.qualification}</td>
                                            <td>{common.TableDate(data.from_date)}</td>
                                            <td>{common.TableDate(data.end_date)}</td>
                                            <td style={{ width: '5%' }}><img style={{ width: '100%', height: '100%' }} onError={common.addDefaultSrc} src={process.env.PUBLIC_URL + `assets/Profile/` + data.photo} alt="" /></td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <Modal show={show} onHide={handleClose} backdrop="static" size="lg" keyboard={false} centered={false}>
                <Formik
                    initialValues={{ ...empData }}
                    validationSchema={
                        yup.object().shape({
                            emplyeename: yup.string().required("Employee Name is required"),
                            designation: yup.string().required("Designation is required"),
                            qualification: yup.string().required("Qualification is required"),
                            from_date: yup.date().required("From Date is required"),
                            end_date: yup.date().required("End Date is required"),
                            status: yup.string().required("Status is required"),
                        })
                    }
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                >
                    {({
                        values,
                        errors,
                        handleChange,
                        touched,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        setSubmitting,
                        setFieldValue
                    }) => {
                        return (
                            <Form
                                onSubmit={handleSubmit}
                                className="px-3 needs-validation"
                                noValidate
                                encType={`true`}
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>{(values._id) ? 'Edit' : 'Add'} Employee</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Row>
                                        <FormGroup className="col-md-4 mb-3 pl-0">
                                            <FormLabel className="font-weight-bold">Employee Name <span className="m-1 text-danger">*</span></FormLabel>
                                            <FormControl
                                                type="text"
                                                className="form-control col-md-12"
                                                name='emplyeename'
                                                value={values.emplyeename}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={
                                                    errors.emplyeename &&
                                                    touched.emplyeename
                                                }
                                            />
                                            <FormControl
                                                type="hidden"
                                                className="form-control col-md-12"
                                                name='_id'
                                                value={values._id}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={
                                                    errors._id &&
                                                    touched._id
                                                }
                                            />
                                        </FormGroup>
                                        <FormGroup className="col-md-4 mb-3 pl-0">
                                            <FormLabel className="font-weight-bold">Designation<span className="m-1 text-danger">*</span></FormLabel>
                                            <FormControl
                                                type="text"
                                                className="form-control col-md-12"
                                                name='designation'
                                                value={values.designation}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={
                                                    errors.designation &&
                                                    touched.designation
                                                }
                                            />
                                        </FormGroup>
                                        <FormGroup className="col-md-4 mb-3 pl-0">
                                            <FormLabel className="font-weight-bold">Qualification<span className="m-1 text-danger">*</span></FormLabel>
                                            <FormControl
                                                type="text"
                                                className="form-control col-md-12"
                                                name='qualification'
                                                value={values.qualification}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={
                                                    errors.qualification &&
                                                    touched.qualification
                                                }
                                            />
                                        </FormGroup>
                                        <FormGroup className="col-md-4 mb-3 pl-0">
                                            <FormLabel className="font-weight-bold">From Date<span className="m-1 text-danger">*</span></FormLabel>
                                            <FormControl
                                                type="date"
                                                className="form-control col-md-12"
                                                name='from_date'
                                                value={common.DatePicker(values.from_date)}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={
                                                    errors.from_date &&
                                                    touched.from_date
                                                }
                                            />
                                        </FormGroup>
                                        <FormGroup className="col-md-4 mb-3 pl-0">
                                            <FormLabel className="font-weight-bold">End Date<span className="m-1 text-danger">*</span></FormLabel>
                                            <FormControl
                                                type="date"
                                                className="form-control col-md-12"
                                                name='end_date'
                                                value={common.DatePicker(values.end_date)}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={
                                                    errors.end_date &&
                                                    touched.end_date
                                                }
                                            />
                                        </FormGroup>



                                        {values._id && (
                                            <FormGroup className="col-md-4 mb-3 pl-0">
                                                <FormLabel className="font-weight-bold">Status <span className="m-1 text-danger">*</span></FormLabel>
                                                <FormControl
                                                    as="select"
                                                    className="form-control col-md-12"
                                                    name='status'
                                                    placeholder="status"
                                                    value={values.status}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={
                                                        errors.status &&
                                                        touched.status
                                                    }
                                                >
                                                    <option value="">Select Status</option>
                                                    <option value="1">Active</option>
                                                    <option value="2">In Active</option>
                                                </FormControl>
                                            </FormGroup>
                                        )}
                                    </Form.Row>
                                    <Form.Row>
                                        <FormGroup className="col-md-4 mb-3 pl-0">
                                            <FormLabel className="font-weight-bold">Profile<span className="m-1 text-danger">*</span></FormLabel>
                                            <FormControl
                                                type="file"
                                                className="form-control col-md-12"
                                                name='photo'
                                                // value={values.photo}
                                                onChange={handleFileSelect}
                                                onBlur={handleBlur}
                                                isInvalid={
                                                    errors.photo &&
                                                    touched.photo
                                                }
                                            />
                                        </FormGroup>
                                    </Form.Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="outline-secondary" type="button" onClick={handleClose}>Close</Button>
                                    <Button variant="outline-primary" type="submit">{(values._id) ? 'Update' : 'Insert'}</Button>
                                </Modal.Footer>
                            </Form>
                        )
                    }}
                </Formik>
            </Modal>
            <NotificationContainer />
        </>
    );
}

export default App;