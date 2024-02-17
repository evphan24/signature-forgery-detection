import './style.css'
import { useState, useRef } from 'react';
import { Link } from "react-router-dom";

const Home = () => {
    const [previewImage, setPreviewImage] = useState(null);
    const hiddenFileInput = useRef(null);

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

    return <>
        <main>
            <div className="incontainer">
                <div className = "body_gradient">
                <h1>Sign of the Times</h1>
                <h2>Detecting Forged Signatures with Machine Learning</h2>
                <p id='intro'>Intro</p>
                <video width="720" height="480" controls>
                    <source src="" type="video/mp4"></source>
                    Your browser does not support the video tag.
                </video>
                <a href="#jump" className="button" id="try">Try it out!</a>
                </div>

                <div id='jump'>
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
                        <button type = "button" className = "button">Validate</button>
                    </div>

                    <div id='right-div'>
                        <p>**Instructions**</p>
                        <label>
                            <input type = "checkbox" className = "checkboxes" /> <span>Model 1</span>
                        </label>
                        <label>
                            <input type = "checkbox" className = "checkboxes" /> <span>Model 2</span>
                        </label>
                        <label>
                            <input type = "checkbox" className = "checkboxes" /> <span>Select All</span>
                        </label>
                        <p className = "textmargin">For more information about the models, click <Link to = "/about">here.</Link></p>
                    </div>
                </div>
            </div>
        </main>
    </>
}
export default Home;