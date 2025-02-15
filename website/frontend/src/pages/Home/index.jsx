import './style.css'
import Checkbox from "./Checkbox";
import { Models } from "./models";
import { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";

const Home = () => {

    async function query(data) {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/gpt2",
            {
                headers: { Authorization: `Bearer ${'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'}` },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        const result = await response.json();
        return result;
    }
    query("Can you please let us know more details about your ").then((response) => {
        console.log(JSON.stringify(response));
    });

    const [tableData, setTableData] = useState([]); 
    
    const [columns, setColumns] = useState([
        {key: 'image', label: 'Image', visible: true},
        {key: 'state1', label: 'Model 1', visible: false},
        {key: 'state2', label: 'Model 2',visible: false}
    ]);
    
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([]);
    const [list, setList] = useState([]);
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    const [previewImage, setPreviewImage] = useState(null);
    const hiddenFileInput = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        setList(Models);
    }, [list]);

    const handleSelectAll = e => {
        const isChecked = e.target.checked;
        setIsCheckAll(isChecked);
        setIsCheck(isChecked ? list.map(li => li.id) : []);

        setColumns(prevColumns => {
            return prevColumns.map((column, index) => {
                if (index === 0) return column; 
                return { ...column, visible: isChecked };
            });
        });
    };

    const handleClick = (e) => {
        const { id, checked } = e.target;
    
        setIsCheck((prevCheck) => {
            if (checked) {
                return [...prevCheck, id];
            } else {
                return prevCheck.filter((item) => item !== id);
            }
        });
    
        // Update column visibility based on the checkbox being clicked
        setColumns((prevColumns) => {
            return prevColumns.map((column) => {
                if (column.key === id) {
                    // Set the visibility of the clicked column based on the checkbox state
                    return { ...column, visible: checked };
                } else {
                    // Maintain the visibility of other columns
                    return column;
                }
            });
        });
    };

    const options = list.map(({id, name}) => {
        return (
            <div key = {id} className='checkbox-container'>
                <Checkbox
                key = {id}
                type = "checkbox"
                name = {name}
                id = {id}
                handleClick = {handleClick}
                isChecked = {isCheck.includes(id)}
            />
            <label htmlFor={id}>{name}</label>
            </div>
        );
    });

    const handleDragOver = (event) => {
        event.preventDefault();
    }
  
    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    }

    const openFileInput = () => {
        hiddenFileInput.current.click()
    }

    const handleClickScroll = () => {
        scrollRef.current?.scrollIntoView({behavior: 'smooth'});
    }

    const handleValidate = async () => {
        setIsButtonClicked(true);
        const queryData = await query("Can you please let us know more details about your ");
        const queryData2 = await query("Hey there");
        const newRow = {id: tableData.length+1, image: 'newImage', state1: JSON.stringify(queryData2), state2: JSON.stringify(queryData), visible:true};
        setTableData(prevData => [...prevData, newRow]);

        list.forEach(model => handleClick({ target: { id: model.id, checked: true } }));
    };

    return <>
        <main>
            <div className="incontainer">
                <div className = "body_gradient">
                <h1>Sign of the Times</h1>
                <h2 id='title'>Detecting Forged Signatures with Machine Learning</h2>
                <p id='intro'>Intro</p>
                <video width="720" height="480" controls>
                    <source src="" type="video/mp4"></source>
                    Your browser does not support the video tag.
                </video>
                <button type = "button" className="button" id="try" onClick={handleClickScroll}>Try it out!</button>
                </div>
                <div id='jump' ref={scrollRef}>
                    <div id='left-div'>
                        <div
                            id='preview-container'
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={openFileInput}>
                            {previewImage ? 
                            (
                                <img src={previewImage} id='preview' alt='Preview'></img>
                            ) :
                            (
                                <>
                                    <div id='dragndrop-container'>
                                        <img src='drag-and-drop-icon.png' alt='Drag and drop' id='dragndrop-image'></img>
                                    </div>
                                    <p id='dragndrop'>Drag & Drop or Browse</p>
                                </>
                            )}
                            <input 
                                type='file' 
                                style={{display: 'none'}}
                                onChange={handleFileChange}
                                ref={hiddenFileInput}></input>
                        </div>
                        <button type = "button" class = "button">Validate</button>
                    </div>
                    <div id='right-div'>
                        <p>**Instructions**</p>
                        <div id='checkboxes-container'>
                            <div className='checkbox-container'>
                                <Checkbox 
                                type = "checkbox"
                                name = "selectAll"
                                id = "selectAll"
                                handleClick = {handleSelectAll}
                                isChecked = {isCheckAll}
                                />
                                Select All
                            </div>
                            {options}
                            {isButtonClicked && (
                            <table>
                                <thead>
                                    <tr>
                                        {columns.filter(column => column.visible).map(column => (
                                            <th key={column.key}>{column.label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Map through table data and render rows dynamically */}
                                    {tableData.map(row => (
                                        <tr key={row.id}>
                                            {columns
                                                .filter(column => column.visible)
                                                .map(column => (
                                                    <td key={column.key}>{row[column.key]}</td>
                                                ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            )}
                        </div>
                        <p className = "textmargin">For more information about the models, click <Link to = "/about">here.</Link></p>
                    </div>
                </div>
            </div>
        </main>
    </>
}
export default Home;