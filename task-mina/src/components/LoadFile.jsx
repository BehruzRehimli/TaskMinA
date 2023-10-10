import React from "react";
import ReactDOM from "react-dom";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";

class LoadFile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            transformedData: [],
        };
    }



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

        const transformedData = this.props.data.map((item, index) => {

            if (index === 0) return null;

            return {
                id: item[0],
                len: item[1],
                wkt: item[2],
                status: item[3],
            };
        }).filter(item => item !== null).sort((a, b) => b.id - a.id);


        this.tabulator = new Tabulator(this.el, {
            data: transformedData,
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
        // this.tabulator.getElement().addEventListener("column-filter", (e, args) => {
        //     const filteredData = args.table.getData();
        //     console.log("Filtrelenmiş Veriler:", filteredData);
        // });
        
    }




    render() {
        return (<>
        <div ref={el => (this.el = el)} />
        </>);
    }
}

export default LoadFile;
