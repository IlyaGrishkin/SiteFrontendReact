import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Offcanvas from 'react-bootstrap/Offcanvas';
import axios from 'axios'
import './BasicScreen.css';
import { questionsNumber, testDurations, topics } from '../Utils/constants';
import { Checkbox } from '@mui/material';





function BasicScreen() {

    if (!JSON.parse(localStorage.getItem("testTopic"))) {
        localStorage.setItem("testTopic", JSON.stringify(topics.TOPICS))
    }

    const [topicList, setTopicList] = useState(JSON.parse(localStorage.getItem("testTopic")))
    const [buttonsClean, setButtonsClean] = useState(!topicList) //!topicList помощник нужен

    const [tests, setTests] = useState({})
    const [testList, setTestList] = useState([])
    const [checked, setChecked] = useState(true);




    const apiUrl = `http://localhost:8000/api/v1/tests/`;

    useEffect(() => {
        axios.get(apiUrl).then((resp) => {
            const serverData = resp.data;
            setTests(serverData)
            setTestList(serverData.data.items)
        })

    }, [])





    function handleTestStart(testID) {
        if (JSON.parse(localStorage.getItem("accessToken"))) {
            const apiUrl = `http://localhost:8000/api/v1/tests/create/new_attempt`;
            let config = {
                headers: {
                    Authorization: JSON.parse(localStorage.getItem("accessToken"))
                }
            }
            axios.post(apiUrl,
                {
                    test_id: testID
                },
                config
            )

                .then((resp) => {
                    const serverData = resp.data;
                    console.log(serverData);
                    //localStorage.setItem("timeStart", JSON.stringify(parseInt((new Date(serverData.data.created_at).getTime() / 1000).toFixed(0))))
                    localStorage.setItem("answers", JSON.stringify(serverData.data.user_answers))
                })
        }
    }


    useEffect(() => {
        function beforeUnload(e) {
            //localStorage.removeItem("testTopic")
        }

        window.addEventListener('beforeunload', beforeUnload);

        return () => {
            window.removeEventListener('beforeunload', beforeUnload);
        };
    }, []);



    return (
        <div className='screen-wrapper'>
            <div className='test-start'>
                <div className='test-start-info'>
                    <h1>Тесты</h1>
                </div>

                <div className='wrap'>
                    <div className='sidebar'>
                        <div className='filter-info'>
                            <h2>Фильтр</h2>
                            <img width="30" height="30" src="https://img.icons8.com/fluency-systems-regular/50/horizontal-settings-mixer.png" alt="horizontal-settings-mixer"/>
                        </div>
                        
                        <div className='topic-wrapper'>
                            <h4>Тема</h4>
                            <ul>
                                {topics.TOPICS.map(t => <li><Checkbox className="checkbox" checked={checked} onChange={() => setChecked(!checked)} inputProps={{ 'aria-label': 'controlled' }}/> {t} </li>)}
                            </ul>
                        </div>
                        <div className='duration-wrapper'>
                            <h4>Длительность</h4>
                            <ul>
                                {testDurations.map(t => <li><Checkbox className="checkbox" checked={checked} onChange={() => setChecked(!checked)} inputProps={{ 'aria-label': 'controlled' }}/> {t} </li>)}
                            </ul>
                        </div>
                        <div className='number-wrapper'>
                            <h4>Количество вопросов</h4>
                            <ul>
                                {questionsNumber.map(n => <li><Checkbox className="checkbox" checked={checked} onChange={() => setChecked(!checked)} inputProps={{ 'aria-label': 'controlled' }}/> {n} </li>)}
                            </ul>
                        </div>
                        
                    </div>

                    <div className='card-container'>
                        {testList.map((test) =>
                            <Card className="card" style={{ width: '18rem' }} onClick={() => handleTestStart(test.id)}>
                                <Card.Img variant="top" src="http://127.0.0.1:8080/1677481342_bronk-club-p-otkritki-tomas-kinkeid-instagram-25.jpg" />
                                <Card.Body>
                                    <Card.Title className='card-title'>{test.title}</Card.Title>
                                    <Card.Text>
                                        {test.description}
                                    </Card.Text>
                                    <Card.Text>
                                        <div className='timeInfo'>
                                            <p>Время: {test.work_time} мин</p>
                                            <video autoPlay muted loop className='timeVideo'>
                                                <source src="http://127.0.0.1:8080/wired-gradient-45-clock-time-hover-pinch.mp4" type="video/mp4" />
                                            </video>
                                        </div>

                                        <div className='questionsInfo'>
                                            <p>Количество вопросов: {test.question_count}</p>
                                            <video autoPlay muted loop className='timeVideo'>
                                                <source src="http://127.0.0.1:8080/wired-outline-35-edit-hover-circle.mp4" type="video/mp4" />
                                            </video>
                                        </div>


                                    </Card.Text>
                                </Card.Body>
                            </Card>

                        )}

                    </div>
                </div>



            </div>


        </div>
    )
}

export default BasicScreen;
