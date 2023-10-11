import React from "react";
import ReactDOM from "react-dom";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";


let tabulatorInstanse=null;



class LoadFile extends React.Component {



    handleEditClick = (id) => {
        if (this.props.onEditClick) {
            this.props.onEditClick(id);
        }
    }

    handleDeleteClick = (id) => {
        if (this.props.onDeleteClick) {
            this.props.onDeleteClick(id);
        }
    }
    handleMapClick = (id) => {
        if (this.props.onMapClick) {
            this.props.onMapClick(id);
        }
    }


    componentDidMount() {


        this.tabulator = new Tabulator(this.el, {
            data: this.props.data,
            reactiveData: true,
            movableColumns: true,
            pagination: "local",
            paginationSize: 10,

            columns: [
                { title: "Id", field: "id", headerFilter: "input", width: 150, hozAlign: "center" },
                { title: "Len", field: "len", hozAlign: "left", headerFilter: "input", width: 150 },
                { title: "Wkt", field: "wkt", headerFilter: "input", width: 150 },
                {
                    title: "Status",
                    field: "status",
                    width: 150,
                    hozAlign: "center",
                    headerFilter: "input"
                },
                {
                    formatter: (cell, formatterParams) => {
                        const rowData = cell.getRow().getData();
                        return '<button class="edit-btn btn btn-warning" id="' + rowData.id + '">Edit</button>';
                    },
                    hozAlign: "center",
                    cellClick: (e, cell) => {
                        const id = cell.getData().id;
                        this.handleEditClick(id);
                    }
                },
                {
                    formatter: (cell, formatterParams) => {
                        const rowData = cell.getRow().getData();
                        return '<button class="btn btn-danger btn-delete" id="' + rowData.id + '">Delete</button>';
                    },
                    hozAlign: "center",
                    cellClick: (e, cell) => {
                        const id = cell.getData().id;
                        this.handleDeleteClick(id);
                    }
                },
                {
                    formatter: (cell, formatterParams) => {
                        const rowData = cell.getRow().getData();
                        return '<button class="btn btn-primary btn-delete" id="' + rowData.id + '">Map</button>';
                    },
                    hozAlign: "center",
                    cellClick: (e, cell) => {
                        const id = cell.getData().id;
                        this.handleMapClick(id);
                    }
                }

            ],
        });
        tabulatorInstanse=this.tabulator.getData("active")
    }
    componentDidUpdate(prevProps) {

        if (this.props.data !== prevProps.data) {
            this.tabulator = new Tabulator(this.el, {
                data: this.props.data,
                reactiveData: true,
                movableColumns: true,
                pagination: "local",
                paginationSize: 10,
    
                columns: [
                    { title: "Id", field: "id", headerFilter: "input", width: 150, hozAlign: "center" },
                    { title: "Len", field: "len", hozAlign: "left", headerFilter: "input", width: 150 },
                    { title: "Wkt", field: "wkt", headerFilter: "input", width: 150 },
                    {
                        title: "Status",
                        field: "status",
                        width: 150,
                        hozAlign: "center",
                        headerFilter: "input"
                    },
                    {
                        formatter: (cell, formatterParams) => {
                            const rowData = cell.getRow().getData();
                            return '<button class="edit-btn btn btn-warning" id="' + rowData.id + '">Edit</button>';
                        },
                        hozAlign: "center",
                        cellClick: (e, cell) => {
                            const id = cell.getData().id;
                            this.handleEditClick(id);
                        }
                    },
                    {
                        formatter: (cell, formatterParams) => {
                            const rowData = cell.getRow().getData();
                            return '<button class="btn btn-danger btn-delete" id="' + rowData.id + '">Delete</button>';
                        },
                        hozAlign: "center",
                        cellClick: (e, cell) => {
                            const id = cell.getData().id;
                            this.handleDeleteClick(id);
                        }
                    },
                    {
                        formatter: (cell, formatterParams) => {
                            const rowData = cell.getRow().getData();
                            return '<button class="btn btn-primary btn-delete" id="' + rowData.id + '">Map</button>';
                        },
                        hozAlign: "center",
                        cellClick: (e, cell) => {
                            const id = cell.getData().id;
                            this.handleMapClick(id);
                        }
                    }
    
                ],
            });
        }
        tabulatorInstanse=this.tabulator.getData("active")
    }




    render() {
        return (<>
            <div ref={el => (this.el = el)} />
           
        </>);
    }
    
}

export { tabulatorInstanse }; 
export default LoadFile;
