import React from "react";
import ReactDOM from "react-dom";
import { TabulatorFull as Tabulator } from "tabulator-tables"; //import Tabulator library
import "tabulator-tables/dist/css/tabulator.min.css"; //import Tabulator stylesheet

class LoadFile extends React.Component {




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
                { title: "Id", field: "id", headerFilter:"input" },
                { title: "Len", field: "len", hozAlign: "left", headerFilter: "input" },
                { title: "Wkt", field: "wkt", headerFilter: "input" },
                {
                    title: "Status",
                    field: "status",
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
                    }
                }

            ], 
        });
    }

    render() {
        return (<div ref={el => (this.el = el)} />);
    }
}

export default LoadFile;
