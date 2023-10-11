import './App.css';
import LoadFile from "./components/LoadFile"
import { useRef, useState, useEffect } from 'react';
import * as XLSX from "xlsx";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Formik } from 'formik';
import drawChart from './components/Chart';
import {tabulatorInstanse} from "./components/LoadFile"



import "react-tabulator/lib/styles.css";
import "react-tabulator/css/bootstrap/tabulator_bootstrap.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import BarChartComp from './components/BarChart';
import MapComponent from './components/Map';


function App() {
  const [tabulator, setTabulator] = useState();

  const [show, setShow] = useState({
    create: false,
    etid: false,
    delete: false,
    analiz1: false,
    analiz2: false,
    map:false,
    refreshAnaliz2Data:false
  });

  const [element, setElement] = useState({
    editId: 0,
    deleteId: 0,
    mapId:0
  })

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

  useEffect(() => {


    const element2 = "#pie-chart"
    if (show.analiz1 == true) {
      var status0 = tabulatorInstanse.filter(x => x.status == 0).length
      var status1 = tabulatorInstanse.filter(x => x.status == 1).length
      var status2 = tabulatorInstanse.filter(x => x.status == 2).length

      var sumCount = status0 + status1 + status2

      var firstData = `${status0}(${((status0 / sumCount) * 100).toFixed(2)}%)`
      document.querySelector(".first-status").innerHTML = firstData
      var secondData = `${status1}(${((status1 / sumCount) * 100).toFixed(2)}%)`
      document.querySelector(".second-status").innerHTML = secondData
      var thirdData = `${status2}(${((status2 / sumCount) * 100).toFixed(2)}%)`
      document.querySelector(".third-status").innerHTML = thirdData

      const data = [
        { value: status0 },
        { value: status1 },
        { value: status2 },

      ]


      drawChart(element2, data)
    }
  }, [show.analiz1])

  useEffect(()=>{
    if (show.analiz2) {
      setShow(prev => { return { ...prev, refreshAnaliz2Data: true } })
    }
  },[show.analiz2])

  const handleClose = () => setShow(prev => { return { ...prev, create: false } });
  const handleShow = () => {
    if (tabulator) {
      setShow(prev => { return { ...prev, create: true } })
    }
    else {
      alert("First you should choose excel file")
    }
  };

  const handleEditClose = () => setShow(prev => { return { ...prev, etid: false } });
  const handleEditShow = () => setShow(prev => { return { ...prev, etid: true } })
  const handleDeleteClose = () => setShow(prev => { return { ...prev, delete: false } });
  const handleDeleteShow = () => setShow(prev => { return { ...prev, delete: true } })
  const handleAnaliz1Close = () => setShow(prev => { return { ...prev, analiz1: false } });
  const handleAnaliz1Show = () => {
    console.log(tabulatorInstanse);
    if (tabulator) {
      setShow(prev => { return { ...prev, analiz1: true } })
    }
    else {
      alert("First you should choose excel file")
    }
  }
  const handleAnaliz2Close = () => setShow(prev => { return { ...prev, analiz2: false } });
  const handleAnaliz2Show = () => {
    if (tabulator) {
      console.log(tabulatorInstanse);
      setShow(prev => { return { ...prev, analiz2: true } })
    }
    else {
      alert("First you should choose excel file")
    }
  }


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


  const handleEditClick = (id) => {
    setElement(prev => { return { ...prev, editId: id } })
    handleEditShow();
  }

  const handleDeleteClick = (id) => {
    setElement(prev => { return { ...prev, deleteId: id } })
    handleDeleteShow();
  }

  const handleMapClick = (id) => {
    setElement(prev => { return { ...prev, mapId: id } })
    setShow(prev => { return { ...prev, map: true } })
  }

  const[mapElement,setMapElement]=useState()
  useEffect(()=>{
    if (element.mapId) {
      var data=tabulator.find(x=>x[0]===element.mapId)
      setMapElement(data[2])
    }
  },[element.mapId])

  const [transformedData,setTransformedData]=useState();

  useEffect(()=>{
    if(tabulator){
     var transformed = tabulator.map((item, index) => {

        if (index === 0) return null;

        return {
            id: item[0],
            len: item[1],
            wkt: item[2],
            status: item[3],
        };
    }).filter(item => item !== null).sort((a, b) => b.id - a.id);
    }
    setTransformedData(transformed)
  },[tabulator])




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
      <div className='d-flex' style={{minHeight:"695px"}}>
        <div>
          {transformedData && <LoadFile data={transformedData} onMapClick={handleMapClick} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} key={transformedData && transformedData.length > 0 ? transformedData[0].id : 'defaultKey'} />}
        </div>
        <div>
          {show.map && <MapComponent element={mapElement} />}

        </div>
      </div>

      <div>
        <button onClick={handleAnaliz1Show} className='custom-button'>Analiz1</button>
        <button onClick={handleAnaliz2Show} className='custom-button ms-3'>Analiz2</button>
      </div>

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
              else if (values.status > 2 || values.status < 0) {
                errors.status = "Status must be 0,1 or 2"
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              if (tabulator) {
                var maxId = findMaxId(tabulator)
                var newData = [++maxId, values.len, '', values.status]
                var prevData=[...tabulator]
                prevData.push(newData);
                setTabulator(prevData);
                setShow(prev => { return { ...prev, create: false } })
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
        </Modal.Footer>
      </Modal>
      <Modal show={show.etid} onHide={handleEditClose}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <h5 className='text-center mb-4'>Edit data</h5>
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
              else if (values.status > 2 || values.status < 0) {
                errors.status = "Status must be 0,1 or 2"
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              var prevData=[...tabulator]
              prevData.find(x => x[0] === element.editId)[1] = values.len
              prevData.find(x => x[0] === element.editId)[3] = values.status
              setTabulator(prevData)
              handleEditClose()
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
                  Edit
                </button>
              </form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show.delete} onHide={handleDeleteClose}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <h5 className='text-center'>Delete data</h5>
          <p className='text-center mt-5'>Are you sure delete this data?</p>
          <div className='text-center'>
            <button onClick={() => {
              setTabulator(tabulator.filter(x => x[0] != element.deleteId))
              handleDeleteClose()
            }} className='btn btn-danger'>Yes</button>
            <button onClick={handleDeleteClose} className='btn btn-primary ms-3'>No</button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show.analiz1} onHide={handleAnaliz1Close}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <h5 className='text-center'>Analiz 1</h5>
          <div className='d-flex justify-content-center align-items-center mt-5'>
            <div className='box-status'>
              <div className='colors first-colors'></div>
              <p>Status 0</p>
              <span className='first-status'>20(20%)</span>
            </div>
            <div className='box-status ms-5'>
              <div className='colors second-colors'></div>
              <p>Status 1</p>
              <span className='second-status'>20(20%)</span>
            </div>
            <div className='box-status ms-5'>
              <div className='colors third-colors'></div>
              <p>Status 2</p>
              <span className='third-status'>20(20%)</span>
            </div>
          </div>
          <div id='pie-chart'></div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAnaliz1Close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show.analiz2} onHide={handleAnaliz2Close}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <h5 className='text-center'>Analiz 2</h5>
          {show.refreshAnaliz2Data && tabulatorInstanse && <BarChartComp barData={tabulatorInstanse || tabulator} key={tabulatorInstanse && tabulatorInstanse.length}  />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAnaliz2Close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>





    </div>
  );
}

export default App;
