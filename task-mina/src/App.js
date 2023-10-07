import './App.css';
import LoadFile from "./components/LoadFile"
import { useRef, useState, useEffect } from 'react';
import * as XLSX from "xlsx";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Formik } from 'formik';



import "react-tabulator/lib/styles.css"; 
import "react-tabulator/css/bootstrap/tabulator_bootstrap.min.css"; 
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [tabulator, setTabulator] = useState();

  const [show, setShow] = useState({
    create: false,
    etid: false
  });

  function findMaxId(arr) {
    let maxId = -1;

    for (let i = 0; i < arr.length; i++) {
        const currentArray = arr[i];
        if (currentArray.length > 0) {
            const currentArrayMaxId = currentArray[0];
            if (currentArrayMaxId > maxId) {
                maxId = currentArrayMaxId;
            }
        }
    }

    return maxId;
}

  const handleClose = () => setShow(prev => { return { ...prev, create: false } });
  const handleShow = () => {
    if (tabulator) {
      setShow(prev => { return { ...prev, create: true } })
    }
    else {
      alert("First you should choose excel file")
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = processExcelData(e.target.result);
        setTabulator(data);
      };
      reader.readAsBinaryString(file);
    }
  };

  const processExcelData = (data) => {
    const workbook = XLSX.read(data, { type: "binary" });
    const sheetName = workbook.SheetNames[0]; 
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  };



  return (
    <div className="App">
      <div className='my-4'>
        <input
          type="file"
          id="fileInput"
          accept='.xls, .xlsx'
          className="hidden"
          onChange={handleFileUpload}
        />
        <label htmlFor="fileInput" className="custom-button">
          Load Excel File
        </label>
        <button onClick={handleShow} className='custom-button second'>Add New Data</button>
      </div>
      {tabulator && <LoadFile data={tabulator}  key={tabulator.map(item => item[0]).join('-')} />}


      <Modal show={show.create} onHide={handleClose}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <h5 className='text-center mb-4'>Create new data</h5>
          <Formik
            initialValues={{ len: '', status: '' }}
            validate={values => {
              const errors = {};
              if (!values.len && values.len != 0) {
                errors.len = 'Required';
              }
              else if (!/^[0-9]+(\.[0-9]+)?$/.test(values.len)) {
                errors.len = 'Only numeric values are allowed';
              } else if (parseFloat(values.len) <= 0) {
                errors.len = 'Must be greater than 0';
              }
              if (!values.status && values.status != 0) {
                errors.status = "Required"
              }
              else if (values.status != 1 && values.status != 0) {
                errors.status = "Status must be 0 or 1"
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              if (tabulator) {
                var maxId = findMaxId(tabulator)
                var newData=[++maxId,values.len,'',values.status]
                tabulator.push(newData);
                console.log(tabulator);
                setShow(prev=>{return{...prev,create:false}})
              }
              else {
                alert("First you should choose excel file")
              }
              setSubmitting(false);

            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
                <label htmlFor="len">Len</label>
                <input
                  type="text"
                  name="len"
                  id='len'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  className='form-control'
                />
                <span className='text-danger'>{errors.len && touched.len && errors.len}</span>
                <br />

                <label htmlFor="status" className='mt-3'>Status</label>
                <input
                  type="number"
                  name="status"
                  id='status'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  className='form-control'
                />
                <span className="text-danger">{errors.status && touched.status && errors.status}</span>
                <button className='btn btn-primary w-100 mt-3' type="submit" disabled={isSubmitting}>
                  Create
                </button>
              </form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
