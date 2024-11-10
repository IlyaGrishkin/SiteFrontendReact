import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Offcanvas from 'react-bootstrap/Offcanvas';
import axios from 'axios'
import './BasicScreen.css';
import { questionsNumber, testDurationsObj, testDurations, topics } from '../Utils/constants';
import { Checkbox } from '@mui/material';





function BasicScreen() {

    if (!JSON.parse(localStorage.getItem("testTopic"))) {
        localStorage.setItem("testTopic", JSON.stringify(topics.TOPICS))
    }
    
    if (!JSON.parse(localStorage.getItem("testDurations"))) {
        localStorage.setItem("testDurations", JSON.stringify(Object.keys(testDurationsObj)))
    }


    const [topicList, setTopicList] = useState(JSON.parse(localStorage.getItem("testTopic")))
    const [tests, setTests] = useState({})
    const [testList, setTestList] = useState([])
    const [checked, setChecked] = useState(true);

    const [testDurations, setTestDurations] = useState(JSON.parse(localStorage.getItem("testDurations")))
    


    const apiUrl = `http://localhost:8000/api/v1/tests/`;

    function filteredTests(list){
        let res = []
        for (let i = 0; i < list.length; i++) {
            if (topicList.indexOf(list[i].subject) != -1) {
                res.push(list[i])
            }
        }
        return res
    }
          

    useEffect(() => {
        axios.get(apiUrl).then((resp) => {
            const serverData = resp.data;
            setTests(serverData)
            setTestList(filteredTests(serverData.data.items))
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

    function changeFilter(t) {
        let topics = JSON.parse(localStorage.getItem('testTopic')).slice()
        let ind = topics.indexOf(t)
        if (ind != -1) {
            topics.splice(ind, 1)
        }
        else {
            topics.push(t)
        }
        setTopicList(topics)
        localStorage.setItem("testTopic", JSON.stringify(topics))
    }
    
    function changeDurationFilter(t) {
        let durations = JSON.parse(localStorage.getItem('testDurations')).slice()
        let ind = durations.indexOf(t)
        if (ind != -1) {
            durations.splice(ind, 1)
        }
        else {
            durations.push(t)
        }
        setTestDurations(durations)
        localStorage.setItem("testDurations", JSON.stringify(durations))

    }

    function isDisplay(test){
        let flag = false
        let Durations = []
        for (let i = 0; i < testDurations.length; i++) {
            Durations.push(testDurationsObj[testDurations[i]])
        }
        for (let i = 0; i < Durations.length; i++) {
            if (Durations[i][0] <= test.work_time && test.work_time < Durations[i][1]) {
                flag = true
            }
        }
        return flag && topicList.indexOf(test.subject) != -1
    }

    console.log(testList)

    if (window.screen.width < 750) {
        return (
            <div className='screen-wrapper'>
                <div className='test-start'>


                    <div className='wrap'>
                        <div className='filter-info'>
                            <h2>Фильтр</h2>
                            <img width="20" height="20" src="https://img.icons8.com/fluency-systems-regular/50/horizontal-settings-mixer.png" alt="horizontal-settings-mixer" />
                        </div>

                        <div className='sidebar'>
                            <div className='filter-headers'>
                                <h4 className='h4-topic'>Тема</h4>
                                <h4 className='h4-duration'>Длительность</h4>
                                <h4 className='h4-number'>Количество  <br /> вопросов</h4>
                            </div>
                            <div className='checkboxes'>
                                <div className='topic-wrapper'>

                                    {topics.TOPICS.map(t => <div className='list-item-wrap'> <Checkbox className="checkbox" checked={topicList.indexOf(t) != -1} onChange={() => changeFilter(t)} inputProps={{ 'aria-label': 'controlled' }} /> <p className='theme'>{t}</p></div>)}

                                </div>
                                <div className='duration-wrapper'>

                                    <ul>
                                        {Object.keys(testDurationsObj).map(t => <li><Checkbox className="checkbox" checked={testDurations.indexOf(t) != -1} onChange={() => changeDurationFilter(t)} inputProps={{ 'aria-label': 'controlled' }} /> {t} </li>)}
                                    </ul>
                                </div>
                                <div className='number-wrapper'>

                                    <ul>
                                        {questionsNumber.map(n => <li><Checkbox className="checkbox" checked={checked} onChange={() => setChecked(!checked)} inputProps={{ 'aria-label': 'controlled' }} /> {n} </li>)}
                                    </ul>
                                </div>
                            </div>


                        </div>


                        <div className='card-container'>
                            {testList.map((test) =>  
                                <div>
                                    <Card className="card mx-2" style={{width: '18rem', display: isDisplay(test) ? 'block' : 'none'}} onClick={() => handleTestStart(test.id)}>
                                        <div>
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
                                        </div>
                                    </Card>
                                </div>
                          
                            )}

                        </div>
                    </div>



                </div>


            </div>
        )
    }
    return (
        <div className='screen-wrapper'>
            <div className='test-start'>


                <div className='wrap'>
                    <div className='sidebar'>
                        <div className='filter-info'>
                            <h2>Фильтр</h2>
                            <img width="30" height="30" src="https://img.icons8.com/fluency-systems-regular/50/horizontal-settings-mixer.png" alt="horizontal-settings-mixer" />
                        </div>

                        <div className='topic-wrapper'>
                            <h4>Тема</h4>
                            <ul>
                                {topics.TOPICS.map(t => <li><Checkbox className="checkbox" checked={topicList.indexOf(t) != -1} onChange={() => changeFilter(t)} inputProps={{ 'aria-label': 'controlled' }} /> {t} </li>)}
                            </ul>
                        </div>
                        <div className='duration-wrapper'>
                            <h4>Длительность</h4>
                            <ul>
                                {Object.keys(testDurationsObj).map(t => <li><Checkbox className="checkbox" checked={testDurations.indexOf(t) != -1} onChange={() => changeDurationFilter(t)} inputProps={{ 'aria-label': 'controlled' }} /> {t} </li>)}
                            </ul>
                        </div>
                        <div className='number-wrapper'>
                            <h4>Количество вопросов</h4>
                            <ul>
                                {questionsNumber.map(n => <li><Checkbox className="checkbox" checked={checked} onChange={() => setChecked(!checked)} inputProps={{ 'aria-label': 'controlled' }} /> {n} </li>)}
                            </ul>
                        </div>

                    </div>


                    <div className='card-container'>
                        {testList.map((test) =>
                            <div>
                                <Card className="card mx-2" style={{ width: '18rem', display: isDisplay(test) ? 'block' : 'none' }} onClick={() => handleTestStart(test.id)}>
                                    <div>
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
                                    </div>
                                </Card>
                            </div>
                        )}

                    </div>
                </div>



            </div>


        </div>
    )
}

export default BasicScreen;
